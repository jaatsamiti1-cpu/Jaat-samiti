import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Volume2, 
  VolumeX, 
  Music, 
  ShieldCheck, 
  Sparkles,
  Send,
  X
} from 'lucide-react';
import { Reel, User } from '../types';

interface ReelsSectionProps {
  reels: Reel[];
  currentUser: User;
  onShowToast: (msg: string) => void;
  onToggleFollow?: (username: string, authorName: string) => void;
  followedUsernames?: string[];
  onToggleLike?: (reelId: string) => void;
  onToggleSave?: (reelId: string) => void;
  onAddComment?: (reelId: string, text: string) => void;
}

export default function ReelsSection({
  reels,
  currentUser,
  onShowToast,
  onToggleFollow,
  followedUsernames = [],
  onToggleLike: parentToggleLike,
  onToggleSave: parentToggleSave,
  onAddComment: parentAddComment
}: ReelsSectionProps) {
  const [localReels, setLocalReels] = useState<Reel[]>(reels);
  const [muted, setMuted] = useState(true);
  const [activeCommentsReelId, setActiveCommentsReelId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [doubleTapHeart, setDoubleTapHeart] = useState<{ [id: string]: boolean }>({});
  const lastTapRef = useRef<{ [id: string]: number }>({});

  const handleToggleLike = (reelId: string) => {
    setLocalReels((prev) =>
      prev.map((r) => {
        if (r.id === reelId) {
          const hasLiked = !r.hasLiked;
          return {
            ...r,
            hasLiked,
            likes: hasLiked ? r.likes + 1 : r.likes - 1
          };
        }
        return r;
      })
    );
  };

  const handleDoubleTap = (reelId: string) => {
    const now = Date.now();
    const lastTap = lastTapRef.current[reelId] || 0;
    if (now - lastTap < 300) {
      setLocalReels((prev) =>
        prev.map((r) => (r.id === reelId && !r.hasLiked ? { ...r, hasLiked: true, likes: r.likes + 1 } : r))
      );
      setDoubleTapHeart((prev) => ({ ...prev, [reelId]: true }));
      setTimeout(() => {
        setDoubleTapHeart((prev) => ({ ...prev, [reelId]: false }));
      }, 800);
    }
    lastTapRef.current[reelId] = now;
  };

  const handleToggleSave = (reelId: string) => {
    setLocalReels((prev) =>
      prev.map((r) => {
        if (r.id === reelId) {
          const hasSaved = !r.hasSaved;
          onShowToast(hasSaved ? '🔖 Reel saved to your collection' : 'Reel removed from saved');
          return { ...r, hasSaved };
        }
        return r;
      })
    );
  };

  const handleShare = (reelId: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/reels/${reelId}`);
    onShowToast('🔗 Reel link copied to clipboard!');
  };

  const handleAddComment = (reelId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setLocalReels((prev) =>
      prev.map((r) => (r.id === reelId ? { ...r, comments: r.comments + 1 } : r))
    );
    onShowToast(`💬 Comment posted: "${commentText}"`);
    setCommentText('');
  };

  return (
    <div id="instagram-reels-section" className="flex flex-col items-center gap-8 max-w-md mx-auto pb-24 select-none">
      {localReels.map((reel) => {
        const isFollowed = reel.author.username ? followedUsernames.includes(reel.author.username) : false;

        return (
          <div
            key={reel.id}
            id={`reel-${reel.id}`}
            className="relative w-full aspect-[9/16] bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-200/40 group flex flex-col justify-end"
            onClick={() => handleDoubleTap(reel.id)}
          >
            {/* Background Video Player */}
            <video
              src={reel.videoUrl}
              autoPlay
              loop
              muted={muted}
              playsInline
              className="absolute inset-0 w-full h-full object-cover cursor-pointer"
            />

            {/* Gradient Overlays for readable text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

            {/* Top Mute/Unmute Toggle */}
            <div className="absolute top-4 right-4 z-20">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMuted(!muted);
                }}
                className="w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-xs text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer"
                aria-label={muted ? 'Unmute' : 'Mute'}
              >
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Double-tap heart animation */}
            {doubleTapHeart[reel.id] && (
              <motion.div
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1.3 }}
                exit={{ opacity: 0, scale: 1.5 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
              >
                <Heart className="w-24 h-24 fill-rose-500 text-rose-500 drop-shadow-xl" />
              </motion.div>
            )}

            {/* Floating Right Action Bar */}
            <div className="absolute bottom-6 right-3.5 z-20 flex flex-col items-center gap-4 text-white">
              {/* Like Button */}
              <div className="flex flex-col items-center gap-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleLike(reel.id);
                  }}
                  className="p-2 rounded-full hover:bg-white/20 transition-all active:scale-90 cursor-pointer"
                  aria-label="Like"
                >
                  <Heart
                    className={`w-7 h-7 transition-colors ${
                      reel.hasLiked
                        ? 'fill-rose-500 text-rose-500 scale-110'
                        : 'text-white hover:text-rose-400'
                    }`}
                  />
                </button>
                <span className="text-[11px] font-mono font-semibold drop-shadow">
                  {reel.likes > 999 ? `${(reel.likes / 1000).toFixed(1)}k` : reel.likes}
                </span>
              </div>

              {/* Comments Button */}
              <div className="flex flex-col items-center gap-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveCommentsReelId(
                      activeCommentsReelId === reel.id ? null : reel.id
                    );
                  }}
                  className="p-2 rounded-full hover:bg-white/20 transition-all active:scale-90 cursor-pointer"
                  aria-label="Comments"
                >
                  <MessageCircle className="w-7 h-7 text-white" />
                </button>
                <span className="text-[11px] font-mono font-semibold drop-shadow">
                  {reel.comments}
                </span>
              </div>

              {/* Share Button */}
              <div className="flex flex-col items-center gap-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare(reel.id);
                  }}
                  className="p-2 rounded-full hover:bg-white/20 transition-all active:scale-90 cursor-pointer"
                  aria-label="Share"
                >
                  <Share2 className="w-6 h-6 text-white" />
                </button>
                <span className="text-[11px] font-mono font-semibold drop-shadow">
                  {reel.shares}
                </span>
              </div>

              {/* Bookmark / Save Button */}
              <div className="flex flex-col items-center gap-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleSave(reel.id);
                  }}
                  className="p-2 rounded-full hover:bg-white/20 transition-all active:scale-90 cursor-pointer"
                  aria-label="Save"
                >
                  <Bookmark
                    className={`w-6 h-6 ${
                      reel.hasSaved ? 'fill-amber-400 text-amber-400' : 'text-white'
                    }`}
                  />
                </button>
              </div>

              {/* Spinning Vinyl Record Disc */}
              <div className="relative mt-2">
                <div className="w-9 h-9 rounded-full bg-slate-900 border-2 border-white/60 p-1 flex items-center justify-center animate-spin [animation-duration:4s]">
                  <img
                    src={reel.author.avatar}
                    alt="Audio"
                    className="w-full h-full rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Left Info: Author, Caption, Song */}
            <div className="relative z-20 p-4 pr-16 flex flex-col gap-2.5 text-white">
              <div className="flex items-center gap-2.5">
                <img
                  src={reel.author.avatar}
                  alt={reel.author.name}
                  className="w-9 h-9 rounded-full object-cover border-2 border-white/80"
                  referrerPolicy="no-referrer"
                />
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold leading-tight drop-shadow">
                    @{reel.author.username}
                  </span>
                  {reel.author.isVerified && (
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  {reel.author.username !== currentUser.username && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (reel.author.username) {
                          onToggleFollow(reel.author.username, reel.author.name || '');
                        }
                      }}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-colors cursor-pointer ${
                        isFollowed
                          ? 'bg-white/20 text-white border-white/40'
                          : 'bg-rose-600 text-white border-rose-500 hover:bg-rose-700'
                      }`}
                    >
                      {isFollowed ? 'Following' : 'Follow'}
                    </button>
                  )}
                </div>
              </div>

              <p className="text-xs text-white/95 line-clamp-2 leading-relaxed drop-shadow">
                {reel.caption}
              </p>

              {/* Music Audio Ticker */}
              <div className="flex items-center gap-2 text-[11px] text-white/80 font-mono">
                <Music className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{reel.songTitle}</span>
              </div>
            </div>

            {/* Comments Drawer / Popover */}
            {activeCommentsReelId === reel.id && (
              <div
                className="absolute inset-x-0 bottom-0 max-h-72 bg-slate-900/95 backdrop-blur-md z-30 p-4 border-t border-white/10 flex flex-col gap-3"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs font-bold text-white">Comments ({reel.comments})</span>
                  <button
                    onClick={() => setActiveCommentsReelId(null)}
                    className="text-white/60 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 text-xs text-white/90">
                  <div className="flex items-start gap-2">
                    <img
                      src={currentUser.avatar}
                      alt="User"
                      className="w-6 h-6 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <span className="font-bold text-[11px] block">nihal_jaat</span>
                      <span className="text-[11px] text-white/70">Zabardast power bhai! Systummm full on.</span>
                    </div>
                  </div>
                </div>

                <form onSubmit={(e) => handleAddComment(reel.id, e)} className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full text-xs text-white placeholder-white/50 outline-none focus:border-white/60"
                  />
                  <button
                    type="submit"
                    className="p-1.5 text-rose-400 hover:text-rose-300 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
