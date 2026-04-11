"use client";

import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MoreHorizontal,
  BadgeCheck,
  Zap,
  Trash2,
  Flag
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useMemo } from "react";
import { avatarSrc } from "@/lib/avatar";
import { premiumClubImageForName } from "@/lib/postImageUrl";
import { pusherClient } from "@/lib/pusher";

export type OCCPost = {
  id: string;
  username: string;
  userAvatarUrl: string;
  timestamp: string;
  caption: string;
  content?: string;
  imageUrl: string;
  imageUrls?: string[];
  likeCount: number;
  sharesCount?: number;
  clubId?: string;
  clubName?: string;
  clubMembersLabel?: string;
  commentsCount?: number;
};

function extractHashtags(text: string): string[] {
  if (!text) return [];
  const tags = text.match(/#[A-Za-z0-9_]+/g) || [];
  const uniq: string[] = [];
  for (const t of tags) {
    const normalized = t.replace(/^#/, "").toUpperCase();
    if (!normalized) continue;
    if (!uniq.includes(normalized)) uniq.push(normalized);
    if (uniq.length >= 8) break;
  }
  return uniq;
}

function stripHashtags(text: string): string {
  if (!text) return "";
  return text.replace(/#[A-Za-z0-9_]+/g, "").replace(/\s{2,}/g, " ").trim();
}

type PostComment = {
  id: string;
  content: string;
  createdAt: string | Date;
  user: {
    id?: string;
    fullName?: string;
    avatar?: string | null;
    email?: string | null;
    phoneNumber?: string | null;
  };
};

/** Instagram-style: always clamp to 5 lines until expanded (works at any viewport width). */
function PostCaptionBody({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const pRef = useRef<HTMLParagraphElement>(null);
  const [hasOverflow, setHasOverflow] = useState(false);
  const body = text.trim() ? text : "No description provided.";

  useEffect(() => {
    if (expanded) {
      setHasOverflow(false);
      return;
    }
    const el = pRef.current;
    if (!el) return;
    const measure = () => setHasOverflow(el.scrollHeight > el.clientHeight + 1);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [body, expanded]);

  const showToggle = hasOverflow || body.length > 200;

  return (
    <div>
      <p
        ref={pRef}
        className={`text-[13px] sm:text-[13.5px] font-normal leading-[1.5] text-black/60 font-sans whitespace-pre-wrap [overflow-wrap:anywhere] ${
          !expanded ? "line-clamp-5" : ""
        }`}
      >
        {body}
      </p>
      {showToggle ? (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="mt-1.5 block text-[13px] font-semibold text-black/45 transition-colors hover:text-black/70 active:opacity-70"
        >
          {expanded ? "Read less" : "Read more"}
        </button>
      ) : null}
    </div>
  );
}

export function OCCPostCard({
  post,
  currentUserId,
}: {
  post: OCCPost;
  currentUserId?: string;
}) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [saved, setSaved] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  
  const [isLoaded, setIsLoaded] = useState(false);
  /** True only if both the post URL and premium fallback failed to load. */
  const [imgError, setImgError] = useState(false);
  const mediaList = useMemo(() => {
    const list = (post.imageUrls || []).filter(Boolean);
    return list.length > 0 ? list : [post.imageUrl];
  }, [post.imageUrl, post.imageUrls]);
  const [activeImage, setActiveImage] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxTouchStartX, setLightboxTouchStartX] = useState<number | null>(null);
  const [mediaSrc, setMediaSrc] = useState(mediaList[0] || post.imageUrl);
  const imgRef = useRef<HTMLImageElement>(null);

  const premiumFallback = useMemo(
    () => premiumClubImageForName(post.clubName || ""),
    [post.clubName],
  );

  // Comments state
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount ?? 0);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const allTagText = `${post.caption || ""} ${post.content || ""}`;
  const parsedHashtags = useMemo(() => extractHashtags(allTagText), [allTagText]);
  const cleanBody = useMemo(() => stripHashtags(post.content || ""), [post.content]);
  const headingText = (post.caption || "").trim() || (cleanBody ? cleanBody.split(".")[0] + "." : "Editorial Statement.");

  useEffect(() => {
    setLikeCount(post.likeCount);
  }, [post.id, post.likeCount]);

  useEffect(() => {
    setActiveImage(0);
    setMediaSrc(mediaList[0] || post.imageUrl);
    setImgError(false);
    setIsLoaded(false);
  }, [post.id, post.imageUrl, mediaList]);

  useEffect(() => {
    setCommentsCount(post.commentsCount ?? 0);
    setComments([]);
    setIsCommentsOpen(false);
  }, [post.id, post.commentsCount]);

  // REALTIME - Listening for likes and comments
  useEffect(() => {
    if (!pusherClient || !post.clubId) return;

    const channel = pusherClient.subscribe(`club-${post.clubId}`);
    if (channel) {
      channel.bind("new-like", (data: { postId: string; likesCount: number }) => {
        if (data.postId === post.id) setLikeCount(data.likesCount);
      });

      channel.bind("new-comment", (data: { postId: string; comment: PostComment; commentsCount?: number }) => {
        if (data.postId === post.id) {
          setComments((prev) => {
            if (prev.some((c) => c.id === data.comment.id)) return prev;
            return [...prev, data.comment];
          });
          setCommentsCount((prev) =>
            typeof data.commentsCount === "number" ? data.commentsCount : prev + 1,
          );
        }
      });

      channel.bind("comment-deleted", (data: { postId: string; commentId: string; commentsCount?: number }) => {
        if (data.postId === post.id) {
          setComments((prev) => prev.filter((c) => c.id !== data.commentId));
          setCommentsCount((prev) =>
            typeof data.commentsCount === "number" ? data.commentsCount : Math.max(0, prev - 1),
          );
        }
      });
    }

    return () => {
      pusherClient?.unsubscribe(`club-${post.clubId}`);
    };
  }, [post.id, post.clubId]);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const handleImageError = () => {
    if (mediaSrc !== premiumFallback) {
      setMediaSrc(premiumFallback);
      setIsLoaded(false);
      setImgError(false);
      return;
    }
    setIsLoaded(true);
    setImgError(true);
  };

  const prevImage = () => {
    if (mediaList.length <= 1) return;
    setActiveImage((prev) => {
      const nextIdx = prev === 0 ? mediaList.length - 1 : prev - 1;
      setMediaSrc(mediaList[nextIdx] || post.imageUrl);
      setImgError(false);
      setIsLoaded(false);
      return nextIdx;
    });
  };

  const nextImage = () => {
    if (mediaList.length <= 1) return;
    setActiveImage((prev) => {
      const nextIdx = (prev + 1) % mediaList.length;
      setMediaSrc(mediaList[nextIdx] || post.imageUrl);
      setImgError(false);
      setIsLoaded(false);
      return nextIdx;
    });
  };

  const openLightbox = () => setIsLightboxOpen(true);
  const closeLightbox = () => setIsLightboxOpen(false);

  const toggleLike = async () => {
    const prevLiked = liked;
    const prevCount = likeCount;
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);

    try {
      const res = await fetch(`/api/posts/${post.id}/like`, { method: "POST" });
      const data = await res.json();
      if (data.likesCount !== undefined) setLikeCount(data.likesCount);
    } catch (e) {
      setLiked(prevLiked);
      setLikeCount(prevCount);
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/p/${post.id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareCopied(true);
      window.setTimeout(() => setShareCopied(false), 1800);
    } catch (e) {
      // Fallback for browsers/contexts where clipboard API is blocked.
      window.open(shareUrl, "_blank", "noopener,noreferrer");
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/posts/${post.id}/comment`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setComments(data);
        setCommentsCount(data.length);
      }
    } catch (e) {
      console.error("Failed to fetch comments");
    }
  };

  useEffect(() => {
    if (isCommentsOpen) fetchComments();
  }, [isCommentsOpen]);

  const handleAddComment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!commentText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${post.id}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: commentText.trim() })
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.comment) {
          setComments((prev) => (prev.some((c) => c.id === data.comment.id) ? prev : [...prev, data.comment]));
        }
        if (typeof data?.commentsCount === "number") {
          setCommentsCount(data.commentsCount);
        } else {
          setCommentsCount((prev) => prev + 1);
        }
        setCommentText("");
        if (!isCommentsOpen) setIsCommentsOpen(true);
      }
    } catch (e) {
      console.error("Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Remove this intellectual block? This action is permanent and logged for Admin review.")) return;
    try {
      const res = await fetch(`/api/comments/${commentId}`, { method: "DELETE" });
      if (res.ok) {
        setComments(prev => prev.filter(c => c.id !== commentId));
        setCommentsCount((prev) => Math.max(0, prev - 1));
      }
    } catch (e) {}
  };

  const handleReportComment = async (commentId: string) => {
    const reason = prompt("Enter the reason for flag (Harassment, Profanity, Spam):");
    if (!reason) return;
    try {
      await fetch(`/api/comments/${commentId}/report`, {
        method: "POST",
        body: JSON.stringify({ reason })
      });
      alert("Comment flagged. Our Elite Safety team will review the intel shortly.");
    } catch (e) {}
  };

  return (
    <motion.article 
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative overflow-hidden rounded-[1.35rem] sm:rounded-[1.75rem] border border-black/[0.08] bg-white shadow-[0_16px_34px_-18px_rgba(15,23,42,0.32),0_4px_10px_-6px_rgba(15,23,42,0.18)] sm:shadow-[0_26px_60px_-28px_rgba(15,23,42,0.36),0_8px_20px_-12px_rgba(15,23,42,0.2)] mb-3 sm:mb-6 max-w-full lg:max-w-[min(100%,920px)] mx-auto w-full transition-all duration-500"
    >
      {/* Mobile: stacked · Desktop (lg+): image | text — not driven by photo aspect ratio */}
      <div className="flex flex-col lg:flex-row lg:items-stretch transition-all duration-500">
        
        {/* MEDIA SEGMENT */}
        <div className="relative min-h-[200px] flex-1 min-w-0 bg-[#121212] flex items-center justify-center overflow-hidden transition-all duration-500 max-h-[300px] sm:max-h-[380px] lg:max-h-none lg:min-h-[min(520px,72vh)] lg:max-w-[min(100%,480px)]">
          {!imgError && (
            <div 
              className="absolute inset-0 opacity-25 blur-[60px] scale-150 pointer-events-none transition-opacity duration-1000"
              style={{ 
                backgroundImage: `url(${mediaSrc})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: isLoaded ? 0.15 : 0
              }}
            />
          )}
          
          {imgError ? (
            <div
              className="relative z-10 flex h-[180px] sm:h-[220px] w-full items-center justify-center bg-gradient-to-br from-[#5227FF]/20 via-[#121212] to-[#D4AF37]/20"
              onDoubleClick={toggleLike}
            >
              <span className="text-[11px] sm:text-[13px] font-medium uppercase tracking-[0.2em] text-white/20">
                {post.clubName || "OCC"}
              </span>
            </div>
          ) : (
            <motion.img 
              ref={imgRef}
              src={mediaSrc} 
              alt="" 
              onClick={openLightbox}
              onTouchStart={(e) => setTouchStartX(e.touches[0]?.clientX ?? null)}
              onTouchEnd={(e) => {
                if (touchStartX === null) return;
                const endX = e.changedTouches[0]?.clientX ?? touchStartX;
                const delta = endX - touchStartX;
                if (Math.abs(delta) > 36) {
                  if (delta < 0) nextImage();
                  else prevImage();
                }
                setTouchStartX(null);
              }}
              onLoad={handleImageLoad}
              onError={handleImageError}
              className="relative z-10 h-full w-full object-cover transition-all duration-700 ease-out max-h-[300px] sm:max-h-[380px] lg:max-h-none lg:min-h-[min(520px,72vh)] lg:max-h-[min(640px,75vh)]"
              onDoubleClick={toggleLike}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openLightbox();
                }
              }}
            />
          )}

          {mediaList.length > 1 ? (
            <>
              <button
                type="button"
                onClick={prevImage}
                className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 px-2 py-1 text-xs font-bold text-white"
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={nextImage}
                className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 px-2 py-1 text-xs font-bold text-white"
                aria-label="Next image"
              >
                ›
              </button>
              <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/45 px-2 py-1">
                {mediaList.map((_, idx) => (
                  <button
                    key={`${post.id}-img-${idx}`}
                    type="button"
                    onClick={() => {
                      setActiveImage(idx);
                      setMediaSrc(mediaList[idx] || post.imageUrl);
                      setImgError(false);
                      setIsLoaded(false);
                    }}
                    className={`h-1.5 w-1.5 rounded-full ${idx === activeImage ? "bg-white" : "bg-white/45"}`}
                    aria-label={`Open image ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          ) : null}

          <AnimatePresence>
            {liked && (
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1.1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
              >
                <Heart className="h-16 w-16 text-white/50 fill-white/50 drop-shadow-2xl" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* INTELLECTUAL SEGMENT - TEXT & COMMENTS */}
        <div className="flex w-full flex-col bg-white p-4 sm:p-5 lg:p-6 transition-all duration-500 lg:w-[min(100%,340px)] xl:w-[360px] lg:shrink-0 lg:border-l lg:border-black/[0.04]">
          
          {/* Identity Header */}
          <div className="flex items-center justify-between mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-black/[0.06]">
            <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
              <div className="h-8 w-8 sm:h-9 sm:w-9 overflow-hidden rounded-full ring-1 ring-black/[0.06]">
                <img src={post.userAvatarUrl} className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="truncate text-[13px] font-semibold text-black tracking-tight font-sans">{post.username}</span>
                  <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-[#5227FF]" fill="#5227FF" />
                </div>
                <span className="text-[9px] font-medium text-black/35 uppercase tracking-[0.08em] font-sans">
                  {post.clubMembersLabel || "800 Members"} · {post.clubName || "OCC"}
                </span>
              </div>
            </div>
            <button type="button" className="shrink-0 rounded-lg p-1.5 text-black/25 transition hover:bg-black/[0.04] hover:text-black/40">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>

          {/* Animated Transition between Caption and Comments */}
          <div className="flex-1 space-y-3 sm:space-y-4 overflow-y-auto scrollbar-hide max-h-[260px] sm:max-h-[340px]">
             <AnimatePresence mode="wait">
              {!isCommentsOpen ? (
                <motion.div 
                  key="caption"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-2.5 sm:space-y-3"
                >
                  <h4 className="font-serif italic text-[1.15rem] sm:text-[1.25rem] text-black/90 leading-snug tracking-normal text-balance line-clamp-2">
                    {headingText}
                  </h4>
                  <PostCaptionBody text={cleanBody || "No description provided."} />
                  {parsedHashtags.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {parsedHashtags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-black/[0.06] bg-black/[0.02] px-2 py-0.5 text-[8px] font-medium uppercase tracking-wider text-black/35 font-sans"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </motion.div>
              ) : (
                <motion.div 
                  key="comments"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-5 sm:space-y-6"
                >
                  <div className="flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md py-2 z-10">
                    <h5 className="text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.2em] text-black/30">Community Intel • {commentsCount}</h5>
                    <button onClick={() => setIsCommentsOpen(false)} className="text-[9px] sm:text-[10px] font-medium text-[#5227FF] uppercase tracking-widest hover:underline p-1">Close x</button>
                  </div>
                  
                  {comments.length === 0 ? (
                    <div className="py-12 sm:py-20 text-center">
                      <p className="text-[12px] sm:text-[13px] font-medium text-black/10">No perspectives shared yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-5 sm:space-y-6">
                      {comments.map((comment) => (
                        <div key={comment.id} className="group/comment">
                          <div className="flex gap-3 sm:gap-4">
                            <img src={avatarSrc(comment.user.avatar)} alt="" className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover shrink-0 ring-1 ring-black/5" />
                            <div className="flex-1 flex flex-col gap-1 sm:gap-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] sm:text-[12px] font-semibold text-black">{comment.user.fullName}</span>
                                <div className="flex items-center gap-1 opacity-0 group-hover/comment:opacity-100 transition-all">
                                  {currentUserId && comment.user?.id === currentUserId ? (
                                    <button onClick={() => handleDeleteComment(comment.id)} className="p-1 px-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  ) : null}
                                  <button onClick={() => handleReportComment(comment.id)} className="p-1 px-1.5 rounded-lg text-black/20 hover:text-black hover:bg-black/5 transition-colors">
                                    <Flag className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                              
                              {(comment.user.email || comment.user.phoneNumber) && (
                                <div className="bg-[#5227FF]/[0.03] p-2.5 sm:p-3 rounded-xl border border-[#5227FF]/10 shadow-sm animate-in fade-in zoom-in-95 duration-500">
                                  <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
                                    <Zap className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-[#5227FF]" fill="currentColor" />
                                    <span className="text-[8px] sm:text-[9px] font-semibold uppercase tracking-[0.2em] text-[#5227FF]">Moderator Intel</span>
                                  </div>
                                  {comment.user.email && <div className="text-[10px] sm:text-[11px] font-medium text-black/80">{comment.user.email}</div>}
                                  {comment.user.phoneNumber && <div className="text-[10px] sm:text-[11px] font-medium text-black/40 mt-0.5">{comment.user.phoneNumber}</div>}
                                </div>
                              )}

                              <p className="text-[12.5px] sm:text-[13.5px] font-medium leading-relaxed text-black/60 font-sans">
                                {comment.content}
                              </p>
                              <span className="text-[9px] sm:text-[10px] font-medium text-black/20 uppercase tracking-tighter">
                                {new Date(comment.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
             </AnimatePresence>
          </div>

          {/* Interaction Hub */}
          <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-black/[0.06]">
            <div className="mb-4 flex items-center justify-between sm:mb-4">
              <div className="flex items-center gap-3 sm:gap-5">
                <button type="button" onClick={toggleLike} className="group flex items-center gap-1.5">
                  <Heart className={`h-[22px] w-[22px] sm:h-6 sm:w-6 transition-all ${liked ? "text-[#FF3040] fill-[#FF3040]" : "text-black/25 group-hover:text-[#FF3040]"}`} strokeWidth={2.2} />
                  <span className="text-[12px] font-semibold text-black/75 font-sans tabular-nums">
                    {likeCount.toLocaleString("en-IN")}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsCommentsOpen(!isCommentsOpen)}
                  className={`group flex items-center gap-1.5 transition-transform ${isCommentsOpen ? "scale-[1.03]" : ""}`}
                >
                  <MessageCircle className={`h-[22px] w-[22px] sm:h-6 sm:w-6 transition-all ${isCommentsOpen ? "text-[#5227FF] fill-[#5227FF]/10" : "text-black/25 group-hover:text-[#5227FF]"}`} strokeWidth={2.2} />
                  <span className="text-[12px] font-semibold text-black/75 font-sans">{commentsCount}</span>
                </button>
              </div>
              <div className="flex items-center gap-1">
                <button type="button" onClick={handleShare} className="flex items-center gap-1.5 rounded-xl border border-black/[0.06] bg-black/[0.02] p-2 text-black/25 transition hover:text-black/60">
                  <Share2 className="h-4 w-4" />
                  {shareCopied ? <span className="text-[10px] font-semibold">Copied</span> : null}
                </button>
                <button type="button" onClick={() => setSaved(!saved)} className="rounded-xl border border-black/[0.06] bg-black/[0.02] p-2 text-black/25 transition hover:text-black/50">
                  <Bookmark className={`h-4 w-4 ${saved ? "text-black fill-black" : ""}`} />
                </button>
              </div>
            </div>

            <form onSubmit={handleAddComment} className="group/input relative">
              <input 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                type="text" 
                placeholder={isSubmitting ? "Sending…" : "Add a comment…"}
                disabled={isSubmitting}
                className="h-11 w-full rounded-2xl border border-transparent bg-black/[0.04] px-4 pr-[4.5rem] text-[13px] font-normal text-black outline-none transition placeholder:text-black/30 focus:border-[#5227FF]/25 focus:bg-white sm:h-12"
              />
              <button 
                type="submit"
                disabled={!commentText.trim() || isSubmitting}
                className="absolute right-1.5 top-1/2 h-8 -translate-y-1/2 rounded-xl bg-[#5227FF] px-4 text-[10px] font-semibold uppercase tracking-wide !text-white opacity-0 transition group-focus-within:opacity-100 disabled:opacity-0"
              >
                Post
              </button>
            </form>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isLightboxOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[220] flex items-center justify-center bg-black/95 p-3 sm:p-6"
            onClick={closeLightbox}
          >
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute right-4 top-4 z-[230] rounded-full bg-black/50 px-3 py-1.5 text-sm font-semibold text-white hover:bg-black/70"
              aria-label="Close full image"
            >
              Close
            </button>

            {mediaList.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 top-1/2 z-[230] -translate-y-1/2 rounded-full bg-black/55 px-3 py-2 text-xl font-bold text-white"
                  aria-label="Previous image"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 top-1/2 z-[230] -translate-y-1/2 rounded-full bg-black/55 px-3 py-2 text-xl font-bold text-white"
                  aria-label="Next image"
                >
                  ›
                </button>
              </>
            ) : null}

            <img
              src={mediaList[activeImage] || mediaSrc}
              alt=""
              className="max-h-[92vh] max-w-[96vw] object-contain"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={(e) => setLightboxTouchStartX(e.touches[0]?.clientX ?? null)}
              onTouchEnd={(e) => {
                if (lightboxTouchStartX === null) return;
                const endX = e.changedTouches[0]?.clientX ?? lightboxTouchStartX;
                const delta = endX - lightboxTouchStartX;
                if (Math.abs(delta) > 36) {
                  if (delta < 0) nextImage();
                  else prevImage();
                }
                setLightboxTouchStartX(null);
              }}
            />

            {mediaList.length > 1 ? (
              <div
                className="absolute bottom-5 left-1/2 z-[230] flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/45 px-3 py-1.5"
                onClick={(e) => e.stopPropagation()}
              >
                {mediaList.map((_, idx) => (
                  <button
                    key={`${post.id}-lightbox-dot-${idx}`}
                    type="button"
                    onClick={() => {
                      setActiveImage(idx);
                      setMediaSrc(mediaList[idx] || post.imageUrl);
                    }}
                    className={`h-2 w-2 rounded-full ${idx === activeImage ? "bg-white" : "bg-white/45"}`}
                    aria-label={`View image ${idx + 1}`}
                  />
                ))}
              </div>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.article>

  );
}
