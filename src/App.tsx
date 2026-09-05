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
  AlertCircle,
  Bell,
  Plus,
  LogIn,
  LogOut,
  Music,
  Crown
} from 'lucide-react';

import { 
  currentUser as initialUser, 
  mockPosts, 
  mockBusinesses, 
  mockLeaders,
  initialChatMessages,
  initialNotifications,
  initialStories,
  initialReels,
  defaultRegisteredAccounts,
  initialSongs
} from './data';
import { Notification, Story, Reel, RegisteredAccount, Post, User, Song } from './types';

import Sidebar from './components/Sidebar';
import FeedSection from './components/FeedSection';
import HeritageSection from './components/HeritageSection';
import DirectorySection from './components/DirectorySection';
import ProfileSection from './components/ProfileSection';
import ExploreSection from './components/ExploreSection';
import ReelsSection from './components/ReelsSection';
import AuthModal from './components/AuthModal';
import CreatePostModal from './components/CreatePostModal';
import StoryViewer from './components/StoryViewer';
import RightSidebar from './components/RightSidebar';
import DMsDrawer from './components/DMsDrawer';
import NotificationsDrawer from './components/NotificationsDrawer';
import InstagramAuthGate from './components/InstagramAuthGate';
import MusicSection from './components/MusicSection';
import FloatingMusicPlayer from './components/FloatingMusicPlayer';
import FounderConsole from './components/FounderConsole';
import siteLogo from './assets/images/site_logo.jpg';

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

  // Instagram: Registered Accounts & Profiles
  const [accounts, setAccounts] = useState<RegisteredAccount[]>(() => {
    try {
      const saved = localStorage.getItem('jaat_samiti_accounts');
      return saved ? JSON.parse(saved) : defaultRegisteredAccounts;
    } catch {
      return defaultRegisteredAccounts;
    }
  });

  useEffect(() => {
    localStorage.setItem('jaat_samiti_accounts', JSON.stringify(accounts));
  }, [accounts]);

  // Instagram: Stories State
  const [stories, setStories] = useState<Story[]>(() => {
    try {
      const saved = localStorage.getItem('jaat_samiti_stories');
      return saved ? JSON.parse(saved) : initialStories;
    } catch {
      return initialStories;
    }
  });

  useEffect(() => {
    localStorage.setItem('jaat_samiti_stories', JSON.stringify(stories));
  }, [stories]);

  // Instagram: Reels Video Feed State
  const [reels, setReels] = useState<Reel[]>(() => {
    try {
      const saved = localStorage.getItem('jaat_samiti_reels');
      return saved ? JSON.parse(saved) : initialReels;
    } catch {
      return initialReels;
    }
  });

  useEffect(() => {
    localStorage.setItem('jaat_samiti_reels', JSON.stringify(reels));
  }, [reels]);

  // Instagram: Saved / Bookmarked Posts
  const [savedPostIds, setSavedPostIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('jaat_samiti_saved_post_ids');
      return saved ? JSON.parse(saved) : ['post_1'];
    } catch {
      return ['post_1'];
    }
  });

  useEffect(() => {
    localStorage.setItem('jaat_samiti_saved_post_ids', JSON.stringify(savedPostIds));
  }, [savedPostIds]);

  // Instagram Gate: When user opens website, show Instagram Login / Signup screen
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('jaat_samiti_authenticated');
      // If user hasn't explicitly logged in, default to false so Instagram login appears first!
      return saved === 'true';
    } catch {
      return false;
    }
  });

  // Songs and Audio State with automatic cache migration for reliable MP3 streams
  const [songs, setSongs] = useState<Song[]>(() => {
    try {
      const saved = localStorage.getItem('jaat_samiti_songs');
      if (!saved) return initialSongs;
      const parsed: Song[] = JSON.parse(saved);
      // Migrate old placeholder sound effect URLs to full musical MP3 streams
      const upgraded = parsed.map(song => {
        const defaultMatch = initialSongs.find(d => d.id === song.id);
        if (defaultMatch && (
          !song.audioUrl || 
          song.audioUrl.includes('actions.google.com') || 
          song.audioUrl.endsWith('.ogg')
        )) {
          return { ...song, audioUrl: defaultMatch.audioUrl, duration: defaultMatch.duration };
        }
        return song;
      });
      return upgraded;
    } catch {
      return initialSongs;
    }
  });

  useEffect(() => {
    localStorage.setItem('jaat_samiti_songs', JSON.stringify(songs));
  }, [songs]);

  // Active audio player state
  const [currentSong, setCurrentSong] = useState<Song | null>(() => {
    try {
      const saved = localStorage.getItem('jaat_samiti_current_song');
      if (!saved) return initialSongs[0];
      const parsed = JSON.parse(saved);
      if (!parsed.audioUrl || parsed.audioUrl.includes('actions.google.com') || parsed.audioUrl.endsWith('.ogg')) {
        const match = initialSongs.find(d => d.id === parsed.id) || initialSongs[0];
        return match;
      }
      return parsed;
    } catch {
      return initialSongs[0];
    }
  });

  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    if (currentSong) {
      localStorage.setItem('jaat_samiti_current_song', JSON.stringify(currentSong));
    }
  }, [currentSong]);

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  
  // Encrypted Messenger State
  const [isDMOpen, setIsDMOpen] = useState(false);
  const [activeChatPartnerName, setActiveChatPartnerName] = useState<string | undefined>(undefined);
  const [activeChatPartnerAvatar, setActiveChatPartnerAvatar] = useState<string | undefined>(undefined);

  // Elite verification states
  const [isVerifiedRequested, setIsVerifiedRequested] = useState(false);

  // Dynamic Notifications State with LocalStorage Persistence
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    try {
      const saved = localStorage.getItem('jaat_samiti_notifications');
      return saved ? JSON.parse(saved) : initialNotifications;
    } catch {
      return initialNotifications;
    }
  });

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('jaat_samiti_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('✅ Sabhi suchnaayein padh li gayi hain.');
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    showToast('🗑️ Suchna hata di gayi.');
  };

  const handleSimulateNotification = () => {
    const simulationPool = [
      {
        type: 'like' as const,
        senderName: 'Nihal Jaat',
        senderAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80',
        message: 'ne aapki nayi photo aur dharohar update ko like kiya.'
      },
      {
        type: 'follow' as const,
        senderName: 'Nitesh Jaat',
        senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80',
        message: 'ne aapke profile ko follow kiya aur connect request bheji.'
      },
      {
        type: 'comment' as const,
        senderName: 'Virender Dahiya',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
        message: 'ne aapke Vyapaar post par comment kiya: "Bohot shaandaar initiative hai bhai!"'
      },
      {
        type: 'business_match' as const,
        senderName: 'Rohtak Agri-Corridor',
        senderAvatar: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=150&h=150&q=80',
        message: 'Aapki company ke liye 1 naya B2B partnership proposal aaya hai.'
      },
      {
        type: 'verification_approve' as const,
        senderName: 'Samiti Elder Council',
        senderAvatar: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=150&h=150&q=80',
        message: 'Aapka Elite Royal Verification tier safaltapoorvak approve kar diya gaya hai.'
      }
    ];

    const randomItem = simulationPool[Math.floor(Math.random() * simulationPool.length)];
    const newNotif: Notification = {
      id: `notif_${Date.now()}`,
      type: randomItem.type,
      senderName: randomItem.senderName,
      senderAvatar: randomItem.senderAvatar,
      message: randomItem.message,
      timestamp: 'Abhi',
      read: false
    };

    setNotifications(prev => [newNotif, ...prev]);
    showToast(`🔔 Nayi Interaction: ${randomItem.senderName} ${randomItem.message}`);
  };

  // Custom Toast notification states
  const [toast, setToast] = useState<{ message: string; id: number } | null>(null);

  const showToast = (message: string) => {
    const id = Date.now();
    setToast({ message, id });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 4000);
  };

  // Music & Audio Handlers
  const handlePlaySong = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    showToast(`▶️ Baj raha hai: "${song.title}" (${song.artist})`);
  };

  const handleTogglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  const handleNextSong = () => {
    if (!currentSong || songs.length === 0) return;
    const currentIndex = songs.findIndex(s => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    setCurrentSong(songs[nextIndex]);
    setIsPlaying(true);
  };

  const handlePrevSong = () => {
    if (!currentSong || songs.length === 0) return;
    const currentIndex = songs.findIndex(s => s.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    setCurrentSong(songs[prevIndex]);
    setIsPlaying(true);
  };

  const handleAddSong = (newSong: Song) => {
    setSongs(prev => [newSong, ...prev]);
    showToast(`🎵 "${newSong.title}" safalta-purvak library me jud gaya hai!`);
  };

  const handleResetDefaultSongs = () => {
    setSongs(initialSongs);
    setCurrentSong(initialSongs[0]);
    localStorage.setItem('jaat_samiti_songs', JSON.stringify(initialSongs));
    localStorage.setItem('jaat_samiti_current_song', JSON.stringify(initialSongs[0]));
    showToast('🔄 Sabhi 7 original hit gane successfully restore ho gaye hain!');
  };

  const handleSetProfileAnthem = (song: Song) => {
    setCurrentUser((prev: typeof initialUser) => ({
      ...prev,
      anthemSong: `${song.title} - ${song.artist}`
    }));
    showToast(`👑 "${song.title}" ko aapka official profile gana (Anthem) set kar diya gaya hai!`);
  };

  // Instagram Auth Handlers
  const handleAuthLogin = (account: RegisteredAccount) => {
    const userObj: User = {
      name: account.name,
      username: account.username,
      avatar: account.avatar,
      bio: account.bio || 'Samaj Founder Board & Jaat Samiti Sadasya.',
      location: account.location || 'Haryana, Bharat',
      followingCount: account.followingCount || 280,
      followersCount: account.followersCount || 1420,
      postsCount: posts.filter(p => p.author.username === account.username).length || 18,
      invitesRemaining: 5,
      invitesSent: [],
      isVerified: account.isVerified,
      verificationType: account.verificationType,
      membershipLevel: account.membershipLevel,
      phone: account.phone,
      joinedDate: account.joinedDate,
      anthemSong: account.anthemSong || 'Systummm Pe Systummm (Haryanvi Bass)'
    };
    setCurrentUser(userObj);
    setIsAuthenticated(true);
    localStorage.setItem('jaat_samiti_authenticated', 'true');
    showToast(`✨ Swagat hai, @${account.username}! Login safalta-purvak ho gaya.`);
  };

  const handleAuthSignUp = (newAccount: RegisteredAccount) => {
    setAccounts(prev => [newAccount, ...prev]);
    const userObj: User = {
      name: newAccount.name,
      username: newAccount.username,
      avatar: newAccount.avatar,
      bio: newAccount.bio || 'Proud member of Jaat Samaj network.',
      location: newAccount.location || 'Haryana, Bharat',
      followingCount: 1,
      followersCount: 0,
      postsCount: 0,
      invitesRemaining: 5,
      invitesSent: [],
      isVerified: newAccount.isVerified,
      verificationType: newAccount.verificationType,
      membershipLevel: newAccount.membershipLevel,
      phone: newAccount.phone,
      joinedDate: newAccount.joinedDate,
      anthemSong: newAccount.anthemSong || 'Surajmal Shaurya Gatha - Desi Dhol'
    };
    setCurrentUser(userObj);
    setIsAuthenticated(true);
    localStorage.setItem('jaat_samiti_authenticated', 'true');
    showToast(`🎉 Mubarak ho @${newAccount.username}! Aapka Instagram account ban gaya hai.`);
  };

  const handleAuthGuestAccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem('jaat_samiti_authenticated', 'true');
    showToast('👋 Mehman ke roop me preview mode shuru ho gaya.');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('jaat_samiti_authenticated', 'false');
    showToast('👋 Logout ho gaye. Instagram Login gate par redirect kiya gaya.');
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
    
    // Add real-time dynamic notification to alerts
    const verifNotif: Notification = {
      id: `notif_${Date.now()}`,
      type: 'verification_approve',
      senderName: 'Elder Council Board',
      senderAvatar: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=150&h=150&q=80',
      message: 'Aapka verification request status update: "Under Elder Council Review".',
      timestamp: 'Abhi',
      read: false
    };
    setNotifications(prev => [verifNotif, ...prev]);
  };

  // Instagram Features Handlers
  const handleSelectAccount = (account: RegisteredAccount) => {
    const updatedUser: User = {
      name: account.name,
      username: account.username,
      avatar: account.avatar,
      isVerified: account.isVerified,
      verificationType: account.verificationType,
      membershipLevel: account.membershipLevel,
      bio: account.bio,
      location: account.location,
      followersCount: account.followersCount,
      followingCount: account.followingCount,
      invitesRemaining: 2,
      invitesSent: currentUser.invitesSent || [],
      postsCount: posts.filter(p => p.author.username === account.username).length,
      savedPostIds: savedPostIds
    };
    setCurrentUser(updatedUser);
    showToast(`👤 Logged in as @${account.username} (${account.name})`);
  };

  const handleRegisterAccount = (accountData: {
    name: string;
    username: string;
    avatar: string;
    bio: string;
    location: string;
    verificationType: 'Elite' | 'Business' | 'Royal' | 'Youth' | 'Legend';
  }) => {
    const newAccount: RegisteredAccount = {
      id: `acc_${Date.now()}`,
      name: accountData.name,
      username: accountData.username,
      avatar: accountData.avatar,
      isVerified: true,
      verificationType: accountData.verificationType,
      membershipLevel: 'Elite Patron',
      bio: accountData.bio,
      location: accountData.location,
      followersCount: 1,
      followingCount: 2,
      postsCount: 0,
      invitesRemaining: 5,
      invitesSent: [],
      savedPostIds: []
    };

    setAccounts(prev => [newAccount, ...prev]);

    const newUser: User = {
      name: newAccount.name,
      username: newAccount.username,
      avatar: newAccount.avatar,
      isVerified: true,
      verificationType: newAccount.verificationType,
      membershipLevel: 'Elite Patron',
      bio: newAccount.bio,
      location: newAccount.location,
      followersCount: 1,
      followingCount: 2,
      invitesRemaining: 3,
      invitesSent: [],
      postsCount: 0,
      savedPostIds: []
    };
    setCurrentUser(newUser);

    const welcomeNotif: Notification = {
      id: `notif_${Date.now()}`,
      type: 'verification_approve',
      senderName: 'Jaat Samiti System',
      senderAvatar: siteLogo,
      message: `Aapka naya account @${newAccount.username} safaltapoorvak create ho gaya hai. Welcome to Jaat Samiti!`,
      timestamp: 'Abhi',
      read: false
    };
    setNotifications(prev => [welcomeNotif, ...prev]);
    showToast(`🎉 Nayi ID Ban Gayi: @${newAccount.username}! Welcome to Jaat Samiti.`);
  };

  const handleCreatePost = (newPost: Post) => {
    setPosts(prev => [newPost, ...prev]);
    setCurrentUser(prev => ({
      ...prev,
      postsCount: (prev.postsCount || 0) + 1
    }));

    // If post has a video, also create a Reel automatically
    if (newPost.videoUrl) {
      const newReel: Reel = {
        id: `reel_${Date.now()}`,
        author: {
          name: newPost.author.name,
          username: newPost.author.username,
          avatar: newPost.author.avatar,
          isVerified: newPost.author.isVerified,
          verificationType: newPost.author.verificationType
        },
        videoUrl: newPost.videoUrl,
        thumbnailUrl: newPost.media[0] || siteLogo,
        caption: newPost.content,
        songTitle: 'Original Audio • ' + newPost.author.name,
        likes: 1,
        comments: 0,
        shares: 0,
        hasLiked: false,
        hasSaved: false
      };
      setReels(prev => [newReel, ...prev]);
    }
  };

  const handleToggleSavePost = (postId: string) => {
    setSavedPostIds(prev => {
      const exists = prev.includes(postId);
      if (exists) {
        showToast('Bookmark hata diya gaya');
        return prev.filter(id => id !== postId);
      } else {
        showToast('🔖 Post saved to your bookmarks!');
        return [...prev, postId];
      }
    });
  };

  const handleToggleLikeReel = (reelId: string) => {
    setReels(prev => prev.map(r => {
      if (r.id === reelId) {
        const nextLiked = !r.hasLiked;
        return {
          ...r,
          hasLiked: nextLiked,
          likes: nextLiked ? r.likes + 1 : r.likes - 1
        };
      }
      return r;
    }));
  };

  const handleToggleSaveReel = (reelId: string) => {
    setReels(prev => prev.map(r => {
      if (r.id === reelId) {
        const nextSaved = !r.hasSaved;
        showToast(nextSaved ? '🔖 Reel saved to bookmarks' : 'Reel removed from saved');
        return {
          ...r,
          hasSaved: nextSaved
        };
      }
      return r;
    }));
  };

  const handleAddReelComment = (reelId: string, text: string) => {
    setReels(prev => prev.map(r => {
      if (r.id === reelId) {
        return {
          ...r,
          comments: r.comments + 1
        };
      }
      return r;
    }));
  };

  const handleOpenStory = (index: number) => {
    setActiveStoryIndex(index);
    setStories(prev => prev.map((s, idx) => idx === index ? { ...s, hasSeen: true } : s));
  };

  const handleAddStory = (newStory: Story) => {
    setStories(prev => [newStory, ...prev]);
    showToast('✨ Story publish ho gayi!');
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
            stories={stories}
            onOpenStory={handleOpenStory}
            onAddStory={handleAddStory}
            savedPostIds={savedPostIds}
            onToggleSavePost={handleToggleSavePost}
          />
        );
      case 'explore':
        return (
          <ExploreSection
            posts={posts}
            reels={reels}
            onShowToast={showToast}
            onSelectPost={(post) => {
              setCurrentTab('feed');
              showToast(`Viewing @${post.author.username}'s post`);
            }}
          />
        );
      case 'reels':
        return (
          <ReelsSection
            reels={reels}
            currentUser={currentUser}
            onToggleLike={handleToggleLikeReel}
            onToggleSave={handleToggleSaveReel}
            onAddComment={handleAddReelComment}
            onShowToast={showToast}
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
      case 'music':
        return (
          <MusicSection
            songs={songs}
            currentPlayingSong={currentSong}
            isPlaying={isPlaying}
            onPlaySong={handlePlaySong}
            onPauseSong={handleTogglePlay}
            onAddSong={handleAddSong}
            onSetProfileAnthem={(songTitle: string) => {
              setCurrentUser((prev: typeof initialUser) => ({
                ...prev,
                anthemSong: songTitle
              }));
              showToast(`👑 "${songTitle}" ko aapka official profile anthem set kar diya gaya hai!`);
            }}
            onShowToast={showToast}
            onResetDefaultSongs={handleResetDefaultSongs}
            currentUser={currentUser}
          />
        );
      case 'founder':
        return (
          <FounderConsole
            accounts={accounts}
            currentUser={currentUser}
            onShowToast={showToast}
            onNavigateToFeed={() => setCurrentTab('feed')}
            onSendBroadcast={(msg) => {
              const newNotif: Notification = {
                id: `broadcast_${Date.now()}`,
                type: 'verification_approve',
                senderName: 'Jaswant Jaat (Founder)',
                senderAvatar: currentUser.avatar,
                message: msg,
                timestamp: 'Abhi',
                read: false
              };
              setNotifications(prev => [newNotif, ...prev]);
              showToast('📢 Broadcast sandesh sabhi sadasyon ko bhej diya gaya!');
            }}
          />
        );
      case 'profile':
        return (
          <ProfileSection 
            currentUser={currentUser} 
            setCurrentUser={setCurrentUser} 
            userPosts={posts} 
            onShowToast={showToast} 
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            savedPosts={posts.filter(p => savedPostIds.includes(p.id))}
            onNavigateToFounderConsole={() => setCurrentTab('founder')}
            onNavigateToMusic={() => setCurrentTab('music')}
            currentPlayingSong={currentSong}
            isPlaying={isPlaying}
            onToggleSong={handleTogglePlay}
          />
        );
      default:
        return null;
    }
  };

  // 1. Instagram Auth Gate: If user opens website and is not authenticated, show Instagram Login / Signup immediately
  if (!isAuthenticated) {
    return (
      <div id="app-root" className="bg-slate-50 min-h-screen text-slate-900 font-sans">
        <InstagramAuthGate
          accounts={accounts}
          onLogin={handleAuthLogin}
          onSignUp={handleAuthSignUp}
          onGuestAccess={handleAuthGuestAccess}
          onShowToast={showToast}
        />
        
        {/* Floating toast notification */}
        <AnimatePresence>
          {toast && (
            <motion.div
              id="auth-toast-alert"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2.5 max-w-md font-medium"
            >
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{toast.message}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

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
          openNotifications={() => setIsNotificationsOpen(true)}
          unreadNotificationsCount={unreadNotificationsCount}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onOpenCreatePost={() => setIsCreatePostModalOpen(true)}
          onLogout={handleLogout}
        />

        {/* Center Main Scrolling Core Window */}
        <main 
          id="main-scroll-pane" 
          className="flex-1 min-h-screen bg-transparent border-x border-slate-200/80 md:pl-72 xl:pr-80 pb-28 md:pb-6"
        >
          {/* Top header navigation bar for mobile view only */}
          <header 
            id="mobile-header" 
            className="md:hidden flex items-center justify-between p-3 sm:p-4 bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 shadow-xs"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <img 
                src={siteLogo} 
                alt="Jaat Samiti Logo" 
                className="w-8 h-8 rounded-full object-cover border border-amber-500/40 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-col min-w-0">
                <h1 className="font-serif text-xs sm:text-sm font-bold text-slate-900 leading-tight truncate">
                  Jaat Samiti
                </h1>
                <span className="text-[8px] sm:text-[9px] font-mono tracking-tight text-amber-700 font-medium leading-none truncate">
                  Jaswant Jaat, Nihal Jaat & Nitesh Jaat
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Mobile Create Post CTA */}
              <button
                id="mobile-create-post-btn"
                onClick={() => setIsCreatePostModalOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-display text-[11px] font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                title="Create Post"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Post</span>
              </button>

              {/* Dynamic Notification Bell Button with Notification Badge */}
              <button
                id="mobile-header-bell-button"
                onClick={() => setIsNotificationsOpen(true)}
                className="relative flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 hover:bg-amber-500/10 active:bg-amber-500/20 text-slate-700 hover:text-amber-800 transition-all border border-slate-200 active:scale-95 touch-manipulation cursor-pointer"
                aria-label={`Suchnaayein (${unreadNotificationsCount} unread)`}
              >
                <Bell className={`w-4 h-4 transition-transform duration-200 ${unreadNotificationsCount > 0 ? 'text-amber-700' : 'text-slate-600'}`} />
                {unreadNotificationsCount > 0 && (
                  <span 
                    id="mobile-header-bell-badge"
                    className="absolute -top-1 -right-1 flex items-center justify-center pointer-events-none"
                  >
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex items-center justify-center min-w-3.5 h-3.5 px-1 text-[8px] font-mono font-bold text-white bg-rose-600 rounded-full border border-white shadow-xs">
                      {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                    </span>
                  </span>
                )}
              </button>

              {/* Mobile ID Switcher trigger */}
              <button
                id="mobile-auth-switch-btn"
                onClick={() => setIsAuthModalOpen(true)}
                className="relative flex items-center justify-center w-8 h-8 rounded-full border border-amber-500/40 overflow-hidden active:scale-95 transition-transform cursor-pointer"
                title="Switch ID / Login"
              >
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </button>

              {/* Mobile Instagram Gate / Logout */}
              <button
                id="mobile-auth-logout-btn"
                onClick={handleLogout}
                className="relative flex items-center justify-center w-8 h-8 rounded-full bg-rose-50 border border-rose-200 text-rose-700 active:scale-95 transition-transform cursor-pointer"
                title="Instagram Login / Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
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

      {/* Dynamic Community Interactions & Notifications Drawer */}
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkNotificationAsRead}
        onMarkAllAsRead={handleMarkAllNotificationsAsRead}
        onDeleteNotification={handleDeleteNotification}
        onSimulateNotification={handleSimulateNotification}
        onNavigateTab={(tab) => setCurrentTab(tab)}
      />

      {/* Instagram Auth / ID Switcher Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        accounts={accounts}
        onSelectAccount={handleSelectAccount}
        onRegisterAccount={handleRegisterAccount}
        onShowToast={showToast}
      />

      {/* Instagram Post & Reel Creator Modal */}
      <CreatePostModal
        isOpen={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
        currentUser={currentUser}
        onPostCreated={handleCreatePost}
        onShowToast={showToast}
      />

      {/* Instagram Story Full-screen Viewer */}
      {activeStoryIndex !== null && (
        <StoryViewer
          stories={stories}
          initialIndex={activeStoryIndex}
          onClose={() => setActiveStoryIndex(null)}
          currentUser={currentUser}
          onShowToast={showToast}
        />
      )}

      {/* Persistent Floating Music Player (Gane Playback) */}
      <FloatingMusicPlayer
        currentSong={currentSong}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onNext={handleNextSong}
        onPrev={handlePrevSong}
        onClose={() => setCurrentSong(null)}
        onOpenMusicSection={() => setCurrentTab('music')}
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
