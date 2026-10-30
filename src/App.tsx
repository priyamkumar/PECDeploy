import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { RightPanel } from './components/layout/RightPanel';
import { MobileNav } from './components/layout/MobileNav';
import { TelegraphTicker } from './components/layout/TelegraphTicker';
import { InspectableNewspaperHero } from './components/feed/InspectableNewspaperHero';
import { UnifiedTimeline } from './components/feed/UnifiedTimeline';
import { ReaderView } from './components/feed/ReaderView';
import { FloatingAudioPlayer } from './components/audio/FloatingAudioPlayer';
import { AddFeedModal } from './components/feed/AddFeedModal';
import { AnonymousDiscovery } from './components/discovery/AnonymousDiscovery';
import { useFeeds } from './context/FeedContext';
import { Compass, Newspaper, Shield, BookOpen, ArrowLeft } from 'lucide-react';

export const App: React.FC = () => {
  const { activeFilter, activeFolder, readingArticle, setReadingArticle, articles } = useFeeds();
  const [isAddFeedOpen, setIsAddFeedOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Client-Side Routing: '/' | '/read/:id' | '/discover'
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.startsWith('/read') || path === '/discover') return path;
    }
    return '/';
  });

  const navigate = (route: string) => {
    setCurrentRoute(route);
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', route);
    }
  };

  // Sync URL when user opens an article or closes reader
  useEffect(() => {
    if (readingArticle) {
      navigate(`/read/${readingArticle.id}`);
    } else if (currentRoute.startsWith('/read')) {
      navigate('/');
    }
  }, [readingArticle?.id]);

  // Handle browser back/forward buttons (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      setCurrentRoute(path);

      if (path.startsWith('/read/')) {
        const articleId = path.replace('/read/', '');
        const targetArticle = articles.find((a) => a.id === articleId);
        if (targetArticle) {
          setReadingArticle(targetArticle);
        }
      } else {
        setReadingArticle(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [articles]);

  // Initial load: restore article if URL is /read/:id
  useEffect(() => {
    if (currentRoute.startsWith('/read/') && !readingArticle && articles.length > 0) {
      const articleId = currentRoute.replace('/read/', '');
      const targetArticle = articles.find((a) => a.id === articleId);
      if (targetArticle) {
        setReadingArticle(targetArticle);
      }
    }
  }, [currentRoute, articles, readingArticle]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#F4F1EA] dark:bg-[#0B0C0E] text-[#0A0A0A] dark:text-[#F5F5F0] flex flex-col transition-colors duration-250">
      {/* Top Broadsheet Masthead Navbar */}
      <Navbar
        currentRoute={currentRoute}
        onNavigate={navigate}
        onOpenAddFeed={() => setIsAddFeedOpen(true)}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
      />

      {/* Interactive Breaking Telegraph Wire Ticker */}
      <TelegraphTicker />

      {/* Mobile Drawer Navigation */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpenAddFeed={() => setIsAddFeedOpen(true)}
        onOpenDiscovery={() => navigate('/discover')}
        onNavigateHome={() => navigate('/')}
      />

      {/* 3-Column Responsive Broadsheet Shell with Generous Horizontal Gutters */}
      <div className="relative z-10 flex-1 flex w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        {/* Left Column: Broadsheet Editions & Department Sidebar (Desktop >= 1024px) */}
        <Sidebar onOpenAddFeed={() => setIsAddFeedOpen(true)} />

        {/* Central Column: Switchable Views */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-28">
          {currentRoute === '/discover' ? (
            /* Page 3: The Anonymous Gazette Dedicated View */
            <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
              <div className="flex items-center justify-between pb-4 border-b border-[#D5CFBE] dark:border-[#2A2E35]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-kicker uppercase tracking-[0.12em] text-[#B45309] dark:text-[#E6AF2E] font-semibold">
                    <Compass className="h-4 w-4" />
                    <span>THE ANONYMOUS GAZETTE</span>
                  </div>
                  <h2 className="text-3xl font-bold font-headline tracking-[-0.02em] text-[#0A0A0A] dark:text-[#F5F5F0]">
                    Independent Small Web Directory
                  </h2>
                  <p className="text-xs font-body leading-[1.85] text-[#4A4A4A] dark:text-[#9EA3A0]">
                    Curated publications ranked by anonymous co-subscription networks without tracking pixels.
                  </p>
                </div>

                <button
                  onClick={() => navigate('/')}
                  className="btn-press-3d flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-medium tabular-nums bg-white dark:bg-[#141619] text-[#0A0A0A] dark:text-[#F5F5F0] border border-[#D5CFBE] dark:border-[#2A2E35] border-b-[3px]"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Return to Dispatch</span>
                </button>
              </div>

              <AnonymousDiscovery />
            </div>
          ) : (
            /* Page 1: Broadsheet Dispatch / Timeline */
            <div className="space-y-8 animate-fade-in">
              {/* Inspectable Newspaper Hero with Interactive Magnifying Glass */}
              {activeFilter === 'all' && activeFolder === 'all' && (
                <InspectableNewspaperHero
                  onOpenAddFeed={() => setIsAddFeedOpen(true)}
                  onExploreDiscovery={() => navigate('/discover')}
                />
              )}

              {/* Main Feed Timeline */}
              <UnifiedTimeline />
            </div>
          )}
        </main>

        {/* Right Column: Audio Queue & Gazette Briefs (Desktop >= 1280px) */}
        <RightPanel />
      </div>

      {/* Page 2: Dedicated Column Reader View (`/read/:id`) */}
      {readingArticle && <ReaderView onBack={() => navigate('/')} />}

      {/* Persistent Floating Audio Narration Player */}
      <FloatingAudioPlayer />

      {/* Add Feed Modal */}
      <AddFeedModal
        isOpen={isAddFeedOpen}
        onClose={() => setIsAddFeedOpen(false)}
      />
    </div>
  );
};

export default App;
