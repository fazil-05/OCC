"use client";

import React, { useEffect } from "react";
import { Link } from "@/lib/router-compat";
import { motion, AnimatePresence } from "motion/react";
import { usePhotographyFrames } from "../../../hooks/usePhotographyFrames";
import {
  PHOTO_TOTAL_FRAMES,
  PHOTO_FRAMES_PATH,
  PC,
} from "./photographyConstants";
import { PhotographyScrollSection } from "./PhotographyScrollSection";

function PhotoLoadingScreen({
  progress,
  loaded,
}: {
  progress: number;
  loaded: boolean;
}) {
  return (
    <AnimatePresence>
      {!loaded && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
          style={{ background: PC.bg }}
          exit={{ opacity: 0, filter: "blur(12px)" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            animate={{ rotate: [0, -8, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
            className="mb-6 text-5xl"
          >
            📷
          </motion.div>
          <h1
            className="font-headline mb-8 text-4xl tracking-[0.3em] md:text-5xl"
            style={{ color: PC.text }}
          >
            LOADING PHOTOGRAPHY CLUB
          </h1>
          <div className="w-72">
            <div className="h-px w-full" style={{ background: "#222" }}>
              <div
                className="h-full transition-all duration-75"
                style={{ width: `${progress * 100}%`, background: PC.accent }}
              />
            </div>
            <p
              className="mt-3 text-center text-xs tracking-[0.3em]"
              style={{ color: PC.muted }}
            >
              {Math.round(progress * 100)}%
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PhotoCursor() {
  const dotRef = React.useRef<HTMLDivElement>(null);
  const ringRef = React.useRef<HTMLDivElement>(null);
  const mouse = React.useRef({ x: 0, y: 0 });
  const ring = React.useRef({ x: 0, y: 0 });
  const hover = React.useRef(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      hover.current = !!(
        t.closest("a") ||
        t.closest("button") ||
        t.closest("[role=button]")
      );
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    let raf = 0;
    const loop = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.12;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.12;
      if (dotRef.current)
        dotRef.current.style.transform = `translate(${mouse.current.x - 6}px, ${mouse.current.y - 6}px)`;
      const rs = hover.current ? 60 : 40;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x - rs / 2}px, ${ring.current.y - rs / 2}px)`;
        ringRef.current.style.width = `${rs}px`;
        ringRef.current.style.height = `${rs}px`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] hidden h-3 w-3 rounded-full mix-blend-difference md:block"
        style={{ background: "#FFFFFF" }}
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[9998] hidden rounded-full border mix-blend-difference transition-[width,height] duration-200 md:block"
        style={{ borderColor: "#FFFFFF" }}
      />
    </>
  );
}

function GrainOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[9997] opacity-[0.04]">
      <svg className="h-[200%] w-[200%] animate-grain">
        <filter id="photo-fg">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#photo-fg)" />
      </svg>
    </div>
  );
}

const PP = {
  bg: "#0C0C0A", card: "#141410", elevated: "#1C1C18",
  border: "rgba(255,248,235,0.08)", borderHover: "rgba(255,215,0,0.3)",
  text: "#F5F0E8", muted: "#8A8478", dim: "#4A4840",
  gold: "#FFD700", secondary: "#FF6B35",
} as const;

function ShootDaySection() {
  const items = [
    { k: "01", title: "Photo Walks", desc: "Weekly campus and city photo walks." },
    { k: "02", title: "Film Lab", desc: "Darkroom access and film development." },
    { k: "03", title: "Exhibitions", desc: "Semester showcase in the main gallery." },
    { k: "04", title: "Gear Library", desc: "Borrow DSLRs, film cameras, lenses." },
    { k: "05", title: "Critique Sessions", desc: "Weekly photo reviews with seniors." },
    { k: "06", title: "Editing Suite", desc: "Lightroom and Capture One workshops." },
  ];

  return (
    <section className="px-6 py-28 md:px-12 md:py-40" style={{ background: PP.card }}>
      <div className="mx-auto max-w-[76rem]">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.85 }}
          className="mb-20 md:mb-24"
        >
          <p className="font-mono-label mb-5 text-[11px] tracking-[0.5em] uppercase" style={{ color: PP.muted }}>Shoot Day</p>
          <h2 className="font-headline text-[clamp(2.5rem,7vw,5rem)] leading-[0.92] tracking-[0.04em]" style={{ color: PP.text }}>SHOOT DAY</h2>
          <h2 className="font-editorial text-[clamp(2.5rem,7vw,5rem)] leading-[0.92]" style={{ color: PP.secondary }}>Experience.</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ border: `1px solid ${PP.border}` }}>
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="group px-9 py-10 transition-all duration-[400ms]"
              style={{ background: PP.bg, borderRight: `1px solid ${PP.border}`, borderBottom: `1px solid ${PP.border}` }}
              onMouseEnter={(e) => { e.currentTarget.style.background = PP.elevated; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = PP.bg; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <span className="font-mono-label text-xs tracking-[0.35em]" style={{ color: PP.dim }}>{item.k}</span>
              <h3 className="font-headline mt-5 text-[18px] tracking-[0.08em]" style={{ color: PP.text }}>{item.title}</h3>
              <p className="mt-3 text-sm leading-[1.7]" style={{ color: PP.muted, fontFamily: "'DM Sans', sans-serif" }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PhotoGigsSection() {
  const gigs = [
    { title: "Event Photographer", pay: "₹1,200–2,500 / event" },
    { title: "Portrait Sessions", pay: "₹800–1,500 / session" },
    { title: "Social Media Shooter", pay: "₹2,500–4,000 / month" },
    { title: "Product Photography", pay: "₹1,000–2,000 / shoot" },
    { title: "Wedding Second Shooter", pay: "₹3,000–6,000 / day" },
  ];
  return (
    <section className="px-6 py-28 md:px-12 md:py-40" style={{ background: PP.bg }}>
      <div className="mx-auto grid max-w-[76rem] grid-cols-1 gap-16 md:grid-cols-[1fr_1.15fr] md:gap-24">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-center"
        >
          <p className="font-mono-label mb-5 text-[11px] tracking-[0.4em] uppercase" style={{ color: PP.muted }}>Earn Through the Lens</p>
          <h2 className="font-headline text-[clamp(3rem,8vw,6rem)] leading-[0.92] tracking-[0.04em]" style={{ color: PP.text }}>GIG</h2>
          <h2 className="font-editorial text-[clamp(2rem,6vw,4.5rem)] leading-[0.92]" style={{ color: PP.secondary }}>Opportunities.</h2>
          <p className="mt-8 max-w-[340px] text-[15px] leading-[1.8]" style={{ color: PP.muted, fontFamily: "'DM Sans', sans-serif" }}>
            Paid shoots and retainers through OCC Photography Club — build a portfolio that pays.
          </p>
          <div className="mt-10 flex gap-8">
            {[{ n: "₹800–6K", l: "Per Gig" }, { n: "40+", l: "Active Gigs" }, { n: "S1", l: "Now Live" }].map((s) => (
              <div key={s.l}>
                <span className="font-headline text-2xl tracking-wide" style={{ color: PP.text }}>{s.n}</span>
                <p className="font-mono-label mt-1 text-[10px] tracking-[0.3em] uppercase" style={{ color: PP.muted }}>{s.l}</p>
              </div>
            ))}
          </div>
        </motion.div>
        <div className="flex flex-col" style={{ borderTop: `1px solid ${PP.border}` }}>
          {gigs.map((g, i) => (
            <motion.div
              key={g.title}
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group flex items-center justify-between py-6 transition-all duration-[250ms]"
              style={{ borderBottom: `1px solid ${PP.border}` }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,215,0,0.04)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              <span className="font-headline text-lg tracking-[0.06em] transition-colors duration-300 group-hover:text-[#FFD700]" style={{ color: PP.text }}>{g.title}</span>
              <span className="font-mono-label text-sm transition-transform duration-300 group-hover:translate-x-1" style={{ color: PP.gold }}>{g.pay}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function JoinPhotoSection() {
  return (
    <section
      className="relative overflow-hidden px-6 py-32 md:px-12 md:py-44"
      style={{ background: `radial-gradient(ellipse 60% 50% at 50% 100%, rgba(255,215,0,0.06) 0%, transparent 70%), ${PP.card}` }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${PP.border}, transparent)` }} />
      <div
        className="pointer-events-none absolute inset-0 flex select-none items-center justify-center font-headline text-[30vw] font-black leading-none tracking-[0.05em] opacity-[0.03]"
        style={{ color: PP.text }}
        aria-hidden
      >
        OCC
      </div>
      <motion.div
        initial={{ opacity: 0, y: 44 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mx-auto max-w-2xl text-center"
      >
        <p className="font-mono-label mb-6 text-[11px] tracking-[0.5em] uppercase" style={{ color: PP.muted }}>Photography Club</p>
        <h2 className="font-headline text-[clamp(3rem,10vw,6rem)] leading-[0.92] tracking-[0.04em]" style={{ color: PP.text }}>READY TO</h2>
        <h2 className="font-editorial text-[clamp(2.5rem,9vw,5.5rem)] leading-[0.92]" style={{ color: PP.gold }}>Shoot?</h2>
        <p className="mx-auto mt-8 max-w-[520px] text-[16px] leading-[1.8]" style={{ color: PP.muted, fontFamily: "'DM Sans', sans-serif" }}>
          Join OCC Photography Club — darkroom energy, editorial craft, and a crew that actually prints the work.
        </p>
        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            to="/login"
            className="font-mono-label px-10 py-[18px] text-[11px] tracking-[0.2em] uppercase transition-all duration-300 hover:scale-[1.02]"
            style={{ background: PP.gold, color: PP.bg, borderRadius: "2px" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = PP.gold; e.currentTarget.style.boxShadow = `inset 0 0 0 1px ${PP.gold}`; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = PP.gold; e.currentTarget.style.color = PP.bg; e.currentTarget.style.boxShadow = "none"; }}
          >
            Join Now
          </Link>
          <Link
            to="/login"
            className="font-mono-label px-10 py-[18px] text-[11px] tracking-[0.2em] uppercase transition-all duration-300 hover:scale-[1.02]"
            style={{ color: PP.gold, boxShadow: `inset 0 0 0 1px ${PP.gold}`, borderRadius: "2px" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = PP.gold; e.currentTarget.style.color = PP.bg; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = PP.gold; }}
          >
            Explore Clubs
          </Link>
        </div>
        <div className="mt-14 flex items-center justify-center gap-3">
          <div className="flex -space-x-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-7 w-7 rounded-full" style={{ background: `hsl(${40 + i * 10}, ${50 + i * 5}%, ${25 + i * 6}%)`, border: `2px solid ${PP.card}` }} />
            ))}
          </div>
          <span className="text-sm" style={{ color: PP.muted, fontFamily: "'DM Sans', sans-serif" }}>2,400+ students across Bangalore</span>
        </div>
      </motion.div>
    </section>
  );
}

export function PhotographyPage({ hideLoader = false }: { hideLoader?: boolean } = {}) {
  const { frames, loaded, progress } = usePhotographyFrames(
    PHOTO_FRAMES_PATH,
    PHOTO_TOTAL_FRAMES,
  );

  return (
    <div className="cursor-none" style={{ background: PC.bg, color: PC.text }}>
      {!hideLoader && <PhotoLoadingScreen progress={progress} loaded={loaded} />}
      <PhotoCursor />
      <GrainOverlay />

      <motion.div
        initial={{ clipPath: "inset(0 0 100% 0)" }}
        animate={loaded ? { clipPath: "inset(0 0 0% 0)" } : { clipPath: "inset(0 0 100% 0)" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{ background: PC.bg }}
      >
        <header className="pointer-events-none fixed top-0 right-0 left-0 z-[100] flex items-center justify-between px-6 py-6 mix-blend-difference md:px-12">
          <Link
            to="/"
            className="pointer-events-auto text-[10px] tracking-[0.4em] uppercase"
            style={{ color: PC.text }}
          >
            ← OCC
          </Link>
          <span
            className="font-headline text-lg tracking-[0.15em] md:text-xl"
            style={{ color: PC.text }}
          >
            OCC
          </span>
          <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: PC.muted }}>
            Photography
          </span>
        </header>

        <PhotographyScrollSection frames={frames} loaded={loaded} />

        <ShootDaySection />
        <PhotoGigsSection />
        <JoinPhotoSection />

        <footer
          className="border-t px-6 py-12 text-center"
          style={{ borderColor: PP.border, background: PP.bg }}
        >
          <p className="font-mono-label text-xs tracking-[0.2em]" style={{ color: PP.muted }}>
            OCC Photography ·{" "}
            <Link
              to="/"
              className="transition-colors hover:underline"
              style={{ color: PP.gold }}
            >
              Return home
            </Link>
          </p>
        </footer>
      </motion.div>
    </div>
  );
}
