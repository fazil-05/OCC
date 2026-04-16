import { framesPublicPath } from "../../../config/framesAssetBase";

export const FOOTBALL_TOTAL_FRAMES = 384;
export const FOOTBALL_FRAMES_PATH = framesPublicPath("/football-frames/");
export const FOOTBALL_SCROLL_HEIGHT_VH = 700;

export const FC = {
  bg: "#060606",
  text: "#FFFFFF",
  accent: "#00FF87",
  secondary: "#00C4FF",
  danger: "#FF3D00",
  muted: "#666666",
  dark: "#0E0E0E",
} as const;

// Approximate normalised (0–1) ball positions per frame range
// [cx, cy] where 0,0 = top-left, 1,1 = bottom-right
export const BALL_POSITIONS: Record<string, [number, number]> = {
  strike: [0.5, 0.72],
  flight: [0.5, 0.38],
  bicycle: [0.5, 0.22],
  goalkeeper: [0.5, 0.45],
  goal: [0.5, 0.5],
  cta: [0.5, 0.5],
};

export type FootballChapter = {
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
};

export const FOOTBALL_CHAPTERS: FootballChapter[] = [
  {
    id: "strike",
    from: 0.0, peak: 0.06, to: 0.12,
    label: "Chapter I · The Strike",
    headline: ["The", "Pass.", "The", "Moment."],
    accentIndices: [1, 3],
    sub: "One touch. That's all it takes to change everything.",
    position: "bottom-left",
  },
  {
    id: "flight",
    from: 0.14, peak: 0.2, to: 0.28,
    label: "Chapter II · In Flight",
    headline: ["Watch", "it", "Fly."],
    accentIndices: [1],
    sub: "The ball leaves the boot at 120 km/h. The crowd holds its breath.",
    stat: { number: "0.3s", label: "Boot to Net" },
    position: "top-right",
  },
  {
    id: "bicycle",
    from: 0.3, peak: 0.38, to: 0.46,
    label: "Chapter III · The Bicycle Kick",
    headline: ["Defying", "Gravity."],
    accentIndices: [0],
    sub: "Inverted. Both feet off the ground. This is what the Football Club trains for.",
    stat: { number: "180°", label: "Body Rotation" },
    position: "center-left",
  },
  {
    id: "goalkeeper",
    from: 0.48, peak: 0.54, to: 0.64,
    label: "Chapter IV · The Goalkeeper",
    headline: ["He", "Dives.", "Too", "Late."],
    accentIndices: [1],
    sub: "Wrong direction. The net is open. The stadium erupts.",
    position: "bottom-right",
  },
  {
    id: "goal",
    from: 0.65, peak: 0.7, to: 0.8,
    label: "OCC Football Club",
    headline: ["GOAL."],
    accentIndices: [0],
    headlineSize: "clamp(100px, 18vw, 260px)",
    accentColor: "#00FF87",
    sub: "Net. Bulge. Crowd. Pure madness.",
    position: "center",
  },
  {
    id: "cta",
    from: 0.82, peak: 0.88, to: 1.0,
    label: "Join OCC Football Club",
    headline: ["Play", "With", "Your", "People."],
    accentIndices: [3],
    sub: "Turf bookings. Match setups. Tournaments. Weekend games.",
    hasCTA: true,
    ctaText: "Join the Club",
    position: "center",
  },
];
