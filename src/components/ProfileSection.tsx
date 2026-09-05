import React, { useState, useRef } from 'react';
import { 
  User as UserType, 
  Post,
  Song
} from '../types';
import { 
  ShieldCheck, 
  MapPin, 
  Users, 
  Sparkles, 
  Mail, 
  Plus, 
  Check, 
  Clock, 
  Send,
  Grid,
  CreditCard,
  Crown,
  Key,
  Settings,
  X,
  Camera,
  Bookmark,
  LogIn,
  Upload,
  Music,
  Play,
  Pause,
  ArrowRight,
  Phone,
  Image as ImageIcon
} from 'lucide-react';
import siteLogo from '../assets/images/site_logo.jpg';

const AVATAR_PRESETS = [
  {
    name: 'Devil BMW Car (Logo)',
    url: siteLogo
  },
  {
    name: 'Royal Sadasya (Young Male)',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80'
  },
  {
    name: 'Business Leader Portrait',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=400&q=80'
  },
  {
    name: 'Wrestling Champ (Pride Female)',
    url: 'https://images.unsplash.com/photo-1594744803329-e58b31de215f?auto=format&fit=crop&w=400&h=400&q=80'
  },
  {
    name: 'Samaj Pioneer (Modern Portrait)',
    url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&h=400&q=80'
  }
];

interface ProfileSectionProps {
  currentUser: UserType;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserType>>;
  userPosts: Post[];
  onShowToast: (message: string) => void;
  onOpenAuthModal?: () => void;
  savedPosts?: Post[];
  onNavigateToFounderConsole?: () => void;
  onNavigateToMusic?: () => void;
  currentPlayingSong?: Song | null;
  isPlaying?: boolean;
  onToggleSong?: () => void;
}

