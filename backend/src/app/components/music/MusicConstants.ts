import { framesPublicPath } from "../../../config/framesAssetBase";

export const MUSIC_TOTAL_FRAMES = 441;
export const MUSIC_FRAMES_PATH = framesPublicPath("/music-frames/");
export const MUSIC_FRAME_PREFIX = "";
export const MUSIC_SCROLL_HEIGHT_VH = 700;

export const FC = {
  bg: "#060606",
  text: "#FFFFFF",
  accent: "#8B5CF6", // Purple/Violet accent for music as per instructions
  secondary: "#C4B5FD",
  danger: "#FF3D00",
  muted: "#666666",
  dark: "#0E0E0E",
} as const;

// Approximate normalised (0–1) center positions to use for tracking elements
export const BALL_POSITIONS: Record<string, [number, number]> = {
  stage: [0.5, 0.5],
  set: [0.5, 0.5],
  crowd: [0.5, 0.5],
  moment: [0.5, 0.5],
  amplified: [0.5, 0.5],
  cta: [0.5, 0.5],
};

export type MusicChapter = {
  id: string;
  from: number;
  peak: number;
  to: number;
  label: string;
  headline: string[];
  accentIndices: number[];
  sub: string;
  stat?: { number: string; label: string };
  hasCTA?: boolean;
  ctaText?: string;
  position: "bottom-left" | "top-right" | "center-left" | "bottom-right" | "center";
  headlineSize?: string;
  accentColor?: string;
  animation?: "explosion scale";
};

export const MUSIC_CHAPTERS: MusicChapter[] = [
  {
    id: "stage",
    from: 0.0, peak: 0.06, to: 0.12,
    label: "Chapter I · The Stage",
    headline: ["Hear", "Before", "You", "See."],
    accentIndices: [0],
    sub: "Before the first note drops, the room already knows.",
    position: "bottom-left",
  },
  {
    id: "set",
    from: 0.14, peak: 0.21, to: 0.28,
    label: "Chapter II · The Set",
    headline: ["Drop", "The", "Beat."],
    accentIndices: [2],
    sub: "128 BPM. Four on the floor. The crowd becomes one.",
    stat: { number: "128", label: "BPM" },
    position: "top-right",
  },
  {
    id: "crowd",
    from: 0.3, peak: 0.38, to: 0.46,
    label: "Chapter III · The Crowd",
    headline: ["Every", "Voice.", "Matters."],
    accentIndices: [1],
    sub: "From the front row to the back wall. Every person part of the sound.",
    stat: { number: "50+", label: "Colleges" },
    position: "center-left",
  },
  {
    id: "moment",
    from: 0.48, peak: 0.56, to: 0.64,
    label: "Chapter IV · The Moment",
    headline: ["One", "Night.", "Changed.", "Everything."],
    accentIndices: [2],
    sub: "You cannot recreate a live moment. Only be there when it happens.",
    position: "bottom-right",
  },
  {
    id: "amplified",
    from: 0.65, peak: 0.72, to: 0.8,
    label: "OCC Music Club",
    headline: ["AMPLIFIED."],
    accentIndices: [0],
    headlineSize: "clamp(120px, 20vw, 260px)",
    accentColor: "#8B5CF6",
    sub: "Bass. Lights. Crowd. Pure energy.",
    position: "center",
    animation: "explosion scale"
  },
  {
    id: "cta",
    from: 0.82, peak: 0.91, to: 1.0,
    label: "Join OCC Music Club",
    headline: ["Play", "With", "Your", "People."],
    accentIndices: [3],
    sub: "Open mics. Studio sessions. Live gigs. Music theory workshops.",
    hasCTA: true,
    ctaText: "Join the Club",
    position: "center",
  },
];
