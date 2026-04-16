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
  CheckCircle2,
  Calendar,
  Eye,
  Trash2,
  Upload,
  ImagePlus,
  X
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { createEvent } from "../../../actions/events";
import { toast } from "sonner";
import { format } from "date-fns";
import { EventRegistrantsModal } from "@/components/common/EventRegistrantsModal";



export default function HeaderEventsPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [events, setEvents] = useState<any[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [activeEvent, setActiveEvent] = useState<any>(null);
  const [showRegModal, setShowRegModal] = useState(false);

  const fetchEvents = async () => {
    setEventsLoading(true);
    try {
      const res = await fetch("/api/club-header/events");
      const data = await res.json();
      setEvents(data.events || []);
    } catch (err) {
      console.error(err);
    } finally {
      setEventsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("purpose", "events");
      
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      
      setImageUrl(data.url);
      toast.success("Image uploaded successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const formData = new FormData(e.currentTarget);
      formData.set("imageUrl", imageUrl);
      
      const res = await createEvent(formData);
      if (res.success) {
        setSuccess(true);
        setImageUrl("");
        (e.target as HTMLFormElement).reset();
        toast.success("Event posted successfully!");
        fetchEvents();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to post event");
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event? This action cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin-cp/events/${id}`, { method: "DELETE" }); // Reusing admin-cp delete as it's general purpose for staff
      if (res.ok) {
        toast.success("Event deleted");
        fetchEvents();
      }
    } catch {
      toast.error("Failed to delete event");
    }
  };

  return (
    <div className="space-y-12 max-w-6xl pb-24 font-sans">
      {/* HEADER */}
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

      <div className="max-w-4xl mx-auto">
        {/* CREATE FORM */}
        <div className="space-y-6">
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
                      className="w-full pl-14 pr-6 py-4 bg-white/[0.05] border border-white/[0.1] rounded-2xl text-white focus:outline-none focus:border-[#5227FF]/50 transition-all font-bold [color-scheme:dark]"
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

              {/* IMAGE UPLOAD SECTION */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/40 font-black ml-1">Event Visual / Banner</label>
                <div className="relative group">
                  {imageUrl ? (
                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 group">
                      <img src={imageUrl} alt="Preview" className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button 
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="h-10 w-10 flex items-center justify-center rounded-full bg-white text-black hover:scale-110 transition-transform"
                        >
                          <Upload className="h-4 w-4" />
                        </button>
                        <button 
                          type="button"
                          onClick={() => setImageUrl("")}
                          className="h-10 w-10 flex items-center justify-center rounded-full bg-red-500 text-white hover:scale-110 transition-transform"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="w-full aspect-video rounded-2xl border-2 border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center gap-3 hover:bg-white/[0.04] hover:border-[#5227FF]/30 transition-all"
                    >
                      {uploading ? (
                        <Loader2 className="h-8 w-8 text-[#5227FF] animate-spin" />
                      ) : (
                        <>
                          <div className="h-12 w-12 rounded-full bg-[#5227FF]/10 flex items-center justify-center">
                            <Upload className="h-5 w-5 text-[#5227FF]" />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-bold text-white">Upload Event Banner</p>
                            <p className="text-[10px] text-white/30 mt-1">Recommended: 1200x675px (Max 8MB)</p>
                          </div>
                        </>
                      )}
                    </button>
                  )}
                  
                  <div className="mt-3 relative">
                    <ImagePlus className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/20" />
                    <input 
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Or paste custom image URL here..."
                      className="w-full pl-11 pr-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-xl text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-[#5227FF]/50 transition-all font-bold"
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
      </div>

      <input 
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* MANAGED EVENTS SECTION */}
      <div className="pt-16 space-y-8">
         <div className="flex items-center justify-between">
            <div>
               <p className="text-[10px] uppercase tracking-[0.4em] text-[#8C6DFD] font-black mb-2 flex items-center gap-2">
                 <Calendar className="h-3.5 w-3.5" />
                 Active History
               </p>
               <h2 className="text-3xl font-black text-white tracking-tight">Managed <span className="text-white/40">Events</span></h2>
            </div>
            <div className="h-10 px-4 rounded-full bg-white/[0.03] border border-white/10 flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">
               <Users className="h-3 w-3" /> Total Registrations: {events.reduce((acc, e) => acc + (e._count.registrations || 0), 0)}
            </div>
         </div>

         {eventsLoading ? (
           <div className="py-20 flex flex-col items-center justify-center gap-4 bg-white/[0.02] border border-dashed border-white/10 rounded-[2.5rem]">
              <Loader2 className="h-10 w-10 text-[#5227FF] animate-spin" />
              <p className="text-sm font-bold text-white/20 uppercase tracking-widest">Sycing with server...</p>
           </div>
         ) : events.length > 0 ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((e) => (
                <motion.div key={e.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="group rounded-[2rem] bg-white/[0.03] border border-white/[0.08] overflow-hidden hover:border-[#5227FF]/30 transition-all flex flex-col">
                   <div className="relative aspect-video overflow-hidden">
                      <img src={e.imageUrl || "/events/default.png"} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute top-4 left-4 h-8 px-3 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-2 text-[10px] font-bold text-white">
                         <CalendarDays className="h-3 w-3 text-[#B399FF]" /> {format(new Date(e.date), "dd MMM")}
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                         <h4 className="font-bold text-white leading-tight line-clamp-1">{e.title}</h4>
                      </div>
                   </div>
                   <div className="p-5 flex-1 flex flex-col">
                      <div className="grid grid-cols-2 gap-2 mb-6">
                         <button 
                           onClick={() => { setActiveEvent(e); setShowRegModal(true); }}
                           className="h-10 rounded-xl bg-[#5227FF]/10 border border-[#5227FF]/20 text-[10px] font-black uppercase text-[#B399FF] flex items-center justify-center gap-2 hover:bg-[#5227FF]/20 transition-all"
                         >
                            <Eye className="h-3.5 w-3.5" /> View List
                         </button>
                         <button 
                           onClick={() => deleteEvent(e.id)}
                           className="h-10 rounded-xl bg-white/[0.02] border border-white/[0.05] text-[10px] font-black uppercase text-white/20 flex items-center justify-center gap-2 hover:bg-red-500/10 hover:text-red-400 hover:border-red-400/20 transition-all"
                         >
                            <Trash2 className="h-3.5 w-3.5" /> Cancel
                         </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between text-[11px] font-bold text-white/40 border-t border-white/[0.05] pt-4">
                         <span className="flex items-center gap-1.5"><Users className="h-3 w-3" /> {e._count.registrations} Joined</span>
                         {e.price > 0 && <span className="text-[#8C6DFD]">₹{e.price}</span>}
                      </div>
                   </div>
                </motion.div>
              ))}
           </div>
         ) : (
           <div className="py-20 flex flex-col items-center justify-center text-center bg-white/[0.02] border border-dashed border-white/10 rounded-[2.5rem]">
              <div className="h-16 w-16 rounded-full bg-white/[0.03] flex items-center justify-center mb-4">
                 <Calendar className="h-8 w-8 text-white/10" />
              </div>
              <p className="text-xl font-bold text-white/40 uppercase tracking-tight">No Events Hosted</p>
              <p className="text-sm text-white/20 mt-1 max-w-xs">Your club hasn't launched any experiences yet. Start by filling the form above.</p>
           </div>
         )}
      </div>

      {/* Registrants Modal Component */}
      <EventRegistrantsModal 
        isOpen={showRegModal}
        onClose={() => setShowRegModal(false)}
        event={activeEvent}
      />
    </div>
  );
}
