import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Building2, Globe, Mail, Phone, User, Edit, ExternalLink,
  Briefcase, Users, CheckCircle2, Clock, ChevronRight, Plus, Send,
  FileText, TrendingUp, Activity, Award
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell
} from 'recharts';

// ─── Animations ────────────────────────────────────────────────────────────────
const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

// ─── Mock Client Data ──────────────────────────────────────────────────────────
const clientsMap: Record<string, any> = {
  '1': {
    id: '1', company: 'TechCorp Solutions', industry: 'Technology', website: 'techcorp.com',
    contact: 'John Mitchell', email: 'john@techcorp.com', phone: '+1-555-0101',
    status: 'Active', logo: 'TC',
    stats: { activeJRs: 5, totalCandidates: 48, placements: 12, avgTimeToFill: '28 days' },
    requirements: [
      { id: 'JR-101', title: 'Senior React Developer', status: 'Open', candidates: 14, priority: 'High', created: '2025-05-10' },
      { id: 'JR-102', title: 'Backend Engineer (Node.js)', status: 'Open', candidates: 8, priority: 'Medium', created: '2025-05-15' },
      { id: 'JR-103', title: 'DevOps Engineer', status: 'Open', candidates: 6, priority: 'High', created: '2025-05-18' },
      { id: 'JR-104', title: 'QA Automation Lead', status: 'Closed', candidates: 10, priority: 'Low', created: '2025-04-20' },
      { id: 'JR-105', title: 'Product Manager', status: 'Open', candidates: 5, priority: 'Medium', created: '2025-05-22' },
    ],
    pipeline: [
      { stage: 'Applied', count: 48 },
      { stage: 'Screened', count: 32 },
      { stage: 'Shortlisted', count: 18 },
      { stage: 'Interviewed', count: 10 },
      { stage: 'Offered', count: 5 },
      { stage: 'Placed', count: 3 },
    ],
    tas: [
      { id: '1', name: 'Priya Sharma', avatar: 'PS', activeJRs: 3, placements: 5, score: 94, responseTime: '2.1 hrs' },
      { id: '2', name: 'Rahul Verma', avatar: 'RV', activeJRs: 2, placements: 4, score: 91, responseTime: '1.8 hrs' },
    ],
    activities: [
      { id: 1, action: 'New JR created: "Senior React Developer"', user: 'Priya S.', time: '1 hr ago', type: 'create' },
      { id: 2, action: '3 candidates shortlisted for Backend Engineer', user: 'AI Screener', time: '3 hr ago', type: 'screen' },
      { id: 3, action: 'Interview scheduled with candidate Arjun M.', user: 'Rahul V.', time: '5 hr ago', type: 'schedule' },
      { id: 4, action: 'Placement confirmed: Meera K. as QA Lead', user: 'System', time: '1 day ago', type: 'placement' },
      { id: 5, action: 'JR "Product Manager" priority changed to Medium', user: 'John M. (Client)', time: '2 days ago', type: 'update' },
      { id: 6, action: 'Weekly report sent to stakeholders', user: 'Report Agent', time: '3 days ago', type: 'report' },
    ],
    notes: [
      { id: 1, author: 'Priya Sharma', content: 'Client prefers candidates with startup experience. Budget is flexible for senior roles.', time: '2 days ago' },
      { id: 2, author: 'Rahul Verma', content: 'Interview process: 1 technical round + 1 culture fit round. Typical turnaround 5-7 days.', time: '5 days ago' },
      { id: 3, author: 'Admin', content: 'Premium client - prioritize all requirements. Direct escalation to CTO for delays.', time: '1 week ago' },
    ]
  }
};

// Default for any ID
const getClient = (id: string) => clientsMap[id] || { ...clientsMap['1'], id, company: `Client #${id}` };

// ─── Sub-Components ────────────────────────────────────────────────────────────
function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl ${className}`}>{children}</div>;
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <GlassCard className="p-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-[#6366f1]/10">{icon}</div>
        <div>
          <p className="text-xl font-bold text-[#fafafa]">{value}</p>
          <p className="text-xs text-[#a1a1aa]">{label}</p>
        </div>
      </div>
    </GlassCard>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
        active ? 'bg-[#6366f1] text-white' : 'text-[#a1a1aa] hover:text-[#fafafa] hover:bg-white/5'
      }`}
    >
      {children}
    </button>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const colors: Record<string, string> = {
    High: 'bg-red-500/10 text-red-400',
    Medium: 'bg-yellow-500/10 text-yellow-400',
    Low: 'bg-emerald-500/10 text-emerald-400',
  };
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[priority] || 'bg-white/5 text-[#a1a1aa]'}`}>{priority}</span>;
}

function StatusBadge({ status }: { status: string }) {
  const isOpen = status === 'Open';
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${
      isOpen ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-500/10 text-zinc-400'
    }`}>
      <div className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-emerald-400' : 'bg-zinc-400'}`} />
      {status}
    </span>
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

