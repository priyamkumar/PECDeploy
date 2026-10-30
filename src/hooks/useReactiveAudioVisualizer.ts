import { useState, useEffect, useRef } from 'react';

export interface VisualizerData {
  bands: number[]; // 16 values 0-100
  peakCaps: number[]; // 16 values 0-100
  vuLeft: number; // 0-100
  vuRight: number; // 0-100
  discRotation: number; // degrees
  beatPulse: boolean;
}

export function useReactiveAudioVisualizer(
  isPlaying: boolean,
  playbackRate: number = 1.0,
  activeSentence: string = ''
): VisualizerData {
  const [data, setData] = useState<VisualizerData>({
    bands: new Array(16).fill(6),
    peakCaps: new Array(16).fill(8),
    vuLeft: 0,
    vuRight: 0,
    discRotation: 0,
    beatPulse: false,
  });

  const animFrameRef = useRef<number | null>(null);
  const currentBandsRef = useRef<number[]>(new Array(16).fill(6));
  const peakCapsRef = useRef<number[]>(new Array(16).fill(8));
  const rotationRef = useRef<number>(0);
  const phaseRef = useRef<number>(0);

  useEffect(() => {
    let lastTime = performance.now();

    const updateLoop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.08);
      lastTime = now;

      if (isPlaying) {
        // Spin disc and advance wave phase proportional to tempo
        rotationRef.current = (rotationRef.current + playbackRate * 200 * dt) % 360;
        phaseRef.current += dt * (5.5 + playbackRate * 3.5);

        const phraseMod = activeSentence.length > 0 ? (activeSentence.length % 9) * 0.08 : 0;
        const speedMultiplier = Math.min(2.2, Math.max(0.8, playbackRate));

        const nextBands: number[] = [];
        const nextPeaks: number[] = [];

        // 16-band spectrum simulation with authentic vocal speech formant curves
        for (let i = 0; i < 16; i++) {
          // Mid-range vocal formant bands (3 to 10) have highest vocal energy
          const formantWeight = i >= 3 && i <= 10 ? 1.35 : i < 3 ? 0.95 : 0.8;

          // Multi-frequency sinusoidal interference + pseudo-stochastic syllable flutter
          const harmonic1 = Math.sin(phaseRef.current * (1.1 + i * 0.32));
          const harmonic2 = Math.cos(phaseRef.current * (0.85 + i * 0.24) + i * 0.7);
          const flutter = Math.sin((phaseRef.current + i * 14.3) * 4.1) * 0.28;

          const raw = (harmonic1 * 0.45 + harmonic2 * 0.35 + flutter + 0.9) * 0.5;
          const targetHeight = Math.min(
            96,
            Math.max(10, (raw * 85 * formantWeight + phraseMod * 8) * (0.75 + 0.25 * speedMultiplier))
          );

          // Attack (fast) & Decay (smooth) physics
          const current = currentBandsRef.current[i] || 6;
          const smoothed = current + (targetHeight - current) * Math.min(1, dt * 16);
          currentBandsRef.current[i] = smoothed;
          nextBands.push(Math.round(smoothed));

          // Hardware-style peak cap: instantly catches peak, slowly falls with gravity
          let currentPeak = peakCapsRef.current[i] || smoothed;
          if (smoothed >= currentPeak) {
            currentPeak = smoothed;
          } else {
            currentPeak = Math.max(smoothed, currentPeak - dt * 36);
          }
          peakCapsRef.current[i] = currentPeak;
          nextPeaks.push(Math.round(currentPeak));
        }

        // Stereo VU meter levels (L and R channels with slight vocal phase separation)
        const leftEnergy = nextBands[2] * 0.25 + nextBands[5] * 0.45 + nextBands[8] * 0.3;
        const rightEnergy = nextBands[3] * 0.3 + nextBands[6] * 0.4 + nextBands[9] * 0.3;

        const vuL = Math.min(100, Math.max(12, Math.round(leftEnergy * 1.04)));
        const vuR = Math.min(100, Math.max(12, Math.round(rightEnergy * 0.96)));
        const beatPulse = leftEnergy > 58 || rightEnergy > 60;

        setData({
          bands: nextBands,
          peakCaps: nextPeaks,
          vuLeft: vuL,
          vuRight: vuR,
          discRotation: Math.round(rotationRef.current),
          beatPulse,
        });
      } else {
        // Graceful decay when paused / idle
        let stillActive = false;
        const nextBands: number[] = [];
        const nextPeaks: number[] = [];

        for (let i = 0; i < 16; i++) {
          const b = Math.max(6, currentBandsRef.current[i] - dt * 65);
          const p = Math.max(8, peakCapsRef.current[i] - dt * 42);
          if (b > 6 || p > 8) stillActive = true;
          currentBandsRef.current[i] = b;
          peakCapsRef.current[i] = p;
          nextBands.push(Math.round(b));
          nextPeaks.push(Math.round(p));
        }

        setData((prev) => ({
          bands: nextBands,
          peakCaps: nextPeaks,
          vuLeft: Math.max(0, Math.round(prev.vuLeft - dt * 140)),
          vuRight: Math.max(0, Math.round(prev.vuRight - dt * 140)),
          discRotation: prev.discRotation,
          beatPulse: false,
        }));

        if (!stillActive) {
          return;
        }
      }

      animFrameRef.current = requestAnimationFrame(updateLoop);
    };

    animFrameRef.current = requestAnimationFrame(updateLoop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, playbackRate, activeSentence]);

  return data;
}
