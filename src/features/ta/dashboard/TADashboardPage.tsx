import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Briefcase, Calendar, TrendingUp, ArrowUpRight, ArrowDownRight,
  Bot, Clock, CheckCircle2, AlertTriangle, Sparkles, ChevronRight,
  Eye, FileText, UserCheck, MessageSquare
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

// ── Mock Data ──────────────────────────────────────────────

const metrics = [
  { label: 'My Active Clients', value: '5', trend: +2, icon: Users, color: '#6366f1' },
  { label: 'Open JRs', value: '8', trend: +15, icon: Briefcase, color: '#a78bfa' },
  { label: 'Candidates in Pipeline', value: '42', trend: +8, icon: UserCheck, color: '#3b82f6' },
  { label: 'Interviews This Week', value: '6', trend: -10, icon: Calendar, color: '#f59e0b' },
];

const performanceData = [
  { month: 'Oct', placements: 3, target: 4 },
  { month: 'Nov', placements: 5, target: 4 },
  { month: 'Dec', placements: 2, target: 4 },
  { month: 'Jan', placements: 6, target: 5 },
  { month: 'Feb', placements: 4, target: 5 },
  { month: 'Mar', placements: 7, target: 5 },
];

const pipelineSnapshot = [
  { stage: 'Applied', count: 12, color: '#6366f1' },
  { stage: 'Screened', count: 8, color: '#8b5cf6' },
  { stage: 'Shortlisted', count: 6, color: '#a78bfa' },
  { stage: 'Interview R1', count: 5, color: '#f59e0b' },
  { stage: 'Interview R2', count: 4, color: '#f97316' },
  { stage: 'Final Round', count: 3, color: '#ec4899' },
  { stage: 'Offered', count: 2, color: '#22c55e' },
  { stage: 'Placed', count: 2, color: '#10b981' },
];

const funnelData = [
  { name: 'Applied', value: 42, fill: '#6366f1' },
  { name: 'Screened', value: 28, fill: '#8b5cf6' },
  { name: 'Shortlisted', value: 16, fill: '#a78bfa' },
  { name: 'Interviewed', value: 10, fill: '#f59e0b' },
  { name: 'Offered', value: 4, fill: '#22c55e' },
  { name: 'Placed', value: 3, fill: '#10b981' },
];

const approvalTasks = [
  { id: 1, type: 'Review JR', title: 'Senior Frontend Engineer - TechVista', agent: 'JR Drafter', urgency: 'high', time: '10 min ago' },
  { id: 2, type: 'Review Shortlist', title: '8 candidates for Backend Lead - Nexus', agent: 'Screener', urgency: 'medium', time: '1 hr ago' },
  { id: 3, type: 'Approve Offer', title: 'Data Scientist - Meridian Analytics', agent: 'Pipeline Tracker', urgency: 'high', time: '2 hrs ago' },
  { id: 4, type: 'Review Report', title: 'Weekly performance summary', agent: 'Report Generator', urgency: 'low', time: '3 hrs ago' },
];

const aiInsights = [
  { id: 1, text: '3 candidates stalled in Interview R1 for >5 days. Consider scheduling follow-ups.', type: 'warning', action: 'View Candidates' },
  { id: 2, text: 'New high-match candidate (94%) found for Frontend Lead at TechVista.', type: 'opportunity', action: 'Review Candidate' },
  { id: 3, text: 'Client CloudPeak has 2 JRs with no submissions in 7 days.', type: 'alert', action: 'View JRs' },
  { id: 4, text: 'Your placement rate improved 12% this month. Great work!', type: 'success', action: null },
];

const upcomingInterviews = [
  { id: 1, candidate: 'Alex Johnson', role: 'Frontend Lead', round: 'R2', time: 'Today, 2:00 PM', client: 'TechVista' },
  { id: 2, candidate: 'Maria Garcia', role: 'Backend Engineer', round: 'R1', time: 'Today, 4:30 PM', client: 'Nexus' },
  { id: 3, candidate: 'James Wilson', role: 'DevOps Lead', round: 'Final', time: 'Tomorrow, 10:00 AM', client: 'CloudPeak' },
  { id: 4, candidate: 'Priya Sharma', role: 'Data Scientist', round: 'R1', time: 'Tomorrow, 2:00 PM', client: 'Meridian' },
];

const recentActivity = [
  { id: 1, action: 'Approved JR for "ML Engineer" at Meridian Analytics', time: '30 min ago', icon: CheckCircle2, color: '#22c55e' },
  { id: 2, action: 'Reviewed shortlist: 5 candidates for Backend Lead', time: '2 hrs ago', icon: Eye, color: '#6366f1' },
  { id: 3, action: 'Scheduled Interview R2 for Alex Johnson', time: '3 hrs ago', icon: Calendar, color: '#f59e0b' },
  { id: 4, action: 'Added note on candidate James Wilson', time: '5 hrs ago', icon: MessageSquare, color: '#8b5cf6' },
  { id: 5, action: 'Generated report: Monthly client activity', time: '1 day ago', icon: FileText, color: '#3b82f6' },
];

