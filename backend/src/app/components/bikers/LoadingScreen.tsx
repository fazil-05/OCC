import React from "react";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  progress: number;
  loaded: boolean;
}

export function LoadingScreen({ progress, loaded }: Props) {
  return (
    <AnimatePresence>
      {!loaded ? (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
          style={{ background: "#080808" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1
            className="font-headline text-7xl tracking-[0.1em] md:text-[96px]"
            style={{ color: "#F5F1EB" }}
          >
            OCC
          </h1>

          <div className="mt-10 w-64">
            <div className="h-px w-full" style={{ background: "#222" }}>
              <motion.div
                className="h-full"
                style={{ background: "#C8A96E", width: `${progress * 100}%` }}
                transition={{ duration: 0.05 }}
              />
            </div>
            <p
              className="mt-3 text-center text-xs tracking-[0.3em]"
              style={{ color: "#9A9080" }}
            >
              {Math.round(progress * 100)}%
            </p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
