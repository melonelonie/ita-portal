import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  X,
  Info,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  MailOpen,
  Mail,
  Trash2,
} from 'lucide-react';

export type NotificationType = 'info' | 'warning' | 'success' | 'agent';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description?: string;
  timestamp: string;
  read: boolean;
}

export interface NotificationCenterProps {
  notifications: Notification[];
  onMarkRead?: (id: string) => void;
  onMarkAllRead?: () => void;
  onDelete?: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const typeIcons: Record<NotificationType, React.ReactNode> = {
  info: <Info size={14} className="text-blue-400" />,
  warning: <AlertTriangle size={14} className="text-amber-400" />,
  success: <CheckCircle2 size={14} className="text-emerald-400" />,
  agent: <Sparkles size={14} className="text-[#6366f1]" />,
};

const typeBg: Record<NotificationType, string> = {
  info: 'bg-blue-500/10 border-blue-500/20',
  warning: 'bg-amber-500/10 border-amber-500/20',
  success: 'bg-emerald-500/10 border-emerald-500/20',
  agent: 'bg-[#6366f1]/10 border-[#6366f1]/20',
};

function groupByTime(notifications: Notification[]): Record<string, Notification[]> {
  const groups: Record<string, Notification[]> = {};
  const now = new Date();

  for (const n of notifications) {
    const date = new Date(n.timestamp);
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    let group: string;
    if (diffHours < 1) group = 'Just now';
    else if (diffHours < 24) group = 'Today';
    else if (diffHours < 48) group = 'Yesterday';
    else group = 'Earlier';

    if (!groups[group]) groups[group] = [];
    groups[group].push(n);
  }

  return groups;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onDelete,
  isOpen,
  onClose,
  className = '',
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;
  const grouped = groupByTime(notifications);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className={`
              absolute z-50 top-full right-0 mt-2
              w-[380px] max-h-[520px]
              bg-[#0f0f14] border border-[#27272a] rounded-xl
              shadow-2xl shadow-black/40 overflow-hidden
              flex flex-col
              ${className}
            `}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#27272a]">
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-[#fafafa]" />
                <h3 className="text-sm font-semibold text-[#fafafa]">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#6366f1] text-white rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {onMarkAllRead && unreadCount > 0 && (
                  <button
                    onClick={onMarkAllRead}
                    className="text-[10px] text-[#6366f1] hover:text-[#a5b4fc] transition-colors px-2 py-1"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg text-[#52525b] hover:text-[#a1a1aa] hover:bg-white/5 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Bell size={24} className="text-[#3f3f46] mb-3" />
                  <p className="text-sm text-[#52525b]">No notifications</p>
                </div>
              ) : (
                Object.entries(grouped).map(([group, items]) => (
                  <div key={group}>
                    <div className="px-4 py-2 bg-[#09090b]">
                      <span className="text-[10px] font-semibold text-[#52525b] uppercase tracking-wider">
                        {group}
                      </span>
                    </div>
                    {items.map((notification) => (
                      <motion.div
                        key={notification.id}
                        layout
                        className={`
                          flex items-start gap-3 px-4 py-3 border-b border-[#27272a]/50
                          transition-colors hover:bg-white/[0.02] cursor-pointer
                          ${!notification.read ? 'bg-[#6366f1]/[0.02]' : ''}
                        `}
                        onClick={() => onMarkRead?.(notification.id)}
                      >
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border ${typeBg[notification.type]}`}>
                          {typeIcons[notification.type]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs ${notification.read ? 'text-[#a1a1aa]' : 'text-[#fafafa] font-medium'}`}>
                            {notification.title}
                          </p>
                          {notification.description && (
                            <p className="text-[11px] text-[#71717a] mt-0.5 line-clamp-2">
                              {notification.description}
                            </p>
                          )}
                          <p className="text-[10px] text-[#3f3f46] mt-1">
                            {notification.timestamp}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {!notification.read && (
                            <span className="w-2 h-2 rounded-full bg-[#6366f1]" />
                          )}
                          {onDelete && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(notification.id);
                              }}
                              className="p-1 rounded opacity-0 hover:opacity-100 text-[#52525b] hover:text-red-400 transition-all"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

NotificationCenter.displayName = 'NotificationCenter';

export { NotificationCenter };
export default NotificationCenter;
