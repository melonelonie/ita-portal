import { motion } from 'framer-motion';
import {
  Camera,
  Briefcase,
  FileText,
  Trophy,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const activityTimeline = [
  { action: 'Updated pipeline for Senior React Developer', time: '2 hours ago', type: 'pipeline' },
  { action: 'Completed screener for Backend Engineer role', time: '5 hours ago', type: 'screener' },
  { action: 'Added 3 candidates to JR-2024-042', time: '1 day ago', type: 'candidate' },
  { action: 'Scheduled interview with John Doe', time: '1 day ago', type: 'interview' },
  { action: 'Generated AI sourcing report', time: '2 days ago', type: 'report' },
  { action: 'Created new Job Requisition JR-2024-043', time: '3 days ago', type: 'requisition' },
];

const stats = [
  { label: 'Clients Assigned', value: '8', icon: Briefcase, color: 'from-indigo-500 to-blue-500' },
  { label: 'JRs Created', value: '24', icon: FileText, color: 'from-purple-500 to-pink-500' },
  { label: 'Placements', value: '12', icon: Trophy, color: 'from-amber-500 to-orange-500' },
  { label: 'Avg. Time to Fill', value: '18d', icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
];

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-100">Profile</h1>
        <p className="text-zinc-500 mt-1">Your account details and activity</p>
      </div>

      {/* Profile header card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-[#27272a] bg-[#0a0a0c]/80 backdrop-blur-sm p-6 mb-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-indigo-500/20">
              {user?.name?.charAt(0) ?? 'U'}
            </div>
            <button className="absolute -bottom-1 -right-1 p-1.5 rounded-lg bg-[#18181b] border border-[#27272a] text-zinc-400 hover:text-zinc-200 transition-colors opacity-0 group-hover:opacity-100">
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-bold text-zinc-100">{user?.name}</h2>
            <p className="text-sm text-zinc-500">{user?.email}</p>
            <div className="mt-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 capitalize">
                {user?.role === 'admin' ? 'Administrator' : 'Talent Acquisition'}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="rounded-xl border border-[#27272a] bg-[#0a0a0c]/80 backdrop-blur-sm p-4"
          >
            <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 opacity-80`}>
              <stat.icon className="w-4.5 h-4.5 text-white" />
            </div>
            <p className="text-2xl font-bold text-zinc-100">{stat.value}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Activity timeline */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-[#27272a] bg-[#0a0a0c]/80 backdrop-blur-sm p-6"
      >
        <h3 className="text-lg font-semibold text-zinc-200 mb-5">Recent Activity</h3>

        <div className="space-y-0">
          {activityTimeline.map((item, idx) => (
            <div key={idx} className="flex gap-4 relative">
              {/* Timeline line */}
              {idx < activityTimeline.length - 1 && (
                <div className="absolute left-[11px] top-6 w-px h-[calc(100%)] bg-[#27272a]" />
              )}

              {/* Dot */}
              <div className="relative shrink-0 mt-1.5">
                <div className="w-[9px] h-[9px] rounded-full bg-indigo-500 ring-4 ring-[#0a0a0c]" />
              </div>

              {/* Content */}
              <div className="pb-6 min-w-0">
                <p className="text-sm text-zinc-300">{item.action}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Clock className="w-3 h-3 text-zinc-600" />
                  <p className="text-xs text-zinc-600">{item.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
