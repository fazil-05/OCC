import React, { useEffect, useRef, useState } from "react";

type QuoteDisplayProps = {
  quote: string;
  quoteTick: number;
};

/** Fade out 220ms → swap at 220ms → fade in 280ms starting at 500ms total. */
export function QuoteDisplay({ quote, quoteTick }: QuoteDisplayProps) {
  const [opacity, setOpacity] = useState(1);
  const [text, setText] = useState(quote);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      setText(quote);
      return;
    }
    setOpacity(0);
    const tSwap = window.setTimeout(() => setText(quote), 220);
    const tIn = window.setTimeout(() => setOpacity(1), 500);
    return () => {
      window.clearTimeout(tSwap);
      window.clearTimeout(tIn);
    };
  }, [quoteTick, quote]);

  return (
    <div
      className="pointer-events-none absolute left-8 top-14 z-10 max-w-[280px] md:left-24 md:top-20"
      style={{
        opacity,
        transition: `opacity ${opacity === 0 ? 220 : 280}ms cubic-bezier(0.23, 1, 0.32, 1)`,
      }}
    >
      <div className="mb-2.5 h-0.5 w-6" style={{ background: "#C8A96E" }} />
      <p
        className="font-[family-name:var(--font-playfair)] text-sm italic leading-relaxed"
        style={{ color: "#2A1F14" }}
      >
        “{text}”
      </p>
    </div>
  );
}
