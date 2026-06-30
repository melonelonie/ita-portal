import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, Search, Calendar, ChevronDown, ChevronRight, Download,
  Plus, Edit, Trash2, CheckCircle2, XCircle, UserPlus, Bot,
  FileText, Filter, User, Clock
} from 'lucide-react';

// ─── Animations ────────────────────────────────────────────────────────────────
const pageVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const itemVariants = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

// ─── Types ─────────────────────────────────────────────────────────────────────
interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  userAvatar: string;
  action: 'Created' | 'Updated' | 'Deleted' | 'Approved' | 'Rejected' | 'Assigned' | 'Generated';
  entity: string;
  entityType: string;
  details: string;
  status: 'Success' | 'Failed' | 'Pending';
  isAI: boolean;
  metadata?: Record<string, string>;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const mockLogs: ActivityLog[] = [
  { id: '1', timestamp: '2025-05-28 20:12:00', user: 'AI Screener', userAvatar: 'AS', action: 'Generated', entity: 'Candidate Shortlist for JR-101', entityType: 'Pipeline', details: 'Screened 14 candidates against "Senior React Developer" requirements. 8 candidates shortlisted with match score > 70%.', status: 'Success', isAI: true, metadata: { 'Candidates Processed': '14', 'Shortlisted': '8', 'Avg Match Score': '78%' } },
  { id: '2', timestamp: '2025-05-28 19:45:00', user: 'Priya Sharma', userAvatar: 'PS', action: 'Created', entity: 'Job Requirement JR-108', entityType: 'JR', details: 'Created new job requirement "Full Stack Developer" for TechCorp Solutions.', status: 'Success', isAI: false, metadata: { 'Client': 'TechCorp', 'Priority': 'High', 'Openings': '2' } },
  { id: '3', timestamp: '2025-05-28 19:30:00', user: 'AI JR Drafter', userAvatar: 'JD', action: 'Generated', entity: 'JR Description for JR-108', entityType: 'JR', details: 'Auto-generated job description with market-aligned compensation data and required skill sets.', status: 'Success', isAI: true, metadata: { 'Words Generated': '450', 'Market Data Sources': '3' } },
  { id: '4', timestamp: '2025-05-28 18:55:00', user: 'Rahul Verma', userAvatar: 'RV', action: 'Updated', entity: 'Candidate Arjun M. Profile', entityType: 'Candidate', details: 'Updated interview feedback and moved candidate from "Interviewed" to "Offered" stage.', status: 'Success', isAI: false },
  { id: '5', timestamp: '2025-05-28 18:20:00', user: 'Admin', userAvatar: 'AD', action: 'Approved', entity: 'Offer Letter for Meera K.', entityType: 'Offer', details: 'Approved offer letter for Meera K. for the position of QA Automation Lead at TechCorp.', status: 'Success', isAI: false, metadata: { 'Position': 'QA Automation Lead', 'Compensation': '₹28 LPA' } },
  { id: '6', timestamp: '2025-05-28 17:40:00', user: 'AI Pipeline Tracker', userAvatar: 'PT', action: 'Generated', entity: 'Stall Alert for 3 Candidates', entityType: 'Alert', details: 'Detected 3 candidates stalled at Interview stage for more than 5 days. Auto-generated nudge notifications.', status: 'Success', isAI: true, metadata: { 'Stalled Candidates': '3', 'Avg Days Stalled': '6.2' } },
  { id: '7', timestamp: '2025-05-28 16:15:00', user: 'Ananya Patel', userAvatar: 'AP', action: 'Assigned', entity: 'TA to CloudBase Account', entityType: 'Assignment', details: 'Assigned Vikram Singh as secondary TA for CloudBase Technologies account.', status: 'Success', isAI: false },
  { id: '8', timestamp: '2025-05-28 15:30:00', user: 'Admin', userAvatar: 'AD', action: 'Rejected', entity: 'Candidate Suresh P. Application', entityType: 'Candidate', details: 'Rejected candidate application due to insufficient experience. Candidate notified via email.', status: 'Success', isAI: false },
  { id: '9', timestamp: '2025-05-28 14:50:00', user: 'AI Report Generator', userAvatar: 'RG', action: 'Generated', entity: 'Weekly Performance Report', entityType: 'Report', details: 'Generated and distributed weekly performance report to all admins and TAs.', status: 'Success', isAI: true, metadata: { 'Recipients': '8', 'Pages': '12', 'Charts': '6' } },
  { id: '10', timestamp: '2025-05-28 13:20:00', user: 'Vikram Singh', userAvatar: 'VS', action: 'Created', entity: 'Client Note for AI Solutions', entityType: 'Note', details: 'Added client note: "Client prefers candidates with research background. Flexible on years of experience."', status: 'Success', isAI: false },
  { id: '11', timestamp: '2025-05-28 12:00:00', user: 'AI Screener', userAvatar: 'AS', action: 'Generated', entity: 'Bulk Resume Processing', entityType: 'Pipeline', details: 'Processed 23 resumes uploaded for "ML Engineer" position. 12 passed initial screening.', status: 'Success', isAI: true, metadata: { 'Total Resumes': '23', 'Passed': '12', 'Rejected': '11' } },
  { id: '12', timestamp: '2025-05-28 11:30:00', user: 'Neha Gupta', userAvatar: 'NG', action: 'Updated', entity: 'Client FinTech Pro Status', entityType: 'Client', details: 'Updated client status from "On Hold" to "Active". Reactivated 2 pending job requirements.', status: 'Success', isAI: false },
  { id: '13', timestamp: '2025-05-28 10:45:00', user: 'Admin', userAvatar: 'AD', action: 'Deleted', entity: 'Duplicate JR-095', entityType: 'JR', details: 'Removed duplicate job requirement that was accidentally created. No candidates were affected.', status: 'Success', isAI: false },
  { id: '14', timestamp: '2025-05-28 10:00:00', user: 'AI Pipeline Tracker', userAvatar: 'PT', action: 'Generated', entity: 'SLA Breach Warning', entityType: 'Alert', details: 'Generated SLA breach warning for DataFlow Inc - "Data Engineer" position. 2 days past screening deadline.', status: 'Success', isAI: true, metadata: { 'Client': 'DataFlow Inc', 'Days Overdue': '2' } },
  { id: '15', timestamp: '2025-05-27 18:00:00', user: 'Priya Sharma', userAvatar: 'PS', action: 'Created', entity: 'Interview Schedule for 4 Candidates', entityType: 'Schedule', details: 'Scheduled technical interviews for 4 shortlisted candidates for TechCorp "Backend Engineer" role.', status: 'Success', isAI: false, metadata: { 'Candidates': '4', 'Interview Type': 'Technical' } },
  { id: '16', timestamp: '2025-05-27 16:30:00', user: 'AI Screener', userAvatar: 'AS', action: 'Generated', entity: 'Auto-Rejection Batch', entityType: 'Pipeline', details: 'Auto-rejected 6 candidates with match scores below 40% threshold. Notification emails sent.', status: 'Success', isAI: true, metadata: { 'Rejected': '6', 'Threshold': '40%' } },
  { id: '17', timestamp: '2025-05-27 14:15:00', user: 'System', userAvatar: 'SY', action: 'Updated', entity: 'Agent Configuration', entityType: 'Config', details: 'Updated screening threshold from 65% to 70%. Change made by Admin.', status: 'Success', isAI: false },
  { id: '18', timestamp: '2025-05-27 11:00:00', user: 'AI JR Drafter', userAvatar: 'JD', action: 'Generated', entity: 'Market Salary Insights', entityType: 'Report', details: 'Generated market salary insights for "DevOps Engineer" role. Recommended compensation range: ₹18-28 LPA.', status: 'Failed', isAI: true, metadata: { 'Error': 'Partial data - 2/5 sources unavailable' } },
];

