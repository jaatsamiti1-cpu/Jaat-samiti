import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Send, 
  ShieldCheck, 
  MapPin, 
  Plus, 
  Image as ImageIcon, 
  Award, 
  Compass, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Share2,
  Check,
  Video,
  Bookmark
} from 'lucide-react';
import { Post, Comment, User, Story } from '../types';
import StoriesBar from './StoriesBar';
import siteLogo from '../assets/images/site_logo.jpg';

interface FeedSectionProps {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  currentUser: User;
  onShowToast: (message: string) => void;
  followedUsernames: string[];
  onToggleFollow: (username: string, authorName: string) => void;
  stories?: Story[];
  onOpenStory?: (index: number) => void;
  onAddStory?: (newStory: Story) => void;
  savedPostIds?: string[];
  onToggleSavePost?: (postId: string) => void;
}

export default function FeedSection({ 
  posts, 
  setPosts, 
  currentUser,
  onShowToast,
  followedUsernames = [],
  onToggleFollow,
  stories = [],
  onOpenStory,
  onAddStory,
  savedPostIds = [],
  onToggleSavePost
}: FeedSectionProps) {
  
  // New Post Creator States
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'heritage' | 'general' | 'achievement' | 'business'>('general');
  const [attachedImagePreset, setAttachedImagePreset] = useState<string | null>(null);
  const [attachedVideoPreset, setAttachedVideoPreset] = useState<string | null>(null);
  const [customVideoUrl, setCustomVideoUrl] = useState('');
  const [showVideoInput, setShowVideoInput] = useState(false);
  
  // Comments Toggle state per post ID
  const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState<{ [postId: string]: string }>({});

  // Image carousels index tracking per post ID
  const [carouselIndex, setCarouselIndex] = useState<{ [postId: string]: number }>({});

  // Double tap animation states per post ID
  const [doubleTapHeart, setDoubleTapHeart] = useState<{ [postId: string]: boolean }>({});
  const [lastTap, setLastTap] = useState<{ [postId: string]: number }>({});

  // High-res mock image presets for creating new posts
  const imagePresets = [
    { id: 'devilcar', label: 'Devil BMW Car (Logo)', url: siteLogo },
    { id: 'heritage', label: 'Lohagarh Fort', url: 'https://images.unsplash.com/photo-1627581534960-9dfd4a2fa3ea?auto=format&fit=crop&w=1000&q=80' },
    { id: 'agritech', label: 'AgriTech', url: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=1000&q=80' },
    { id: 'achievement', label: 'Sports Arena', url: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=1000&q=80' },
    { id: 'business', label: 'Business Suite', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80' },
  ];

  // Indian/Desi themed high-res video presets
  const videoPresets = [
    { id: 'tractor', label: 'Tractor Power & Agriculture', url: 'https://assets.mixkit.co/videos/preview/mixkit-agriculture-tractor-spraying-crops-in-a-field-41584-large.mp4' },
    { id: 'workout', label: 'Akhada Kushti Training', url: 'https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c054273f1e2474944983084c8a26222c&profile_id=139&oauth2_token_id=57447761' },
    { id: 'wheat', label: 'Golden Wheat Fields', url: 'https://assets.mixkit.co/videos/preview/mixkit-harvesting-wheat-with-a-modern-combine-harvester-41583-large.mp4' }
  ];

  // Post Category styling mapping
  const categoryLabels = {
    heritage: { text: 'Dharohar Charcha', style: 'border-blue-300 bg-blue-50 text-blue-800' },
    business: { text: 'Vyapaar & VC', style: 'border-emerald-300 bg-emerald-50 text-emerald-800' },
    achievement: { text: 'Badi Kamyabi', style: 'border-amber-300 bg-amber-50 text-amber-900' },
    general: { text: 'Aam Charcha', style: 'border-slate-300 bg-slate-100 text-slate-800' }
  };

  // Create Post
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const isVideoPost = !!(attachedVideoPreset || customVideoUrl);
    const mediaUrl = attachedVideoPreset || customVideoUrl || attachedImagePreset;

    const newPost: Post = {
      id: `post_${Date.now()}`,
      author: {
        name: currentUser.name,
        username: currentUser.username,
        avatar: currentUser.avatar,
        isVerified: currentUser.isVerified,
        verificationType: currentUser.verificationType,
      },
      content: newPostContent,
      media: mediaUrl ? [mediaUrl] : [],
      isVideo: isVideoPost,
      likes: 1,
      hasLiked: true,
      comments: [],
      shareCount: 0,
      timestamp: 'Just now',
      category: selectedCategory,
      location: currentUser.location.split('&')[0],
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setAttachedImagePreset(null);
    setAttachedVideoPreset(null);
    setCustomVideoUrl('');
    setShowVideoInput(false);
    onShowToast('✨ Aapka premium post successfully publish ho gaya!');
  };

  // Handle Like Toggle
  const handleLikeToggle = (postId: string) => {
    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id === postId) {
        const hasLiked = !post.hasLiked;
        return {
          ...post,
          hasLiked,
          likes: hasLiked ? post.likes + 1 : post.likes - 1
        };
      }
      return post;
    }));
  };

  // Handle Double Tap (Double Click) to Like
  const handleDoubleTap = (postId: string) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    
    const lastTapTime = lastTap[postId] || 0;
    if (now - lastTapTime < DOUBLE_PRESS_DELAY) {
      // It's a double tap!
      setPosts(prevPosts => prevPosts.map(post => {
        if (post.id === postId && !post.hasLiked) {
          return {
            ...post,
            hasLiked: true,
            likes: post.likes + 1
          };
        }
        return post;
      }));

      // Trigger animation
      setDoubleTapHeart(prev => ({ ...prev, [postId]: true }));
      setTimeout(() => {
        setDoubleTapHeart(prev => ({ ...prev, [postId]: false }));
      }, 800);
    }
    
    setLastTap(prev => ({ ...prev, [postId]: now }));
  };

  // Handle adding a comment
  const handleAddComment = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = newCommentText[postId];
    if (!text || !text.trim()) return;

    const newComment: Comment = {
      id: `c_${Date.now()}`,
      authorName: currentUser.name,
      authorUsername: currentUser.username,
      authorAvatar: currentUser.avatar,
      isVerified: currentUser.isVerified,
      content: text,
      timestamp: 'Just now'
    };

    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, newComment]
        };
      }
      return post;
    }));

    setNewCommentText(prev => ({ ...prev, [postId]: '' }));
    onShowToast('💬 Comment securely thread par post ho gaya.');
  };

  // Carousel navigation
  const nextSlide = (postId: string, mediaLength: number) => {
    const currentIndex = carouselIndex[postId] || 0;
    const nextIdx = (currentIndex + 1) % mediaLength;
    setCarouselIndex(prev => ({ ...prev, [postId]: nextIdx }));
  };

  const prevSlide = (postId: string, mediaLength: number) => {
    const currentIndex = carouselIndex[postId] || 0;
    const prevIdx = (currentIndex - 1 + mediaLength) % mediaLength;
    setCarouselIndex(prev => ({ ...prev, [postId]: prevIdx }));
  };

  // Share post Link Simulation
  const handleSharePost = (postId: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`);
    onShowToast('🔗 Secure encrypted link copy ho gaya hai.');
  };

  return (
    <div id="feed-container" className="flex flex-col gap-6 max-w-2xl mx-auto pb-24 md:pb-6 select-none">
      
      {/* 0. Instagram Stories Tray */}
      {stories.length > 0 && onOpenStory && onAddStory && (
        <StoriesBar
          stories={stories}
          currentUser={currentUser}
          onOpenStory={onOpenStory}
          onAddStory={onAddStory}
          onShowToast={onShowToast}
        />
      )}

      {/* 1. Header Banner */}
      <div className="rounded-2xl bg-white border border-slate-200 p-5 flex items-center justify-between shadow-sm">
        <div className="flex flex-col">
          <h2 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
            Jaat Samiti Feed <Sparkles className="w-4 h-4 text-amber-600" />
          </h2>
          <p className="text-xs text-slate-600">Khaas updates, itihaas ke kisse aur samaj ki badi kamyabiyaan.</p>
        </div>
        <span className="hidden sm:inline-flex px-3 py-1 text-[10px] font-mono tracking-widest text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-full font-bold">
          LIVE SAMPAK ACTIVE
        </span>
      </div>

      {/* 2. Premium Post Creator Box */}
      <form 
        id="post-creator-box"
        onSubmit={handleCreatePost}
        className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm"
      >
        <div className="flex gap-4">
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name} 
            className="w-10 h-10 rounded-full object-cover border border-amber-500/30 shrink-0"
            referrerPolicy="no-referrer"
          />
          <div className="flex-1 flex flex-col gap-3">
            <textarea
              id="new-post-input"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="Apni koi kamyabi, dhasu itihaas, ya business ki update share karein..."
              className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 border-none outline-none resize-none h-18 py-1.5 focus:ring-0 leading-relaxed"
            />
            
            {/* Attached Image Preset Preview */}
            {attachedImagePreset && (
              <div className="relative rounded-xl overflow-hidden max-h-48 border border-slate-200">
                <img 
                  src={attachedImagePreset} 
                  alt="Attachment preview" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <button
                  type="button"
                  onClick={() => setAttachedImagePreset(null)}
                  className="absolute top-2 right-2 bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 rounded-full p-1 border border-slate-300 transition-colors cursor-pointer shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
            )}

            {/* Attached Video Preset/URL Preview */}
            {(attachedVideoPreset || customVideoUrl) && (
              <div className="relative rounded-xl overflow-hidden max-h-48 border border-slate-200 bg-black">
                <video 
                  src={attachedVideoPreset || customVideoUrl} 
                  controls 
                  className="w-full h-40 object-cover"
                />
                <button
                  type="button"
                  onClick={() => { setAttachedVideoPreset(null); setCustomVideoUrl(''); }}
                  className="absolute top-2 right-2 bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 rounded-full p-1 border border-slate-300 transition-colors cursor-pointer z-10 shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3.5">
              {/* Media Presets and category dropdown */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Photo Attach */}
                <div className="relative group">
                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs text-slate-700 hover:text-slate-900 transition-all cursor-pointer font-medium"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
                    <span>Photo</span>
                  </button>
                  
                  {/* Dropdown presets popover */}
                  <div className="absolute left-0 bottom-full mb-2 hidden group-hover:flex flex-col bg-white border border-slate-200 rounded-xl p-2.5 w-48 shadow-xl z-50">
                    <span className="text-[10px] font-mono text-slate-500 tracking-wider mb-2 uppercase block font-semibold">Image Select Karein</span>
                    <div className="flex flex-col gap-1.5">
                      {imagePresets.map(preset => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => { setAttachedImagePreset(preset.url); setAttachedVideoPreset(null); setCustomVideoUrl(''); }}
                          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-amber-50 text-left text-xs text-slate-800 hover:text-amber-900 font-medium transition-colors cursor-pointer"
                        >
                          <span className="w-1.5 h-1.5 bg-amber-600 rounded-full"></span>
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Video Attach */}
                <div className="relative group">
                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs text-slate-700 hover:text-slate-900 transition-all cursor-pointer font-medium"
                  >
                    <Video className="w-3.5 h-3.5 text-amber-600" />
                    <span>Video</span>
                  </button>
                  
                  {/* Dropdown presets popover */}
                  <div className="absolute left-0 bottom-full mb-2 hidden group-hover:flex flex-col bg-white border border-slate-200 rounded-xl p-2.5 w-52 shadow-xl z-50">
                    <span className="text-[10px] font-mono text-slate-500 tracking-wider mb-2 uppercase block font-semibold">Video Select Karein</span>
                    <div className="flex flex-col gap-1.5 mb-2">
                      {videoPresets.map(preset => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => { setAttachedVideoPreset(preset.url); setAttachedImagePreset(null); setCustomVideoUrl(''); }}
                          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-amber-50 text-left text-xs text-slate-800 hover:text-amber-900 font-medium transition-colors cursor-pointer"
                        >
                          <span className="w-1.5 h-1.5 bg-amber-600 rounded-full"></span>
                          {preset.label}
                        </button>
                      ))}
                    </div>
                    
                    <div className="border-t border-slate-100 pt-2">
                      <span className="text-[9px] font-mono text-slate-500 uppercase block mb-1">Custom MP4 URL:</span>
                      <input 
                        type="text" 
                        placeholder="https://...mp4"
                        value={customVideoUrl}
                        onChange={(e) => { setCustomVideoUrl(e.target.value); setAttachedVideoPreset(null); setAttachedImagePreset(null); }}
                        className="w-full bg-slate-50 text-[10px] text-slate-800 px-2 py-1 rounded border border-slate-200 outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Category Selectors */}
                <select
                  id="category-selector"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as any)}
                  className="bg-slate-100 text-slate-800 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-amber-500 cursor-pointer font-medium"
                >
                  <option value="general">Category: Aam Charcha</option>
                  <option value="heritage">Category: Dharohar Spotlight</option>
                  <option value="achievement">Category: Kamyabi & Sports</option>
                  <option value="business">Category: Business & VC</option>
                </select>
              </div>

              {/* Submit Post Button */}
              <button
                type="submit"
                disabled={!newPostContent.trim()}
                className="flex items-center gap-1.5 px-4.5 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-200 text-white disabled:text-slate-400 font-display text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3px]" />
                <span>Post Karein</span>
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* 3. Central Scrolling Feed Posts */}
      <div id="feed-scroller" className="flex flex-col gap-6">
        {posts.map((post) => {
          const currentImgIdx = carouselIndex[post.id] || 0;
          const hasMultipleMedia = post.media.length > 1;
          const isCommentsOpen = activeCommentsPostId === post.id;
          const hasMedia = post.media.length > 0;
          const categoryMeta = categoryLabels[post.category];

          return (
            <article 
              key={post.id} 
              id={`feed-post-${post.id}`}
              className="rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 transition-all duration-200 shadow-sm overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full p-[1.5px] bg-amber-500/30">
                    <img 
                      src={post.author.avatar} 
                      alt={post.author.name} 
                      className="w-full h-full rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-display font-semibold text-slate-900">{post.author.name}</span>
                      {post.author.isVerified && (
                        <span className="flex items-center" title={`${post.author.verificationType} Verified Member`}>
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-600 fill-transparent" />
                        </span>
                      )}
                      
                      {post.author.username !== currentUser.username && (
                        <>
                          <span className="text-slate-400 text-[10px]">•</span>
                          <button
                            onClick={() => onToggleFollow(post.author.username, post.author.name)}
                            className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded transition-all cursor-pointer outline-none ${
                              followedUsernames.includes(post.author.username)
                                ? 'text-amber-900 bg-amber-500/10 border border-amber-500/30'
                                : 'text-slate-700 hover:text-slate-900 bg-slate-100 border border-slate-200'
                            }`}
                          >
                            {followedUsernames.includes(post.author.username) ? 'Sathi ✓' : '+ Sathi'}
                          </button>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                      <span>@{post.author.username}</span>
                      <span>•</span>
                      <span>{post.timestamp}</span>
                      {post.location && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-0.5 text-amber-700">
                            <MapPin className="w-2.5 h-2.5" /> {post.location}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Post Category Tag */}
                <span className={`px-2.5 py-0.5 text-[9px] font-mono tracking-wider rounded-md border ${categoryMeta.style} font-bold uppercase`}>
                  {categoryMeta.text}
                </span>
              </div>

              {/* Text Body */}
              <div className="px-5 pt-4 pb-3">
                <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                  {post.content}
                </p>
              </div>

              {/* Media Section with Carousel */}
              {hasMedia && (
                <div 
                  className="relative group select-none cursor-pointer overflow-hidden max-h-[460px] bg-slate-950 border-y border-slate-100"
                  onDoubleClick={() => handleDoubleTap(post.id)}
                >
                  {post.isVideo ? (
                    <div className="relative w-full aspect-video max-h-[440px] overflow-hidden bg-black flex items-center justify-center">
                      <video 
                        src={post.media[currentImgIdx]} 
                        controls
                        playsInline
                        loop
                        className="w-full h-full object-contain max-h-[440px]"
                        poster="https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=1000&q=80"
                      />
                    </div>
                  ) : (
                    <img 
                      src={post.media[currentImgIdx]} 
                      alt={`Media content ${currentImgIdx + 1}`} 
                      className="w-full h-full object-cover aspect-video max-h-[440px] transition-transform duration-500 group-hover:scale-[1.01]"
                      referrerPolicy="no-referrer"
                    />
                  )}

                  {/* Double tap heart overlay */}
                  {doubleTapHeart[post.id] && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/15 animate-fade-in">
                      <Heart className="w-20 h-20 text-amber-500 fill-amber-500 stroke-[1.5px] scale-[1.3] drop-shadow-md transition-all animate-bounce" />
                    </div>
                  )}

                  {/* Carousel Controls */}
                  {hasMultipleMedia && (
                    <>
                      <button 
                        onClick={(e) => { e.stopPropagation(); prevSlide(post.id, post.media.length); }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white border border-slate-200 text-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); nextSlide(post.id, post.media.length); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white border border-slate-200 text-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      {/* Dots Indicator */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {post.media.map((_, idx) => (
                          <span 
                            key={idx} 
                            className={`w-1.5 h-1.5 rounded-full ${idx === currentImgIdx ? 'bg-amber-500 w-3' : 'bg-white/60'} transition-all`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Interactions Bar */}
              <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 text-slate-600 font-medium">
                <div className="flex items-center gap-6">
                  {/* Like */}
                  <button 
                    onClick={() => handleLikeToggle(post.id)}
                    className={`flex items-center gap-2 text-xs font-display transition-all outline-none cursor-pointer ${
                      post.hasLiked ? 'text-amber-600 font-bold scale-105' : 'hover:text-slate-900'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${post.hasLiked ? 'fill-amber-600 stroke-amber-600' : ''}`} />
                    <span>{post.likes}</span>
                  </button>

                  {/* Comment Toggle */}
                  <button 
                    onClick={() => setActiveCommentsPostId(isCommentsOpen ? null : post.id)}
                    className={`flex items-center gap-2 text-xs font-display hover:text-slate-900 outline-none cursor-pointer ${
                      isCommentsOpen ? 'text-amber-600 font-bold' : ''
                    }`}
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>{post.comments.length} Comments</span>
                  </button>
                </div>

                {/* Share Link & Bookmark */}
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleSharePost(post.id)}
                    className="flex items-center gap-1.5 text-xs font-display hover:text-slate-900 outline-none cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">Secure Bhejein</span>
                  </button>

                  {onToggleSavePost && (
                    <button
                      onClick={() => onToggleSavePost(post.id)}
                      className="flex items-center text-xs font-display hover:text-slate-900 outline-none cursor-pointer p-1"
                      title={savedPostIds.includes(post.id) ? 'Saved' : 'Save post'}
                    >
                      <Bookmark className={`w-4.5 h-4.5 transition-colors ${
                        savedPostIds.includes(post.id) ? 'fill-amber-600 text-amber-600' : 'text-slate-500'
                      }`} />
                    </button>
                  )}
                </div>
              </div>

              {/* Collapsible Comments Section */}
              {isCommentsOpen && (
                <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-4 flex flex-col gap-4">
                  {/* Comments list */}
                  <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-1">
                    {post.comments.length === 0 ? (
                      <p className="text-slate-500 text-xs font-mono py-2">Abhi tak koi comments nahi hain. Pehle baniye aap!</p>
                    ) : (
                      post.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3 items-start text-xs">
                          <img 
                            src={comment.authorAvatar} 
                            alt={comment.authorName} 
                            className="w-7 h-7 rounded-full object-cover shrink-0 border border-amber-500/20"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1 bg-white rounded-xl p-3 border border-slate-200/80 shadow-2xs">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-1">
                                <span className="font-semibold text-slate-900 font-display">{comment.authorName}</span>
                                {comment.isVerified && (
                                  <ShieldCheck className="w-3 h-3 text-amber-600" />
                                )}
                                <span className="text-slate-500 font-mono text-[9px]">@{comment.authorUsername}</span>
                              </div>
                              <span className="text-[9px] text-slate-400 font-mono">{comment.timestamp}</span>
                            </div>
                            <p className="text-slate-700 leading-normal">{comment.content}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Comment Input Form */}
                  <form 
                    onSubmit={(e) => handleAddComment(post.id, e)}
                    className="flex gap-3 border-t border-slate-200/80 pt-3.5"
                  >
                    <img 
                      src={currentUser.avatar} 
                      alt={currentUser.name} 
                      className="w-7 h-7 rounded-full object-cover border border-amber-500/20"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={newCommentText[post.id] || ''}
                        onChange={(e) => setNewCommentText({ ...newCommentText, [post.id]: e.target.value })}
                        placeholder="Securely baat-cheet karein..."
                        className="flex-1 bg-white text-slate-900 placeholder-slate-400 text-xs rounded-xl px-3 py-1.5 border border-slate-200 outline-none focus:border-amber-500 font-medium"
                      />
                      <button
                        type="submit"
                        disabled={!newCommentText[post.id]?.trim()}
                        className="px-3.5 py-1.5 bg-amber-600 disabled:bg-slate-200 text-white disabled:text-slate-400 text-xs font-bold font-display rounded-xl transition-colors cursor-pointer shadow-2xs"
                      >
                        Bhejein
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </article>
          );
        })}
      </div>

    </div>
  );
}
