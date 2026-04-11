import { framesPublicPath } from "../../../config/framesAssetBase";

/** Bright_Mountain_1_Apr__sb2.mp4 @ 30fps — matches public/bikers-frames/ */
export const TOTAL_FRAMES = 783;
export const FRAMES_PATH = framesPublicPath("/bikers-frames/");
export const SCROLL_HEIGHT_VH = 700;

export const COLORS = {
  bg: "#080808",
  text: "#F5F1EB",
  accent: "#C8A96E",
  muted: "#9A9080",
  dark: "#111111",
} as const;

export type ChapterConfig = {
  id: string;
  from: number;
  peak: number;
  to: number;
  chapter?: string;
  headline: string[];
  headlineAccent?: number;
  sub?: string;
  stat?: { number: string; label: string };
  position: "left-mid" | "left-top" | "split" | "center" | "center-wide";
  hasCTA?: boolean;
};

export const SCROLL_CHAPTERS: ChapterConfig[] = [
  {
    id: "solo",
    from: 0.0,
    peak: 0.06,
    to: 0.16,
    chapter: "Chapter I · The Road",
    headline: ["Solo on", "the", "Mountain"],
    headlineAccent: 2,
    sub: "Where every ride begins — alone with the engine and the mountain air.",
    position: "left-mid",
  },
  {
    id: "spot",
    from: 0.18,
    peak: 0.24,
    to: 0.34,
    chapter: "Chapter II · The Discovery",
    headline: ["You", "see", "them."],
    headlineAccent: 2,
    sub: "A pack of riders ahead. Your people. Your club.",
    position: "left-top",
  },
  {
    id: "chase",
    from: 0.36,
    peak: 0.42,
    to: 0.53,
    chapter: "Chapter III · The Chase",
    headline: ["Open", "the", "throttle."],
    headlineAccent: 2,
    stat: { number: "10+", label: "Clubs Active" },
    position: "split",
  },
  {
    id: "formation",
    from: 0.55,
    peak: 0.6,
    to: 0.71,
    headline: ["Brotherhood"],
    sub: "of the mountain road",
    stat: { number: "50+", label: "Campuses" },
    position: "center",
  },
  {
    id: "epic",
    from: 0.72,
    peak: 0.78,
    to: 0.88,
    chapter: "OCC Bikers Club",
    headline: ["You're No Longer", "Riding", "Alone."],
    headlineAccent: 2,
    position: "center-wide",
  },
  {
    id: "cta",
    from: 0.88,
    peak: 0.93,
    to: 1.0,
    headline: ["Find Your Club"],
    sub: "On Campus — Off Campus — Everywhere",
    hasCTA: true,
    position: "center",
  },
];

export const CLUBS = [
  { name: "Bikers", icon: "🏍", tags: ["Weekend Rides", "Turf Rentals", "Bike Checks"] },
  { name: "Music", icon: "🎵", tags: ["Open Mics", "Studio Time", "Collabs"] },
  { name: "Sports", icon: "⚽", tags: ["Tournaments", "Turf Booking", "Rankings"] },
  { name: "Photography", icon: "📷", tags: ["Photo Walks", "Exhibitions", "Paid Shoots"] },
  { name: "Fitness", icon: "💪", tags: ["Group Workouts", "Nutrition", "Challenges"] },
  { name: "Fashion", icon: "👗", tags: ["Showcases", "Brand Deals", "Styling"] },
];

export const EVENTS = [
  "Trivia Nights",
  "Open Mic Sessions",
  "Movie Screenings",
  "Turf Rentals",
  "Match Setups",
  "Club Rides",
];

/** Upcoming events table — OCC bikers / campus */
export type UpcomingEventRow = {
  event: string;
  date: string;
  location: string;
};

export const UPCOMING_EVENTS: UpcomingEventRow[] = [
  { event: "OCC Trivia Night", date: "12 / APRIL / 2026", location: "Koramangala Social Hub" },
  { event: "Open Mic × Indie", date: "18 / APRIL / 2026", location: "Indiranagar Studio" },
  { event: "Inter-Campus Turf Cup", date: "25 / APRIL / 2026", location: "HSR Turf Arena" },
  { event: "Weekend Bikers Meet", date: "03 / MAY / 2026", location: "Nandi Foothills Meet" },
];

export const GIGS = [
  { title: "Event Photography", pay: "₹2K–5K" },
  { title: "Open Mic Hosting", pay: "₹1.5K" },
  { title: "Sports Coaching", pay: "₹800/hr" },
  { title: "Social Media Reels", pay: "₹3K+" },
  { title: "Ride Event Co-Lead", pay: "₹1K" },
];
