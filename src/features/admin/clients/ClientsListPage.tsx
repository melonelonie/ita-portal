import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Building2, Plus, Search, Filter, ChevronDown, MoreHorizontal,
  Edit, Trash2, Ban, ExternalLink, Mail, Phone, Globe, X, Check, AlertTriangle
} from 'lucide-react';

// ─── Animation Variants ────────────────────────────────────────────────────────
const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Client {
  id: string;
  company: string;
  industry: string;
  website: string;
  contact: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive';
  activeJRs: number;
  assignedTAs: string[];
  notes: string;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const mockClients: Client[] = [
  { id: '1', company: 'TechCorp Solutions', industry: 'Technology', website: 'techcorp.com', contact: 'John Mitchell', email: 'john@techcorp.com', phone: '+1-555-0101', status: 'Active', activeJRs: 5, assignedTAs: ['Priya S.', 'Rahul V.'], notes: 'Premium client' },
  { id: '2', company: 'DataFlow Inc', industry: 'Data Analytics', website: 'dataflow.io', contact: 'Sarah Chen', email: 'sarah@dataflow.io', phone: '+1-555-0102', status: 'Active', activeJRs: 3, assignedTAs: ['Ananya P.'], notes: '' },
  { id: '3', company: 'CloudBase Technologies', industry: 'Cloud Computing', website: 'cloudbase.tech', contact: 'Mike Johnson', email: 'mike@cloudbase.tech', phone: '+1-555-0103', status: 'Active', activeJRs: 4, assignedTAs: ['Vikram S.', 'Neha G.'], notes: 'Fast growing' },
  { id: '4', company: 'AI Solutions Ltd', industry: 'Artificial Intelligence', website: 'aisolutions.ai', contact: 'Dr. Lisa Park', email: 'lisa@aisolutions.ai', phone: '+1-555-0104', status: 'Active', activeJRs: 2, assignedTAs: ['Priya S.'], notes: '' },
  { id: '5', company: 'FinTech Pro', industry: 'Financial Technology', website: 'fintechpro.com', contact: 'Robert Kim', email: 'robert@fintechpro.com', phone: '+1-555-0105', status: 'Active', activeJRs: 3, assignedTAs: ['Rahul V.', 'Ananya P.'], notes: '' },
  { id: '6', company: 'HealthTech Systems', industry: 'Healthcare IT', website: 'healthtech.com', contact: 'Dr. Emma Wilson', email: 'emma@healthtech.com', phone: '+1-555-0106', status: 'Active', activeJRs: 2, assignedTAs: ['Neha G.'], notes: 'HIPAA compliant' },
  { id: '7', company: 'EduLearn Platform', industry: 'EdTech', website: 'edulearn.com', contact: 'Tom Brown', email: 'tom@edulearn.com', phone: '+1-555-0107', status: 'Inactive', activeJRs: 0, assignedTAs: [], notes: 'On pause' },
  { id: '8', company: 'GreenEnergy Corp', industry: 'Clean Energy', website: 'greenenergy.com', contact: 'Anna Green', email: 'anna@greenenergy.com', phone: '+1-555-0108', status: 'Active', activeJRs: 1, assignedTAs: ['Vikram S.'], notes: '' },
  { id: '9', company: 'RetailMax', industry: 'E-Commerce', website: 'retailmax.com', contact: 'David Lee', email: 'david@retailmax.com', phone: '+1-555-0109', status: 'Inactive', activeJRs: 0, assignedTAs: [], notes: 'Contract ended' },
  { id: '10', company: 'CyberShield Inc', industry: 'Cybersecurity', website: 'cybershield.io', contact: 'James Wright', email: 'james@cybershield.io', phone: '+1-555-0110', status: 'Active', activeJRs: 3, assignedTAs: ['Priya S.', 'Rahul V.'], notes: '' },
  { id: '11', company: 'LogiTrack Solutions', industry: 'Logistics', website: 'logitrack.com', contact: 'Maria Garcia', email: 'maria@logitrack.com', phone: '+1-555-0111', status: 'Active', activeJRs: 2, assignedTAs: ['Ananya P.'], notes: '' },
  { id: '12', company: 'MediaPulse', industry: 'Digital Media', website: 'mediapulse.co', contact: 'Chris Taylor', email: 'chris@mediapulse.co', phone: '+1-555-0112', status: 'Inactive', activeJRs: 0, assignedTAs: [], notes: 'Reviewing contract' },
];

// ─── Modal Component ───────────────────────────────────────────────────────────
function Modal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-[#0f0f14] border border-white/10 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <h2 className="text-lg font-semibold text-[#fafafa]">{title}</h2>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 text-[#a1a1aa] hover:text-[#fafafa] transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Confirm Modal ─────────────────────────────────────────────────────────────
function ConfirmModal({ isOpen, onClose, onConfirm, title, message }: { isOpen: boolean; onClose: () => void; onConfirm: () => void; title: string; message: string }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-red-500/10 rounded-lg"><AlertTriangle size={20} className="text-red-400" /></div>
          <p className="text-sm text-[#a1a1aa]">{message}</p>
        </div>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg bg-white/5 text-[#a1a1aa] hover:bg-white/10 transition-colors">Cancel</button>
          <button onClick={() => { onConfirm(); onClose(); }} className="px-4 py-2 text-sm rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">Delete</button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Form Input ────────────────────────────────────────────────────────────────
function FormInput({ label, value, onChange, placeholder, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#a1a1aa] mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-[#fafafa] placeholder:text-[#52525b] focus:outline-none focus:border-[#6366f1]/50 focus:ring-1 focus:ring-[#6366f1]/20 transition-all"
      />
    </div>
  );
}

// ─── Dropdown ──────────────────────────────────────────────────────────────────
function Dropdown({ options, value, onChange, className = '' }: { options: { label: string; value: string }[]; value: string; onChange: (v: string) => void; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="appearance-none w-full px-3 py-2 pr-8 text-sm bg-white/5 border border-white/10 rounded-lg text-[#fafafa] focus:outline-none focus:border-[#6366f1]/50 transition-colors cursor-pointer"
      >
        {options.map(o => <option key={o.value} value={o.value} className="bg-[#0f0f14]">{o.label}</option>)}
      </select>
      <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#a1a1aa] pointer-events-none" />
    </div>
  );
}

// ─── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: 'Active' | 'Inactive' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
      status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-500/10 text-zinc-400'
    }`}>
      <div className={`w-1.5 h-1.5 rounded-full ${status === 'Active' ? 'bg-emerald-400' : 'bg-zinc-400'}`} />
      {status}
    </span>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function ClientsListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('company');
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [actionDropdown, setActionDropdown] = useState<string | null>(null);
  const [formData, setFormData] = useState({ company: '', industry: '', website: '', contact: '', email: '', phone: '', notes: '' });
  const perPage = 8;

  const filteredClients = useMemo(() => {
    let result = mockClients.filter(c => {
      const matchesSearch = c.company.toLowerCase().includes(search.toLowerCase()) ||
        c.contact.toLowerCase().includes(search.toLowerCase()) ||
        c.industry.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
    result.sort((a, b) => {
      if (sortBy === 'company') return a.company.localeCompare(b.company);
      if (sortBy === 'industry') return a.industry.localeCompare(b.industry);
      if (sortBy === 'activeJRs') return b.activeJRs - a.activeJRs;
      return 0;
    });
    return result;
  }, [search, statusFilter, sortBy]);

  const totalPages = Math.ceil(filteredClients.length / perPage);
  const paginatedClients = filteredClients.slice((page - 1) * perPage, page * perPage);

  const resetForm = () => setFormData({ company: '', industry: '', website: '', contact: '', email: '', phone: '', notes: '' });

  return (
    <div className="min-h-screen bg-[#09090b] p-6">
      <motion.div variants={pageVariants} initial="hidden" animate="visible" className="max-w-[1400px] mx-auto space-y-6">
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#fafafa] flex items-center gap-3">
              <div className="p-2 bg-[#6366f1]/10 rounded-lg"><Building2 size={22} className="text-[#6366f1]" /></div>
              Clients
            </h1>
            <p className="text-sm text-[#a1a1aa] mt-1">{filteredClients.length} total clients</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowAddModal(true); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#6366f1] hover:bg-[#818cf8] text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus size={16} /> Add Client
          </button>
        </motion.div>

        {/* Filter Bar */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525b]" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search clients..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white/5 border border-white/10 rounded-lg text-[#fafafa] placeholder:text-[#52525b] focus:outline-none focus:border-[#6366f1]/50 focus:ring-1 focus:ring-[#6366f1]/20 transition-all"
            />
          </div>
          <Dropdown
            value={statusFilter}
            onChange={v => { setStatusFilter(v); setPage(1); }}
            options={[{ label: 'All Status', value: 'All' }, { label: 'Active', value: 'Active' }, { label: 'Inactive', value: 'Inactive' }]}
            className="w-40"
          />
          <Dropdown
            value={sortBy}
            onChange={setSortBy}
            options={[{ label: 'Sort by Name', value: 'company' }, { label: 'Sort by Industry', value: 'industry' }, { label: 'Sort by Active JRs', value: 'activeJRs' }]}
            className="w-44"
          />
        </motion.div>

        {/* Table */}
        <motion.div variants={itemVariants} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden">
          {paginatedClients.length === 0 ? (
            <div className="py-20 text-center">
              <Building2 size={40} className="mx-auto text-[#27272a] mb-4" />
              <p className="text-sm text-[#a1a1aa]">No clients match your filters</p>
              <p className="text-xs text-[#52525b] mt-1">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    {['Company Name', 'Industry', 'Status', 'Active JRs', 'Assigned TAs', 'Contact', 'Actions'].map(h => (
                      <th key={h} className="px-5 py-3.5 text-left text-xs font-medium text-[#52525b] uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedClients.map((client, i) => (
                    <motion.tr
                      key={client.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      onClick={() => navigate(`/admin/clients/${client.id}`)}
                      className="border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors cursor-pointer group"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-[#6366f1]/10 flex items-center justify-center text-xs font-bold text-[#818cf8] shrink-0">
                            {client.company.split(' ').map(w => w[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#fafafa] group-hover:text-[#818cf8] transition-colors">{client.company}</p>
                            <p className="text-xs text-[#52525b] flex items-center gap-1"><Globe size={10} />{client.website}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-[#a1a1aa]">{client.industry}</td>
                      <td className="px-5 py-4"><StatusBadge status={client.status} /></td>
                      <td className="px-5 py-4 text-sm text-[#fafafa] font-medium">{client.activeJRs}</td>
                      <td className="px-5 py-4">
                        <div className="flex -space-x-1.5">
                          {client.assignedTAs.slice(0, 3).map((ta, j) => (
                            <div key={j} className="w-6 h-6 rounded-full bg-[#6366f1]/20 border-2 border-[#0f0f14] flex items-center justify-center text-[9px] font-bold text-[#818cf8]">
                              {ta.split(' ').map(w => w[0]).join('')}
                            </div>
                          ))}
                          {client.assignedTAs.length > 3 && (
                            <div className="w-6 h-6 rounded-full bg-white/5 border-2 border-[#0f0f14] flex items-center justify-center text-[9px] text-[#52525b]">
                              +{client.assignedTAs.length - 3}
                            </div>
                          )}
                          {client.assignedTAs.length === 0 && <span className="text-xs text-[#52525b]">—</span>}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-[#a1a1aa]">{client.contact}</p>
                        <p className="text-xs text-[#52525b] flex items-center gap-1"><Mail size={10} />{client.email}</p>
                      </td>
                      <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                        <div className="relative">
                          <button
                            onClick={() => setActionDropdown(actionDropdown === client.id ? null : client.id)}
                            className="p-1.5 rounded-lg hover:bg-white/5 text-[#a1a1aa] hover:text-[#fafafa] transition-colors"
                          >
                            <MoreHorizontal size={16} />
                          </button>
                          <AnimatePresence>
                            {actionDropdown === client.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="absolute right-0 top-8 z-20 w-44 bg-[#18181f] border border-white/10 rounded-lg shadow-xl py-1"
                              >
                                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#a1a1aa] hover:text-[#fafafa] hover:bg-white/5 transition-colors">
                                  <Edit size={14} /> Edit
                                </button>
                                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#a1a1aa] hover:text-[#fafafa] hover:bg-white/5 transition-colors">
                                  <Ban size={14} /> {client.status === 'Active' ? 'Deactivate' : 'Activate'}
                                </button>
                                <button
                                  onClick={() => { setShowDeleteConfirm(client.id); setActionDropdown(null); }}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                                >
                                  <Trash2 size={14} /> Delete
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
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-white/5">
              <p className="text-xs text-[#52525b]">
                Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filteredClients.length)} of {filteredClients.length}
              </p>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-8 h-8 text-xs rounded-lg transition-colors ${
                      page === i + 1 ? 'bg-[#6366f1] text-white' : 'bg-white/5 text-[#a1a1aa] hover:bg-white/10'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Add Client Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Client">
        <div className="space-y-4">
          <FormInput label="Company Name" value={formData.company} onChange={v => setFormData({ ...formData, company: v })} placeholder="Enter company name" />
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Industry" value={formData.industry} onChange={v => setFormData({ ...formData, industry: v })} placeholder="e.g. Technology" />
            <FormInput label="Website" value={formData.website} onChange={v => setFormData({ ...formData, website: v })} placeholder="company.com" />
          </div>
          <FormInput label="Contact Person" value={formData.contact} onChange={v => setFormData({ ...formData, contact: v })} placeholder="Primary contact name" />
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Email" value={formData.email} onChange={v => setFormData({ ...formData, email: v })} placeholder="email@company.com" type="email" />
            <FormInput label="Phone" value={formData.phone} onChange={v => setFormData({ ...formData, phone: v })} placeholder="+1-555-0000" type="tel" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#a1a1aa] mb-1.5">Notes</label>
            <textarea
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Optional notes..."
              rows={3}
              className="w-full px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-[#fafafa] placeholder:text-[#52525b] focus:outline-none focus:border-[#6366f1]/50 resize-none transition-all"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm rounded-lg bg-white/5 text-[#a1a1aa] hover:bg-white/10 transition-colors">Cancel</button>
            <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm rounded-lg bg-[#6366f1] hover:bg-[#818cf8] text-white font-medium transition-colors flex items-center gap-2">
              <Check size={14} /> Add Client
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={() => {}}
        title="Delete Client"
        message="Are you sure you want to delete this client? This action cannot be undone. All associated job requirements and candidate data will be permanently removed."
      />
    </div>
  );
}
