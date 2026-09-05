import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  User, 
  AtSign, 
  Lock, 
  Mail, 
  Sparkles, 
  Camera, 
  Eye, 
  EyeOff, 
  Check, 
  ShieldCheck, 
  MapPin, 
  UserPlus, 
  LogIn, 
  Users 
} from 'lucide-react';
import { RegisteredAccount, User as UserType } from '../types';
import siteLogo from '../assets/images/site_logo.jpg';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: RegisteredAccount[];
  currentUser: UserType;
  onLogin?: (account: RegisteredAccount) => void;
  onSelectAccount?: (account: RegisteredAccount) => void;
  onRegister?: (newAccount: RegisteredAccount) => void;
  onRegisterAccount?: (accountData: {
    name: string;
    username: string;
    avatar: string;
    bio: string;
    location: string;
    verificationType: 'Elite' | 'Business' | 'Royal' | 'Youth' | 'Legend';
  }) => void;
  onShowToast: (message: string) => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  accounts,
  currentUser,
  onLogin,
  onSelectAccount,
  onRegister,
  onRegisterAccount,
  onShowToast
}: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'switch'>('login');

  const executeLogin = (account: RegisteredAccount) => {
    if (onLogin) onLogin(account);
    if (onSelectAccount) onSelectAccount(account);
  };

  const executeRegister = (newAccount: RegisteredAccount) => {
    if (onRegister) {
      onRegister(newAccount);
    } else if (onRegisterAccount) {
      onRegisterAccount({
        name: newAccount.name,
        username: newAccount.username,
        avatar: newAccount.avatar,
        bio: newAccount.bio,
        location: newAccount.location,
        verificationType: newAccount.verificationType as any || 'Elite'
      });
    }
  };

  // Sign up fields
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('New Delhi, India');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedAvatarPreset, setSelectedAvatarPreset] = useState<string>(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80'
  );
  const [customAvatarPreview, setCustomAvatarPreview] = useState<string | null>(null);

  // Login fields
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Preset avatar choices
  const avatarPresets = [
    { label: 'Devil Car (Logo)', url: siteLogo },
    { label: 'Royal Fighter', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&h=400&q=80' },
    { label: 'Elite Leader', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=400&q=80' },
    { label: 'Executive', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80' },
    { label: 'Scientist', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=400&q=80' },
  ];

  const handleCustomAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Clean and validate handle
  const cleanUsername = username.toLowerCase().replace(/[^a-z0-9_]/g, '');
  const isUsernameTaken = accounts.some(
    (acc) => acc.username.toLowerCase() === cleanUsername && acc.id !== currentUser.id
  );

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !cleanUsername) {
      onShowToast('❌ Kripya apna poora naam aur username bharein.');
      return;
    }

    if (isUsernameTaken) {
      onShowToast('⚠️ Ye username pehle se kisi aur ka hai. Dusra chunien.');
      return;
    }

    const newAccount: RegisteredAccount = {
      id: `user_${Date.now()}`,
      name: fullName.trim(),
      username: cleanUsername,
      email: email.trim() || `${cleanUsername}@jaatsamiti.com`,
      password: password || '123456',
      avatar: customAvatarPreview || selectedAvatarPreset,
      bio: bio.trim() || 'Jaat Samiti member | Building brotherhood & success 👑',
      location: location || 'India',
      isVerified: true,
      verificationType: 'Elite',
      membershipLevel: 'Standard',
      followersCount: 1,
      followingCount: 3,
      invitesRemaining: 5,
      invitesSent: [],
      postsCount: 0,
      savedPostIds: []
    };

    executeRegister(newAccount);
    onShowToast(`🎉 Welcome @${newAccount.username}! Aapka naya ID ban gaya.`);
    onClose();
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim()) {
      onShowToast('❌ Kripya username ya email enter karein.');
      return;
    }

    const normalized = loginIdentifier.toLowerCase().replace('@', '').trim();
    const found = accounts.find(
      (acc) =>
        acc.username.toLowerCase() === normalized ||
        acc.email?.toLowerCase() === normalized
    );

    if (found) {
      executeLogin(found);
      onShowToast(`✅ Logged in as @${found.username}!`);
      onClose();
    } else {
      // Create guest instant login if not found to provide super smooth experience
      const guestAccount: RegisteredAccount = {
        id: `user_${Date.now()}`,
        name: loginIdentifier.split('@')[0],
        username: normalized,
        email: `${normalized}@jaatsamiti.com`,
        password: loginPassword || '123456',
        avatar: siteLogo,
        bio: 'Jaat Samiti verified member 👑',
        location: 'Haryana, India',
        isVerified: true,
        verificationType: 'Elite',
        membershipLevel: 'Standard',
        followersCount: 120,
        followingCount: 45,
        invitesRemaining: 5,
        invitesSent: [],
        postsCount: 1,
        savedPostIds: []
      };
      executeRegister(guestAccount);
      executeLogin(guestAccount);
      onShowToast(`🚀 Instant ID created & logged in as @${guestAccount.username}!`);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            id="instagram-auth-modal"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[92vh]"
          >
            {/* Header with Site Brand & Close Button */}
            <div className="relative p-5 pb-3 border-b border-slate-100 flex items-center justify-between bg-gradient-to-b from-slate-50 to-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-rose-500 to-amber-700 shadow-sm shrink-0">
                  <img
                    src={siteLogo}
                    alt="Logo"
                    className="w-full h-full object-cover rounded-full"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-slate-900 text-base leading-tight">
                    Jaat Samiti
                  </h3>
                  <p className="text-[11px] text-amber-700 font-mono">
                    Jaswant Jaat, Nihal Jaat & Nitesh Jaat
                  </p>
                </div>
              </div>

              <button
                id="close-auth-modal-btn"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tab Switcher: Log In | Create New ID | Switch Account */}
            <div className="flex border-b border-slate-200 bg-slate-50/70 p-1.5 gap-1 text-xs">
              <button
                id="tab-login-btn"
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-2 rounded-xl font-medium transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'login'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>

              <button
                id="tab-signup-btn"
                onClick={() => setActiveTab('signup')}
                className={`flex-1 py-2 rounded-xl font-medium transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'signup'
                    ? 'bg-white text-rose-600 shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>ID Banayein</span>
              </button>

              <button
                id="tab-switch-btn"
                onClick={() => setActiveTab('switch')}
                className={`flex-1 py-2 rounded-xl font-medium transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'switch'
                    ? 'bg-white text-amber-700 shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Switch ({accounts.length})</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto flex-1">
              {/* 1. SIGN UP / CREATE OWN ID TAB */}
              {activeTab === 'signup' && (
                <form onSubmit={handleSignUpSubmit} className="flex flex-col gap-4">
                  <div className="text-center pb-2">
                    <span className="text-[10px] font-mono tracking-widest text-amber-800 uppercase bg-amber-50 px-2.5 py-1 rounded-full font-bold border border-amber-200">
                      Instagram-Style Instant Registration
                    </span>
                    <h4 className="font-serif font-bold text-slate-900 text-lg mt-1.5">
                      Apna Naya ID Banayein
                    </h4>
                    <p className="text-xs text-slate-500">
                      Community me photo, reels, aur connection banane ke liye apni profile register karein.
                    </p>
                  </div>

                  {/* Profile Picture Upload & Presets */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative group">
                      <div className="w-20 h-20 rounded-full p-[3px] bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 shadow-md">
                        <img
                          src={customAvatarPreview || selectedAvatarPreset}
                          alt="Avatar preview"
                          className="w-full h-full object-cover rounded-full bg-slate-100"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <label
                        htmlFor="avatar-file-upload"
                        className="absolute bottom-0 right-0 p-1.5 bg-slate-900 text-white rounded-full shadow cursor-pointer hover:bg-slate-800 border-2 border-white transition-transform active:scale-90"
                        title="Upload Photo"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <input
                          id="avatar-file-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleCustomAvatarUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Quick Avatar Presets */}
                    <div className="flex items-center gap-2 mt-1 overflow-x-auto py-1 max-w-full">
                      {avatarPresets.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setSelectedAvatarPreset(preset.url);
                            setCustomAvatarPreview(null);
                          }}
                          className={`relative w-8 h-8 rounded-full overflow-hidden border-2 transition-transform ${
                            selectedAvatarPreset === preset.url && !customAvatarPreview
                              ? 'border-amber-600 scale-110 shadow-xs'
                              : 'border-slate-200 opacity-70 hover:opacity-100'
                          }`}
                          title={preset.label}
                        >
                          <img
                            src={preset.url}
                            alt={preset.label}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Full Name Input */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-semibold text-slate-700">Poora Naam (Full Name)</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        id="signup-name-input"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Udaaharan: Rohan Jaat"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-rose-500 focus:bg-white transition-all text-slate-900 font-medium"
                      />
                    </div>
                  </div>

                  {/* Username (@handle) */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-semibold text-slate-700">Unique Username (@handle)</label>
                      {cleanUsername && (
                        <span className={`text-[10px] font-mono ${isUsernameTaken ? 'text-rose-600' : 'text-emerald-600 font-semibold'}`}>
                          {isUsernameTaken ? 'Already taken ✗' : 'Available ✓'}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <AtSign className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        id="signup-username-input"
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="rohan_jaat"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-rose-500 focus:bg-white transition-all text-slate-900 font-mono"
                      />
                    </div>
                  </div>

                  {/* Email & Password */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-semibold text-slate-700">Email ya Mobile</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          id="signup-email-input"
                          type="text"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="rohan@gmail.com"
                          className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-rose-500 focus:bg-white transition-all text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-semibold text-slate-700">Password</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          id="signup-password-input"
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-rose-500 focus:bg-white transition-all text-slate-900"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Bio & Location */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-semibold text-slate-700">Bio (Status / Pehchan)</label>
                    <input
                      id="signup-bio-input"
                      type="text"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="BMW Enthusiast | Real Estate & Farming 🚜"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-rose-500 focus:bg-white transition-all text-slate-900"
                    />
                  </div>

                  <button
                    id="submit-signup-btn"
                    type="submit"
                    className="w-full mt-2 py-3 bg-gradient-to-r from-amber-600 via-rose-600 to-amber-700 hover:from-amber-700 hover:to-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>ID Banayein & Sign Up</span>
                  </button>
                </form>
              )}

              {/* 2. LOG IN TAB */}
              {activeTab === 'login' && (
                <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
                  <div className="text-center pb-2">
                    <h4 className="font-serif font-bold text-slate-900 text-lg">
                      Apne ID me Login Karein
                    </h4>
                    <p className="text-xs text-slate-500">
                      Apna registered username ya email enter karein.
                    </p>
                  </div>

                  {/* Username Input */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-semibold text-slate-700">Username ya Email</label>
                    <div className="relative">
                      <AtSign className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        id="login-username-input"
                        type="text"
                        required
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        placeholder="jaswant_jaat ya rohan@gmail.com"
                        className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-500 focus:bg-white transition-all text-slate-900 font-medium"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-semibold text-slate-700">Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        id="login-password-input"
                        type={showPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-8 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-500 focus:bg-white transition-all text-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    id="submit-login-btn"
                    type="submit"
                    className="w-full mt-2 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Log In Karein</span>
                  </button>

                  <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                    <p className="text-xs text-slate-500">
                      Naye hain?{' '}
                      <button
                        type="button"
                        onClick={() => setActiveTab('signup')}
                        className="font-semibold text-amber-700 hover:underline"
                      >
                        Apna ID Banayein (Sign up)
                      </button>
                    </p>
                  </div>
                </form>
              )}

              {/* 3. SWITCH ACCOUNT TAB */}
              {activeTab === 'switch' && (
                <div className="flex flex-col gap-3">
                  <div className="text-center pb-2">
                    <h4 className="font-serif font-bold text-slate-900 text-base">
                      Saved Accounts & Switch
                    </h4>
                    <p className="text-xs text-slate-500">
                      Kisi bhi member profile me 1-click me switch karein:
                    </p>
                  </div>

                  <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                    {accounts.map((acc) => {
                      const isCurrent = acc.id === currentUser.id;
                      return (
                        <div
                          key={acc.id}
                          onClick={() => {
                            executeLogin(acc);
                            onShowToast(`Switched to @${acc.username}`);
                            onClose();
                          }}
                          className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                            isCurrent
                              ? 'bg-amber-50/70 border border-amber-200'
                              : 'hover:bg-slate-50 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={acc.avatar}
                              alt={acc.name}
                              className="w-10 h-10 rounded-full object-cover border border-slate-200"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-slate-900">{acc.name}</span>
                                {acc.isVerified && (
                                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                                )}
                              </div>
                              <span className="text-[11px] text-slate-500 font-mono">
                                @{acc.username}
                              </span>
                            </div>
                          </div>

                          {isCurrent ? (
                            <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-200/60 text-amber-900 rounded-full">
                              Active
                            </span>
                          ) : (
                            <button className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-amber-800 bg-slate-100 hover:bg-amber-50 rounded-lg transition-colors">
                              Login
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setActiveTab('signup')}
                    className="w-full mt-2 py-2.5 border border-dashed border-slate-300 hover:border-amber-500 rounded-xl text-xs font-medium text-slate-600 hover:text-amber-700 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>+ Kisi Aur Ka Naya ID Banayein</span>
                  </button>
                </div>
              )}
            </div>

            {/* Quick Demo Switch bar */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
              <span>Quick Demo IDs:</span>
              <div className="flex gap-1.5">
                {accounts.slice(0, 3).map((a) => (
                  <button
                    key={a.id}
                    onClick={() => {
                      onLogin(a);
                      onShowToast(`Switched to @${a.username}`);
                      onClose();
                    }}
                    className="px-2 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px] hover:border-amber-400 hover:text-amber-800"
                  >
                    @{a.username.split('_')[0]}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
