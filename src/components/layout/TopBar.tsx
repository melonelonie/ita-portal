import { useState, useRef, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bell,
  Sun,
  Moon,
  ChevronRight,
  LogOut,
  Settings,
  UserCircle,
} from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';

const routeLabels: Record<string, string> = {
  admin: 'Admin',
  ta: 'Talent Acquisition',
  dashboard: 'Dashboard',
  clients: 'Clients',
  team: 'Team',
  'agent-config': 'Agent Config',
  reports: 'Reports',
  activity: 'Activity Logs',
  'jr-workspace': 'JR Workspace',
  pipeline: 'Pipeline',
  screener: 'Screener',
  interviews: 'Interviews',
  ai: 'AI Chat',
  settings: 'Settings',
  profile: 'Profile',
  notifications: 'Notifications',
};

export default function TopBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const theme = useUIStore((s) => s.theme);
  const toggleTheme = useUIStore((s) => s.toggleTheme);
  const setCommandPaletteOpen = useUIStore((s) => s.setCommandPaletteOpen);

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Generate breadcrumbs from route
  const breadcrumbs = useMemo(() => {
    const segments = location.pathname.split('/').filter(Boolean);
    return segments.map((seg, idx) => ({
      label: routeLabels[seg] || seg.charAt(0).toUpperCase() + seg.slice(1),
      path: '/' + segments.slice(0, idx + 1).join('/'),
      isLast: idx === segments.length - 1,
    }));
  }, [location.pathname]);

  const unreadCount = 3; // Mock unread count

  const basePath = user?.role === 'admin' ? '/admin' : '/ta';

  return (
    <header className="flex items-center justify-between h-16 px-6 border-b border-[#27272a] bg-[#09090b]/80 backdrop-blur-sm shrink-0 z-20">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-sm">
        {breadcrumbs.map((crumb, idx) => (
          <div key={crumb.path} className="flex items-center gap-1.5">
            {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />}
            {crumb.isLast ? (
              <span className="font-medium text-zinc-200">{crumb.label}</span>
            ) : (
              <button
                onClick={() => navigate(crumb.path)}
                className="text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {crumb.label}
              </button>
            )}
          </div>
        ))}
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center gap-2 h-9 px-3 rounded-lg border border-[#27272a] bg-[#18181b] text-zinc-500 hover:text-zinc-300 hover:border-[#3f3f46] transition-all text-sm"
        >
          <Search className="w-4 h-4" />
          <span className="hidden md:inline">Search...</span>
          <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[#27272a] text-[10px] font-mono text-zinc-500">
            ⌘K
          </kbd>
        </button>

        {/* Notifications */}
        <button
          onClick={() => navigate(`${basePath}/notifications`)}
          className="relative p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-[#18181b] transition-colors"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 rounded-full bg-indigo-500 text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-[#18181b] transition-colors"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        {/* User dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#18181b] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
              {user?.name?.charAt(0) ?? 'U'}
            </div>
          </button>

          <AnimatePresence>
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-56 rounded-xl border border-[#27272a] bg-[#09090b] shadow-2xl shadow-black/50 overflow-hidden z-50"
              >
                {/* User info */}
                <div className="px-4 py-3 border-b border-[#27272a]">
                  <p className="text-sm font-medium text-zinc-200">{user?.name}</p>
                  <p className="text-xs text-zinc-500">{user?.email}</p>
                </div>

                {/* Menu items */}
                <div className="py-1">
                  <button
                    onClick={() => {
                      navigate(`${basePath}/profile`);
                      setShowDropdown(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-zinc-400 hover:text-zinc-200 hover:bg-[#18181b] transition-colors"
                  >
                    <UserCircle className="w-4 h-4" />
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      navigate(`${basePath}/settings`);
                      setShowDropdown(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-zinc-400 hover:text-zinc-200 hover:bg-[#18181b] transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                </div>

                <div className="border-t border-[#27272a] py-1">
                  <button
                    onClick={() => {
                      logout();
                      navigate('/login');
                      setShowDropdown(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-400/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Log out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
