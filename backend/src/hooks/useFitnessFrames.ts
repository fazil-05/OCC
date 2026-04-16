import { useState, useEffect, useCallback } from "react";
import { loadFrameSequence } from "../lib/loadFrameSequence";

export interface FitnessFramesResult {
  frames: HTMLImageElement[];
  loaded: boolean;
  progress: number;
}

export function useFitnessFrames(
  basePath: string,
  totalFrames: number,
  prefix: string = "",
): FitnessFramesResult {
  const [frames, setFrames] = useState<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  const load = useCallback(async () => {
    setProgress(0);
    const imgs = await loadFrameSequence(basePath, totalFrames, setProgress, prefix);
    setFrames(imgs);
    setLoaded(true);
  }, [basePath, totalFrames, prefix]);

  useEffect(() => {
    load();
  }, [load]);

  return { frames, loaded, progress };
}
