"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { PartyPopper, X } from "lucide-react";

export function ClubWelcomeMessage({ clubName }: { clubName: string }) {
  const searchParams = useSearchParams();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (searchParams.get("welcome") === "true") {
      setShow(true);
      // Auto-hide after 6 seconds
      const timer = setTimeout(() => setShow(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative z-[100] flex items-center justify-between gap-4 rounded-2xl bg-[#5227FF] p-4 text-white shadow-lg shadow-[#5227FF]/20"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20">
              <PartyPopper size={20} />
            </div>
            <div>
              <p className="text-sm font-bold">Welcome to {clubName}!</p>
              <p className="text-xs text-white/80">Glad to have you here. Explore the feed, events, and gigs below.</p>
            </div>
          </div>
          <button
            onClick={() => setShow(false)}
            className="rounded-lg p-2 transition-colors hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
