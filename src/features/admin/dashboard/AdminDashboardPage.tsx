import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Briefcase, UserCheck, Calendar, TrendingUp, Activity,
  AlertTriangle, Bot, ArrowUpRight, ArrowDownRight, Clock,
  Building2, BarChart3, Zap, ChevronRight, RefreshCw
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

// ── Mock Data ──────────────────────────────────────────────

const metrics = [
  { label: 'Active Clients', value: '12', trend: +8, icon: Building2, color: '#6366f1' },
  { label: 'Open JRs', value: '23', trend: +12, icon: Briefcase, color: '#a78bfa' },
  { label: 'Candidates in Pipeline', value: '156', trend: +5, icon: Users, color: '#3b82f6' },
  { label: 'Interviews Scheduled', value: '18', trend: -3, icon: Calendar, color: '#f59e0b' },
  { label: 'Placement Rate', value: '34%', trend: +2.5, icon: TrendingUp, color: '#22c55e' },
  { label: 'TA Productivity', value: '87%', trend: +4, icon: Activity, color: '#10b981' },
  { label: 'Pipeline Bottlenecks', value: '3', trend: -1, icon: AlertTriangle, color: '#ef4444' },
  { label: 'Agent Actions Today', value: '247', trend: +15, icon: Bot, color: '#8b5cf6' },
];

const pipelineData = [
  { stage: 'Applied', count: 42, color: '#6366f1' },
  { stage: 'Screened', count: 35, color: '#8b5cf6' },
  { stage: 'Shortlisted', count: 28, color: '#a78bfa' },
  { stage: 'Interview R1', count: 20, color: '#f59e0b' },
  { stage: 'Interview R2', count: 12, color: '#f97316' },
  { stage: 'Final Round', count: 8, color: '#ec4899' },
  { stage: 'Offered', count: 6, color: '#22c55e' },
  { stage: 'Placed', count: 5, color: '#10b981' },
];

const monthlyData = [
  { month: 'Oct', placements: 8, submissions: 45, interviews: 22 },
  { month: 'Nov', placements: 12, submissions: 52, interviews: 28 },
  { month: 'Dec', placements: 6, submissions: 38, interviews: 15 },
  { month: 'Jan', placements: 15, submissions: 61, interviews: 34 },
  { month: 'Feb', placements: 11, submissions: 48, interviews: 26 },
  { month: 'Mar', placements: 18, submissions: 67, interviews: 38 },
];

const agentActivity = [
  { id: 1, agent: 'JR Drafter', action: 'Generated JR for "Senior Backend Engineer" at TechVista', time: '2 min ago', status: 'completed' },
  { id: 2, agent: 'Screener', action: 'Scored 12 candidates for Frontend Lead position', time: '8 min ago', status: 'completed' },
  { id: 3, agent: 'Pipeline Tracker', action: 'Detected stall: 3 candidates in Interview R1 > 7 days', time: '15 min ago', status: 'alert' },
  { id: 4, agent: 'Report Generator', action: 'Generated weekly performance report', time: '1 hr ago', status: 'completed' },
  { id: 5, agent: 'Screener', action: 'Auto-rejected 4 candidates below threshold (< 40%)', time: '2 hrs ago', status: 'completed' },
  { id: 6, agent: 'JR Drafter', action: 'Refined JR v3 for "DevOps Engineer" role', time: '3 hrs ago', status: 'completed' },
];

const slaViolations = [
  { id: 1, candidate: 'Alex Johnson', stage: 'Interview R1', days: 12, jr: 'Frontend Lead', severity: 'high' },
  { id: 2, candidate: 'Maria Garcia', stage: 'Shortlisted', days: 8, jr: 'Backend Engineer', severity: 'medium' },
  { id: 3, candidate: 'James Wilson', stage: 'Interview R2', days: 6, jr: 'DevOps Lead', severity: 'medium' },
  { id: 4, candidate: 'Priya Sharma', stage: 'Offered', days: 7, jr: 'Data Scientist', severity: 'high' },
];

