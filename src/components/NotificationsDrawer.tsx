import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  X, 
  Check, 
  Heart, 
  UserPlus, 
  MessageCircle, 
  ShieldCheck, 
  Briefcase, 
  Sparkles, 
  Trash2, 
  Clock,
  PlusCircle,
  CheckCheck
} from 'lucide-react';
import { Notification } from '../types';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (id: string) => void;
  onSimulateNotification: () => void;
  onNavigateTab: (tab: string) => void;
}

export default function NotificationsDrawer({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  onSimulateNotification,
  onNavigateTab
}: NotificationsDrawerProps) {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const getIconForType = (type: Notification['type']) => {
    switch (type) {
      case 'like':
        return <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />;
      case 'follow':
        return <UserPlus className="w-4 h-4 text-blue-600" />;
      case 'comment':
        return <MessageCircle className="w-4 h-4 text-emerald-600" />;
      case 'verification_approve':
        return <ShieldCheck className="w-4 h-4 text-amber-600" />;
      case 'business_match':
        return <Briefcase className="w-4 h-4 text-purple-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-500" />;
    }
  };

  const handleNotificationClick = (item: Notification) => {
    if (!item.read) {
      onMarkAsRead(item.id);
    }
    
    // Contextual navigation
    if (item.type === 'like' || item.type === 'comment') {
      onNavigateTab('feed');
      onClose();
    } else if (item.type === 'business_match') {
      onNavigateTab('directory');
      onClose();
    } else if (item.type === 'follow' || item.type === 'verification_approve') {
      onNavigateTab('profile');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer panel */}
          <motion.div
            id="notifications-drawer-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="relative w-full sm:max-w-md bg-white h-full shadow-2xl z-10 flex flex-col border-l border-slate-200"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-gradient-to-b from-slate-50 to-white">
              <div className="flex items-center gap-2.5">
                <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-amber-500/10 text-amber-700 border border-amber-500/20">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                    </span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif font-bold text-slate-900 text-base">
                      Suchnaayein
                    </h2>
                    {unreadCount > 0 ? (
                      <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-rose-50 text-rose-600 border border-rose-200 rounded-full">
                        {unreadCount} Naye
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-[10px] font-mono text-slate-500 bg-slate-100 rounded-full">
                        All Read
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Community interactions aur alerts
                  </p>
                </div>
              </div>

              <button
                id="close-notifications-btn"
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Close notifications"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions Bar */}
            <div className="px-4 py-2.5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 bg-slate-200/70 p-0.5 rounded-lg">
                <button
                  id="filter-all-btn"
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all ${
                    filter === 'all'
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sabhi ({notifications.length})
                </button>
                <button
                  id="filter-unread-btn"
                  onClick={() => setFilter('unread')}
                  className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all ${
                    filter === 'unread'
                      ? 'bg-white text-rose-700 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Bina Padhi ({unreadCount})
                </button>
              </div>

              {unreadCount > 0 && (
                <button
                  id="mark-all-read-btn"
                  onClick={onMarkAllAsRead}
                  className="flex items-center gap-1 text-[11px] font-medium text-amber-700 hover:text-amber-800 transition-colors"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Sabhi Padhein</span>
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 sm:p-3 space-y-1">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center px-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif font-bold text-slate-900 text-sm mb-1">
                    {filter === 'unread' ? 'Koi bina padhi suchna nahi hai' : 'Abhi koi suchna nahi hai'}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-xs mb-4">
                    Naye likes, comments, aur community updates yahan dynamically alert honge.
                  </p>
                  <button
                    onClick={onSimulateNotification}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Test Interaction Bhejein</span>
                  </button>
                </div>
              ) : (
                filteredNotifications.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`group relative p-3 rounded-xl transition-all cursor-pointer border ${
                      !item.read
                        ? 'bg-amber-50/60 border-amber-200/80 hover:bg-amber-50'
                        : 'bg-white border-transparent hover:bg-slate-50'
                    }`}
                    onClick={() => handleNotificationClick(item)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar with type badge */}
                      <div className="relative shrink-0">
                        <img
                          src={item.senderAvatar}
                          alt={item.senderName}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white shadow-xs border border-slate-100 flex items-center justify-center">
                          {getIconForType(item.type)}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 pr-6">
                        <p className="text-xs text-slate-800 leading-snug">
                          <strong className="font-semibold text-slate-900">
                            {item.senderName}{' '}
                          </strong>
                          {item.message}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400">
                          <Clock className="w-3 h-3" />
                          <span>{item.timestamp}</span>
                          {!item.read && (
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          )}
                        </div>
                      </div>

                      {/* Delete notification button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteNotification(item.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-white"
                        aria-label="Delete notification"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Bottom Footer toolbar */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                id="simulate-notification-btn"
                onClick={onSimulateNotification}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-amber-800 bg-amber-500/15 hover:bg-amber-500/25 transition-colors border border-amber-600/20 active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>+ Simulate Interaction</span>
              </button>

              <span className="text-[10px] font-mono text-slate-400">
                Jaat Samiti Alerts
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
