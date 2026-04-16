"use client";

import * as React from "react";
import { cn } from "@/app/components/ui/utils";

export function GlassCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-white/10 bg-white/[0.04] shadow-[0_24px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
