import React, { useState, useMemo } from 'react';
import { useFeeds } from '../../context/FeedContext';
import { ArticleCard } from './ArticleCard';
import {
  Newspaper,
  CheckCheck,
  RefreshCw,
  Search,
  Filter,
  Bookmark,
  Layers,
  Inbox,
  Flame,
  Clock,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';
import { playTactileClick, playChimeSuccess } from '../../lib/sound-effects';

export const UnifiedTimeline: React.FC = () => {
  const {
    feeds,
    articles,
    folders,
    activeFilter,
    activeFolder,
    searchQuery,
    isSyncing,
    setActiveFilter,
    setActiveFolder,
    markAllAsRead,
    syncAllFeeds,
  } = useFeeds();

  const [sortMode, setSortMode] = useState<'newest' | 'long' | 'quick'>('newest');

  // Filter and sort articles according to active filter, folder, search, and reading duration
  const filteredArticles = useMemo(() => {
    let result = articles.filter((art) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = art.title.toLowerCase().includes(q);
        const matchesExcerpt = art.excerpt.toLowerCase().includes(q);
        const matchesFeed = art.feedTitle.toLowerCase().includes(q);
        if (!matchesTitle && !matchesExcerpt && !matchesFeed) return false;
      }

      // 2. Folder Filter
      if (activeFolder !== 'all') {
        const parentFeed = feeds.find((f) => f.id === art.feedId);
        if (parentFeed?.folder !== activeFolder) return false;
      }

      // 3. Tab Filter (all | unread | bookmarks | feedId)
      if (activeFilter === 'unread') return !art.isRead;
      if (activeFilter === 'bookmarks') return art.isBookmarked;
      if (activeFilter !== 'all') return art.feedId === activeFilter;

      return true;
    });

    // 4. Sort mode
    if (sortMode === 'long') {
      result = [...result].sort((a, b) => b.estimatedReadMinutes - a.estimatedReadMinutes);
    } else if (sortMode === 'quick') {
      result = [...result].sort((a, b) => a.estimatedReadMinutes - b.estimatedReadMinutes);
    }

    return result;
  }, [articles, feeds, activeFilter, activeFolder, searchQuery, sortMode]);

  const activeFeedObj = feeds.find((f) => f.id === activeFilter);
  const unreadTotal = articles.filter((a) => !a.isRead).length;

  return (
    <div className="space-y-6">
      {/* Timeline Controls & Formal Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#D5CFBE] dark:border-[#2A2E35]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-kicker text-[10px] tracking-[0.12em] uppercase text-[#B45309] dark:text-[#E6AF2E] font-semibold">
              COLUMN ARCHIVE
            </span>
            <span className="text-[#B4ACA0] dark:text-[#363B44]">•</span>
            <span className="font-mono font-medium tabular-nums text-[10px] text-[#4A4A4A] dark:text-[#9EA3A0]">
              {filteredArticles.length} STORIES AVAILABLE
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-[#0A0A0A] dark:text-[#F5F5F0] tracking-[-0.02em] font-headline flex items-center gap-2.5">
            <Newspaper className="h-6 w-6 text-[#B45309] dark:text-[#E6AF2E]" />
            <span>
              {activeFilter === 'all'
                ? activeFolder === 'all'
                  ? 'The Daily Broadsheet Dispatch'
                  : `Department: ${activeFolder}`
                : activeFilter === 'unread'
                ? 'Unread Dispatches'
                : activeFilter === 'bookmarks'
                ? 'Archived Bookmarks'
                : activeFeedObj?.title || 'Feed Dispatches'}
            </span>
          </h2>
          <p className="text-xs font-body leading-[1.85] text-[#262626] dark:text-[#C8CCC5] mt-1 max-w-xl">
            Chronological stream parsed directly in-browser. Zero surveillance tracking; stored securely in local IndexedDB.
          </p>
        </div>

        {/* Sync & Mark All Read Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => {
              playTactileClick();
              syncAllFeeds();
            }}
            disabled={isSyncing}
            className="btn-press-3d flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-medium tabular-nums bg-white dark:bg-[#141619] text-[#0A0A0A] dark:text-[#F5F5F0] border border-[#D5CFBE] dark:border-[#2A2E35] border-b-[3px] border-b-[#B4ACA0] dark:border-b-black shadow-sm hover:text-[#B45309] dark:hover:text-[#E6AF2E] transition-all"
            title="Refresh subscriptions via CORS proxy"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin text-[#B45309] dark:text-[#E6AF2E]' : ''}`} />
            <span className="hidden sm:inline">Refresh Dispatches</span>
          </button>

          {unreadTotal > 0 && (
            <button
              onClick={() => {
                playChimeSuccess();
                markAllAsRead();
              }}
              className="btn-press-3d flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-medium tabular-nums bg-white dark:bg-[#141619] text-[#4A4A4A] dark:text-[#C8CCC5] border border-[#D5CFBE] dark:border-[#2A2E35] border-b-[3px] border-b-[#B4ACA0] dark:border-b-black hover:text-[#0A0A0A] dark:hover:text-[#F5F5F0] transition-all"
              title="Mark all articles in current view as read"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Mark All Read</span>
            </button>
          )}
        </div>
      </div>

      {/* Interactive Department Filter Strip & Sort Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 select-none">
        {/* Department Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => {
              playTactileClick();
              setActiveFolder('all');
              setActiveFilter('all');
            }}
            className={`btn-press-3d px-3 py-1.5 rounded-xl text-xs font-kicker font-semibold uppercase tracking-[0.08em] transition-all ${
              activeFolder === 'all' && activeFilter === 'all'
                ? 'bg-[#0A0A0A] dark:bg-[#E6AF2E] text-white dark:text-[#0B0C0E] border-b-[3px] border-b-black/80 dark:border-b-[#C5911B] shadow-sm'
                : 'bg-white dark:bg-[#141619] text-[#262626] dark:text-[#C8CCC5] border border-[#D5CFBE] dark:border-[#2A2E35] border-b-[3px] border-b-[#B4ACA0] dark:border-b-black hover:text-[#0A0A0A] dark:hover:text-[#F5F5F0]'
            }`}
          >
            All Departments
          </button>

          {folders.map((fObj) => {
            const folderName = fObj.name;
            const isSelected = activeFolder === folderName;
            return (
              <button
                key={fObj.id || folderName}
                onClick={() => {
                  playTactileClick();
                  setActiveFolder(folderName);
                  setActiveFilter('all');
                }}
                className={`btn-press-3d px-3 py-1.5 rounded-xl text-xs font-kicker font-semibold uppercase tracking-[0.08em] transition-all ${
                  isSelected
                    ? 'bg-[#B45309] dark:bg-[#E6AF2E] text-white dark:text-[#0B0C0E] border-b-[3px] border-b-black/80 dark:border-b-[#C5911B] shadow-sm'
                    : 'bg-white dark:bg-[#141619] text-[#262626] dark:text-[#C8CCC5] border border-[#D5CFBE] dark:border-[#2A2E35] border-b-[3px] border-b-[#B4ACA0] dark:border-b-black hover:text-[#0A0A0A] dark:hover:text-[#F5F5F0]'
                }`}
              >
                {folderName}
              </button>
            );
          })}
        </div>

        {/* Quick Sort Controls */}
        <div className="flex items-center gap-1 bg-[#ECE8DF] dark:bg-[#141619] p-1 rounded-xl border border-[#D5CFBE] dark:border-[#2A2E35] border-b-[3px] border-b-[#B4ACA0] dark:border-b-black text-xs font-kicker">
          <span className="text-[10px] text-[#B45309] dark:text-[#E6AF2E] font-semibold tracking-[0.12em] px-2 flex items-center gap-1">
            <SlidersHorizontal className="h-3 w-3" />
            <span>SORT:</span>
          </span>
          <button
            onClick={() => {
              playTactileClick();
              setSortMode('newest');
            }}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] tracking-wide transition-colors ${
              sortMode === 'newest'
                ? 'bg-white dark:bg-[#0B0C0E] text-[#0A0A0A] dark:text-[#E6AF2E] shadow-sm'
                : 'text-[#262626] dark:text-[#C8CCC5] hover:text-[#0A0A0A] dark:hover:text-[#F5F5F0]'
            }`}
          >
            Newest
          </button>
          <button
            onClick={() => {
              playTactileClick();
              setSortMode('long');
            }}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] tracking-wide transition-colors ${
              sortMode === 'long'
                ? 'bg-white dark:bg-[#0B0C0E] text-[#0A0A0A] dark:text-[#E6AF2E] shadow-sm'
                : 'text-[#262626] dark:text-[#C8CCC5] hover:text-[#0A0A0A] dark:hover:text-[#F5F5F0]'
            }`}
          >
            Long Reads
          </button>
          <button
            onClick={() => {
              playTactileClick();
              setSortMode('quick');
            }}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] tracking-wide transition-colors ${
              sortMode === 'quick'
                ? 'bg-white dark:bg-[#0B0C0E] text-[#0A0A0A] dark:text-[#E6AF2E] shadow-sm'
                : 'text-[#262626] dark:text-[#C8CCC5] hover:text-[#0A0A0A] dark:hover:text-[#F5F5F0]'
            }`}
          >
            Quick Reads
          </button>
        </div>
      </div>

      {/* Main Grid of Articles with Lead Broadsheet Feature */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredArticles.map((article, idx) => (
            <div key={article.id} className={idx === 0 ? 'md:col-span-2' : ''}>
              <ArticleCard article={article} isLeadStory={idx === 0} />
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-2xl border border-dashed border-paper-300 dark:border-broadside-700 p-12 text-center space-y-3 bg-paper-100/50 dark:bg-broadside-900/30">
          <Newspaper className="h-10 w-10 text-sepia/50 dark:text-gold/50 mx-auto" />
          <h3 className="text-lg font-bold font-headline text-ink dark:text-white">
            No Dispatches in Current View
          </h3>
          <p className="text-xs text-ink-muted dark:text-broadside-ink/60 font-serif max-w-md mx-auto">
            {searchQuery
              ? `No articles matched query "${searchQuery}". Clear your search to restore the complete broadsheet.`
              : activeFilter === 'unread'
              ? 'You are completely caught up with all current subscriptions!'
              : activeFilter === 'bookmarks'
              ? 'You have not saved any bookmarks yet. Click the ribbon icon on any story to save it.'
              : 'Add an RSS or Atom feed URL to populate your personal newsprint canvas.'}
          </p>
          {searchQuery && (
            <button
              onClick={() => {
                playTactileClick();
                setActiveFilter('all');
              }}
              className="btn-press-3d px-4 py-2 rounded-xl bg-ink dark:bg-gold text-paper-50 dark:text-broadside-950 text-xs font-mono font-bold uppercase tracking-wider border-b-[3px]"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};
