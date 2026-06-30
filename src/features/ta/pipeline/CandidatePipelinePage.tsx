import { useState, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, ChevronDown, X, Clock, AlertTriangle, Sparkles, MessageSquare,
  MoreHorizontal, User, Briefcase, Calendar, ArrowRight, ArrowLeft, Phone,
  Mail, MapPin, Star, FileText, Plus, Send, Eye, ChevronRight, Bot,
  GripVertical, CheckCircle2, XCircle, AlertCircle, Timer
} from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────

interface Candidate {
  id: string;
  name: string;
  role: string;
  client: string;
  matchScore: number;
  stage: string;
  daysInStage: number;
  slaLimit: number;
  email: string;
  phone: string;
  location: string;
  experience: string;
  skills: string[];
  aiRecommendation?: string;
  avatar: string;
  appliedDate: string;
  timeline: { date: string; action: string; by: string }[];
  interviews: { round: string; date: string; interviewer: string; rating?: number; feedback?: string }[];
  notes: { date: string; by: string; text: string }[];
  aiAssessment: string;
}

// ── Mock Data ────────────────────────────────────────────────────────────────

const stages = ['Applied', 'Screened', 'Shortlisted', 'Interview R1', 'Interview R2', 'Final Round', 'Offered', 'Placed', 'Rejected'];
const stageColors: Record<string, string> = {
  Applied: '#6366f1', Screened: '#818cf8', Shortlisted: '#22c55e', 'Interview R1': '#f59e0b',
  'Interview R2': '#fb923c', 'Final Round': '#ef4444', Offered: '#a78bfa', Placed: '#14b8a6', Rejected: '#71717a',
};

