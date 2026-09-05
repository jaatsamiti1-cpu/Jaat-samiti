import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Image as ImageIcon, 
  Sparkles, 
  MapPin, 
  Smile, 
  Check, 
  Film, 
  Sliders 
} from 'lucide-react';
import { Post, User } from '../types';
import siteLogo from '../assets/images/site_logo.jpg';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onPostCreated: (newPost: Post) => void;
  onShowToast: (msg: string) => void;
}

export default function CreatePostModal({
  isOpen,
  onClose,
  currentUser,
  onPostCreated,
  onShowToast
}: CreatePostModalProps) {
  const [content, setContent] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('normal');
  const [location, setLocation] = useState('New Delhi, India');
  const [previewMediaUrl, setPreviewMediaUrl] = useState<string>(siteLogo);
  const [isVideo, setIsVideo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filters = [
    { id: 'normal', name: 'Normal', css: '' },
    { id: 'darkdevil', name: 'Dark Devil', css: 'contrast(1.35) brightness(0.9) saturate(1.4)' },
    { id: 'clarendon', name: 'Clarendon', css: 'contrast(1.2) saturate(1.25)' },
    { id: 'juno', name: 'Juno', css: 'contrast(1.15) saturate(1.3) sepia(0.1)' },
    { id: 'valencia', name: 'Valencia', css: 'contrast(1.05) sepia(0.25) brightness(1.08)' },
    { id: 'lofi', name: 'Lo-Fi', css: 'contrast(1.4) saturate(1.1)' },
    { id: 'moon', name: 'Noir B&W', css: 'grayscale(1) contrast(1.2)' },
  ];

  const presets = [
    { label: 'Devil Car', url: siteLogo, isVid: false },
    { label: 'Lohagarh Fort', url: 'https://images.unsplash.com/photo-1627581534960-9dfd4a2fa3ea?auto=format&fit=crop&w=1000&q=80', isVid: false },
    { label: 'Agri Drone', url: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=1000&q=80', isVid: false },
    { label: 'Akhada Kushti', url: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=1000&q=80', isVid: false },
  ];

  const hashtags = ['#JaatSamiti', '#Systummm', '#BMW', '#Akhada', '#KisanPower', '#Heritage'];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVid = file.type.startsWith('video');
      setIsVideo(isVid);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewMediaUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddHashtag = (tag: string) => {
    setContent((prev) => (prev ? `${prev} ${tag}` : tag));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !previewMediaUrl) return;

    const newPost: Post = {
      id: `post_${Date.now()}`,
      author: {
        name: currentUser.name,
        username: currentUser.username,
        avatar: currentUser.avatar,
        isVerified: currentUser.isVerified,
        verificationType: currentUser.verificationType,
      },
      content: content.trim(),
      media: previewMediaUrl ? [previewMediaUrl] : [],
      isVideo,
      likes: 1,
      hasLiked: true,
      comments: [],
      shareCount: 0,
      timestamp: 'Just now',
      category: 'general',
      location: location || 'India',
    };

    onPostCreated(newPost);
    onShowToast('🎉 Instagram Post published to your feed and profile!');
    setContent('');
    onClose();
  };

  if (!isOpen) return null;

  const currentFilterStyle = filters.find((f) => f.id === selectedFilter)?.css || '';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
            <h3 className="font-serif font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <span>Create New Post</span>
            </h3>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!content.trim() && !previewMediaUrl}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 disabled:opacity-40 transition-colors"
            >
              Share
            </button>
          </div>

          {/* Form Content */}
          <div className="p-4 sm:p-5 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left Column: Image Preview + Filter Selector */}
            <div className="flex flex-col gap-3">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 flex items-center justify-center">
                {isVideo ? (
                  <video
                    src={previewMediaUrl}
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={previewMediaUrl}
                    alt="Preview"
                    className="w-full h-full object-cover transition-all"
                    style={{ filter: currentFilterStyle }}
                    referrerPolicy="no-referrer"
                  />
                )}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-medium backdrop-blur-xs flex items-center gap-1.5 border border-white/20 shadow-md transition-all active:scale-95"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Change Photo</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* Instagram Filters Carousel */}
              {!isVideo && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                    <Sliders className="w-3 h-3" /> Filters
                  </span>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
                    {filters.map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setSelectedFilter(f.id)}
                        className={`flex flex-col items-center gap-1 shrink-0 p-1 rounded-xl transition-all ${
                          selectedFilter === f.id
                            ? 'ring-2 ring-rose-500 bg-rose-50/50'
                            : 'hover:bg-slate-100 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200">
                          <img
                            src={previewMediaUrl}
                            alt={f.name}
                            className="w-full h-full object-cover"
                            style={{ filter: f.css }}
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <span className="text-[9px] font-medium text-slate-700">{f.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Presets */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-[10px]">
                <span className="text-slate-400 font-mono">Presets:</span>
                {presets.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setPreviewMediaUrl(p.url);
                      setIsVideo(p.isVid);
                    }}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md shrink-0"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Author info, Caption, Location, Hashtags */}
            <div className="flex flex-col gap-4">
              {/* Author Preview */}
              <div className="flex items-center gap-2.5">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-full object-cover border border-slate-200"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 block leading-tight">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    @{currentUser.username}
                  </span>
                </div>
              </div>

              {/* Caption Input */}
              <div className="flex-col flex gap-1">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write a caption... (Share your story, car specs, or thoughts)"
                  rows={4}
                  className="w-full p-3 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-rose-500 focus:bg-white resize-none"
                />
              </div>

              {/* Hashtag suggestions */}
              <div className="flex flex-wrap gap-1.5">
                {hashtags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleAddHashtag(tag)}
                    className="px-2.5 py-1 text-[10px] font-mono bg-slate-100 hover:bg-amber-100 hover:text-amber-800 text-slate-600 rounded-full transition-colors cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Location input */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-slate-600">Location Tag</label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Gurgaon, Haryana"
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-rose-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!content.trim() && !previewMediaUrl}
                className="mt-auto py-2.5 bg-gradient-to-r from-amber-600 via-rose-600 to-amber-700 hover:opacity-90 text-white font-bold text-xs rounded-xl shadow transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Publish to Feed & Profile</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
