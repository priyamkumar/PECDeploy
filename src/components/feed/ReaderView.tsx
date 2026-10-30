import React, { useState, useEffect, useRef } from 'react';
import { useFeeds } from '../../context/FeedContext';
import { useAudio } from '../../context/AudioContext';
import { timeAgo } from '../../lib/utils';
import {
  X,
  Play,
  Pause,
  Bookmark,
  ExternalLink,
  Clock,
  User,
  ShieldCheck,
  Plus,
  ArrowLeft,
  Volume2,
  CloudRain,
  Columns,
  Minus,
  Highlighter,
  Disc3,
} from 'lucide-react';
import { playTactileClick, playChimeSuccess, ambientSoundscape } from '../../lib/sound-effects';
import { useReactiveAudioVisualizer } from '../../hooks/useReactiveAudioVisualizer';
import { MP3Visualizer } from '../audio/MP3Visualizer';
import { getEditorialImageForArticle } from '../../lib/editorial-images';

export interface ReaderViewProps {
  onBack?: () => void;
}

export const ReaderView: React.FC<ReaderViewProps> = ({ onBack }) => {
  const { readingArticle, setReadingArticle, toggleBookmark, markAsRead } = useFeeds();
  const {
    currentArticle,
    playbackState,
    activeParagraphIndex,
    activeSentence,
    playArticle,
    togglePlayPause,
    seekToParagraph,
    addToQueue,
    playbackRate,
    setPlaybackRate,
  } = useAudio();

  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [isSerif, setIsSerif] = useState<boolean>(true);
  const [isDualColumn, setIsDualColumn] = useState<boolean>(false);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState<boolean>(false);
  const [highlightedIndices, setHighlightedIndices] = useState<Set<number>>(new Set());
  const activeParagraphRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    if (readingArticle) {
      markAsRead(readingArticle.id);
    }
  }, [readingArticle?.id]);

  // Clean up ambient soundscape when closing reader
  useEffect(() => {
    return () => {
      ambientSoundscape.stop();
    };
  }, []);

  // Auto-scroll to active paragraph during narration
  useEffect(() => {
    if (
      currentArticle?.id === readingArticle?.id &&
      playbackState === 'playing' &&
      activeParagraphRef.current
    ) {
      activeParagraphRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeParagraphIndex, currentArticle?.id, readingArticle?.id, playbackState]);

  if (!readingArticle) return null;

  const isCurrentAudio = currentArticle?.id === readingArticle.id;
  const isAudioPlaying = isCurrentAudio && playbackState === 'playing';
  const visualizerData = useReactiveAudioVisualizer(isAudioPlaying, playbackRate, activeSentence);
  const editorialImg = getEditorialImageForArticle(readingArticle);

  const fontClasses = {
    sm: 'text-sm sm:text-base leading-[1.8]',
    base: 'text-base sm:text-lg leading-[1.85]',
    lg: 'text-lg sm:text-xl leading-[1.9]',
    xl: 'text-xl sm:text-2xl leading-[1.95]',
  };

  const handleClose = () => {
    playTactileClick();
    ambientSoundscape.stop();
    setReadingArticle(null);
    if (onBack) onBack();
  };

  const toggleAmbientSound = () => {
    playTactileClick();
    if (isAmbientPlaying) {
      ambientSoundscape.stop();
      setIsAmbientPlaying(false);
    } else {
      ambientSoundscape.startRain();
      setIsAmbientPlaying(true);
    }
  };

  const cycleFontSize = (direction: 'up' | 'down') => {
    playTactileClick();
    const sizes: ('sm' | 'base' | 'lg' | 'xl')[] = ['sm', 'base', 'lg', 'xl'];
    const currentIndex = sizes.indexOf(fontSize);
    if (direction === 'up' && currentIndex < sizes.length - 1) {
      setFontSize(sizes[currentIndex + 1]);
    } else if (direction === 'down' && currentIndex > 0) {
      setFontSize(sizes[currentIndex - 1]);
    }
  };

  const toggleHighlight = (index: number) => {
    playTactileClick();
    setHighlightedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto w-full overflow-x-hidden bg-[#F4F1EA] dark:bg-[#0B0C0E] text-[#0A0A0A] dark:text-[#F5F5F0] flex flex-col justify-between transition-colors duration-250">
      {/* Sticky Top Broadsheet Action Bar */}
      <header className="sticky top-0 z-30 w-full border-b border-[#D5CFBE] dark:border-[#2A2E35] bg-[#F4F1EA]/95 dark:bg-[#0B0C0E]/95 backdrop-blur-xl px-4 sm:px-8 py-3 flex items-center justify-between transition-colors">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleClose}
            className="btn-press-3d flex items-center gap-1.5 text-xs font-mono font-medium tabular-nums text-[#0A0A0A] dark:text-[#F5F5F0] px-3 py-1.5 rounded-xl bg-white dark:bg-[#141619] border border-[#D5CFBE] dark:border-[#2A2E35] border-b-[3px] border-b-[#B4ACA0] dark:border-b-black transition-colors min-h-[38px]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Dispatch Timeline</span>
          </button>

          <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ECE8DF] dark:bg-[#141619] border border-[#D5CFBE] dark:border-[#2A2E35] text-[11px] font-kicker text-[#B45309] dark:text-[#E6AF2E] uppercase tracking-[0.12em] font-semibold">
            {readingArticle.feedTitle}
          </span>

          {/* Procedural Ambient Soundscape Toggle */}
          <button
            onClick={toggleAmbientSound}
            className={`btn-press-3d hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-b-[3px] text-xs font-mono font-medium tabular-nums transition-all min-h-[38px] ${
              isAmbientPlaying
                ? 'bg-[#E6AF2E]/20 text-[#B45309] dark:text-[#E6AF2E] border-[#B45309]/40 dark:border-[#E6AF2E]/40 border-b-[#B45309] dark:border-b-[#E6AF2E]'
                : 'bg-white dark:bg-[#141619] text-[#4A4A4A] dark:text-[#C8CCC5] border-[#D5CFBE] dark:border-[#2A2E35] border-b-[#B4ACA0] dark:border-b-black'
            }`}
            title="Toggle procedural library rain atmosphere (Web Audio)"
          >
            <CloudRain className={`h-3.5 w-3.5 ${isAmbientPlaying ? 'animate-bounce text-[#B45309] dark:text-[#E6AF2E]' : ''}`} />
            <span>{isAmbientPlaying ? 'Ambience: On' : 'Rain Ambience'}</span>
          </button>
        </div>

        {/* Reader Customization & Audio Actions */}
        <div className="flex items-center gap-2">
          {/* Dual / Single Column View Toggle */}
          <button
            onClick={() => {
              playTactileClick();
              setIsDualColumn(!isDualColumn);
            }}
            className={`btn-press-3d hidden md:flex items-center gap-1 p-2 rounded-xl text-xs font-mono border border-b-[3px] min-h-[38px] ${
              isDualColumn
                ? 'bg-[#ECE8DF] dark:bg-[#1D2025] text-[#B45309] dark:text-[#E6AF2E] border-[#B45309]/40 dark:border-[#E6AF2E]/40'
                : 'bg-white dark:bg-[#141619] text-[#0A0A0A] dark:text-[#F5F5F0] border border-[#D5CFBE] dark:border-[#2A2E35] border-b-[#B4ACA0] dark:border-b-black'
            }`}
            title="Toggle dual broadsheet column layout"
          >
            <Columns className="h-4 w-4" />
          </button>

          {/* Font Resizing Controls */}
          <div className="flex items-center bg-white dark:bg-[#141619] rounded-xl border border-[#D5CFBE] dark:border-[#2A2E35] border-b-[3px] border-b-[#B4ACA0] dark:border-b-black p-0.5">
            <button
              onClick={() => cycleFontSize('down')}
              className="p-1.5 text-[#4A4A4A] dark:text-[#9EA3A0] hover:text-[#0A0A0A] dark:hover:text-[#F5F5F0]"
              title="Decrease font size"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="text-[10px] font-mono font-bold tabular-nums px-1 uppercase text-[#B45309] dark:text-[#E6AF2E]">
              {fontSize}
            </span>
            <button
              onClick={() => cycleFontSize('up')}
              className="p-1.5 text-[#4A4A4A] dark:text-[#9EA3A0] hover:text-[#0A0A0A] dark:hover:text-[#F5F5F0]"
              title="Increase font size"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          {/* Audio TTS Listen Action Button */}
          <button
            onClick={() => {
              playTactileClick();
              if (isCurrentAudio) {
                togglePlayPause();
              } else {
                playArticle(readingArticle);
              }
            }}
            className={`btn-press-3d inline-flex items-center gap-2 px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-mono font-medium tabular-nums uppercase tracking-wider transition-all min-h-[38px] ${
              isAudioPlaying
                ? 'bg-[#047857] dark:bg-[#38D489] text-white dark:text-[#0B0C0E] border-b-[3px] border-[#02402e] dark:border-[#21a364] shadow-md'
                : 'bg-[#0A0A0A] dark:bg-[#E6AF2E] text-white dark:text-[#0B0C0E] border-b-[3px] border-black/70 dark:border-[#C5911B] shadow-md hover:bg-[#262626] dark:hover:bg-[#F3C760]'
            }`}
          >
            {isAudioPlaying ? (
              <>
                <Pause className="h-3.5 w-3.5 fill-current" />
                <span className="hidden sm:inline">Pause Voice</span>
                <span className="sm:hidden">Pause</span>
              </>
            ) : (
              <>
                <Volume2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Read Aloud</span>
                <span className="sm:hidden">Listen</span>
              </>
            )}
          </button>

          {/* Add to Queue */}
          <button
            onClick={() => {
              playChimeSuccess();
              addToQueue(readingArticle);
            }}
            title="Queue for continuous broadsheet playback"
            className="btn-press-3d p-2 text-[#0A0A0A] dark:text-[#F5F5F0] rounded-xl bg-white dark:bg-[#141619] border border-[#D5CFBE] dark:border-[#2A2E35] border-b-[3px] border-b-[#B4ACA0] dark:border-b-black transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center"
          >
            <Plus className="h-4 w-4" />
          </button>

          {/* Bookmark Toggle */}
          <button
            onClick={() => {
              playChimeSuccess();
              toggleBookmark(readingArticle.id);
            }}
            aria-label="Bookmark dispatch"
            className={`btn-press-3d p-2 rounded-xl border border-b-[3px] transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center ${
              readingArticle.isBookmarked
                ? 'text-[#B45309] dark:text-[#E6AF2E] bg-[#E6AF2E]/15 border-[#B45309]/40 dark:border-[#E6AF2E]/40 border-b-[#B45309] dark:border-b-[#E6AF2E]'
                : 'text-[#0A0A0A] dark:text-[#F5F5F0] bg-white dark:bg-[#141619] border border-[#D5CFBE] dark:border-[#2A2E35] border-b-[#B4ACA0] dark:border-b-black'
            }`}
          >
            <Bookmark className={`h-4 w-4 ${readingArticle.isBookmarked ? 'fill-current' : ''}`} />
          </button>

          {/* Font Type Switcher */}
          <button
            onClick={() => {
              playTactileClick();
              setIsSerif(!isSerif);
            }}
            title="Toggle Serif / Sans Typeface"
            className="btn-press-3d p-2 text-[#0A0A0A] dark:text-[#F5F5F0] rounded-xl bg-white dark:bg-[#141619] border border-[#D5CFBE] dark:border-[#2A2E35] border-b-[3px] border-b-[#B4ACA0] dark:border-b-black transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center font-headline text-xs font-bold"
          >
            {isSerif ? 'Serif' : 'Sans'}
          </button>

          {/* Outbound Link */}
          <a
            href={readingArticle.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View original publication"
            className="btn-press-3d p-2 text-[#0A0A0A] dark:text-[#F5F5F0] rounded-xl bg-white dark:bg-[#141619] border border-[#D5CFBE] dark:border-[#2A2E35] border-b-[3px] border-b-[#B4ACA0] dark:border-b-black transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center"
            title="Open original article"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </header>

      {/* Reader Main Content Container: Strict Center with Max Width & Generous Gutters */}
      <main className={`flex-1 ${isDualColumn ? 'max-w-5xl' : 'max-w-3xl'} mx-auto w-full px-5 sm:px-8 py-10 sm:py-14 transition-all duration-300`}>
        {/* Editorial Formal Article Header */}
        <div className="space-y-4 pb-8 border-b-2 border-[#D5CFBE] dark:border-[#2A2E35]">
          <div className="flex flex-wrap items-center gap-2 text-xs font-kicker uppercase tracking-[0.12em] text-[#B45309] dark:text-[#E6AF2E] font-semibold">
            <span>{readingArticle.feedTitle}</span>
            <span>•</span>
            <span className="flex items-center gap-1 font-mono tabular-nums text-[#4A4A4A] dark:text-[#9EA3A0]">
              <Clock className="h-3 w-3" />
              {readingArticle.estimatedReadMinutes} MIN READ ({timeAgo(readingArticle.publishedAt)})
            </span>
            {readingArticle.author && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono tabular-nums text-[#4A4A4A] dark:text-[#9EA3A0]">
                  <User className="h-3 w-3" />
                  BY {readingArticle.author.toUpperCase()}
                </span>
              </>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0A0A0A] dark:text-[#F5F5F0] tracking-[-0.02em] leading-[1.15] font-headline">
            {readingArticle.title}
          </h1>

          <div className="editorial-double-rule text-[#1E1E1E] dark:text-[#363B44] my-4" />

          {/* Active Audio Narration Banner */}
          {isCurrentAudio && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#E6AF2E]/10 border border-[#B45309]/30 dark:border-[#E6AF2E]/30 text-[#0A0A0A] dark:text-[#E6AF2E] text-xs font-mono tabular-nums">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E6AF2E] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#B45309] dark:bg-[#E6AF2E]"></span>
                </span>
                <span className="font-bold">
                  Audio Narration Active — Real-time sentence synchronized highlight
                </span>
              </div>
              <div className="flex items-center gap-3">
                {/* Visible speeds */}
                <div className="flex items-center gap-1 bg-white/90 dark:bg-[#141619] p-1 rounded-lg border border-[#B45309]/20 dark:border-[#E6AF2E]/30 shadow-sm">
                  <span className="text-[9px] uppercase tracking-wider font-kicker px-1 font-bold text-[#B45309] dark:text-[#E6AF2E]">
                    Speed
                  </span>
                  {[1.0, 1.75, 2.0, 2.5].map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        playTactileClick();
                        setPlaybackRate(r);
                      }}
                      className={`px-1.5 py-0.5 rounded text-[11px] font-mono tabular-nums font-semibold transition-all ${
                        playbackRate === r
                          ? 'bg-[#0A0A0A] dark:bg-[#E6AF2E] text-white dark:text-[#0B0C0E] font-bold shadow-sm'
                          : 'hover:bg-[#ECE8DF] dark:hover:bg-[#2A2E35] text-[#4A4A4A] dark:text-[#C8CCC5]'
                      }`}
                      title={`Set narration speed to ${r}x`}
                    >
                      {r}x
                    </button>
                  ))}
                </div>
                <span className="text-[11px] opacity-80 whitespace-nowrap hidden md:inline">
                  Column {activeParagraphIndex + 1} of {readingArticle.paragraphs.length}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Broadsheet Lead Editorial Photograph Frame */}
        <figure className="my-8 space-y-2.5 select-none">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-[#090A0D] border border-[#D5CFBE] dark:border-[#2A2E35] shadow-xl">
            <img
              src={editorialImg.url}
              alt={readingArticle.title}
              className="h-full w-full object-cover contrast-[1.06]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-3.5 right-3.5 bg-black/75 text-[#E6AF2E] px-2.5 py-1 rounded-md text-[10px] font-mono font-bold tracking-wider uppercase border border-white/10 backdrop-blur-md">
              EDITORIAL ARCHIVE PHOTOGRAPH
            </div>
          </div>
          <figcaption className="text-xs font-serif text-[#4A4A4A] dark:text-[#9EA3A0] italic flex flex-col sm:flex-row sm:items-center justify-between gap-1 px-1">
            <span>Plate 1.0 — {editorialImg.caption}</span>
            <span className="font-mono text-[10px] uppercase tracking-wider not-italic text-[#717680] shrink-0">
              Source: {editorialImg.credit}
            </span>
          </figcaption>
        </figure>

        {/* Article Body with Synchronized Sentence & Paragraph Highlighting */}
        <article
          className={`pt-8 space-y-7 ${fontClasses[fontSize]} ${
            isSerif ? 'font-body text-[#0A0A0A] dark:text-[#F5F5F0]' : 'font-sans text-[#0A0A0A] dark:text-[#F5F5F0]'
          } text-justify [hyphens:auto] tracking-[0.01em] ${isDualColumn ? 'md:columns-2 md:gap-10' : ''}`}
        >
          {readingArticle.paragraphs.length > 0 ? (
            readingArticle.paragraphs.map((para, index) => {
              const isActive = isCurrentAudio && activeParagraphIndex === index;
              const isFirstParagraph = index === 0;
              const isUserHighlighted = highlightedIndices.has(index);

              // Break active paragraph into sentences to highlight active spoken sentence
              const sentences = para.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) || [para];

              return (
                <div
                  key={index}
                  ref={isActive ? activeParagraphRef : null}
                  data-active-paragraph={isActive ? 'true' : undefined}
                  className="relative group/para transition-all duration-300"
                >
                  {/* Hovering MP3 Sound Panel - Follows along with the content currently making sound */}
                  {isActive && (
                    <div className="mb-3.5 p-2.5 sm:p-3 rounded-2xl bg-[#090A0D]/95 border border-[#2A2E35] text-white shadow-2xl flex flex-wrap items-center justify-between gap-3 animate-slide-up select-none ring-1 ring-[#E6AF2E]/40">
                      {/* Left: Spinning mini-disc & Voicing status */}
                      <div className="flex items-center gap-2.5">
                        <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[#141619] border border-[#363B44] shrink-0 shadow-inner">
                          <Disc3 className={`h-4 w-4 text-[#E6AF2E] ${isAudioPlaying ? 'animate-spin' : ''}`} />
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-[#38D489] animate-ping" />
                            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-[#38D489]">
                              {isAudioPlaying ? 'Now Voicing' : 'Narration Paused'}
                            </span>
                            <span className="text-[#555]">•</span>
                            <span className="text-[10px] font-mono text-[#E6AF2E] font-bold">
                              Col {index + 1}/{readingArticle.paragraphs.length}
                            </span>
                          </div>
                          {activeSentence && (
                            <p className="text-[10px] text-[#A0A5AC] truncate max-w-[200px] sm:max-w-[280px] italic font-body">
                              "{activeSentence}"
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Center: Reactive Mini MP3 Equalizer */}
                      <div className="hidden sm:flex items-center">
                        <MP3Visualizer data={visualizerData} isPlaying={isAudioPlaying} compact />
                      </div>

                      {/* Right: Quick MP3 Controls + Visible Speed Buttons */}
                      <div className="flex items-center gap-1.5 shrink-0 ml-auto sm:ml-0">
                        {/* 1-Click Play / Pause */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            playTactileClick();
                            togglePlayPause();
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#E6AF2E] text-[#0A0A0A] font-bold text-xs flex items-center gap-1 hover:bg-[#F3C760] transition-colors shadow-sm"
                          title={isAudioPlaying ? 'Pause narration' : 'Resume narration'}
                        >
                          {isAudioPlaying ? (
                            <Pause className="h-3.5 w-3.5 fill-current" />
                          ) : (
                            <Play className="h-3.5 w-3.5 fill-current" />
                          )}
                          <span>{isAudioPlaying ? 'Pause' : 'Play'}</span>
                        </button>

                        {/* Visible speed selector: 1x, 1.75x, 2x, 2.5x */}
                        <div className="flex items-center gap-0.5 bg-[#141619] p-0.5 rounded-lg border border-[#2A2E35]">
                          {[1.0, 1.75, 2.0, 2.5].map((r) => (
                            <button
                              key={r}
                              onClick={(e) => {
                                e.stopPropagation();
                                playTactileClick();
                                setPlaybackRate(r);
                              }}
                              className={`px-1.5 py-0.5 text-[10px] font-mono font-bold rounded transition-colors ${
                                playbackRate === r
                                  ? 'bg-[#E6AF2E] text-[#0A0A0A]'
                                  : 'text-[#9EA3A0] hover:text-white'
                              }`}
                              title={`Set speed to ${r}x`}
                            >
                              {r}x
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <p
                    onClick={() => {
                      if (isCurrentAudio) {
                        seekToParagraph(index);
                      } else {
                        playArticle(readingArticle, index);
                      }
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      toggleHighlight(index);
                    }}
                    className={`p-3 sm:p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                      isFirstParagraph ? 'drop-cap' : ''
                    } ${
                      isActive
                        ? 'bg-[#ECE8DF]/80 dark:bg-[#141619] border-l-4 border-[#B45309] dark:border-[#E6AF2E] shadow-md'
                        : isUserHighlighted
                        ? 'bg-[#E6AF2E]/15 dark:bg-[#E6AF2E]/15 border-l-4 border-[#E6AF2E]'
                        : 'hover:bg-[#ECE8DF]/40 dark:hover:bg-[#141619]/40 border-l-4 border-transparent'
                    }`}
                    title="Click to jump audio narration • Double-click to highlight paragraph"
                  >
                    {isActive && activeSentence ? (
                      sentences.map((sent, sIdx) => {
                        const isSentenceActive =
                          sent.trim().toLowerCase().includes(activeSentence.trim().toLowerCase().slice(0, 20)) ||
                          activeSentence.trim().toLowerCase().includes(sent.trim().toLowerCase().slice(0, 20));

                        return (
                          <span
                            key={sIdx}
                            className={isSentenceActive ? 'reading-sentence-glow font-medium' : ''}
                          >
                            {sent}{' '}
                          </span>
                        );
                      })
                    ) : (
                      para
                    )}
                  </p>
                </div>
              );
            })
          ) : (
            // Clean Sanitized HTML Fallback
            <div
              className="prose dark:prose-invert max-w-none font-body text-[#0A0A0A] dark:text-[#F5F5F0] leading-[1.85]"
              dangerouslySetInnerHTML={{ __html: readingArticle.contentClean }}
            />
          )}
        </article>

        {/* Formal Broadsheet Signoff */}
        <div className="mt-16 pt-8 border-t-2 border-[#D5CFBE] dark:border-[#2A2E35] text-center space-y-4">
          <p className="text-xs font-kicker tracking-[0.12em] uppercase text-[#B45309] dark:text-[#E6AF2E] font-semibold">
            *** END OF DISPATCH ***
          </p>
          <p className="text-xs text-[#4A4A4A] dark:text-[#9EA3A0] font-mono tabular-nums">
            Archived securely in client IndexedDB • Sanitized via DOMPurify whitelist
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleClose}
              className="btn-press-3d px-5 py-2.5 rounded-xl bg-white dark:bg-[#141619] border border-[#D5CFBE] dark:border-[#2A2E35] border-b-[3px] border-b-[#B4ACA0] dark:border-b-black text-xs font-mono font-medium tabular-nums text-[#0A0A0A] dark:text-[#F5F5F0]"
            >
              Return to Timeline
            </button>
            <a
              href={readingArticle.link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-press-3d inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#0A0A0A] dark:bg-[#E6AF2E] text-white dark:text-[#0B0C0E] border-b-[3px] border-b-black dark:border-b-[#C5911B] text-xs font-mono font-bold"
            >
              <span>Original Publication</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};
