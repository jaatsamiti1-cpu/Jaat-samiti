import React, { useEffect, useRef, useState } from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX, 
  Disc3, 
  ChevronUp, 
  ChevronDown, 
  X,
  Music,
  Radio,
  Sliders,
  Flame,
  RotateCcw
} from 'lucide-react';
import { Song } from '../types';
import { desiSynth } from '../utils/desiSynthEngine';

interface FloatingMusicPlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  onOpenMusicSection?: () => void;
}

export default function FloatingMusicPlayer({
  currentSong,
  isPlaying,
  onTogglePlay,
  onNext,
  onPrev,
  onClose,
  onOpenMusicSection
}: FloatingMusicPlayerProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isSynthActive, setIsSynthActive] = useState(false);
  const [beatStep, setBeatStep] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  // Synchronize Desi Synth beat visualization
  useEffect(() => {
    desiSynth.setOnBeat((step) => {
      setBeatStep(step);
    });
  }, []);

  // Format seconds into MM:SS
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Handle Play/Pause and Song switching
  useEffect(() => {
    if (!currentSong) {
      desiSynth.stop();
      setIsSynthActive(false);
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      if (isSynthActive) {
        audio.pause();
        desiSynth.setVolume(isMuted ? 0 : volume);
        desiSynth.start(130);
      } else {
        desiSynth.stop();
        audio.volume = isMuted ? 0 : volume;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn('Direct MP3 playback blocked or network issue, activating Desi Beat Synth:', err);
            setIsSynthActive(true);
            desiSynth.setVolume(isMuted ? 0 : volume);
            desiSynth.start(130);
          });
        }
      }
    } else {
      audio.pause();
      desiSynth.stop();
    }
  }, [isPlaying, currentSong, isSynthActive]);

  // Handle Volume change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
    desiSynth.setVolume(isMuted ? 0 : volume);
  }, [volume, isMuted]);

  // Audio element events
  const handleTimeUpdate = () => {
    if (audioRef.current && !isSynthActive) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleAudioEnded = () => {
    if (isLooping) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      onNext();
    }
  };

  const handleAudioError = () => {
    console.warn('Audio tag encountered error with URL:', currentSong?.audioUrl);
    // Switch smoothly to Desi Synth engine so the music never stops
    setIsSynthActive(true);
    if (isPlaying) {
      desiSynth.setVolume(isMuted ? 0 : volume);
      desiSynth.start(130);
    }
  };

  // Handle Seek/Scrub on Progress Bar
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isSynthActive) return; // Synth is infinite live loop
    if (!progressBarRef.current || !audioRef.current || !duration) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newRatio = Math.max(0, Math.min(1, clickX / width));
    const newTime = newRatio * duration;

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleSynthMode = () => {
    const nextState = !isSynthActive;
    setIsSynthActive(nextState);
    if (audioRef.current) {
      if (nextState) {
        audioRef.current.pause();
        if (isPlaying) {
          desiSynth.setVolume(isMuted ? 0 : volume);
          desiSynth.start(130);
        }
      } else {
        desiSynth.stop();
        if (isPlaying) {
          audioRef.current.play().catch(() => {});
        }
      }
    }
  };

  if (!currentSong) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : (isPlaying ? ((beatStep / 16) * 100) : 0);

  return (
    <div 
      id="floating-music-player"
      className={`fixed z-40 transition-all duration-300 select-none ${
        isMinimized
          ? 'bottom-16 md:bottom-5 right-4 w-auto'
          : 'bottom-16 md:bottom-5 left-1/2 -translate-x-1/2 w-[95%] max-w-xl'
      }`}
    >
      {/* Hidden Native Audio Element */}
      <audio 
        ref={audioRef}
        key={currentSong.id}
        src={currentSong.audioUrl}
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleAudioEnded}
        onError={handleAudioError}
      />

      {/* Minimized View */}
      {isMinimized ? (
        <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-2 shadow-2xl border border-amber-500/50 flex items-center gap-2">
          <div className="relative w-9 h-9 rounded-xl overflow-hidden shrink-0 border border-amber-500/50">
            <img src={currentSong.coverUrl} alt={currentSong.title} className="w-full h-full object-cover" />
            {isPlaying && (
              <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                <Disc3 className="w-5 h-5 text-amber-300 animate-spin" style={{ animationDuration: '3s' }} />
              </div>
            )}
          </div>
          <button 
            onClick={onTogglePlay}
            className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center cursor-pointer text-white"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white ml-0.5" />}
          </button>
          <button 
            onClick={() => setIsMinimized(false)} 
            className="p-1.5 text-slate-400 hover:text-white cursor-pointer"
            title="Expand player"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Full Expanded Player */
        <div className="bg-slate-900/95 backdrop-blur-xl text-white rounded-3xl p-3.5 sm:p-4 shadow-2xl border border-amber-500/40 flex flex-col gap-2">
          
          {/* Top Bar: Info + Controls + Tools */}
          <div className="flex items-center justify-between gap-3">
            
            {/* Song Cover & Metadata */}
            <div 
              className="flex items-center gap-3 min-w-0 cursor-pointer"
              onClick={onOpenMusicSection}
              title="Gaane Lounge Kholiye"
            >
              <div className="relative w-12 h-12 rounded-2xl overflow-hidden shrink-0 border border-amber-500/40 shadow-inner group">
                <img 
                  src={currentSong.coverUrl} 
                  alt={currentSong.title} 
                  className={`w-full h-full object-cover transition-transform duration-500 ${isPlaying ? 'scale-110' : ''}`} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                {isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Disc3 className="w-6 h-6 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
                  </div>
                )}
              </div>

              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-sm font-bold truncate max-w-[130px] sm:max-w-[210px] text-amber-100">
                    {currentSong.title}
                  </span>
                  {isSynthActive ? (
                    <span className="bg-gradient-to-r from-rose-600 to-amber-600 text-white text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-full uppercase flex items-center gap-0.5 animate-pulse">
                      <Flame className="w-2.5 h-2.5" /> DESI BASS
                    </span>
                  ) : (
                    <span className="bg-amber-500/30 text-amber-300 text-[8px] font-mono px-1 rounded uppercase">
                      STUDIO
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-400 truncate max-w-[120px] sm:max-w-[180px]">
                  {currentSong.artist}
                </span>
              </div>
            </div>

            {/* Playback Controls (Previous, Play/Pause, Next) */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={onPrev}
                className="p-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer active:scale-95"
                title="Peeche Ka Gana"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                id="player-play-pause-btn"
                onClick={onTogglePlay}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white flex items-center justify-center shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                title={isPlaying ? 'Pause Gana' : 'Chalao Gana (Play)'}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-white" />
                ) : (
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                )}
              </button>

              <button
                onClick={onNext}
                className="p-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer active:scale-95"
                title="Agla Gana"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Additional Features: Synth Mode, Volume & Close */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              
              {/* Desi Bass / Synth Mode Toggle */}
              <button
                onClick={toggleSynthMode}
                className={`p-1.5 sm:p-2 rounded-xl transition-all cursor-pointer text-xs flex items-center gap-1 ${
                  isSynthActive 
                    ? 'bg-amber-600/40 text-amber-300 border border-amber-500/50' 
                    : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
                title={isSynthActive ? 'Studio Track Par Wapas Jayein' : 'Live Desi Bass Beat Mode Chalu Karein'}
              >
                <Sliders className="w-3.5 h-3.5" />
              </button>

              {/* Volume Slider & Toggle */}
              <div className="hidden sm:flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded-xl border border-slate-700/60">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-slate-400 hover:text-white cursor-pointer"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value));
                    setIsMuted(false);
                  }}
                  className="w-14 h-1 accent-amber-500 cursor-pointer bg-slate-700 rounded-lg"
                  title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
                />
              </div>

              {/* Minimize */}
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                title="Chhota Karein (Minimize)"
              >
                <ChevronDown className="w-4 h-4" />
              </button>

              {/* Close */}
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-rose-400 cursor-pointer"
                title="Band Karein"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Interactive Scrubbable Progress Bar */}
          <div className="flex items-center gap-2.5 pt-1">
            <span className="text-[10px] font-mono text-slate-400 w-8 text-right">
              {isSynthActive ? 'LIVE' : formatTime(currentTime)}
            </span>

            <div 
              ref={progressBarRef}
              onClick={handleSeek}
              className="flex-1 h-2.5 bg-slate-800/90 rounded-full overflow-hidden cursor-pointer group relative flex items-center"
              title={isSynthActive ? 'Live Beat Loop Chal Raha Hai' : 'Click karke aage ya peeche karein'}
            >
              <div 
                className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-amber-400 rounded-full transition-all duration-150 relative"
                style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>

            <span className="text-[10px] font-mono text-slate-400 w-8">
              {isSynthActive ? 'BEAT' : formatTime(duration)}
            </span>

            {/* Equalizer Live Visualizer Bars */}
            <div className="flex items-end gap-0.5 h-3.5 px-1">
              {[40, 90, 60, 100, 75, 45].map((h, i) => (
                <div 
                  key={i}
                  className={`w-0.5 rounded-full transition-all duration-200 ${
                    isPlaying 
                      ? 'bg-gradient-to-t from-amber-500 to-amber-300' 
                      : 'bg-slate-700 h-1'
                  }`}
                  style={{ 
                    height: isPlaying 
                      ? `${Math.max(3, (h * ((beatStep % 4 + 1) / 4)) * 0.14)}px` 
                      : '3px' 
                  }}
                />
              ))}
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
