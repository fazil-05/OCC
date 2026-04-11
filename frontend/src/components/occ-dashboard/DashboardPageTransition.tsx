"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

/** Subtle route cross-fade for dashboard main content — premium, not flashy. */
export function DashboardPageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduce ? undefined : { opacity: 0, y: -4 }}
        transition={{
          duration: reduce ? 0 : 0.2,
          ease: [0.25, 0.1, 0.25, 1],
        }}
        className="min-h-0"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
