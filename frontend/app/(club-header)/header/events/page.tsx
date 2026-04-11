"use client";

import { motion } from "framer-motion";
import { 
  CalendarDays, 
  MapPin, 
  IndianRupee, 
  Users, 
  Sparkles,
  Camera,
  Layout,
  Plus,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { useState } from "react";
import { createEvent } from "../../../actions/events";
import { toast } from "sonner";

const PRESET_BANNERS = [
  { name: "Fashion", url: "/events/fashion-event.png" },
  { name: "Tech / AI", url: "/events/tech-event.png" },
  { name: "Music / Concert", url: "/events/music-event.png" },
];

export default function HeaderEventsPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(PRESET_BANNERS[0].url);
  const [customBanner, setCustomBanner] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const formData = new FormData(e.currentTarget);
      formData.set("imageUrl", customBanner || selectedBanner);
      
      const res = await createEvent(formData);
      if (res.success) {
        setSuccess(true);
        (e.target as HTMLFormElement).reset();
        toast.success("Event posted successfully!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to post event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl pb-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#8C6DFD] font-black mb-2 flex items-center gap-2">
            <Layout className="h-3 w-3" />
            Event Studio
          </p>
          <h1 className="text-5xl font-black text-white tracking-tight leading-tight">
            Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5227FF] via-[#8C6DFD] to-[#B399FF]">Experience</span>
          </h1>
          <p className="mt-3 text-sm text-white/50 font-medium max-w-md">Design and launch your next high-impact campus event. Banner images update in real-time across all member dashboards.</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[2.5rem] border border-white/[0.08] bg-white/[0.03] backdrop-blur-3xl p-8 lg:p-10 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 h-64 w-64 bg-[#5227FF]/5 blur-[80px] pointer-events-none rounded-full" />
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/40 font-black ml-1">Event Title</label>
                <input
                  name="title"
                  type="text"
                  placeholder="e.g., Midnight Fashion Gala 2026"
                  required
                  className="w-full px-6 py-4 bg-white/[0.05] border border-white/[0.1] rounded-2xl text-white placeholder:text-white/20 focus:outline-none focus:border-[#5227FF]/50 focus:ring-4 focus:ring-[#5227FF]/10 transition-all font-bold"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/40 font-black ml-1">Date & Time</label>
                  <div className="relative">
                    <CalendarDays className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8C6DFD]" />
                    <input
                      name="date"
                      type="datetime-local"
                      required
                      className="w-full pl-14 pr-6 py-4 bg-white/[0.05] border border-white/[0.1] rounded-2xl text-white focus:outline-none focus:border-[#5227FF]/50 transition-all font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/40 font-black ml-1">Venue</label>
                  <div className="relative">
                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8C6DFD]" />
                    <input
                      name="venue"
                      type="text"
                      placeholder="Auditorium B"
                      required
                      className="w-full pl-14 pr-6 py-4 bg-white/[0.05] border border-white/[0.1] rounded-2xl text-white placeholder:text-white/20 focus:outline-none focus:border-[#5227FF]/50 transition-all font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/40 font-black ml-1">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Tell your members what to expect..."
                  required
                  className="w-full px-6 py-4 bg-white/[0.05] border border-white/[0.1] rounded-2xl text-white placeholder:text-white/20 focus:outline-none focus:border-[#5227FF]/50 transition-all font-bold resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/40 font-black ml-1">Entry Fee (₹)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8C6DFD]" />
                    <input
                      name="price"
                      type="number"
                      placeholder="0 (Free)"
                      className="w-full pl-14 pr-6 py-4 bg-white/[0.05] border border-white/[0.1] rounded-2xl text-white focus:outline-none focus:border-[#5227FF]/50 transition-all font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/40 font-black ml-1">Total Capacity</label>
                  <div className="relative">
                    <Users className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8C6DFD]" />
                    <input
                      name="maxCapacity"
                      type="number"
                      placeholder="Limitless"
                      className="w-full pl-14 pr-6 py-4 bg-white/[0.05] border border-white/[0.1] rounded-2xl text-white focus:outline-none focus:border-[#5227FF]/50 transition-all font-bold"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-gradient-to-r from-[#5227FF] to-[#8C6DFD] text-white font-black uppercase tracking-[0.2em] text-[13px] rounded-3xl hover:shadow-[0_8px_30px_rgb(82,39,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-8 shadow-2xl shadow-indigo-500/20"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : success ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <Plus className="h-5 w-5" />
                )}
                {loading ? "Launching Event..." : success ? "Event Launched!" : "Launch Real-Time Event"}
              </button>
            </form>
          </motion.div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <label className="text-[10px] uppercase tracking-[0.4em] text-[#8C6DFD] font-black ml-2 flex items-center gap-2">
              <Camera className="h-3.5 w-3.5" />
              Banner Experience
            </label>
            
            <div className="grid gap-3">
              {PRESET_BANNERS.map((banner) => (
                <button
                  key={banner.url}
                  onClick={() => {
                    setSelectedBanner(banner.url);
                    setCustomBanner("");
                  }}
                  className={`group relative overflow-hidden rounded-3xl border-2 transition-all p-1 h-32 ${
                    selectedBanner === banner.url && !customBanner
                      ? "border-[#5227FF] ring-4 ring-[#5227FF]/20"
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <img src={banner.url} alt={banner.name} className="h-full w-full object-cover rounded-2xl filter brightness-75 group-hover:brightness-100 transition-all duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">{banner.name}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-4 space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/40 font-black ml-1">Custom Image URL</label>
              <input
                type="url"
                value={customBanner}
                onChange={(e) => setCustomBanner(e.target.value)}
                placeholder="https://..."
                className="w-full px-5 py-3.5 bg-white/[0.05] border border-white/[0.1] rounded-2xl text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-[#5227FF]/50 transition-all font-bold"
              />
            </div>

            <div className="pt-8 rounded-[2rem] border border-dashed border-white/20 p-6 flex flex-col items-center justify-center text-center">
              <Sparkles className="h-8 w-8 text-white/20 mb-4" />
              <p className="text-[10px] font-bold text-white/40 uppercase leading-relaxed tracking-wider">
                Your events will reach <br />
                <span className="text-white/60">thousands of students</span> <br />
                in real-time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
