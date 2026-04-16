"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Crown, Sparkles } from "lucide-react";
import Link from "next/link";

type ClubOption = { slug: string; name: string; icon: string };

export default function ClubHeaderRegisterPage() {
  const router = useRouter();
  const [clubsList, setClubsList] = useState<ClubOption[]>([]);
  const [clubsLoading, setClubsLoading] = useState(true);
  const [clubsError, setClubsError] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    collegeName: "",
    clubSlug: "",
    experience: "",
    instagramHandle: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setClubsLoading(true);
      setClubsError("");
      try {
        const res = await fetch("/api/club-header/clubs", { cache: "no-store" });
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        const list: ClubOption[] = Array.isArray(data.clubs) ? data.clubs : [];
        setClubsList(list);
        if (list.length > 0) {
          setForm((prev) => ({
            ...prev,
            clubSlug: list.some((c) => c.slug === prev.clubSlug)
              ? prev.clubSlug
              : list[0].slug,
          }));
        }
        if (!res.ok && list.length === 0) {
          setClubsError("Could not load clubs. Refresh the page.");
        }
      } catch {
        if (!cancelled) setClubsError("Could not load clubs. Check your connection and refresh.");
      } finally {
        if (!cancelled) setClubsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.clubSlug || !clubsList.some((c) => c.slug === form.clubSlug)) {
      setError("Please select a valid club.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/club-header/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error ?? "Application failed. Please try again.");
        setLoading(false);
        return;
      }
      setDone(true);
      window.setTimeout(() => router.push("/pending"), 1500);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: "fullName", placeholder: "Full Name", type: "text" },
    { key: "email", placeholder: "Email Address", type: "email" },
    { key: "phoneNumber", placeholder: "Phone Number", type: "tel" },
    { key: "collegeName", placeholder: "College / University", type: "text" },
    { key: "instagramHandle", placeholder: "@instagram (optional)", type: "text" },
    { key: "password", placeholder: "Password", type: "password" },
    { key: "confirmPassword", placeholder: "Confirm Password", type: "password" },
  ];

  return (
    <div className="min-h-screen flex bg-[#070914]">
      {/* Left Side — Form */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-20 py-12 relative"
      >
        {/* Background blur */}
        <div className="absolute top-[-10%] left-[-10%] h-[300px] w-[300px] rounded-full bg-[#5227FF]/10 blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-xl mx-auto w-full">
          {/* Logo */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#5227FF] via-[#2B4BFF] to-[#8C6DFD] flex items-center justify-center text-white shadow-[0_0_20px_rgba(82,39,255,0.4)]">
                <span className="font-bold text-lg italic">O</span>
              </div>
              <span className="text-xl font-semibold text-white tracking-tight">OCC</span>
            </div>
            <p className="text-xs text-white/40 uppercase tracking-widest">Club Leader Application</p>
          </div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
              Become a <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5227FF] to-[#8C6DFD]">Leader</span>
            </h2>
            <p className="text-white/50">Apply to lead a campus club and build your community.</p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={onSubmit}
            className="space-y-4"
          >
            {fields.map((f, idx) => (
              <motion.div
                key={f.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + idx * 0.05 }}
              >
                <input
                  type={f.type}
                  placeholder={f.placeholder}
                  value={form[f.key as keyof typeof form]}
                  onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                  required={f.key !== "instagramHandle"}
                  className="w-full px-5 py-3.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-white placeholder:text-white/30 outline-none focus:border-[#5227FF]/50 focus:bg-white/[0.05] transition-all text-sm"
                />
              </motion.div>
            ))}

            {/* Club Selector — populated from DB (admin control panel) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <p className="text-xs text-white/40 uppercase tracking-widest mb-3">Select Your Club</p>
              {clubsError ? (
                <p className="mb-3 text-sm text-amber-400/90">{clubsError}</p>
              ) : null}
              {clubsLoading ? (
                <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-4 text-sm text-white/50">
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                  Loading clubs…
                </div>
              ) : clubsList.length === 0 ? (
                <p className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-4 text-sm text-white/45">
                  No clubs are available yet. Please try again later or contact support.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {clubsList.map((c) => (
                    <button
                      key={c.slug}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, clubSlug: c.slug }))}
                      className={`flex items-center gap-2 rounded-xl px-3 py-3 text-left text-sm font-medium transition-all sm:px-4 ${
                        form.clubSlug === c.slug
                          ? "bg-[#5227FF] text-white shadow-[0_0_15px_rgba(82,39,255,0.4)] border border-[#5227FF]"
                          : "bg-white/[0.03] text-white/50 border border-white/[0.06] hover:bg-white/[0.06] hover:text-white/80"
                      }`}
                    >
                      <span className="shrink-0 text-lg" aria-hidden>
                        {c.icon || "🏷"}
                      </span>
                      <span className="min-w-0 truncate">{c.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Experience */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
            >
              <textarea
                rows={4}
                value={form.experience}
                onChange={(e) => setForm((prev) => ({ ...prev, experience: e.target.value }))}
                placeholder="Tell us why you'd be a great club leader..."
                required
                className="w-full px-5 py-4 rounded-xl border border-white/[0.08] bg-white/[0.03] text-white placeholder:text-white/30 outline-none focus:border-[#5227FF]/50 focus:bg-white/[0.05] transition-all text-sm resize-none"
              />
            </motion.div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Success */}
            {done && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-xl bg-[#00E87A]/10 border border-[#00E87A]/20 text-[#00E87A] text-center font-semibold"
              >
                ✓ Application submitted! Redirecting to pending approval...
              </motion.div>
            )}

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading || done || clubsLoading || clubsList.length === 0}
              className="w-full py-4 bg-gradient-to-r from-[#5227FF] to-[#2B4BFF] text-white font-semibold rounded-xl shadow-[0_0_25px_rgba(82,39,255,0.4)] hover:shadow-[0_0_35px_rgba(82,39,255,0.6)] transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Crown className="w-5 h-5" />
                  Apply to Lead
                </>
              )}
            </motion.button>

            {/* Login link */}
            <p className="text-center text-white/40 text-sm pt-2">
              Already applied?{" "}
              <Link href="/club-header/login" className="text-[#8C6DFD] hover:text-[#5227FF] font-semibold transition-colors">
                Log in here
              </Link>
            </p>
          </motion.form>
        </div>
      </motion.div>

      {/* Right Side — Illustration */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0D20] via-[#12183A] to-[#070914]" />
        <div className="absolute top-[20%] right-[10%] h-[400px] w-[400px] rounded-full bg-[#5227FF]/20 blur-[120px]" />
        <div className="absolute bottom-[10%] left-[10%] h-[300px] w-[300px] rounded-full bg-[#8C6DFD]/15 blur-[100px]" />

        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.1, 0.6, 0.1],
                scale: [1, 1.8, 1],
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
            animate={{ y: [0, -15, 0], rotate: [0, 3, 0, -3, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="mx-auto mb-8 h-32 w-32 rounded-3xl bg-gradient-to-br from-[#5227FF]/30 to-[#8C6DFD]/10 border border-[#5227FF]/20 flex items-center justify-center shadow-[0_0_60px_rgba(82,39,255,0.3)]">
              <Crown className="h-16 w-16 text-[#8C6DFD]" />
            </div>
          </motion.div>

          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="h-4 w-4 text-[#5227FF]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-white/50">Lead a Community</span>
          </div>

          <h3 className="text-4xl font-bold text-white leading-tight mb-4">
            Build something<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5227FF] to-[#8C6DFD]">extraordinary</span>
          </h3>
          <p className="text-white/40 max-w-sm mx-auto">
            Lead a club, grow your network, create events, and make a lasting impact on campus.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
