import React, { useState } from 'react';
import { 
  TrendingUp, 
  Briefcase, 
  ShieldCheck, 
  ArrowUpRight, 
  Star, 
  MapPin, 
  Sparkles,
  Check,
  AlertCircle
} from 'lucide-react';
import { Leader, Business } from '../types';

interface RightSidebarProps {
  leaders: Leader[];
  businesses: Business[];
  onSelectBusiness: (biz: Business) => void;
  onRequestVerification: () => void;
  isVerifiedRequested: boolean;
  followedUsernames?: string[];
  onToggleFollow?: (username: string, name: string) => void;
}

export default function RightSidebar({ 
  leaders, 
  businesses, 
  onSelectBusiness,
  onRequestVerification,
  isVerifiedRequested,
  followedUsernames = [],
  onToggleFollow
}: RightSidebarProps) {
  const featuredLeaders = leaders.slice(0, 3);
  const featuredBiz = businesses.filter(b => b.isFeatured).slice(0, 2);

  return (
    <aside 
      id="right-sidebar" 
      className="hidden xl:flex flex-col gap-6 w-80 bg-white/60 border-l border-slate-200/80 p-6 overflow-y-auto h-screen fixed right-0 top-0 select-none"
    >
      {/* Search Bar / Header widget */}
      <div className="relative mt-2">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <TrendingUp className="w-4 h-4 text-amber-600" />
        </span>
        <div className="w-full bg-slate-100/80 text-slate-800 pl-10 pr-4 py-2.5 rounded-xl text-xs font-mono border border-slate-200 tracking-wider font-medium">
          NETWORK STATUS: <span className="text-emerald-700 font-semibold">SECURE PLATINUM</span>
        </div>
      </div>

      {/* Elite Verification Card */}
      <div 
        id="verification-cta-card"
        className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-amber-50 via-white to-white border border-amber-500/30 p-5 shadow-sm"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl"></div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
          <span className="text-[11px] font-mono tracking-widest text-amber-800 font-bold uppercase">
            MEMBERSHIP STATUS
          </span>
        </div>

        <h3 className="font-serif text-base font-bold text-slate-900 mb-2">
          Elite Badge ke liye Apply Karein
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed mb-4">
          Apni authenticity banayein. Secure end-to-end encrypted chats, premium business listing aur profile par chamakta gold badge unlock karein.
        </p>

        {isVerifiedRequested ? (
          <div className="flex items-center gap-2 py-2 px-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-800 text-xs">
            <Check className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-medium">Verification request pending hai. Jald review hogi!</span>
          </div>
        ) : (
          <button
            id="apply-verification-btn"
            onClick={onRequestVerification}
            className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-display text-xs font-bold tracking-wide transition-all duration-200 shadow-sm cursor-pointer"
          >
            Elite Badge Ke Liye Apply Karein
          </button>
        )}
      </div>

      {/* Trending Leaders Widget */}
      <div id="trending-leaders-widget" className="flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-amber-600 rounded-sm"></span>
            <h3 className="font-serif text-sm font-bold tracking-wide text-slate-900">
              Samaj ke Margdarshak
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">SPOTLIGHT</span>
        </div>

        <div className="flex flex-col gap-3">
          {featuredLeaders.map((leader) => {
            const isFollowing = leader.username ? followedUsernames.includes(leader.username) : false;
            return (
              <div 
                key={leader.id} 
                className="group flex flex-col gap-1.5 p-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-amber-500/30 transition-all duration-200 shadow-sm"
              >
                <div className="flex gap-3">
                  <div className="relative shrink-0">
                    <img 
                      src={leader.avatar} 
                      alt={leader.name} 
                      className="w-10 h-10 rounded-full object-cover border border-amber-500/20 group-hover:scale-105 transition-transform duration-200"
                      referrerPolicy="no-referrer"
                    />
                    {leader.isVerified && (
                      <span className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-[1px]">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                      </span>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="text-xs font-display font-semibold text-slate-900 truncate group-hover:text-amber-800 transition-colors duration-200">
                        {leader.name}
                      </span>
                      {leader.username && onToggleFollow && (
                        <button
                          onClick={() => onToggleFollow(leader.username!, leader.name)}
                          className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded transition-all outline-none cursor-pointer shrink-0 ${
                            isFollowing 
                              ? 'bg-amber-500/10 border border-amber-500/30 text-amber-900' 
                              : 'bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700'
                          }`}
                        >
                          {isFollowing ? 'Sathi ✓' : '+ Sathi'}
                        </button>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium truncate">
                      {leader.role}
                    </span>
                    {leader.followersCount !== undefined && (
                      <span className="text-[9px] text-slate-400 font-mono mt-0.5">
                        {leader.followersCount.toLocaleString()} sathi
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-[9px] font-mono text-amber-800 border-t border-slate-100 pt-1.5 mt-0.5 truncate max-w-full">
                  ✨ {leader.achievement}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Business Network Shortcut Panel */}
      <div id="business-network-widget" className="flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-amber-600 rounded-sm"></span>
            <h3 className="font-serif text-sm font-bold tracking-wide text-slate-900">
              Vyapaari Networks
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">YELLOW PAGES</span>
        </div>

        <div className="flex flex-col gap-3">
          {featuredBiz.map((biz) => (
            <div 
              key={biz.id} 
              onClick={() => onSelectBusiness(biz)}
              className="group relative overflow-hidden rounded-xl bg-white border border-slate-200/90 p-3 hover:border-amber-500/30 transition-all duration-200 shadow-sm cursor-pointer"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <img 
                    src={biz.logoUrl} 
                    alt={biz.name} 
                    className="w-7 h-7 rounded-lg object-cover border border-amber-500/20 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-display font-semibold text-slate-900 truncate group-hover:text-amber-800 transition-colors">
                      {biz.name}
                    </span>
                    <span className="text-[9px] font-mono text-amber-800 uppercase tracking-wide font-semibold">
                      {biz.category}
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 transition-colors shrink-0" />
              </div>
              
              <p className="text-[10px] text-slate-600 leading-normal line-clamp-2 mb-2">
                {biz.description}
              </p>

              <div className="flex items-center justify-between text-[9px] font-mono text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5 text-amber-600" /> {biz.location.split(',')[0]}
                </span>
                <span className="flex items-center gap-1 font-bold text-amber-800">
                  <Star className="w-2.5 h-2.5 fill-amber-500 stroke-amber-500" /> {biz.rating.toFixed(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
