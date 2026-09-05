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
  Search
} from 'lucide-react';
import { User as UserType } from '../types';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  user: UserType;
  unreadCount: number;
  openDMs: () => void;
  hasUnreadMessages: boolean;
}

export default function Sidebar({ 
  currentTab, 
  setCurrentTab, 
  user, 
  unreadCount, 
  openDMs,
  hasUnreadMessages 
}: SidebarProps) {
  
  const navItems = [
    { id: 'feed', label: 'Apna Feed', icon: Home },
    { id: 'heritage', label: 'Dharohar & Itihas', icon: Compass },
    { id: 'directory', label: 'Vyapaar Network', icon: Briefcase },
    { id: 'profile', label: 'Apni Profile', icon: User },
  ];

  return (
    <>
      {/* Desktop Left Sidebar */}
      <aside 
        id="desktop-sidebar" 
        className="hidden md:flex flex-col fixed top-0 left-0 h-screen w-72 bg-white border-r border-slate-200/80 z-40 p-6 justify-between select-none shadow-sm"
      >
        <div className="flex flex-col gap-8">
          {/* Brand Logo Header */}
          <div className="flex items-center gap-3 px-2">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-tr from-amber-500 via-amber-600 to-yellow-600 p-[2px] shadow-sm shrink-0 overflow-hidden">
              <img 
                src="/src/assets/images/jaat_samiti_logo_1785940752383.jpg" 
                alt="Jaat Samiti Logo" 
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-0 right-0 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
            </div>
            <div className="flex flex-col">
              <h1 className="font-serif text-sm font-bold text-slate-900 leading-tight tracking-wide">
                Jaat Samiti
              </h1>
              <span className="text-[10px] font-mono tracking-tight text-amber-700 font-semibold leading-none mt-0.5">
                Jaswant Jaat, Nihal Jaat & Nitesh Jaat
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  id={`nav-item-${item.id}`}
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 text-left outline-none ${
                    isActive 
                      ? 'bg-amber-500/10 text-amber-900 font-semibold border-l-2 border-amber-600 shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-105 ${
                      isActive ? 'text-amber-600' : 'text-slate-500 group-hover:text-slate-800'
                    }`} />
                    <span className="text-sm font-display tracking-wide">{item.label}</span>
                  </div>
                </button>
              );
            })}

            {/* Direct Messages Shortcut */}
            <button
              id="nav-item-dms"
              onClick={openDMs}
              className="group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 text-left hover:bg-slate-100/80 outline-none text-slate-600 hover:text-slate-900"
            >
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <MessageSquare className="w-5 h-5 text-slate-500 group-hover:text-slate-800 transition-transform duration-200 group-hover:scale-105" />
                  {hasUnreadMessages && (
                    <span className="absolute -top-1 -right-1 flex h-2 w-2 rounded-full bg-emerald-500"></span>
                  )}
                </div>
                <span className="text-sm font-display tracking-wide">Secure Guftagu (DMs)</span>
              </div>
              <span className="px-2 py-0.5 text-[9px] font-mono tracking-wider rounded-md border border-emerald-300 bg-emerald-50 text-emerald-800 font-bold">
                E2EE
              </span>
            </button>
          </nav>
        </div>

        {/* User Card & Invite Credits info */}
        <div className="flex flex-col gap-3 border-t border-slate-200 pt-5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full p-[1.5px] bg-amber-500/80 shadow-sm">
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-full h-full rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-display font-semibold text-slate-900 max-w-[130px] truncate">{user.name}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                </div>
                <span className="text-[11px] font-mono text-amber-800 font-medium">{user.membershipLevel}</span>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/90 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-[11px] text-slate-600 font-medium">Nyota Credits</span>
            </div>
            <span className="font-mono text-xs font-bold text-amber-800">{user.invitesRemaining} bache</span>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav 
        id="mobile-bottom-nav" 
        className="md:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-lg border-t border-slate-200 z-40 flex items-center justify-around py-2.5 px-2 shadow-lg"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              id={`mobile-nav-item-${item.id}`}
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg outline-none transition-all ${
                isActive ? 'text-amber-700 font-bold' : 'text-slate-500'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-display tracking-tight font-medium">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}

        {/* Secure DMs on Mobile */}
        <button
          id="mobile-nav-item-dms"
          onClick={openDMs}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-lg outline-none transition-all text-slate-500"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 text-slate-500" />
            {hasUnreadMessages && (
              <span className="absolute -top-1 -right-1 flex h-2 w-2 rounded-full bg-emerald-500"></span>
            )}
          </div>
          <span className="text-[10px] font-display tracking-tight font-medium">DMs</span>
        </button>
      </nav>
    </>
  );
}