const candidates: Candidate[] = [
  { id: 'c01', name: 'Priya Kapoor', role: 'Senior Frontend Engineer', client: 'TechVista Solutions', matchScore: 95, stage: 'Interview R1', daysInStage: 2, slaLimit: 5, email: 'priya@email.com', phone: '+91 98765 43210', location: 'Bangalore', experience: '6 years', skills: ['React', 'TypeScript', 'Next.js', 'GraphQL'], aiRecommendation: 'AI: Strong candidate – schedule R2', avatar: 'PK', appliedDate: '2026-05-15', timeline: [{ date: '2026-05-15', action: 'Applied', by: 'System' }, { date: '2026-05-18', action: 'Screened – 95% match', by: 'Screener Agent' }, { date: '2026-05-20', action: 'Shortlisted', by: 'Sarah (TA)' }, { date: '2026-05-24', action: 'Interview R1 Scheduled', by: 'Sarah (TA)' }], interviews: [{ round: 'R1', date: '2026-05-26', interviewer: 'Amit Shah', rating: 4, feedback: 'Strong React fundamentals, good system design thinking.' }], notes: [{ date: '2026-05-20', by: 'Sarah', text: 'Excellent portfolio, strong open source contributions.' }], aiAssessment: 'Top-tier candidate with strong technical skills matching 95% of JR requirements. Recommended for fast-track.' },
  { id: 'c02', name: 'Rohit Mehta', role: 'Backend Engineer', client: 'FinServe Capital', matchScore: 88, stage: 'Interview R2', daysInStage: 1, slaLimit: 5, email: 'rohit@email.com', phone: '+91 98765 12345', location: 'Mumbai', experience: '4 years', skills: ['Node.js', 'Python', 'PostgreSQL', 'Kafka'], aiRecommendation: 'AI: Consider moving forward', avatar: 'RM', appliedDate: '2026-05-10', timeline: [{ date: '2026-05-10', action: 'Applied', by: 'System' }], interviews: [{ round: 'R1', date: '2026-05-20', interviewer: 'Neha Gupta', rating: 4, feedback: 'Good problem-solving skills.' }, { round: 'R2', date: '2026-05-28', interviewer: 'Vijay Kumar' }], notes: [], aiAssessment: 'Strong backend skills. Good cultural fit indicators.' },
  { id: 'c03', name: 'Ananya Sharma', role: 'Data Analyst', client: 'NovaTech Analytics', matchScore: 82, stage: 'Final Round', daysInStage: 3, slaLimit: 5, email: 'ananya@email.com', phone: '+91 99999 88888', location: 'Remote', experience: '3 years', skills: ['SQL', 'Python', 'Tableau', 'Statistics'], avatar: 'AS', appliedDate: '2026-05-08', timeline: [], interviews: [{ round: 'Final', date: '2026-05-29', interviewer: 'CTO Panel' }], notes: [{ date: '2026-05-25', by: 'Sarah', text: 'Client impressed with case study presentation.' }], aiAssessment: 'Solid analytical skills, recommend offer discussion.' },
  { id: 'c04', name: 'Vikram Patel', role: 'Senior Frontend Engineer', client: 'TechVista Solutions', matchScore: 91, stage: 'Screened', daysInStage: 1, slaLimit: 3, email: 'vikram@email.com', phone: '+91 88888 77777', location: 'Pune', experience: '7 years', skills: ['React', 'Vue', 'TypeScript', 'CSS'], avatar: 'VP', appliedDate: '2026-05-26', timeline: [], interviews: [], notes: [], aiAssessment: 'Very strong match, broad frontend experience.' },
  { id: 'c05', name: 'Sneha Iyer', role: 'Senior Frontend Engineer', client: 'TechVista Solutions', matchScore: 78, stage: 'Applied', daysInStage: 3, slaLimit: 3, email: 'sneha@email.com', phone: '+91 77777 66666', location: 'Chennai', experience: '5 years', skills: ['React', 'JavaScript', 'CSS', 'Redux'], aiRecommendation: 'AI: Follow up needed – approaching SLA', avatar: 'SI', appliedDate: '2026-05-25', timeline: [], interviews: [], notes: [], aiAssessment: 'Decent match but lacks TypeScript depth.' },
  { id: 'c06', name: 'Arjun Nair', role: 'Backend Engineer', client: 'FinServe Capital', matchScore: 72, stage: 'Shortlisted', daysInStage: 4, slaLimit: 5, email: 'arjun@email.com', phone: '+91 66666 55555', location: 'Hyderabad', experience: '3 years', skills: ['Java', 'Spring Boot', 'MySQL', 'Docker'], avatar: 'AN', appliedDate: '2026-05-18', timeline: [], interviews: [], notes: [], aiAssessment: 'Good fundamentals, fintech experience is a plus.' },
  { id: 'c07', name: 'Kavita Reddy', role: 'Senior Frontend Engineer', client: 'TechVista Solutions', matchScore: 85, stage: 'Interview R1', daysInStage: 6, slaLimit: 5, email: 'kavita@email.com', phone: '+91 55555 44444', location: 'Bangalore', experience: '6 years', skills: ['React', 'TypeScript', 'Next.js', 'Figma'], aiRecommendation: 'AI: Stalled >5 days – urgent follow up', avatar: 'KR', appliedDate: '2026-05-14', timeline: [], interviews: [{ round: 'R1', date: '2026-05-22', interviewer: 'Pending' }], notes: [], aiAssessment: 'Strong candidate stalled in pipeline.' },
  { id: 'c08', name: 'Deepak Joshi', role: 'Data Analyst', client: 'NovaTech Analytics', matchScore: 68, stage: 'Applied', daysInStage: 5, slaLimit: 3, email: 'deepak@email.com', phone: '+91 44444 33333', location: 'Delhi', experience: '2 years', skills: ['Excel', 'SQL', 'Python'], aiRecommendation: 'AI: SLA violated – review urgently', avatar: 'DJ', appliedDate: '2026-05-23', timeline: [], interviews: [], notes: [], aiAssessment: 'Junior profile, partial skill match.' },
  { id: 'c09', name: 'Meera Krishnan', role: 'Backend Engineer', client: 'FinServe Capital', matchScore: 90, stage: 'Offered', daysInStage: 2, slaLimit: 7, email: 'meera@email.com', phone: '+91 33333 22222', location: 'Bangalore', experience: '5 years', skills: ['Node.js', 'Go', 'PostgreSQL', 'AWS'], avatar: 'MK', appliedDate: '2026-05-05', timeline: [], interviews: [{ round: 'R1', date: '2026-05-12', interviewer: 'Team', rating: 5, feedback: 'Excellent.' }, { round: 'R2', date: '2026-05-16', interviewer: 'VP Eng', rating: 5, feedback: 'Outstanding.' }], notes: [{ date: '2026-05-26', by: 'Sarah', text: 'Offer sent – ₹32L CTC.' }], aiAssessment: 'Exceptional candidate. High likelihood of acceptance.' },
  { id: 'c10', name: 'Rahul Bose', role: 'Senior Frontend Engineer', client: 'TechVista Solutions', matchScore: 62, stage: 'Rejected', daysInStage: 0, slaLimit: 0, email: 'rahul@email.com', phone: '+91 22222 11111', location: 'Kolkata', experience: '4 years', skills: ['Angular', 'JavaScript', 'SASS'], avatar: 'RB', appliedDate: '2026-05-12', timeline: [], interviews: [{ round: 'R1', date: '2026-05-18', interviewer: 'Amit', rating: 2, feedback: 'Weak React skills.' }], notes: [], aiAssessment: 'Below threshold. Angular-focused, not a React fit.' },
  { id: 'c11', name: 'Nisha Agarwal', role: 'Senior Frontend Engineer', client: 'TechVista Solutions', matchScore: 87, stage: 'Applied', daysInStage: 1, slaLimit: 3, email: 'nisha@email.com', phone: '+91 11111 00000', location: 'Noida', experience: '5 years', skills: ['React', 'TypeScript', 'TailwindCSS', 'Testing'], avatar: 'NA', appliedDate: '2026-05-27', timeline: [], interviews: [], notes: [], aiAssessment: 'Strong match, recommend screening.' },
  { id: 'c12', name: 'Saurav Das', role: 'Backend Engineer', client: 'FinServe Capital', matchScore: 76, stage: 'Screened', daysInStage: 3, slaLimit: 3, email: 'saurav@email.com', phone: '+91 00000 99999', location: 'Pune', experience: '3 years', skills: ['Python', 'Django', 'PostgreSQL', 'Redis'], aiRecommendation: 'AI: Approaching SLA limit', avatar: 'SD', appliedDate: '2026-05-20', timeline: [], interviews: [], notes: [], aiAssessment: 'Moderate match. Consider for shortlist.' },
  { id: 'c13', name: 'Tanya Singh', role: 'Data Analyst', client: 'NovaTech Analytics', matchScore: 92, stage: 'Shortlisted', daysInStage: 1, slaLimit: 5, email: 'tanya@email.com', phone: '+91 12345 67890', location: 'Remote', experience: '4 years', skills: ['SQL', 'Python', 'Power BI', 'dbt', 'Snowflake'], aiRecommendation: 'AI: Top candidate – prioritize', avatar: 'TS', appliedDate: '2026-05-22', timeline: [], interviews: [], notes: [], aiAssessment: 'Exceptional data skills, strong cultural fit.' },
  { id: 'c14', name: 'Aditya Verma', role: 'Senior Frontend Engineer', client: 'TechVista Solutions', matchScore: 55, stage: 'Screened', daysInStage: 2, slaLimit: 3, email: 'aditya@email.com', phone: '+91 67890 12345', location: 'Gurgaon', experience: '3 years', skills: ['React', 'JavaScript', 'HTML/CSS'], avatar: 'AV', appliedDate: '2026-05-24', timeline: [], interviews: [], notes: [], aiAssessment: 'Below average match. Lacks senior-level depth.' },
  { id: 'c15', name: 'Pooja Menon', role: 'Backend Engineer', client: 'FinServe Capital', matchScore: 83, stage: 'Interview R1', daysInStage: 3, slaLimit: 5, email: 'pooja@email.com', phone: '+91 45678 90123', location: 'Bangalore', experience: '4 years', skills: ['Node.js', 'TypeScript', 'MongoDB', 'AWS'], avatar: 'PM', appliedDate: '2026-05-16', timeline: [], interviews: [{ round: 'R1', date: '2026-05-27', interviewer: 'Neha Gupta' }], notes: [], aiAssessment: 'Good backend profile. Strong Node.js expertise.' },
  { id: 'c16', name: 'Karan Malhotra', role: 'Senior Frontend Engineer', client: 'TechVista Solutions', matchScore: 74, stage: 'Placed', daysInStage: 5, slaLimit: 0, email: 'karan@email.com', phone: '+91 34567 89012', location: 'Bangalore', experience: '7 years', skills: ['React', 'TypeScript', 'Architecture'], avatar: 'KM', appliedDate: '2026-04-20', timeline: [], interviews: [], notes: [{ date: '2026-05-23', by: 'Sarah', text: 'Joined TechVista on May 23rd.' }], aiAssessment: 'Successfully placed.' },
];

