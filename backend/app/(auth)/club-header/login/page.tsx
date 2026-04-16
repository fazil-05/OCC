"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Crown, LogIn, Sparkles } from "lucide-react";
import Link from "next/link";

function ClubHeaderLoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reauth = searchParams.get("reauth") === "1";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [forgotOpen, setForgotOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [resetOtpVerified, setResetOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetHint, setResetHint] = useState("");
  const [resetError, setResetError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = (await res.json().catch(() => null)) as {
        error?: string;
        role?: string;
        approvalStatus?: string;
      } | null;

      if (!res.ok) {
        setError(data?.error ?? "Invalid credentials. Please try again.");
        return;
      }

      const role = data?.role;
      const approval = data?.approvalStatus;

      if (role !== "CLUB_HEADER") {
        setError("This login is for Club Leaders only. Students please use /login.");
        return;
      }

      if (approval === "PENDING") {
        router.push("/pending");
        return;
      }

      if (approval === "REJECTED") {
        setError("Your application was not approved. Please contact support.");
        return;
      }

      router.push("/header/dashboard");
      router.refresh();
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const sendResetOtp = async () => {
    setResetError("");
    setResetHint("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail.trim())) {
      setResetError("Enter a valid email.");
      return;
    }
    setSendingOtp(true);
    try {
      const res = await fetch("/api/auth/password-reset/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail.trim() }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setResetError(data?.error || "Could not send OTP.");
        return;
      }
      setResetOtpVerified(false);
      setResetHint("If this email is registered, OTP has been sent.");
    } catch {
      setResetError("Could not send OTP.");
    } finally {
      setSendingOtp(false);
    }
  };

  const verifyOtp = async () => {
    setResetError("");
    setResetHint("");
    if (!/^\d{6}$/.test(resetOtp)) {
      setResetError("Enter 6-digit OTP.");
      return;
    }
    setVerifyingOtp(true);
    try {
      const res = await fetch("/api/auth/password-reset/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail.trim(), otp: resetOtp }),
      });
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) {
        setResetOtpVerified(false);
        setResetError(data?.error || "OTP verification failed.");
        return;
      }
      setResetOtpVerified(true);
      setResetHint("OTP verified. Set your new password.");
    } catch {
      setResetOtpVerified(false);
      setResetError("OTP verification failed.");
    } finally {
      setVerifyingOtp(false);
    }
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError("");
    if (!resetOtpVerified) {
      setResetError("Verify OTP first.");
      return;
    }
    if (newPassword.length < 8) {
      setResetError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setResetError("Passwords do not match.");
      return;
    }
    setResetting(true);
    try {
      const res = await fetch("/api/auth/password-reset/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: resetEmail.trim(),
          otp: resetOtp,
          newPassword,
          confirmNewPassword,
        }),
      });
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) {
        setResetError(data?.error || "Reset failed.");
        return;
      }
      setForgotOpen(false);
      setResetHint("");
      setResetError("");
      setResetOtp("");
      setNewPassword("");
      setConfirmNewPassword("");
      setResetOtpVerified(false);
      toastSuccess();
    } catch {
      setResetError("Reset failed.");
    } finally {
      setResetting(false);
    }
  };

  const toastSuccess = () => {
    setError("");
  };

  return (
    <div className="min-h-screen flex bg-[#070914]">
      {/* Left Side — Form */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-20 py-12 relative"
      >
        <div className="absolute top-[-10%] left-[-10%] h-[300px] w-[300px] rounded-full bg-[#5227FF]/10 blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-xl mx-auto w-full">
          {/* Logo */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#5227FF] via-[#2B4BFF] to-[#8C6DFD] flex items-center justify-center text-white shadow-[0_0_20px_rgba(82,39,255,0.4)]">
                <Crown className="h-5 w-5" />
              </div>
              <span className="text-xl font-semibold text-white tracking-tight">OCC Leaders</span>
            </div>
            <p className="text-xs text-white/40 uppercase tracking-widest">Club Leader Login</p>
          </div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
              Welcome <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5227FF] to-[#8C6DFD]">back</span>
            </h2>
            <p className="text-white/50">Sign in to manage your club and community.</p>
          </motion.div>

          {reauth ? (
            <div className="mb-6 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-sm text-amber-200">
              Your session expired or became invalid. Please log in again.
            </div>
          ) : null}

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2 font-semibold">Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-5 py-4 rounded-xl border border-white/[0.08] bg-white/[0.03] text-white placeholder:text-white/30 outline-none focus:border-[#5227FF]/50 focus:bg-white/[0.05] transition-all text-sm"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2 font-semibold">Password</label>
              <input
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-5 py-4 rounded-xl border border-white/[0.08] bg-white/[0.03] text-white placeholder:text-white/30 outline-none focus:border-[#5227FF]/50 focus:bg-white/[0.05] transition-all text-sm"
              />
            </motion.div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-[#5227FF] to-[#2B4BFF] text-white font-semibold rounded-xl shadow-[0_0_25px_rgba(82,39,255,0.4)] hover:shadow-[0_0_35px_rgba(82,39,255,0.6)] transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </motion.button>

            {/* Links */}
            <div className="flex flex-col items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setForgotOpen((v) => !v)}
                className="text-sm text-[#8C6DFD] hover:text-[#5227FF] font-semibold transition-colors"
              >
                {forgotOpen ? "Back to login" : "Forgot password?"}
              </button>
              <p className="text-white/40 text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/club-header/register" className="text-[#8C6DFD] hover:text-[#5227FF] font-semibold transition-colors">
                  Apply here
                </Link>
              </p>
              <p className="text-white/30 text-xs">
                Student?{" "}
                <Link href="/login" className="text-white/50 hover:text-white transition-colors underline underline-offset-2">
                  Use student login
                </Link>
              </p>
            </div>
          </motion.form>

          {forgotOpen ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4"
            >
              <h3 className="mb-3 text-sm font-semibold text-white">Reset password</h3>
              <form onSubmit={resetPassword} className="space-y-3">
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => {
                    setResetEmail(e.target.value);
                    setResetOtpVerified(false);
                  }}
                  placeholder="Email"
                  className="w-full rounded-xl border border-white/[0.08] bg-black/30 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none"
                />
                <button type="button" onClick={sendResetOtp} disabled={sendingOtp} className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-2 text-sm text-white">
                  {sendingOtp ? "Sending..." : "Send 6-digit OTP"}
                </button>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={resetOtp}
                  onChange={(e) => {
                    setResetOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                    setResetOtpVerified(false);
                  }}
                  placeholder="OTP"
                  className="w-full rounded-xl border border-white/[0.08] bg-black/30 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none"
                />
                <button type="button" onClick={verifyOtp} disabled={verifyingOtp || !/^\d{6}$/.test(resetOtp)} className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-2 text-sm text-white disabled:opacity-50">
                  {verifyingOtp ? "Verifying..." : resetOtpVerified ? "OTP verified" : "Verify OTP"}
                </button>
                {resetOtpVerified ? (
                  <>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New password"
                      className="w-full rounded-xl border border-white/[0.08] bg-black/30 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none"
                    />
                    <input
                      type="password"
                      required
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Confirm password"
                      className="w-full rounded-xl border border-white/[0.08] bg-black/30 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none"
                    />
                  </>
                ) : null}
                {resetHint ? <p className="text-xs text-emerald-300">{resetHint}</p> : null}
                {resetError ? <p className="text-xs text-red-300">{resetError}</p> : null}
                <button type="submit" disabled={resetting || !resetOtpVerified} className="w-full rounded-xl bg-gradient-to-r from-[#5227FF] to-[#2B4BFF] py-2.5 text-sm font-semibold text-white disabled:opacity-50">
                  {resetting ? "Resetting..." : "Reset password"}
                </button>
              </form>
            </motion.div>
          ) : null}
        </div>
      </motion.div>

      {/* Right Side — Illustration */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0D20] via-[#12183A] to-[#070914]" />
        <div className="absolute top-[30%] right-[15%] h-[350px] w-[350px] rounded-full bg-[#5227FF]/20 blur-[120px]" />
        <div className="absolute bottom-[15%] left-[15%] h-[250px] w-[250px] rounded-full bg-[#8C6DFD]/15 blur-[100px]" />

        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.1, 0.5, 0.1],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Center content */}
        <div className="relative z-10 text-center px-12">
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="mx-auto mb-8 h-28 w-28 rounded-3xl bg-gradient-to-br from-[#5227FF]/30 to-[#8C6DFD]/10 border border-[#5227FF]/20 flex items-center justify-center shadow-[0_0_50px_rgba(82,39,255,0.3)]">
              <LogIn className="h-12 w-12 text-[#8C6DFD]" />
            </div>
          </motion.div>

          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="h-4 w-4 text-[#5227FF]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-white/50">Club Leaders Portal</span>
          </div>

          <h3 className="text-3xl font-bold text-white leading-tight mb-4">
            Your club is<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5227FF] to-[#8C6DFD]">waiting for you</span>
          </h3>
          <p className="text-white/40 max-w-sm mx-auto">
            Post events, track referrals, manage members, and grow your community.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function ClubHeaderLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#070914]" />}>
      <ClubHeaderLoginPageInner />
    </Suspense>
  );
}
