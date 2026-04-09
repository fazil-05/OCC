/** Off Campus Club — UI branding (no network/API in this build). */
export const OCC = {
  name: 'Off Campus Club',
  tagline: 'Clubs, events & gigs — built for students.',
} as const;

export type OccDemoUser = {
  id: string;
  fullName: string;
  email: string;
  collegeName: string;
  bio?: string | null;
  avatar?: string | null;
  memberships?: { club: { id: string; name: string; slug: string; icon: string } }[];
};

export const occColors = {
  bg: '#050510',
  bgMid: '#0c0f2a',
  card: '#12173a',
  cardHover: '#1a2150',
  stroke: 'rgba(255,255,255,0.09)',
  text: '#f8fafc',
  textMuted: 'rgba(248,250,252,0.55)',
  accent: '#a78bfa',
  accentDeep: '#7c3aed',
  cyan: '#22d3ee',
  rose: '#fb7185',
  amber: '#fbbf24',
  success: '#4ade80',
} as const;
