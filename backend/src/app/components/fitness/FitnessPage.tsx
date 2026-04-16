"use client";
import React from "react";
import { Link } from "@/lib/router-compat";
import { motion, AnimatePresence } from "motion/react";
import { useFitnessFrames } from "../../../hooks/useFitnessFrames";
import { FITNESS_TOTAL_FRAMES, FITNESS_FRAMES_PATH, FITNESS_FRAME_PREFIX, FC } from "./fitnessConstants";
import { FitnessScrollSection } from "./FitnessScrollSection";

interface FitnessPageProps {
  hideLoader?: boolean;
  userId?: string | null;
}

function LoadingHUD({ progress, loaded }: { progress: number; loaded: boolean }) {
  return (
    <AnimatePresence>
      {!loaded && (
        <motion.div 
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black"
          exit={{ opacity: 0, filter: "blur(20px)" }}
          transition={{ duration: 0.8 }}
        >
           <h2 className="text-sm font-black uppercase tracking-[0.5em] text-[#CCFF00] mb-8">Loading Peak Condition</h2>
           <div className="w-80 h-1 bg-white/5 relative overflow-hidden">
             <motion.div 
               className="absolute inset-y-0 left-0 bg-[#CCFF00]" 
               style={{ width: `${progress * 100}%` }}
               animate={{ boxShadow: ["0 0 10px #CCFF00", "0 0 20px #CCFF00", "0 0 10px #CCFF00"] }}
               transition={{ repeat: Infinity, duration: 2 }}
             />
           </div>
           <p className="mt-4 text-[10px] font-mono text-white/50 uppercase tracking-widest">{Math.round(progress * 100)}%</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function JoinFitness({ userId }: { userId?: string | null }) {
  return (
    <section className="relative z-20 overflow-hidden px-6 py-32 md:px-12 md:py-48 bg-[#0C0F0C]">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="mx-auto max-w-4xl text-center"
      >
        <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[#CCFF00] mb-8 block">Final Push</span>
        <h2 className="text-[clamp(3.5rem,12vw,9rem)] font-black uppercase leading-none tracking-tight italic" style={{ color: "white", fontFamily: "'Bebas Neue', sans-serif" }}>
          THE SILENT <span className="text-[#CCFF00]">CHASE.</span>
        </h2>
        <p className="mt-12 text-lg text-white/50 leading-relaxed max-w-2xl mx-auto">
          From high-performance morning runs to intensive sun-soaked training. Join the OCC Fitness elite.
        </p>

        <div className="mt-20">
          <Link
            to={userId ? "/clubs/fitness?welcome=true" : "/login"}
            className="inline-block px-14 py-5 bg-[#CCFF00] text-black font-black uppercase tracking-widest text-[12px] rounded-full hover:scale-105 transition-transform"
          >
            Launch Experience
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

export function FitnessPage({ 
  hideLoader = false, 
  userId 
}: FitnessPageProps) {
  const { frames, loaded, progress } = useFitnessFrames(FITNESS_FRAMES_PATH, FITNESS_TOTAL_FRAMES, FITNESS_FRAME_PREFIX);

  return (
    <div className="bg-black min-h-screen text-white">
      {!hideLoader && <LoadingHUD progress={progress} loaded={loaded} />}
      
      <header className="fixed top-0 inset-x-0 z-[50] flex items-center justify-between px-8 py-8 mix-blend-difference pointer-events-none">
        <Link to="/" className="pointer-events-auto text-[10px] font-bold uppercase tracking-[0.4em]">← Club Hub</Link>
        <span className="font-black text-xl italic uppercase tracking-tighter">OCC.</span>
      </header>

      <FitnessScrollSection frames={frames} loaded={loaded} />
      
      <section className="relative z-20 h-screen w-full flex items-center justify-center bg-[#080A08]">
        <div className="max-w-[76rem] w-full px-6 grid grid-cols-1 md:grid-cols-2 gap-24">
           <div>
              <p className="font-mono text-[11px] tracking-[0.5em] text-[#CCFF00] mb-6 block uppercase">Precision Training</p>
              <h2 className="text-6xl font-black uppercase italic leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>MASTER YOUR <br/> <span className="text-[#CCFF00]">MOMENTUM</span>.</h2>
           </div>
           <div>
              <p className="text-lg leading-relaxed text-white/60">
                The OCC Fitness Club is more than just a gym. It's a high-performance ecosystem designed to cultivate grit, endurance, and elite-level athleticism.
              </p>
           </div>
        </div>
      </section>

      <JoinFitness userId={userId} />
      
      <footer className="py-12 text-center border-t border-white/5 opacity-50">
        <p className="text-[10px] uppercase tracking-[0.4em]">© 2026 OCC Fitness Club Bangalore</p>
      </footer>
    </div>
  );
}