const pipelineColors = ['#6366f1', '#818cf8', '#a78bfa', '#22c55e', '#f59e0b', '#10b981'];

function getTimelineIcon(type: string) {
  switch (type) {
    case 'create': return <Briefcase size={14} className="text-[#6366f1]" />;
    case 'screen': return <Users size={14} className="text-[#a78bfa]" />;
    case 'schedule': return <Clock size={14} className="text-[#f59e0b]" />;
    case 'placement': return <CheckCircle2 size={14} className="text-[#22c55e]" />;
    case 'update': return <Activity size={14} className="text-[#818cf8]" />;
    case 'report': return <FileText size={14} className="text-[#6366f1]" />;
    default: return <ChevronRight size={14} className="text-[#a1a1aa]" />;
  }
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [newNote, setNewNote] = useState('');
  const client = getClient(id || '1');
  const tabs = ['Overview', 'Requirements', 'Pipeline', 'TAs', 'Notes'];

  return (
    <div className="min-h-screen bg-[#09090b] p-6">
      <motion.div variants={pageVariants} initial="hidden" animate="visible" className="max-w-[1400px] mx-auto space-y-6">
        {/* Breadcrumb + Back */}
        <motion.div variants={itemVariants} className="flex items-center gap-2 text-sm">
          <button onClick={() => navigate('/admin/clients')} className="flex items-center gap-1.5 text-[#a1a1aa] hover:text-[#fafafa] transition-colors">
            <ArrowLeft size={16} /> Back
          </button>
          <span className="text-[#27272a]">/</span>
          <span className="text-[#52525b]">Clients</span>
          <span className="text-[#27272a]">/</span>
          <span className="text-[#fafafa]">{client.company}</span>
        </motion.div>

        {/* Header */}
        <motion.div variants={itemVariants}>
          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-[#6366f1]/15 flex items-center justify-center text-xl font-bold text-[#818cf8]">
                  {client.logo}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-xl font-bold text-[#fafafa]">{client.company}</h1>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      client.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-500/10 text-zinc-400'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${client.status === 'Active' ? 'bg-emerald-400' : 'bg-zinc-400'}`} />
                      {client.status}
                    </span>
                  </div>
                  <p className="text-sm text-[#a1a1aa] mt-0.5">{client.industry}</p>
                </div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-white/5 border border-white/10 text-[#a1a1aa] hover:text-[#fafafa] hover:bg-white/10 transition-colors">
                <Edit size={14} /> Edit
              </button>
            </div>
          </GlassCard>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={itemVariants} className="flex gap-1 bg-white/[0.02] border border-white/5 rounded-xl p-1.5">
          {tabs.map(tab => (
            <TabButton key={tab} active={activeTab === tab.toLowerCase()} onClick={() => setActiveTab(tab.toLowerCase())}>
              {tab}
            </TabButton>
          ))}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>

            {/* ── Overview Tab ──────────────────────────────────────────── */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Company Info + Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <GlassCard className="p-5 lg:col-span-1">
                    <h3 className="text-sm font-semibold text-[#fafafa] mb-4">Company Information</h3>
                    <div className="space-y-3">
                      {[
                        { icon: <Building2 size={14} />, label: 'Industry', value: client.industry },
                        { icon: <Globe size={14} />, label: 'Website', value: client.website },
                        { icon: <User size={14} />, label: 'Contact', value: client.contact },
                        { icon: <Mail size={14} />, label: 'Email', value: client.email },
                        { icon: <Phone size={14} />, label: 'Phone', value: client.phone },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="text-[#52525b]">{item.icon}</div>
                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-[#52525b]">{item.label}</p>
                            <p className="text-sm text-[#a1a1aa]">{item.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>

                  <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <StatCard icon={<Briefcase size={16} className="text-[#6366f1]" />} label="Active JRs" value={client.stats.activeJRs} />
                      <StatCard icon={<Users size={16} className="text-[#a78bfa]" />} label="Total Candidates" value={client.stats.totalCandidates} />
                      <StatCard icon={<CheckCircle2 size={16} className="text-[#22c55e]" />} label="Placements" value={client.stats.placements} />
                      <StatCard icon={<Clock size={16} className="text-[#f59e0b]" />} label="Avg Time to Fill" value={client.stats.avgTimeToFill} />
                    </div>

                    {/* Activity Timeline */}
                    <GlassCard className="p-5">
                      <h3 className="text-sm font-semibold text-[#fafafa] mb-4">Recent Activity</h3>
                      <div className="space-y-4">
                        {client.activities.slice(0, 5).map((act: any, i: number) => (
                          <div key={act.id} className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <div className="p-1.5 rounded-md bg-white/5">{getTimelineIcon(act.type)}</div>
                              {i < 4 && <div className="w-px flex-1 bg-white/5 mt-2" />}
                            </div>
                            <div className="pb-2">
                              <p className="text-sm text-[#fafafa]">{act.action}</p>
                              <p className="text-xs text-[#52525b] mt-0.5">by {act.user} · {act.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </GlassCard>
                  </div>
                </div>
              </div>
            )}

            {/* ── Requirements Tab ─────────────────────────────────────── */}
            {activeTab === 'requirements' && (
              <GlassCard>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/5">
                        {['JR ID', 'Title', 'Status', 'Candidates', 'Priority', 'Created'].map(h => (
                          <th key={h} className="px-5 py-3.5 text-left text-xs font-medium text-[#52525b] uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {client.requirements.map((jr: any) => (
                        <tr key={jr.id} className="border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors">
                          <td className="px-5 py-4 text-sm font-mono text-[#818cf8]">{jr.id}</td>
                          <td className="px-5 py-4 text-sm text-[#fafafa]">{jr.title}</td>
                          <td className="px-5 py-4"><StatusBadge status={jr.status} /></td>
                          <td className="px-5 py-4 text-sm text-[#a1a1aa]">{jr.candidates}</td>
                          <td className="px-5 py-4"><PriorityBadge priority={jr.priority} /></td>
                          <td className="px-5 py-4 text-sm text-[#52525b]">{jr.created}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            )}

            {/* ── Pipeline Tab ─────────────────────────────────────────── */}
            {activeTab === 'pipeline' && (
              <GlassCard className="p-6">
                <h3 className="text-sm font-semibold text-[#fafafa] mb-6">Candidate Pipeline</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={client.pipeline} barSize={48}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis dataKey="stage" tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                    <Bar dataKey="count" name="Candidates" radius={[6, 6, 0, 0]}>
                      {client.pipeline.map((_: any, i: number) => (
                        <Cell key={i} fill={pipelineColors[i]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>

                {/* Stage Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
                  {client.pipeline.map((stage: any, i: number) => (
                    <div key={stage.stage} className="p-3 rounded-lg border border-white/5 bg-white/[0.02] text-center">
                      <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{ backgroundColor: pipelineColors[i] }} />
                      <p className="text-lg font-bold text-[#fafafa]">{stage.count}</p>
                      <p className="text-xs text-[#52525b]">{stage.stage}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}

            {/* ── TAs Tab ──────────────────────────────────────────────── */}
            {activeTab === 'tas' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {client.tas.map((ta: any) => (
                  <GlassCard key={ta.id} className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-[#6366f1]/20 flex items-center justify-center text-sm font-bold text-[#818cf8]">
                        {ta.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#fafafa]">{ta.name}</p>
                        <p className="text-xs text-[#52525b]">Talent Acquisition</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-white/[0.03]">
                        <p className="text-lg font-bold text-[#fafafa]">{ta.activeJRs}</p>
                        <p className="text-xs text-[#52525b]">Active JRs</p>
                      </div>
                      <div className="p-3 rounded-lg bg-white/[0.03]">
                        <p className="text-lg font-bold text-[#22c55e]">{ta.placements}</p>
                        <p className="text-xs text-[#52525b]">Placements</p>
                      </div>
                      <div className="p-3 rounded-lg bg-white/[0.03]">
                        <p className="text-lg font-bold text-[#6366f1]">{ta.score}</p>
                        <p className="text-xs text-[#52525b]">Score</p>
                      </div>
                      <div className="p-3 rounded-lg bg-white/[0.03]">
                        <p className="text-lg font-bold text-[#f59e0b]">{ta.responseTime}</p>
                        <p className="text-xs text-[#52525b]">Avg Response</p>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}

            {/* ── Notes Tab ────────────────────────────────────────────── */}
            {activeTab === 'notes' && (
              <div className="space-y-4">
                <GlassCard className="p-5">
                  <h3 className="text-sm font-semibold text-[#fafafa] mb-3">Add Note</h3>
                  <div className="flex gap-3">
                    <textarea
                      value={newNote}
                      onChange={e => setNewNote(e.target.value)}
                      placeholder="Type your note here..."
                      rows={3}
                      className="flex-1 px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-[#fafafa] placeholder:text-[#52525b] focus:outline-none focus:border-[#6366f1]/50 resize-none transition-all"
                    />
                    <button
                      onClick={() => setNewNote('')}
                      className="self-end px-4 py-2 bg-[#6366f1] hover:bg-[#818cf8] text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Send size={14} /> Add
                    </button>
                  </div>
                </GlassCard>

                {client.notes.map((note: any) => (
                  <GlassCard key={note.id} className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#6366f1]/20 flex items-center justify-center text-[10px] font-bold text-[#818cf8]">
                          {note.author.split(' ').map((w: string) => w[0]).join('')}
                        </div>
                        <span className="text-sm font-medium text-[#fafafa]">{note.author}</span>
                      </div>
                      <span className="text-xs text-[#52525b]">{note.time}</span>
                    </div>
                    <p className="text-sm text-[#a1a1aa] leading-relaxed">{note.content}</p>
                  </GlassCard>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
