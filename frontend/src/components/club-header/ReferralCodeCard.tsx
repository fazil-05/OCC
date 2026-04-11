"use client";

import { useState } from "react";
import { Copy, QrCode, Share2, ExternalLink } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";

export function ReferralCodeCard({ code: initialCode, clubName }: { code: string; clubName: string }) {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [code, setCode] = useState(initialCode);
  const [editCode, setEditCode] = useState(initialCode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/register?ref=${code}`;

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const shareLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const saveEdit = async () => {
    if (editCode === code) {
      setIsEditing(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/club-header/referral", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newCode: editCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to update code.");
      } else {
        setCode(data.referralCode);
        setIsEditing(false);
      }
    } catch {
      setError("An error occurred. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-[2rem] border border-white/[0.05] bg-white/[0.02] backdrop-blur-xl p-8 relative overflow-hidden"
    >
      <div className="absolute top-[-20%] left-[-10%] h-[200px] w-[200px] rounded-full bg-[#5227FF]/15 blur-[80px] pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#8C6DFD] font-semibold">
            Your Referral Code
          </p>
          <button 
            onClick={() => {
              if (isEditing) setEditCode(code);
              setIsEditing(!isEditing);
              setError("");
            }}
            className="text-xs font-semibold text-white/50 hover:text-white transition-colors uppercase tracking-widest"
          >
            {isEditing ? "Cancel" : "Edit Code"}
          </button>
        </div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring" as const, stiffness: 300, damping: 25 }}
          className={`rounded-2xl border ${isEditing ? "border-[#5227FF] bg-[#5227FF]/10" : "border-[#5227FF]/30 bg-gradient-to-br from-[#5227FF]/15 to-transparent"} px-6 py-8 text-center mb-2`}
        >
          {isEditing ? (
             <div className="flex flex-col items-center gap-4">
              <input 
                type="text" 
                value={editCode} 
                onChange={(e) => setEditCode(e.target.value.toUpperCase())}
                className="w-full bg-transparent text-center font-mono text-[clamp(24px,4vw,48px)] tracking-[0.2em] font-bold text-white focus:outline-none placeholder-white/20 uppercase"
                placeholder="CUSTOMCODE"
              />
              <button 
                onClick={saveEdit}
                disabled={loading || editCode.length < 3}
                className="bg-[#5227FF] text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-[#6842FF] transition-colors disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Custom Code"}
              </button>
            </div>
          ) : (
            <p className="font-mono text-[clamp(32px,6vw,72px)] tracking-[0.3em] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#5227FF] to-[#8C6DFD]">
              {code}
            </p>
          )}
        </motion.div>
        
        {error && <p className="text-red-400 text-sm mb-4 text-center font-semibold">{error}</p>}

        <p className="text-sm text-white/60 mb-6 mt-4">
          Share this code to invite students into <span className="text-white font-semibold">{clubName}</span>.
        </p>

        <div className="flex flex-wrap gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={copy}
            disabled={isEditing}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#5227FF] to-[#2B4BFF] px-5 py-3 text-sm font-semibold text-white shadow-[0_0_15px_rgba(82,39,255,0.4)] hover:shadow-[0_0_25px_rgba(82,39,255,0.6)] transition-shadow disabled:opacity-50"
          >
            <Copy className="h-4 w-4" />
            {copied ? "Copied ✓" : "Copy Code"}
          </motion.button>

          <button
            onClick={() => setShowQr((v) => !v)}
            disabled={isEditing}
            className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/5 px-5 py-3 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all disabled:opacity-50"
          >
            <QrCode className="h-4 w-4" />
            QR Code
          </button>

          <button
            onClick={shareLink}
            disabled={isEditing}
            className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/5 px-5 py-3 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all disabled:opacity-50"
          >
            <Share2 className="h-4 w-4" />
            Share Link
          </button>
        </div>

        {showQr && !isEditing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-6 flex flex-col items-center gap-3"
          >
            <div className="inline-block rounded-2xl bg-white p-4 shadow-[0_0_30px_rgba(82,39,255,0.2)]">
              <QRCodeSVG value={shareUrl} size={160} />
            </div>
            <div className="flex items-center gap-2 text-xs text-white/40">
              <ExternalLink className="h-3 w-3" />
              <span className="font-mono">{shareUrl.replace(/^https?:\/\//, "")}</span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
