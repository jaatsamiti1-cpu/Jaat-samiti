import React, { useState } from 'react';
import { 
  Briefcase, 
  Search, 
  MapPin, 
  Star, 
  Globe, 
  Mail, 
  ShieldCheck, 
  PlusCircle, 
  Users, 
  Calendar,
  Building2,
  X,
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { Business } from '../types';

interface DirectorySectionProps {
  businesses: Business[];
  setBusinesses: React.Dispatch<React.SetStateAction<Business[]>>;
  onShowToast: (message: string) => void;
  onConnectOwner: (ownerName: string, bizName: string) => void;
  followedUsernames: string[];
  onToggleFollow: (username: string, authorName: string) => void;
  currentUser?: any;
}

export default function DirectorySection({ 
  businesses, 
  setBusinesses, 
  onShowToast,
  onConnectOwner,
  followedUsernames = [],
  onToggleFollow,
  currentUser
}: DirectorySectionProps) {
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isRegistering, setIsRegistering] = useState(false);

  // New Business Form State
  const [newBizName, setNewBizName] = useState('');
  const [newBizCat, setNewBizCat] = useState<Business['category']>('Technology');
  const [newBizDesc, setNewBizDesc] = useState('');
  const [newBizLoc, setNewBizLoc] = useState('');
  const [newBizEmail, setNewBizEmail] = useState('');
  const [newBizWeb, setNewBizWeb] = useState('');

  const categories = [
    'All',
    'Technology',
    'Real Estate',
    'Legal & Consulting',
    'Agriculture Tech',
    'Sports Mentorship',
    'Logistics & Infrastructure',
    'Finance'
  ];

  const categoryDisplayLabels: { [key: string]: string } = {
    'All': 'Sab Ventures',
    'Technology': 'IT & Tech',
    'Real Estate': 'Zameen & Realty',
    'Legal & Consulting': 'Kanoon & Sallah',
    'Agriculture Tech': 'Kisaani Tech',
    'Sports Mentorship': 'Akhada & Sports',
    'Logistics & Infrastructure': 'Gaddi & Logistics',
    'Finance': 'Paisa & Capital'
  };

  const handleRegisterBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBizName.trim() || !newBizDesc.trim() || !newBizLoc.trim()) {
      onShowToast('⚠️ Sabhi fields bharna zaroori hai.');
      return;
    }

    const newBusiness: Business = {
      id: `biz_${Date.now()}`,
      name: newBizName,
      ownerName: 'Jaswant Jaat (You)',
      ownerAvatar: 'https://images.unsplash.com/photo-1624561172888-ac93c696e10c?auto=format&fit=crop&w=150&h=150&q=80',
      isOwnerVerified: true,
      category: newBizCat,
      description: newBizDesc,
      location: newBizLoc,
      rating: 5.0,
      contactEmail: newBizEmail || 'jaswant@yourbiz.com',
      website: newBizWeb || 'https://yourbiz.com',
      logoUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=300&h=300&q=80',
      isFeatured: false,
      networkSize: 1,
      foundedYear: 2026
    };

    setBusinesses([newBusiness, ...businesses]);
    setIsRegistering(false);
    
    // Reset Form Fields
    setNewBizName('');
    setNewBizDesc('');
    setNewBizLoc('');
    setNewBizEmail('');
    setNewBizWeb('');

    onShowToast('🏢 Business registered successfully! Admin jald review karenge.');
  };

  const filteredBusinesses = businesses.filter(biz => {
    const matchesSearch = biz.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          biz.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          biz.ownerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedCategory === 'All') return matchesSearch;
    return matchesSearch && biz.category === selectedCategory;
  });

  return (
    <div id="directory-container" className="flex flex-col gap-6 max-w-4xl mx-auto pb-24 md:pb-6 select-none">
      
      {/* Directory Banner Header */}
      <div className="rounded-2xl bg-white border border-slate-200 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex flex-col">
          <span className="text-[10px] font-mono tracking-widest text-amber-800 font-bold uppercase mb-1">
            Elite Yellow Pages
          </span>
          <h2 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
            Jaat Professional Directory <Building2 className="w-5 h-5 text-amber-600" />
          </h2>
          <p className="text-xs text-slate-600">Aapsi bhaichara, business partnerships aur naye startups ko badhava dein.</p>
        </div>
        
        <button
          id="open-register-biz-modal"
          onClick={() => setIsRegistering(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-display text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95 shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Apna Business Add Karein</span>
        </button>
      </div>

      {/* Register Business Dialog/Drawer Modal */}
      {isRegistering && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div 
            id="register-business-form"
            className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto text-slate-900"
          >
            <button 
              onClick={() => setIsRegistering(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 outline-none cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-amber-600" />
              <h3 className="font-serif text-lg font-bold text-slate-900">Apna Premium Business Register Karein</h3>
            </div>

            <form onSubmit={handleRegisterBusiness} className="space-y-4">
              <div>
                <label className="block text-slate-600 text-xs font-mono mb-1 uppercase font-semibold">Business Ka Naam *</label>
                <input 
                  type="text" 
                  required
                  value={newBizName}
                  onChange={(e) => setNewBizName(e.target.value)}
                  placeholder="e.g. Lohagarh FarmTech"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-3 py-2 outline-none focus:border-amber-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 text-xs font-mono mb-1 uppercase font-semibold">Category Chunein *</label>
                  <select 
                    value={newBizCat}
                    onChange={(e) => setNewBizCat(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-3 py-2 outline-none focus:border-amber-500 font-medium"
                  >
                    {categories.filter(c => c !== 'All').map(cat => (
                      <option key={cat} value={cat}>{categoryDisplayLabels[cat] || cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 text-xs font-mono mb-1 uppercase font-semibold">Headquarters Location *</label>
                  <input 
                    type="text" 
                    required
                    value={newBizLoc}
                    onChange={(e) => setNewBizLoc(e.target.value)}
                    placeholder="e.g. Rohtak, Haryana"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-3 py-2 outline-none focus:border-amber-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 text-xs font-mono mb-1 uppercase font-semibold">Business Description aur Mission *</label>
                <textarea 
                  required
                  rows={3}
                  value={newBizDesc}
                  onChange={(e) => setNewBizDesc(e.target.value)}
                  placeholder="Aapka business kya karta hai, samaj ko isse kya help milti hai, aur core values..."
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-3 py-2 outline-none focus:border-amber-500 resize-none font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 text-xs font-mono mb-1 uppercase font-semibold">Email ID</label>
                  <input 
                    type="email" 
                    value={newBizEmail}
                    onChange={(e) => setNewBizEmail(e.target.value)}
                    placeholder="founder@farmtech.com"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-3 py-2 outline-none focus:border-amber-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 text-xs font-mono mb-1 uppercase font-semibold">Website Link</label>
                  <input 
                    type="text" 
                    value={newBizWeb}
                    onChange={(e) => setNewBizWeb(e.target.value)}
                    placeholder="https://farmtech.com"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-3 py-2 outline-none focus:border-amber-500 font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-display text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
              >
                Submit Karein (Review ke liye)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Explorer Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-slate-400" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Business, owner ya services ka naam search karein..."
            className="w-full bg-white text-slate-900 placeholder-slate-400 text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-amber-500 font-medium shadow-2xs"
          />
        </div>

        {/* Categories Carousel */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 md:pb-0 shrink-0 max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-display whitespace-nowrap border transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-600 border-amber-600 text-white font-bold'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 font-medium'
              }`}
            >
              {categoryDisplayLabels[cat] || cat}
            </button>
          ))}
        </div>
      </div>

      {/* Businesses Grid Display */}
      <div id="directory-listings" className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredBusinesses.length === 0 ? (
          <div className="col-span-full rounded-2xl bg-white border border-slate-200 p-10 text-center shadow-xs">
            <Briefcase className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-500 text-xs font-mono">Is category me koi business nahi mila.</p>
          </div>
        ) : (
          filteredBusinesses.map((biz) => (
            <div 
              key={biz.id}
              id={`biz-card-${biz.id}`}
              className="group rounded-2xl bg-white border border-slate-200 hover:border-slate-300 p-5 flex flex-col justify-between gap-4 transition-all duration-200 shadow-sm hover:shadow-md hover:translate-y-[-2px]"
            >
              <div className="flex flex-col gap-3">
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={biz.logoUrl} 
                      alt={biz.name} 
                      className="w-11 h-11 rounded-xl object-cover border border-amber-500/20 shadow-2xs shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex flex-col min-w-0">
                      <h3 className="font-serif text-sm font-bold text-slate-900 group-hover:text-amber-800 transition-colors truncate">
                        {biz.name}
                      </h3>
                      <span className="text-[10px] font-mono tracking-wide text-amber-800 font-bold uppercase">
                        {categoryDisplayLabels[biz.category] || biz.category}
                      </span>
                    </div>
                  </div>
                  
                  {/* Rating Badge */}
                  <span className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 text-[10px] font-mono text-amber-900 font-bold">
                    <Star className="w-3 h-3 fill-amber-500 stroke-amber-500" /> {biz.rating.toFixed(1)}
                  </span>
                </div>

                {/* Body details */}
                <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                  {biz.description}
                </p>

                {/* Credentials */}
                <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-[10px] font-mono text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" /> Jude hue log: <strong className="text-slate-800">{biz.networkSize}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> Shuruaat: <strong className="text-slate-800">{biz.foundedYear}</strong>
                  </span>
                </div>
              </div>

              {/* Owner and Actions footer row */}
              <div className="border-t border-slate-100 pt-3 flex items-center justify-between mt-1">
                <div className="flex items-center gap-2">
                  <img 
                    src={biz.ownerAvatar} 
                    alt={biz.ownerName} 
                    className="w-6 h-6 rounded-full object-cover border border-amber-500/20"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-display font-semibold text-slate-800 truncate max-w-[90px]">{biz.ownerName}</span>
                      {biz.isOwnerVerified && <ShieldCheck className="w-3 h-3 text-amber-600" />}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                      <span className="text-[8px] text-slate-600 font-mono bg-slate-100 px-1 py-0.2 rounded font-semibold">MAALIK</span>
                      {currentUser && biz.ownerName !== currentUser.name && (
                        (() => {
                          const ownerUsername = biz.ownerName.toLowerCase().replace(/[^a-z0-9]/g, '_');
                          const isFollowing = followedUsernames.includes(ownerUsername);
                          return (
                            <button
                              onClick={() => onToggleFollow(ownerUsername, biz.ownerName)}
                              className={`text-[8px] font-mono font-bold px-1 py-0.2 rounded transition-all cursor-pointer outline-none ${
                                isFollowing 
                                  ? 'text-amber-900 bg-amber-500/10 border border-amber-500/30' 
                                  : 'text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200'
                              }`}
                            >
                              {isFollowing ? 'Sathi ✓' : '+ Sathi'}
                            </button>
                          );
                        })()
                      )}
                    </div>
                  </div>
                </div>

                {/* Direct Action Connect */}
                <button
                  id={`connect-biz-btn-${biz.id}`}
                  onClick={() => onConnectOwner(biz.ownerName, biz.name)}
                  className="flex items-center gap-1 text-[11px] font-display font-bold text-amber-700 hover:text-amber-800 outline-none transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                  <span>Secure Connect</span>
                </button>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
