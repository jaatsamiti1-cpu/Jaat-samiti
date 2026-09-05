import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, Send, ChevronLeft, ChevronRight, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { Story, User } from '../types';

interface StoryViewerProps {
  isOpen?: boolean;
  onClose: () => void;
  stories: Story[];
  initialIndex: number;
  currentUser: User;
  onShowToast: (msg: string) => void;
  onStoryLiked?: (storyId: string) => void;
}

export default function StoryViewer({
  isOpen = true,
  onClose,
  stories,
  initialIndex = 0,
  currentUser,
  onShowToast,
  onStoryLiked
}: StoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [floatingHearts, setFloatingHearts] = useState<number[]>([]);

  const currentStory = stories[currentIndex];

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setProgress(0);
  }, [initialIndex, isOpen]);

  // Timer loop for progressing story
  useEffect(() => {
    if (!isOpen || isPaused || !currentStory) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Go to next story or close if last
          if (currentIndex < stories.length - 1) {
            setCurrentIndex((c) => c + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + 2; // ~5 seconds for 100% (50 ticks * 100ms)
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isOpen, isPaused, currentIndex, stories.length, onClose]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
    }
  };

  const handleHeartClick = () => {
    const id = Date.now();
    setFloatingHearts((prev) => [...prev, id]);
    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h !== id));
    }, 1200);

    if (onStoryLiked && currentStory) {
      onStoryLiked(currentStory.id);
    }
    onShowToast(`❤️ Story liked! Sent to @${currentStory?.userUsername}`);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !currentStory) return;
    onShowToast(`✈️ Reply bheja @${currentStory.userUsername} ko: "${replyText}"`);
    setReplyText('');
  };

  if (!isOpen || !currentStory) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md select-none">
        {/* Navigation arrow Left */}
        {currentIndex > 0 && (
          <button
            onClick={handlePrev}
            className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white items-center justify-center transition-all z-20 cursor-pointer"
            aria-label="Previous story"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Navigation arrow Right */}
        {currentIndex < stories.length - 1 && (
          <button
            onClick={handleNext}
            className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white items-center justify-center transition-all z-20 cursor-pointer"
            aria-label="Next story"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Close Button Top Right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 p-2 rounded-full z-30 transition-colors cursor-pointer"
          aria-label="Close story"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Story Phone-sized Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-sm h-[88vh] max-h-[720px] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-white/10"
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Top Progress Segmented Bars */}
          <div className="absolute top-3 left-3 right-3 z-30 flex gap-1.5">
            {stories.map((s, idx) => (
              <div
                key={s.id}
                className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
              >
                <div
                  className="h-full bg-white transition-all duration-100 ease-linear"
                  style={{
                    width:
                      idx < currentIndex
                        ? '100%'
                        : idx === currentIndex
                        ? `${progress}%`
                        : '0%'
                  }}
                />
              </div>
            ))}
          </div>

          {/* Top User Info Bar */}
          <div className="absolute top-7 left-3 right-3 z-30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 shadow-sm">
                <img
                  src={currentStory.userAvatar}
                  alt={currentStory.userName}
                  className="w-full h-full rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-white text-xs font-semibold leading-tight drop-shadow-md">
                  {currentStory.userName}
                </span>
                <span className="text-white/70 text-[10px] drop-shadow-md">
                  @{currentStory.userUsername} • {currentStory.timestamp}
                </span>
              </div>
            </div>
          </div>

          {/* Touch navigation hotspots (Left half: Prev, Right half: Next) */}
          <div className="absolute inset-0 flex z-10">
            <div className="w-1/3 h-full cursor-pointer" onClick={handlePrev} />
            <div className="w-2/3 h-full cursor-pointer" onClick={handleNext} />
          </div>

          {/* Story Media Background Image */}
          <div className="relative flex-1 w-full h-full overflow-hidden bg-black flex items-center justify-center">
            <img
              src={currentStory.mediaUrl}
              alt="Story"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />

            {/* Story Caption */}
            {currentStory.caption && (
              <div className="absolute bottom-20 left-4 right-4 z-20 text-white text-sm font-medium drop-shadow-md bg-black/40 backdrop-blur-xs p-3 rounded-xl border border-white/10">
                {currentStory.caption}
              </div>
            )}

            {/* Floating Bursting Hearts */}
            {floatingHearts.map((heartId) => (
              <motion.div
                key={heartId}
                initial={{ opacity: 1, scale: 0.5, y: 0 }}
                animate={{ opacity: 0, scale: 2, y: -200 }}
                transition={{ duration: 1 }}
                className="absolute bottom-20 right-8 text-rose-500 pointer-events-none z-40"
              >
                <Heart className="w-12 h-12 fill-rose-500 stroke-none" />
              </motion.div>
            ))}
          </div>

          {/* Bottom Interaction Bar */}
          <div className="relative z-30 p-3 bg-gradient-to-t from-black via-black/80 to-transparent flex items-center gap-2">
            <form onSubmit={handleSendReply} className="flex-1 flex items-center">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Send message to @${currentStory.userUsername}...`}
                className="w-full px-3.5 py-2 text-xs text-white placeholder-white/60 bg-white/20 hover:bg-white/25 focus:bg-white/30 border border-white/20 rounded-full outline-none focus:border-white/50 transition-all"
              />
            </form>

            <button
              onClick={handleHeartClick}
              className="p-2.5 rounded-full text-white hover:text-rose-400 bg-white/20 hover:bg-white/30 transition-all active:scale-90 cursor-pointer"
              aria-label="Like story"
            >
              <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
