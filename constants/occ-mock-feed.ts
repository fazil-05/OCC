/** Fake data for dashboard + Instagram-style feed (UI only). */

export type MockTrendingClubCard = {
  id: string;
  name: string;
  coverUrl: string;
  memberLabel: string;
  liveNow: boolean;
};

export type MockEvent = {
  id: string;
  title: string;
  clubName: string;
  dateLabel: string;
  imageUrl: string;
};

export type MockTrendingRow = {
  id: string;
  name: string;
  avatarUrl: string;
  memberCount: number;
  verified: boolean;
};

export type MockFeedPost = {
  id: string;
  author: { name: string; handle: string; avatarUrl: string; verified?: boolean };
  imageUrl: string;
  caption: string;
  likes: number;
  comments: number;
  timeLabel: string;
};

export const MOCK_TRENDING_CARDS: MockTrendingClubCard[] = [
  {
    id: 'c1',
    name: 'BIKERS',
    coverUrl:
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=90',
    memberLabel: '158 ELITE',
    liveNow: true,
  },
  {
    id: 'c2',
    name: 'MUSIC',
    coverUrl:
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=90',
    memberLabel: '482 ELITE',
    liveNow: true,
  },
  {
    id: 'c3',
    name: 'SPORTS FOOTBALL',
    coverUrl:
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=90',
    memberLabel: '519 ELITE',
    liveNow: true,
  },
  {
    id: 'c4',
    name: 'PHOTOGRAPHY',
    coverUrl:
      'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=1200&q=90',
    memberLabel: '570 ELITE',
    liveNow: false,
  },
];

export const MOCK_EVENTS: MockEvent[] = [
  {
    id: 'e1',
    title: 'Dawn Ride To Nandi',
    clubName: 'BIKERS',
    dateLabel: 'Apr 7, 5:10 AM',
    imageUrl:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=90',
  },
  {
    id: 'e2',
    title: 'Night Walk Photo Jam',
    clubName: 'PHOTOGRAPHY',
    dateLabel: 'Apr 8, 8:30 PM',
    imageUrl:
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=90',
  },
  {
    id: 'e3',
    title: 'Open Deck Friday',
    clubName: 'MUSIC',
    dateLabel: 'Apr 9, 7:00 PM',
    imageUrl:
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=90',
  },
  {
    id: 'e4',
    title: 'Inter-college 5v5',
    clubName: 'SPORTS FOOTBALL',
    dateLabel: 'Apr 10, 4:00 PM',
    imageUrl:
      'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=1200&q=90',
  },
];

export const MOCK_TRENDING_ROWS: MockTrendingRow[] = [
  {
    id: 't1',
    name: 'Bikers',
    avatarUrl:
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=90',
    memberCount: 158,
    verified: true,
  },
  {
    id: 't2',
    name: 'Music',
    avatarUrl:
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=90',
    memberCount: 482,
    verified: true,
  },
  {
    id: 't3',
    name: 'Sports Football',
    avatarUrl:
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=90',
    memberCount: 519,
    verified: true,
  },
  {
    id: 't4',
    name: 'Photography',
    avatarUrl:
      'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=1200&q=90',
    memberCount: 570,
    verified: true,
  },
  {
    id: 't5',
    name: 'Fitness',
    avatarUrl:
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=90',
    memberCount: 841,
    verified: true,
  },
  {
    id: 't6',
    name: 'Fashion',
    avatarUrl:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=90',
    memberCount: 312,
    verified: true,
  },
];

