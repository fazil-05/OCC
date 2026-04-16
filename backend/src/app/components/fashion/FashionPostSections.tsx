import React from "react";
import { Link } from "@/lib/router-compat";
import { motion } from "motion/react";

const FP = {
  bg: "#0C0C0A", card: "#141410", elevated: "#1C1C18",
  border: "rgba(255,248,235,0.08)", borderHover: "rgba(201,169,110,0.35)",
  text: "#F5F0E8", muted: "#8A8478", dim: "#4A4840",
  gold: "#C9A962", secondary: "#D4A5A5",
} as const;

const offerings = [
  { k: "01", title: "Runway & showcases", body: "Semester shows, pop-up runways, and collab drops with local labels — lights, lineup, backstage comms." },
  { k: "02", title: "Styling labs", body: "Mood boards, capsule wardrobes, and AI-assisted look generation — then we shoot it on real bodies." },
  { k: "03", title: "Brand & campaigns", body: "Pitch decks, lookbooks, and social-first reels. OCC negotiates usage rights so you get paid." },
  { k: "04", title: "Editorial stills", body: "Studio days with pro lighting — think magazine spreads, not phone snaps in a corridor." },
];

function MeshBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 opacity-90" aria-hidden>
      <div
        className="absolute -top-1/4 left-1/4 h-[70%] w-[55%] rounded-full blur-[120px]"
        style={{ background: "radial-gradient(circle, rgba(201,169,98,0.18) 0%, transparent 70%)" }}
      />
      <div
        className="absolute top-1/3 -right-1/4 h-[60%] w-[50%] rounded-full blur-[100px]"
        style={{ background: "radial-gradient(circle, rgba(212,165,165,0.12) 0%, transparent 68%)" }}
      />
    </div>
  );
}

