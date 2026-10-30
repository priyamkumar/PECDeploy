import React, { useState } from 'react';
import { useFeeds } from '../../context/FeedContext';
import { useTheme, FONT_PAIRS } from '../../context/ThemeContext';
import {
  Search,
  Plus,
  Wifi,
  WifiOff,
  RefreshCw,
  Menu,
  Sun,
  Moon,
  Newspaper,
  Compass,
  BookOpen,
  Type,
  ChevronDown,
  Check,
} from 'lucide-react';
import { playTactileClick } from '../../lib/sound-effects';

export interface NavbarProps {
  currentRoute: '/' | '/discover' | string;
  onNavigate: (route: string) => void;
  onOpenAddFeed: () => void;
  onOpenMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
  onOpenAddFeed,
  onOpenMobileMenu,
}) => {
  const { searchQuery, setSearchQuery, isOnline, isSyncing, syncAllFeeds, readingArticle } = useFeeds();
  const { theme, toggleTheme, fontPair, setFontPair } = useTheme();
  const [isFontDropdownOpen, setIsFontDropdownOpen] = useState(false);

  const currentPair = FONT_PAIRS.find((p) => p.id === fontPair);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#D5CFBE] dark:border-[#2A2E35] bg-[#F4F1EA]/95 dark:bg-[#0B0C0E]/95 backdrop-blur-xl transition-colors duration-250">
      {/* Topmost Micro-Dateline Rule */}
      <div className="border-b border-[#D5CFBE]/80 dark:border-[#2A2E35]/80 bg-[#ECE8DF]/70 dark:bg-[#141619]/70 px-4 sm:px-8 py-1.5 flex items-center justify-between text-[10px] font-kicker tracking-[0.12em] uppercase text-[#262626] dark:text-[#C8CCC5] select-none font-semibold">
        <div className="flex items-center gap-2">
          <span>THE ANONYMOUS EDITORIAL &amp; SMALL WEB DISPATCH</span>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:inline font-mono tabular-nums">EDITION: OCT 2026 • NO. 402</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="hidden sm:inline">CLIENT-SIDE ENCRYPTED CACHE</span>
          <span>•</span>
          <span className="flex items-center gap-1 font-bold">
            {isOnline ? (
              <>
                <Wifi className="h-2.5 w-2.5 text-[#38D489]" />
                <span className="text-[#047857] dark:text-[#38D489]">DISPATCH READY</span>
              </>
            ) : (
              <>
                <WifiOff className="h-2.5 w-2.5 text-rose-500" />
                <span className="text-rose-500">OFFLINE ARCHIVE</span>
              </>
            )}
          </span>
        </div>
      </div>

      {/* Main Editorial Masthead Bar */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-3 sm:gap-6">
        {/* Brand & Mobile Hamburger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenMobileMenu}
            aria-label="Open broadsheet menu"
            className="lg:hidden rounded-lg p-2 text-[#0A0A0A] dark:text-[#F5F5F0] hover:bg-[#ECE8DF] dark:hover:bg-[#1D2025] border border-[#D5CFBE] dark:border-[#2A2E35] transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div
            onClick={() => onNavigate('/')}
            className="flex items-center gap-3 cursor-pointer select-none group"
            title="IncogniRead Home"
          >
            {/* Elegant Vintage Wax Seal Emblem Logo */}
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#0A0A0A] dark:bg-[#E6AF2E] text-white dark:text-[#0B0C0E] font-serif font-bold text-base shadow-md group-hover:scale-105 transition-transform border border-black/20 dark:border-white/20">
              <span className="tracking-tighter font-headline">IR</span>
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E6AF2E] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#B45309] dark:bg-[#E6AF2E]"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-bold tracking-[-0.02em] text-[#0A0A0A] dark:text-[#F5F5F0] font-headline">
                  IncogniRead<span className="text-[#B45309] dark:text-[#E6AF2E]">.</span>
                </span>
              </div>
              <p className="hidden sm:block text-[9px] font-kicker tracking-[0.12em] text-[#4A4A4A] dark:text-[#C8CCC5] uppercase font-semibold">
                The Anonymous Editorial
              </p>
            </div>
          </div>
        </div>

        {/* 3-Page Client Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-[#ECE8DF] dark:bg-[#141619] border border-[#D5CFBE] dark:border-[#2A2E35] text-xs font-kicker select-none">
          <button
            onClick={() => {
              playTactileClick();
              onNavigate('/');
            }}
            className={`btn-press-3d flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-semibold tracking-[0.08em] uppercase transition-all ${
              currentRoute === '/'
                ? 'bg-white dark:bg-[#0B0C0E] text-[#0A0A0A] dark:text-[#E6AF2E] border border-[#D5CFBE] dark:border-[#2A2E35] shadow-sm'
                : 'text-[#262626] dark:text-[#C8CCC5] hover:text-[#0A0A0A] dark:hover:text-[#F5F5F0]'
            }`}
          >
            <Newspaper className="h-3.5 w-3.5" />
            <span>Dispatch</span>
          </button>

          {readingArticle && (
            <button
              onClick={() => {
                playTactileClick();
                onNavigate(`/read/${readingArticle.id}`);
              }}
              className={`btn-press-3d flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-semibold tracking-[0.08em] uppercase transition-all ${
                currentRoute.startsWith('/read')
                  ? 'bg-white dark:bg-[#0B0C0E] text-[#0A0A0A] dark:text-[#E6AF2E] border border-[#D5CFBE] dark:border-[#2A2E35] shadow-sm'
                  : 'text-[#262626] dark:text-[#C8CCC5] hover:text-[#0A0A0A] dark:hover:text-[#F5F5F0]'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Column Reader</span>
            </button>
          )}

          <button
            onClick={() => {
              playTactileClick();
              onNavigate('/discover');
            }}
            className={`btn-press-3d flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-semibold tracking-[0.08em] uppercase transition-all ${
              currentRoute === '/discover'
                ? 'bg-white dark:bg-[#0B0C0E] text-[#0A0A0A] dark:text-[#E6AF2E] border border-[#D5CFBE] dark:border-[#2A2E35] shadow-sm'
                : 'text-[#262626] dark:text-[#C8CCC5] hover:text-[#0A0A0A] dark:hover:text-[#F5F5F0]'
            }`}
          >
            <Compass className="h-3.5 w-3.5" />
            <span>The Gazette</span>
          </button>
        </nav>

        {/* Global Search Box (Desktop/Tablet) */}
        <div className="flex-1 max-w-xs xl:max-w-sm hidden lg:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#B45309] dark:text-[#E6AF2E] pointer-events-none" />
            <input
              type="text"
              placeholder="Search dispatches &amp; stories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-4 rounded-xl border border-[#D5CFBE] dark:border-[#2A2E35] bg-white dark:bg-[#141619] text-xs font-body text-[#0A0A0A] dark:text-[#F5F5F0] placeholder:text-[#4A4A4A] dark:placeholder:text-[#9EA3A0] focus:outline-none focus:border-[#0A0A0A] dark:focus:border-[#E6AF2E] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono tabular-nums text-[#4A4A4A] dark:text-[#9EA3A0] hover:text-[#0A0A0A] dark:hover:text-[#F5F5F0]"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Right Action Suite: Font Switcher, 3D Physical Theme Toggle, Sync & Add Feed */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Interactive Font Pairing Dropdown Selector */}
          <div className="relative">
            <button
              onClick={() => {
                playTactileClick();
                setIsFontDropdownOpen(!isFontDropdownOpen);
              }}
              aria-label="Select typography pairing"
              className="btn-press-3d flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs font-mono font-medium tabular-nums select-none bg-white dark:bg-[#141619] text-[#0A0A0A] dark:text-[#F5F5F0] border border-[#D5CFBE] dark:border-[#2A2E35] border-b-[3px] border-b-[#B4ACA0] dark:border-b-black shadow-sm hover:bg-[#ECE8DF] dark:hover:bg-[#1D2025] transition-all min-h-[38px]"
              title="Change Typography Pairing"
            >
              <Type className="h-3.5 w-3.5 text-[#B45309] dark:text-[#E6AF2E]" />
              <span className="hidden xl:inline max-w-[120px] truncate">{currentPair?.name || 'Type'}</span>
              <ChevronDown className="h-3 w-3 opacity-70" />
            </button>

            {isFontDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsFontDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-[#141619] border border-[#D5CFBE] dark:border-[#2A2E35] shadow-2xl p-2 z-50 animate-slide-up">
                  <div className="px-3 py-2 border-b border-[#D5CFBE]/60 dark:border-[#2A2E35] text-[10px] font-kicker uppercase tracking-[0.12em] text-[#B45309] dark:text-[#E6AF2E] font-semibold flex items-center justify-between">
                    <span>Typography Pairing</span>
                    <span className="text-[9px] opacity-80">Editorial Stack</span>
                  </div>
                  <div className="py-1 space-y-1">
                    {FONT_PAIRS.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => {
                          playTactileClick();
                          setFontPair(option.id);
                          setIsFontDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-start justify-between ${
                          fontPair === option.id
                            ? 'bg-[#E6AF2E]/15 text-[#B45309] dark:text-[#E6AF2E] font-bold border border-[#B45309]/20 dark:border-[#E6AF2E]/20'
                            : 'hover:bg-[#ECE8DF] dark:hover:bg-[#1D2025] text-[#0A0A0A] dark:text-[#F5F5F0]'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold font-headline tracking-tight">{option.name}</div>
                          <div className="text-[10px] font-mono tabular-nums opacity-90 mt-0.5 text-[#262626] dark:text-[#C8CCC5]">
                            {option.headlineFont} + {option.bodyFont}
                          </div>
                          <div className="text-[10px] font-body opacity-80 mt-0.5 line-clamp-1 text-[#4A4A4A] dark:text-[#9EA3A0]">
                            {option.description}
                          </div>
                        </div>
                        {fontPair === option.id && (
                          <Check className="h-3.5 w-3.5 text-[#B45309] dark:text-[#E6AF2E] shrink-0 mt-0.5 ml-1" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Prominent 3D Physical Theme Toggle Button */}
          <button
            onClick={() => {
              playTactileClick();
              toggleTheme();
            }}
            aria-label="Toggle theme between Aged Broadsheet and Midnight Press"
            className="btn-press-3d flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-mono font-medium tabular-nums tracking-wider select-none bg-white dark:bg-[#141619] text-[#0A0A0A] dark:text-[#F5F5F0] border border-[#D5CFBE] dark:border-[#2A2E35] border-b-[3px] border-b-[#B4ACA0] dark:border-b-black shadow-sm hover:bg-[#ECE8DF] dark:hover:bg-[#1D2025] transition-all min-h-[38px]"
            title={`Switch to ${theme === 'dark' ? 'Aged Broadsheet Edition' : 'Midnight Press Edition'}`}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="h-4 w-4 text-[#E6AF2E] fill-[#E6AF2E]/20" />
                <span className="hidden sm:inline">☀️ Paper</span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 text-[#B45309] fill-[#B45309]/20" />
                <span className="hidden sm:inline">🌙 Midnight</span>
              </>
            )}
          </button>

          {/* Sync Button */}
          <button
            onClick={() => {
              playTactileClick();
              syncAllFeeds();
            }}
            disabled={isSyncing}
            className="btn-press-3d p-2 rounded-xl bg-white dark:bg-[#141619] text-[#0A0A0A] dark:text-[#F5F5F0] border border-[#D5CFBE] dark:border-[#2A2E35] border-b-[3px] border-b-[#B4ACA0] dark:border-b-black shadow-sm hover:bg-[#ECE8DF] dark:hover:bg-[#1D2025] transition-all min-h-[38px] min-w-[38px] flex items-center justify-center"
            title="Sync all dispatches"
          >
            <RefreshCw className={`h-4 w-4 text-[#B45309] dark:text-[#E6AF2E] ${isSyncing ? 'animate-spin' : ''}`} />
          </button>

          {/* Subscribe / Add Feed 3D Button */}
          <button
            onClick={() => {
              playTactileClick();
              onOpenAddFeed();
            }}
            className="btn-press-3d flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-xl bg-[#0A0A0A] dark:bg-[#E6AF2E] text-white dark:text-[#0B0C0E] font-bold text-xs uppercase tracking-wider border-b-[3px] border-b-black/70 dark:border-b-[#C5911B] shadow-md hover:bg-[#262626] dark:hover:bg-[#F3C760] transition-all min-h-[38px]"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Feed</span>
          </button>
        </div>
      </div>
    </header>
  );
};
