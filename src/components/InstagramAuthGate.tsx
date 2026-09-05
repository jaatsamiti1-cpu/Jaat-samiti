import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  AtSign, 
  Mail, 
  Phone, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Crown, 
  Camera, 
  Upload, 
  ArrowRight,
  CheckCircle2,
  Users
} from 'lucide-react';
import siteLogo from '../assets/images/site_logo.jpg';
import { RegisteredAccount } from '../types';

interface InstagramAuthGateProps {
  accounts: RegisteredAccount[];
  onLogin: (account: RegisteredAccount) => void;
  onSignUp: (newAccountData: any) => void;
  onGuestAccess: () => void;
  onShowToast: (msg: string) => void;
}

export default function InstagramAuthGate({
  accounts,
  onLogin,
  onSignUp,
  onGuestAccess,
  onShowToast
}: InstagramAuthGateProps) {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // Login form state
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);

  // Signup form state
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showSignupPass, setShowSignupPass] = useState(false);
  const [bio, setBio] = useState('Proud member of Jaat Samiti | Royal & Traditional Roots 🚩');
  const [location, setLocation] = useState('Haryana, India');
  const [avatarPreview, setAvatarPreview] = useState<string>(siteLogo);
  const [verificationType, setVerificationType] = useState<'Royal' | 'Business' | 'Elite' | 'Legend'>('Royal');

  // Find Jaswant Jaat Founder account
  const founderAccount = accounts.find(acc => acc.username === 'jaswant_jaat') || accounts[0];

  const handleGalleryPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        onShowToast('⚠️ Photo ka size 5MB se kam hona chahiye.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatarPreview(reader.result);
          onShowToast('📸 Gallery se photo select ho gayi!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = loginId.trim().toLowerCase().replace('@', '');
    
    if (!cleanId) {
      onShowToast('⚠️ Username, email ya phone bharna zaroori hai.');
      return;
    }

    const matched = accounts.find(
      acc => acc.username.toLowerCase() === cleanId || 
             (acc.email && acc.email.toLowerCase() === cleanId) ||
             (acc.phone && acc.phone.replace(/[^0-9]/g, '') === cleanId.replace(/[^0-9]/g, ''))
    );

    if (matched) {
      onLogin(matched);
      onShowToast(`👑 Swagat hai ${matched.name}! Jaat Samiti me login ho gaya.`);
    } else {
      // Create user session dynamically
      const fallbackAccount: RegisteredAccount = {
        id: `user_${Date.now()}`,
        name: cleanId.charAt(0).toUpperCase() + cleanId.slice(1),
        username: cleanId,
        email: `${cleanId}@jaatsamiti.com`,
        phone: '+91 98000-12345',
        avatar: siteLogo,
        isVerified: true,
        verificationType: 'Royal',
        membershipLevel: 'Standard',
        bio: 'Jaat Samiti Official Verified Member 🚩',
        location: 'Haryana, India',
        followersCount: 1,
        followingCount: 3,
        invitesRemaining: 5,
        invitesSent: [],
        postsCount: 0,
        joinedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: 'Active'
      };
      onLogin(fallbackAccount);
      onShowToast(`✨ Welcome @${cleanId}! Login successful.`);
    }
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !username.trim()) {
      onShowToast('⚠️ Poora Naam aur Username zaroori hain.');
      return;
    }

    const cleanUser = username.trim().toLowerCase().replace(/[^a-zA-Z0-9_]/g, '_');

    const newAcc: RegisteredAccount = {
      id: `user_${Date.now()}`,
      name: fullName.trim(),
      username: cleanUser,
      email: email.trim() || `${cleanUser}@jaatsamiti.com`,
      phone: phone.trim() || '+91 98120-00000',
      password: password || 'password123',
      avatar: avatarPreview,
      isVerified: true,
      verificationType: verificationType,
      membershipLevel: 'Standard',
      bio: bio.trim(),
      location: location.trim(),
      followersCount: 1,
      followingCount: 4,
      invitesRemaining: 5,
      invitesSent: [],
      postsCount: 0,
      joinedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Active'
    };

    onSignUp(newAcc);
    onShowToast(`🎉 Mubarak! Aapki Jaat Samiti ID @${cleanUser} ban gayi hai!`);
  };

  return (
    <div id="instagram-login-gate" className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center justify-center">
        
        {/* Left Side: Realistic Smartphone Frame with Live Jaat Samiti Mockup (Desktop only) */}
        <div className="hidden lg:flex lg:col-span-6 justify-center items-center relative">
          <div className="relative w-[340px] h-[640px] bg-slate-900 rounded-[50px] p-3 shadow-2xl border-4 border-slate-800 shadow-amber-900/10">
            {/* Phone Speaker & Camera Notch */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-800 rounded-full z-20 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-slate-950 mr-2 border border-slate-700"></div>
              <div className="w-10 h-1 bg-slate-700 rounded-full"></div>
            </div>

            {/* Phone Screen Canvas */}
            <div className="w-full h-full bg-slate-950 rounded-[40px] overflow-hidden flex flex-col relative text-white border border-slate-800/80">
              {/* Screen Top Header */}
              <div className="pt-8 px-5 pb-3 flex items-center justify-between border-b border-slate-800/60 bg-slate-900/80">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-amber-500/50">
                    <img src={siteLogo} alt="Logo" className="w-full h-full object-cover" />
                  </div>
                  <span className="font-serif font-bold text-sm tracking-wide text-amber-200">Jaat Samiti</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  LIVE FEED
                </div>
              </div>

              {/* Mockup Feed Stream */}
              <div className="flex-1 overflow-hidden p-3 flex flex-col gap-3 relative">
                {/* Story circles preview */}
                <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800/50">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 via-rose-500 to-amber-700">
                      <img src={siteLogo} alt="Founder" className="w-full h-full rounded-full object-cover" />
                    </div>
                    <span className="text-[9px] text-amber-300 font-mono">Jaswant</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 via-rose-500 to-amber-700">
                      <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80" alt="Nihal" className="w-full h-full rounded-full object-cover" />
                    </div>
                    <span className="text-[9px] text-slate-300 font-mono">Nihal</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 via-rose-500 to-amber-700">
                      <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80" alt="Nitesh" className="w-full h-full rounded-full object-cover" />
                    </div>
                    <span className="text-[9px] text-slate-300 font-mono">Nitesh</span>
                  </div>
                </div>

                {/* Hero Post Preview */}
                <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-lg">
                  <div className="p-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full overflow-hidden border border-amber-500">
                        <img src="https://images.unsplash.com/photo-1624561172888-ac93c696e10c?auto=format&fit=crop&w=100&q=80" alt="Founder" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs font-semibold text-white">jaswant_jaat</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                    </div>
                    <span className="text-[9px] text-amber-400 font-mono">👑 FOUNDER</span>
                  </div>
                  <div className="h-44 w-full overflow-hidden relative">
                    <img 
                      src={siteLogo} 
                      alt="Jaat Samiti BMW Emblem" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-amber-300 font-mono">
                      🚜 Systummm Pe Systummm 🚩
                    </div>
                  </div>
                  <div className="p-2 text-[11px] text-slate-300">
                    <p className="line-clamp-2">Jaat Samiti ke sabhi bhaiyo aur behno ka hardik swagat hai. Apna photo aur gane lagayein! 🔥</p>
                  </div>
                </div>

                {/* Ambient glow badge */}
                <div className="bg-gradient-to-r from-amber-600/20 to-rose-600/20 border border-amber-500/30 p-2.5 rounded-xl text-center">
                  <span className="text-[10px] font-mono text-amber-300 font-semibold tracking-wide">
                    👑 FOUNDER BOARD: JASWANT JAAT
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Instagram Auth Card */}
        <div className="lg:col-span-6 flex flex-col gap-3 max-w-md mx-auto w-full">
          
          {/* Main Card */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50">
            
            {/* Top Brand Header */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="relative mb-3">
                <div className="w-16 h-16 rounded-full p-[2.5px] bg-gradient-to-tr from-amber-500 via-rose-500 to-amber-700 shadow-md">
                  <img
                    src={siteLogo}
                    alt="Jaat Samiti Official Logo"
                    className="w-full h-full object-cover rounded-full"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="absolute -bottom-1 -right-1 bg-amber-600 text-white rounded-full p-0.5 border border-white">
                  <Crown className="w-3.5 h-3.5" />
                </span>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Jaat Samiti
              </h1>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Jaswant Jaat (Founder), Nihal Jaat & Nitesh Jaat
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl mb-5 text-xs font-semibold">
              <button
                id="gate-login-tab"
                type="button"
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                  authMode === 'login'
                    ? 'bg-white text-slate-900 shadow-sm font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Log In Karein
              </button>
              <button
                id="gate-signup-tab"
                type="button"
                onClick={() => setAuthMode('signup')}
                className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                  authMode === 'signup'
                    ? 'bg-white text-rose-600 shadow-sm font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Naya ID Banayein (Sign Up)
              </button>
            </div>

            {/* 1. LOGIN MODE */}
            {authMode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="flex flex-col gap-3.5">
                
                {/* Quick 1-Click Founder Login Button */}
                {founderAccount && (
                  <button
                    id="founder-quick-login-btn"
                    type="button"
                    onClick={() => {
                      onLogin(founderAccount);
                      onShowToast('👑 Swagat hai Jaswant Jaat ji! Founder Admin Console unlocked.');
                    }}
                    className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-bold text-xs shadow-md transition-all active:scale-98 flex items-center justify-between cursor-pointer border border-amber-400"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full overflow-hidden border border-white shrink-0">
                        <img src={founderAccount.avatar} alt="Founder" className="w-full h-full object-cover" />
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-white text-xs">Jaswant Jaat (Founder)</span>
                          <Crown className="w-3.5 h-3.5 text-amber-200" />
                        </div>
                        <span className="text-[10px] text-amber-100 font-mono">1-Click Founder Login</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>
                )}

                <div className="flex items-center gap-2 my-1">
                  <div className="h-[1px] bg-slate-200 flex-1"></div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">YA APNI ID SE</span>
                  <div className="h-[1px] bg-slate-200 flex-1"></div>
                </div>

                {/* Username / Email / Phone */}
                <div className="relative">
                  <AtSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    id="gate-login-input"
                    type="text"
                    required
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    placeholder="Phone number, username, ya email"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-amber-500 focus:bg-white transition-all font-medium"
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    id="gate-password-input"
                    type={showLoginPass ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Password (password123)"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-amber-500 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPass(!showLoginPass)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showLoginPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Submit Login */}
                <button
                  id="gate-submit-login-btn"
                  type="submit"
                  className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-98 cursor-pointer mt-1"
                >
                  Log In Karein
                </button>

                {/* Fast Switcher for Other Community Accounts */}
                <div className="mt-2 pt-3 border-t border-slate-100">
                  <span className="text-[10px] text-slate-500 font-mono block mb-2 text-center">
                    Community Members me se chunein:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {accounts.filter(a => a.username !== 'jaswant_jaat').slice(0, 2).map((acc) => (
                      <button
                        key={acc.id || acc.username}
                        type="button"
                        onClick={() => {
                          onLogin(acc);
                          onShowToast(`👋 Logged in as ${acc.name}`);
                        }}
                        className="p-1.5 rounded-lg border border-slate-200 hover:border-amber-400 bg-slate-50 hover:bg-amber-50/50 flex items-center gap-2 text-left cursor-pointer transition-colors"
                      >
                        <img src={acc.avatar} alt={acc.name} className="w-6 h-6 rounded-full object-cover shrink-0" />
                        <span className="text-[11px] font-semibold text-slate-800 truncate">{acc.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </form>
            )}

            {/* 2. SIGN UP MODE WITH GALLERY PHOTO PICKER */}
            {authMode === 'signup' && (
              <form onSubmit={handleSignUpSubmit} className="flex flex-col gap-3">
                
                {/* Gallery Photo Upload Section */}
                <div className="flex flex-col items-center gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <div className="relative group">
                    <div className="w-20 h-20 rounded-full p-[3px] bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 shadow-md">
                      <img
                        src={avatarPreview}
                        alt="Avatar preview"
                        className="w-full h-full object-cover rounded-full bg-white"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <label
                      htmlFor="gate-gallery-photo-input"
                      className="absolute bottom-0 right-0 p-2 bg-amber-600 hover:bg-amber-700 text-white rounded-full shadow-md cursor-pointer border-2 border-white transition-transform active:scale-95"
                      title="Gallery Se Photo Chunein"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </label>
                    <input
                      id="gate-gallery-photo-input"
                      type="file"
                      accept="image/*"
                      onChange={handleGalleryPhotoUpload}
                      className="hidden"
                    />
                  </div>

                  <label
                    htmlFor="gate-gallery-photo-input"
                    className="flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 cursor-pointer py-1 px-3 bg-amber-50 rounded-full border border-amber-200"
                  >
                    <Upload className="w-3 h-3" />
                    <span>📁 Gallery Se Apni Photo Chunein</span>
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono">Apne phone ya computer ki gallery se upload karein</span>
                </div>

                {/* Full Name */}
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    id="gate-signup-name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Aapka Poora Naam (Full Name)"
                    className="w-full pl-10 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-rose-500 focus:bg-white font-medium"
                  />
                </div>

                {/* Username */}
                <div className="relative">
                  <AtSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    id="gate-signup-username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username (e.g. rohan_jaat)"
                    className="w-full pl-10 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-rose-500 focus:bg-white font-mono"
                  />
                </div>

                {/* Phone & Email */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      id="gate-signup-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Mobile Number"
                      className="w-full pl-8 pr-2 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-rose-500 focus:bg-white font-mono"
                    />
                  </div>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      id="gate-signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address"
                      className="w-full pl-8 pr-2 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-rose-500 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    id="gate-signup-pass"
                    type={showSignupPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password banayein"
                    className="w-full pl-10 pr-10 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-rose-500 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPass(!showSignupPass)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showSignupPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Location & Badge */}
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Gaon / Zila (Location)"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-rose-500 focus:bg-white"
                  />
                  <select
                    value={verificationType}
                    onChange={(e) => setVerificationType(e.target.value as any)}
                    className="w-full px-2 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-rose-500 focus:bg-white font-medium"
                  >
                    <option value="Royal">Royal Badge 🚩</option>
                    <option value="Legend">Legend Badge 👑</option>
                    <option value="Elite">Elite Badge ✨</option>
                    <option value="Business">Business Badge 💼</option>
                  </select>
                </div>

                <button
                  id="gate-submit-signup-btn"
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-rose-600 via-amber-600 to-amber-700 hover:from-rose-700 hover:to-amber-800 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-98 cursor-pointer mt-1"
                >
                  ID Banayein & Sign Up Karein
                </button>
              </form>
            )}

          </div>

          {/* Bottom Card: Toggle Mode & Guest Access */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 text-center shadow-sm flex flex-col gap-2">
            <p className="text-xs text-slate-600">
              {authMode === 'login' ? (
                <>
                  Khata nahi hai?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('signup')}
                    className="font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
                  >
                    Naya ID Banayein (Sign up)
                  </button>
                </>
              ) : (
                <>
                  Pehle se ID hai?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className="font-bold text-amber-700 hover:text-amber-800 cursor-pointer"
                  >
                    Log In Karein
                  </button>
                </>
              )}
            </p>

            <button
              id="gate-guest-access-btn"
              type="button"
              onClick={onGuestAccess}
              className="text-[11px] font-mono text-slate-500 hover:text-slate-800 underline transition-colors cursor-pointer py-1"
            >
              Mehman ke roop me dekhein (Explore as Guest)
            </button>
          </div>

          {/* Footer note */}
          <div className="text-center text-[10px] text-slate-400 font-mono">
            © 2026 JAAT SAMITI • FOUNDER: JASWANT JAAT • ROHTAK, DELHI & GLOBAL
          </div>

        </div>

      </div>
    </div>
  );
}
