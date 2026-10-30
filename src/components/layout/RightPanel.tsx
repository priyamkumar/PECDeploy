import React, { useState } from 'react';
import { useAudio } from '../../context/AudioContext';
import { useFeeds } from '../../context/FeedContext';
import { AnonymousDiscovery } from '../discovery/AnonymousDiscovery';
import {
  ListMusic,
  Compass,
  Play,
  Trash2,
  Clock,
  Sparkles,
} from 'lucide-react';

export const RightPanel: React.FC = () => {
  const { queue, removeFromQueue, playArticle } = useAudio();
  const { articles } = useFeeds();
  const [activeTab, setActiveTab] = useState<'queue' | 'discovery'>('discovery');

  const handlePlayQueueItem = (articleId: string) => {
    const article = articles.find((a) => a.id === articleId);
    if (article) {
      playArticle(article);
    }
  };

  return (
    <aside className="hidden xl:flex w-80 flex-col border-l border-[#D5CFBE] dark:border-[#2A2E35] bg-[#ECE8DF]/50 dark:bg-[#141619]/60 backdrop-blur-xl p-4 min-h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto transition-colors duration-250">
      {/* Editorial Tab Switcher: Gazette Discovery vs Audio Queue */}
      <div className="flex p-1 rounded-xl bg-[#ECE8DF] dark:bg-[#141619] border border-[#D5CFBE] dark:border-[#2A2E35] mb-5 text-xs font-kicker select-none">
        <button
          onClick={() => setActiveTab('discovery')}
          className={`btn-press-3d flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg font-semibold uppercase tracking-[0.08em] transition-all min-h-[36px] ${
            activeTab === 'discovery'
              ? 'bg-white dark:bg-[#0B0C0E] text-[#0A0A0A] dark:text-[#E6AF2E] border border-[#D5CFBE] dark:border-[#2A2E35] shadow-sm'
              : 'text-[#262626] dark:text-[#C8CCC5] hover:text-[#0A0A0A] dark:hover:text-[#F5F5F0]'
          }`}
        >
          <Compass className="h-3.5 w-3.5 text-[#B45309] dark:text-[#E6AF2E]" />
          <span>The Gazette</span>
        </button>

        <button
          onClick={() => setActiveTab('queue')}
          className={`btn-press-3d flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg font-semibold uppercase tracking-[0.08em] transition-all min-h-[36px] ${
            activeTab === 'queue'
              ? 'bg-white dark:bg-[#0B0C0E] text-[#0A0A0A] dark:text-[#E6AF2E] border border-[#D5CFBE] dark:border-[#2A2E35] shadow-sm'
              : 'text-[#262626] dark:text-[#C8CCC5] hover:text-[#0A0A0A] dark:hover:text-[#F5F5F0]'
          }`}
        >
          <ListMusic className="h-3.5 w-3.5 text-[#B45309] dark:text-[#E6AF2E]" />
          <span>Audio Stack</span>
          {queue.length > 0 && (
            <span className="ml-1 px-1.5 py-0.2 text-[9px] rounded-full bg-[#B45309] dark:bg-[#E6AF2E] text-white dark:text-[#0B0C0E] font-bold font-mono tabular-nums">
              {queue.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'discovery' ? (
        <AnonymousDiscovery />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-kicker uppercase tracking-[0.12em] text-[#B45309] dark:text-[#E6AF2E] px-1 font-semibold">
            <span>PRINT NARRATION STACK</span>
            <span className="text-[10px] font-mono tabular-nums text-[#4A4A4A] dark:text-[#9EA3A0]">{queue.length} DISPATCHES</span>
          </div>

          {queue.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#D5CFBE] dark:border-[#2A2E35] p-8 text-center space-y-2 bg-white/50 dark:bg-[#141619]/40">
              <ListMusic className="h-6 w-6 text-[#B45309]/50 dark:text-[#E6AF2E]/50 mx-auto" />
              <p className="text-xs font-body text-[#4A4A4A] dark:text-[#9EA3A0]">Your audio queue is empty.</p>
              <p className="text-[11px] font-body text-[#4A4A4A] dark:text-[#9EA3A0]">
                Click "+" on any dispatch to stack stories for continuous audio read-aloud.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {queue.map((item) => (
                <div
                  key={item.id}
                  className="group p-3 rounded-xl border border-[#D5CFBE] dark:border-[#2A2E35] bg-white dark:bg-[#141619] hover:border-[#B45309]/50 dark:hover:border-[#E6AF2E]/50 shadow-sm transition-all text-xs space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold font-headline text-[#0A0A0A] dark:text-[#F5F5F0] line-clamp-2 leading-snug">
                      {item.title}
                    </span>
                    <button
                      onClick={() => removeFromQueue(item.id)}
                      className="p-1 text-[#4A4A4A] dark:text-[#9EA3A0] hover:text-rose-600 transition-colors"
                      title="Remove from queue"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono tabular-nums text-[#4A4A4A] dark:text-[#9EA3A0] pt-1 border-t border-[#D5CFBE]/60 dark:border-[#2A2E35]">
                    <span className="text-[#B45309] dark:text-[#E6AF2E] font-semibold truncate max-w-[120px]">
                      {item.feedTitle}
                    </span>
                    <button
                      onClick={() => handlePlayQueueItem(item.articleId)}
                      className="text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 font-bold"
                    >
                      <Play className="h-3 w-3 fill-current" />
                      <span>Play Now</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </aside>
  );
};