export const MOCK_FEED_POSTS: MockFeedPost[] = [
  {
    id: 'p1',
    author: {
      name: 'Bikers OCC',
      handle: 'bikers_occ',
      avatarUrl: 'https://images.pexels.com/photos/104842/pexels-photo-104842.jpeg?auto=compress&cs=tinysrgb&w=1200',
      verified: true,
    },
    imageUrl: 'https://images.pexels.com/photos/2393816/pexels-photo-2393816.jpeg?auto=compress&cs=tinysrgb&w=1200',
    caption: 'Sunrise miles with the crew. Next ride: Nandi — link in bio 🏍️',
    likes: 842,
    comments: 56,
    timeLabel: '2h',
  },
  {
    id: 'p3',
    author: {
      name: 'Goal Diggers',
      handle: 'sports_occ',
      avatarUrl: 'https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&cs=tinysrgb&w=1200',
      verified: true,
    },
    imageUrl: 'https://images.pexels.com/photos/3633704/pexels-photo-3633704.jpeg?auto=compress&cs=tinysrgb&w=1200',
    caption: 'Finals week but we still touch grass ⚽ #occ #campus',
    likes: 328,
    comments: 14,
    timeLabel: '1d',
  },
  {
    id: 'p4',
    author: {
      name: 'PhotoWalk Club',
      handle: 'photo_occ',
      avatarUrl: 'https://images.pexels.com/photos/1015568/pexels-photo-1015568.jpeg?auto=compress&cs=tinysrgb&w=1200',
      verified: true,
    },
    imageUrl: 'https://images.pexels.com/photos/225157/pexels-photo-225157.jpeg?auto=compress&cs=tinysrgb&w=1200',
    caption: 'Golden hour hits different from the rooftop 📷',
    likes: 2103,
    comments: 120,
    timeLabel: '2d',
  },
  {
    id: 'p5',
    author: {
      name: 'Fashion Row',
      handle: 'fashion_occ',
      avatarUrl: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1200',
      verified: true,
    },
    imageUrl: 'https://images.pexels.com/photos/974911/pexels-photo-974911.jpeg?auto=compress&cs=tinysrgb&w=1200',
    caption: 'Runway prep for spring showcase — tickets drop Monday 👗',
    likes: 567,
    comments: 43,
    timeLabel: '3d',
  },
  {
    id: 'p6',
    author: {
      name: 'X-TREME FIT',
      handle: 'gym_occ',
      avatarUrl: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1200',
      verified: true,
    },
    imageUrl: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1200',
    caption: 'New PR hit today! 315lbs moving like butter. Who’s in for the 6AM session tomorrow? 💪🔥 #gym',
    likes: 3105,
    comments: 142,
    timeLabel: '10m',
  },
  {
    id: 'p7',
    author: {
      name: 'Campus Life',
      handle: 'college_vibe',
      avatarUrl: 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&w=1200',
      verified: true,
    },
    imageUrl: 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&w=1200',
    caption: 'Library grinds or cafeteria gossip? The real college experience hitting hard this finals week. 📚☕',
    likes: 1240,
    comments: 85,
    timeLabel: '45m',
  },
  {
    id: 'p8',
    author: {
      name: 'ESPORTS ELITE',
      handle: 'gaming_occ',
      avatarUrl: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=1200',
      verified: true,
    },
    imageUrl: 'https://images.pexels.com/photos/7915437/pexels-photo-7915437.jpeg?auto=compress&cs=tinysrgb&w=1200',
    caption: 'Tournament finals are LIVE! Clutching up for the squad. Mobile gaming at its peak. 🎮🏆',
    likes: 8902,
    comments: 541,
    timeLabel: '1h',
  },
  {
    id: 'p9',
    author: {
      name: 'Alexander Moss',
      handle: 'alex_moss',
      avatarUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1200',
      verified: true,
    },
    imageUrl: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1200',
    caption: 'Nothing compares to the energy of a live session. Music is the only language that matters. 🎹🔥',
    likes: 4521,
    comments: 234,
    timeLabel: '3h',
  },
  {
    id: 'p2',
    author: {
      name: 'Studio 7',
      handle: 'music_occ',
      avatarUrl: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1200',
      verified: true,
    },
    imageUrl: 'https://images.pexels.com/photos/1644616/pexels-photo-1644616.jpeg?auto=compress&cs=tinysrgb&w=1200',
    caption: 'Late night session. Who’s jumping on the next collab? 🎹',
    likes: 1204,
    comments: 89,
    timeLabel: '5h',
  },
];
