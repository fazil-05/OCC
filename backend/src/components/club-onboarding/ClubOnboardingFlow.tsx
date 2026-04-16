"use client";

import { AnimatePresence, motion } from "motion/react";
import type { ClubOnboardingConfig } from "@/config/clubOnboardingQuestions";

type ClubOnboardingPhase = "questions" | "holding" | "revealing";

const optionSpring = { type: "spring" as const, stiffness: 420, damping: 28 };

function ScrollFramesWarmupBar({
  slug,
  assetsLoadProgress,
}: {
  slug: string;
  assetsLoadProgress: number;
}) {
  if (assetsLoadProgress >= 1) return null;
  const pct =
    assetsLoadProgress >= 1
      ? 100
      : Math.min(99, Math.max(0, Math.floor(assetsLoadProgress * 100)));
  return (
    <div className="mt-3 w-full max-w-sm">
      <div className="h-1 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full"
          style={{
            background:
              slug === "music"
                ? "linear-gradient(90deg, #7C3AED, #A78BFA)"
                : "linear-gradient(90deg, #C9A96E, #F4D88A)",
          }}
          initial={{ width: 0 }}
          animate={{
            width: `${Math.min(100, Math.max(0, assetsLoadProgress * 100))}%`,
          }}
          transition={{ duration: 0.2 }}
        />
      </div>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
        Experience · {pct}%
      </p>
    </div>
  );
}