const actionTypes = ['All', 'Created', 'Updated', 'Deleted', 'Approved', 'Rejected', 'Assigned', 'Generated'];
const entityTypes = ['All', 'JR', 'Candidate', 'Pipeline', 'Client', 'Report', 'Alert', 'Config', 'Offer', 'Note', 'Assignment', 'Schedule'];

// ─── Sub-Components ────────────────────────────────────────────────────────────
function Dropdown({ value, onChange, options, className = '' }: { value: string; onChange: (v: string) => void; options: string[]; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="appearance-none w-full px-3 py-2.5 pr-8 text-sm bg-white/5 border border-white/10 rounded-lg text-[#fafafa] focus:outline-none focus:border-[#6366f1]/50 cursor-pointer">
        {options.map(o => <option key={o} value={o} className="bg-[#0f0f14]">{o}</option>)}
      </select>
      <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#a1a1aa] pointer-events-none" />
    </div>
  );
}

function ActionBadge({ action, isAI }: { action: string; isAI: boolean }) {
  if (isAI) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-[#a78bfa]/10 text-[#a78bfa]">
        <Bot size={10} /> {action}
      </span>
    );
  }

  const colorMap: Record<string, string> = {
    Created: 'bg-emerald-500/10 text-emerald-400',
    Updated: 'bg-blue-500/10 text-blue-400',
    Deleted: 'bg-red-500/10 text-red-400',
    Approved: 'bg-emerald-500/10 text-emerald-400',
    Rejected: 'bg-red-500/10 text-red-400',
    Assigned: 'bg-indigo-500/10 text-indigo-400',
    Generated: 'bg-purple-500/10 text-purple-400',
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${colorMap[action] || 'bg-white/5 text-[#a1a1aa]'}`}>
      {action}
    </span>
  );
}

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Success: 'bg-emerald-400',
    Failed: 'bg-red-400',
    Pending: 'bg-yellow-400',
  };
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-1.5 h-1.5 rounded-full ${colors[status] || 'bg-zinc-400'}`} />
      <span className={`text-xs ${status === 'Success' ? 'text-emerald-400' : status === 'Failed' ? 'text-red-400' : 'text-yellow-400'}`}>{status}</span>
    </div>
  );
}

