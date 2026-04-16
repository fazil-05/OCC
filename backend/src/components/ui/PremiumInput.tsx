"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/app/components/ui/utils";

type PremiumInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "prefix"> & {
  label: string;
  icon: LucideIcon;
  error?: string;
  isValid?: boolean;
  prefix?: string;
  rightSlot?: React.ReactNode;
  suggestions?: string[];
  onSuggestionSelect?: (value: string) => void;
  wrapperClassName?: string;
};

export const PremiumInput = React.forwardRef<HTMLInputElement, PremiumInputProps>(
  (
    {
      label,
      icon: Icon,
      error,
      isValid,
      prefix,
      rightSlot,
      suggestions,
      onSuggestionSelect,
      wrapperClassName,
      className,
      value,
      onFocus,
      onBlur,
      ...props
    },
    ref,
  ) => {
    const [focused, setFocused] = React.useState(false);
    const showSuggestions = focused && !!suggestions?.length;
    const hasValue = value !== undefined && String(value).length > 0;

    return (
      <div className={cn("space-y-2", wrapperClassName)}>
        <div>
          <label
            className={cn(
              "text-[10px] uppercase tracking-[0.4em] font-bold transition-colors",
              focused ? "text-[#5227FF]" : "text-slate-400",
            )}
          >
            {label}
          </label>

          <div
            className={cn(
              "relative mt-2 flex h-14 items-center rounded-2xl border bg-white/50 transition-all shadow-sm",
              prefix ? "pl-16" : "pl-12",
              rightSlot || isValid ? "pr-12" : "pr-4",
              error
                ? "border-red-500 shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
                : focused
                  ? "border-[#5227FF] bg-white shadow-[0_0_0_3px_rgba(82,39,255,0.06)]"
                  : isValid
                    ? "border-emerald-500"
                    : "border-slate-200",
            )}
          >
            <Icon
              className={cn(
                "pointer-events-none absolute left-4 h-5 w-5 transition-colors",
                focused ? "text-[#5227FF]" : "text-slate-400",
              )}
              strokeWidth={1.5}
            />

            {prefix ? (
              <span className="pointer-events-none absolute left-12 text-sm text-[#5227FF] font-bold">
                {prefix}
              </span>
            ) : null}

            <input
              ref={ref}
              className={cn(
                "h-full w-full bg-transparent text-[15px] text-slate-900 font-medium outline-none placeholder:text-slate-400",
                className,
              )}
              value={value}
              onFocus={(event) => {
                setFocused(true);
                onFocus?.(event);
              }}
              onBlur={(event) => {
                window.setTimeout(() => setFocused(false), 120);
                onBlur?.(event);
              }}
              {...props}
            />

            {rightSlot ? (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A8478]">{rightSlot}</div>
            ) : null}

            {!rightSlot && isValid ? (
              <Check className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#00E87A]" />
            ) : null}

            {!rightSlot && suggestions?.length ? (
              <ChevronDown className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A8478]" />
            ) : null}
          </div>

          {showSuggestions ? (
            <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 overflow-hidden rounded-xl border border-white/10 bg-[#141410]/95 shadow-2xl backdrop-blur-xl">
              {suggestions!.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  className={cn(
                    "flex w-full items-center px-4 py-3 text-left text-sm text-[#F5F0E8] transition hover:bg-white/5",
                    hasValue &&
                      String(value).toLowerCase() === suggestion.toLowerCase() &&
                      "bg-white/5",
                  )}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => onSuggestionSelect?.(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {error ? <p className="text-xs text-[#FF4D4D]">{error}</p> : null}
      </div>
    );
  },
);

PremiumInput.displayName = "PremiumInput";
