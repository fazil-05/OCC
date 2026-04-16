"use client";

import * as React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/app/components/ui/utils";

export function AuthGlassCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <GlassCard
      className={cn(
        "w-full max-w-[34rem] rounded-[32px] border-white/8 bg-[linear-gradient(180deg,rgba(255,248,235,0.06),rgba(255,248,235,0.02))] p-6 md:p-8",
        className,
      )}
    >
      {children}
    </GlassCard>
  );
}
