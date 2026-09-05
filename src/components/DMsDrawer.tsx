import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Lock, 
  Send, 
  ShieldCheck, 
  Terminal, 
  KeyRound, 
  Check, 
  CheckCheck,
  User,
  Sparkles
} from 'lucide-react';
import { Message, User as UserType } from '../types';

interface DMsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserType;
  initialChatMessages: Message[];
  activeChatPartnerName?: string; // If initiated from directory
  activeChatPartnerAvatar?: string;
  onShowToast: (message: string) => void;
}

export default function DMsDrawer({
  isOpen,
  onClose,
  currentUser,
  initialChatMessages,
  activeChatPartnerName,
  activeChatPartnerAvatar,
  onShowToast
}: DMsDrawerProps) {
  
  const [messages, setMessages] = useState<Message[]>(initialChatMessages);
  const [inputText, setInputText] = useState('');
  
  // Encryption simulation states
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [cipherPreview, setCipherPreview] = useState('');

  // Active chat contact state
  const [activeContact, setActiveContact] = useState({
    id: 'leader_3',
    name: 'Vikram Singh Chaudhary',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
    title: 'Ceres Robotics Co-Founder',
    keyVerified: '0x73A2...F9D1'
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Update active contact if changed via directory connection
  useEffect(() => {
    if (activeChatPartnerName) {
      setActiveContact({
        id: `custom_${Date.now()}`,
        name: activeChatPartnerName,
        avatar: activeChatPartnerAvatar || 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&h=150&q=80',
        title: 'Vyapaari Network Executive',
        keyVerified: `0x${Math.random().toString(16).substring(2, 6).toUpperCase()}...${Math.random().toString(16).substring(2, 6).toUpperCase()}`
      });
      onShowToast(`🔒 ${activeChatPartnerName} ke saath secure channel shuru ho gaya.`);
    }
  }, [activeChatPartnerName]);

  // Scroll to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isEncrypting]);

  // Handle Send Message with cipher simulation
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const originalText = inputText;
    setInputText('');
    setIsEncrypting(true);

    // Cipher simulation text
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let tick = 0;
    const interval = setInterval(() => {
      let scramble = '';
      for (let i = 0; i < originalText.length; i++) {
        scramble += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setCipherPreview(scramble);
      tick++;
      if (tick > 8) {
        clearInterval(interval);
        
        // Append actual decrypted message to chat
        const newMessage: Message = {
          id: `msg_${Date.now()}`,
          senderId: currentUser.id,
          receiverId: activeContact.id,
          content: originalText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isEncrypted: true
        };

        setMessages(prev => [...prev, newMessage]);
        setIsEncrypting(false);
        setCipherPreview('');

        // Simulate contact auto-reply for premium interactivity
        setTimeout(() => {
          const autoReplies = [
            `Bilkul sahi kaha aapne. Is channel par hum aage ki baat-cheet continue karenge.`,
            `Message mil gaya hai. Main baki logo se baat karke aapko jald batata hu.`,
            `Sahi baat hai! Hamare samaj ke startups bohot aage badh rahe hain. Chalo jald hi call par baat karte hain.`
          ];
          const randomReply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
          
          const replyMessage: Message = {
            id: `msg_reply_${Date.now()}`,
            senderId: activeContact.id,
            receiverId: currentUser.id,
            content: randomReply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isEncrypted: true
          };
          setMessages(prev => [...prev, replyMessage]);
          onShowToast(`🔐 ${activeContact.name} se secure response mila hai`);
        }, 1500);

      }
    }, 100);
  };

  const currentChatMessages = messages.filter(
    m => (m.senderId === currentUser.id && m.receiverId === activeContact.id) || 
         (m.senderId === activeContact.id && m.receiverId === currentUser.id)
  );

  if (!isOpen) return null;

  return (
    <div 
      id="dm-drawer-overlay"
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex justify-end animate-fade-in"
    >
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Drawer content panel */}
      <div 
        id="dm-drawer-panel"
        className="relative w-full max-w-md h-full bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between select-none animate-slide-in-right z-10 text-slate-900"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
              <Lock className="w-4 h-4 animate-pulse text-emerald-600" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-xs font-mono font-bold tracking-wider text-slate-900 uppercase">Secure Guftagu (E2EE)</h3>
              <span className="text-[10px] text-emerald-700 font-mono flex items-center gap-1 font-bold">
                <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> AES-256 Bit ACTIVE
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200/60 text-slate-500 hover:text-slate-800 outline-none cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contact info strip */}
        <div className="px-5 py-3 bg-amber-50/50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={activeContact.avatar} 
              alt={activeContact.name} 
              className="w-9 h-9 rounded-full object-cover border border-amber-500/20"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-display font-bold text-slate-900 truncate">{activeContact.name}</span>
              <span className="text-[9px] text-slate-500 truncate font-medium">{activeContact.title}</span>
            </div>
          </div>
          <div className="flex flex-col items-end shrink-0">
            <span className="text-[9px] font-mono text-amber-900 flex items-center gap-1 font-bold">
              <KeyRound className="w-3 h-3 text-amber-600" /> Key Verified
            </span>
            <span className="text-[8px] font-mono text-slate-500 uppercase font-semibold">{activeContact.keyVerified}</span>
          </div>
        </div>

        {/* Message logs area */}
        <div id="chat-messages-container" className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50">
          
          {/* Security Banner alert */}
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-[10px] leading-relaxed text-slate-700 font-sans flex items-start gap-2.5 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 font-bold">Identity-Verified Chat Sequence</strong>
              <p className="mt-0.5">Ye chat puri tarah encrypted hai aur default scrapers se safe hai. Key authentication aapke samaj records se verify kiye gaye hain.</p>
            </div>
          </div>

          {currentChatMessages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div 
                key={msg.id} 
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div 
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                    isMe 
                      ? 'bg-amber-100/80 border border-amber-200 text-slate-900 shadow-2xs' 
                      : 'bg-white border border-slate-200 text-slate-800 shadow-2xs'
                  }`}
                >
                  <p className="font-sans whitespace-pre-wrap font-medium">{msg.content}</p>
                </div>
                <div className="flex items-center gap-1 mt-1 px-1.5 text-[9px] font-mono text-slate-400">
                  <span>{msg.timestamp}</span>
                  {isMe && <CheckCheck className="w-3.5 h-3.5 text-amber-600" />}
                </div>
              </div>
            );
          })}

          {/* Encryption scramble animation block */}
          {isEncrypting && (
            <div className="flex flex-col items-end">
              <div className="max-w-[85%] rounded-2xl p-3 text-xs font-mono bg-amber-50 border border-amber-200 text-amber-900 leading-normal flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 animate-bounce text-amber-600" />
                <span className="truncate max-w-[200px] font-bold">{cipherPreview}</span>
              </div>
              <span className="text-[9px] font-mono text-amber-800 mt-1 uppercase tracking-widest font-bold animate-pulse">
                Encrypt Ho Raha Hai...
              </span>
            </div>
          )}

          <div ref={chatEndRef}></div>
        </div>

        {/* Send message textbar input */}
        <form 
          onSubmit={handleSendMessage}
          className="p-4 bg-white border-t border-slate-200 flex items-center gap-3"
        >
          <input
            type="text"
            required
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isEncrypting}
            placeholder="Confidential message likhein..."
            className="flex-1 bg-slate-50 text-slate-900 placeholder-slate-400 text-xs rounded-xl px-4 py-3 border border-slate-200 focus:border-amber-500 font-medium outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isEncrypting}
            className="p-3 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-200 text-white disabled:text-slate-400 rounded-xl transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center shrink-0 shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