export default function ProfileSection({ 
  currentUser, 
  setCurrentUser, 
  userPosts,
  onShowToast,
  onOpenAuthModal,
  savedPosts = [],
  onNavigateToFounderConsole,
  onNavigateToMusic,
  currentPlayingSong,
  isPlaying,
  onToggleSong
}: ProfileSectionProps) {
  
  const [inviteEmail, setInviteEmail] = useState('');
  const [profileTab, setProfileTab] = useState<'posts' | 'saved'>('posts');
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const modalGalleryInputRef = useRef<HTMLInputElement>(null);

  // Edit Profile States
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(currentUser.name);
  const [editUsername, setEditUsername] = useState(currentUser.username);
  const [editBio, setEditBio] = useState(currentUser.bio);
  const [editLocation, setEditLocation] = useState(currentUser.location);
  const [editAvatar, setEditAvatar] = useState(currentUser.avatar);
  const [editVerificationType, setEditVerificationType] = useState(currentUser.verificationType || 'Elite');
  const [editMembershipLevel, setEditMembershipLevel] = useState(currentUser.membershipLevel || 'Standard');

  const isFounderUser = currentUser.username === 'jaswant_jaat' || currentUser.membershipLevel === 'Founder Board';

  const handleDirectGalleryPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        onShowToast('⚠️ Photo ka size 5MB se kam hona chahiye.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const photoUrl = reader.result;
          setCurrentUser(prev => ({ ...prev, avatar: photoUrl }));
          onShowToast('📸 Gallery se nayi profile photo safalta-purvak lag gayi hai!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleModalGalleryPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        onShowToast('⚠️ Photo ka size 5MB se kam hona chahiye.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setEditAvatar(reader.result);
          onShowToast('📸 Gallery se photo select ho gayi!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenEdit = () => {
    setEditName(currentUser.name);
    setEditUsername(currentUser.username);
    setEditBio(currentUser.bio);
    setEditLocation(currentUser.location);
    setEditAvatar(currentUser.avatar);
    setEditVerificationType(currentUser.verificationType || 'Elite');
    setEditMembershipLevel(currentUser.membershipLevel || 'Standard');
    setIsEditing(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !editUsername.trim()) {
      onShowToast('⚠️ Naam aur Username khali nahi ho sakte.');
      return;
    }
    
    setCurrentUser(prev => ({
      ...prev,
      name: editName,
      username: editUsername.replace(/\s+/g, '_').toLowerCase(),
      bio: editBio,
      location: editLocation,
      avatar: editAvatar,
      verificationType: editVerificationType as any,
      membershipLevel: editMembershipLevel as any
    }));

    setIsEditing(false);
    onShowToast('✨ Aapka profile saphaltapoorvak update ho gaya hai!');
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    if (currentUser.invitesRemaining <= 0) {
      onShowToast('⚠️ Is cycle me aapke paas koi invite credit nahi bacha hai.');
      return;
    }

    // Append to invites sent list and subtract remaining count
    const updatedInvites = [
      { email: inviteEmail, date: new Date().toISOString().split('T')[0], status: 'Pending' as const },
      ...currentUser.invitesSent
    ];

    setCurrentUser(prev => ({
      ...prev,
      invitesRemaining: prev.invitesRemaining - 1,
      invitesSent: updatedInvites
    }));

    setInviteEmail('');
    onShowToast(`🔑 Private Invitation key ${inviteEmail} par bhej di gayi hai.`);
  };

  return (
    <div id="profile-container" className="flex flex-col gap-6 max-w-3xl mx-auto pb-24 md:pb-6 select-none">
      
      {/* 1. Header Profile Cover & Details Card */}
      <div className="relative rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm">
        {/* Cover Glow Background */}
        <div className="h-32 bg-gradient-to-r from-amber-100 via-amber-50 to-orange-50 relative border-b border-slate-100">
          <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-amber-200/30 to-transparent blur-3xl"></div>
        </div>

        {/* Profile Avatar and Name Block */}
        <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row items-start sm:items-end gap-5 -mt-12">
          <div className="relative shrink-0 group">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-[3px] bg-gradient-to-tr from-amber-500 to-amber-600 shadow-md relative overflow-hidden">
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="w-full h-full rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
              <label 
                htmlFor="direct-gallery-avatar-upload"
                className="absolute inset-0 bg-slate-950/65 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white"
                title="Gallery se photo badlein"
              >
                <Camera className="w-6 h-6 text-amber-300" />
                <span className="text-[9px] font-bold font-mono text-amber-200 mt-1">Photo Badlein</span>
              </label>
              <input 
                id="direct-gallery-avatar-upload"
                type="file" 
                accept="image/*" 
                onChange={handleDirectGalleryPhotoUpload}
                className="hidden" 
              />
            </div>
            {currentUser.isVerified && (
              <span className="absolute bottom-1 right-1 bg-white rounded-full p-1 border border-amber-500/30 shadow-sm z-10">
                <ShieldCheck className="w-5 h-5 text-amber-600 fill-transparent" />
              </span>
            )}
          </div>

          <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl font-bold text-slate-900">{currentUser.name}</h2>
                <span className="px-2 py-0.5 text-[9px] font-mono tracking-wider font-bold uppercase rounded-md bg-amber-50 border border-amber-200 text-amber-900">
                  {currentUser.verificationType || 'ELITE'} SADASYA
                </span>
              </div>
              <span className="text-xs text-slate-500 font-mono mt-0.5 font-medium">@{currentUser.username}</span>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" /> {currentUser.location}
                </div>
                <button 
                  onClick={handleOpenEdit}
                  className="flex items-center gap-1.5 text-[10px] font-mono font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 px-2.5 py-1.5 rounded-xl cursor-pointer outline-none transition-all active:scale-95 self-start sm:self-auto shadow-2xs"
                >
                  <Settings className="w-3.5 h-3.5 animate-[spin_10s_linear_infinite] text-amber-600" />
                  <span>Modify Profile</span>
                </button>

                {onOpenAuthModal && (
                  <button 
                    onClick={onOpenAuthModal}
                    className="flex items-center gap-1.5 text-[10px] font-mono font-bold bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-xl cursor-pointer outline-none transition-all active:scale-95 self-start sm:self-auto shadow-2xs"
                  >
                    <LogIn className="w-3.5 h-3.5 text-amber-400" />
                    <span>Switch / Naya ID Banayein</span>
                  </button>
                )}
              </div>
            </div>

            {/* Quick stats inline summary */}
            <div className="flex items-center gap-4 border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0 shrink-0">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-900 font-mono">{currentUser.postsCount + userPosts.filter(p => p.author.username === currentUser.username).length}</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Posts</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-900 font-mono">{currentUser.followersCount}</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Sathi</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-900 font-mono">{currentUser.followingCount}</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Following</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bio row */}
        <div className="px-6 pb-6 border-t border-slate-100 pt-4">
          <p className="text-slate-700 text-xs leading-relaxed font-sans max-w-2xl">
            {currentUser.bio}
          </p>
        </div>
      </div>

      {/* Founder Master Access Banner */}
      {isFounderUser && (
        <div className="rounded-3xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900 text-white p-5 sm:p-6 shadow-xl border border-amber-400/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
              <Crown className="w-7 h-7 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-400/30 text-amber-200 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase">
                  👑 SUPREME FOUNDER PORTAL
                </span>
              </div>
              <h3 className="font-serif font-bold text-lg text-white mt-0.5">
                Jaswant Jaat (Founder) - Sabhi Members Ka Confidential Data
              </h3>
              <p className="text-xs text-amber-100/90 mt-0.5">
                Aap Jaat Samiti ke founder hain. Samast sadasyon ki details, numbers aur records dekhne ke liye Founder Console kholein.
              </p>
            </div>
          </div>

          {onNavigateToFounderConsole && (
            <button
              id="profile-open-founder-console-btn"
              onClick={onNavigateToFounderConsole}
              className="px-5 py-2.5 bg-white hover:bg-amber-50 text-slate-900 font-bold text-xs rounded-xl shadow-md transition-all active:scale-98 cursor-pointer flex items-center gap-2 whitespace-nowrap"
            >
              <span>Founder Console Kholein</span>
              <ArrowRight className="w-4 h-4 text-amber-700" />
            </button>
          )}
        </div>
      )}

      {/* 2. Photo Gallery Upload & Profile Anthem Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Dedicated Gallery Photo Section */}
        <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-serif font-bold text-slate-900">Gallery Se Profile Photo Lagayein</span>
              </div>
              <span className="text-[9px] font-mono bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200 font-bold">
                GALLERY UPLOAD
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-normal mb-3">
              Apne mobile phone ya computer ki gallery se koi bhi photo select karein. Ye turant aapki DP aur sabhi posts par lag jayegi.
            </p>
            <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100 mb-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-amber-500 shrink-0">
                <img src={currentUser.avatar} alt="Current DP" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-800">Live Profile Photo</span>
                <span className="text-[10px] text-slate-500 font-mono">Tap below to pick from gallery</span>
              </div>
            </div>
          </div>

          <div>
            <button
              onClick={() => galleryInputRef.current?.click()}
              className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>📁 Gallery Se Nayi Photo Chunein</span>
            </button>
            <input 
              ref={galleryInputRef}
              type="file" 
              accept="image/*" 
              onChange={handleDirectGalleryPhotoUpload}
              className="hidden" 
            />
          </div>
        </div>

        {/* Profile Anthem Song Card */}
        <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-rose-600" />
                <span className="text-xs font-serif font-bold text-slate-900">Profile Anthem (Aapka Gana)</span>
              </div>
              <span className="text-[9px] font-mono bg-rose-50 text-rose-800 px-2 py-0.5 rounded border border-rose-200 font-bold">
                HIGH BASS
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-normal mb-3">
              Jab bhi koi aapki profile dekhega, ye gana play hoga. Gane section se aur bhi gaane laga sakte hain.
            </p>
            <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 text-amber-800 font-bold">
                <Music className="w-5 h-5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-slate-900 truncate">
                  {currentUser.anthemSong || 'Systummm Pe Systummm (Haryanvi Bass)'}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Official Profile Track</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onToggleSong && (
              <button
                onClick={onToggleSong}
                className="flex-1 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Gana Pause Karein' : 'Gana Suney'}</span>
              </button>
            )}
            {onNavigateToMusic && (
              <button
                onClick={onNavigateToMusic}
                className="py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1"
              >
                <span>Gane Section</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>

      {/* 3. Exclusive Membership Luxury Card and Onboarding Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Metallic Amex-style Card Visualizer */}
        <div className="flex flex-col gap-3">
          <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase font-bold px-1">
            Sadasyata Card (Membership)
          </span>
          
          <div 
            id="luxury-membership-card"
            className="aspect-[1.58/1] rounded-2xl bg-gradient-to-tr from-slate-900 via-amber-950 to-slate-800 border border-amber-500/30 p-5 relative overflow-hidden flex flex-col justify-between shadow-md group select-none text-white"
          >
            {/* Glossy overlay sheen */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            
            {/* Card Background subtle emblem */}
            <div className="absolute right-4 bottom-2 w-32 h-32 opacity-20 rounded-full border-2 border-dashed border-amber-400"></div>

            {/* Top row of card */}
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <span className="font-serif text-sm font-black tracking-widest text-amber-400">JAAT SAMITI</span>
                <span className="text-[8px] font-mono text-amber-200/80 tracking-wider">SAMAJ FOUNDER BOARD</span>
              </div>
              <Crown className="w-5 h-5 text-amber-400" />
            </div>

            {/* Middle row: Gold Smart Chip representation */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-7 rounded bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-200 relative border border-amber-500/40 shadow-sm">
                <div className="absolute inset-y-0 left-1/3 w-[1px] bg-slate-900/30"></div>
                <div className="absolute inset-y-0 left-2/3 w-[1px] bg-slate-900/30"></div>
                <div className="absolute inset-x-0 top-1/2 h-[1px] bg-slate-900/30"></div>
              </div>
              <span className="text-[9px] font-mono tracking-widest text-emerald-300 font-bold bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-400/30 uppercase">
                ACTIVE NFC
              </span>
            </div>

            {/* Bottom row of card */}
            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-[9px] font-mono text-slate-300 uppercase tracking-widest">Board Sadasya</span>
                <span className="text-xs font-serif font-bold text-amber-300 tracking-wide">{currentUser.name.toUpperCase()}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-mono text-slate-300 uppercase">ID CODE</span>
                <span className="text-[10px] font-mono text-amber-100 font-bold">JC-FOUND-2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Invite Onboarding Panel */}
        <div className="flex flex-col gap-3">
          <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase font-bold px-1">
            Nyota (Invite-Only) Onboarding
          </span>

          <div className="rounded-2xl bg-white border border-slate-200 p-5 flex flex-col justify-between h-full shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-display font-bold text-slate-900">Premium Passkey Banayein</span>
                <span className="text-xs font-mono font-bold text-amber-800">{currentUser.invitesRemaining} bache hain</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-normal mb-4">
                Apne network ki shaan banaye rakhein. Kisi samaj sadasya ka email dalein aur unhe private invitation code bhejein.
              </p>
            </div>

            <form onSubmit={handleSendInvite} className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                </span>
                <input 
                  type="email" 
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="nominee@gmail.com"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl pl-9 pr-3 py-2 outline-none focus:border-amber-500 font-medium"
                />
              </div>
              <button
                type="submit"
                className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-display text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Nyota Bhejein</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* 3. Invitation Logs Tracker */}
      <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
          <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
          <h3 className="font-serif text-sm font-bold text-slate-900">Bheje Gaye Nyota (Invite) Records</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[9px] font-mono uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Invitee Email Address</th>
                <th className="py-2.5 px-3 font-semibold">Bhejne ki Date</th>
                <th className="py-2.5 px-3 text-right font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentUser.invitesSent.map((invite, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-medium text-slate-800">{invite.email}</td>
                  <td className="py-2.5 px-3 text-[11px] font-mono text-slate-500">{invite.date}</td>
                  <td className="py-2.5 px-3 text-right">
                    {invite.status === 'Joined' ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-[9px] font-bold px-2 py-0.5 rounded-full">
                        <Check className="w-2.5 h-2.5" /> JUD GAYE (JOINED)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-900 font-mono text-[9px] font-bold px-2 py-0.5 rounded-full">
                        <Clock className="w-2.5 h-2.5" /> PENDING CODE
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Instagram Tabs: Published Posts vs Saved Posts */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setProfileTab('posts')}
              className={`flex items-center gap-2 text-xs font-serif font-bold pb-1 transition-colors border-b-2 cursor-pointer ${
                profileTab === 'posts'
                  ? 'border-amber-600 text-amber-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span>Published Posts ({userPosts.filter(p => p.author.username === currentUser.username).length})</span>
            </button>

            <button
              onClick={() => setProfileTab('saved')}
              className={`flex items-center gap-2 text-xs font-serif font-bold pb-1 transition-colors border-b-2 cursor-pointer ${
                profileTab === 'saved'
                  ? 'border-amber-600 text-amber-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Saved Posts ({savedPosts.length})</span>
            </button>
          </div>
        </div>

        {profileTab === 'posts' ? (
          userPosts.filter(p => p.author.username === currentUser.username).length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500 text-xs font-mono">
              Aapne abhi tak koi post share nahi kiya hai. Home Feed par ya "+ Create Post" se banayein.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {userPosts.filter(p => p.author.username === currentUser.username).map((post) => (
                <div key={post.id} className="rounded-2xl bg-white border border-slate-200 p-4 hover:border-slate-300 transition-all shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-mono uppercase bg-amber-50 text-amber-900 border border-amber-200 font-bold px-2 py-0.5 rounded">
                      {post.category}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">{post.timestamp}</span>
                  </div>
                  <p className="text-slate-800 text-xs line-clamp-3 mb-3">{post.content}</p>
                  {post.media.length > 0 && (
                    <img 
                      src={post.media[0]} 
                      alt="Post media" 
                      className="w-full h-28 object-cover rounded-xl border border-slate-100"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>
              ))}
            </div>
          )
        ) : (
          savedPosts.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500 text-xs font-mono">
              Koi saved posts nahi hain. Feed ya Reels me bookmark icon tap karein.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {savedPosts.map((post) => (
                <div key={post.id} className="rounded-2xl bg-white border border-slate-200 p-4 hover:border-slate-300 transition-all shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900">@{post.author.username}</span>
                    <span className="text-[9px] text-slate-400 font-mono">{post.timestamp}</span>
                  </div>
                  <p className="text-slate-800 text-xs line-clamp-2 mb-3">{post.content}</p>
                  {post.media.length > 0 && (
                    <img 
                      src={post.media[0]} 
                      alt="Saved post" 
                      className="w-full h-28 object-cover rounded-xl border border-slate-100"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {/* Profile Modification Overlay Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto text-slate-900">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-600" />
                <h3 className="font-serif text-sm font-bold text-slate-900">Profile Modify Karein</h3>
              </div>
              <button 
                onClick={() => setIsEditing(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer outline-none transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
              {/* Name */}
              <div>
                <label className="block text-slate-600 text-[10px] font-mono mb-1 uppercase font-semibold">Sadasya ka Naam (Full Name)</label>
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  placeholder="e.g. Jaswant Jaat"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-500 font-medium"
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-slate-600 text-[10px] font-mono mb-1 uppercase font-semibold">Username (@)</label>
                <input 
                  type="text" 
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  required
                  placeholder="e.g. jaswant_jaat"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-500 font-medium"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-slate-600 text-[10px] font-mono mb-1 uppercase font-semibold">Aapka Parichay (Bio)</label>
                <textarea 
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={2}
                  placeholder="Apne baare me ya apne vyavsaay ke baare me likhein..."
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-500 resize-none font-sans font-medium"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-slate-600 text-[10px] font-mono mb-1 uppercase font-semibold">Sthan (Location)</label>
                <input 
                  type="text" 
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  placeholder="e.g. Rohtak, Haryana"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-500 font-medium"
                />
              </div>

              {/* Verification & Membership Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 text-[10px] font-mono mb-1 uppercase font-semibold">Sadasyata Badge (Verification)</label>
                  <select 
                    value={editVerificationType}
                    onChange={(e) => setEditVerificationType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-3 py-2.5 outline-none focus:border-amber-500 font-medium"
                  >
                    <option value="Royal">Royal Member</option>
                    <option value="Business">Business Member</option>
                    <option value="Elite">Elite Member</option>
                    <option value="Legend">Legend Member</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 text-[10px] font-mono mb-1 uppercase font-semibold">Membership Level</label>
                  <select 
                    value={editMembershipLevel}
                    onChange={(e) => setEditMembershipLevel(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-3 py-2.5 outline-none focus:border-amber-500 font-medium"
                  >
                    <option value="Founder Board">Founder Board</option>
                    <option value="Elite Patron">Elite Patron</option>
                    <option value="Gold Club">Gold Club</option>
                    <option value="Standard">Standard</option>
                  </select>
                </div>
              </div>

              {/* Gallery Photo Upload & Indian Portrait Presets Selection */}
              <div>
                <label className="block text-slate-600 text-[10px] font-mono mb-2 uppercase font-semibold">Profile Photo / Avatar Chunein</label>
                
                {/* 1. Direct Gallery Upload button */}
                <div className="flex items-center gap-3 p-3 bg-amber-50/60 rounded-xl border border-amber-200/80 mb-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-amber-500 shrink-0">
                    <img src={editAvatar} alt="Selected Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <button
                      type="button"
                      onClick={() => modalGalleryInputRef.current?.click()}
                      className="w-full py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>📁 Gallery Se Apni Photo Chunein</span>
                    </button>
                    <input 
                      ref={modalGalleryInputRef}
                      type="file" 
                      accept="image/*" 
                      onChange={handleModalGalleryPhotoUpload}
                      className="hidden" 
                    />
                    <span className="text-[10px] text-slate-500 font-mono block mt-1 text-center">
                      Phone / Computer gallery se upload karein
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-2">Ya Shahi Presets Me Se Chunein:</span>
                <div className="grid grid-cols-4 gap-3 mb-3">
                  {AVATAR_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setEditAvatar(preset.url)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        editAvatar === preset.url ? 'border-amber-600 scale-105 shadow-md shadow-amber-500/20' : 'border-slate-200 hover:border-slate-300'
                      }`}
                      title={preset.name}
                    >
                      <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                      {editAvatar === preset.url && (
                        <div className="absolute inset-0 bg-amber-600/20 flex items-center justify-center">
                          <Check className="w-4 h-4 text-amber-700 font-bold" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                
                {/* Custom URL Field */}
                <input 
                  type="text" 
                  value={editAvatar}
                  onChange={(e) => setEditAvatar(e.target.value)}
                  placeholder="Ya apni custom image URL yahan paste karein..."
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-[10px] font-mono rounded-lg px-2.5 py-1.5 outline-none focus:border-amber-500 font-medium"
                />
              </div>

              {/* Actions Footer */}
              <div className="flex gap-2 justify-end mt-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-display text-xs font-bold rounded-xl border border-slate-200 transition-all cursor-pointer outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-display text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer outline-none"
                >
                  Sudhaar Save Karein
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