// ── Components ─────────────────────────────────────────────

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="rounded-lg border border-white/10 bg-zinc-900/95 backdrop-blur-xl px-3 py-2 shadow-xl">
      <p className="text-xs font-medium text-zinc-300 mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-xs" style={{ color: entry.color }}>
          {entry.name}: <span className="font-semibold">{entry.value}</span>
        </p>
      ))}
    </div>
  );
};

// ── Main Page ──────────────────────────────────────────────

export default function TADashboardPage() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Welcome */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">{greeting}, Sarah 👋</h1>
          <p className="text-sm text-zinc-500 mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-purple-500/20 bg-purple-500/5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500" />
          </span>
          <span className="text-xs text-purple-400 font-medium">4 AI agents active</span>
        </div>
      </motion.div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          const isPositive = m.trend > 0;
          return (
            <motion.div key={m.label} variants={item} className="rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-5 hover:border-white/[0.12] transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 rounded-lg" style={{ backgroundColor: `${m.color}15` }}>
                  <Icon className="w-5 h-5" style={{ color: m.color }} />
                </div>
                <div className={`flex items-center gap-0.5 text-xs font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  {Math.abs(m.trend)}%
                </div>
              </div>
              <p className="text-2xl font-bold text-zinc-100 mb-1">{m.value}</p>
              <p className="text-xs text-zinc-500">{m.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Pipeline Snapshot + Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-5">
          <h3 className="text-sm font-semibold text-zinc-200 mb-4">Pipeline Snapshot</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineSnapshot} layout="vertical" barSize={16}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#71717a' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="stage" type="category" tick={{ fontSize: 10, fill: '#71717a' }} axisLine={false} tickLine={false} width={80} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Candidates" radius={[0, 6, 6, 0]}>
                  {pipelineSnapshot.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-5">
          <h3 className="text-sm font-semibold text-zinc-200 mb-4">My Performance</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="gradPerf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#71717a' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#71717a' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="target" name="Target" stroke="#71717a" strokeDasharray="4 4" fill="none" strokeWidth={1.5} />
                <Area type="monotone" dataKey="placements" name="Placements" stroke="#6366f1" fill="url(#gradPerf)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Tasks + AI Insights + Interviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Tasks Requiring Approval */}
        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              Pending Approvals
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-medium">{approvalTasks.length}</span>
          </div>
          <div className="space-y-2">
            {approvalTasks.map((task) => (
              <div key={task.id} className="p-3 rounded-lg border border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer group">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${task.urgency === 'high' ? 'bg-red-500/10 text-red-400' : task.urgency === 'medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-zinc-500/10 text-zinc-400'}`}>
                        {task.type}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300">{task.title}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors shrink-0 mt-1" />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Bot className="w-3 h-3 text-purple-400" />
                  <span className="text-[10px] text-purple-400">{task.agent}</span>
                  <span className="text-[10px] text-zinc-600">· {task.time}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* AI Insights */}
        <motion.div variants={item} className="rounded-xl border border-purple-500/10 bg-purple-500/[0.02] backdrop-blur-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              AI Insights
            </h3>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500" />
            </span>
          </div>
          <div className="space-y-2">
            {aiInsights.map((insight) => (
              <div key={insight.id} className="p-3 rounded-lg border border-purple-500/10 bg-purple-500/[0.03] hover:bg-purple-500/[0.06] transition-colors">
                <div className="flex items-start gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${insight.type === 'warning' ? 'bg-amber-400' : insight.type === 'alert' ? 'bg-red-400' : insight.type === 'success' ? 'bg-emerald-400' : 'bg-indigo-400'}`} />
                  <p className="text-xs text-zinc-300 leading-relaxed">{insight.text}</p>
                </div>
                {insight.action && (
                  <button className="mt-2 ml-3.5 text-[10px] text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1">
                    {insight.action} <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Interviews */}
        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              Upcoming Interviews
            </h3>
            <button className="text-xs text-indigo-400 hover:text-indigo-300">View all</button>
          </div>
          <div className="space-y-2">
            {upcomingInterviews.map((interview) => (
              <div key={interview.id} className="p-3 rounded-lg border border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-200">{interview.candidate}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{interview.role} · {interview.client}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-medium">{interview.round}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Clock className="w-3 h-3 text-zinc-500" />
                  <span className="text-[10px] text-zinc-400">{interview.time}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity + Candidate Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-5">
          <h3 className="text-sm font-semibold text-zinc-200 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((act) => {
              const Icon = act.icon;
              return (
                <div key={act.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/[0.03] transition-colors">
                  <div className="p-1.5 rounded-lg shrink-0 mt-0.5" style={{ backgroundColor: `${act.color}15` }}>
                    <Icon className="w-3.5 h-3.5" style={{ color: act.color }} />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-300 leading-relaxed">{act.action}</p>
                    <p className="text-[10px] text-zinc-600 mt-1">{act.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-5">
          <h3 className="text-sm font-semibold text-zinc-200 mb-4">Candidate Funnel</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={funnelData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value" stroke="none">
                  {funnelData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            {funnelData.map((f) => (
              <div key={f.name} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: f.fill }} />
                <span className="text-[10px] text-zinc-500">{f.name} ({f.value})</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
