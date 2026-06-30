import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Bot,
  GitBranch,
  CheckCheck,
  Trash2,
  Circle,
} from 'lucide-react';

type TabId = 'all' | 'unread' | 'agents' | 'pipeline';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'agent' | 'pipeline' | 'system';
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'AI Screener Completed',
    message: 'Screening for Senior React Developer (JR-2024-042) has been completed. 12 candidates shortlisted.',
    time: '10 min ago',
    read: false,
    type: 'agent',
  },
  {
    id: '2',
    title: 'Candidate Moved to Interview',
    message: 'Jane Smith has been moved to the Interview stage for Full Stack Engineer position.',
    time: '1 hour ago',
    read: false,
    type: 'pipeline',
  },
  {
    id: '3',
    title: 'New Client Assignment',
    message: 'You have been assigned to client TechCorp Inc. for their Q3 hiring needs.',
    time: '3 hours ago',
    read: false,
    type: 'system',
  },
  {
    id: '4',
    title: 'Agent Alert: Sourcing Complete',
    message: 'AI sourcing agent found 45 potential candidates for Backend Engineer role.',
    time: '5 hours ago',
    read: true,
    type: 'agent',
  },
  {
    id: '5',
    title: 'Pipeline Update',
    message: '3 candidates have been moved to the offer stage for DevOps Engineer position.',
    time: '1 day ago',
    read: true,
    type: 'pipeline',
  },
  {
    id: '6',
    title: 'Weekly Report Ready',
    message: 'Your weekly recruitment analytics report is ready for review.',
    time: '2 days ago',
    read: true,
    type: 'system',
  },
];

const tabs: { id: TabId; label: string; icon: typeof Bell }[] = [
  { id: 'all', label: 'All', icon: Bell },
  { id: 'unread', label: 'Unread', icon: Circle },
  { id: 'agents', label: 'Agent Alerts', icon: Bot },
  { id: 'pipeline', label: 'Pipeline', icon: GitBranch },
];

const typeIconMap = {
  agent: Bot,
  pipeline: GitBranch,
  system: Bell,
};

const typeColorMap = {
  agent: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  pipeline: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  system: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
};

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('all');
  const [notifications, setNotifications] = useState(mockNotifications);

  const filtered = notifications.filter((n) => {
    if (activeTab === 'unread') return !n.read;
    if (activeTab === 'agents') return n.type === 'agent';
    if (activeTab === 'pipeline') return n.type === 'pipeline';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Notifications</h1>
          <p className="text-zinc-500 mt-1">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
              : 'All caught up!'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 hover:bg-[#18181b] transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </button>
          <button
            onClick={clearAll}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-red-400 hover:bg-red-400/5 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear all
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-[#18181b] border border-[#27272a] mb-6 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-zinc-100'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="notif-tab"
                className="absolute inset-0 bg-[#27272a] rounded-lg"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      {/* Notifications list */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl border border-[#27272a] bg-[#0a0a0c]/80 p-12 text-center"
            >
              <Bell className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
              <p className="text-zinc-500">No notifications</p>
            </motion.div>
          ) : (
            filtered.map((notification) => {
              const Icon = typeIconMap[notification.type];
              return (
                <motion.div
                  key={notification.id}
                  layout
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onClick={() => markAsRead(notification.id)}
                  className={`rounded-xl border bg-[#0a0a0c]/80 p-4 cursor-pointer transition-colors hover:bg-[#18181b] ${
                    notification.read
                      ? 'border-[#27272a]'
                      : 'border-indigo-500/20 bg-indigo-500/[0.02]'
                  }`}
                >
                  <div className="flex gap-4">
                    <div
                      className={`shrink-0 w-10 h-10 rounded-xl border flex items-center justify-center ${typeColorMap[notification.type]}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <h4
                            className={`text-sm font-medium ${
                              notification.read ? 'text-zinc-400' : 'text-zinc-200'
                            }`}
                          >
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                          )}
                        </div>
                        <span className="text-xs text-zinc-600 whitespace-nowrap shrink-0">
                          {notification.time}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-500 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
