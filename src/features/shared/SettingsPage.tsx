import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserCircle, Palette, Bell, Save, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';

type Tab = 'profile' | 'appearance' | 'notifications';

const tabs: { id: Tab; label: string; icon: typeof UserCircle }[] = [
  { id: 'profile', label: 'Profile', icon: UserCircle },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const user = useAuthStore((s) => s.user);
  const theme = useUIStore((s) => s.theme);
  const toggleTheme = useUIStore((s) => s.toggleTheme);
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed);
  const setSidebarCollapsed = useUIStore((s) => s.setSidebarCollapsed);

  const [notifications, setNotifications] = useState({
    email: true,
    agentAlerts: true,
    pipelineUpdates: false,
  });

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSaving(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-100">Settings</h1>
        <p className="text-zinc-500 mt-1">Manage your account preferences</p>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 p-1 rounded-xl bg-[#18181b] border border-[#27272a] mb-8 w-fit">
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
                layoutId="settings-tab"
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

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-[#27272a] bg-[#0a0a0c]/80 backdrop-blur-sm p-6 space-y-6"
        >
          <h3 className="text-lg font-semibold text-zinc-200">Profile Information</h3>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
              {user?.name?.charAt(0) ?? 'U'}
            </div>
            <div>
              <p className="text-lg font-medium text-zinc-200">{user?.name}</p>
              <p className="text-sm text-zinc-500 capitalize">{user?.role}</p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Full Name</label>
              <input
                type="text"
                defaultValue={user?.name}
                className="w-full h-10 px-3 rounded-lg border border-[#27272a] bg-[#18181b] text-zinc-200 outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Email</label>
              <input
                type="email"
                defaultValue={user?.email}
                readOnly
                className="w-full h-10 px-3 rounded-lg border border-[#27272a] bg-[#18181b] text-zinc-500 outline-none cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Role</label>
              <input
                type="text"
                value={user?.role === 'admin' ? 'Administrator' : 'Talent Acquisition'}
                readOnly
                className="w-full h-10 px-3 rounded-lg border border-[#27272a] bg-[#18181b] text-zinc-500 outline-none cursor-not-allowed capitalize"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-[#27272a]">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition-colors disabled:opacity-70"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
          </div>
        </motion.div>
      )}

      {/* Appearance Tab */}
      {activeTab === 'appearance' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="rounded-2xl border border-[#27272a] bg-[#0a0a0c]/80 backdrop-blur-sm p-6">
            <h3 className="text-lg font-semibold text-zinc-200 mb-4">Theme</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-300">Dark mode</p>
                <p className="text-xs text-zinc-500 mt-0.5">Toggle between light and dark themes</p>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative w-12 h-7 rounded-full transition-colors ${
                  theme === 'dark' ? 'bg-indigo-600' : 'bg-[#27272a]'
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${
                    theme === 'dark' ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-[#27272a] bg-[#0a0a0c]/80 backdrop-blur-sm p-6">
            <h3 className="text-lg font-semibold text-zinc-200 mb-4">Sidebar</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-300">Collapsed by default</p>
                <p className="text-xs text-zinc-500 mt-0.5">Start with the sidebar collapsed on page load</p>
              </div>
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className={`relative w-12 h-7 rounded-full transition-colors ${
                  sidebarCollapsed ? 'bg-indigo-600' : 'bg-[#27272a]'
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${
                    sidebarCollapsed ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-[#27272a] bg-[#0a0a0c]/80 backdrop-blur-sm p-6"
        >
          <h3 className="text-lg font-semibold text-zinc-200 mb-6">Notification Preferences</h3>

          <div className="space-y-5">
            {[
              {
                key: 'email' as const,
                title: 'Email Notifications',
                desc: 'Receive email updates for important events',
              },
              {
                key: 'agentAlerts' as const,
                title: 'Agent Alerts',
                desc: 'Get notified when AI agents complete tasks or need attention',
              },
              {
                key: 'pipelineUpdates' as const,
                title: 'Pipeline Updates',
                desc: 'Receive updates when candidates move through the pipeline',
              },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm text-zinc-300">{item.title}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{item.desc}</p>
                </div>
                <button
                  onClick={() =>
                    setNotifications((prev) => ({
                      ...prev,
                      [item.key]: !prev[item.key],
                    }))
                  }
                  className={`relative w-12 h-7 rounded-full transition-colors ${
                    notifications[item.key] ? 'bg-indigo-600' : 'bg-[#27272a]'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${
                      notifications[item.key] ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-6 mt-6 border-t border-[#27272a]">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition-colors disabled:opacity-70"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Preferences
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