function getActionIcon(action: string) {
  switch (action) {
    case 'Created': return <Plus size={12} />;
    case 'Updated': return <Edit size={12} />;
    case 'Deleted': return <Trash2 size={12} />;
    case 'Approved': return <CheckCircle2 size={12} />;
    case 'Rejected': return <XCircle size={12} />;
    case 'Assigned': return <UserPlus size={12} />;
    case 'Generated': return <Bot size={12} />;
    default: return <Activity size={12} />;
  }
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function ActivityLogsPage() {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('All');
  const [entityFilter, setEntityFilter] = useState('All');
  const [userFilter, setUserFilter] = useState('All');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const uniqueUsers = ['All', ...Array.from(new Set(mockLogs.map(l => l.user)))];

  const filteredLogs = useMemo(() => {
    return mockLogs.filter(log => {
      const matchesSearch = search === '' ||
        log.entity.toLowerCase().includes(search.toLowerCase()) ||
        log.details.toLowerCase().includes(search.toLowerCase()) ||
        log.user.toLowerCase().includes(search.toLowerCase());
      const matchesAction = actionFilter === 'All' || log.action === actionFilter;
      const matchesEntity = entityFilter === 'All' || log.entityType === entityFilter;
      const matchesUser = userFilter === 'All' || log.user === userFilter;
      return matchesSearch && matchesAction && matchesEntity && matchesUser;
    });
  }, [search, actionFilter, entityFilter, userFilter]);

  const totalPages = Math.ceil(filteredLogs.length / perPage);
  const paginatedLogs = filteredLogs.slice((page - 1) * perPage, page * perPage);

  const formatTimestamp = (ts: string) => {
    const date = new Date(ts);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
    };
  };

  return (
    <div className="min-h-screen bg-[#09090b] p-6">
      <motion.div variants={pageVariants} initial="hidden" animate="visible" className="max-w-[1400px] mx-auto space-y-6">
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#fafafa] flex items-center gap-3">
              <div className="p-2 bg-[#6366f1]/10 rounded-lg"><Activity size={22} className="text-[#6366f1]" /></div>
              Activity Logs
            </h1>
            <p className="text-sm text-[#a1a1aa] mt-1">{filteredLogs.length} activities recorded</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 text-[#a1a1aa] hover:text-[#fafafa] text-sm rounded-lg hover:bg-white/10 transition-colors">
            <Download size={16} /> Export Logs
          </button>
        </motion.div>

        {/* Quick Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Actions', value: mockLogs.length, color: '#6366f1' },
            { label: 'AI Actions', value: mockLogs.filter(l => l.isAI).length, color: '#a78bfa' },
            { label: 'User Actions', value: mockLogs.filter(l => !l.isAI).length, color: '#22c55e' },
            { label: 'Failed', value: mockLogs.filter(l => l.status === 'Failed').length, color: '#ef4444' },
          ].map(stat => (
            <div key={stat.label} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
              <p className="text-2xl font-bold text-[#fafafa]">{stat.value}</p>
              <p className="text-xs text-[#a1a1aa] mt-0.5">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Filter Bar */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525b]" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search activities..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white/5 border border-white/10 rounded-lg text-[#fafafa] placeholder:text-[#52525b] focus:outline-none focus:border-[#6366f1]/50 transition-all"
            />
          </div>
          <Dropdown value={userFilter} onChange={v => { setUserFilter(v); setPage(1); }} options={uniqueUsers} className="w-44" />
          <Dropdown value={actionFilter} onChange={v => { setActionFilter(v); setPage(1); }} options={actionTypes} className="w-36" />
          <Dropdown value={entityFilter} onChange={v => { setEntityFilter(v); setPage(1); }} options={entityTypes} className="w-36" />
        </motion.div>

        {/* Activity Table */}
        <motion.div variants={itemVariants} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden">
          {paginatedLogs.length === 0 ? (
            <div className="py-20 text-center">
              <Activity size={40} className="mx-auto text-[#27272a] mb-4" />
              <p className="text-sm text-[#a1a1aa]">No activities match your filters</p>
              <p className="text-xs text-[#52525b] mt-1">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="w-8 px-3 py-3.5" />
                    {['Timestamp', 'User', 'Action', 'Entity', 'Details', 'Status'].map(h => (
                      <th key={h} className="px-4 py-3.5 text-left text-xs font-medium text-[#52525b] uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedLogs.map((log, i) => {
                    const ts = formatTimestamp(log.timestamp);
                    const isExpanded = expandedRow === log.id;
                    return (
                      <>
                        <motion.tr
                          key={log.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.02 }}
                          onClick={() => setExpandedRow(isExpanded ? null : log.id)}
                          className={`border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors cursor-pointer ${
                            log.isAI ? 'bg-[#a78bfa]/[0.02]' : ''
                          }`}
                        >
                          <td className="px-3 py-3.5">
                            <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
                              <ChevronRight size={14} className="text-[#52525b]" />
                            </motion.div>
                          </td>
                          <td className="px-4 py-3.5">
                            <div>
                              <p className="text-xs text-[#fafafa]">{ts.date}</p>
                              <p className="text-[10px] text-[#52525b]">{ts.time}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2">
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                log.isAI ? 'bg-[#a78bfa]/20 text-[#a78bfa]' : 'bg-[#6366f1]/20 text-[#818cf8]'
                              }`}>
                                {log.userAvatar}
                              </div>
                              <span className="text-sm text-[#fafafa]">{log.user}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5"><ActionBadge action={log.action} isAI={log.isAI} /></td>
                          <td className="px-4 py-3.5">
                            <div>
                              <p className="text-sm text-[#fafafa] max-w-xs truncate">{log.entity}</p>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-[#52525b]">{log.entityType}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <p className="text-xs text-[#a1a1aa] max-w-xs truncate">{log.details}</p>
                          </td>
                          <td className="px-4 py-3.5"><StatusDot status={log.status} /></td>
                        </motion.tr>

                        {/* Expanded Details */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.tr
                              key={`${log.id}-expanded`}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                            >
                              <td colSpan={7} className="px-4 py-0">
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  className="py-4 pl-12 border-b border-white/5"
                                >
                                  <div className="bg-white/[0.02] rounded-lg p-4 border border-white/5">
                                    <p className="text-sm text-[#a1a1aa] leading-relaxed mb-3">{log.details}</p>
                                    {log.metadata && (
                                      <div className="flex flex-wrap gap-3">
                                        {Object.entries(log.metadata).map(([key, value]) => (
                                          <div key={key} className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/5">
                                            <p className="text-[10px] text-[#52525b] uppercase tracking-wider">{key}</p>
                                            <p className="text-sm font-medium text-[#fafafa]">{value}</p>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/5">
                                      <span className="text-[10px] text-[#52525b] flex items-center gap-1"><Clock size={10} /> {log.timestamp}</span>
                                      <span className="text-[10px] text-[#52525b] flex items-center gap-1"><User size={10} /> {log.user}</span>
                                      <span className="text-[10px] text-[#52525b] flex items-center gap-1"><FileText size={10} /> ID: {log.id}</span>
                                    </div>
                                  </div>
                                </motion.div>
                              </td>
                            </motion.tr>
                          )}
                        </AnimatePresence>
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-white/5">
              <p className="text-xs text-[#52525b]">
                Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filteredLogs.length)} of {filteredLogs.length}
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
    </div>
  );
}
