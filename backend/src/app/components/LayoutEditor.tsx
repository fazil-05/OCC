"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { motion, useDragControls, useMotionValue } from "motion/react";

const STORAGE_PREFIX = "layout-editor-pos-";
const STORAGE_PREFIX_BLOCK = "layout-editor-block-";

export const LAYOUT_SECTION_IDS = [
  "header",
  "hero",
  "video-reel",
  "about-occ",
  "approach",
  "featured-work",
  "experiences",
  "showcase-cards",
] as const;

type LayoutEditorContextValue = {
  editorMode: boolean;
  setEditorMode: (v: boolean) => void;
  resetPositions: () => void;
};

const LayoutEditorContext = createContext<LayoutEditorContextValue | null>(
  null,
);

function loadPos(id: string): { x: number; y: number } {
  if (typeof localStorage === "undefined") return { x: 0, y: 0 };
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + id);
    if (raw) {
      const p = JSON.parse(raw) as { x?: number; y?: number };
      return {
        x: typeof p.x === "number" ? p.x : 0,
        y: typeof p.y === "number" ? p.y : 0,
      };
    }
  } catch {
    /* ignore */
  }
  return { x: 0, y: 0 };
}

function loadBlockPos(blockId: string): { x: number; y: number } {
  if (typeof localStorage === "undefined") return { x: 0, y: 0 };
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX_BLOCK + blockId);
    if (raw) {
      const p = JSON.parse(raw) as { x?: number; y?: number };
      return {
        x: typeof p.x === "number" ? p.x : 0,
        y: typeof p.y === "number" ? p.y : 0,
      };
    }
  } catch {
    /* ignore */
  }
  return { x: 0, y: 0 };
}

function clearAllLayoutStorage() {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (!k) continue;
    if (
      k.startsWith(STORAGE_PREFIX) ||
      k.startsWith(STORAGE_PREFIX_BLOCK)
    ) {
      keys.push(k);
    }
  }
  keys.forEach((k) => localStorage.removeItem(k));
}

export function LayoutEditorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [editorMode, setEditorMode] = React.useState(false);

  const resetPositions = useCallback(() => {
    clearAllLayoutStorage();
    window.dispatchEvent(new Event("layout-editor-reset"));
  }, []);

  const value = useMemo(
    () => ({ editorMode, setEditorMode, resetPositions }),
    [editorMode, resetPositions],
  );

  return (
    <LayoutEditorContext.Provider value={value}>
      {children}
    </LayoutEditorContext.Provider>
  );
}

function useLayoutEditorSafe(): LayoutEditorContextValue | null {
  return useContext(LayoutEditorContext);
}

export function MovableSection({
  id,
  children,
}: {
  id: (typeof LAYOUT_SECTION_IDS)[number];
  children: React.ReactNode;
}) {
  const ctx = useLayoutEditorSafe();
  const editorMode = ctx?.editorMode ?? false;
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const dragControls = useDragControls();

  const applyStored = useCallback(() => {
    const p = loadPos(id);
    x.set(p.x);
    y.set(p.y);
  }, [id, x, y]);

  useEffect(() => {
    if (!editorMode) return;
    applyStored();
  }, [editorMode, applyStored]);

  useEffect(() => {
    const onReset = () => {
      x.set(0);
      y.set(0);
    };
    window.addEventListener("layout-editor-reset", onReset);
    return () => window.removeEventListener("layout-editor-reset", onReset);
  }, [x, y]);

  if (!editorMode) {
    return <>{children}</>;
  }

  return (
    <motion.div
      className="relative z-10 rounded-lg ring-2 ring-violet-500/70 ring-offset-2 ring-offset-transparent"
      style={{ x, y, touchAction: "none" }}
      drag
      dragListener={false}
      dragControls={dragControls}
      dragMomentum={false}
      dragElastic={0}
      onDragEnd={() => {
        localStorage.setItem(
          STORAGE_PREFIX + id,
          JSON.stringify({ x: x.get(), y: y.get() }),
        );
      }}
      whileDrag={{
        zIndex: 100,
        boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
      }}
    >
      <div
        role="presentation"
        aria-hidden
        onPointerDown={(e) => dragControls.start(e)}
        className="absolute inset-0 z-[200] cursor-grab rounded-[inherit] bg-violet-500/10 active:cursor-grabbing"
      />
      <div className="pointer-events-none absolute left-2 top-2 z-[201] rounded bg-violet-600 px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide text-white">
        {id}
      </div>
      <div className="relative z-[1] min-w-0">{children}</div>
    </motion.div>
  );
}

/**
 * Freely draggable block inside a section when visual layout edit is on.
 * Uses a transparent drag layer so you can grab anywhere on the block.
 */
export function MovableBlock({
  id,
  className,
  children,
}: {
  id: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ctx = useLayoutEditorSafe();
  const editorMode = ctx?.editorMode ?? false;
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const dragControls = useDragControls();

  const applyStored = useCallback(() => {
    const p = loadBlockPos(id);
    x.set(p.x);
    y.set(p.y);
  }, [id, x, y]);

  useEffect(() => {
    if (!editorMode) return;
    applyStored();
  }, [editorMode, applyStored]);

  useEffect(() => {
    const onReset = () => {
      x.set(0);
      y.set(0);
    };
    window.addEventListener("layout-editor-reset", onReset);
    return () => window.removeEventListener("layout-editor-reset", onReset);
  }, [x, y]);

  if (!editorMode) {
    if (className) {
      return <div className={className}>{children}</div>;
    }
    return <>{children}</>;
  }

  return (
    <motion.div
      className={
        className
          ? `relative rounded-md ring-2 ring-amber-500/60 ring-offset-1 ring-offset-transparent ${className}`
          : "relative rounded-md ring-2 ring-amber-500/60 ring-offset-1 ring-offset-transparent"
      }
      style={{ x, y, touchAction: "none" }}
      drag
      dragListener={false}
      dragControls={dragControls}
      dragMomentum={false}
      dragElastic={0}
      onDragEnd={() => {
        localStorage.setItem(
          STORAGE_PREFIX_BLOCK + id,
          JSON.stringify({ x: x.get(), y: y.get() }),
        );
      }}
      whileDrag={{
        zIndex: 80,
        boxShadow: "0 20px 40px -12px rgb(0 0 0 / 0.2)",
      }}
    >
      <div
        role="presentation"
        aria-hidden
        onPointerDown={(e) => dragControls.start(e)}
        className="absolute inset-0 z-[200] cursor-grab rounded-[inherit] bg-amber-500/10 active:cursor-grabbing"
      />
      <div className="pointer-events-none absolute left-1 top-1 z-[201] max-w-[calc(100%-0.5rem)] truncate rounded bg-amber-600 px-1 py-0.5 font-mono text-[9px] font-medium uppercase tracking-wide text-white">
        {id}
      </div>
      <div className="relative z-[1] min-w-0">{children}</div>
    </motion.div>
  );
}
