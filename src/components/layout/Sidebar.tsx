import React, { useState } from 'react';
import { useFeeds } from '../../context/FeedContext';
import {
  Rss,
  Folder as FolderIcon,
  ChevronDown,
  ChevronRight,
  Inbox,
  Bookmark,
  Trash2,
  Plus,
  BookMarked,
  Layers,
} from 'lucide-react';

export interface SidebarProps {
  onOpenAddFeed: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenAddFeed }) => {
  const {
    feeds,
    articles,
    folders,
    activeFilter,
    activeFolder,
    setActiveFilter,
    setActiveFolder,
    deleteFeed,
  } = useFeeds();

  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'Engineering & AI': true,
    'Tech Journalism': true,
    'Web Development': true,
    'Systems & Open Source': true,
  });

  const toggleFolder = (folderName: string) => {
    setExpandedFolders((prev) => ({ ...prev, [folderName]: !prev[folderName] }));
  };

  const unreadTotal = articles.filter((a) => !a.isRead).length;

  return (
    <aside className="hidden lg:flex w-64 flex-col justify-between border-r border-[#D5CFBE] dark:border-[#2A2E35] bg-[#ECE8DF]/50 dark:bg-[#141619]/60 backdrop-blur-xl p-4 min-h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto transition-colors duration-250">
      <div className="space-y-6">
        {/* Core Editorial Views Filter */}
        <div className="space-y-1.5">
          <p className="px-3 text-[10px] font-kicker font-semibold uppercase tracking-[0.12em] text-[#B45309] dark:text-[#E6AF2E] mb-2">
            BROADSHEET EDITIONS
          </p>

          <button
            onClick={() => {
              setActiveFilter('all');
              setActiveFolder('all');
            }}
            className={`btn-press-3d w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono font-medium tabular-nums transition-all min-h-[40px] ${
              activeFilter === 'all' && activeFolder === 'all'
                ? 'bg-white dark:bg-[#0B0C0E] text-[#0A0A0A] dark:text-[#E6AF2E] border border-[#D5CFBE] dark:border-[#2A2E35] border-b-[3px] border-b-[#B45309] dark:border-b-[#E6AF2E] shadow-sm'
                : 'text-[#262626] dark:text-[#C8CCC5] hover:text-[#0A0A0A] dark:hover:text-[#F5F5F0] hover:bg-white/50 dark:hover:bg-[#1D2025]/60 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Inbox className="h-4 w-4 text-[#B45309] dark:text-[#E6AF2E]" />
              <span>All Stories</span>
            </div>
            <span className="font-mono text-[10px] tabular-nums text-[#4A4A4A] dark:text-[#9EA3A0]">{articles.length}</span>
          </button>

          <button
            onClick={() => setActiveFilter('unread')}
            className={`btn-press-3d w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono font-medium tabular-nums transition-all min-h-[40px] ${
              activeFilter === 'unread'
                ? 'bg-white dark:bg-[#0B0C0E] text-[#0A0A0A] dark:text-[#E6AF2E] border border-[#D5CFBE] dark:border-[#2A2E35] border-b-[3px] border-b-[#B45309] dark:border-b-[#E6AF2E] shadow-sm'
                : 'text-[#262626] dark:text-[#C8CCC5] hover:text-[#0A0A0A] dark:hover:text-[#F5F5F0] hover:bg-white/50 dark:hover:bg-[#1D2025]/60 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-[#B45309] dark:bg-[#E6AF2E] animate-pulse" />
              <span>Unread</span>
            </div>
            {unreadTotal > 0 && (
              <span className="text-[10px] py-0.5 px-2 rounded-full bg-[#E6AF2E]/20 text-[#B45309] dark:text-[#E6AF2E] font-bold tabular-nums">
                {unreadTotal}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveFilter('bookmarks')}
            className={`btn-press-3d w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono font-medium tabular-nums transition-all min-h-[40px] ${
              activeFilter === 'bookmarks'
                ? 'bg-white dark:bg-[#0B0C0E] text-[#0A0A0A] dark:text-[#E6AF2E] border border-[#D5CFBE] dark:border-[#2A2E35] border-b-[3px] border-b-[#B45309] dark:border-b-[#E6AF2E] shadow-sm'
                : 'text-[#262626] dark:text-[#C8CCC5] hover:text-[#0A0A0A] dark:hover:text-[#F5F5F0] hover:bg-white/50 dark:hover:bg-[#1D2025]/60 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Bookmark className="h-4 w-4 text-[#B45309] dark:text-[#E6AF2E]" />
              <span>Saved Bookmarks</span>
            </div>
            <span className="font-mono text-[10px] tabular-nums text-[#4A4A4A] dark:text-[#9EA3A0]">
              {articles.filter((a) => a.isBookmarked).length}
            </span>
          </button>
        </div>

        {/* Editorial Departments / Folders */}
        <div className="space-y-3 pt-3 border-t border-[#D5CFBE] dark:border-[#2A2E35]">
          <div className="flex items-center justify-between px-3">
            <p className="text-[10px] font-kicker font-semibold uppercase tracking-[0.12em] text-[#B45309] dark:text-[#E6AF2E]">
              DEPARTMENTS
            </p>
            <button
              onClick={onOpenAddFeed}
              aria-label="Add new subscription"
              className="text-[#B45309] dark:text-[#E6AF2E] hover:opacity-80 p-1"
              title="Add feed"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-1">
            {folders.map((fObj) => {
              const folderName = fObj.name;
              const folderFeeds = feeds.filter((f) => f.folder === folderName);
              const isExpanded = expandedFolders[folderName] ?? true;
              const isCurrentFolderActive = activeFolder === folderName;

              return (
                <div key={fObj.id || folderName} className="space-y-0.5">
                  <div className="flex items-center justify-between rounded-xl hover:bg-white/60 dark:hover:bg-[#1D2025]/60 px-2 py-1.5 transition-colors">
                    <button
                      onClick={() => toggleFolder(folderName)}
                      className="p-1 text-[#4A4A4A] dark:text-[#9EA3A0] hover:text-[#0A0A0A] dark:hover:text-[#F5F5F0]"
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5" />
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setActiveFolder(folderName);
                        setActiveFilter('all');
                      }}
                      className={`flex-1 text-left text-xs font-mono font-medium truncate px-1.5 ${
                        isCurrentFolderActive
                          ? 'text-[#B45309] dark:text-[#E6AF2E] font-bold'
                          : 'text-[#0A0A0A] dark:text-[#F5F5F0]'
                      }`}
                    >
                      {folderName}
                    </button>

                    <span className="text-[10px] font-mono tabular-nums text-[#4A4A4A] dark:text-[#9EA3A0] px-1">
                      {folderFeeds.length}
                    </span>
                  </div>

                  {/* Feeds under this Folder */}
                  {isExpanded && (
                    <div className="ml-5 space-y-0.5 border-l border-[#D5CFBE] dark:border-[#2A2E35] pl-2">
                      {folderFeeds.map((feed) => {
                        const isFeedActive = activeFilter === feed.id;
                        return (
                          <div
                            key={feed.id}
                            className={`group flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                              isFeedActive
                                ? 'bg-white dark:bg-[#1D2025] font-bold text-[#0A0A0A] dark:text-[#E6AF2E] shadow-sm border border-[#D5CFBE] dark:border-[#2A2E35]'
                                : 'text-[#262626] dark:text-[#C8CCC5] hover:text-[#0A0A0A] dark:hover:text-[#F5F5F0] hover:bg-white/50 dark:hover:bg-[#1D2025]/50'
                            }`}
                          >
                            <button
                              onClick={() => {
                                setActiveFilter(feed.id);
                                setActiveFolder('all');
                              }}
                              className="flex items-center gap-2 truncate text-left flex-1"
                              title={feed.title}
                            >
                              <Rss className="h-3 w-3 text-[#B45309] dark:text-[#E6AF2E] shrink-0" />
                              <span className="truncate font-body text-[12px]">{feed.title}</span>
                            </button>

                            <div className="flex items-center gap-1 shrink-0">
                              {feed.unreadCount > 0 && (
                                <span className="text-[9px] px-1 py-0.2 rounded bg-[#E6AF2E]/20 text-[#B45309] dark:text-[#E6AF2E] font-mono tabular-nums font-bold">
                                  {feed.unreadCount}
                                </span>
                              )}
                              <button
                                onClick={() => deleteFeed(feed.id)}
                                className="opacity-0 group-hover:opacity-100 p-0.5 text-[#4A4A4A] hover:text-rose-600 transition-opacity"
                                title="Unsubscribe"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sidebar Footer Broadsheet Masthead Note */}
      <div className="pt-4 border-t border-[#D5CFBE] dark:border-[#2A2E35] text-[10px] font-mono tabular-nums text-[#4A4A4A] dark:text-[#9EA3A0] space-y-1">
        <p className="font-bold text-[#0A0A0A] dark:text-[#F5F5F0] uppercase tracking-wider font-kicker">
          INCOGNIREAD ARCHIVE
        </p>
        <p>Client RSS • Zero Metadata</p>
      </div>
    </aside>
  );
};