export function FashionEditorialSection() {
  return (
    <section className="relative overflow-hidden px-6 py-28 md:px-12 md:py-40" style={{ background: FP.card }}>
      <MeshBackdrop />
      <div className="relative z-10 mx-auto max-w-[76rem]">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:gap-24">
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-center"
          >
            <p className="font-mono-label mb-5 text-[11px] tracking-[0.5em] uppercase" style={{ color: FP.muted }}>
              What we build
            </p>
            <h2 className="font-headline text-[clamp(2.5rem,7vw,5rem)] leading-[0.92] tracking-[0.04em]" style={{ color: FP.text }}>
              THE FULL
            </h2>
            <h2 className="font-editorial text-[clamp(2.5rem,7vw,5rem)] leading-[0.92]" style={{ color: FP.gold }}>
              Fashion Experience.
            </h2>
            <p className="mt-8 max-w-md text-[15px] leading-[1.8]" style={{ color: FP.muted, fontFamily: "'DM Sans', sans-serif" }}>
              Not a grid of emoji cards — a club that runs production like a studio: concept, cast, shoot, release.
            </p>
            <div
              className="mt-10 hidden h-px w-32 lg:block"
              style={{ background: `linear-gradient(90deg, ${FP.gold}, transparent)` }}
            />
          </motion.div>

          <div className="grid grid-cols-1 gap-px sm:grid-cols-2" style={{ border: `1px solid ${FP.border}` }}>
            {offerings.map((item, i) => (
              <motion.article
                key={item.k}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className="group relative px-9 py-10 transition-all duration-[400ms]"
                style={{
                  background: FP.bg,
                  borderRight: `1px solid ${FP.border}`,
                  borderBottom: `1px solid ${FP.border}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = FP.elevated;
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = FP.bg;
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <span className="font-mono-label text-xs tracking-[0.35em]" style={{ color: FP.dim }}>{item.k}</span>
                <h3 className="font-headline mt-5 text-[18px] tracking-[0.08em]" style={{ color: FP.text }}>{item.title}</h3>
                <p className="mt-3 text-sm leading-[1.7]" style={{ color: FP.muted, fontFamily: "'DM Sans', sans-serif" }}>{item.body}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const timeline = [
  { phase: "Concept", detail: "Briefs, references, fabric mood" },
  { phase: "Cast & fit", detail: "Models, tailors, last-minute pins" },
  { phase: "Shoot day", detail: "Stills + motion, same lighting grid" },
  { phase: "Release", detail: "Premiere night + digital pack" },
];

export function FashionTimelineStrip() {
  return (
    <section className="relative px-6 py-28 md:px-12 md:py-32" style={{ background: FP.bg }}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-40" style={{ background: `linear-gradient(90deg, transparent, ${FP.gold}, transparent)` }} />
      <div className="mx-auto max-w-[76rem]">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-mono-label mb-16 text-center text-[11px] tracking-[0.5em] uppercase"
          style={{ color: FP.muted }}
        >
          From sketch to spotlight
        </motion.p>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-0" style={{ borderTop: `1px solid ${FP.border}` }}>
          {timeline.map((t, i) => (
            <motion.div
              key={t.phase}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="relative border-l pl-6 pt-8 md:border-l-0 md:border-r md:pl-0 md:pr-6"
              style={{ borderColor: FP.border }}
            >
              <span className="font-headline text-lg tracking-[0.06em]" style={{ color: FP.text }}>{t.phase}</span>
              <p className="mt-2 text-sm leading-[1.7]" style={{ color: FP.muted, fontFamily: "'DM Sans', sans-serif" }}>{t.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const gigs = [
  { role: "Runway model", range: "₹2k–8k / show" },
  { role: "Styling assistant", range: "₹800–2k / day" },
  { role: "Lookbook shooter", range: "₹3k–12k / project" },
  { role: "Social content", range: "₹4k–15k / month" },
];

export function FashionGigsSection() {
  return (
    <section className="px-6 py-28 md:px-12 md:py-40" style={{ background: FP.card }}>
      <div className="mx-auto grid max-w-[76rem] grid-cols-1 gap-16 md:grid-cols-[1fr_1.15fr] md:gap-24">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-center"
        >
          <p className="font-mono-label mb-5 text-[11px] tracking-[0.4em] uppercase" style={{ color: FP.muted }}>Paid Pathways</p>
          <h2 className="font-headline text-[clamp(3rem,8vw,6rem)] leading-[0.92] tracking-[0.04em]" style={{ color: FP.text }}>GIGS THAT</h2>
          <h2 className="font-editorial text-[clamp(2rem,6vw,4.5rem)] leading-[0.92]" style={{ color: FP.gold }}>Dress Well.</h2>
          <p className="mt-8 max-w-[340px] text-[15px] leading-[1.8]" style={{ color: FP.muted, fontFamily: "'DM Sans', sans-serif" }}>
            OCC Fashion routes paid work through vetted briefs — you keep portfolio rights where it matters.
          </p>
          <div className="mt-10 flex gap-8">
            {[{ n: "₹800–15K", l: "Per Gig" }, { n: "30+", l: "Active Gigs" }, { n: "S1", l: "Now Live" }].map((s) => (
              <div key={s.l}>
                <span className="font-headline text-2xl tracking-wide" style={{ color: FP.text }}>{s.n}</span>
                <p className="font-mono-label mt-1 text-[10px] tracking-[0.3em] uppercase" style={{ color: FP.muted }}>{s.l}</p>
              </div>
            ))}
          </div>
        </motion.div>
        <div className="flex flex-col" style={{ borderTop: `1px solid ${FP.border}` }}>
          {gigs.map((g, i) => (
            <motion.div
              key={g.role}
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              className="group flex items-center justify-between py-6 transition-all duration-[250ms]"
              style={{ borderBottom: `1px solid ${FP.border}` }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(201,169,110,0.04)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              <span className="font-headline text-lg tracking-[0.06em] transition-colors duration-300 group-hover:text-[#C9A962]" style={{ color: FP.text }}>{g.role}</span>
              <span className="font-mono-label text-sm transition-transform duration-300 group-hover:translate-x-1" style={{ color: FP.gold }}>{g.range}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FashionJoinSection({ userId }: { userId?: string | null }) {
  return (
    <section
      className="relative overflow-hidden px-6 py-32 md:px-12 md:py-44"
      style={{ background: `radial-gradient(ellipse 60% 50% at 50% 100%, rgba(201,169,110,0.06) 0%, transparent 70%), ${FP.bg}` }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${FP.border}, transparent)` }} />
      <motion.div
        className="pointer-events-none absolute inset-0 flex select-none items-center justify-center font-headline text-[28vw] font-black leading-none tracking-[0.08em] opacity-[0.03]"
        style={{ color: FP.text }}
        aria-hidden
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.03 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
      >
        CURATED
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 44 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mx-auto max-w-2xl text-center"
      >
        <p className="font-mono-label mb-6 text-[11px] tracking-[0.5em] uppercase" style={{ color: FP.muted }}>Fashion Club</p>
        <h2 className="font-headline text-[clamp(3rem,10vw,6rem)] leading-[0.92] tracking-[0.04em]" style={{ color: FP.text }}>STEP INTO</h2>
        <h2 className="font-editorial text-[clamp(2.5rem,9vw,5.5rem)] leading-[0.92]" style={{ color: FP.gold }}>The Line.</h2>
        <p className="mx-auto mt-8 max-w-[520px] text-[16px] leading-[1.8]" style={{ color: FP.muted, fontFamily: "'DM Sans', sans-serif" }}>
          Join OCC Fashion — editorial craft, runway nights, and a crew that treats every drop like a premiere.
        </p>
        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            to={userId ? "/clubs/fashion?welcome=true" : "/login"}
            className="font-mono-label px-10 py-[18px] text-[11px] tracking-[0.2em] uppercase transition-all duration-300 hover:scale-[1.02]"
            style={{ background: FP.gold, color: FP.bg, borderRadius: "2px" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = FP.gold; e.currentTarget.style.boxShadow = `inset 0 0 0 1px ${FP.gold}`; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = FP.gold; e.currentTarget.style.color = FP.bg; e.currentTarget.style.boxShadow = "none"; }}
          >
            Join Now
          </Link>
          <Link
            to={userId ? "/clubs" : "/login"}
            className="font-mono-label px-10 py-[18px] text-[11px] tracking-[0.2em] uppercase transition-all duration-300 hover:scale-[1.02]"
            style={{ color: FP.gold, boxShadow: `inset 0 0 0 1px ${FP.gold}`, borderRadius: "2px" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = FP.gold; e.currentTarget.style.color = FP.bg; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = FP.gold; }}
          >
            All Clubs
          </Link>
        </div>
        <div className="mt-14 flex items-center justify-center gap-3">
          <div className="flex -space-x-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-7 w-7 rounded-full" style={{ background: `hsl(${35 + i * 12}, ${40 + i * 5}%, ${28 + i * 6}%)`, border: `2px solid ${FP.bg}` }} />
            ))}
          </div>
          <span className="text-sm" style={{ color: FP.muted, fontFamily: "'DM Sans', sans-serif" }}>2,400+ students across Bangalore</span>
        </div>
      </motion.div>
    </section>
  );
}