export function ClubOnboardingFlow({
  config,
  activeIndex,
  activePrompt,
  answeredCount,
  selectedOption,
  isAdvancing,
  phase,
  onChooseOption,
  assetsLoadProgress = null,
}: {
  config: ClubOnboardingConfig;
  activeIndex: number;
  activePrompt: string;
  answeredCount: number;
  selectedOption: string | null;
  isAdvancing: boolean;
  phase: ClubOnboardingPhase;
  onChooseOption: (option: string) => void;
  /** 0–1 while frames preload (during questions + holding) */
  assetsLoadProgress?: number | null;
}) {
  const currentQuestion = config.questions[activeIndex] ?? config.questions[0];
  const showWarmup =
    assetsLoadProgress != null && assetsLoadProgress < 1;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={
        phase === "revealing"
          ? {
              opacity: 0,
              clipPath: "circle(0% at 50% 50%)",
              transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
            }
          : {
              opacity: 1,
              clipPath: "circle(140% at 50% 50%)",
            }
      }
      className="fixed inset-0 z-[320] overflow-hidden bg-[#070707]"
    >
      <div className="absolute inset-0">
        <motion.div
          aria-hidden
          className="absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-[#5227FF]/15 blur-[120px]"
          animate={{ x: [0, 24, 0], y: [0, -20, 0], opacity: [0.35, 0.5, 0.35] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
           aria-hidden
           className="absolute -right-16 bottom-12 h-80 w-80 rounded-full blur-[130px]"
           style={{ background: config.slug === "music" ? "#8B5CF6" : "#D4AF37", opacity: 0.12 }}
           animate={{ x: [0, -18, 0], y: [0, 22, 0], opacity: [0.15, 0.35, 0.15] }}
           transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
         />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_25%,rgba(255,255,255,0.01))]" />
      </div>

      <div className="relative flex min-h-screen flex-col px-5 pb-10 pt-8 sm:px-8 md:px-12">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4">
          <div className="flex min-w-0 items-start gap-4">
            <motion.div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#C9A96E] via-[#F4D88A] to-[#8C6DFD] p-[2.5px] shadow-[0_0_24px_rgba(201,169,110,0.25)]"
              animate={{ scale: phase === "questions" ? [1, 1.05, 1] : 1 }}
              transition={{ duration: 2.4, repeat: phase === "questions" ? Infinity : 0, ease: "easeInOut" }}
            >
              <span className="flex h-full w-full items-center justify-center rounded-full bg-[#0a0a0c] font-mono text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: config.slug === "music" ? "#8B5CF6" : "#E8DCC8" }}>
                 {config.clubIcon}
               </span>
            </motion.div>
            <div className="min-w-0">
               <p className="font-mono text-[11px] uppercase tracking-[0.38em]" style={{ color: config.slug === "music" ? "#8B5CF6" : "#C9A96E" }}>
                 OCC · {config.clubName}
               </p>
              <p className="mt-2 text-[11px] text-white/40">
                Quick vibe check — then your full club experience unlocks.
              </p>
            </div>
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/35">
            {Math.min(activeIndex + 1, 5)} / 5
          </p>
        </div>

        <div className="mx-auto mt-5 flex w-full max-w-5xl gap-2">
          {config.questions.map((question, index) => (
            <div
              key={question.key}
              className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/8"
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: config.slug === "music" ? "linear-gradient(90deg, #7C3AED, #A78BFA)" : "linear-gradient(90deg, #C9A96E, #F4D88A)" }}
                animate={{
                  width:
                    index < answeredCount
                      ? "100%"
                      : index === activeIndex && isAdvancing
                        ? "100%"
                        : "0%",
                  opacity: index < answeredCount || (index === activeIndex && isAdvancing) ? 1 : 0.5,
                }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          ))}
        </div>

        {phase === "questions" && showWarmup ? (
          <div className="mx-auto mt-2 flex w-full max-w-5xl">
            <ScrollFramesWarmupBar
              slug={config.slug}
              assetsLoadProgress={assetsLoadProgress}
            />
          </div>
        ) : null}

        <div className="mx-auto flex w-full max-w-5xl flex-1 items-center justify-center">
          <AnimatePresence mode="wait">
            {phase === "questions" ? (
              <motion.div
                key={currentQuestion.key}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-md overflow-y-auto overscroll-contain rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-5 shadow-[0_35px_120px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:max-w-lg sm:rounded-[1.75rem] sm:px-6 sm:py-6 max-h-[min(82dvh,640px)]"
                style={{ boxShadow: "0 25px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)" }}
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/35 sm:text-[11px]">
                  Step {activeIndex + 1}
                </p>
                <h1 className="mt-2 text-[clamp(1.15rem,4.2vw,1.65rem)] font-black uppercase leading-tight tracking-[0.02em] text-[#F7F4EF] sm:mt-3 sm:text-[clamp(1.2rem,3.2vw,1.85rem)]">
                  {activePrompt}
                </h1>
                <p className="mt-2 max-w-xl text-[12px] leading-snug text-white/45 sm:mt-3 sm:text-[13px]">
                  Pick the one that feels closest. We’ll tune the vibe around it.
                </p>

                <div className="mt-4 grid grid-cols-1 gap-2 sm:mt-5 sm:grid-cols-2 sm:gap-2.5">
                  {currentQuestion.options.map((option) => {
                    const isSelected = selectedOption === option;

                    return (
                      <motion.button
                        key={option}
                        type="button"
                        layout
                        onClick={() => onChooseOption(option)}
                        disabled={isAdvancing}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        transition={optionSpring}
                        className={`group rounded-xl border px-3 py-3 text-left transition-all sm:rounded-2xl sm:px-3.5 sm:py-3.5 ${
                          isSelected
                            ? config.slug === "music"
                              ? "border-[#8B5CF6]/80 bg-[#8B5CF6]/18 shadow-[0_0_30px_rgba(139,92,246,0.16)]"
                              : "border-[#D4AF37]/80 bg-[#D4AF37]/18 shadow-[0_0_30px_rgba(212,175,55,0.16)]"
                            : "border-white/10 bg-white/[0.03] hover:border-white/20"
                        }`}
                      >
                        <span className="block text-[13px] font-medium leading-snug text-[#F7F4EF] sm:text-[14px]">
                          {option}
                        </span>
                        <span className="mt-1 block text-[9px] uppercase tracking-[0.22em] text-white/28 sm:text-[10px]">
                          Tap to choose
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={phase}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="flex w-full max-w-xl flex-col items-center rounded-[2rem] border border-white/10 bg-white/[0.04] px-8 py-12 text-center shadow-[0_35px_120px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
              >
                <motion.div
                  className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border bg-white/[0.06] font-mono text-sm uppercase tracking-[0.25em]"
                  style={{ 
                    borderColor: config.slug === "music" ? "#8B5CF6" : "#D4AF37", 
                    color: config.slug === "music" ? "#8B5CF6" : "#F4D88A" 
                  }}
                  animate={{ scale: [1, 1.05, 1], rotate: [0, 6, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                >
                  {config.clubIcon}
                </motion.div>
                <h2 className="text-[clamp(2.1rem,4vw,3.4rem)] font-black uppercase leading-[0.92] text-[#F7F4EF]">
                  {phase === "holding" ? "Locking in your entrance" : "Welcome in"}
                </h2>
                <p className="mt-4 max-w-md text-[14px] leading-relaxed text-white/45 sm:text-[15px]">
                  {phase === "holding"
                    ? "Final touches are syncing behind the curtain. Your club experience is about to open."
                    : "Your club world is ready. Opening the full scroll experience now."}
                </p>
                {phase === "holding" && showWarmup && assetsLoadProgress != null ? (
                  <div className="mt-6 flex w-full justify-center">
                    <ScrollFramesWarmupBar
                      slug={config.slug}
                      assetsLoadProgress={assetsLoadProgress}
                    />
                  </div>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mx-auto w-full max-w-5xl text-center">
          <p className="text-[11px] tracking-[0.18em] text-white/28">
            {config.footerCopy}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
