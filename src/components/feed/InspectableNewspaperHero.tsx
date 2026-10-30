import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Rss, Sparkles, ShieldCheck, Newspaper, Compass, Volume2, Search, ZoomIn, ZoomOut, Eye, Sliders, Layers } from 'lucide-react';
import { playTactileClick } from '../../lib/sound-effects';

export interface InspectableNewspaperHeroProps {
  onOpenAddFeed: () => void;
  onExploreDiscovery: () => void;
}

type LensFilter = 'gold' | 'sepia' | 'cyan' | 'emerald';

export const InspectableNewspaperHero: React.FC<InspectableNewspaperHeroProps> = ({
  onOpenAddFeed,
  onExploreDiscovery,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [lensPos, setLensPos] = useState({ x: 260, y: 190 });
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState<number>(1.15); // 1.1x to 2.2x
  const [activeFilter, setActiveFilter] = useState<LensFilter>('gold');
  const animFrameRef = useRef<number | null>(null);

  // Smooth pointer tracking over the broadsheet newspaper canvas
  const updatePointerCoords = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(45, Math.min(clientX - rect.left, rect.width - 45));
    const y = Math.max(45, Math.min(clientY - rect.top, rect.height - 45));

    setLensPos({ x, y });

    // 3D lens tilt based on displacement from center
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const tiltX = ((y - centerY) / centerY) * -12;
    const tiltY = ((x - centerX) / centerX) * 14;
    setTilt({ x: tiltX, y: tiltY });
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    updatePointerCoords(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      updatePointerCoords(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  // Direct click to snap lens
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    playTactileClick();
    updatePointerCoords(e.clientX, e.clientY);
  };

  // Automated gentle scanning drift when user is not actively hovering
  useEffect(() => {
    if (isHovered || isDragging) return;

    let angle = 0;
    const animateIdle = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const radiusX = Math.min(rect.width * 0.22, 120);
      const radiusY = Math.min(rect.height * 0.18, 55);
      const cx = rect.width * 0.58;
      const cy = rect.height * 0.48;

      angle += 0.016;
      const nextX = cx + Math.cos(angle) * radiusX;
      const nextY = cy + Math.sin(angle * 1.4) * radiusY;

      setLensPos({ x: nextX, y: nextY });
      setTilt({ x: Math.sin(angle) * 7, y: Math.cos(angle) * 9 });

      animFrameRef.current = requestAnimationFrame(animateIdle);
    };

    animFrameRef.current = requestAnimationFrame(animateIdle);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isHovered, isDragging]);

  // Filter styling maps
  const filterStyles = {
    gold: {
      bezel: 'border-[#E5B83B] dark:border-[#F3CA52] shadow-[0_20px_45px_rgba(212,175,55,0.35)]',
      accent: 'text-[#D49B24] dark:text-[#F3CA52]',
      bg: 'bg-[#FFFDF7] dark:bg-[#1A1A17]',
      highlight: 'border-[#D49B24]',
    },
    sepia: {
      bezel: 'border-[#9E6E3D] dark:border-[#B88554] shadow-[0_20px_45px_rgba(158,110,61,0.35)]',
      accent: 'text-[#8A4B23] dark:text-[#E29B62]',
      bg: 'bg-[#FBF6ED] dark:bg-[#1C1713]',
      highlight: 'border-[#8A4B23]',
    },
    cyan: {
      bezel: 'border-[#0EA5E9] dark:border-[#38BDF8] shadow-[0_20px_45px_rgba(14,165,233,0.35)]',
      accent: 'text-[#0284C7] dark:text-[#38BDF8]',
      bg: 'bg-[#F0F9FF] dark:bg-[#0B1520]',
      highlight: 'border-[#0284C7]',
    },
    emerald: {
      bezel: 'border-[#10B981] dark:border-[#34D399] shadow-[0_20px_45px_rgba(16,185,129,0.35)]',
      accent: 'text-[#059669] dark:text-[#34D399]',
      bg: 'bg-[#F0FDF4] dark:bg-[#091C14]',
      highlight: 'border-[#059669]',
    },
  };

  const currentF = filterStyles[activeFilter];
  const lensRadius = Math.round(85 * (zoomLevel / 1.15));

  return (
    <section className="relative w-full rounded-2xl border border-[#D5CFBE] dark:border-[#2A2E35] bg-white dark:bg-[#141619] shadow-2xl overflow-hidden mb-10 transition-colors duration-250">
      {/* Top Editorial Dateline Banner */}
      <div className="border-b border-[#D5CFBE] dark:border-[#2A2E35] bg-[#ECE8DF]/90 dark:bg-[#1D2025]/90 px-4 sm:px-8 py-2 flex flex-wrap items-center justify-between text-[11px] font-kicker tracking-[0.12em] uppercase text-[#B45309] dark:text-[#E6AF2E] select-none font-semibold">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#0A0A0A] dark:text-[#F5F5F0] tracking-wider">THE INCOGNIREAD DISPATCH</span>
          <span>•</span>
          <span>OCTOBER 2026</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline font-mono tabular-nums">NO. 402</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden md:inline font-mono tabular-nums">PRICE: THREE PENCE</span>
          <span>•</span>
          <span className="text-[#047857] dark:text-[#38D489] font-bold flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#38D489] animate-pulse" />
            INSPECTABLE BROADSHEET CANVAS
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px] relative">
        {/* Left Column: Broadsheet Masthead, Story Intro & Quick Actions */}
        <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#D5CFBE] dark:border-[#2A2E35] bg-white dark:bg-[#141619]">
          <div className="space-y-4">
            {/* Masthead Header with Authentic Double Rule */}
            <div>
              <div className="flex items-center gap-2 text-xs font-kicker uppercase tracking-[0.12em] text-[#B45309] dark:text-[#E6AF2E] mb-1 font-semibold">
                <Newspaper className="h-4 w-4" />
                <span>Morning Broadsheet Edition</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0A0A0A] dark:text-[#F5F5F0] tracking-[-0.02em] leading-[1.1] font-headline">
                The Anonymous Editorial &amp; Small Web Dispatch
              </h1>
              <div className="editorial-double-rule text-[#1E1E1E] dark:text-[#363B44] my-3" />
            </div>

            <p className="text-sm sm:text-base text-[#262626] dark:text-[#C8CCC5] leading-[1.85] tracking-[0.01em] font-body drop-cap">
              Reclaim the sovereign pleasure of undistracted longform reading. Every RSS feed is parsed strictly in your browser, cached to offline <strong>IndexedDB</strong>, sanitized against malicious markup, and narrated aloud with paragraph-synced synthetic voice.
            </p>

            {/* Quick CTA Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  playTactileClick();
                  onOpenAddFeed();
                }}
                className="btn-press-3d inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A0A0A] dark:bg-[#E6AF2E] text-white dark:text-[#0B0C0E] font-bold text-xs uppercase tracking-wider border-b-[3px] border-b-black/80 dark:border-b-[#C5911B] shadow-md hover:bg-[#262626] dark:hover:bg-[#F3C760] transition-all"
              >
                <Rss className="h-4 w-4" />
                <span>Subscribe to Dispatch</span>
              </button>

              <button
                onClick={() => {
                  playTactileClick();
                  onExploreDiscovery();
                }}
                className="btn-press-3d inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ECE8DF] dark:bg-[#1D2025] text-[#0A0A0A] dark:text-[#F5F5F0] font-bold text-xs border border-[#D5CFBE] dark:border-[#2A2E35] border-b-[3px] border-b-[#B4ACA0] dark:border-b-black shadow-sm hover:bg-white dark:hover:bg-[#22262E] transition-all"
              >
                <Compass className="h-4 w-4 text-[#B45309] dark:text-[#E6AF2E]" />
                <span>The Anonymous Gazette</span>
              </button>
            </div>
          </div>

          {/* Interactive Lens Control Toolbar */}
          <div className="pt-5 mt-5 border-t border-[#D5CFBE] dark:border-[#2A2E35] space-y-3">
            <div className="flex items-center justify-between text-[11px] font-kicker text-[#B45309] dark:text-[#E6AF2E] uppercase tracking-[0.12em] font-semibold">
              <span className="flex items-center gap-1.5">
                <Sliders className="h-3.5 w-3.5" />
                <span>OPTICAL LENS CONTROLS</span>
              </span>
              <span className="font-mono tabular-nums">ZOOM: {zoomLevel.toFixed(1)}x</span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              {/* Zoom Buttons */}
              <div className="flex items-center gap-1 bg-[#ECE8DF] dark:bg-[#1D2025] p-1 rounded-xl border border-[#D5CFBE] dark:border-[#2A2E35]">
                {[1.1, 1.4, 1.8, 2.2].map((z) => (
                  <button
                    key={z}
                    onClick={() => {
                      playTactileClick();
                      setZoomLevel(z);
                    }}
                    className={`px-2.5 py-1 rounded-lg font-mono font-medium tabular-nums text-[11px] transition-colors ${
                      zoomLevel === z
                        ? 'bg-[#0A0A0A] dark:bg-[#E6AF2E] text-white dark:text-[#0B0C0E] shadow-sm'
                        : 'text-[#4A4A4A] dark:text-[#9EA3A0] hover:text-[#0A0A0A] dark:hover:text-[#F5F5F0]'
                    }`}
                  >
                    {z}x
                  </button>
                ))}
              </div>

              {/* Spectral Filters */}
              <div className="flex items-center gap-1 bg-[#ECE8DF] dark:bg-[#1D2025] p-1 rounded-xl border border-[#D5CFBE] dark:border-[#2A2E35]">
                {(['gold', 'sepia', 'cyan', 'emerald'] as LensFilter[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      playTactileClick();
                      setActiveFilter(f);
                    }}
                    className={`px-2 py-1 rounded-lg font-mono font-bold text-[10px] uppercase transition-colors ${
                      activeFilter === f
                        ? 'bg-[#0A0A0A] dark:bg-white text-white dark:text-[#0B0C0E] shadow-sm'
                        : 'text-[#4A4A4A] dark:text-[#9EA3A0] hover:text-[#0A0A0A] dark:hover:text-[#F5F5F0]'
                    }`}
                    title={`Switch to ${f} lens illumination`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Inspectable Newspaper Canvas */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="lg:col-span-6 relative p-6 sm:p-8 select-none overflow-hidden cursor-crosshair flex flex-col justify-center min-h-[380px] bg-[#F4F1EA] dark:bg-[#0B0C0E] paper-texture"
        >
          {/* Visual Instruction Badge */}
          <div className="absolute top-3 right-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 dark:bg-[#141619]/90 border border-[#D5CFBE] dark:border-[#2A2E35] text-[10px] font-kicker text-[#B45309] dark:text-[#E6AF2E] font-semibold tracking-wider shadow-sm pointer-events-none">
            <Search className="h-3 w-3 animate-pulse" />
            <span>Hover or Click to Inspect Print</span>
          </div>

          {/* Layer 1: Background Dimmed & Blurred Print Newspaper */}
          <div className="opacity-35 dark:opacity-20 filter blur-[1.5px] transition-opacity duration-300 pointer-events-none">
            <div className="border-b-2 border-current pb-2 mb-3">
              <h2 className="text-xl sm:text-2xl font-bold font-headline uppercase tracking-tight text-[#0A0A0A] dark:text-[#F5F5F0]">
                INDEPENDENT SMALL WEB ECLIPSES THE CORPORATE ALGORITHM
              </h2>
              <div className="flex justify-between text-[10px] font-mono tabular-nums pt-1 text-[#4A4A4A] dark:text-[#9EA3A0]">
                <span>FRONT-PAGE DISPATCH</span>
                <span>OCTOBER 2026</span>
                <span>VOL. LXXVIII</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-body leading-[1.85] text-[#262626] dark:text-[#C8CCC5]">
              <div className="border-r border-[#D5CFBE] dark:border-[#2A2E35] pr-3 space-y-2">
                <p>
                  As centralized social networks succumb to synthetic hallucinations and invasive tracking pixels, discerning readers return in great numbers to genuine RSS and self-hosted dispatches.
                </p>
                <p>
                  The sovereign browser reader executes all XML parsing directly inside client memory. No telemetry logs your interests; no cloud middleman monetizes your private reading hours.
                </p>
              </div>
              <div className="space-y-2">
                <p>
                  "The printed word once liberated public thought from monopolistic heralds," writes our editorial correspondent. "Today, browser-parsed RSS accomplishes that exact emancipatory feat for the digital age."
                </p>
                <p>
                  With interactive speech synthesis, articles are voiced with natural cadence while synchronized highlights guide the eye across authentic editorial columns.
                </p>
              </div>
            </div>
          </div>

          {/* Layer 2: Sharp, Magnified High-Contrast Print Layer (Revealed strictly beneath the lens) */}
          <div
            className={`absolute inset-0 p-6 sm:p-8 pointer-events-none ${currentF.bg} z-10 transition-colors`}
            style={{
              clipPath: `circle(${lensRadius}px at ${lensPos.x}px ${lensPos.y}px)`,
              WebkitClipPath: `circle(${lensRadius}px at ${lensPos.x}px ${lensPos.y}px)`,
            }}
          >
            <div
              className="transition-transform duration-75"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: `${lensPos.x}px ${lensPos.y}px`,
              }}
            >
              <div className={`border-b-2 ${currentF.highlight} pb-2 mb-3`}>
                <h2 className="text-xl sm:text-2xl font-bold font-headline uppercase tracking-tight text-[#0A0A0A] dark:text-[#F5F5F0]">
                  INDEPENDENT SMALL WEB ECLIPSES THE CORPORATE ALGORITHM
                </h2>
                <div className={`flex justify-between text-[10px] font-mono tabular-nums pt-1 font-bold ${currentF.accent}`}>
                  <span>FRONT-PAGE DISPATCH</span>
                  <span>OCTOBER 2026</span>
                  <span>VOL. LXXVIII</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-body leading-[1.85] text-[#0A0A0A] dark:text-[#F5F5F0]">
                <div className="border-r border-[#D5CFBE] dark:border-[#2A2E35] pr-3 space-y-2">
                  <p className="font-semibold">
                    As centralized social networks succumb to synthetic hallucinations and invasive tracking pixels, discerning readers return in great numbers to genuine RSS and self-hosted dispatches.
                  </p>
                  <p className="font-semibold">
                    The sovereign browser reader executes all XML parsing directly inside client memory. No telemetry logs your interests; no cloud middleman monetizes your private reading hours.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold">
                    "The printed word once liberated public thought from monopolistic heralds," writes our editorial correspondent. "Today, browser-parsed RSS accomplishes that exact emancipatory feat for the digital age."
                  </p>
                  <p className="font-semibold">
                    With interactive speech synthesis, articles are voiced with natural cadence while synchronized highlights guide the eye across authentic editorial columns.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Layer 3: Realistic Brass / Graphite Magnifying Glass Element */}
          <div
            className="absolute pointer-events-none z-30 transition-transform duration-100 ease-out"
            style={{
              left: `${lensPos.x}px`,
              top: `${lensPos.y}px`,
              transform: `translate(-50%, -50%) perspective(700px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            }}
          >
            {/* Outer Circular Bezel & Glare */}
            <div
              className={`relative rounded-full border-[6px] ${currentF.bezel} flex items-center justify-center transition-all duration-300`}
              style={{
                width: `${lensRadius * 2}px`,
                height: `${lensRadius * 2}px`,
              }}
            >
              {/* Inner Bezel Ring */}
              <div className="absolute inset-1 rounded-full border border-black/30 dark:border-white/30" />

              {/* Glass Glare Reflection Highlight */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.12) 35%, transparent 58%, rgba(255,255,255,0.14) 100%)',
                }}
              />

              {/* Center Crosshair Dot Watermark */}
              <div className="h-1.5 w-1.5 rounded-full bg-sepia dark:bg-gold opacity-80" />

              {/* Handle */}
              <div
                className="absolute -bottom-16 -right-16 w-6 h-24 origin-top-left rotate-[42deg]"
                style={{
                  filter: 'drop-shadow(4px 8px 14px rgba(0, 0, 0, 0.45))',
                }}
              >
                <div className="h-4 w-6 bg-gradient-to-r from-[#B8972E] via-[#E5C158] to-[#9E7A1C] rounded-sm border-t border-white/40" />
                <div className="h-20 w-6 bg-gradient-to-r from-[#2B1B17] via-[#4A2F25] to-[#1E1310] dark:from-[#111] dark:via-[#222] dark:to-[#0A0A0A] rounded-b-md border-x border-[#3A241C] relative">
                  <div className="absolute bottom-0 inset-x-0 h-3 rounded-b-md bg-gradient-to-r from-[#B8972E] to-[#9E7A1C]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
