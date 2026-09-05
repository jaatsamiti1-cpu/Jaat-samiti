import React from 'react';
import { 
  Home, 
  Compass, 
  Briefcase, 
  Bell, 
  User, 
  ShieldCheck, 
  MessageSquare,
  Sparkles,
  Search,
  Clapperboard,
  PlusSquare,
  Users,
  LogIn
} from 'lucide-react';
import { User as UserType } from '../types';
import siteLogo from '../assets/images/site_logo.jpg';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  user: UserType;
  unreadCount: number;
  openDMs: () => void;
  openNotifications?: () => void;
  unreadNotificationsCount?: number;
  hasUnreadMessages: boolean;
  onOpenAuthModal?: () => void;
  onOpenCreatePost?: () => void;
}

export default function Sidebar({
  currentTab,
  setCurrentTab,
  user,
  unreadCount,
  openDMs,
  openNotifications,
  unreadNotificationsCount = 0,
  hasUnreadMessages,
  onOpenAuthModal,
  onOpenCreatePost
}: SidebarProps) {
  const navItems = [
    { id: 'feed', label: 'Feed (Home)', icon: Home },
    { id: 'explore', label: 'Explore (Search)', icon: Search },
    { id: 'reels', label: 'Reels (Videos)', icon: Clapperboard },
    { id: 'heritage', label: 'Dharohar & Itihas', icon: Compass },
    { id: 'directory', label: 'Vyapaar Network', icon: Briefcase },
    { id: 'profile', label: 'Apni Profile', icon: User },
  ];

  return (
    <>
      {/* Desktop Left Sidebar */}
      <aside 
        id="desktop-sidebar" 
        className="hidden md:flex flex-col fixed top-0 left-0 h-screen w-72 bg-white border-r border-slate-200/80 z-40 p-5 justify-between select-none shadow-sm overflow-y-auto"
      >
        <div className="flex flex-col gap-6">
          {/* Brand Logo Header with Devil Car Logo */}
          <div className="flex items-center gap-3 px-2">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-amber-700 p-[2px] shadow-sm shrink-0 overflow-hidden">
              <img 
                src={siteLogo} 
                alt="Jaat Samiti Logo" 
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-0 right-0 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              </span>
            </div>
            <div className="flex flex-col">
              <h1 className="font-serif text-base font-bold text-slate-900 leading-tight tracking-wide">
                Jaat Samiti
              </h1>
              <span className="text-[10px] font-mono tracking-tight text-amber-700 font-semibold leading-none mt-0.5">
                Jaswant, Nihal & Nitesh
              </span>
            </div>
          </div>

          {/* Create Post Action Button (Instagram-style) */}
          {onOpenCreatePost && (
            <button
              id="sidebar-create-post-btn"
              onClick={onOpenCreatePost}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-amber-600 via-rose-600 to-amber-700 hover:from-amber-700 hover:to-rose-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all active:scale-98 cursor-pointer"
            >
              <PlusSquare className="w-4 h-4" />
              <span>+ Create Post (Photo/Reel)</span>
            </button>
          )}

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  id={`nav-item-${item.id}`}
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 text-left outline-none ${
                    isActive 
                      ? 'bg-amber-500/10 text-amber-900 font-semibold border-l-2 border-amber-600 shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4.5 h-4.5 transition-transform duration-200 group-hover:scale-105 ${
                      isActive ? 'text-amber-600' : 'text-slate-500 group-hover:text-slate-800'
                    }`} />
                    <span className="text-xs font-display tracking-wide">{item.label}</span>
                  </div>
                </button>
              );
            })}

            {/* Notifications Shortcut */}
            {openNotifications && (
              <button
                id="nav-item-notifications"
                onClick={openNotifications}
                className="group flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 text-left hover:bg-slate-100/80 outline-none text-slate-600 hover:text-slate-900"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Bell className="w-4.5 h-4.5 text-slate-500 group-hover:text-slate-800 transition-transform duration-200 group-hover:scale-105" />
                    {unreadNotificationsCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-2 w-2 rounded-full bg-rose-500"></span>
                    )}
                  </div>
                  <span className="text-xs font-display tracking-wide">Alerts & Suchna</span>
                </div>
                {unreadNotificationsCount > 0 ? (
                  <span className="px-1.5 py-0.5 text-[9px] font-mono tracking-wider rounded-md border border-rose-300 bg-rose-50 text-rose-700 font-bold">
                    {unreadNotificationsCount}
                  </span>
                ) : (
                  <span className="text-[9px] font-mono text-slate-400">All read</span>
                )}
              </button>
            )}

            {/* Direct Messages Shortcut */}
            <button
              id="nav-item-dms"
              onClick={openDMs}
              className="group flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 text-left hover:bg-slate-100/80 outline-none text-slate-600 hover:text-slate-900"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <MessageSquare className="w-4.5 h-4.5 text-slate-500 group-hover:text-slate-800 transition-transform duration-200 group-hover:scale-105" />
                  {hasUnreadMessages && (
                    <span className="absolute -top-1 -right-1 flex h-2 w-2 rounded-full bg-emerald-500"></span>
                  )}
                </div>
                <span className="text-xs font-display tracking-wide">Secure DMs (Chat)</span>
              </div>
              <span className="px-1.5 py-0.5 text-[9px] font-mono tracking-wider rounded-md border border-emerald-300 bg-emerald-50 text-emerald-800 font-bold">
                E2EE
              </span>
            </button>
          </nav>
        </div>

        {/* User Card & Switch Account / Sign Up CTA */}
        <div className="flex flex-col gap-2.5 border-t border-slate-200 pt-4 mt-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 rounded-full p-[1.5px] bg-amber-500/80 shadow-sm">
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-full h-full rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-display font-semibold text-slate-900 max-w-[110px] truncate">{user.name}</span>
                  <ShieldCheck className="w-3 h-3 text-amber-600 shrink-0" />
                </div>
                <span className="text-[10px] font-mono text-slate-500 truncate">@{user.username}</span>
              </div>
            </div>
          </div>

          {/* Switch ID / Login Button */}
          {onOpenAuthModal && (
            <button
              id="sidebar-switch-id-btn"
              onClick={onOpenAuthModal}
              className="w-full py-1.5 px-2.5 rounded-lg border border-slate-200 hover:border-amber-400 bg-slate-50 hover:bg-amber-50/50 text-[11px] font-medium text-slate-700 hover:text-amber-900 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-amber-600" />
              <span>Switch ID / Apna ID Banayein</span>
            </button>
          )}

          <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200/90 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span className="text-[10px] text-slate-600 font-medium">Nyota Credits</span>
            </div>
            <span className="font-mono text-[11px] font-bold text-amber-800">{user.invitesRemaining} bache</span>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav 
        id="mobile-bottom-nav" 
        className="md:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-lg border-t border-slate-200 z-40 flex items-center justify-around py-2 px-1 shadow-lg"
      >
        <button
          id="mobile-nav-item-feed"
          onClick={() => setCurrentTab('feed')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg outline-none transition-all ${
            currentTab === 'feed' ? 'text-amber-700 font-bold' : 'text-slate-500'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[9px] font-display tracking-tight font-medium">Home</span>
        </button>

        <button
          id="mobile-nav-item-explore"
          onClick={() => setCurrentTab('explore')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg outline-none transition-all ${
            currentTab === 'explore' ? 'text-amber-700 font-bold' : 'text-slate-500'
          }`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[9px] font-display tracking-tight font-medium">Explore</span>
        </button>

        {/* Center Instagram Create Post Button on Mobile */}
        {onOpenCreatePost && (
          <button
            id="mobile-nav-item-create"
            onClick={onOpenCreatePost}
            className="flex items-center justify-center w-10 h-10 -mt-3 rounded-full bg-gradient-to-tr from-amber-600 via-rose-600 to-amber-700 text-white shadow-md active:scale-90 transition-transform cursor-pointer"
            aria-label="Create Post"
          >
            <PlusSquare className="w-5 h-5" />
          </button>
        )}

        <button
          id="mobile-nav-item-reels"
          onClick={() => setCurrentTab('reels')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg outline-none transition-all ${
            currentTab === 'reels' ? 'text-amber-700 font-bold' : 'text-slate-500'
          }`}
        >
          <Clapperboard className="w-5 h-5" />
          <span className="text-[9px] font-display tracking-tight font-medium">Reels</span>
        </button>

        {/* Profile */}
        <button
          id="mobile-nav-item-profile"
          onClick={() => setCurrentTab('profile')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg outline-none transition-all ${
            currentTab === 'profile' ? 'text-amber-700 font-bold' : 'text-slate-500'
          }`}
        >
          <div className="w-5 h-5 rounded-full overflow-hidden border border-slate-300">
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="text-[9px] font-display tracking-tight font-medium">Profile</span>
        </button>
      </nav>
    </>
  );
}
