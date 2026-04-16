import { useState, useEffect, useCallback } from "react";
import { loadFrameSequence } from "../lib/loadFrameSequence";

export interface MusicFramesResult {
  frames: HTMLImageElement[];
  loaded: boolean;
  progress: number;
}

export interface PhotographyFramesResult {
  frames: HTMLImageElement[];
  loaded: boolean;
  progress: number;
}

export function usePhotographyFrames(
  basePath: string,
  totalFrames: number,
  prefix: string = "",
): PhotographyFramesResult {
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

export function useMusicFrames(
  basePath: string,
  totalFrames: number,
  prefix: string = "",
): MusicFramesResult {
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