const jrOptions = ['All JRs', 'Senior Frontend Engineer – TechVista', 'Backend Engineer – FinServe', 'Data Analyst – NovaTech'];
const clientOptions = ['All Clients', 'TechVista Solutions', 'FinServe Capital', 'NovaTech Analytics'];

// ── Helpers ──────────────────────────────────────────────────────────────────

function getScoreColor(score: number) {
  if (score >= 85) return 'text-emerald-400 bg-emerald-500/20';
  if (score >= 70) return 'text-amber-400 bg-amber-500/20';
  return 'text-red-400 bg-red-500/20';
}

function getSLAStatus(daysInStage: number, slaLimit: number) {
  if (slaLimit === 0) return 'none';
  if (daysInStage > slaLimit) return 'violated';
  if (daysInStage >= slaLimit - 1) return 'approaching';
  return 'ok';
}

const slaBorder: Record<string, string> = {
  ok: 'border-[#27272a]',
  approaching: 'border-amber-500/50',
  violated: 'border-red-500/50 shadow-red-500/10 shadow-lg',
  none: 'border-[#27272a]',
};

// ── Component ────────────────────────────────────────────────────────────────

export default function CandidatePipelinePage() {
  const [selectedJR, setSelectedJR] = useState('All JRs');
  const [selectedClient, setSelectedClient] = useState('All Clients');
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerCandidate, setDrawerCandidate] = useState<Candidate | null>(null);
  const [newNote, setNewNote] = useState('');
  const [draggedCard, setDraggedCard] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);
  const [candidateStages, setCandidateStages] = useState<Record<string, string>>(
    Object.fromEntries(candidates.map(c => [c.id, c.stage]))
  );

  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => {
      if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (selectedClient !== 'All Clients' && c.client !== selectedClient) return false;
      if (selectedJR !== 'All JRs') {
        const jrRole = selectedJR.split(' – ')[0];
        if (!c.role.includes(jrRole.replace('Senior ', ''))) return false;
      }
      return true;
    });
  }, [searchQuery, selectedClient, selectedJR]);

  const getCandidatesForStage = useCallback((stage: string) => {
    return filteredCandidates.filter(c => candidateStages[c.id] === stage);
  }, [filteredCandidates, candidateStages]);

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, candidateId: string) => {
    setDraggedCard(candidateId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', candidateId);
  };

  const handleDragOver = (e: React.DragEvent, stage: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverStage(stage);
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = (e: React.DragEvent, stage: string) => {
    e.preventDefault();
    const candidateId = e.dataTransfer.getData('text/plain');
    if (candidateId) {
      setCandidateStages(prev => ({ ...prev, [candidateId]: stage }));
    }
    setDraggedCard(null);
    setDragOverStage(null);
  };

  const handleDragEnd = () => {
    setDraggedCard(null);
    setDragOverStage(null);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa]">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="px-4 md:px-8 pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl md:text-2xl font-bold">Candidate Pipeline</h1>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#a1a1aa] flex items-center gap-1"><Bot size={14} className="text-purple-400" /> Pipeline Tracker Agent Active</span>
          </div>
        </div>
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a1a1aa]" />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="bg-white/5 border border-[#27272a] rounded-lg pl-9 pr-3 py-2 text-xs text-[#fafafa] placeholder-[#a1a1aa] focus:outline-none focus:border-indigo-500/50 w-56" placeholder="Search candidates..." />
          </div>
          <select value={selectedJR} onChange={e => setSelectedJR(e.target.value)} className="bg-white/5 border border-[#27272a] rounded-lg px-3 py-2 text-xs text-[#fafafa] focus:outline-none focus:border-indigo-500/50">
            {jrOptions.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <select value={selectedClient} onChange={e => setSelectedClient(e.target.value)} className="bg-white/5 border border-[#27272a] rounded-lg px-3 py-2 text-xs text-[#fafafa] focus:outline-none focus:border-indigo-500/50">
            {clientOptions.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      </motion.div>

      {/* Kanban Board */}
      <div className="px-4 md:px-8 pb-8 overflow-x-auto">
        <div className="flex gap-3 min-w-max">
          {stages.map(stage => {
            const stageCandidates = getCandidatesForStage(stage);
            const isOver = dragOverStage === stage;
            return (
              <motion.div
                key={stage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: stages.indexOf(stage) * 0.05 }}
                className={`w-[240px] shrink-0 rounded-xl bg-white/[0.02] border transition-colors ${isOver ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-[#27272a]'}`}
                onDragOver={e => handleDragOver(e, stage)}
                onDragLeave={handleDragLeave}
                onDrop={e => handleDrop(e, stage)}
              >
                {/* Column Header */}
                <div className="p-3 border-b border-[#27272a] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stageColors[stage] }} />
                    <span className="text-xs font-semibold">{stage}</span>
                  </div>
                  <span className="text-[10px] bg-white/10 text-[#a1a1aa] px-2 py-0.5 rounded-full font-medium">{stageCandidates.length}</span>
                </div>
                {/* Cards */}
                <div className="p-2 space-y-2 min-h-[200px] max-h-[calc(100vh-220px)] overflow-y-auto">
                  {stageCandidates.map(c => {
                    const sla = getSLAStatus(c.daysInStage, c.slaLimit);
                    const isDragging = draggedCard === c.id;
                    return (
                      <div
                        key={c.id}
                        draggable
                        onDragStart={e => handleDragStart(e, c.id)}
                        onDragEnd={handleDragEnd}
                        onClick={() => setDrawerCandidate(c)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all hover:bg-white/[0.04] group ${slaBorder[sla]} ${isDragging ? 'opacity-40 scale-95' : ''} ${sla === 'violated' ? 'ring-1 ring-red-500/30' : ''}`}
                        style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                      >
                        {/* Name + Score */}
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-7 h-7 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] font-bold text-indigo-400 shrink-0">
                              {c.avatar}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold truncate">{c.name}</p>
                              <p className="text-[10px] text-[#a1a1aa] truncate">{c.role}</p>
                            </div>
                          </div>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${getScoreColor(c.matchScore)}`}>{c.matchScore}%</span>
                        </div>
                        {/* Days + SLA */}
                        <div className="flex items-center justify-between text-[10px] text-[#a1a1aa]">
                          <span className="flex items-center gap-1">
                            <Clock size={10} /> {c.daysInStage}d in stage
                          </span>
                          {sla === 'violated' && (
                            <span className="flex items-center gap-0.5 text-red-400">
                              <AlertTriangle size={10} /> SLA
                            </span>
                          )}
                          {sla === 'approaching' && (
                            <span className="flex items-center gap-0.5 text-amber-400">
                              <Timer size={10} /> {c.slaLimit - c.daysInStage}d left
                            </span>
                          )}
                        </div>
                        {/* AI Chip */}
                        {c.aiRecommendation && (
                          <div className="mt-2 text-[9px] px-2 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-300 flex items-center gap-1">
                            <Sparkles size={9} className="shrink-0" /> {c.aiRecommendation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {stageCandidates.length === 0 && (
                    <div className="text-center py-8 text-[#a1a1aa]">
                      <p className="text-[10px]">No candidates</p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Slide-in Drawer ── */}
      <AnimatePresence>
        {drawerCandidate && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setDrawerCandidate(null)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-[#0f0f14] border-l border-[#27272a] z-50 flex flex-col overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-[#27272a] shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <button onClick={() => setDrawerCandidate(null)} className="text-[#a1a1aa] hover:text-[#fafafa] transition-colors">
                    <X size={18} />
                  </button>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${getScoreColor(drawerCandidate.matchScore)}`}>{drawerCandidate.matchScore}% Match</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-lg font-bold text-indigo-400">
                    {drawerCandidate.avatar}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">{drawerCandidate.name}</h2>
                    <p className="text-xs text-[#a1a1aa]">{drawerCandidate.role} · {drawerCandidate.client}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-3 text-[10px] text-[#a1a1aa]">
                  <span className="flex items-center gap-1"><Mail size={10} />{drawerCandidate.email}</span>
                  <span className="flex items-center gap-1"><Phone size={10} />{drawerCandidate.phone}</span>
                  <span className="flex items-center gap-1"><MapPin size={10} />{drawerCandidate.location}</span>
                </div>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {/* AI Assessment */}
                <div className="p-4 rounded-xl border border-purple-500/20 bg-purple-500/5 relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
                  <h3 className="text-xs font-semibold flex items-center gap-2 mb-2"><Sparkles size={12} className="text-purple-400" /> AI Assessment</h3>
                  <p className="text-xs text-[#a1a1aa] leading-relaxed">{drawerCandidate.aiAssessment}</p>
                </div>

                {/* Skills */}
                <div>
                  <h3 className="text-xs font-semibold mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {drawerCandidate.skills.map(s => (
                      <span key={s} className="text-[10px] bg-indigo-500/15 text-indigo-300 px-2 py-1 rounded-md">{s}</span>
                    ))}
                  </div>
                </div>

                {/* Activity Timeline */}
                <div>
                  <h3 className="text-xs font-semibold mb-2">Activity Timeline</h3>
                  {drawerCandidate.timeline.length > 0 ? (
                    <div className="space-y-0">
                      {drawerCandidate.timeline.map((t, i) => (
                        <div key={i} className="flex items-start gap-3 pb-3 border-l-2 border-[#27272a] pl-4 ml-1 relative">
                          <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-indigo-400" />
                          <div>
                            <p className="text-xs">{t.action}</p>
                            <p className="text-[10px] text-[#a1a1aa]">{t.date} · {t.by}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-[#a1a1aa]">No timeline events yet.</p>
                  )}
                </div>

                {/* Interview History */}
                <div>
                  <h3 className="text-xs font-semibold mb-2">Interview History</h3>
                  {drawerCandidate.interviews.length > 0 ? (
                    <div className="space-y-2">
                      {drawerCandidate.interviews.map((iv, i) => (
                        <div key={i} className="p-3 rounded-lg bg-white/[0.03] border border-[#27272a]">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium">{iv.round}</span>
                            <span className="text-[10px] text-[#a1a1aa]">{iv.date}</span>
                          </div>
                          <p className="text-[10px] text-[#a1a1aa]">Interviewer: {iv.interviewer}</p>
                          {iv.rating && (
                            <div className="flex items-center gap-0.5 mt-1">
                              {[1, 2, 3, 4, 5].map(s => (
                                <Star key={s} size={10} className={s <= iv.rating! ? 'text-amber-400 fill-amber-400' : 'text-[#27272a]'} />
                              ))}
                            </div>
                          )}
                          {iv.feedback && <p className="text-[10px] text-[#a1a1aa] mt-1 italic">"{iv.feedback}"</p>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-[#a1a1aa]">No interviews yet.</p>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <h3 className="text-xs font-semibold mb-2">Notes</h3>
                  {drawerCandidate.notes.map((n, i) => (
                    <div key={i} className="p-3 rounded-lg bg-white/[0.03] border border-[#27272a] mb-2">
                      <p className="text-xs">{n.text}</p>
                      <p className="text-[10px] text-[#a1a1aa] mt-1">{n.by} · {n.date}</p>
                    </div>
                  ))}
                  <div className="flex gap-2 mt-2">
                    <input value={newNote} onChange={e => setNewNote(e.target.value)} className="flex-1 bg-white/5 border border-[#27272a] rounded-lg px-3 py-2 text-xs text-[#fafafa] placeholder-[#a1a1aa] focus:outline-none focus:border-indigo-500/50" placeholder="Add a note..." />
                    <button className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 transition-colors"><Send size={14} /></button>
                  </div>
                </div>
              </div>

              {/* Drawer Actions */}
              <div className="p-4 border-t border-[#27272a] flex flex-wrap gap-2 shrink-0">
                <button className="flex items-center gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-lg transition-colors"><Calendar size={12} /> Schedule Interview</button>
                <button className="flex items-center gap-1.5 text-xs bg-white/5 border border-[#27272a] text-[#a1a1aa] hover:text-[#fafafa] px-3 py-2 rounded-lg transition-colors"><ArrowRight size={12} /> Move Stage</button>
                <button className="flex items-center gap-1.5 text-xs bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 px-3 py-2 rounded-lg transition-colors"><XCircle size={12} /> Reject</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
