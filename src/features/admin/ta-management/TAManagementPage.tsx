import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Plus, Search, MoreHorizontal, Edit, Eye, Ban, X,
  Award, Briefcase, TrendingUp, Clock, UserCheck, ChevronDown, Check
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  RadialBarChart, RadialBar, LineChart, Line
} from 'recharts';

// ─── Animations ────────────────────────────────────────────────────────────────
const pageVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const itemVariants = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

// ─── Types ─────────────────────────────────────────────────────────────────────
interface TA {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive';
  assignedClients: number;
  openJRs: number;
  placementsMTD: number;
  performanceScore: number;
  monthlyPlacements: { month: string; count: number }[];
  conversionRate: number;
  satisfaction: number;
  avgResponseTime: string;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const mockTAs: TA[] = [
  { id: '1', name: 'Priya Sharma', avatar: 'PS', email: 'priya@ita.com', phone: '+91-9876543210', status: 'Active', assignedClients: 4, openJRs: 8, placementsMTD: 5, performanceScore: 94, monthlyPlacements: [{ month: 'Oct', count: 3 }, { month: 'Nov', count: 5 }, { month: 'Dec', count: 4 }, { month: 'Jan', count: 6 }, { month: 'Feb', count: 4 }, { month: 'Mar', count: 5 }], conversionRate: 38, satisfaction: 92, avgResponseTime: '1.8 hrs' },
  { id: '2', name: 'Rahul Verma', avatar: 'RV', email: 'rahul@ita.com', phone: '+91-9876543211', status: 'Active', assignedClients: 3, openJRs: 6, placementsMTD: 4, performanceScore: 91, monthlyPlacements: [{ month: 'Oct', count: 2 }, { month: 'Nov', count: 4 }, { month: 'Dec', count: 3 }, { month: 'Jan', count: 5 }, { month: 'Feb', count: 3 }, { month: 'Mar', count: 4 }], conversionRate: 35, satisfaction: 89, avgResponseTime: '2.1 hrs' },
  { id: '3', name: 'Ananya Patel', avatar: 'AP', email: 'ananya@ita.com', phone: '+91-9876543212', status: 'Active', assignedClients: 5, openJRs: 9, placementsMTD: 3, performanceScore: 88, monthlyPlacements: [{ month: 'Oct', count: 4 }, { month: 'Nov', count: 3 }, { month: 'Dec', count: 5 }, { month: 'Jan', count: 3 }, { month: 'Feb', count: 4 }, { month: 'Mar', count: 3 }], conversionRate: 32, satisfaction: 91, avgResponseTime: '2.4 hrs' },
  { id: '4', name: 'Vikram Singh', avatar: 'VS', email: 'vikram@ita.com', phone: '+91-9876543213', status: 'Active', assignedClients: 3, openJRs: 5, placementsMTD: 3, performanceScore: 85, monthlyPlacements: [{ month: 'Oct', count: 2 }, { month: 'Nov', count: 3 }, { month: 'Dec', count: 2 }, { month: 'Jan', count: 4 }, { month: 'Feb', count: 3 }, { month: 'Mar', count: 3 }], conversionRate: 30, satisfaction: 86, avgResponseTime: '2.8 hrs' },
  { id: '5', name: 'Neha Gupta', avatar: 'NG', email: 'neha@ita.com', phone: '+91-9876543214', status: 'Active', assignedClients: 4, openJRs: 7, placementsMTD: 2, performanceScore: 82, monthlyPlacements: [{ month: 'Oct', count: 1 }, { month: 'Nov', count: 2 }, { month: 'Dec', count: 3 }, { month: 'Jan', count: 2 }, { month: 'Feb', count: 3 }, { month: 'Mar', count: 2 }], conversionRate: 28, satisfaction: 84, avgResponseTime: '3.0 hrs' },
  { id: '6', name: 'Arun Kumar', avatar: 'AK', email: 'arun@ita.com', phone: '+91-9876543215', status: 'Active', assignedClients: 2, openJRs: 4, placementsMTD: 2, performanceScore: 79, monthlyPlacements: [{ month: 'Oct', count: 2 }, { month: 'Nov', count: 1 }, { month: 'Dec', count: 2 }, { month: 'Jan', count: 3 }, { month: 'Feb', count: 2 }, { month: 'Mar', count: 2 }], conversionRate: 25, satisfaction: 80, avgResponseTime: '3.5 hrs' },
  { id: '7', name: 'Deepa Nair', avatar: 'DN', email: 'deepa@ita.com', phone: '+91-9876543216', status: 'Inactive', assignedClients: 0, openJRs: 0, placementsMTD: 0, performanceScore: 72, monthlyPlacements: [{ month: 'Oct', count: 3 }, { month: 'Nov', count: 2 }, { month: 'Dec', count: 1 }, { month: 'Jan', count: 0 }, { month: 'Feb', count: 0 }, { month: 'Mar', count: 0 }], conversionRate: 22, satisfaction: 78, avgResponseTime: '4.0 hrs' },
  { id: '8', name: 'Karthik Reddy', avatar: 'KR', email: 'karthik@ita.com', phone: '+91-9876543217', status: 'Active', assignedClients: 3, openJRs: 5, placementsMTD: 1, performanceScore: 76, monthlyPlacements: [{ month: 'Oct', count: 1 }, { month: 'Nov', count: 2 }, { month: 'Dec', count: 1 }, { month: 'Jan', count: 2 }, { month: 'Feb', count: 1 }, { month: 'Mar', count: 1 }], conversionRate: 20, satisfaction: 75, avgResponseTime: '3.8 hrs' },
];

// ─── Sub-Components ────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <motion.div variants={itemVariants} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-lg" style={{ backgroundColor: `${color}15` }}>{icon}</div>
        <div>
          <p className="text-xl font-bold text-[#fafafa]">{value}</p>
          <p className="text-xs text-[#a1a1aa]">{label}</p>
        </div>
      </div>
    </motion.div>
  );
}

