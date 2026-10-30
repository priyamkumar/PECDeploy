import React, { useState } from 'react';
import { useFeeds } from '../../context/FeedContext';
import { Radio, Zap, ArrowRight, Pause, Play, Sparkles } from 'lucide-react';
import { timeAgo } from '../../lib/utils';
import { playTactileClick } from '../../lib/sound-effects';

export const TelegraphTicker: React.FC = () => {
  const { articles, setReadingArticle } = useFeeds();
  const [isPaused, setIsPaused] = useState(false);

  if (articles.length === 0) return null;

  const topArticles = articles.slice(0, 10);

  const handleArticleClick = (art: any) => {
    playTactileClick();
    setReadingArticle(art);
  };

  return (
    <div className="w-full border-b border-[#D5CFBE] dark:border-[#2A2E35] bg-[#ECE8DF]/90 dark:bg-[#141619]/90 backdrop-blur-md overflow-hidden py-1.5 px-4 select-none transition-colors duration-250">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Ticker Lead Badge */}
        <div className="flex items-center gap-2 shrink-0 pr-3 border-r border-[#D5CFBE] dark:border-[#2A2E35]">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B45309] dark:bg-[#E6AF2E] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B45309] dark:bg-[#E6AF2E]"></span>
          </span>
          <span className="font-kicker text-[10px] font-semibold tracking-[0.12em] uppercase text-[#B45309] dark:text-[#E6AF2E] flex items-center gap-1">
            <Radio className="h-3 w-3 animate-pulse" />
            <span className="hidden sm:inline">TELEGRAPH WIRE</span>
            <span className="sm:hidden">WIRE</span>
          </span>
        </div>

        {/* Marquee Content */}
        <div
          className="flex-1 overflow-hidden relative cursor-pointer group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className={`flex items-center gap-8 whitespace-nowrap text-xs font-mono tabular-nums transition-transform duration-300 ${
              isPaused ? '' : 'animate-[marquee_45s_linear_infinite]'
            }`}
          >
            {topArticles.concat(topArticles).map((art, idx) => (
              <div
                key={`${art.id}-${idx}`}
                onClick={() => handleArticleClick(art)}
                className="inline-flex items-center gap-2 text-[#0A0A0A] dark:text-[#F5F5F0] hover:text-[#B45309] dark:hover:text-[#E6AF2E] transition-colors shrink-0 group/item"
              >
                <span className="px-1.5 py-0.5 rounded bg-white dark:bg-[#1D2025] border border-[#D5CFBE] dark:border-[#2A2E35] text-[10px] text-[#B45309] dark:text-[#E6AF2E] font-bold">
                  {art.feedTitle}
                </span>
                <span className="font-headline font-bold text-[13px] tracking-tight group-hover/item:underline">
                  {art.title}
                </span>
                <span className="text-[10px] font-mono tabular-nums text-[#4A4A4A] dark:text-[#9EA3A0]">
                  [{timeAgo(art.publishedAt)}]
                </span>
                <span className="text-[#B45309]/50 dark:text-[#E6AF2E]/50">✦</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ticker Controls */}
        <div className="flex items-center gap-1.5 shrink-0 pl-3 border-l border-[#D5CFBE] dark:border-[#2A2E35]">
          <button
            onClick={() => {
              playTactileClick();
              setIsPaused(!isPaused);
            }}
            className="p-1 text-[#4A4A4A] dark:text-[#9EA3A0] hover:text-[#0A0A0A] dark:hover:text-[#F5F5F0] rounded transition-colors"
            title={isPaused ? 'Resume wire scroll' : 'Pause wire scroll'}
          >
            {isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
          </button>
        </div>
      </div>
    </div>
  );
};
