import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Article, AudioQueueItem, PlaybackState } from '../types';
import {
  getAudioQueueFromDB,
  addToAudioQueueInDB,
  removeFromAudioQueueInDB,
  savePlaybackProgressInDB,
  getPlaybackProgressFromDB,
} from '../lib/db';
import { generateId } from '../lib/utils';

interface AudioContextValue {
  currentArticle: Article | null;
  playbackState: PlaybackState;
  activeParagraphIndex: number;
  activeSentence: string;
  activeSentenceIndex: number;
  currentTime: number;
  duration: number;
  playbackRate: number;
  volume: number;
  isMuted: boolean;
  queue: AudioQueueItem[];
  availableVoices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  playArticle: (article: Article, startParagraphIndex?: number) => void;
  togglePlayPause: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  skip: (seconds: number) => void;
  seekToParagraph: (paragraphIndex: number) => void;
  setPlaybackRate: (rate: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setSelectedVoice: (voice: SpeechSynthesisVoice) => void;
  addToQueue: (article: Article) => Promise<void>;
  removeFromQueue: (itemId: string) => Promise<void>;
  playNextInQueue: () => void;
}

const AudioContext = createContext<AudioContextValue | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle');
  const [activeParagraphIndex, setActiveParagraphIndex] = useState<number>(0);
  const [activeSentence, setActiveSentence] = useState<string>('');
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playbackRate, setRate] = useState<number>(1.0);
  const [volume, setVol] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [queue, setQueue] = useState<AudioQueueItem[]>([]);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timerIntervalRef = useRef<any>(null);
  const currentParagraphIndexRef = useRef<number>(0);
  const currentArticleRef = useRef<Article | null>(null);
  const rateRef = useRef<number>(1.0);
  const volumeRef = useRef<number>(1.0);
  const previousVolumeRef = useRef<number>(1.0);
  const isMutedRef = useRef<boolean>(false);

  // Sync refs with state
  currentArticleRef.current = currentArticle;
  rateRef.current = playbackRate;
  volumeRef.current = volume;
  isMutedRef.current = isMuted;

  // Initialize SpeechSynthesis and load offline queue from IndexedDB
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;

      const updateVoices = () => {
        const voices = synthRef.current?.getVoices() || [];
        setAvailableVoices(voices);

        // Prefer warm, natural editorial voices (e.g. Google, Natural, Neural, UK English)
        const editorialVoice =
          voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Neural') || v.name.includes('Google UK') || v.name.includes('Daniel') || v.name.includes('Serena'))) ||
          voices.find((v) => v.lang.startsWith('en')) ||
          voices[0];

        if (editorialVoice) setSelectedVoice(editorialVoice);
      };

      updateVoices();
      if (synthRef.current?.onvoiceschanged !== undefined) {
        synthRef.current.onvoiceschanged = updateVoices;
      }
    }

    // Load persistent offline audio queue
    getAudioQueueFromDB()
      .then(setQueue)
      .catch((err) => console.warn('[AudioContext] Could not load offline audio queue:', err));

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (synthRef.current) synthRef.current.cancel();
    };
  }, []);

  // Periodic persistence of playback progress to IndexedDB
  useEffect(() => {
    if (!currentArticle || playbackState === 'idle') return;

    const interval = setInterval(() => {
      if (currentTime > 0 && duration > 0) {
        savePlaybackProgressInDB(currentArticle.id, currentTime, duration).catch(() => {});
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [currentArticle, currentTime, duration, playbackState]);

  // Plays a specific paragraph in sequence
  const speakParagraph = useCallback(
    (paragraphs: string[], index: number, overrideRate?: number, overrideVol?: number) => {
      if (!synthRef.current) return;

      if (index >= paragraphs.length) {
        setPlaybackState('ended');
        setActiveSentence('');
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        playNextInQueue();
        return;
      }

      currentParagraphIndexRef.current = index;
      setActiveParagraphIndex(index);

      const paragraphText = paragraphs[index].trim();
      if (!paragraphText) {
        // Skip empty paragraphs
        if (index + 1 < paragraphs.length) {
          speakParagraph(paragraphs, index + 1, overrideRate, overrideVol);
        } else {
          setPlaybackState('ended');
        }
        return;
      }

      // Cancel any ongoing utterance before starting a new one
      synthRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(paragraphText);
      utteranceRef.current = utterance;

      if (selectedVoice) utterance.voice = selectedVoice;
      utterance.rate = overrideRate !== undefined ? overrideRate : rateRef.current;
      utterance.volume = overrideVol !== undefined ? overrideVol : (isMutedRef.current ? 0 : volumeRef.current);

      // Split into sentences for fine-grained highlighting
      const sentences = paragraphText.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) || [paragraphText];
      setActiveSentence(sentences[0]?.trim() || paragraphText);
      setActiveSentenceIndex(0);

      // Real-time boundary tracking for sentence & word synchronization
      utterance.onboundary = (event) => {
        if (event.name === 'sentence' || event.name === 'word') {
          const charIndex = event.charIndex;
          let accumulatedLength = 0;
          for (let i = 0; i < sentences.length; i++) {
            accumulatedLength += sentences[i].length;
            if (charIndex < accumulatedLength) {
              setActiveSentence(sentences[i].trim());
              setActiveSentenceIndex(i);
              break;
            }
          }
        }
      };

      utterance.onend = () => {
        // Automatically speak next paragraph
        if (currentParagraphIndexRef.current + 1 < paragraphs.length) {
          speakParagraph(paragraphs, currentParagraphIndexRef.current + 1);
        } else {
          setPlaybackState('ended');
          playNextInQueue();
        }
      };

      utterance.onerror = (err) => {
        // 'interrupted' or 'canceled' are standard when user skips or pauses
        if (err.error !== 'interrupted' && err.error !== 'canceled') {
          console.warn('[AudioContext] Utterance error:', err);
        }
      };

      synthRef.current.speak(utterance);
    },
    [selectedVoice]
  );

  const playArticle = useCallback(
    async (article: Article, startParagraphIndex = 0) => {
      if (!synthRef.current) {
        alert('Web Speech API is not supported in this browser.');
        return;
      }

      // Stop existing speech
      synthRef.current.cancel();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

      setCurrentArticle(article);
      setPlaybackState('playing');

      const paragraphsToSpeak =
        article.paragraphs && article.paragraphs.length > 0
          ? article.paragraphs
          : [article.title, article.excerpt];

      // Estimate duration based on total words & rate
      const totalWords = paragraphsToSpeak.join(' ').split(/\s+/).length;
      const effectiveRate = rateRef.current || 1.0;
      const estimatedDurationSeconds = Math.max(20, Math.round((totalWords / (145 * effectiveRate)) * 60));
      setDuration(estimatedDurationSeconds);

      // Check saved progress in IndexedDB
      const savedPosition = await getPlaybackProgressFromDB(article.id);
      if (savedPosition && startParagraphIndex === 0) {
        setCurrentTime(savedPosition);
      } else {
        setCurrentTime(0);
      }

      // Start tick timer
      timerIntervalRef.current = setInterval(() => {
        setCurrentTime((prev) => Math.min(prev + 1, estimatedDurationSeconds));
      }, 1000);

      speakParagraph(paragraphsToSpeak, startParagraphIndex);
    },
    [speakParagraph]
  );

  const pause = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.pause();
      setPlaybackState('paused');
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
  }, []);

  const resume = useCallback(() => {
    if (!synthRef.current) return;

    if (synthRef.current.paused) {
      synthRef.current.resume();
      setPlaybackState('playing');

      // Edge/Chrome watchdog: verify resume actually unfroze speech
      setTimeout(() => {
        if (synthRef.current && !synthRef.current.speaking && currentArticleRef.current) {
          const paras = currentArticleRef.current.paragraphs.length > 0
            ? currentArticleRef.current.paragraphs
            : [currentArticleRef.current.title, currentArticleRef.current.excerpt];
          speakParagraph(paras, currentParagraphIndexRef.current);
        }
      }, 200);

      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = setInterval(() => {
        setCurrentTime((prev) => Math.min(prev + 1, duration));
      }, 1000);
    } else if (currentArticleRef.current) {
      const paras = currentArticleRef.current.paragraphs.length > 0
        ? currentArticleRef.current.paragraphs
        : [currentArticleRef.current.title, currentArticleRef.current.excerpt];
      speakParagraph(paras, currentParagraphIndexRef.current);
      setPlaybackState('playing');
    }
  }, [duration, speakParagraph]);

  const togglePlayPause = useCallback(() => {
    if (playbackState === 'playing') {
      pause();
    } else {
      resume();
    }
  }, [playbackState, pause, resume]);

  const stop = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setPlaybackState('idle');
    setActiveSentence('');
    setCurrentTime(0);
  }, []);

  const skip = useCallback(
    (secondsDelta: number) => {
      if (!currentArticleRef.current) return;
      const paragraphs = currentArticleRef.current.paragraphs;
      if (!paragraphs || paragraphs.length === 0) return;

      const paragraphDelta = Math.sign(secondsDelta) * Math.max(1, Math.round(Math.abs(secondsDelta) / 16));
      const targetIndex = Math.max(0, Math.min(currentParagraphIndexRef.current + paragraphDelta, paragraphs.length - 1));

      setCurrentTime((prev) => Math.max(0, Math.min(prev + secondsDelta, duration)));
      speakParagraph(paragraphs, targetIndex);
    },
    [duration, speakParagraph]
  );

  const seekToParagraph = useCallback(
    (paragraphIndex: number) => {
      if (!currentArticleRef.current) return;
      const paragraphs = currentArticleRef.current.paragraphs;
      speakParagraph(paragraphs, paragraphIndex);
      setPlaybackState('playing');
    },
    [speakParagraph]
  );

  const setPlaybackRate = useCallback((rate: number) => {
    setRate(rate);
    rateRef.current = rate;

    // In Web Speech API, dynamically restart in-flight utterance with new rate seamlessly
    if (currentArticleRef.current && synthRef.current && (synthRef.current.speaking || playbackState === 'playing')) {
      const paras = currentArticleRef.current.paragraphs.length > 0
        ? currentArticleRef.current.paragraphs
        : [currentArticleRef.current.title, currentArticleRef.current.excerpt];
      speakParagraph(paras, currentParagraphIndexRef.current, rate);
    }
  }, [playbackState, speakParagraph]);

  const setVolume = useCallback((vol: number) => {
    setVol(vol);
    volumeRef.current = vol;
    if (vol > 0) {
      previousVolumeRef.current = vol;
      setIsMuted(false);
      isMutedRef.current = false;
    } else {
      setIsMuted(true);
      isMutedRef.current = true;
    }
    if (currentArticleRef.current && synthRef.current && (synthRef.current.speaking || playbackState === 'playing')) {
      const paras = currentArticleRef.current.paragraphs.length > 0
        ? currentArticleRef.current.paragraphs
        : [currentArticleRef.current.title, currentArticleRef.current.excerpt];
      speakParagraph(paras, currentParagraphIndexRef.current, undefined, vol);
    }
  }, [playbackState, speakParagraph]);

  const toggleMute = useCallback(() => {
    if (isMutedRef.current) {
      // Unmute: restore previous non-zero volume
      const restoredVol = previousVolumeRef.current > 0 ? previousVolumeRef.current : 1.0;
      setIsMuted(false);
      isMutedRef.current = false;
      setVol(restoredVol);
      volumeRef.current = restoredVol;
      if (currentArticleRef.current && synthRef.current && (synthRef.current.speaking || playbackState === 'playing')) {
        const paras = currentArticleRef.current.paragraphs.length > 0
          ? currentArticleRef.current.paragraphs
          : [currentArticleRef.current.title, currentArticleRef.current.excerpt];
        speakParagraph(paras, currentParagraphIndexRef.current, undefined, restoredVol);
      }
    } else {
      // Mute: save current volume and set to 0
      previousVolumeRef.current = volumeRef.current > 0 ? volumeRef.current : 1.0;
      setIsMuted(true);
      isMutedRef.current = true;
      setVol(0);
      volumeRef.current = 0;
      if (currentArticleRef.current && synthRef.current && (synthRef.current.speaking || playbackState === 'playing')) {
        const paras = currentArticleRef.current.paragraphs.length > 0
          ? currentArticleRef.current.paragraphs
          : [currentArticleRef.current.title, currentArticleRef.current.excerpt];
        speakParagraph(paras, currentParagraphIndexRef.current, undefined, 0);
      }
    }
  }, [playbackState, speakParagraph]);

  const addToQueue = async (article: Article) => {
    const queueItem: AudioQueueItem = {
      id: generateId('queue'),
      articleId: article.id,
      title: article.title,
      feedTitle: article.feedTitle,
      excerpt: article.excerpt,
      estimatedReadMinutes: article.estimatedReadMinutes,
      currentPositionSeconds: 0,
      dateAdded: new Date().toISOString(),
    };

    setQueue((prev) => [...prev, queueItem]);
    await addToAudioQueueInDB(queueItem);
  };

  const removeFromQueue = async (itemId: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== itemId));
    await removeFromAudioQueueInDB(itemId);
  };

  const playNextInQueue = useCallback(() => {
    if (queue.length === 0) return;
    const [nextItem, ...remaining] = queue;
    setQueue(remaining);
    removeFromAudioQueueInDB(nextItem.id);
  }, [queue]);

  return (
    <AudioContext.Provider
      value={{
        currentArticle,
        playbackState,
        activeParagraphIndex,
        activeSentence,
        activeSentenceIndex,
        currentTime,
        duration,
        playbackRate,
        volume,
        isMuted,
        queue,
        availableVoices,
        selectedVoice,
        playArticle,
        togglePlayPause,
        pause,
        resume,
        stop,
        skip,
        seekToParagraph,
        setPlaybackRate,
        setVolume,
        toggleMute,
        setSelectedVoice,
        addToQueue,
        removeFromQueue,
        playNextInQueue,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
