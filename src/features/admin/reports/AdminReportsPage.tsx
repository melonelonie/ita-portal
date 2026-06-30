import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, Download, FileSpreadsheet, Calendar, TrendingUp,
  Users, Building2, Cpu, Bot, Send, Sparkles, Clock, Target,
  DollarSign, ArrowUpRight, ChevronDown
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  LineChart, Line, AreaChart, Area, ComposedChart, Cell, PieChart, Pie
} from 'recharts';

// ─── Animations ────────────────────────────────────────────────────────────────
const pageVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const itemVariants = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const monthlyPlacements = [
  { month: 'Oct', placements: 12, target: 15 },
  { month: 'Nov', placements: 15, target: 15 },
  { month: 'Dec', placements: 10, target: 12 },
  { month: 'Jan', placements: 18, target: 16 },
  { month: 'Feb', placements: 16, target: 16 },
  { month: 'Mar', placements: 21, target: 18 },
];

const reqVsSubVsPlace = [
  { month: 'Oct', requirements: 18, submissions: 45, placements: 12 },
  { month: 'Nov', requirements: 22, submissions: 52, placements: 15 },
  { month: 'Dec', requirements: 15, submissions: 38, placements: 10 },
  { month: 'Jan', requirements: 25, submissions: 61, placements: 18 },
  { month: 'Feb', requirements: 20, submissions: 58, placements: 16 },
  { month: 'Mar', requirements: 28, submissions: 67, placements: 21 },
];

const hiringVelocity = [
  { month: 'Oct', velocity: 28 },
  { month: 'Nov', velocity: 24 },
  { month: 'Dec', velocity: 32 },
  { month: 'Jan', velocity: 22 },
  { month: 'Feb', velocity: 25 },
  { month: 'Mar', velocity: 20 },
];

const taComparisonData = [
  { name: 'Priya S.', placements: 8, submissions: 32, score: 94, rank: 1 },
  { name: 'Rahul V.', placements: 7, submissions: 28, score: 91, rank: 2 },
  { name: 'Ananya P.', placements: 6, submissions: 25, score: 88, rank: 3 },
  { name: 'Vikram S.', placements: 5, submissions: 22, score: 85, rank: 4 },
  { name: 'Neha G.', placements: 5, submissions: 20, score: 82, rank: 5 },
  { name: 'Arun K.', placements: 3, submissions: 18, score: 79, rank: 6 },
  { name: 'Karthik R.', placements: 2, submissions: 15, score: 76, rank: 7 },
];

const clientHiringData = [
  { client: 'TechCorp', hires: 8, active: true },
  { client: 'DataFlow', hires: 5, active: true },
  { client: 'CloudBase', hires: 6, active: true },
  { client: 'AI Solutions', hires: 3, active: true },
  { client: 'FinTech Pro', hires: 4, active: true },
  { client: 'HealthTech', hires: 2, active: true },
  { client: 'EduLearn', hires: 0, active: false },
  { client: 'RetailMax', hires: 0, active: false },
];

const pipelineFunnel = [
  { stage: 'Applied', count: 320, pct: 100 },
  { stage: 'Screened', count: 210, pct: 65.6 },
  { stage: 'Shortlisted', count: 128, pct: 40.0 },
  { stage: 'Interviewed', count: 76, pct: 23.8 },
  { stage: 'Offered', count: 38, pct: 11.9 },
  { stage: 'Placed', count: 24, pct: 7.5 },
];

const stageDuration = [
  { stage: 'Applied→Screened', avgDays: 2.1 },
  { stage: 'Screened→Shortlisted', avgDays: 3.4 },
  { stage: 'Shortlisted→Interviewed', avgDays: 5.2 },
  { stage: 'Interviewed→Offered', avgDays: 4.8 },
  { stage: 'Offered→Placed', avgDays: 6.1 },
];

