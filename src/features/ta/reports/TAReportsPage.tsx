import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, TrendingUp, Users, Clock, Sparkles, Download,
  ChevronRight, Send, Building2, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

// ── Mock Data ──────────────────────────────────────────────

const performanceMetrics = [
  { label: 'Total Placements', value: '27', trend: +12, icon: Users, color: '#22c55e' },
  { label: 'Avg Time to Fill', value: '18 days', trend: -8, icon: Clock, color: '#f59e0b' },
  { label: 'Conversion Rate', value: '34%', trend: +5, icon: TrendingUp, color: '#6366f1' },
  { label: 'Active Pipeline', value: '42', trend: +15, icon: BarChart3, color: '#a78bfa' },
];

const monthlyPlacements = [
  { month: 'Oct', value: 3 }, { month: 'Nov', value: 5 }, { month: 'Dec', value: 2 },
  { month: 'Jan', value: 6 }, { month: 'Feb', value: 4 }, { month: 'Mar', value: 7 },
];

const clientMetrics = [
  { client: 'TechVista Solutions', openJRs: 3, submissions: 18, placements: 4, avgDays: 16, status: 'active' },
  { client: 'Nexus Dynamics', openJRs: 2, submissions: 12, placements: 3, avgDays: 21, status: 'active' },
  { client: 'CloudPeak Systems', openJRs: 1, submissions: 8, placements: 2, avgDays: 14, status: 'active' },
  { client: 'Meridian Analytics', openJRs: 2, submissions: 10, placements: 1, avgDays: 25, status: 'active' },
  { client: 'Apex Innovations', openJRs: 0, submissions: 6, placements: 2, avgDays: 19, status: 'inactive' },
];

const funnelData = [
  { stage: 'Applied', count: 156, pct: 100 },
  { stage: 'Screened', count: 98, pct: 63 },
  { stage: 'Shortlisted', count: 52, pct: 33 },
  { stage: 'Interviewed', count: 34, pct: 22 },
  { stage: 'Offered', count: 12, pct: 8 },
  { stage: 'Placed', count: 8, pct: 5 },
];

const funnelColors = ['#6366f1', '#8b5cf6', '#a78bfa', '#f59e0b', '#22c55e', '#10b981'];

const suggestedQueries = [
  'My placement ratio this month',
  'Which JRs have stalled?',
  'Top candidates for Frontend Lead',
  'Client-wise hiring velocity',
  'Compare my Q1 vs Q2 performance',
];

// ── Components ─────────────────────────────────────────────

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

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