function PerformanceBar({ score }: { score: number }) {
  const color = score >= 90 ? '#22c55e' : score >= 80 ? '#6366f1' : score >= 70 ? '#f59e0b' : '#ef4444';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden max-w-[100px]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
      <span className="text-sm font-semibold" style={{ color }}>{score}</span>
    </div>
  );
}

function Modal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-[#0f0f14] border border-white/10 rounded-xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <h2 className="text-lg font-semibold text-[#fafafa]">{title}</h2>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 text-[#a1a1aa] hover:text-[#fafafa] transition-colors"><X size={18} /></button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function FormInput({ label, value, onChange, placeholder, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#a1a1aa] mb-1.5">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-[#fafafa] placeholder:text-[#52525b] focus:outline-none focus:border-[#6366f1]/50 focus:ring-1 focus:ring-[#6366f1]/20 transition-all" />
    </div>
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

// ─── Performance Drawer ────────────────────────────────────────────────────────
function PerformanceDrawer({ ta, onClose }: { ta: TA | null; onClose: () => void }) {
  if (!ta) return null;

  const radialData = [{ name: 'Score', value: ta.performanceScore, fill: '#6366f1' }];
  const conversionData = [
    { stage: 'Applied', rate: 100 },
    { stage: 'Screened', rate: 65 },
    { stage: 'Shortlisted', rate: ta.conversionRate + 10 },
    { stage: 'Interviewed', rate: ta.conversionRate },
    { stage: 'Offered', rate: ta.conversionRate - 12 },
    { stage: 'Placed', rate: ta.conversionRate - 18 },
  ];

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex justify-end">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-xl bg-[#0f0f14] border-l border-white/10 overflow-y-auto"
        >
          <div className="sticky top-0 z-10 bg-[#0f0f14]/95 backdrop-blur-lg flex items-center justify-between px-6 py-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#6366f1]/20 flex items-center justify-center text-sm font-bold text-[#818cf8]">{ta.avatar}</div>
              <div>
                <h2 className="text-lg font-semibold text-[#fafafa]">{ta.name}</h2>
                <p className="text-xs text-[#a1a1aa]">Performance Details</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 text-[#a1a1aa] hover:text-[#fafafa] transition-colors"><X size={18} /></button>
          </div>

          <div className="p-6 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                <p className="text-2xl font-bold text-[#6366f1]">{ta.performanceScore}</p>
                <p className="text-xs text-[#a1a1aa] mt-1">Performance Score</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                <p className="text-2xl font-bold text-[#22c55e]">{ta.conversionRate}%</p>
                <p className="text-xs text-[#a1a1aa] mt-1">Conversion Rate</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                <p className="text-2xl font-bold text-[#f59e0b]">{ta.satisfaction}%</p>
                <p className="text-xs text-[#a1a1aa] mt-1">Client Satisfaction</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                <p className="text-2xl font-bold text-[#a78bfa]">{ta.avgResponseTime}</p>
                <p className="text-xs text-[#a1a1aa] mt-1">Avg Response Time</p>
              </div>
            </div>

            {/* Monthly Placements Chart */}
            <div className="bg-white/5 border border-white/5 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-[#fafafa] mb-4">Monthly Placements</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={ta.monthlyPlacements} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: '#a1a1aa', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#a1a1aa', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Placements" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pipeline Conversion */}
            <div className="bg-white/5 border border-white/5 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-[#fafafa] mb-4">Pipeline Conversion Rate</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={conversionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="stage" tick={{ fill: '#a1a1aa', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#a1a1aa', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="rate" name="Conversion %" stroke="#22c55e" strokeWidth={2.5} dot={{ fill: '#22c55e', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function TAManagementPage() {
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTA, setSelectedTA] = useState<TA | null>(null);
  const [actionDropdown, setActionDropdown] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  const activeTAs = mockTAs.filter(ta => ta.status === 'Active');
  const avgClientsPerTA = Math.round(activeTAs.reduce((a, t) => a + t.assignedClients, 0) / activeTAs.length);
  const topPerformer = mockTAs.reduce((a, b) => a.performanceScore > b.performanceScore ? a : b);

  const filteredTAs = mockTAs.filter(ta =>
    ta.name.toLowerCase().includes(search.toLowerCase()) ||
    ta.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#09090b] p-6">
      <motion.div variants={pageVariants} initial="hidden" animate="visible" className="max-w-[1400px] mx-auto space-y-6">
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#fafafa] flex items-center gap-3">
              <div className="p-2 bg-[#6366f1]/10 rounded-lg"><Users size={22} className="text-[#6366f1]" /></div>
              Team Management
            </h1>
            <p className="text-sm text-[#a1a1aa] mt-1">Manage and monitor talent acquisition team</p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-[#6366f1] hover:bg-[#818cf8] text-white text-sm font-medium rounded-lg transition-colors">
            <Plus size={16} /> Add TA
          </button>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={<Users size={18} className="text-[#6366f1]" />} label="Total TAs" value={mockTAs.length} color="#6366f1" />
          <StatCard icon={<UserCheck size={18} className="text-[#22c55e]" />} label="Active TAs" value={activeTAs.length} color="#22c55e" />
          <StatCard icon={<Briefcase size={18} className="text-[#f59e0b]" />} label="Avg Clients per TA" value={avgClientsPerTA} color="#f59e0b" />
          <StatCard icon={<Award size={18} className="text-[#a78bfa]" />} label="Top Performer" value={topPerformer.name.split(' ')[0]} color="#a78bfa" />
        </div>

        {/* Search */}
        <motion.div variants={itemVariants} className="relative max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525b]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search team members..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white/5 border border-white/10 rounded-lg text-[#fafafa] placeholder:text-[#52525b] focus:outline-none focus:border-[#6366f1]/50 transition-all"
          />
        </motion.div>

        {/* Table */}
        <motion.div variants={itemVariants} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {['Name', 'Email', 'Status', 'Clients', 'Open JRs', 'Placements (MTD)', 'Performance', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-medium text-[#52525b] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredTAs.map((ta, i) => (
                  <motion.tr
                    key={ta.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#6366f1]/20 flex items-center justify-center text-xs font-bold text-[#818cf8] shrink-0">
                          {ta.avatar}
                        </div>
                        <span className="text-sm font-medium text-[#fafafa]">{ta.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-[#a1a1aa]">{ta.email}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        ta.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-500/10 text-zinc-400'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${ta.status === 'Active' ? 'bg-emerald-400' : 'bg-zinc-400'}`} />
                        {ta.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-[#fafafa]">{ta.assignedClients}</td>
                    <td className="px-5 py-4 text-sm text-[#fafafa]">{ta.openJRs}</td>
                    <td className="px-5 py-4 text-sm text-[#22c55e] font-medium">{ta.placementsMTD}</td>
                    <td className="px-5 py-4"><PerformanceBar score={ta.performanceScore} /></td>
                    <td className="px-5 py-4">
                      <div className="relative">
                        <button
                          onClick={() => setActionDropdown(actionDropdown === ta.id ? null : ta.id)}
                          className="p-1.5 rounded-lg hover:bg-white/5 text-[#a1a1aa] hover:text-[#fafafa] transition-colors"
                        >
                          <MoreHorizontal size={16} />
                        </button>
                        <AnimatePresence>
                          {actionDropdown === ta.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="absolute right-0 top-8 z-20 w-48 bg-[#18181f] border border-white/10 rounded-lg shadow-xl py-1"
                            >
                              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#a1a1aa] hover:text-[#fafafa] hover:bg-white/5 transition-colors">
                                <Edit size={14} /> Edit
                              </button>
                              <button
                                onClick={() => { setSelectedTA(ta); setActionDropdown(null); }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#a1a1aa] hover:text-[#fafafa] hover:bg-white/5 transition-colors"
                              >
                                <Eye size={14} /> View Performance
                              </button>
                              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#a1a1aa] hover:text-[#fafafa] hover:bg-white/5 transition-colors">
                                <Ban size={14} /> {ta.status === 'Active' ? 'Deactivate' : 'Activate'}
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>

      {/* Add TA Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New TA">
        <div className="space-y-4">
          <FormInput label="Full Name" value={formData.name} onChange={v => setFormData({ ...formData, name: v })} placeholder="Enter full name" />
          <FormInput label="Email" value={formData.email} onChange={v => setFormData({ ...formData, email: v })} placeholder="email@ita.com" type="email" />
          <FormInput label="Phone" value={formData.phone} onChange={v => setFormData({ ...formData, phone: v })} placeholder="+91-XXXXXXXXXX" type="tel" />
          <div>
            <label className="block text-xs font-medium text-[#a1a1aa] mb-1.5">Assign Initial Clients</label>
            <div className="flex flex-wrap gap-2">
              {['TechCorp', 'DataFlow', 'CloudBase', 'AI Solutions'].map(c => (
                <label key={c} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-[#a1a1aa] cursor-pointer hover:bg-white/10 transition-colors">
                  <input type="checkbox" className="rounded border-white/20 bg-white/5 text-[#6366f1] focus:ring-[#6366f1]/20" />
                  {c}
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm rounded-lg bg-white/5 text-[#a1a1aa] hover:bg-white/10 transition-colors">Cancel</button>
            <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm rounded-lg bg-[#6366f1] hover:bg-[#818cf8] text-white font-medium transition-colors flex items-center gap-2">
              <Check size={14} /> Add TA
            </button>
          </div>
        </div>
      </Modal>

      {/* Performance Drawer */}
      {selectedTA && <PerformanceDrawer ta={selectedTA} onClose={() => setSelectedTA(null)} />}
    </div>
  );
}
