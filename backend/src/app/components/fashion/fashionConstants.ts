import { framesPublicPath } from "../../../config/framesAssetBase";

export const FASHION_TOTAL_FRAMES = 510;
export const FASHION_FRAMES_PATH = framesPublicPath("/fashion-frames/");
export const FASHION_SCROLL_HEIGHT_VH = 700;

/** Editorial runway palette — champagne, noir, rose quartz */
export const FAC = {
  bg: "#050505",
  text: "#F7F4EF",
  accent: "#C9A962",
  secondary: "#D4A5A5",
  muted: "#7A756D",
  dark: "#0C0C0C",
  line: "rgba(201,169,98,0.22)",
} as const;

export type FashionChapter = {
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

export const FASHION_CHAPTERS: FashionChapter[] = [
  {
    id: "silhouette",
    from: 0.0, peak: 0.06, to: 0.12,
    label: "Chapter I · Silhouette",
    headline: ["Dress", "the", "Moment."],
    accentIndices: [2],
    sub: "Before the fabric speaks, the line already tells the story.",
    position: "bottom-left",
  },
  {
    id: "texture",
    from: 0.14, peak: 0.2, to: 0.28,
    label: "Chapter II · Texture",
    headline: ["Feel", "Every", "Thread."],
    accentIndices: [1],
    sub: "Weight, drape, tension — the physics of how clothes move with you.",
    stat: { number: "∞", label: "Outfit States" },
    position: "top-right",
  },
  {
    id: "frontrow",
    from: 0.3, peak: 0.38, to: 0.46,
    label: "Chapter III · Front Row",
    headline: ["See", "It", "First."],
    accentIndices: [0],
    sub: "Campus drops, brand collabs, and the looks everyone will copy next week.",
    stat: { number: "24", label: "Showcases / yr" },
    position: "center-left",
  },
  {
    id: "afterdark",
    from: 0.48, peak: 0.54, to: 0.64,
    label: "Chapter IV · After Dark",
    headline: ["Lights", "Down.", "Style", "Up."],
    accentIndices: [1],
    sub: "Night markets, studio nights, and the flash of a polaroid at 2am.",
    position: "bottom-right",
  },
  {
    id: "show",
    from: 0.65, peak: 0.7, to: 0.8,
    label: "OCC Fashion Club",
    headline: ["CURATED."],
    accentIndices: [0],
    headlineSize: "clamp(96px, 17vw, 240px)",
    accentColor: "#C9A962",
    sub: "Runway energy. Editorial stills. Crowd. Silence. Applause.",
    position: "center",
  },
  {
    id: "cta",
    from: 0.82, peak: 0.88, to: 1.0,
    label: "Join OCC Fashion Club",
    headline: ["Wear", "It", "With", "Your", "People."],
    accentIndices: [4],
    sub: "Creative meets. Styling labs. Brand deals. AI-assisted mood boards.",
    hasCTA: true,
    ctaText: "Join the Club",
    position: "center",
  },
];
