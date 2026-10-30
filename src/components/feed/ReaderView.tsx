import React, { useState, useEffect } from 'react';
import { useFeeds } from '../../context/FeedContext';
import { timeAgo } from '../../lib/utils';
import {
  Bookmark,
  ExternalLink,
  Clock,
  User,
  Plus,
  ArrowLeft,
  Columns,
  Minus,
} from 'lucide-react';
import { playTactileClick, playChimeSuccess } from '../../lib/sound-effects';
import { getEditorialImageForArticle } from '../../lib/editorial-images';

export interface ReaderViewProps {
  onBack?: () => void;
}

export const ReaderView: React.FC<ReaderViewProps> = ({ onBack }) => {
  const { readingArticle, setReadingArticle, toggleBookmark, markAsRead } = useFeeds();

  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [isSerif, setIsSerif] = useState<boolean>(true);
  const [isDualColumn, setIsDualColumn] = useState<boolean>(false);
  const [highlightedIndices, setHighlightedIndices] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (readingArticle) {
      markAsRead(readingArticle.id);
    }
  }, [readingArticle?.id]);

  if (!readingArticle) return null;

  const editorialImg = getEditorialImageForArticle(readingArticle);

  const fontClasses = {
    sm: 'text-sm sm:text-base leading-[1.8]',
    base: 'text-base sm:text-lg leading-[1.85]',
    lg: 'text-lg sm:text-xl leading-[1.9]',
    xl: 'text-xl sm:text-2xl leading-[1.95]',
  };

  const handleClose = () => {
    playTactileClick();
    setReadingArticle(null);
    if (onBack) onBack();
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
        </div>

        {/* Reader Customization Actions */}
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
            title={readingArticle.isBookmarked ? 'Bookmarked' : 'Bookmark story'}
          >
            <Bookmark className={`h-4 w-4 ${readingArticle.isBookmarked ? 'fill-current' : ''}`} />
          </button>

          {/* Outbound Original Link */}
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

        {/* Article Body with Classic Newspaper Drop-Caps and Text Justification */}
        <article
          className={`pt-6 space-y-7 ${fontClasses[fontSize]} ${
            isSerif ? 'font-body text-[#0A0A0A] dark:text-[#F5F5F0]' : 'font-sans text-[#0A0A0A] dark:text-[#F5F5F0]'
          } text-justify [hyphens:auto] tracking-[0.01em] ${isDualColumn ? 'md:columns-2 md:gap-10' : ''}`}
        >
          {readingArticle.paragraphs.length > 0 ? (
            readingArticle.paragraphs.map((para, index) => {
              const isFirstParagraph = index === 0;
              const isUserHighlighted = highlightedIndices.has(index);

              return (
                <p
                  key={index}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    toggleHighlight(index);
                  }}
                  className={`p-3 sm:p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                    isFirstParagraph ? 'drop-cap' : ''
                  } ${
                    isUserHighlighted
                      ? 'bg-[#E6AF2E]/15 dark:bg-[#E6AF2E]/15 border-l-4 border-[#E6AF2E]'
                      : 'hover:bg-[#ECE8DF]/40 dark:hover:bg-[#141619]/40 border-l-4 border-transparent'
                  }`}
                  title="Double-click to highlight paragraph"
                >
                  {para}
                </p>
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
          <div className="flex items-center justify-center gap-3 text-xs">
            <button
              onClick={handleClose}
              className="btn-press-3d px-4 py-2 rounded-xl bg-white dark:bg-[#141619] border border-[#D5CFBE] dark:border-[#2A2E35] border-b-[3px] border-b-[#B4ACA0] dark:border-b-black text-[#0A0A0A] dark:text-[#F5F5F0] font-mono"
            >
              Return to Timeline
            </button>
            <a
              href={readingArticle.link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-press-3d px-4 py-2 rounded-xl bg-[#0A0A0A] dark:bg-[#E6AF2E] text-white dark:text-[#0B0C0E] border-b-[3px] border-b-black/80 dark:border-b-[#C5911B] font-mono flex items-center gap-1.5"
            >
              <span>Visit Original Article</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};
