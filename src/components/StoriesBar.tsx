import React, { useRef } from 'react';
import { Plus } from 'lucide-react';
import { Story, User } from '../types';

interface StoriesBarProps {
  stories: Story[];
  currentUser: User;
  onOpenStory: (index: number) => void;
  onAddStory: (newStory: Story) => void;
  onShowToast: (msg: string) => void;
}

export default function StoriesBar({
  stories,
  currentUser,
  onOpenStory,
  onAddStory,
  onShowToast
}: StoriesBarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddStoryFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newStory: Story = {
          id: `story_${Date.now()}`,
          userId: currentUser.id,
          userName: currentUser.name,
          userUsername: currentUser.username,
          userAvatar: currentUser.avatar,
          mediaUrl: reader.result as string,
          caption: 'My latest update 🔥 #JaatSamiti',
          timestamp: 'Just now',
          hasSeen: false
        };
        onAddStory(newStory);
        onShowToast('📸 Story published! Visible to all members.');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      id="instagram-stories-tray"
      className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-xs overflow-hidden select-none"
    >
      <div className="flex items-center gap-4 overflow-x-auto pb-1 scrollbar-none">
        {/* 1. Current User's "Your Story" Circle */}
        <div className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
          <div className="relative">
            <div className="w-16 h-16 rounded-full p-[2px] bg-slate-200 group-hover:bg-amber-400 transition-colors">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-full h-full rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Blue/Amber Plus Badge */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center border-2 border-white shadow-xs group-hover:scale-110 transition-transform active:scale-90 cursor-pointer"
              title="Add Story"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3px]" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAddStoryFile}
              className="hidden"
            />
          </div>
          <span className="text-[11px] text-slate-700 font-medium tracking-tight truncate max-w-[68px]">
            Your Story
          </span>
        </div>

        {/* 2. Community Stories List */}
        {stories.map((story, index) => {
          return (
            <div
              key={story.id}
              onClick={() => onOpenStory(index)}
              className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
            >
              <div className="relative">
                {/* Instagram Gradient Ring */}
                <div
                  className={`w-16 h-16 rounded-full p-[2.5px] transition-transform duration-200 group-hover:scale-105 ${
                    story.hasSeen
                      ? 'bg-slate-300'
                      : 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 shadow-sm'
                  }`}
                >
                  <div className="w-full h-full bg-white rounded-full p-[1.5px]">
                    <img
                      src={story.userAvatar}
                      alt={story.userName}
                      className="w-full h-full rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </div>
              <span className="text-[11px] text-slate-700 font-medium tracking-tight truncate max-w-[68px]">
                {story.userName.split(' ')[0]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
