/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Sparkles, 
  Lock,
  Compass,
  AlertCircle
} from 'lucide-react';

import { 
  currentUser as initialUser, 
  mockPosts, 
  mockBusinesses, 
  mockLeaders,
  initialChatMessages 
} from './data';

import Sidebar from './components/Sidebar';
import FeedSection from './components/FeedSection';
import HeritageSection from './components/HeritageSection';
import DirectorySection from './components/DirectorySection';
import ProfileSection from './components/ProfileSection';
import RightSidebar from './components/RightSidebar';
import DMsDrawer from './components/DMsDrawer';
import jaatLogo from './assets/images/jaat_samiti_logo_1785940752383.jpg';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('feed');
  
  // Real Persistent User Profile State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('jaat_samiti_user_profile');
      return saved ? JSON.parse(saved) : initialUser;
    } catch {
      return initialUser;
    }
  });

  const [posts, setPosts] = useState(mockPosts);
  const [businesses, setBusinesses] = useState(mockBusinesses);

  // Dynamic Leaders state to keep followers counts in sync
  const [leaders, setLeaders] = useState(() => {
    try {
      const saved = localStorage.getItem('jaat_samiti_leaders');
      return saved ? JSON.parse(saved) : mockLeaders;
    } catch {
      return mockLeaders;
    }
  });

  // Real Followed Usernames tracking
  const [followedUsernames, setFollowedUsernames] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('jaat_samiti_followed');
      return saved ? JSON.parse(saved) : ['samiti_founders', 'maharajasurajmal_heritage'];
    } catch {
      return ['samiti_founders', 'maharajasurajmal_heritage'];
    }
  });

  // Sync state modifications to localStorage for genuine persistence
  useEffect(() => {
    localStorage.setItem('jaat_samiti_user_profile', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('jaat_samiti_leaders', JSON.stringify(leaders));
  }, [leaders]);

  useEffect(() => {
    localStorage.setItem('jaat_samiti_followed', JSON.stringify(followedUsernames));
  }, [followedUsernames]);
  
  // Encrypted Messenger State
  const [isDMOpen, setIsDMOpen] = useState(false);
  const [activeChatPartnerName, setActiveChatPartnerName] = useState<string | undefined>(undefined);
  const [activeChatPartnerAvatar, setActiveChatPartnerAvatar] = useState<string | undefined>(undefined);

  // Elite verification states
  const [isVerifiedRequested, setIsVerifiedRequested] = useState(false);

  // Custom Toast notification states
  const [toast, setToast] = useState<{ message: string; id: number } | null>(null);

  const showToast = (message: string) => {
    const id = Date.now();
    setToast({ message, id });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 4000);
  };

  // Toggle follow status of any username (author/owner/leader)
  const handleToggleFollow = (username: string, authorName?: string) => {
    if (username === currentUser.username) return;

    const isFollowing = followedUsernames.includes(username);
    let updatedFollowed: string[];

    if (isFollowing) {
      updatedFollowed = followedUsernames.filter(u => u !== username);
      setCurrentUser((prev: typeof initialUser) => ({
        ...prev,
        followingCount: Math.max(0, prev.followingCount - 1)
      }));
      
      // Update leaders list follower count reactively
      setLeaders(prevLeaders => 
        prevLeaders.map(leader => {
          if (leader.username === username) {
            return {
              ...leader,
              followersCount: Math.max(0, (leader.followersCount || 0) - 1)
            };
          }
          return leader;
        })
      );

      showToast(`❌ Aapne ${authorName || '@' + username} ko unfollow kar diya.`);
    } else {
      updatedFollowed = [...followedUsernames, username];
      setCurrentUser((prev: typeof initialUser) => ({
        ...prev,
        followingCount: prev.followingCount + 1
      }));

      // Update leaders list follower count reactively
      setLeaders(prevLeaders => 
        prevLeaders.map(leader => {
          if (leader.username === username) {
            return {
              ...leader,
              followersCount: (leader.followersCount || 0) + 1
            };
          }
          return leader;
        })
      );

      showToast(`✅ Aapne ${authorName || '@' + username} ko follow kar liya!`);
    }
    setFollowedUsernames(updatedFollowed);
  };

  // Directory connection callback
  const handleConnectOwner = (ownerName: string, bizName: string) => {
    // Find owner avatar if possible or default to business listing avatar
    const biz = businesses.find(b => b.ownerName === ownerName);
    setActiveChatPartnerName(ownerName);
    setActiveChatPartnerAvatar(biz?.ownerAvatar);
    setIsDMOpen(true);
  };

  // Right sidebar verification callback
  const handleRequestVerification = () => {
    setIsVerifiedRequested(true);
    showToast('🛡️ Verification application Elder Council ko secure tareeqe se bhej di gayi hai.');
  };

  // Render main core content based on active tab
  const renderTabContent = () => {
    switch (currentTab) {
      case 'feed':
        return (
          <FeedSection 
            posts={posts} 
            setPosts={setPosts} 
            currentUser={currentUser} 
            onShowToast={showToast} 
            followedUsernames={followedUsernames}
            onToggleFollow={handleToggleFollow}
          />
        );
      case 'heritage':
        return <HeritageSection onShowToast={showToast} />;
      case 'directory':
        return (
          <DirectorySection 
            businesses={businesses} 
            setBusinesses={setBusinesses} 
            onShowToast={showToast} 
            onConnectOwner={handleConnectOwner}
            followedUsernames={followedUsernames}
            onToggleFollow={handleToggleFollow}
            currentUser={currentUser}
          />
        );
      case 'profile':
        return (
          <ProfileSection 
            currentUser={currentUser} 
            setCurrentUser={setCurrentUser} 
            userPosts={posts} 
            onShowToast={showToast} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div id="app-root" className="bg-slate-100/70 text-slate-900 min-h-screen font-sans selection:bg-amber-500/20 selection:text-amber-900">
      
      {/* Decorative ambient gradients */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-amber-500/10 via-yellow-400/5 to-transparent rounded-full blur-3xl pointer-events-none z-0"></div>
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-amber-600/5 via-slate-200/40 to-transparent rounded-full blur-3xl pointer-events-none z-0"></div>

      {/* Main Layout Wrapping Grid */}
      <div className="relative max-w-[1400px] mx-auto z-10 flex">
        
        {/* Responsive Desktop / Mobile Left Sidebar Navigation */}
        <Sidebar 
          currentTab={currentTab} 
          setCurrentTab={setCurrentTab} 
          user={currentUser}
          unreadCount={2}
          openDMs={() => setIsDMOpen(true)}
          hasUnreadMessages={true}
        />

        {/* Center Main Scrolling Core Window */}
        <main 
          id="main-scroll-pane" 
          className="flex-1 min-h-screen bg-transparent border-x border-slate-200/80 md:pl-72 xl:pr-80 pb-28 md:pb-6"
        >
          {/* Top header navigation bar for mobile view only */}
          <header 
            id="mobile-header" 
            className="md:hidden flex items-center justify-between p-4 bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              <img 
                src={jaatLogo} 
                alt="Jaat Samiti Logo" 
                className="w-8 h-8 rounded-full object-cover border border-amber-500/40 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-col">
                <h1 className="font-serif text-xs font-bold text-slate-900 leading-tight">
                  Jaat Samiti
                </h1>
                <span className="text-[8px] font-mono tracking-tight text-amber-700 font-medium leading-none">
                  Jaswant Jaat, Nihal Jaat & Nitesh Jaat
                </span>
              </div>
            </div>
            <span className="px-2 py-0.5 text-[9px] font-mono tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 rounded font-semibold">
              SECURED
            </span>
          </header>

          <div className="p-4 md:p-6 lg:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="focus:outline-none"
              >
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Responsive Desktop Right Sidebar widgets (Leaders & Directory Spotlight) */}
        <RightSidebar 
          leaders={leaders} 
          businesses={businesses} 
          onSelectBusiness={(biz) => {
            setCurrentTab('directory');
            showToast(`🏢 Yellow Pages me ${biz.name} ki details dekhein.`);
          }}
          onRequestVerification={handleRequestVerification}
          isVerifiedRequested={isVerifiedRequested}
          followedUsernames={followedUsernames}
          onToggleFollow={handleToggleFollow}
        />

      </div>

      {/* Slide-over Encrypted Direct Messages (DMs) Drawer */}
      <DMsDrawer 
        isOpen={isDMOpen} 
        onClose={() => setIsDMOpen(false)} 
        currentUser={currentUser} 
        initialChatMessages={initialChatMessages}
        activeChatPartnerName={activeChatPartnerName}
        activeChatPartnerAvatar={activeChatPartnerAvatar}
        onShowToast={showToast}
      />

      {/* Interactive, glowing custom Toast popups */}
      <AnimatePresence>
        {toast && (
          <motion.div
            id="app-toast-alert"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 220 }}
            className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 bg-white border border-amber-500/30 text-slate-900 text-xs font-mono tracking-wide rounded-2xl shadow-xl shadow-slate-900/10 min-w-[280px] max-w-sm"
          >
            <div className="p-1 rounded-lg bg-amber-50 text-amber-600">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div className="flex-1 text-left leading-normal">{toast.message}</div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
