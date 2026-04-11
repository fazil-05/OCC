import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#F6F7FA] px-6 py-20">
      <div className="mx-auto flex w-full max-w-xl flex-col items-center rounded-3xl border border-black/10 bg-white p-10 text-center shadow-[0_20px_60px_-30px_rgba(15,23,42,0.25)]">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#5227FF]">404</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900">Page not found</h1>
        <p className="mt-3 text-sm text-slate-500">
          This link is unavailable or may have moved.
        </p>
        <Link
          href="/dashboard"
          className="mt-7 rounded-2xl bg-[#5227FF] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_-12px_rgba(82,39,255,0.5)] transition hover:bg-[#401ED9]"
        >
          Go to dashboard
        </Link>
      </div>
    </main>
  );
}

