import React, { useState, useRef, useEffect } from 'react';
import { useAudio } from '../../context/AudioContext';
import { useFeeds } from '../../context/FeedContext';
import { formatDuration } from '../../lib/utils';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  X,
  Headphones,
  Compass,
  Disc3,
} from 'lucide-react';
import { playTactileClick } from '../../lib/sound-effects';
import { useReactiveAudioVisualizer } from '../../hooks/useReactiveAudioVisualizer';
import { MP3Visualizer } from './MP3Visualizer';

export const FloatingAudioPlayer: React.FC = () => {
  const {
    currentArticle,
    playbackState,
    currentTime,
    duration,
    playbackRate,
    volume,
    isMuted,
    activeParagraphIndex,
    activeSentence,
    togglePlayPause,
    stop,
    skip,
    setPlaybackRate,
    toggleMute,
    seekToParagraph,
  } = useAudio();

  const { setReadingArticle } = useFeeds();
  const scrubBarRef = useRef<HTMLDivElement | null>(null);
  const [autoFollow, setAutoFollow] = useState<boolean>(true);

  const isPlaying = playbackState === 'playing';
  const visualizerData = useReactiveAudioVisualizer(isPlaying, playbackRate, activeSentence);
  const { discRotation, beatPulse } = visualizerData;

  const progressPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;
  const rates = [1.0, 1.75, 2.0, 2.5];

  // Auto-follow: smoothly guide viewport along with the content making sound
  const scrollToActiveContent = () => {
    const el = document.querySelector('[data-active-paragraph="true"]');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  useEffect(() => {
    if (autoFollow && isPlaying) {
      scrollToActiveContent();
    }
  }, [activeParagraphIndex, autoFollow, isPlaying]);

  if (!currentArticle || playbackState === 'idle') return null;

  // Interactive scrub click to seek
  const handleScrubClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrubBarRef.current || !currentArticle.paragraphs.length) return;
    const rect = scrubBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, clickX / rect.width));
    const targetParagraphIndex = Math.min(
      currentArticle.paragraphs.length - 1,
      Math.floor(percent * currentArticle.paragraphs.length)
    );
    playTactileClick();
    seekToParagraph(targetParagraphIndex);
  };

  const remainingSeconds = Math.max(0, duration - currentTime);

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 p-2 sm:p-4 pointer-events-none animate-slide-up">
      <div
        className={`max-w-5xl mx-auto pointer-events-auto rounded-2xl border border-[#D5CFBE] dark:border-[#2A2E35] bg-[#F4F1EA]/98 dark:bg-[#111317]/98 backdrop-blur-2xl transition-all duration-300 overflow-hidden ${
          isPlaying
            ? beatPulse
              ? 'shadow-[0_12px_45px_rgba(230,175,46,0.32),0_4px_16px_rgba(0,0,0,0.4)] ring-1 ring-[#E6AF2E]/40'
              : 'shadow-[0_10px_35px_rgba(230,175,46,0.18),0_4px_16px_rgba(0,0,0,0.35)]'
            : 'shadow-2xl'
        }`}
      >
        {/* Top Interactive Progress Scrub Bar with Tooltip */}
        <div
          ref={scrubBarRef}
          onClick={handleScrubClick}
          className="relative h-2 w-full bg-[#ECE8DF] dark:bg-[#1A1D23] cursor-pointer group"
          title="Click to seek narration"
        >
          <div
            className="h-full bg-gradient-to-r from-[#B45309] via-[#E6AF2E] to-[#38D489] rounded-full transition-all duration-300 relative"
            style={{ width: `${progressPercent}%` }}
          >
            <span className="absolute right-0 top-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full bg-[#0A0A0A] dark:bg-white shadow-md border-2 border-[#E6AF2E] scale-0 group-hover:scale-100 transition-transform" />
          </div>
        </div>

        {/* MP3 Player Main Chassis */}
        <div className="px-3 sm:px-5 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Left: Spinning MP3 Vinyl/CD Disc & Track Metadata */}
          <div className="flex items-center gap-3 min-w-0 w-full md:w-auto">
            {/* Spinning MP3 Disc Head */}
            <div
              onClick={() => {
                playTactileClick();
                setReadingArticle(currentArticle);
                scrollToActiveContent();
              }}
              title="Click to view column reader"
              className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#090A0D] border-2 border-[#2A2E35] shadow-lg shrink-0 cursor-pointer group overflow-hidden"
            >
              {/* Vinyl grooves */}
              <div
                className="absolute inset-1 rounded-full border border-dashed border-[#363B44]/70 transition-transform duration-75"
                style={{ transform: `rotate(${discRotation}deg)` }}
              >
                <div className="absolute inset-1.5 rounded-full border border-zinc-800" />
                <div className="absolute inset-3 rounded-full border border-zinc-700/50" />
              </div>

              {/* Center Spindle & Label */}
              <div
                className={`relative z-10 flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold ${
                  isPlaying
                    ? 'bg-[#E6AF2E] text-[#0A0A0A] shadow-[0_0_8px_#E6AF2E]'
                    : 'bg-[#2A2E35] text-[#9EA3A0]'
                }`}
              >
                <Disc3 className={`h-3.5 w-3.5 ${isPlaying ? 'animate-spin' : ''}`} />
              </div>
            </div>

            {/* Track Info & Dynamic LCD Sentence Marquee */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#B45309] dark:text-[#E6AF2E] font-kicker bg-[#E6AF2E]/10 dark:bg-[#E6AF2E]/15 px-1.5 py-0.5 rounded">
                  {currentArticle.feedTitle}
                </span>
                <span className="text-[#B4ACA0] dark:text-[#363B44]">•</span>
                <span className="text-[10px] font-mono font-bold text-[#047857] dark:text-[#38D489] tracking-wider uppercase">
                  {isPlaying ? '▶ MP3 STEREO' : '⏸ PAUSED'}
                </span>
                <span className="text-[#B4ACA0] dark:text-[#363B44] hidden sm:inline">•</span>
                <span className="text-[11px] text-[#4A4A4A] dark:text-[#9EA3A0] font-mono tabular-nums hidden sm:inline">
                  {formatDuration(currentTime)} / {formatDuration(duration)}
                </span>
              </div>

              <h4
                onClick={() => {
                  playTactileClick();
                  setReadingArticle(currentArticle);
                  scrollToActiveContent();
                }}
                className="text-xs sm:text-sm font-bold text-[#0A0A0A] dark:text-[#F5F5F0] truncate cursor-pointer hover:text-[#B45309] dark:hover:text-[#E6AF2E] transition-colors font-headline"
                title={currentArticle.title}
              >
                {currentArticle.title}
              </h4>

              {/* Real-time sentence display that follows along */}
              {activeSentence ? (
                <p className="text-[11px] text-[#B45309] dark:text-[#E6AF2E] truncate font-body italic flex items-center gap-1.5">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#E6AF2E] animate-ping" />
                  "{activeSentence}"
                </p>
              ) : (
                <p className="text-[10px] text-[#717680] font-mono tabular-nums">
                  Column {activeParagraphIndex + 1} of {currentArticle.paragraphs.length} • -{formatDuration(remainingSeconds)} remaining
                </p>
              )}
            </div>
          </div>

          {/* Center: Reactive MP3 Spectrum Equalizer & Stereo VU Meters */}
          <div className="hidden lg:flex items-center shrink-0">
            <MP3Visualizer data={visualizerData} isPlaying={isPlaying} />
          </div>

          {/* Right: Tactile MP3 Controls + Hover Along + Visible Speeds */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 flex-wrap sm:flex-nowrap justify-center">
            {/* "Hover Along" Auto-Follow Toggle Button */}
            <button
              onClick={() => {
                playTactileClick();
                const nextState = !autoFollow;
                setAutoFollow(nextState);
                if (nextState) scrollToActiveContent();
              }}
              aria-label="Toggle hover along with spoken content"
              title={
                autoFollow
                  ? 'Hover-along ACTIVE (Screen follows reading voice) • Click to pause tracking'
                  : 'Hover-along PAUSED • Click to snap and follow speaking column'
              }
              className={`btn-press-3d px-2.5 py-1.5 rounded-xl border text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 min-h-[40px] transition-all ${
                autoFollow && isPlaying
                  ? 'bg-[#38D489]/15 text-[#047857] dark:text-[#38D489] border-[#38D489]/50 border-b-[3px] border-b-[#047857] shadow-sm'
                  : 'bg-white dark:bg-[#1D2025] text-[#717680] dark:text-[#9EA3A0] border-[#D5CFBE] dark:border-[#2A2E35] border-b-[3px] border-b-[#B4ACA0] dark:border-b-black'
              }`}
            >
              <Compass className={`h-3.5 w-3.5 ${autoFollow && isPlaying ? 'animate-spin' : ''}`} />
              <span className="hidden xl:inline">Hover Along</span>
            </button>

            {/* Skip -10s */}
            <button
              onClick={() => {
                playTactileClick();
                skip(-10);
              }}
              aria-label="Skip backward 10 seconds"
              className="btn-press-3d p-2 rounded-xl bg-white dark:bg-[#1D2025] text-[#0A0A0A] dark:text-[#F5F5F0] border border-[#D5CFBE] dark:border-[#2A2E35] border-b-[3px] border-b-[#B4ACA0] dark:border-b-black hover:bg-[#ECE8DF] dark:hover:bg-[#22262E] transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
              title="Skip -10s"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            {/* Play / Pause Toggle 3D Button */}
            <button
              onClick={() => {
                playTactileClick();
                togglePlayPause();
              }}
              aria-label={isPlaying ? 'Pause narration' : 'Resume narration'}
              className="btn-press-3d flex h-11 w-11 items-center justify-center rounded-xl bg-[#0A0A0A] dark:bg-[#E6AF2E] text-white dark:text-[#0B0C0E] font-bold border-b-[3px] border-b-black/70 dark:border-b-[#C5911B] shadow-md hover:bg-[#262626] dark:hover:bg-[#F3C760] transition-all active:scale-95"
              title={isPlaying ? 'Pause narration' : 'Resume narration'}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 fill-current" />
              ) : (
                <Play className="h-5 w-5 fill-current ml-0.5" />
              )}
            </button>

            {/* Skip +10s */}
            <button
              onClick={() => {
                playTactileClick();
                skip(10);
              }}
              aria-label="Skip forward 10 seconds"
              className="btn-press-3d p-2 rounded-xl bg-white dark:bg-[#1D2025] text-[#0A0A0A] dark:text-[#F5F5F0] border border-[#D5CFBE] dark:border-[#2A2E35] border-b-[3px] border-b-[#B4ACA0] dark:border-b-black hover:bg-[#ECE8DF] dark:hover:bg-[#22262E] transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
              title="Skip +10s"
            >
              <RotateCw className="h-4 w-4" />
            </button>

            {/* Visible Audio Speed Selector: 1x, 1.75x, 2x, 2.5x */}
            <div className="flex items-center p-1 rounded-xl bg-white dark:bg-[#1D2025] border border-[#D5CFBE] dark:border-[#2A2E35] border-b-[3px] border-b-[#B4ACA0] dark:border-b-black shadow-sm">
              <span className="px-1.5 text-[9px] font-kicker uppercase tracking-wider text-[#B45309] dark:text-[#E6AF2E] font-bold hidden xl:inline">
                Speed
              </span>
              <div className="flex items-center gap-0.5">
                {rates.map((r) => {
                  const isSelected = playbackRate === r;
                  return (
                    <button
                      key={r}
                      onClick={() => {
                        playTactileClick();
                        setPlaybackRate(r);
                      }}
                      className={`px-2 py-1 text-xs font-mono tabular-nums font-semibold rounded-lg transition-all ${
                        isSelected
                          ? 'bg-[#0A0A0A] dark:bg-[#E6AF2E] text-white dark:text-[#0B0C0E] shadow-sm font-bold scale-[1.02]'
                          : 'text-[#4A4A4A] dark:text-[#C8CCC5] hover:text-[#0A0A0A] dark:hover:text-white hover:bg-[#ECE8DF] dark:hover:bg-[#2A2E35]'
                      }`}
                      title={`Set reading speed to ${r}x`}
                    >
                      {r}x
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mute / Unmute 3D Toggle Button */}
            <button
              onClick={() => {
                playTactileClick();
                toggleMute();
              }}
              className={`btn-press-3d p-2 rounded-xl border border-b-[3px] transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center ${
                isMuted
                  ? 'bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-900 border-b-rose-400'
                  : 'bg-white dark:bg-[#1D2025] text-[#0A0A0A] dark:text-[#F5F5F0] border border-[#D5CFBE] dark:border-[#2A2E35] border-b-[3px] border-b-[#B4ACA0] dark:border-b-black hover:bg-[#ECE8DF] dark:hover:bg-[#22262E]'
              }`}
              title={isMuted ? 'Unmute voice' : 'Mute voice'}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>

            {/* Close / Stop Narration */}
            <button
              onClick={() => {
                playTactileClick();
                stop();
              }}
              className="btn-press-3d p-2 rounded-xl bg-white dark:bg-[#1D2025] text-[#4A4A4A] dark:text-[#9EA3A0] hover:text-rose-500 border border-[#D5CFBE] dark:border-[#2A2E35] border-b-[3px] border-b-[#B4ACA0] dark:border-b-black hover:bg-[#ECE8DF] dark:hover:bg-[#22262E] min-h-[40px] min-w-[40px] flex items-center justify-center"
              title="Stop audio player"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
