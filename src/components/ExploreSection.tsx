import React, { useState } from 'react';
import { Search, Heart, MessageCircle, Film, Sparkles } from 'lucide-react';
import { Post, Reel } from '../types';

interface ExploreSectionProps {
  posts: Post[];
  reels?: Reel[];
  onSelectPost: (post: Post) => void;
  onShowToast: (msg: string) => void;
}

export default function ExploreSection({
  posts,
  reels = [],
  onSelectPost,
  onShowToast
}: ExploreSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const tags = ['#All', '#JaatSamiti', '#BMW', '#Akhada', '#AgriTech', '#Heritage', '#Systummm'];

  const filteredPosts = posts.filter((post) => {
    const matchesQuery =
      searchQuery === '' ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.username?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTag =
      !selectedTag ||
      selectedTag === '#All' ||
      post.content.toLowerCase().includes(selectedTag.toLowerCase().replace('#', '')) ||
      post.category.toLowerCase().includes(selectedTag.toLowerCase().replace('#', ''));

    return matchesQuery && matchesTag;
  });

  return (
    <div id="instagram-explore-section" className="flex flex-col gap-5 max-w-3xl mx-auto pb-24 select-none">
      {/* Search Header Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search posts, hashtags, or Jaat members..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-rose-500 focus:bg-white transition-all font-medium"
          />
        </div>

        {/* Trending Hashtag Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-all shrink-0 cursor-pointer ${
                (selectedTag === tag || (!selectedTag && tag === '#All'))
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* 3-Column Instagram Mosaic Grid */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5">
        {filteredPosts.map((post, idx) => {
          const mediaItem = post.media[0] || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80';
          const isLarge = idx % 5 === 0;

          return (
            <div
              key={post.id}
              onClick={() => {
                onSelectPost(post);
                onShowToast(`Viewing post by @${post.author.username}`);
              }}
              className={`relative group rounded-xl overflow-hidden bg-slate-100 cursor-pointer aspect-square ${
                isLarge ? 'sm:col-span-2 sm:row-span-2' : ''
              }`}
            >
              {post.isVideo ? (
                <div className="relative w-full h-full">
                  <video
                    src={mediaItem}
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <Film className="w-4 h-4 text-white absolute top-2 right-2 drop-shadow z-10" />
                </div>
              ) : (
                <img
                  src={mediaItem}
                  alt={post.content}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              )}

              {/* Hover Dark Overlay with Heart & Comment count (Standard Instagram UI) */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white font-bold text-xs pointer-events-none">
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4 fill-white text-white" />
                  {post.likes}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4 fill-white text-white" />
                  {post.comments.length}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
