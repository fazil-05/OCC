"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/app/components/ui/utils";

type PremiumButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  loadingLabel?: string;
};

export function PremiumButton({
  className,
  children,
  loading = false,
  loadingLabel,
  disabled,
  ...props
}: PremiumButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#5227FF] px-5 text-[13px] font-bold tracking-[0.2em] text-white transition duration-300 hover:bg-[#4318FF] hover:shadow-[0_8px_30px_rgba(82,39,255,0.25)] disabled:cursor-not-allowed disabled:opacity-60 shadow-lg shadow-[#5227FF]/10",
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      <span>{loading ? loadingLabel ?? children : children}</span>
    </button>
  );
}
