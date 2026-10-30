import React from 'react';
import { VisualizerData } from '../../hooks/useReactiveAudioVisualizer';

interface MP3VisualizerProps {
  data: VisualizerData;
  isPlaying: boolean;
  compact?: boolean;
}

export const MP3Visualizer: React.FC<MP3VisualizerProps> = ({ data, isPlaying, compact = false }) => {
  const { bands, peakCaps, vuLeft, vuRight } = data;

  if (compact) {
    // 8-band ultra-compact mini equalizer for hovering sound pill
    return (
      <div className="flex items-end gap-1 h-5 px-2 py-0.5 rounded-md bg-[#0B0C0E] border border-[#2A2E35] shadow-inner">
        {bands.slice(2, 10).map((height, i) => (
          <div key={i} className="relative w-1 h-full bg-[#181A20] rounded-t-sm overflow-hidden flex items-end">
            <div
              className="w-full bg-gradient-to-t from-[#38D489] via-[#E6AF2E] to-[#F59E0B] rounded-t-sm transition-all duration-75"
              style={{ height: `${Math.max(12, height)}%` }}
            />
          </div>
        ))}
      </div>
    );
  }

  // 16-band full Hi-Fi MP3 spectrum display with stereo VU meters and hardware peak caps
  return (
    <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-[#090A0D] border border-[#262A32] shadow-inner select-none">
      {/* 16-Band Spectrum Analyzer */}
      <div className="flex items-end gap-[3px] h-9 w-[138px] sm:w-[160px] pb-0.5">
        {bands.map((height, i) => {
          const peak = peakCaps[i];
          return (
            <div
              key={i}
              className="relative flex-1 h-full bg-[#13151A] rounded-t-sm flex items-end overflow-hidden group"
            >
              {/* Vertical reactive frequency bar */}
              <div
                className="w-full bg-gradient-to-t from-[#22C55E] via-[#E6AF2E] to-[#F59E0B] rounded-t-sm transition-all duration-75"
                style={{ height: `${Math.max(8, height)}%` }}
              />
              {/* Gravity peak cap */}
              {isPlaying && peak > 15 && (
                <div
                  className="absolute w-full h-[2px] bg-white shadow-[0_0_4px_rgba(255,255,255,0.8)] z-10 transition-all duration-75"
                  style={{ bottom: `${Math.min(95, peak)}%` }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Stereo Dual L / R VU Level Meters */}
      <div className="hidden sm:flex flex-col gap-1 text-[8px] font-mono font-bold text-[#717680] border-l border-[#262A32] pl-2.5">
        {/* Left Channel */}
        <div className="flex items-center gap-1">
          <span className="w-2.5 text-[#38D489]">L</span>
          <div className="flex gap-[2px]">
            {[14, 28, 42, 56, 70, 84, 94].map((threshold, segIndex) => {
              const lit = vuLeft >= threshold;
              const colorClass =
                segIndex >= 6
                  ? lit
                    ? 'bg-rose-500 shadow-[0_0_4px_#ef4444]'
                    : 'bg-rose-950/40'
                  : segIndex >= 4
                  ? lit
                    ? 'bg-amber-400 shadow-[0_0_3px_#f59e0b]'
                    : 'bg-amber-950/40'
                  : lit
                  ? 'bg-emerald-400 shadow-[0_0_3px_#22c55e]'
                  : 'bg-emerald-950/40';

              return <span key={segIndex} className={`w-1.5 h-2 rounded-[1px] ${colorClass}`} />;
            })}
          </div>
        </div>

        {/* Right Channel */}
        <div className="flex items-center gap-1">
          <span className="w-2.5 text-[#E6AF2E]">R</span>
          <div className="flex gap-[2px]">
            {[14, 28, 42, 56, 70, 84, 94].map((threshold, segIndex) => {
              const lit = vuRight >= threshold;
              const colorClass =
                segIndex >= 6
                  ? lit
                    ? 'bg-rose-500 shadow-[0_0_4px_#ef4444]'
                    : 'bg-rose-950/40'
                  : segIndex >= 4
                  ? lit
                    ? 'bg-amber-400 shadow-[0_0_3px_#f59e0b]'
                    : 'bg-amber-950/40'
                  : lit
                  ? 'bg-emerald-400 shadow-[0_0_3px_#22c55e]'
                  : 'bg-emerald-950/40';

              return <span key={segIndex} className={`w-1.5 h-2 rounded-[1px] ${colorClass}`} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
