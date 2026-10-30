import React from 'react';
import { Sheet } from '../ui/sheet';
import { useFeeds } from '../../context/FeedContext';
import {
  Rss,
  Inbox,
  Bookmark,
  Compass,
  Plus,
  RefreshCw,
  Newspaper,
} from 'lucide-react';

export interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAddFeed: () => void;
  onOpenDiscovery: () => void;
  onNavigateHome: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen,
  onClose,
  onOpenAddFeed,
  onOpenDiscovery,
  onNavigateHome,
}) => {
  const {
    feeds,
    articles,
    folders,
    activeFilter,
    activeFolder,
    setActiveFilter,
    setActiveFolder,
    syncAllFeeds,
    isSyncing,
  } = useFeeds();

  const unreadTotal = articles.filter((a) => !a.isRead).length;

  const handleSelectFilter = (filter: string, folder = 'all') => {
    setActiveFilter(filter);
    setActiveFolder(folder);
    onNavigateHome();
    onClose();
  };

  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      side="left"
      title={
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0A0A0A] dark:bg-[#E6AF2E] text-white dark:text-[#0B0C0E] font-bold font-headline text-xs">
            IR
          </div>
          <span className="font-headline font-bold text-[#0A0A0A] dark:text-[#F5F5F0]">IncogniRead Dispatches</span>
        </div>
      }
    >
      <div className="flex flex-col space-y-6">
        {/* Main Filters */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-kicker uppercase tracking-[0.12em] text-[#B45309] dark:text-[#E6AF2E] font-semibold px-1">
            TIMELINE EDITIONS
          </p>

          <button
            onClick={() => handleSelectFilter('all')}
            className={`btn-press-3d w-full flex items-center justify-between p-3 rounded-xl text-xs font-mono tabular-nums font-medium transition-all min-h-[44px] ${
              activeFilter === 'all' && activeFolder === 'all'
                ? 'bg-white dark:bg-[#0B0C0E] text-[#0A0A0A] dark:text-[#E6AF2E] border border-[#D5CFBE] dark:border-[#2A2E35] shadow-sm border-b-[3px]'
                : 'text-[#262626] dark:text-[#C8CCC5] hover:bg-white/60 dark:hover:bg-[#1D2025]/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <Inbox className="h-4 w-4 text-[#B45309] dark:text-[#E6AF2E]" />
              <span>All Stories</span>
            </div>
            <span className="font-mono tabular-nums text-xs text-[#4A4A4A] dark:text-[#9EA3A0]">{articles.length}</span>
          </button>

          <button
            onClick={() => handleSelectFilter('unread')}
            className={`btn-press-3d w-full flex items-center justify-between p-3 rounded-xl text-xs font-mono tabular-nums font-medium transition-all min-h-[44px] ${
              activeFilter === 'unread'
                ? 'bg-white dark:bg-[#0B0C0E] text-[#0A0A0A] dark:text-[#E6AF2E] border border-[#D5CFBE] dark:border-[#2A2E35] shadow-sm border-b-[3px]'
                : 'text-[#262626] dark:text-[#C8CCC5] hover:bg-white/60 dark:hover:bg-[#1D2025]/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#B45309] dark:bg-[#E6AF2E] animate-pulse" />
              <span>Unread Dispatches</span>
            </div>
            {unreadTotal > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E6AF2E]/20 text-[#B45309] dark:text-[#E6AF2E] font-bold tabular-nums">
                {unreadTotal}
              </span>
            )}
          </button>

          <button
            onClick={() => handleSelectFilter('bookmarks')}
            className={`btn-press-3d w-full flex items-center justify-between p-3 rounded-xl text-xs font-mono tabular-nums font-medium transition-all min-h-[44px] ${
              activeFilter === 'bookmarks'
                ? 'bg-white dark:bg-[#0B0C0E] text-[#0A0A0A] dark:text-[#E6AF2E] border border-[#D5CFBE] dark:border-[#2A2E35] shadow-sm border-b-[3px]'
                : 'text-[#262626] dark:text-[#C8CCC5] hover:bg-white/60 dark:hover:bg-[#1D2025]/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <Bookmark className="h-4 w-4 text-[#B45309] dark:text-[#E6AF2E]" />
              <span>Saved Bookmarks</span>
            </div>
            <span className="font-mono tabular-nums text-xs text-[#4A4A4A] dark:text-[#9EA3A0]">
              {articles.filter((a) => a.isBookmarked).length}
            </span>
          </button>
        </div>

        {/* Discovery Action Pill */}
        <button
          onClick={() => {
            onOpenDiscovery();
            onClose();
          }}
          className="btn-press-3d w-full flex items-center justify-between p-3 rounded-xl bg-white dark:bg-[#1D2025] border border-[#D5CFBE] dark:border-[#2A2E35] border-b-[3px] text-xs font-kicker uppercase tracking-wider font-semibold text-[#0A0A0A] dark:text-[#F5F5F0] min-h-[44px]"
        >
          <div className="flex items-center gap-2.5">
            <Compass className="h-4 w-4 text-[#B45309] dark:text-[#E6AF2E]" />
            <span>The Anonymous Gazette</span>
          </div>
          <span className="text-[10px] font-mono tabular-nums px-2 py-0.5 rounded-full bg-[#E6AF2E]/15 text-[#B45309] dark:text-[#E6AF2E] font-bold">
            Curated
          </span>
        </button>

        {/* Subscribed Feeds */}
        <div className="space-y-2 pt-2 border-t border-[#D5CFBE] dark:border-[#2A2E35]">
          <div className="text-[10px] font-kicker uppercase tracking-[0.12em] text-[#B45309] dark:text-[#E6AF2E] px-1 font-semibold">
            SUBSCRIPTIONS ({feeds.length})
          </div>
          <div className="space-y-1">
            {feeds.map((feed) => {
              const isFeedActive = activeFilter === feed.id;
              return (
                <button
                  key={feed.id}
                  onClick={() => handleSelectFilter(feed.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs transition-colors min-h-[40px] ${
                    isFeedActive
                      ? 'bg-white dark:bg-[#1D2025] font-bold text-[#0A0A0A] dark:text-[#E6AF2E] border border-[#D5CFBE] dark:border-[#2A2E35] shadow-sm'
                      : 'text-[#262626] dark:text-[#C8CCC5] hover:bg-white/50 dark:hover:bg-[#1D2025]/50'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <Rss className="h-3.5 w-3.5 text-[#B45309] dark:text-[#E6AF2E] shrink-0" />
                    <span className="truncate font-body">{feed.title}</span>
                  </div>
                  <span className="text-[10px] text-[#4A4A4A] dark:text-[#9EA3A0] font-mono tabular-nums">
                    {feed.folder}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-[#D5CFBE] dark:border-[#2A2E35] space-y-2">
          <button
            onClick={() => {
              onClose();
              onOpenAddFeed();
            }}
            className="btn-press-3d w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0A0A0A] dark:bg-[#E6AF2E] text-white dark:text-[#0B0C0E] font-bold text-xs uppercase tracking-wider border-b-[3px] border-b-black/80 dark:border-b-[#C5911B] min-h-[44px]"
          >
            <Plus className="h-4 w-4" />
            <span>Subscribe to New Feed</span>
          </button>

          <button
            onClick={syncAllFeeds}
            disabled={isSyncing}
            className="btn-press-3d w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#141619] text-[#0A0A0A] dark:text-[#F5F5F0] border border-[#D5CFBE] dark:border-[#2A2E35] border-b-[3px] text-xs font-mono font-medium tabular-nums min-h-[44px]"
          >
            <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>Refresh All Dispatches</span>
          </button>
        </div>
      </div>
    </Sheet>
  );
};
