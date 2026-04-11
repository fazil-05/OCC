export interface OrbitProject {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
}

export const orbitCategories = [
  "Clubs",
  "Events",
  "Campus Life",
  "Gigs",
  "Music",
  "Fashion",
  "Sports",
  "Tech",
  "Photography",
  "Bikers",
  "Education",
  "Wellness",
] as const;

/* Use picsum.photos for guaranteed working images */
const pic = (id: number, w = 400, h = 260) =>
  `https://picsum.photos/id/${id}/${w}/${h}`;

export const orbitProjects: OrbitProject[] = [
  { id: 1, title: "Midnight Fashion Gala", category: "Fashion", description: "An exclusive night of couture, runway showcases, and emerging designers.", image: pic(1005) },
  { id: 2, title: "Byte & Build Hackathon", category: "Tech", description: "48 hours of non-stop coding, mentorship, and pizza.", image: pic(180) },
  { id: 3, title: "Campus Unplugged", category: "Music", description: "Acoustic sets under the stars. Guitars, bonfires, and no wi-fi.", image: pic(96) },
  { id: 4, title: "OCC Football League", category: "Sports", description: "The inter-campus tournament everyone waited for.", image: pic(1058) },
  { id: 5, title: "Freelance Accelerator", category: "Gigs", description: "Turn your skills into paid gigs.", image: pic(366) },
  { id: 6, title: "Night Market Pop-Up", category: "Events", description: "Food trucks, art stalls, and live DJs.", image: pic(429) },
  { id: 7, title: "Photography Collective", category: "Photography", description: "Street walks, golden-hour shoots, and gallery nights.", image: pic(1015) },
  { id: 8, title: "Dorm Room to Startup", category: "Campus Life", description: "Real stories of students who launched ventures.", image: pic(20) },
  { id: 9, title: "Bikers' Dawn Rally", category: "Bikers", description: "50 km campus-to-hills ride at sunrise.", image: pic(1025) },
  { id: 10, title: "Art Basel Campus", category: "Events", description: "Murals, installations, and live canvas battles.", image: pic(1043) },
  { id: 11, title: "Open Mic Night", category: "Music", description: "Stand-up, poetry slams, or just raw vocals.", image: pic(1062) },
  { id: 12, title: "Street Style Collective", category: "Fashion", description: "Thrift flips, styling battles, and outfit drops.", image: pic(335) },
  { id: 13, title: "AI/ML Study Circle", category: "Tech", description: "Weekly deep-dives into neural nets and transformers.", image: pic(160) },
  { id: 14, title: "Content Creator Bootcamp", category: "Gigs", description: "Learn to shoot, edit, and monetize short-form content.", image: pic(367) },
  { id: 15, title: "Rooftop Cinema Nights", category: "Campus Life", description: "Cult classics on a big screen under city lights.", image: pic(238) },
  { id: 16, title: "Indie Game Jam", category: "Tech", description: "Design, code, and ship a playable game in 72 hours.", image: pic(119) },
  { id: 17, title: "Lens & Light Workshop", category: "Photography", description: "Master composition, lighting, and post-processing.", image: pic(250) },
  { id: 18, title: "Yoga at Dawn", category: "Wellness", description: "Start your day with mindfulness on the campus green.", image: pic(1074) },
  { id: 19, title: "Campus TED Talks", category: "Education", description: "Student-led talks that challenge ideas and ignite change.", image: pic(1080) },
  { id: 20, title: "Midnight Riders Club", category: "Bikers", description: "Night rides through the city with helmets and headlights.", image: pic(164) },
  { id: 21, title: "Startup Pitch Night", category: "Gigs", description: "5-minute pitches, live feedback, and real funding.", image: pic(380) },
  { id: 22, title: "Cultural Festival", category: "Events", description: "Celebrating diversity through food, dance, and art.", image: pic(452) },
  { id: 23, title: "Marathon Training", category: "Sports", description: "12-week program from couch to campus 10K.", image: pic(106) },
  { id: 24, title: "Jazz & Blues Evening", category: "Music", description: "Live jazz in the courtyard with fairy lights.", image: pic(593) },
  { id: 25, title: "Design Thinking Lab", category: "Education", description: "Human-centered design workshops for real problems.", image: pic(48) },
  { id: 26, title: "Film Making Society", category: "Photography", description: "Short films, documentaries, and campus stories.", image: pic(65) },
  { id: 27, title: "ThriftFlip Market", category: "Fashion", description: "Buy, sell, and swap pre-loved fashion on campus.", image: pic(399) },
  { id: 28, title: "Meditation Circle", category: "Wellness", description: "Guided meditation sessions every Tuesday evening.", image: pic(1039) },
  { id: 29, title: "Robotics Challenge", category: "Tech", description: "Build, program, and battle autonomous robots.", image: pic(0) },
  { id: 30, title: "Dance Crew Battles", category: "Events", description: "Hip-hop, contemporary, and freestyle face-offs.", image: pic(433) },
];
