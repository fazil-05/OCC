---
name: motion
description: >-
  Applies Motion (motion.dev) correctly for animations and scroll-driven UI.
  Detects React, Vue, or vanilla from the repo, uses accurate imports and APIs,
  and defers to Motion MCP or official docs for version-specific details. Use
  when the user mentions Motion, Framer Motion, scroll animation, springs,
  gestures, layout animation, or /motion.
---

# Motion API skill

## 1. Detect platform (do this first)

| Signal | Use |
|--------|-----|
| `react` + `motion` in package.json | **`import { motion, … } from "motion/react"`** |
| `vue` + motion | **`import { motion, … } from "motion/vue"`** |
| Vanilla / no framework | **Motion One** (`@motionone/dom` / `motion` vanilla APIs) |

**Never** invent paths like `framer-motion` unless the project still depends on that package name.

## 2. React (Motion v12+) — common imports

```tsx
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionValueEvent,
  animate,
  AnimatePresence,
} from "motion/react";
```

- Prefer **`motion/react`** (not deprecated hybrid imports).
- For reduced motion: respect `prefers-reduced-motion` (e.g. skip or simplify scroll ties).

## 3. Performance

- Prefer animating **`transform`** and **`opacity`**; they composite well.
- Use **independent transforms** (`x`, `y`, `scale`, `rotate` on `motion` elements) instead of a single `transform` string when you need to compose or spring each axis.
- Avoid animating **`width`/`height`** for layout-heavy UI; prefer `scale` or `layout` animations when appropriate.
- **`will-change`**: let Motion handle it; add manually only when profiling shows jank.
- Heavy scroll listeners: use **`useScroll`** + **`useTransform`** (runs off main thread via Motion where applicable) instead of manual `scroll` + `setState` every frame.

## 4. Scroll-driven patterns

- **`useScroll({ target: ref, offset: ["start end", "end start"] })`** → `scrollYProgress` (0–1).
- Map progress with **`useTransform(scrollYProgress, [0, 1], [from, to])`**.
- **SVG line draw**: `motion.path` with **`pathLength`** as a `MotionValue` from `useTransform`, or `strokeDasharray` + `strokeDashoffset` from measured `getTotalLength()`.

## 5. Springs

- Use **`useSpring(value, { stiffness, damping, mass })`** to smooth motion values (e.g. scroll-mapped values).
- Tune **`stiffness`** ↑ snappier, **`damping`** ↑ less overshoot.

## 6. Radix / Base UI

- Prefer **`asChild`** (Radix) or equivalent composition so **`motion`** wraps the primitive trigger without breaking behavior.
- Don’t duplicate interactive roles; keep **one** focusable control.
- For exit animations, pair **`AnimatePresence`** with **`mode="popLayout"`** or **`mode="wait"`** when layout must settle.

## 7. Docs and MCP

- For **exact** APIs, props, and renames, **search Motion’s official docs** or the **Motion MCP** (if enabled in the workspace)—do not guess import paths or removed props.

## 8. Quick checklist

- [ ] Import from the correct entry (`motion/react` vs `motion/vue`).
- [ ] Scroll effects use `useScroll` + `useTransform` (or `useSpring`) where possible.
- [ ] Prefer transform/opacity for motion; profile before `will-change`.
- [ ] Confirm Radix/Base UI composition doesn’t break accessibility.
