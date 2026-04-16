/**
 * Three distinct 5-question sets per club (rotate randomly per visit).
 * Keys q1–q5 stay stable for storage / analytics alignment.
 */
import type { ClubOnboardingQuestion, ClubOnboardingSlug } from "./clubOnboardingQuestions.types";

type Q = { prompt: string; options: string[] };

function pack(a: Q, b: Q, c: Q, d: Q, e: Q): ClubOnboardingQuestion[] {
  const keys = ["q1", "q2", "q3", "q4", "q5"] as const;
  return [a, b, c, d, e].map((item, i) => ({
    key: keys[i],
    prompt: item.prompt,
    options: item.options,
  }));
}

export const QUESTION_BANK: Record<
  ClubOnboardingSlug,
  readonly [ClubOnboardingQuestion[], ClubOnboardingQuestion[], ClubOnboardingQuestion[]]
> = {
  sports: [
    pack(
      {
        prompt: "What position do you naturally drift toward?",
        options: ["Striker", "Midfielder", "Defender", "Goalkeeper"],
      },
      {
        prompt: "How often do you play right now?",
        options: [
          "Every weekend",
          "A few times a month",
          "Rarely but I love watching",
          "Just getting started",
        ],
      },
      {
        prompt: "What are you most excited about?",
        options: [
          "Joining tournaments",
          "Booking turf with friends",
          "Watching and discussing matches",
          "Learning proper technique",
        ],
      },
      {
        prompt: "Which football culture do you vibe with most?",
        options: [
          "Street football energy",
          "Champions League prestige",
          "Local college leagues",
          "Mundial world cup passion",
        ],
      },
      {
        prompt: "What do you want from OCC Football Club?",
        options: [
          "Find people to play with regularly",
          "Compete in tournaments",
          "Just enjoy the community",
          "Improve my skills",
        ],
      },
    ),
    pack(
      {
        prompt: "Where on the pitch do you love being involved most?",
        options: ["Near the goal", "Orchestrating play", "Stopping attacks", "Sweeping behind the line"],
      },
      {
        prompt: "Your real-life football week looks like…",
        options: ["Train or play 2+ times", "Weekend kickabouts only", "Mostly watch & analyze", "Building the habit now"],
      },
      {
        prompt: "What kind of match energy pulls you in?",
        options: ["High press chaos", "Patient build-up", "Counter-attack thrill", "Set-piece drama"],
      },
      {
        prompt: "Which ritual sounds like you?",
        options: ["Pre-match playlist", "Team huddle", "Quiet focus", "Banter on the sideline"],
      },
      {
        prompt: "What would make OCC Football feel worth it?",
        options: ["Consistent pickup games", "Friendly leagues", "Watch parties", "Skills clinics"],
      },
    ),
    pack(
      {
        prompt: "Pick the mindset that fits you best",
        options: ["Finish everything", "Control the tempo", "Win the duels", "Read the game early"],
      },
      {
        prompt: "How do you usually consume football?",
        options: ["Live when I can", "Highlights & clips", "Tactical breakdowns", "Playing more than watching"],
      },
      {
        prompt: "Your dream football Saturday?",
        options: ["Tournament day", "Turf with friends", "League match", "Recovery & film study"],
      },
      {
        prompt: "What frustrates you most in casual games?",
        options: ["No structure", "Selfish play", "Uneven teams", "No subs / fatigue"],
      },
      {
        prompt: "Why OCC Football specifically?",
        options: ["Meet serious players", "Campus-level competition", "Inclusive social games", "Learn from better players"],
      },
    ),
  ],
  bikers: [
    pack(
      {
        prompt: "How would you describe your riding experience?",
        options: ["Long-time rider", "Weekend regular", "Occasional explorer", "Just getting into it"],
      },
      {
        prompt: "What kind of machine feels most like you?",
        options: ["Sports bike", "Cruiser", "Adventure bike", "Scooter / city ride"],
      },
      {
        prompt: "Which route sounds like your perfect ride?",
        options: ["Hill roads at sunrise", "City night loops", "Highway distance runs", "Cafe-hopping day rides"],
      },
      {
        prompt: "What is your riding style?",
        options: ["Fast and focused", "Smooth and scenic", "Group pack energy", "Solo headspace"],
      },
      {
        prompt: "Why are you joining OCC Bikers?",
        options: [
          "Find my riding crew",
          "Discover new routes",
          "Join organized rides",
          "Learn more about biking culture",
        ],
      },
    ),
    pack(
      {
        prompt: "What mileage feels normal for you lately?",
        options: ["200+ km weekends", "Short city hops", "Still building stamina", "Track days only"],
      },
      {
        prompt: "Weather that still gets you on the bike?",
        options: ["Crisp mornings", "After-rain shine", "Night runs", "Only clear skies"],
      },
      {
        prompt: "Preferred crew size on a ride?",
        options: ["Big pack energy", "3–5 trusted riders", "Duo", "Solo always"],
      },
      {
        prompt: "What upgrade excites you next?",
        options: ["Better safety gear", "Touring setup", "Performance tune", "Commute practicality"],
      },
      {
        prompt: "What should OCC Bikers help you unlock?",
        options: ["Safer highway etiquette", "Scenic route maps", "Maintenance confidence", "Event calendar"],
      },
    ),
    pack(
      {
        prompt: "Your relationship with traffic?",
        options: ["Filter confidently", "Prefer empty roads", "Patient in jams", "Still learning"],
      },
      {
        prompt: "Soundtrack on the ride?",
        options: ["Engine only", "Helmet comms", "Lo-fi / podcasts", "Loud playlist"],
      },
      {
        prompt: "Photography on rides?",
        options: ["Always pulling over", "Quick phone snaps", "Action cam", "Eyes on the road only"],
      },
      {
        prompt: "Ideal pit stop?",
        options: ["Strong coffee", "Hot food", "Fuel & go", "Scenic viewpoint"],
      },
      {
        prompt: "Joining OCC mostly for…",
        options: ["Brotherhood / sisterhood", "Skill swaps", "Charity rides", "Campus credibility"],
      },
    ),
  ],
  music: [
    pack(
      {
        prompt: "Where do you fit in the room?",
        options: ["Singer", "Instrumentalist", "Producer / DJ", "Just here for the vibe"],
      },
      {
        prompt: "Which sound feels most like you?",
        options: ["Indie / alt", "Hip-hop / rap", "Pop / acoustic", "Electronic / experimental"],
      },
      {
        prompt: "What kind of performance energy do you like?",
        options: ["Open mics", "Studio sessions", "Big live sets", "Small jam circles"],
      },
      {
        prompt: "How much stage experience do you have?",
        options: ["Performed a lot", "A few times", "Mostly private practice", "Never, but I want to start"],
      },
      {
        prompt: "What do you want most from OCC Music?",
        options: ["Meet collaborators", "Perform live", "Build original work", "Explore new sounds"],
      },
    ),
    pack(
      {
        prompt: "Your creative workflow?",
        options: ["Melody first", "Lyrics first", "Groove / beat first", "Random happy accidents"],
      },
      {
        prompt: "Listening diet this month?",
        options: ["Album deep dives", "Playlists only", "Live recordings", "Friend recommendations"],
      },
      {
        prompt: "Gear you lean on?",
        options: ["Just a DAW", "Hardware synths", "Acoustic instruments", "Phone + headphones"],
      },
      {
        prompt: "Crowd size you dream of?",
        options: ["Intimate 40", "Campus hall", "Festival stage", "Streaming audience"],
      },
      {
        prompt: "OCC Music should help you…",
        options: ["Finish songs", "Find a band", "Learn theory", "Book gigs"],
      },
    ),
    pack(
      {
        prompt: "Role in a collab session?",
        options: ["Director energy", "Support player", "Idea machine", "Engineer / mixer"],
      },
      {
        prompt: "Vocal confidence?",
        options: ["Front-person ready", "BGVs only", "Rap / spoken", "Still warming up"],
      },
      {
        prompt: "Genre you secretly want to try?",
        options: ["Jazz harmony", "Metal intensity", "House / techno", "Classical arrangement"],
      },
      {
        prompt: "Best feedback for you?",
        options: ["Brutally honest", "Gentle nudges", "Technical notes", "Energy check only"],
      },
      {
        prompt: "Success this semester looks like…",
        options: ["One released track", "Three live slots", "New network", "Skill breakthrough"],
      },
    ),
  ],
  photography: [
    pack(
      {
        prompt: "What are you usually shooting with?",
        options: ["DSLR / mirrorless", "Film camera", "Phone camera", "Whatever I can get"],
      },
      {
        prompt: "Which style pulls you in most?",
        options: ["Street", "Portraits", "Events", "Fashion / editorial"],
      },
      {
        prompt: "What do you love pointing the lens at?",
        options: ["People", "Architecture", "Nature", "Movement / action"],
      },
      {
        prompt: "How would you describe your experience level?",
        options: ["Confident and consistent", "Learning quickly", "Just experimenting", "Mostly editing so far"],
      },
      {
        prompt: "What are you hoping OCC Photography gives you?",
        options: ["Photo walks and peers", "Portfolio growth", "Paid shoot opportunities", "Feedback and technique"],
      },
    ),
    pack(
      {
        prompt: "Light you chase most?",
        options: ["Golden hour", "Hard noon contrast", "Neon night", "Soft window light"],
      },
      {
        prompt: "Editing relationship?",
        options: ["Lightroom daily", "Photoshop heavy", "Mobile quick edits", "Straight out of camera"],
      },
      {
        prompt: "Lens you’d grab first?",
        options: ["35mm storytelling", "85mm portraits", "Wide drama", "Whatever’s on the body"],
      },
      {
        prompt: "Subject that intimidates you (in a good way)?",
        options: ["Strangers on the street", "Fast sports", "Low light events", "Directing models"],
      },
      {
        prompt: "OCC Photography should feel…",
        options: ["Critique-heavy", "Supportive & social", "Career-focused", "Purely creative play"],
      },
    ),
    pack(
      {
        prompt: "How do you carry your kit?",
        options: ["One backpack, always", "Minimal pouch", "Borrow gear often", "Still assembling"],
      },
      {
        prompt: "Composition habit?",
        options: ["Rule of thirds", "Center punch", "Layers & frames", "Break rules on purpose"],
      },
      {
        prompt: "Color or monochrome?",
        options: ["Rich color grades", "Classic black & white", "Mix of both", "Depends on story"],
      },
      {
        prompt: "Portfolio priority?",
        options: ["Instagram grid", "Print zine", "Client PDF", "Not public yet"],
      },
      {
        prompt: "Dream OCC outcome?",
        options: ["Exhibition slot", "Styled group shoots", "Mentor pairing", "Gear knowledge"],
      },
    ),
  ],
  fitness: [
    pack(
      {
        prompt: "Where are you in your fitness journey?",
        options: ["Beginner", "Getting consistent", "Already committed", "Athlete mode"],
      },
      {
        prompt: "What kind of movement do you enjoy most?",
        options: ["Strength training", "Running / cardio", "Sports conditioning", "Yoga / mobility"],
      },
      {
        prompt: "What goal matters most right now?",
        options: ["Get stronger", "Look leaner", "Feel healthier", "Build discipline"],
      },
      {
        prompt: "How much time can you realistically give each week?",
        options: ["2-3 sessions", "4-5 sessions", "Daily if needed", "Still figuring it out"],
      },
      {
        prompt: "Why OCC Fitness?",
        options: [
          "Need accountability",
          "Want a workout crew",
          "Love challenges",
          "Want coaching and structure",
        ],
      },
    ),
    pack(
      {
        prompt: "Training environment you prefer?",
        options: ["Gym floor", "Outdoor track", "Home minimal setup", "Mixed"],
      },
      {
        prompt: "Recovery habits?",
        options: ["Sleep maxed", "Stretch often", "Still learning", "Skip too often"],
      },
      {
        prompt: "Metric you track?",
        options: ["Weights lifted", "Km run", "Steps / rings", "Mood & energy"],
      },
      {
        prompt: "Biggest blocker historically?",
        options: ["Time", "Motivation", "Injury", "Knowledge"],
      },
      {
        prompt: "OCC Fitness should push you toward…",
        options: ["Competition prep", "Sustainable habits", "Social accountability", "Skill workshops"],
      },
    ),
    pack(
      {
        prompt: "Music while training?",
        options: ["High-BPM playlists", "Podcasts", "Silence", "Whatever’s playing in the room"],
      },
      {
        prompt: "Nutrition honesty?",
        options: ["Meal-prepped", "Campus food hacks", "Learning macros", "Not focused yet"],
      },
      {
        prompt: "Group class energy?",
        options: ["HIIT chaos", "Controlled strength", "Dance / Zumba", "Not my thing"],
      },
      {
        prompt: "Victory moment for you?",
        options: ["New PR", "Visible definition", "Pain-free week", "Showing up 10/10"],
      },
      {
        prompt: "Joining OCC mostly to…",
        options: ["Meet training partners", "Access challenges", "Learn programming", "Stay consistent"],
      },
    ),
  ],
  fashion: [
    pack(
      {
        prompt: "What style identity feels closest to you?",
        options: ["Minimal and clean", "Streetwear", "Editorial / runway", "Still discovering it"],
      },
      {
        prompt: "Which lane are you most drawn to?",
        options: ["Styling", "Designing", "Modeling", "Creative direction"],
      },
      {
        prompt: "What kind of brands catch your eye?",
        options: ["Luxury houses", "Indie labels", "Archive / vintage", "Campus-born brands"],
      },
      {
        prompt: "What kind of fashion events sound best?",
        options: ["Photoshoots", "Pop-up drops", "Styling labs", "Runway / showcase nights"],
      },
      {
        prompt: "What do you want from OCC Fashion?",
        options: [
          "Find creative collaborators",
          "Build a portfolio",
          "Attend standout events",
          "Express my style confidently",
        ],
      },
    ),
    pack(
      {
        prompt: "Fit preference right now?",
        options: ["Oversized ease", "Tailored sharp", "Experimental silhouettes", "Classic staples"],
      },
      {
        prompt: "Moodboard energy?",
        options: ["Pinterest boards", "Saved IG folders", "Physical tear sheets", "In my head only"],
      },
      {
        prompt: "Fabric you reach for?",
        options: ["Crisp cotton", "Technical nylon", "Soft knits", "Leather / faux"],
      },
      {
        prompt: "Campus fashion scene take?",
        options: ["Underrated", "Too safe", "Heating up", "I’m here to change it"],
      },
      {
        prompt: "OCC Fashion should help you…",
        options: ["Source better pieces", "Shoot concepts", "Pitch brands", "Grow confidence"],
      },
    ),
    pack(
      {
        prompt: "Color story this season?",
        options: ["Neutrals only", "Bold primaries", "Pastel dream", "All black everything"],
      },
      {
        prompt: "Accessory obsession?",
        options: ["Footwear", "Bags", "Jewelry", "Eyewear"],
      },
      {
        prompt: "Runway vs street?",
        options: ["Runway fantasy", "Street practical", "Blend both", "Anti-label"],
      },
      {
        prompt: "Collaboration style?",
        options: ["Lead concept", "Support execution", "Model only", "Document everything"],
      },
      {
        prompt: "Dream OCC moment?",
        options: ["Campus magazine feature", "Pop-up you co-curate", "Agency intro", "Found my creative twin"],
      },
    ),
  ],
};
