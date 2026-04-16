"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { PremiumInput } from "@/components/ui/PremiumInput";
import { loginSchema, type LoginInput } from "@/lib/validations";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: searchParams.get("email") ?? "",
      password: "",
    },
  });

  const redirectTarget = searchParams.get("redirect");

  async function onSubmit(values: LoginInput) {
    setServerError(null);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const data = (await response.json().catch(() => null)) as { error?: string } | null;

    if (!response.ok) {
      setServerError(data?.error ?? "Login failed.");
      return;
    }

    const storedRedirect =
      typeof window !== "undefined" ? window.localStorage.getItem("occ-redirect") : null;
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("occ-redirect");
    }

    router.push(redirectTarget || storedRedirect || "/dashboard");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <p className="text-[11px] uppercase tracking-[0.5em] text-[#C9A96E]">Welcome Back</p>
        <div className="leading-none">
          <h1 className="font-headline text-[52px] text-[#F5F0E8]">Sign</h1>
          <p className="font-accent text-[48px] text-[#C9A96E]">Back In.</p>
        </div>
      </div>

      <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease }}
        >
          <PremiumInput
            label="Email Address"
            icon={Mail}
            placeholder="your@email.com"
            error={form.formState.errors.email?.message}
            isValid={!!form.getFieldState("email").isDirty && !form.formState.errors.email}
            {...form.register("email")}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16, ease }}
          className="space-y-3"
        >
          <PremiumInput
            label="Password"
            icon={Lock}
            placeholder="••••••••••••••••"
            type={showPassword ? "text" : "password"}
            error={form.formState.errors.password?.message}
            rightSlot={
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="text-[#8A8478] transition hover:text-[#F5F0E8]"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
            {...form.register("password")}
          />
          <div className="flex justify-end">
            <button type="button" className="text-[13px] text-[#C9A96E] transition hover:underline">
              Forgot password?
            </button>
          </div>
        </motion.div>

        {serverError ? <p className="text-sm text-[#FF4D4D]">{serverError}</p> : null}

        <PremiumButton type="submit" loading={form.formState.isSubmitting} loadingLabel="SIGNING IN...">
          SIGN IN
        </PremiumButton>

        <div className="flex items-center gap-3 py-2 text-[11px] uppercase tracking-[0.35em] text-[#4A4840]">
          <span className="h-px flex-1 bg-white/8" />
          <span>Or continue with</span>
          <span className="h-px flex-1 bg-white/8" />
        </div>

        <button
          type="button"
          className="flex h-14 w-full items-center justify-center gap-3 rounded-md border border-white/12 text-sm text-white/65 opacity-75"
        >
          <span className="text-base">G</span>
          Google (coming soon)
        </button>

        <p className="text-sm text-[#8A8478]">
          New to OCC?{" "}
          <Link className="text-[#C9A96E] transition hover:underline" href="/register">
            Create account →
          </Link>
        </p>
      </form>
    </div>
  );
}