export default function TAReportsPage() {
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isQuerying, setIsQuerying] = useState(false);

  const handleAiQuery = () => {
    if (!aiQuery.trim()) return;
    setIsQuerying(true);
    setTimeout(() => {
      setAiResponse(`Based on your recruitment data for this month:\n\n📊 **Placement Ratio**: 34% (7 placements from 42 candidates in pipeline)\n📈 **Trend**: Up 12% compared to last month\n🏆 **Top Performing JR**: Senior Frontend Engineer at TechVista (4 placements)\n⚠️ **Stalled Pipelines**: 3 candidates stuck in Interview R1 for >7 days\n\nYour conversion rate from shortlist to placement is performing above the team average of 28%. Keep it up!`);
      setIsQuerying(false);
    }, 2000);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">My Reports</h1>
          <p className="text-sm text-zinc-500 mt-1">Personal performance metrics and insights</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-sm text-zinc-300 hover:bg-white/10 transition-all">
          <Download className="w-4 h-4" /> Export All
        </button>
      </motion.div>

      {/* AI Query Section */}
      <motion.div variants={item} className="rounded-xl border border-purple-500/10 bg-purple-500/[0.02] backdrop-blur-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-semibold text-purple-400">AI Report Query</h3>
        </div>
        <div className="flex gap-2 mb-3">
          <input
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAiQuery()}
            placeholder="Ask anything about your recruitment data..."
            className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 border border-purple-500/20 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-purple-500 focus:outline-none"
          />
          <button onClick={handleAiQuery} disabled={!aiQuery.trim() || isQuerying} className="px-4 py-2.5 rounded-lg bg-purple-600 text-white hover:bg-purple-500 disabled:opacity-30 transition-all">
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-2 flex-wrap mb-3">
          {suggestedQueries.map((q) => (
            <button key={q} onClick={() => setAiQuery(q)} className="text-[10px] px-2.5 py-1 rounded-full border border-purple-500/20 text-purple-400 hover:bg-purple-500/10 transition-colors">
              {q}
            </button>
          ))}
        </div>
        {isQuerying && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-purple-500/5 border border-purple-500/10">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
            <span className="text-xs text-purple-400">Analyzing your data...</span>
          </div>
        )}
        {aiResponse && (
          <div className="p-4 rounded-lg bg-white/[0.03] border border-purple-500/10">
            <pre className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap font-sans">{aiResponse}</pre>
          </div>
        )}
      </motion.div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceMetrics.map((m) => {
          const Icon = m.icon;
          const isPositive = m.label === 'Avg Time to Fill' ? m.trend < 0 : m.trend > 0;
          return (
            <motion.div key={m.label} variants={item} className="rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-5 hover:border-white/[0.12] transition-all">
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Monthly Placements */}
        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-zinc-200">Monthly Placements</h3>
            <button className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1"><Download className="w-3 h-3" /> CSV</button>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyPlacements} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#71717a' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#71717a' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Placements" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Pipeline Funnel */}
        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-zinc-200">Pipeline Conversion Funnel</h3>
            <button className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1"><Download className="w-3 h-3" /> CSV</button>
          </div>
          <div className="space-y-3">
            {funnelData.map((stage, i) => (
              <div key={stage.stage} className="flex items-center gap-3">
                <span className="text-xs text-zinc-500 w-20 text-right shrink-0">{stage.stage}</span>
                <div className="flex-1 h-7 bg-white/[0.03] rounded-lg overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${stage.pct}%` }} transition={{ duration: 0.8, delay: i * 0.1 }} className="h-full rounded-lg flex items-center justify-end pr-2" style={{ backgroundColor: funnelColors[i] }}>
                    <span className="text-[10px] font-bold text-white">{stage.count}</span>
                  </motion.div>
                </div>
                <span className="text-xs text-zinc-500 w-10 shrink-0">{stage.pct}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Client Activity Table */}
      <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
          <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-400" />
            Client Activity
          </h3>
          <button className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1"><Download className="w-3 h-3" /> Export</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left text-xs font-medium text-zinc-500 px-5 py-3">Client</th>
                <th className="text-center text-xs font-medium text-zinc-500 px-3 py-3">Open JRs</th>
                <th className="text-center text-xs font-medium text-zinc-500 px-3 py-3">Submissions</th>
                <th className="text-center text-xs font-medium text-zinc-500 px-3 py-3">Placements</th>
                <th className="text-center text-xs font-medium text-zinc-500 px-3 py-3">Avg Days</th>
                <th className="text-center text-xs font-medium text-zinc-500 px-3 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {clientMetrics.map((c) => (
                <tr key={c.client} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3 text-sm font-medium text-zinc-200">{c.client}</td>
                  <td className="px-3 py-3 text-center text-sm text-zinc-400">{c.openJRs}</td>
                  <td className="px-3 py-3 text-center text-sm text-zinc-400">{c.submissions}</td>
                  <td className="px-3 py-3 text-center text-sm font-medium text-emerald-400">{c.placements}</td>
                  <td className="px-3 py-3 text-center text-sm text-zinc-400">{c.avgDays}d</td>
                  <td className="px-3 py-3 text-center">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${c.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-500/10 text-zinc-500'}`}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
