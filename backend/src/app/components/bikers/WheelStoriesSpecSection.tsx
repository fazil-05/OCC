"use client";

import React from "react";
import { COLORS } from "./constants";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

const techSpecs = [
  { label: "Tyre spin", detail: "Momentum + spring-decay physics" },
  { label: "Card transition", detail: "Cubic bezier 0.23, 1, 0.32, 1" },
  { label: "Spoke detail", detail: "24 spokes · gradient + shadow" },
  { label: "Card arc", detail: "5 visible · depth + scale falloff" },
];

const springRows: { property: string; description: string; value: string }[] = [
  { property: "initialVel", description: "Velocity impulse on click", value: "0.18" },
  { property: "decay", description: "Friction multiplier per frame", value: "0.92" },
  { property: "idleVel", description: "Always-on micro rotation", value: "0.0004" },
  { property: "overshoot1", description: "First wobble amplitude", value: "-0.008" },
  { property: "overshoot2", description: "Second wobble amplitude", value: "+0.004" },
  { property: "cardLerp", description: "Card position lerp factor", value: "0.085" },
  { property: "cardDelay", description: "Stagger between each card", value: "40ms" },
  { property: "cardEasing", description: "CSS cubic-bezier", value: "0.23, 1, 0.32, 1" },
  { property: "quoteFadeOut", description: "Quote text exit", value: "300ms" },
  { property: "quoteFadeIn", description: "Quote text enter", value: "420ms" },
  { property: "spokeBlur", description: "Motion blur at peak vel", value: "ctx.globalAlpha 0.6" },
];

const storiesJson = `[
  { "name": "Arjun Mehta",    "role": "Bikers Club",      "quote": "The mountain road doesn't end — it just changes direction.", "emoji": "🏍", "color": "#1a2a3a" },
  { "name": "Priya Nair",     "role": "Music Club",       "quote": "Every open mic starts with one brave voice.", "emoji": "🎵", "color": "#2a1a3a" },
  { "name": "Rahul Sharma",   "role": "Sports Club",      "quote": "Inter-campus is where legends are made.", "emoji": "⚽", "color": "#1a3a2a" },
  { "name": "Ananya Roy",     "role": "Photography Club", "quote": "The best frame is the one you almost missed.", "emoji": "📷", "color": "#3a2a1a" },
  { "name": "Kiran Desai",    "role": "Fitness Club",     "quote": "Pain is just the body discovering its limits.", "emoji": "💪", "color": "#2a3a1a" },
  { "name": "Sneha Patel",    "role": "Fashion Club",     "quote": "Style is how you tell your story without speaking.", "emoji": "👗", "color": "#3a1a2a" }
]`;

const masterAiPromptIntro = `You are a world-class creative frontend engineer specializing in ultra-smooth canvas animations and cinematic UI interactions.

BUILD: OCC (Off Campus Clubs) Wheel Stories — a Polaroid card carousel driven by a spinning bicycle tyre. Inspired by the Nederburg Stories UI but rebuilt completely for OCC.

Use React + Canvas + spring physics. Prefer useRef for RAF state (not useState in the hot loop).`;

const cursorShortPrompt = `Build the OCC Wheel Stories component exactly as follows:

1. useWheelPhysics.ts — tyreAngle, tyreVel as useRef; triggerSpin(dir): vel += dir * 0.18; RAF: vel *= 0.92, angle += vel, angle += 0.0004 idle; wobble settle when vel < 0.005.

2. TyreCanvas.tsx — 700×700 canvas, cropped top half; tyre + treads + rim + 24 gradient spokes + hub + gold cap; ghost spokes when vel > 0.08.

3. CardArc.tsx — 5 fan positions; stagger 40ms; incoming/outgoing transitions; center card breathe 3.2s.

4. QuoteDisplay.tsx — fade out 220ms → wait 280ms → fade in 280ms.

5. Six stories (Bikers, Music, Sports, Photography, Fitness, Fashion).

6. Warm off-white bg #F0EDE8, Playfair + DM Sans, gold #C8A96E.

Do not use useState inside RAF; use useRef for animation values.`;