const agentActionsTimeline = [
  { day: 'Mon', actions: 42 },
  { day: 'Tue', actions: 56 },
  { day: 'Wed', actions: 38 },
  { day: 'Thu', actions: 64 },
  { day: 'Fri', actions: 47 },
  { day: 'Sat', actions: 12 },
  { day: 'Sun', actions: 8 },
];

const agentAccuracy = [
  { agent: 'JR Drafter', accuracy: 94, processed: 156 },
  { agent: 'Screener', accuracy: 89, processed: 342 },
  { agent: 'Pipeline Tracker', accuracy: 97, processed: 890 },
  { agent: 'Report Generator', accuracy: 100, processed: 48 },
];

const suggestedPrompts = [
  'What is our placement rate this quarter?',
  'Which TA has the best conversion rate?',
  'Show me SLA violations for the past week',
  'Compare client hiring volumes',
  'What are the top pipeline bottlenecks?',
];

// ─── Sub-Components ────────────────────────────────────────────────────────────
function GlassCard({ title, icon, action, children, className = '' }: { title?: string; icon?: React.ReactNode; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden ${className}`}>
      {title && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            {icon && <span className="text-[#6366f1]">{icon}</span>}
            <h3 className="text-sm font-semibold text-[#fafafa]">{title}</h3>
          </div>
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

function MetricCard({ icon, label, value, trend, color }: { icon: React.ReactNode; label: string; value: string; trend: number; color: string }) {
  return (
    <motion.div variants={itemVariants} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}15` }}>{icon}</div>
        <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-400">
          <ArrowUpRight size={12} />{trend}%
        </span>
      </div>
      <p className="text-2xl font-bold text-[#fafafa]">{value}</p>
      <p className="text-xs text-[#a1a1aa] mt-1">{label}</p>
    </motion.div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${active ? 'bg-[#6366f1] text-white' : 'text-[#a1a1aa] hover:text-[#fafafa] hover:bg-white/5'}`}>
      {children}
    </button>
  );
}

function ExportButton() {
  return (
    <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg bg-white/5 text-[#a1a1aa] hover:text-[#fafafa] hover:bg-white/10 transition-colors">
      <FileSpreadsheet size={12} /> Export
    </button>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#18181f] border border-white/10 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs text-[#a1a1aa] mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-sm font-medium" style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
}

const funnelColors = ['#6366f1', '#818cf8', '#a78bfa', '#22c55e', '#f59e0b', '#10b981'];

// ─── Main Component ────────────────────────────────────────────────────────────
export default function AdminReportsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('last-6-months');
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');

  const tabs = ['Overview', 'TA Performance', 'Client Activity', 'Pipeline', 'Agent Efficiency'];

  const handleAiQuery = () => {
    if (!aiQuery.trim()) return;
    setAiResponse(`Based on your recruitment data for the selected period:\n\nYour overall placement rate this quarter is 34.2%, which is a 2.8% improvement over last quarter. The primary driver is the improved screening accuracy from the AI Screener agent, which has reduced time-to-shortlist by 40%.\n\nKey highlights:\n• TechCorp leads in placements with 8 hires\n• Average time-to-fill has decreased from 32 days to 28 days\n• Pipeline conversion rate improved by 5.3%\n\nRecommendation: Focus on reducing the Interviewed→Offered stage duration, which currently averages 4.8 days and accounts for the largest bottleneck.`);
  };

  return (
    <div className="min-h-screen bg-[#09090b] p-6">
      <motion.div variants={pageVariants} initial="hidden" animate="visible" className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#fafafa] flex items-center gap-3">
              <div className="p-2 bg-[#6366f1]/10 rounded-lg"><BarChart3 size={22} className="text-[#6366f1]" /></div>
              Reports
            </h1>
            <p className="text-sm text-[#a1a1aa] mt-1">Comprehensive recruitment analytics and insights</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-[#6366f1] hover:bg-[#818cf8] text-white text-sm font-medium rounded-lg transition-colors">
              <BarChart3 size={16} /> Generate Report
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 text-[#a1a1aa] hover:text-[#fafafa] text-sm rounded-lg hover:bg-white/10 transition-colors">
              <Download size={16} /> Export All
            </button>
          </div>
        </motion.div>

        {/* Date Range */}
        <motion.div variants={itemVariants} className="flex items-center gap-3">
          <Calendar size={16} className="text-[#a1a1aa]" />
          <div className="relative">
            <select value={dateRange} onChange={e => setDateRange(e.target.value)}
              className="appearance-none px-3 py-2 pr-8 text-sm bg-white/5 border border-white/10 rounded-lg text-[#fafafa] focus:outline-none focus:border-[#6366f1]/50 cursor-pointer">
              <option value="last-30-days" className="bg-[#0f0f14]">Last 30 Days</option>
              <option value="last-3-months" className="bg-[#0f0f14]">Last 3 Months</option>
              <option value="last-6-months" className="bg-[#0f0f14]">Last 6 Months</option>
              <option value="this-year" className="bg-[#0f0f14]">This Year</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#a1a1aa] pointer-events-none" />
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={itemVariants} className="flex gap-1 bg-white/[0.02] border border-white/5 rounded-xl p-1.5 overflow-x-auto">
          {tabs.map(tab => (
            <TabButton key={tab} active={activeTab === tab.toLowerCase().replace(/ /g, '-')} onClick={() => setActiveTab(tab.toLowerCase().replace(/ /g, '-'))}>
              {tab}
            </TabButton>
          ))}
        </motion.div>

        {/* Tab Content */}
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

          {/* ── Overview Tab ───────────────────────────────────────────── */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard icon={<Target size={18} className="text-[#6366f1]" />} label="Total Placements" value="92" trend={12.5} color="#6366f1" />
                <MetricCard icon={<Clock size={18} className="text-[#f59e0b]" />} label="Avg Time to Fill" value="28 days" trend={8.3} color="#f59e0b" />
                <MetricCard icon={<TrendingUp size={18} className="text-[#22c55e]" />} label="Pipeline Conversion" value="7.5%" trend={5.2} color="#22c55e" />
                <MetricCard icon={<DollarSign size={18} className="text-[#a78bfa]" />} label="Revenue Impact" value="$2.4M" trend={15.0} color="#a78bfa" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GlassCard title="Monthly Placements" icon={<BarChart3 size={16} />} action={<ExportButton />}>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={monthlyPlacements} barSize={32}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                      <XAxis dataKey="month" tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="placements" name="Placements" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="target" name="Target" fill="#27272a" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </GlassCard>

                <GlassCard title="Requirements vs Submissions vs Placements" icon={<TrendingUp size={16} />} action={<ExportButton />}>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={reqVsSubVsPlace} barSize={16}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                      <XAxis dataKey="month" tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="requirements" name="Requirements" fill="#a78bfa" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="submissions" name="Submissions" fill="#6366f1" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="placements" name="Placements" fill="#22c55e" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </GlassCard>
              </div>

              <GlassCard title="Hiring Velocity (Avg Days to Fill)" icon={<TrendingUp size={16} />} action={<ExportButton />}>
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={hiringVelocity}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 40]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="velocity" name="Days to Fill" stroke="#f59e0b" strokeWidth={2.5} dot={{ fill: '#f59e0b', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </GlassCard>
            </div>
          )}

          {/* ── TA Performance Tab ─────────────────────────────────────── */}
          {activeTab === 'ta-performance' && (
            <div className="space-y-6">
              <GlassCard title="TA Comparison" icon={<Users size={16} />} action={<ExportButton />}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/5">
                        {['Rank', 'Name', 'Placements', 'Submissions', 'Conversion %', 'Score'].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[#52525b] uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {taComparisonData.map((ta) => (
                        <tr key={ta.rank} className="border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors">
                          <td className="px-4 py-3">
                            <span className={`w-6 h-6 rounded-full inline-flex items-center justify-center text-xs font-bold ${
                              ta.rank === 1 ? 'bg-yellow-500/15 text-yellow-400' : ta.rank === 2 ? 'bg-zinc-400/15 text-zinc-400' : ta.rank === 3 ? 'bg-amber-700/15 text-amber-600' : 'bg-white/5 text-[#52525b]'
                            }`}>{ta.rank}</span>
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-[#fafafa]">{ta.name}</td>
                          <td className="px-4 py-3 text-sm text-[#22c55e] font-medium">{ta.placements}</td>
                          <td className="px-4 py-3 text-sm text-[#a1a1aa]">{ta.submissions}</td>
                          <td className="px-4 py-3 text-sm text-[#6366f1]">{((ta.placements / ta.submissions) * 100).toFixed(1)}%</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full rounded-full bg-[#6366f1]" style={{ width: `${ta.score}%` }} />
                              </div>
                              <span className="text-sm font-medium text-[#fafafa]">{ta.score}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>

              <GlassCard title="Placements by TA" icon={<BarChart3 size={16} />} action={<ExportButton />}>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={taComparisonData} barSize={32} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                    <XAxis type="number" tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis dataKey="name" type="category" tick={{ fill: '#a1a1aa', fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="placements" name="Placements" fill="#6366f1" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </GlassCard>
            </div>
          )}

          {/* ── Client Activity Tab ────────────────────────────────────── */}
          {activeTab === 'client-activity' && (
            <div className="space-y-6">
              <GlassCard title="Client Hiring Metrics" icon={<Building2 size={16} />} action={<ExportButton />}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={clientHiringData} barSize={36}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis dataKey="client" tick={{ fill: '#a1a1aa', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="hires" name="Hires" radius={[4, 4, 0, 0]}>
                      {clientHiringData.map((entry, i) => (
                        <Cell key={i} fill={entry.active ? '#6366f1' : '#27272a'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </GlassCard>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard className="p-5">
                  <h3 className="text-sm font-semibold text-[#fafafa] mb-4">Active vs Inactive Clients</h3>
                  <div className="flex items-center gap-8">
                    <ResponsiveContainer width={120} height={120}>
                      <PieChart>
                        <Pie data={[
                          { name: 'Active', value: clientHiringData.filter(c => c.active).length },
                          { name: 'Inactive', value: clientHiringData.filter(c => !c.active).length },
                        ]} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={4} dataKey="value">
                          <Cell fill="#6366f1" />
                          <Cell fill="#27272a" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#6366f1]" />
                        <span className="text-sm text-[#a1a1aa]">Active: {clientHiringData.filter(c => c.active).length}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#27272a]" />
                        <span className="text-sm text-[#a1a1aa]">Inactive: {clientHiringData.filter(c => !c.active).length}</span>
                      </div>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="p-5">
                  <h3 className="text-sm font-semibold text-[#fafafa] mb-4">Top Hiring Clients</h3>
                  <div className="space-y-3">
                    {clientHiringData.filter(c => c.active).sort((a, b) => b.hires - a.hires).slice(0, 4).map((c, i) => (
                      <div key={c.client} className="flex items-center gap-3">
                        <span className="text-xs text-[#52525b] w-4">{i + 1}.</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-[#fafafa]">{c.client}</span>
                            <span className="text-sm font-medium text-[#6366f1]">{c.hires}</span>
                          </div>
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-[#6366f1]" style={{ width: `${(c.hires / 8) * 100}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            </div>
          )}

          {/* ── Pipeline Tab ───────────────────────────────────────────── */}
          {activeTab === 'pipeline' && (
            <div className="space-y-6">
              <GlassCard title="Conversion Funnel" icon={<TrendingUp size={16} />} action={<ExportButton />}>
                <div className="space-y-3">
                  {pipelineFunnel.map((item, i) => (
                    <div key={item.stage} className="flex items-center gap-3">
                      <span className="text-xs text-[#a1a1aa] w-24 text-right shrink-0">{item.stage}</span>
                      <div className="flex-1 relative h-9">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.pct}%` }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                          className="absolute inset-y-0 left-0 rounded-md flex items-center justify-between px-3"
                          style={{ backgroundColor: funnelColors[i], minWidth: '80px' }}
                        >
                          <span className="text-xs font-semibold text-white">{item.count}</span>
                          <span className="text-[10px] text-white/70">{item.pct}%</span>
                        </motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard title="Stage Duration Analysis" icon={<Clock size={16} />} action={<ExportButton />}>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={stageDuration} barSize={36}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis dataKey="stage" tick={{ fill: '#a1a1aa', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} label={{ value: 'Days', angle: -90, position: 'insideLeft', style: { fill: '#52525b', fontSize: 11 } }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="avgDays" name="Avg Days" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </GlassCard>
            </div>
          )}

          {/* ── Agent Efficiency Tab ───────────────────────────────────── */}
          {activeTab === 'agent-efficiency' && (
            <div className="space-y-6">
              <GlassCard title="Agent Actions Over Time" icon={<Bot size={16} />} action={<ExportButton />}>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={agentActionsTimeline}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis dataKey="day" tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="actions" name="Actions" fill="#a78bfa" fillOpacity={0.15} stroke="#a78bfa" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </GlassCard>

              <GlassCard title="Agent Accuracy & Processing" icon={<Cpu size={16} />} action={<ExportButton />}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {agentAccuracy.map(agent => (
                    <div key={agent.agent} className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                      <p className="text-sm font-medium text-[#fafafa] mb-3">{agent.agent}</p>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-[#52525b]">Accuracy</span>
                            <span className="text-[#22c55e] font-medium">{agent.accuracy}%</span>
                          </div>
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-[#22c55e]" style={{ width: `${agent.accuracy}%` }} />
                          </div>
                        </div>
                        <p className="text-xs text-[#52525b]">{agent.processed} items processed</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          )}
        </motion.div>

        {/* ── AI Report Query Section ────────────────────────────────── */}
        <motion.div variants={itemVariants}>
          <GlassCard className="overflow-hidden">
            <div className="px-5 py-4 border-b border-white/5 bg-gradient-to-r from-[#6366f1]/5 to-[#a78bfa]/5">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#a78bfa]" />
                <h3 className="text-sm font-semibold text-[#fafafa]">AI Report Query</h3>
              </div>
              <p className="text-xs text-[#52525b] mt-1">Ask anything about your recruitment data</p>
            </div>

            <div className="p-5 space-y-4">
              {/* Suggested Prompts */}
              <div className="flex flex-wrap gap-2">
                {suggestedPrompts.map(prompt => (
                  <button
                    key={prompt}
                    onClick={() => setAiQuery(prompt)}
                    className="px-3 py-1.5 text-xs rounded-full bg-[#6366f1]/5 border border-[#6366f1]/10 text-[#818cf8] hover:bg-[#6366f1]/10 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="flex gap-3">
                <input
                  value={aiQuery}
                  onChange={e => setAiQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAiQuery()}
                  placeholder="Ask anything about your recruitment data..."
                  className="flex-1 px-4 py-3 text-sm bg-white/5 border border-white/10 rounded-lg text-[#fafafa] placeholder:text-[#52525b] focus:outline-none focus:border-[#6366f1]/50 transition-all"
                />
                <button onClick={handleAiQuery} className="px-4 py-3 bg-[#6366f1] hover:bg-[#818cf8] text-white rounded-lg transition-colors">
                  <Send size={16} />
                </button>
              </div>

              {/* AI Response */}
              {aiResponse && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-[#a78bfa]/5 border border-[#a78bfa]/10"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Bot size={14} className="text-[#a78bfa]" />
                    <span className="text-xs font-medium text-[#a78bfa]">AI Analysis</span>
                  </div>
                  <p className="text-sm text-[#a1a1aa] leading-relaxed whitespace-pre-line">{aiResponse}</p>
                </motion.div>
              )}
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </div>
  );
}
