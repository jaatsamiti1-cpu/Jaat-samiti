import React, { useState, useRef } from 'react';
import { 
  Music, 
  Play, 
  Pause, 
  Upload, 
  Plus, 
  Disc3, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Radio, 
  Heart, 
  Share2, 
  Clock, 
  Check, 
  Flame,
  Search,
  RotateCcw,
  Sliders
} from 'lucide-react';
import { Song, User as UserType } from '../types';

interface MusicSectionProps {
  songs: Song[];
  onAddSong: (newSong: Song) => void;
  currentPlayingSong: Song | null;
  isPlaying: boolean;
  onPlaySong: (song: Song) => void;
  onPauseSong: () => void;
  currentUser: UserType;
  onSetProfileAnthem: (songTitle: string) => void;
  onShowToast: (msg: string) => void;
  onResetDefaultSongs?: () => void;
}

export default function MusicSection({
  songs,
  onAddSong,
  currentPlayingSong,
  isPlaying,
  onPlaySong,
  onPauseSong,
  currentUser,
  onSetProfileAnthem,
  onShowToast,
  onResetDefaultSongs
}: MusicSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingSong, setIsAddingSong] = useState(false);

  // New Song Form State
  const [newTitle, setNewTitle] = useState('');
  const [newArtist, setNewArtist] = useState('');
  const [newCategory, setNewCategory] = useState<Song['category']>('Trending');
  const [newCoverUrl, setNewCoverUrl] = useState('');
  const [audioFileName, setAudioFileName] = useState<string | null>(null);
  const [customAudioUrl, setCustomAudioUrl] = useState<string>('');

  const audioFileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['All', 'Trending', 'Akhada', 'Kisaani', 'Royal', 'Custom'];

  const handleAudioFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 30 * 1024 * 1024) {
        onShowToast('⚠️ Audio file ka size 30MB se kam hona chahiye.');
        return;
      }
      setAudioFileName(file.name);

      // If file is under 10MB, convert to data URL for persistent playback across sessions
      if (file.size < 10 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setCustomAudioUrl(event.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      } else {
        const url = URL.createObjectURL(file);
        setCustomAudioUrl(url);
      }

      if (!newTitle) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
        setNewTitle(cleanName);
      }
      if (!newArtist) {
        setNewArtist(currentUser.name);
      }
      onShowToast(`🎵 Audio file "${file.name}" select ho gayi!`);
    }
  };

  const handleCreateSongSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newArtist.trim()) {
      onShowToast('⚠️ Gane ka naam aur Kalakaar/Singer bharna zaroori hai.');
      return;
    }

    const newSongItem: Song = {
      id: `song_${Date.now()}`,
      title: newTitle.trim(),
      artist: newArtist.trim(),
      coverUrl: newCoverUrl.trim() || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&h=400&q=80',
      duration: '4:15',
      category: newCategory,
      audioUrl: customAudioUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      addedBy: currentUser.username
    };

    onAddSong(newSongItem);
    setIsAddingSong(false);
    setNewTitle('');
    setNewArtist('');
    setAudioFileName(null);
    setCustomAudioUrl('');
    onShowToast(`🎉 Naya gana "${newSongItem.title}" library me jud gaya hai!`);
  };

  const filteredSongs = songs.filter(s => {
    const matchesCat = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.artist.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div id="music-section-container" className="flex flex-col gap-6 max-w-4xl mx-auto pb-32 md:pb-14 select-none">
      
      {/* 1. Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-700 via-rose-700 to-amber-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-white/10 to-transparent blur-3xl pointer-events-none"></div>
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-1 bg-white/20 backdrop-blur-md shadow-lg flex items-center justify-center shrink-0 border border-white/20">
              <Disc3 className={`w-10 h-10 text-amber-200 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-400/20 text-amber-200 border border-amber-300/30 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-300 fill-amber-300" /> Jaat & Desi Beats
                </span>
                <span className="bg-rose-500/30 text-rose-200 text-[10px] font-mono px-2 py-0.5 rounded-full">
                  HIGH BASS STEREO
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold mt-1 text-white tracking-tight">
                Gane & Music Lounge
              </h2>
              <p className="text-xs sm:text-sm text-amber-100/90 mt-1 max-w-lg">
                Systummm, Akhada beats, Kisaani pride aur Desi gaano ka shahi sangrah. Click karein aur pure phone/computer me gaane sunein.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {onResetDefaultSongs && (
              <button
                id="reset-songs-btn"
                onClick={onResetDefaultSongs}
                className="flex items-center gap-1.5 px-3.5 py-2.5 bg-black/20 hover:bg-black/40 text-amber-100 rounded-2xl font-semibold text-xs border border-white/20 transition-all cursor-pointer"
                title="Default Hit Songs Reload Karein"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Songs</span>
              </button>
            )}

            <button
              id="open-upload-song-btn"
              onClick={() => setIsAddingSong(true)}
              className="flex items-center gap-2 px-5 py-3 bg-white hover:bg-amber-50 text-slate-900 rounded-2xl font-bold text-xs shadow-lg transition-all active:scale-98 cursor-pointer"
            >
              <Upload className="w-4 h-4 text-amber-700" />
              <span>+ Apna Gana Upload Karein</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Upload / Add Song Modal */}
      {isAddingSong && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-amber-600" />
                <h3 className="font-serif font-bold text-slate-900 text-base">
                  Apna Manpasand Gana Lagayein
                </h3>
              </div>
              <button 
                onClick={() => setIsAddingSong(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSongSubmit} className="flex flex-col gap-3.5">
              
              {/* File Upload Box */}
              <div 
                onClick={() => audioFileInputRef.current?.click()}
                className="border-2 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/50 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Upload className="w-8 h-8 text-amber-600" />
                <span className="text-xs font-bold text-amber-900 text-center">
                  {audioFileName ? audioFileName : '📁 Phone / Computer se Audio File Chunein (.mp3, .wav, .m4a)'}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  Gallery ya file manager se apna gana chunein
                </span>
                <input 
                  ref={audioFileInputRef}
                  type="file" 
                  accept="audio/*" 
                  onChange={handleAudioFileUpload}
                  className="hidden" 
                />
              </div>

              {/* Title */}
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Gane Ka Naam (Song Title)</label>
                <input 
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Systummm Remix, Bhole Ka Dum"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-500 text-slate-900 font-medium"
                />
              </div>

              {/* Artist */}
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Gayak / Singer (Artist)</label>
                <input 
                  type="text"
                  required
                  value={newArtist}
                  onChange={(e) => setNewArtist(e.target.value)}
                  placeholder="e.g. Masoom Sharma, Gulzaar Chhaniwala"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-500 text-slate-900"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Varg (Category)</label>
                <select 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-500 text-slate-900 font-medium cursor-pointer"
                >
                  <option value="Trending">Trending Jaat Beats 🔥</option>
                  <option value="Akhada">Akhada & Taakat 💪</option>
                  <option value="Kisaani">Kisaani Pride 🌾</option>
                  <option value="Royal">Royal & Heritage 👑</option>
                  <option value="Custom">Custom / Meri Choice 🎵</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 mt-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddingSong(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Gana Save Karein
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Search and Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Gana ya Kalakaar search karein..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto py-0.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat 
                  ? 'bg-amber-600 text-white shadow-xs' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Songs Playlist Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredSongs.map((song) => {
          const isThisPlaying = currentPlayingSong?.id === song.id && isPlaying;
          const isAnthem = currentUser.anthemSong === song.title;

          return (
            <div 
              key={song.id}
              className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 shadow-sm ${
                isThisPlaying 
                  ? 'bg-amber-50/90 border-amber-400 shadow-amber-500/10 ring-1 ring-amber-400' 
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Album Cover with Play Overlay */}
                <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 group border border-slate-200 shadow-xs">
                  <img 
                    src={song.coverUrl} 
                    alt={song.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                  />
                  <button
                    onClick={() => isThisPlaying ? onPauseSong() : onPlaySong(song)}
                    className="absolute inset-0 bg-slate-900/50 flex items-center justify-center text-white opacity-90 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    {isThisPlaying ? (
                      <Pause className="w-6 h-6 fill-white text-white" />
                    ) : (
                      <Play className="w-6 h-6 fill-white text-white ml-0.5" />
                    )}
                  </button>
                </div>

                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 text-xs truncate max-w-[160px] sm:max-w-[190px]">
                      {song.title}
                    </span>
                    {isAnthem && (
                      <span className="bg-amber-100 text-amber-800 text-[9px] font-mono px-1.5 py-0.2 rounded font-bold">
                        ANTHEM
                      </span>
                    )}
                    {isThisPlaying && (
                      <span className="flex items-center gap-0.5 h-2 px-1">
                        <span className="w-1 h-2 bg-amber-600 animate-pulse rounded-full"></span>
                        <span className="w-1 h-3.5 bg-amber-600 animate-pulse rounded-full delay-75"></span>
                        <span className="w-1 h-1.5 bg-amber-600 animate-pulse rounded-full delay-150"></span>
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500 truncate max-w-[160px]">
                    {song.artist}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-mono text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      {song.category}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" /> {song.duration}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    onSetProfileAnthem(song.title);
                    onShowToast(`👑 "${song.title}" ko aapki Profile ka Shahi Anthem set kar diya gaya hai!`);
                  }}
                  title="Profile Anthem Banayein"
                  className={`p-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    isAnthem 
                      ? 'bg-amber-600 text-white' 
                      : 'bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => isThisPlaying ? onPauseSong() : onPlaySong(song)}
                  className={`p-2.5 rounded-xl cursor-pointer transition-all ${
                    isThisPlaying 
                      ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-300' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                  title={isThisPlaying ? 'Pause Gana' : 'Chalao Gana'}
                >
                  {isThisPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-slate-800" />}
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
