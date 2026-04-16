/** Climax chapter grain / FX window — same timing curve as photography “CAPTURED”. */
export function useFashionProgress(playheadProgress: number) {
  const inShow = playheadProgress >= 0.65 && playheadProgress <= 0.8;
  const burstT = inShow
    ? Math.min(1, (playheadProgress - 0.65) / 0.15)
    : 0;
  const baseFrequency = 0.035 + burstT * (0.075 - 0.035);
  return { inShow, burstT, baseFrequency };
}