const taLeaderboard = [
  { name: 'Sarah Mitchell', placements: 7, pipeline: 24, score: 94, avatar: 'SM' },
  { name: 'David Chen', placements: 6, pipeline: 19, score: 89, avatar: 'DC' },
  { name: 'Emma Rodriguez', placements: 5, pipeline: 22, score: 85, avatar: 'ER' },
  { name: 'Raj Patel', placements: 4, pipeline: 16, score: 78, avatar: 'RP' },
  { name: 'Lisa Thompson', placements: 3, pipeline: 14, score: 72, avatar: 'LT' },
];

const clientActivity = [
  { client: 'TechVista Solutions', action: 'New JR added: Senior Backend Engineer', time: '30 min ago', type: 'new' },
  { client: 'Nexus Dynamics', action: 'Candidate placed: React Developer', time: '2 hrs ago', type: 'success' },
  { client: 'CloudPeak Systems', action: 'Interview feedback received for ML Engineer', time: '4 hrs ago', type: 'update' },
  { client: 'Meridian Analytics', action: '3 new candidates submitted', time: '5 hrs ago', type: 'new' },
  { client: 'Apex Innovations', action: 'JR closed: Product Manager', time: '1 day ago', type: 'closed' },
];

const funnelData = [
  { name: 'Applied', value: 156, fill: '#6366f1' },
  { name: 'Screened', value: 98, fill: '#8b5cf6' },
  { name: 'Shortlisted', value: 52, fill: '#a78bfa' },
  { name: 'Interviewed', value: 34, fill: '#f59e0b' },
  { name: 'Offered', value: 12, fill: '#22c55e' },
  { name: 'Placed', value: 8, fill: '#10b981' },
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

function MetricCard({ metric, index }: { metric: typeof metrics[0]; index: number }) {
  const Icon = metric.icon;
  const isPositive = metric.trend > 0;
  return (
    <motion.div
      variants={item}
      className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-5 hover:border-white/[0.12] transition-all duration-300 group"
    >
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-[0.04] -translate-y-8 translate-x-8 group-hover:opacity-[0.08] transition-opacity" style={{ background: metric.color }} />
      <div className="flex items-start justify-between mb-3">
        <div className="p-2.5 rounded-lg" style={{ backgroundColor: `${metric.color}15` }}>
          <Icon className="w-5 h-5" style={{ color: metric.color }} />
        </div>
        <div className={`flex items-center gap-0.5 text-xs font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
          {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
          {Math.abs(metric.trend)}%
        </div>
      </div>
      <p className="text-2xl font-bold text-zinc-100 mb-1">{metric.value}</p>
      <p className="text-xs text-zinc-500">{metric.label}</p>
    </motion.div>
  );
}

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

export default function AdminDashboardPage() {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Dashboard</h1>
          <p className="text-sm text-zinc-500 mt-1">Real-time recruitment operations overview</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-sm text-zinc-300 hover:bg-white/10 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <MetricCard key={m.label} metric={m} index={i} />
        ))}
      </div>

      {/* Pipeline Health + Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-zinc-200">Pipeline Health Overview</h3>
            <span className="text-xs text-zinc-500">All active JRs</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="stage" tick={{ fontSize: 11, fill: '#71717a' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#71717a' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Candidates" radius={[6, 6, 0, 0]}>
                  {pipelineData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-zinc-200">Candidate Movement Funnel</h3>
            <span className="text-xs text-zinc-500">Conversion rates</span>
          </div>
          <div className="space-y-3 mt-2">
            {funnelData.map((stage, i) => {
              const maxVal = funnelData[0].value;
              const pct = (stage.value / maxVal) * 100;
              const convRate = i > 0 ? Math.round((stage.value / funnelData[i - 1].value) * 100) : 100;
              return (
                <div key={stage.name} className="flex items-center gap-3">
                  <span className="text-xs text-zinc-500 w-20 text-right shrink-0">{stage.name}</span>
                  <div className="flex-1 h-8 bg-white/[0.03] rounded-lg overflow-hidden relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      className="h-full rounded-lg flex items-center justify-end pr-2"
                      style={{ backgroundColor: stage.fill }}
                    >
                      <span className="text-xs font-bold text-white">{stage.value}</span>
                    </motion.div>
                  </div>
                  <span className="text-xs text-zinc-500 w-10 shrink-0">{convRate}%</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Agent Activity + SLA Violations + TA Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Agent Activity Feed */}
        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
              <Bot className="w-4 h-4 text-purple-400" />
              Agent Activity
            </h3>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500" />
            </span>
          </div>
          <div className="space-y-3 max-h-72 overflow-y-auto custom-scrollbar">
            {agentActivity.map((a) => (
              <div key={a.id} className="flex gap-3 p-2 rounded-lg hover:bg-white/[0.03] transition-colors">
                <div className={`w-1.5 rounded-full shrink-0 mt-1 ${a.status === 'alert' ? 'bg-amber-400' : 'bg-purple-400'}`} />
                <div className="min-w-0">
                  <p className="text-xs text-zinc-300 leading-relaxed">{a.action}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-purple-400 font-medium">{a.agent}</span>
                    <span className="text-[10px] text-zinc-600">·</span>
                    <span className="text-[10px] text-zinc-600">{a.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* SLA Violations */}
        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              SLA Violations
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 font-medium">{slaViolations.length} active</span>
          </div>
          <div className="space-y-2">
            {slaViolations.map((v) => (
              <div key={v.id} className="p-3 rounded-lg border border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-200">{v.candidate}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{v.jr}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${v.severity === 'high' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>
                    {v.severity}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Clock className="w-3 h-3 text-zinc-600" />
                  <span className="text-[11px] text-zinc-500">Stuck in <span className="text-zinc-400">{v.stage}</span> for <span className="text-red-400 font-medium">{v.days} days</span></span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* TA Leaderboard */}
        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              TA Performance
            </h3>
            <span className="text-xs text-zinc-500">This month</span>
          </div>
          <div className="space-y-2">
            {taLeaderboard.map((ta, i) => (
              <div key={ta.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/[0.03] transition-colors">
                <span className={`text-xs font-bold w-5 text-center ${i === 0 ? 'text-amber-400' : i === 1 ? 'text-zinc-400' : i === 2 ? 'text-orange-400' : 'text-zinc-600'}`}>
                  #{i + 1}
                </span>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-white">{ta.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-zinc-200 font-medium truncate">{ta.name}</p>
                  <p className="text-[10px] text-zinc-500">{ta.placements} placements · {ta.pipeline} in pipeline</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-zinc-200">{ta.score}</p>
                  <p className="text-[10px] text-zinc-500">score</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Monthly Metrics + Client Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-zinc-200">Monthly Hiring Metrics</h3>
            <span className="text-xs text-zinc-500">Last 6 months</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="gradPlacements" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradSubmissions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#71717a' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#71717a' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="submissions" name="Submissions" stroke="#22c55e" fill="url(#gradSubmissions)" strokeWidth={2} />
                <Area type="monotone" dataKey="placements" name="Placements" stroke="#6366f1" fill="url(#gradPlacements)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-400" />
              Client Activity
            </h3>
            <button className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {clientActivity.map((ca, i) => (
              <div key={i} className="flex gap-3 p-2 rounded-lg hover:bg-white/[0.03] transition-colors">
                <div className={`w-1.5 rounded-full shrink-0 mt-1 ${ca.type === 'success' ? 'bg-emerald-400' : ca.type === 'new' ? 'bg-indigo-400' : ca.type === 'closed' ? 'bg-zinc-500' : 'bg-amber-400'}`} />
                <div className="min-w-0">
                  <p className="text-xs text-zinc-300 leading-relaxed">{ca.action}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-indigo-400 font-medium">{ca.client}</span>
                    <span className="text-[10px] text-zinc-600">·</span>
                    <span className="text-[10px] text-zinc-600">{ca.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
