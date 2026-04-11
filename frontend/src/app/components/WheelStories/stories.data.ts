export type WheelStory = {
  name: string;
  role: string;
  quote: string;
  /** Fallback / tint behind photo */
  bg: string;
  /** Card hero — replace with `/your-ai-exports/...` from Midjourney / SD / etc. */
  image: string;
};

export const WHEEL_STORIES: WheelStory[] = [
  {
    name: "Arjun Mehta",
    role: "Bikers Club",
    quote: "The mountain road doesn't end — it just changes direction.",
    bg: "#1a2a3a",
    image:
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Priya Nair",
    role: "Music Club",
    quote: "Every open mic starts with one brave voice.",
    bg: "#2a1a3a",
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Rahul Sharma",
    role: "Sports Club",
    quote: "Inter-campus is where legends are made.",
    bg: "#1a3a2a",
    image:
      "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Ananya Roy",
    role: "Photography Club",
    quote: "The best frame is the one you almost missed.",
    bg: "#3a2a1a",
    image:
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Kiran Desai",
    role: "Fitness Club",
    quote: "Pain is just the body discovering its limits.",
    bg: "#2a3a1a",
    image:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9d783?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Sneha Patel",
    role: "Fashion Club",
    quote: "Style is how you tell your story without speaking.",
    bg: "#3a1a2a",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=400&q=80",
  },
];
