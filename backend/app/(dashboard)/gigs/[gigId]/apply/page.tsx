"use client";

import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

type MeApplication = {
  id: string;
  status: string;
  workDescription: string | null;
  submissionFileUrl: string | null;
} | null;

function hasDelivery(a: NonNullable<MeApplication>): boolean {
  const t = a.workDescription?.trim();
  const f = a.submissionFileUrl?.trim();
  return Boolean((t && t.length > 0) || f);
}

export default function GigApplyPage() {
  const router = useRouter();
  const params = useParams();
  const gigId = typeof params?.gigId === "string" ? params.gigId : "";

  const [loadingMe, setLoadingMe] = useState(true);
  const [application, setApplication] = useState<MeApplication>(null);

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [pitch, setPitch] = React.useState("");

  const [workDescription, setWorkDescription] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  useEffect(() => {
    if (!gigId) return;
    let cancelled = false;
    (async () => {
      setLoadingMe(true);
      try {
        const res = await fetch(`/api/gig-applications/me?gigId=${encodeURIComponent(gigId)}`, {
          credentials: "include",
        });
        const data = (await res.json()) as { application?: MeApplication };
        if (!cancelled) setApplication(data.application ?? null);
      } catch {
        if (!cancelled) setApplication(null);
      } finally {
        if (!cancelled) setLoadingMe(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [gigId]);

  const uploadOne = async (selectedFile: File): Promise<string> => {
    const form = new FormData();
    form.append("file", selectedFile);
    form.append("purpose", "gig_submission");
    const res = await fetch("/api/upload", {
      method: "POST",
      body: form,
    });
    const data = (await res.json().catch(() => null)) as
      | { url?: string; error?: string }
      | null;
    if (!res.ok || !data?.url) {
      throw new Error(data?.error || "File upload failed");
    }
    return data.url;
  };

  const onApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/gigs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gigId,
          applicantName: name.trim() || undefined,
          applicantEmail: email.trim() || undefined,
          applicantPhone: phone.trim() || undefined,
          message: pitch.trim() || undefined,
        }),
      });
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) {
        throw new Error(data?.error || "Could not submit application");
      }
      toast.success("Application sent.");
      router.push("/gigs");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit application");
    } finally {
      setLoading(false);
    }
  };

  const onDeliver = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const w = workDescription.trim();
    if (w.length < 10) {
      setError("Describe your work (at least 10 characters).");
      return;
    }
    setLoading(true);
    try {
      const fileUrl = file ? await uploadOne(file) : undefined;
      const res = await fetch("/api/gig-applications/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gigId,
          workDescription: w,
          submissionFileUrl: fileUrl,
          submissionFileName: file?.name,
          submissionFileMime: file?.type,
          submissionFileSize: file?.size,
        }),
      });
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) {
        throw new Error(data?.error || "Could not submit project");
      }
      toast.success("Project submitted.");
      router.push("/gigs");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit project");
    } finally {
      setLoading(false);
    }
  };

  if (!gigId) {
    return (
      <div className="mx-auto max-w-3xl pb-12 text-sm text-red-300">Invalid gig.</div>
    );
  }

  if (loadingMe) {
    return (
      <div className="mx-auto flex max-w-3xl items-center justify-center py-24 text-sm text-[#F5F0E8]/70">
        Loading…
      </div>
    );
  }

  const st = application?.status === "applied" ? "PENDING" : application?.status;
  const waiting = st === "PENDING";
  const rejected = st === "REJECTED";
  const approved = st === "APPROVED";
  const delivered = application && hasDelivery(application);

  if (waiting) {
    return (
      <div className="mx-auto w-full max-w-3xl space-y-6 pb-12">
        <p className="text-[11px] uppercase tracking-[0.45em] text-[#C9A96E]">Gig application</p>
        <h1 className="font-headline text-4xl text-[#F5F0E8]">Pending review</h1>
        <p className="text-sm text-[#F5F0E8]/70">
          The club header is reviewing your application. After approval, you&apos;ll return here (or use E-Clubs) to
          submit your project deliverables.
        </p>
        <a
          href="/gigs"
          className="inline-block rounded-xl border border-white/20 px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-white/80"
        >
          Back to gigs
        </a>
      </div>
    );
  }

  if (approved && delivered) {
    return (
      <div className="mx-auto w-full max-w-3xl space-y-6 pb-12">
        <p className="text-[11px] uppercase tracking-[0.45em] text-[#C9A96E]">Gig project</p>
        <h1 className="font-headline text-4xl text-[#F5F0E8]">Project submitted</h1>
        <p className="text-sm text-[#F5F0E8]/70">
          Your deliverables are with the club header. You can update them from E-Clubs if you need to replace a file.
        </p>
        <a
          href="/e-clubs"
          className="inline-block rounded-xl bg-[#5227FF] px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-white"
        >
          Open E-Clubs
        </a>
      </div>
    );
  }

  if (approved && !delivered) {
    return (
      <div className="mx-auto w-full max-w-3xl space-y-6 pb-12">
        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-[0.45em] text-[#C9A96E]">Gig project</p>
          <h1 className="font-headline text-5xl text-[#F5F0E8]">Submit your project</h1>
          <p className="text-sm text-[#F5F0E8]/70">
            You&apos;re approved. Describe your work and optionally attach a file for the club header.
          </p>
        </div>

        <form
          onSubmit={onDeliver}
          className="space-y-5 rounded-3xl border border-white/10 bg-white/[0.03] p-6"
        >
          <textarea
            placeholder="Work completion / deliverables (min 10 characters)"
            value={workDescription}
            onChange={(e) => setWorkDescription(e.target.value)}
            maxLength={5000}
            required
            minLength={10}
            rows={6}
            className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/40"
          />
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.2em] text-white/70">Supporting file (optional)</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white file:mr-3 file:rounded-lg file:border-0 file:bg-[#5227FF] file:px-3 file:py-2 file:text-xs file:font-bold file:text-white"
            />
            <p className="text-xs text-white/50">Allowed: PDF, DOC, DOCX, PPT, PPTX. Max 30MB.</p>
          </div>

          {error ? <p className="text-sm text-red-300">{error}</p> : null}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-emerald-600 px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-white disabled:opacity-50"
            >
              {loading ? "Submitting…" : "Submit project"}
            </button>
            <a
              href="/gigs"
              className="rounded-xl border border-white/20 px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-white/80"
            >
              Cancel
            </a>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 pb-12">
      <div className="space-y-2">
        <p className="text-[11px] uppercase tracking-[0.45em] text-[#C9A96E]">Gig application</p>
        <h1 className="font-headline text-5xl text-[#F5F0E8]">Apply to this gig</h1>
        <p className="text-sm text-[#F5F0E8]/70">
          {rejected
            ? "You can send a new application. After approval, you’ll submit your project in a second step."
            : "Step 1 of 2: your details and a short pitch only. Work samples and files come after the club approves you."}
        </p>
      </div>

      <form
        onSubmit={onApply}
        className="space-y-5 rounded-3xl border border-white/10 bg-white/[0.03] p-6"
      >
        <input
          type="text"
          placeholder="Your name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/40"
        />
        <input
          type="email"
          placeholder="Your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/40"
        />
        <input
          type="tel"
          placeholder="Your phone"
          required
          minLength={10}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/40"
        />
        <textarea
          placeholder="Short pitch for the club header (max 50 characters)"
          value={pitch}
          onChange={(e) => setPitch(e.target.value.slice(0, 50))}
          maxLength={50}
          rows={3}
          className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/40"
        />

        {error ? <p className="text-sm text-red-300">{error}</p> : null}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-[#5227FF] px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-white disabled:opacity-50"
          >
            {loading ? "Submitting…" : "Submit application"}
          </button>
          <a
            href="/gigs"
            className="rounded-xl border border-white/20 px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-white/80"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
