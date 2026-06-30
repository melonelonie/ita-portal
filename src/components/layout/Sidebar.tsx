import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  UserCog,
  Bot,
  BarChart3,
  Activity,
  Briefcase,
  GitBranch,
  ScanSearch,
  Video,
  MessageSquare,
  Settings,
  UserCircle,
  ChevronsLeft,
  ChevronsRight,
  LogOut,
  type LucideIcon,
} from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';

interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const adminNavGroups: NavGroup[] = [
  {
    label: 'Main',
    items: [
      { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'Clients', path: '/admin/clients', icon: Briefcase },
      { label: 'Team', path: '/admin/team', icon: Users },
      { label: 'Agent Config', path: '/admin/agent-config', icon: Bot },
      { label: 'Reports', path: '/admin/reports', icon: BarChart3 },
      { label: 'Activity Logs', path: '/admin/activity', icon: Activity },
    ],
  },
];

const taNavGroups: NavGroup[] = [
  {
    label: 'Workspace',
    items: [
      { label: 'Dashboard', path: '/ta/dashboard', icon: LayoutDashboard },
      { label: 'JR Workspace', path: '/ta/jr-workspace', icon: Briefcase },
      { label: 'Pipeline', path: '/ta/pipeline', icon: GitBranch },
      { label: 'Screener', path: '/ta/screener', icon: ScanSearch },
      { label: 'Interviews', path: '/ta/interviews', icon: Video },
      { label: 'Reports', path: '/ta/reports', icon: BarChart3 },
      { label: 'AI Chat', path: '/ta/ai', icon: MessageSquare },
    ],
  },
];

const sharedNavItems: NavItem[] = [
  { label: 'Settings', path: 'settings', icon: Settings },
  { label: 'Profile', path: 'profile', icon: UserCircle },
];

interface SidebarProps {
  role: 'admin' | 'ta';
}

export default function Sidebar({ role }: SidebarProps) {
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const navGroups = role === 'admin' ? adminNavGroups : taNavGroups;
  const basePath = role === 'admin' ? '/admin' : '/ta';

  return (
    <motion.aside
      className="relative flex flex-col h-screen border-r border-[#27272a] bg-[#09090b] select-none z-30"
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-[#27272a] shrink-0">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shrink-0">
            <span className="text-sm font-bold text-white">I</span>
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent whitespace-nowrap"
              >
                ITA Portal
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 space-y-6 scrollbar-thin">
        {navGroups.map((group) => (
          <div key={group.label}>
            <AnimatePresence>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-500"
                >
                  {group.label}
                </motion.p>
              )}
            </AnimatePresence>
            <ul className="space-y-1">
              {group.items.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-indigo-500/10 text-indigo-400'
                          : 'text-zinc-400 hover:bg-[#18181b] hover:text-zinc-200'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {/* Active accent bar */}
                        {isActive && (
                          <motion.div
                            layoutId="sidebar-active"
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-indigo-500"
                            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                          />
                        )}
                        <item.icon className="w-5 h-5 shrink-0" />
                        <AnimatePresence>
                          {!collapsed && (
                            <motion.span
                              initial={{ opacity: 0, width: 0 }}
                              animate={{ opacity: 1, width: 'auto' }}
                              exit={{ opacity: 0, width: 0 }}
                              transition={{ duration: 0.15 }}
                              className="whitespace-nowrap overflow-hidden"
                            >
                              {item.label}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Shared items */}
        <div>
          <AnimatePresence>
            {!collapsed && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-500"
              >
                Account
              </motion.p>
            )}
          </AnimatePresence>
          <ul className="space-y-1">
            {sharedNavItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={`${basePath}/${item.path}`}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-indigo-500/10 text-indigo-400'
                        : 'text-zinc-400 hover:bg-[#18181b] hover:text-zinc-200'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-active"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-indigo-500"
                          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                        />
                      )}
                      <item.icon className="w-5 h-5 shrink-0" />
                      <AnimatePresence>
                        {!collapsed && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.15 }}
                            className="whitespace-nowrap overflow-hidden"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* User info card */}
      <div className="border-t border-[#27272a] p-2 shrink-0">
        <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-[#18181b] transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {user?.name?.charAt(0) ?? 'U'}
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
                className="flex-1 min-w-0 overflow-hidden"
              >
                <p className="text-sm font-medium text-zinc-200 truncate">
                  {user?.name ?? 'User'}
                </p>
                <p className="text-xs text-zinc-500 truncate capitalize">
                  {user?.role ?? 'Unknown'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {!collapsed && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={logout}
                className="p-1.5 rounded-md text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-colors shrink-0"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Collapse toggle */}
      <div className="border-t border-[#27272a] p-2 shrink-0">
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center w-full rounded-lg p-2 text-zinc-500 hover:text-zinc-200 hover:bg-[#18181b] transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronsRight className="w-5 h-5" />
          ) : (
            <ChevronsLeft className="w-5 h-5" />
          )}
        </button>
      </div>
    </motion.aside>
  );
}
