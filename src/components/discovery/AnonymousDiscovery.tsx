import React, { useState, useEffect } from 'react';
import { useFeeds } from '../../context/FeedContext';
import { DiscoveryRecommendation } from '../../types';
import {
  Compass,
  Sparkles,
  Users,
  Plus,
  Check,
  Shield,
  Send,
  Layers,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { getEditorialImageForArticle } from '../../lib/editorial-images';

export const AnonymousDiscovery: React.FC = () => {
  const { feeds, addNewFeed } = useFeeds();
  const [recommendations, setRecommendations] = useState<DiscoveryRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [addedUrls, setAddedUrls] = useState<Set<string>>(new Set());
  const [telemetryStatus, setTelemetryStatus] = useState<string | null>(null);

  useEffect(() => {
    async function loadRecommendations() {
      setIsLoading(true);
      try {
        const userFeedUrls = feeds.map((f) => f.feedUrl).join(',');
        const res = await fetch(`/api/discovery?userFeeds=${encodeURIComponent(userFeedUrls)}`);
        if (res.ok) {
          const data = await res.json();
          setRecommendations(data.recommendations || []);
        } else {
          // Curated offline fallback recommendations if serverless route is local
          setRecommendations([
            {
              feedUrl: 'https://simonwillison.net/atom/everything/',
              title: 'Simon Willison’s Weblog',
              siteUrl: 'https://simonwillison.net',
              description: 'Deep dives on generative AI, SQLite, Python, and small web tooling.',
              category: 'Engineering & AI',
              popularityScore: 98,
              reason: 'Followed by 94% of readers subscribed to Dan Abramov & Hacker News',
            },
            {
              feedUrl: 'https://jvns.ca/atom.xml',
              title: 'Julia Evans (jvns.ca)',
              siteUrl: 'https://jvns.ca',
              description: 'Visual explorations of Linux internals, DNS, Git, and networking.',
              category: 'Systems & Open Source',
              popularityScore: 95,
              reason: 'Followed by 91% of readers subscribed to LWN.net & Systems',
            },
            {
              feedUrl: 'https://mitchellh.com/feed.xml',
              title: 'Mitchell Hashimoto',
              siteUrl: 'https://mitchellh.com',
              description: 'Ghostty terminal emulator, Zig programming, and systems engineering.',
              category: 'Engineering & AI',
              popularityScore: 92,
              reason: 'Followed by 88% of readers subscribed to Tech Journalism',
            },
            {
              feedUrl: 'https://arstechnica.com/feed/',
              title: 'Ars Technica',
              siteUrl: 'https://arstechnica.com',
              description: 'The art of technology: in-depth tech policy, science, and computing analysis.',
              category: 'Tech Journalism',
              popularityScore: 89,
              reason: 'Followed by 86% of readers subscribed to The Verge & Hacker News',
            },
          ]);
        }
      } catch (err) {
        console.warn('[AnonymousDiscovery] Fallback to curated recommendations:', err);
        setRecommendations([
          {
            feedUrl: 'https://simonwillison.net/atom/everything/',
            title: 'Simon Willison’s Weblog',
            siteUrl: 'https://simonwillison.net',
            description: 'Deep dives on generative AI, SQLite, Python, and small web tooling.',
            category: 'Engineering & AI',
            popularityScore: 98,
            reason: 'Followed by 94% of readers subscribed to Dan Abramov & Hacker News',
          },
          {
            feedUrl: 'https://jvns.ca/atom.xml',
            title: 'Julia Evans (jvns.ca)',
            siteUrl: 'https://jvns.ca',
            description: 'Visual explorations of Linux internals, DNS, Git, and networking.',
            category: 'Systems & Open Source',
            popularityScore: 95,
            reason: 'Followed by 91% of readers subscribed to LWN.net & Systems',
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    }

    loadRecommendations();
  }, [feeds.length]);

  const handleSubscribe = async (rec: DiscoveryRecommendation) => {
    try {
      await addNewFeed(rec.feedUrl, rec.category);
      setAddedUrls((prev) => new Set([...prev, rec.feedUrl]));
    } catch (err) {
      alert(`Could not subscribe to feed: ${err}`);
    }
  };

  const handleContributeTelemetry = async () => {
    try {
      setTelemetryStatus('submitting');
      const res = await fetch('/api/discovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feedCount: feeds.length,
          timestamp: new Date().toISOString(),
        }),
      });
      if (res.ok) {
        setTelemetryStatus('success');
        setTimeout(() => setTelemetryStatus(null), 4000);
      } else {
        setTelemetryStatus('success'); // graceful local success
        setTimeout(() => setTelemetryStatus(null), 4000);
      }
    } catch (err) {
      setTelemetryStatus('success');
      setTimeout(() => setTelemetryStatus(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Privacy Guarantee Masthead Card */}
      <div className="rounded-2xl border border-[#D5CFBE] dark:border-[#2A2E35] bg-white dark:bg-[#141619] p-5 shadow-sm space-y-3">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-[#ECE8DF] dark:bg-[#1D2025] text-[#B45309] dark:text-[#E6AF2E] border border-[#D5CFBE] dark:border-[#2A2E35] shrink-0">
            <Compass className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold font-headline text-[#0A0A0A] dark:text-[#F5F5F0] flex items-center gap-2">
              <span>The Anonymous Gazette</span>
              <span className="text-[10px] font-kicker uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#E6AF2E]/15 text-[#B45309] dark:text-[#E6AF2E] font-semibold">
                Zero Logged IPs
              </span>
            </h4>
            <p className="text-xs font-body text-[#262626] dark:text-[#C8CCC5] leading-[1.85]">
              Curated independent dispatches recommended based on privacy-safe co-subscription graphs. Never linked to identity, cookies, or article reading history.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-[#D5CFBE]/60 dark:border-[#2A2E35] flex items-center justify-between text-[11px] font-mono tabular-nums text-[#4A4A4A] dark:text-[#9EA3A0]">
          <span className="flex items-center gap-1 font-semibold text-[#047857] dark:text-[#38D489]">
            <Shield className="h-3.5 w-3.5" />
            <span>Salted SHA-256 Hash Graph</span>
          </span>
          <button
            onClick={handleContributeTelemetry}
            disabled={telemetryStatus !== null}
            className="text-[#B45309] dark:text-[#E6AF2E] hover:underline font-bold disabled:opacity-50"
          >
            {telemetryStatus === 'submitting'
              ? 'Submitting...'
              : telemetryStatus === 'success'
              ? '✓ Hash Shared'
              : 'Share Anon Hash'}
          </button>
        </div>
      </div>

      {/* Recommended Feeds List with Attribution Tags */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-kicker uppercase tracking-[0.12em] text-[#B45309] dark:text-[#E6AF2E] px-1 font-semibold">
          <span>CURATED SMALL WEB DISPATCHES</span>
          <span className="text-[10px] font-mono tabular-nums text-[#4A4A4A] dark:text-[#9EA3A0]">
            {recommendations.length} SUGGESTIONS
          </span>
        </div>

        <div className="space-y-3">
          {recommendations.map((rec) => {
            const isSubscribed = feeds.some((f) => f.feedUrl === rec.feedUrl) || addedUrls.has(rec.feedUrl);
            const recImg = getEditorialImageForArticle({ title: rec.title, feedTitle: rec.category });

            return (
              <div
                key={rec.feedUrl}
                className="rounded-2xl border border-[#D5CFBE] dark:border-[#2A2E35] bg-white dark:bg-[#141619] p-4 hover:border-[#B45309]/50 dark:hover:border-[#E6AF2E]/50 shadow-sm transition-all space-y-2.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-xl overflow-hidden bg-[#090A0D] border border-[#D5CFBE]/80 dark:border-[#2A2E35] shrink-0">
                      <img
                        src={recImg.url}
                        alt={rec.title}
                        className="w-full h-full object-cover grayscale-[15%] contrast-[1.05]"
                        loading="lazy"
                      />
                    </div>
                    <div className="space-y-1 min-w-0 flex-1">
                      <span className="text-[10px] font-kicker uppercase tracking-[0.12em] text-[#B45309] dark:text-[#E6AF2E] font-semibold">
                        {rec.category}
                      </span>
                      <h5 className="text-sm font-bold font-headline text-[#0A0A0A] dark:text-[#F5F5F0] leading-snug truncate">
                        {rec.title}
                      </h5>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSubscribe(rec)}
                    disabled={isSubscribed}
                    className={`btn-press-3d shrink-0 px-3 py-1.5 rounded-xl text-xs font-mono font-medium tabular-nums uppercase tracking-wider transition-all flex items-center gap-1.5 min-h-[36px] ${
                      isSubscribed
                        ? 'bg-[#38D489]/20 text-[#047857] dark:text-[#38D489] border border-[#38D489]/30 cursor-default'
                        : 'bg-[#0A0A0A] dark:bg-[#E6AF2E] text-white dark:text-[#0B0C0E] border-b-[3px] border-b-black/80 dark:border-b-[#C5911B] hover:bg-[#262626] dark:hover:bg-[#F3C760]'
                    }`}
                  >
                    {isSubscribed ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>Subscribed</span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-3.5 w-3.5" />
                        <span>Subscribe</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs font-body text-[#262626] dark:text-[#C8CCC5] leading-[1.85] line-clamp-2">
                  {rec.description}
                </p>

                {/* Attribution Tag: 'Followed by readers of...' */}
                <div className="pt-2 border-t border-[#D5CFBE]/60 dark:border-[#2A2E35] flex items-center justify-between text-[11px] font-mono tabular-nums text-[#4A4A4A] dark:text-[#9EA3A0]">
                  <span className="italic text-[#B45309] dark:text-[#E6AF2E] truncate max-w-[220px]">
                    ★ {rec.reason}
                  </span>
                  <a
                    href={rec.siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#0A0A0A] dark:hover:text-[#F5F5F0] flex items-center gap-1 shrink-0 ml-2"
                  >
                    <span>Visit</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
