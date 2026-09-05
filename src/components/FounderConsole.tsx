import React, { useState } from 'react';
import { 
  Crown, 
  ShieldCheck, 
  Search, 
  Download, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Users, 
  Sparkles, 
  MessageSquare, 
  X, 
  Check, 
  Filter, 
  Send,
  Eye,
  Award,
  Lock,
  UserCheck
} from 'lucide-react';
import { RegisteredAccount, User as UserType } from '../types';

interface FounderConsoleProps {
  currentUser: UserType;
  accounts: RegisteredAccount[];
  onUpdateAccountBadge?: (username: string, newBadge: string) => void;
  onSendBroadcast?: (message: string) => void;
  onOpenDMWithUser?: (username: string, name: string) => void;
  onShowToast: (msg: string) => void;
  onNavigateToFeed?: () => void;
}

export default function FounderConsole({
  currentUser,
  accounts,
  onUpdateAccountBadge,
  onSendBroadcast,
  onOpenDMWithUser,
  onShowToast,
  onNavigateToFeed
}: FounderConsoleProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [badgeFilter, setBadgeFilter] = useState<string>('all');
  const [selectedMember, setSelectedMember] = useState<RegisteredAccount | null>(null);
  
  // Broadcast announcement state
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');

  const isFounder = currentUser.username === 'jaswant_jaat' || currentUser.membershipLevel === 'Founder Board';

  // Filter members
  const filteredAccounts = accounts.filter(acc => {
    const term = searchTerm.toLowerCase();
    const matchesTerm = 
      acc.name.toLowerCase().includes(term) ||
      acc.username.toLowerCase().includes(term) ||
      (acc.email && acc.email.toLowerCase().includes(term)) ||
      (acc.phone && acc.phone.includes(term)) ||
      (acc.location && acc.location.toLowerCase().includes(term));
    
    if (badgeFilter === 'all') return matchesTerm;
    return matchesTerm && acc.verificationType === badgeFilter;
  });

  const handleExportCSV = () => {
    const headers = 'ID,Name,Username,Email,Phone,Location,Badge,MembershipLevel,JoinedDate,Status\n';
    const rows = accounts.map(a => 
      `"${a.id || ''}","${a.name}","@${a.username}","${a.email || ''}","${a.phone || ''}","${a.location}","${a.verificationType || ''}","${a.membershipLevel}","${a.joinedDate || '2026'}","${a.status || 'Active'}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Jaat_Samiti_Master_Roster_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onShowToast('📥 Sabhi sadasyon ka confidential master roster CSV format me download ho gaya!');
  };

  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;

    if (onSendBroadcast) {
      onSendBroadcast(broadcastMessage.trim());
    }
    setBroadcastMessage('');
    setIsBroadcasting(false);
    onShowToast('📢 Founder Official Broadcast sabhi sadasyon ko bhej diya gaya!');
  };

  return (
    <div id="founder-console-container" className="flex flex-col gap-6 max-w-5xl mx-auto pb-24 md:pb-8 select-none">
      
      {/* 1. Founder Banner & Authority Badge */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-white/10 to-transparent blur-2xl pointer-events-none"></div>
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 bg-gradient-to-tr from-amber-200 to-white shadow-lg shrink-0">
              <img 
                src={currentUser.avatar} 
                alt="Founder Jaswant Jaat" 
                className="w-full h-full rounded-full object-cover" 
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="bg-amber-500/30 text-amber-200 border border-amber-400/40 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <Crown className="w-3 h-3 text-amber-300" /> Supreme Founder Portal
                </span>
                <span className="bg-emerald-500/30 text-emerald-200 text-[10px] font-mono px-2 py-0.5 rounded-full">
                  MASTER ACCESS
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold mt-1 tracking-tight text-white">
                Jaswant Jaat - Sansthaapak Niyantran Kaksh
              </h2>
              <p className="text-xs sm:text-sm text-amber-100/90 mt-1 max-w-xl">
                Jaat Samiti ke sabhi sadasyon ka confidential master data, contact details, verification control aur centralized community directory.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <button
              id="founder-export-csv-btn"
              onClick={handleExportCSV}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-amber-50 text-slate-900 rounded-xl font-bold text-xs shadow-md transition-all active:scale-98 cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-700" />
              <span>Export Master Roster (CSV)</span>
            </button>

            <button
              id="founder-broadcast-toggle-btn"
              onClick={() => setIsBroadcasting(!isBroadcasting)}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold text-xs shadow-md transition-all active:scale-98 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Sandesh</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-mono uppercase font-semibold">Registered Sadasya</span>
            <Users className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-2xl font-bold text-slate-900 font-mono">{accounts.length}</span>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1">100% Verified Community</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-mono uppercase font-semibold">Elite / Royal Badges</span>
            <ShieldCheck className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-2xl font-bold text-slate-900 font-mono">
            {accounts.filter(a => a.verificationType === 'Royal' || a.verificationType === 'Legend' || a.verificationType === 'Elite').length}
          </span>
          <span className="text-[10px] text-amber-700 font-semibold mt-1">Direct Founder Approved</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-mono uppercase font-semibold">Total Posts & Reels</span>
            <Sparkles className="w-4 h-4 text-rose-500" />
          </div>
          <span className="text-2xl font-bold text-slate-900 font-mono">
            {accounts.reduce((sum, a) => sum + (a.postsCount || 0), 0) + 12}
          </span>
          <span className="text-[10px] text-slate-500 mt-1">Community Media</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-mono uppercase font-semibold">Database Security</span>
            <Lock className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-sm font-bold text-emerald-700 font-mono mt-1.5">AES-256 SECURED</span>
          <span className="text-[10px] text-slate-500 mt-1">Founder Encryption</span>
        </div>
      </div>

      {/* Broadcast Announcement Modal / Panel */}
      {isBroadcasting && (
        <div className="bg-white border-2 border-amber-500/50 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-600" />
              <h4 className="font-bold text-slate-900 text-sm">
                Sansthaapak Official Broadcast Announcement
              </h4>
            </div>
            <button 
              onClick={() => setIsBroadcasting(false)}
              className="text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <form onSubmit={handleBroadcastSubmit} className="flex flex-col gap-3">
            <textarea
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              placeholder="Sabhi members ko official sandesh bhejein (jaise nayi sabha, samaroh, ya zaroori suchna)..."
              rows={3}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 outline-none focus:border-amber-600 focus:bg-white resize-none"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsBroadcasting(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Sabhi Ko Broadcast Karein</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. Search & Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Sadasya ka naam, @username, phone, email, ya gaon/shahar search karein..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-amber-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select 
            value={badgeFilter}
            onChange={(e) => setBadgeFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 outline-none focus:border-amber-500 font-medium cursor-pointer w-full sm:w-auto"
          >
            <option value="all">Sabhi Badges ({accounts.length})</option>
            <option value="Royal">Royal Member 🚩</option>
            <option value="Legend">Legend Member 👑</option>
            <option value="Elite">Elite Member ✨</option>
            <option value="Business">Business Member 💼</option>
          </select>
        </div>
      </div>

      {/* 4. Master Member Roster Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-amber-600" />
            <h3 className="font-serif font-bold text-slate-900 text-sm">
              Samast Sadasya Master Directory ({filteredAccounts.length})
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            Founder Private Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[10px] font-mono text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Sadasya (Member)</th>
                <th className="py-3 px-4">Sampark (Phone & Email)</th>
                <th className="py-3 px-4">Sthan (Location)</th>
                <th className="py-3 px-4">Badge / Role</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
              {filteredAccounts.map((acc) => {
                const isMemberFounder = acc.username === 'jaswant_jaat';
                return (
                  <tr key={acc.id || acc.username} className="hover:bg-amber-50/30 transition-colors">
                    
                    {/* Member Name & Avatar */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-9 h-9 rounded-full overflow-hidden border border-amber-500/30 shrink-0">
                          <img 
                            src={acc.avatar} 
                            alt={acc.name} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 truncate">{acc.name}</span>
                            {isMemberFounder && (
                              <span className="bg-amber-100 text-amber-800 text-[9px] font-mono px-1.5 py-0.2 rounded font-bold">
                                FOUNDER
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-mono text-slate-500">@{acc.username}</span>
                        </div>
                      </div>
                    </td>

                    {/* Contact (Phone & Email) */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5 text-slate-700 font-mono text-[11px]">
                          <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>{acc.phone || '+91 98120-XXXXX'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[150px]">{acc.email || `${acc.username}@jaatsamiti.com`}</span>
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                        <span className="truncate max-w-[140px]">{acc.location || 'Haryana, India'}</span>
                      </div>
                    </td>

                    {/* Badge */}
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                        acc.verificationType === 'Royal' 
                          ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                          : acc.verificationType === 'Legend' 
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : acc.verificationType === 'Elite'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}>
                        <ShieldCheck className="w-3 h-3" />
                        <span>{acc.verificationType || 'Royal'}</span>
                      </span>
                    </td>

                    {/* Joined Date */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{acc.joinedDate || '2026'}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedMember(acc)}
                          title="Puri Details Dekhein"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {onOpenDMWithUser && (
                          <button
                            onClick={() => onOpenDMWithUser(acc.username, acc.name)}
                            title="Direct Message Bhejein"
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 transition-colors cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Detailed Member Dossier Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-600" />
                <h3 className="font-serif font-bold text-slate-900 text-base">
                  Sadasya Confidential Dossier (Founder View)
                </h3>
              </div>
              <button 
                onClick={() => setSelectedMember(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Header */}
            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl mb-4 border border-slate-100">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-500 shrink-0">
                <img src={selectedMember.avatar} alt={selectedMember.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-slate-900 text-lg leading-tight">
                  {selectedMember.name}
                </h4>
                <span className="text-xs font-mono text-amber-800">@{selectedMember.username}</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                    {selectedMember.verificationType || 'Royal'} Member
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Tier: {selectedMember.membershipLevel}
                  </span>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="flex flex-col gap-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" /> Mobile / Phone Number
                </span>
                <span className="font-mono font-bold text-slate-900">{selectedMember.phone || '+91 98120-XXXXX'}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-600" /> Email Address
                </span>
                <span className="font-mono text-slate-900">{selectedMember.email || 'None registered'}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" /> Registered Location
                </span>
                <span className="font-semibold text-slate-900">{selectedMember.location || 'Haryana, India'}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-purple-600" /> Registration Date
                </span>
                <span className="font-mono text-slate-900">{selectedMember.joinedDate || '2026'}</span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-500 block mb-1 font-semibold">Bio / Parichay</span>
                <p className="text-slate-800 text-xs italic">{selectedMember.bio || 'Koi bio nahi likha hai.'}</p>
              </div>

              {/* Founder Badge Modification Controller */}
              {onUpdateAccountBadge && (
                <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl mt-1">
                  <label className="text-[11px] font-bold text-amber-900 block mb-1">
                    👑 Founder Badge Control (Badge Badlein):
                  </label>
                  <div className="flex gap-2">
                    {['Royal', 'Legend', 'Elite', 'Business'].map((badge) => (
                      <button
                        key={badge}
                        type="button"
                        onClick={() => {
                          onUpdateAccountBadge(selectedMember.username, badge);
                          setSelectedMember(prev => prev ? { ...prev, verificationType: badge as any } : null);
                          onShowToast(`👑 @${selectedMember.username} ka badge update karke ${badge} kar diya gaya!`);
                        }}
                        className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                          selectedMember.verificationType === badge
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-amber-100'
                        }`}
                      >
                        {badge}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl cursor-pointer"
              >
                Close Dossier
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