const fileStructure = `components/WheelStories/
  index.tsx
  TyreCanvas.tsx
  CardArc.tsx
  StoryCard.tsx
  QuoteDisplay.tsx
  useWheelPhysics.ts
  useCardArc.ts
  stories.data.ts`;

export function WheelStoriesSpecSection() {
  return (
    <section
      className="border-t px-4 py-16 sm:px-6 md:px-12"
      style={{
        borderColor: "rgba(245,241,235,0.12)",
        background: "linear-gradient(180deg, #0a0a08 0%, #080808 100%)",
        color: COLORS.text,
      }}
    >
      <div className="mx-auto max-w-[90rem]">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <Badge
              variant="outline"
              className="mb-3 text-[11px] tracking-[0.2em] uppercase"
              style={{
                color: COLORS.accent,
                borderColor: `${COLORS.accent}55`,
                background: `${COLORS.accent}14`,
              }}
            >
              USE MCP FOR PREMIUM COMPONENTS, CARDS
            </Badge>
            <h2
              className="font-headline text-2xl tracking-tight md:text-3xl"
              style={{ color: COLORS.text }}
            >
              OCC Bikers · Wheel Stories
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: COLORS.muted }}>
              Implementation spec: tyre physics, card arc, quotes, and build prompts. Shadcn Card /
              Accordion used for this reference section.
            </p>
          </div>
        </div>

        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {techSpecs.map((item) => (
            <Card
              key={item.label}
              className="border-white/10 bg-white/[0.03] text-[#F5F1EB] shadow-none backdrop-blur-sm"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold tracking-wide" style={{ color: COLORS.accent }}>
                  {item.label}
                </CardTitle>
                <CardDescription className="text-xs leading-snug text-[#c4bcb0]">
                  {item.detail}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Card className="border-white/10 bg-white/[0.02] text-[#F5F1EB] shadow-none">
          <CardHeader>
            <CardTitle className="text-lg" style={{ color: COLORS.text }}>
              Smoothness phases — what happens on each click
            </CardTitle>
            <CardDescription className="text-[#9A9080]">
              Five phases from instant registration through idle micro-motion.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-relaxed text-[#d8d2c8]">
            <p>
              <strong className="text-[#F5F1EB]">Phase 1 — Click (0ms):</strong> Direction locked;
              tyre impulse +0.18 rad/frame; cards position delta queued; active card scale pulse 1.05 →
              1.02 over 80ms.
            </p>
            <p>
              <strong className="text-[#F5F1EB]">Phase 2 — Tyre spin (0–400ms):</strong>{" "}
              <code className="rounded bg-black/40 px-1 py-0.5 text-xs">vel *= 0.92</code> per RAF;
              staggered card motion from 60ms (0 / 40 / 80 / 120 / 160ms); spokes blur at peak
              velocity.
            </p>
            <p>
              <strong className="text-[#F5F1EB]">Phase 3 — Cards arc (60–500ms):</strong> Lerp to arc
              slots with translate, rotate, scale, opacity; outgoing fades and exits; incoming enters
              from far edge.
            </p>
            <p>
              <strong className="text-[#F5F1EB]">Phase 4 — Tyre settle (400–700ms):</strong> Spring
              overshoot wobble (−0.008 → +0.004 rad); quote crossfade ~300ms out / ~420ms in.
            </p>
            <p>
              <strong className="text-[#F5F1EB]">Phase 5 — Rest (700ms+):</strong> Idle rotation{" "}
              <code className="rounded bg-black/40 px-1 py-0.5 text-xs">+0.0004</code> rad/frame;
              center card “breathe” ~3s loop; counter slide animation.
            </p>
          </CardContent>
        </Card>

        <Separator className="my-10 bg-white/10" />

        <Accordion type="multiple" className="space-y-2">
          <AccordionItem value="spring" className="rounded-lg border border-white/10 bg-white/[0.02] px-2">
            <AccordionTrigger className="px-4 text-[#F5F1EB] hover:no-underline">
              Spring physics values
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="overflow-x-auto rounded-md border border-white/10">
                <table className="w-full min-w-[520px] text-left text-xs text-[#d8d2c8]">
                  <thead>
                    <tr className="border-b border-white/10 bg-black/30 text-[10px] uppercase tracking-wider text-[#9A9080]">
                      <th className="px-3 py-2 font-medium">Property</th>
                      <th className="px-3 py-2 font-medium">Description</th>
                      <th className="px-3 py-2 font-medium">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {springRows.map((row) => (
                      <tr key={row.property} className="border-b border-white/5 last:border-0">
                        <td className="px-3 py-2 font-mono text-[11px]" style={{ color: COLORS.accent }}>
                          {row.property}
                        </td>
                        <td className="px-3 py-2">{row.description}</td>
                        <td className="px-3 py-2 font-mono text-[11px] text-[#F5F1EB]">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="brand" className="rounded-lg border border-white/10 bg-white/[0.02] px-2">
            <AccordionTrigger className="px-4 text-[#F5F1EB] hover:no-underline">
              Brand, content & design system
            </AccordionTrigger>
            <AccordionContent className="space-y-3 px-4 pb-4 text-sm leading-relaxed text-[#d8d2c8]">
              <p>
                Brand: OCC — Off Campus Clubs. Tagline: &quot;Find your tribe.&quot; Six story cards
                (extendable), counter <span className="font-mono text-xs">01 / 06</span>.
              </p>
              <p>
                Background <span className="font-mono">#F0EDE8</span>, surface{" "}
                <span className="font-mono">#FAFAF7</span>, dark <span className="font-mono">#1A1410</span>
                , accent gold <span className="font-mono">#C8A96E</span>, muted{" "}
                <span className="font-mono">#8A7A6A</span>. Fonts: Playfair Display (headlines), DM
                Sans (body), DM Mono (counter, vertical-rl).
              </p>
              <p>
                Layout: full-width hero, 100vh, no scroll; tyre bottom-center cropped (top half
                visible); cards in fan arc above; title &quot;OCC / STORIES&quot; top-right.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="stories" className="rounded-lg border border-white/10 bg-white/[0.02] px-2">
            <AccordionTrigger className="px-4 text-[#F5F1EB] hover:no-underline">
              Stories data (JSON)
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <ScrollArea className="max-h-64 rounded-md border border-white/10 bg-black/40 p-3">
                <pre className="whitespace-pre-wrap font-mono text-[10px] leading-relaxed text-[#c8c2b8]">
                  {storiesJson}
                </pre>
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="tyre" className="rounded-lg border border-white/10 bg-white/[0.02] px-2">
            <AccordionTrigger className="px-4 text-[#F5F1EB] hover:no-underline">
              Tyre canvas — draw order & specs
            </AccordionTrigger>
            <AccordionContent className="space-y-2 px-4 pb-4 text-sm leading-relaxed text-[#d8d2c8]">
              <p>
                Canvas <span className="font-mono">700×700</span>; position{" "}
                <span className="font-mono">bottom: -340px; left: 50%; translateX(-50%)</span> — crop
                so ~top 360px visible.
              </p>
              <ul className="list-inside list-disc space-y-1 text-xs text-[#c4bcb0]">
                <li>Outer tyre: outerR 330px, innerR 265px, fill #1A1410; 72 tread bumps (4×7px).</li>
                <li>Rim rings: 278px / 268px with metallic gradients and stroke.</li>
                <li>24 spokes: hub+4px → inner rim−12px; gradient stroke; ghost spokes when vel &gt; 0.08.</li>
                <li>Hub, 6 bolts at 2× tyre speed, gold center cap 11px (#C8A96E).</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="cards" className="rounded-lg border border-white/10 bg-white/[0.02] px-2">
            <AccordionTrigger className="px-4 text-[#F5F1EB] hover:no-underline">
              Card arc, transitions & quote/counter
            </AccordionTrigger>
            <AccordionContent className="space-y-3 px-4 pb-4 text-sm leading-relaxed text-[#d8d2c8]">
              <p>
                Five slots: farLeft / left / center / right / farRight with listed x, y, rotate,
                scale, opacity. Card ~175px wide; Polaroid layout with gold accent rule, name, role.
              </p>
              <p>
                Staggered CSS transitions (cubic-bezier 0.23, 1, 0.32, 1); opacity easing with per-card
                delays; incoming from scale 0.5; outgoing with extra translate and scale down.
              </p>
              <p>
                Quote: fade out 220ms, wait 280ms, fade in 280ms. Counter: vertical DM Mono; slide old
                up, new in from below (~200ms).
              </p>
              <p>
                Drag on canvas: pointer delta drives velocity; release keeps momentum; swipe &gt; 40px
                advances index.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="perf" className="rounded-lg border border-white/10 bg-white/[0.02] px-2">
            <AccordionTrigger className="px-4 text-[#F5F1EB] hover:no-underline">
              Performance & file structure
            </AccordionTrigger>
            <AccordionContent className="space-y-3 px-4 pb-4 text-sm text-[#d8d2c8]">
              <p className="leading-relaxed">
                Target 60fps RAF; cancel on unmount; avoid useState in RAF; prefer direct style mutation
                during card motion; <code className="text-xs">will-change: transform</code> on cards;
                <code className="text-xs"> translateZ(0)</code> for GPU.
              </p>
              <ScrollArea className="max-h-40 rounded-md border border-white/10 bg-black/35 p-3">
                <pre className="whitespace-pre-wrap font-mono text-[10px] text-[#b8b0a4]">{fileStructure}</pre>
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="master" className="rounded-lg border border-white/10 bg-white/[0.02] px-2">
            <AccordionTrigger className="px-4 text-[#F5F1EB] hover:no-underline">
              Master AI prompt (full build brief)
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <ScrollArea className="h-[min(420px,55vh)] rounded-md border border-white/10 bg-black/45 p-4">
                <pre className="whitespace-pre-wrap font-mono text-[10px] leading-relaxed text-[#c8c2b8]">
                  {masterAiPromptIntro}
                  {"\n\n"}
                  {`═══════════════════════════════════════
BRAND & CONTENT — stories JSON, design tokens, tyre layers, spring loop, card arc math, quote/counter timings, drag, UI chrome, Next.js file tree, and performance rules are all specified in the sections above and in your design doc.

Implement exactly: canvas tyre with treads/spokes/hub, spring physics with idle + wobble, 5-slot card arc with staggered cubic-bezier transitions, quote crossfade sequence, vertical counter animation, pointer drag on tyre, and header/title/hint/arrows.

What to generate vs code: use AI for club photos & OCC logo assets; code the entire tyre, spokes, physics, cards, and animations in React + canvas.`}
                </pre>
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="cursor" className="rounded-lg border border-white/10 bg-white/[0.02] px-2">
            <AccordionTrigger className="px-4 text-[#F5F1EB] hover:no-underline">
              Cursor short agent prompt
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <ScrollArea className="max-h-80 rounded-md border border-white/10 bg-black/45 p-4">
                <pre className="whitespace-pre-wrap font-mono text-[10px] leading-relaxed text-[#c8c2b8]">
                  {cursorShortPrompt}
                </pre>
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="assets" className="rounded-lg border border-white/10 bg-white/[0.02] px-2">
            <AccordionTrigger className="px-4 text-[#F5F1EB] hover:no-underline">
              Generate vs pure code
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 text-sm leading-relaxed text-[#d8d2c8]">
              <p>
                <strong className="text-[#F5F1EB]">Generate (AI / assets):</strong> real club member
                photos, OCC logo SVG, optional grain texture, club event photography.
              </p>
              <p className="mt-2">
                <strong className="text-[#F5F1EB]">Pure code:</strong> full bicycle tyre on canvas, 24
                spokes + motion blur, card arc + transitions, spring + wobble, quote/counter
                animations, drag-to-spin.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
