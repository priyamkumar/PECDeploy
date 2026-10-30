import React from 'react';
import { Article } from '../../types';
import { useFeeds } from '../../context/FeedContext';
import { useAudio } from '../../context/AudioContext';
import { timeAgo } from '../../lib/utils';
import {
  Headphones,
  Bookmark,
  Clock,
  Play,
  Pause,
  Plus,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { playTactileClick, playChimeSuccess } from '../../lib/sound-effects';
import { getEditorialImageForArticle } from '../../lib/editorial-images';

export interface ArticleCardProps {
  article: Article;
  isLeadStory?: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, isLeadStory = false }) => {
  const { setReadingArticle, toggleBookmark } = useFeeds();
  const { currentArticle, playbackState, playArticle, togglePlayPause, addToQueue } = useAudio();

  const isCurrentAudio = currentArticle?.id === article.id;
  const isAudioPlaying = isCurrentAudio && playbackState === 'playing';
  const editorialImg = getEditorialImageForArticle(article);

  const handleOpenReader = () => {
    playTactileClick();
    setReadingArticle(article);
  };

  const handleToggleTTS = (e: React.MouseEvent) => {
    e.stopPropagation();
    playTactileClick();
    if (isCurrentAudio) {
      togglePlayPause();
    } else {
      playArticle(article);
    }
  };

  const handleQueue = (e: React.MouseEvent) => {
    e.stopPropagation();
    playChimeSuccess();
    addToQueue(article);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    playChimeSuccess();
    toggleBookmark(article.id);
  };

  return (
    <article
      onClick={handleOpenReader}
      className={`group relative rounded-2xl border transition-all duration-200 p-5 sm:p-6 cursor-pointer select-none ${
        article.isRead
          ? 'border-[#D5CFBE]/80 dark:border-[#2A2E35]/80 bg-[#ECE8DF]/50 dark:bg-[#141619]/40 opacity-85 hover:opacity-100 hover:border-[#B45309]/50 dark:hover:border-[#E6AF2E]/50'
          : 'border-[#D5CFBE] dark:border-[#2A2E35] bg-white dark:bg-[#141619] shadow-md hover:shadow-xl hover:border-[#0A0A0A] dark:hover:border-[#E6AF2E]'
      } ${
        isLeadStory
          ? 'flex flex-col md:flex-row gap-6 md:gap-8 items-stretch bg-gradient-to-br from-white to-[#FAF8F5] dark:from-[#141619] dark:to-[#111317]'
          : 'flex flex-col justify-between space-y-4'
      }`}
    >
      {/* Editorial Real-World Photograph Frame */}
      <div
        className={`relative overflow-hidden rounded-xl bg-[#090A0D] border border-[#D5CFBE]/80 dark:border-[#2A2E35] group-hover:border-[#0A0A0A] dark:group-hover:border-[#E6AF2E] transition-all shrink-0 ${
          isLeadStory ? 'w-full md:w-[48%] aspect-[16/10]' : 'w-full aspect-[16/9]'
        }`}
      >
        <img
          src={editorialImg.url}
          alt={article.title}
          loading="lazy"
          className="h-full w-full object-cover grayscale-[18%] contrast-[1.06] group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

        {/* Lead Story Badge or Dateline Stamp */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          {isLeadStory ? (
            <span className="bg-[#E6AF2E] text-[#0A0A0A] px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider uppercase shadow-md flex items-center gap-1">
              <Sparkles className="h-2.5 w-2.5" />
              LEAD DISPATCH
            </span>
          ) : (
            !article.isRead && (
              <span className="h-2 w-2 rounded-full bg-[#E6AF2E] shadow-[0_0_6px_#E6AF2E] animate-pulse" />
            )
          )}
        </div>

        {/* Editorial Photo Credit Stamp */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[9px] font-mono font-bold tracking-wider uppercase text-white/90 drop-shadow">
          <span className="truncate max-w-[70%]">{editorialImg.credit}</span>
          <span className="bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm border border-white/20">ARCHIVE</span>
        </div>
      </div>

      {/* Content Container */}
      <div className={`flex flex-col justify-between space-y-3.5 min-w-0 ${isLeadStory ? 'flex-1' : ''}`}>
        {/* Top Meta Header: Dateline & Publication */}
        <div className="flex items-center justify-between gap-2 text-xs border-b border-[#D5CFBE]/70 dark:border-[#2A2E35] pb-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-semibold font-kicker text-[11px] uppercase tracking-[0.12em] text-[#B45309] dark:text-[#E6AF2E] truncate max-w-[160px] sm:max-w-[240px]">
              {article.feedTitle}
            </span>
            <span className="text-[#B4ACA0] dark:text-[#363B44]">•</span>
            <span className="text-[#4A4A4A] dark:text-[#9EA3A0] shrink-0 font-mono font-medium tabular-nums text-[11px] flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {article.estimatedReadMinutes}m read
            </span>
          </div>

          <div className="text-[11px] font-mono font-medium tabular-nums text-[#4A4A4A] dark:text-[#9EA3A0] shrink-0">
            {timeAgo(article.publishedAt)}
          </div>
        </div>

        {/* Headline & Editorial Excerpt */}
        <div className="space-y-2 flex-1">
          <h3
            className={`font-bold tracking-[-0.02em] leading-snug font-headline transition-colors ${
              isLeadStory ? 'text-xl sm:text-2xl md:text-3xl' : 'text-lg sm:text-xl line-clamp-2'
            } ${
              article.isRead
                ? 'text-[#4A4A4A] dark:text-[#9EA3A0] group-hover:text-[#0A0A0A] dark:group-hover:text-[#F5F5F0]'
                : 'text-[#0A0A0A] dark:text-[#F5F5F0] group-hover:text-[#B45309] dark:group-hover:text-[#E6AF2E]'
            }`}
          >
            {article.title}
          </h3>
          <p
            className={`font-body text-[#262626] dark:text-[#C8CCC5] leading-[1.85] tracking-[0.01em] ${
              isLeadStory ? 'text-sm sm:text-base line-clamp-3 md:line-clamp-4' : 'text-xs sm:text-sm line-clamp-3'
            }`}
          >
            {article.excerpt}
          </p>
        </div>

        {/* Bottom Action Footer with 3D Tactile Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-[#D5CFBE]/70 dark:border-[#2A2E35] text-xs">
          <div className="flex items-center gap-2">
            {/* Audio TTS Action Button */}
            <button
              onClick={handleToggleTTS}
              aria-label={isAudioPlaying ? 'Pause narration' : 'Listen to story'}
              className={`btn-press-3d flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium tabular-nums uppercase tracking-wider transition-all ${
                isAudioPlaying
                  ? 'bg-[#047857] dark:bg-[#38D489] text-white dark:text-[#0B0C0E] border-b-[3px] border-[#02402e] dark:border-[#21a364] shadow-sm'
                  : 'bg-white dark:bg-[#1D2025] text-[#0A0A0A] dark:text-[#F5F5F0] border border-[#D5CFBE] dark:border-[#2A2E35] border-b-[3px] border-b-[#B4ACA0] dark:border-b-black hover:text-[#B45309] dark:hover:text-[#E6AF2E]'
              }`}
            >
              {isAudioPlaying ? (
                <>
                  <Pause className="h-3.5 w-3.5 fill-current" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Headphones className="h-3.5 w-3.5" />
                  <span>Listen</span>
                </>
              )}
            </button>

            {/* Add to Queue */}
            <button
              onClick={handleQueue}
              aria-label="Queue for broadsheet narration"
              className="btn-press-3d p-1.5 rounded-lg bg-white dark:bg-[#1D2025] text-[#0A0A0A] dark:text-[#F5F5F0] border border-[#D5CFBE] dark:border-[#2A2E35] border-b-[3px] border-b-[#B4ACA0] dark:border-b-black hover:text-[#B45309] dark:hover:text-[#E6AF2E] transition-colors"
              title="Queue dispatch"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Read Column Action */}
            <span className="text-[11px] font-kicker uppercase tracking-[0.08em] font-semibold text-[#B45309] dark:text-[#E6AF2E] group-hover:underline flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Read Column</span>
            </span>

            {/* Bookmark Toggle */}
            <button
              onClick={handleBookmark}
              aria-label="Save bookmark"
              className={`btn-press-3d p-1.5 rounded-lg border border-b-[3px] transition-colors ${
                article.isBookmarked
                  ? 'text-[#B45309] dark:text-[#E6AF2E] bg-[#E6AF2E]/15 border-[#B45309]/40 dark:border-[#E6AF2E]/40 border-b-[#B45309] dark:border-b-[#E6AF2E]'
                  : 'text-[#4A4A4A] dark:text-[#9EA3A0] bg-white dark:bg-[#1D2025] border border-[#D5CFBE] dark:border-[#2A2E35] border-b-[#B4ACA0] dark:border-b-black hover:text-[#0A0A0A] dark:hover:text-[#F5F5F0]'
              }`}
              title={article.isBookmarked ? 'Bookmarked' : 'Bookmark story'}
            >
              <Bookmark className={`h-3.5 w-3.5 ${article.isBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
