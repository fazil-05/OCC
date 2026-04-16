/**
 * Derived scroll-cinema state for photography overlays (grain burst, etc.).
 */
export function usePhotographyProgress(playheadProgress: number) {
  const inCaptured =
    playheadProgress >= 0.65 && playheadProgress <= 0.8;
  const grainBurstT = inCaptured
    ? Math.min(1, (playheadProgress - 0.65) / 0.15)
    : 0;
  const baseFrequency = 0.035 + grainBurstT * (0.08 - 0.035);
  return { inCaptured, grainBurstT, baseFrequency };
}
