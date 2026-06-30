import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, FileText, X, Search, ChevronDown, ChevronUp, Eye, UserPlus, XCircle,
  Sparkles, Bot, Filter, ArrowUpDown, Check, AlertCircle, Star, Users,
  Briefcase, GraduationCap, BarChart3, Zap, Target, Award
} from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, Legend, Tooltip
} from 'recharts';

// ── Types ────────────────────────────────────────────────────────────────────

interface CandidateResult {
  id: string;
  name: string;
  matchScore: number;
  experienceFit: number;
  skillMatch: number;
  aiRanking: number;
  status: 'New' | 'Shortlisted' | 'Rejected' | 'Review';
  experience: string;
  currentRole: string;
  skills: string[];
  education: string;
  aiReasoning: string;
  avatar: string;
}

// ── Mock Data ────────────────────────────────────────────────────────────────

const jrOptions = [
  { value: 'jr-001', label: 'Senior Frontend Engineer – TechVista Solutions' },
  { value: 'jr-002', label: 'Backend Engineer – FinServe Capital' },
  { value: 'jr-003', label: 'Data Analyst – NovaTech Analytics' },
];

const mockCandidates: CandidateResult[] = [
  { id: 's1', name: 'Priya Kapoor', matchScore: 95, experienceFit: 92, skillMatch: 98, aiRanking: 1, status: 'Shortlisted', experience: '6 years', currentRole: 'Frontend Engineer at Razorpay', skills: ['React', 'TypeScript', 'Next.js', 'GraphQL', 'TailwindCSS'], education: 'B.Tech CS – IIT Bombay', aiReasoning: 'Exceptional match across all dimensions. 6 years of React experience with strong TypeScript skills. Has led frontend teams and contributed to design systems. Portfolio demonstrates advanced animation and performance optimization work. Highly recommended for fast-track.', avatar: 'PK' },
  { id: 's2', name: 'Vikram Patel', matchScore: 91, experienceFit: 95, skillMatch: 88, aiRanking: 2, status: 'Shortlisted', experience: '7 years', currentRole: 'Senior UI Engineer at Flipkart', skills: ['React', 'Vue', 'TypeScript', 'CSS Architecture', 'Webpack'], education: 'M.Tech – IIIT Hyderabad', aiReasoning: 'Very strong candidate with 7 years experience. Broad frontend knowledge including both React and Vue ecosystems. Has architectural experience but GraphQL exposure is limited. Strong leadership background.', avatar: 'VP' },
  { id: 's3', name: 'Nisha Agarwal', matchScore: 87, experienceFit: 82, skillMatch: 90, aiRanking: 3, status: 'New', experience: '5 years', currentRole: 'Frontend Developer at Swiggy', skills: ['React', 'TypeScript', 'TailwindCSS', 'Testing', 'Storybook'], education: 'B.Tech – NIT Trichy', aiReasoning: 'Strong technical match, especially in React and testing. Storybook experience is a plus for the design system focus. Slightly less experience than ideal but compensated by strong skill depth.', avatar: 'NA' },
  { id: 's4', name: 'Kavita Reddy', matchScore: 85, experienceFit: 88, skillMatch: 83, aiRanking: 4, status: 'New', experience: '6 years', currentRole: 'UI Lead at Zoho', skills: ['React', 'TypeScript', 'Next.js', 'Figma', 'Accessibility'], education: 'B.E. – Anna University', aiReasoning: 'Good overall fit with strong accessibility focus. Figma collaboration experience is valuable. GraphQL and advanced testing skills could be stronger.', avatar: 'KR' },
  { id: 's5', name: 'Sneha Iyer', matchScore: 78, experienceFit: 75, skillMatch: 80, aiRanking: 5, status: 'Review', experience: '5 years', currentRole: 'React Developer at Infosys', skills: ['React', 'JavaScript', 'CSS', 'Redux', 'REST APIs'], education: 'B.Tech – VIT', aiReasoning: 'Decent React experience but TypeScript skills are developing. No Next.js or GraphQL experience. Has good fundamentals but may need upskilling in some areas.', avatar: 'SI' },
  { id: 's6', name: 'Arjun Deshmukh', matchScore: 72, experienceFit: 70, skillMatch: 74, aiRanking: 6, status: 'Review', experience: '4 years', currentRole: 'Frontend Dev at TCS', skills: ['React', 'JavaScript', 'Material UI', 'Git'], education: 'B.Tech – Pune University', aiReasoning: 'Below target experience level. Limited TypeScript and modern tooling exposure. Strong in basic React but lacks advanced ecosystem knowledge.', avatar: 'AD' },
  { id: 's7', name: 'Rahul Bose', matchScore: 62, experienceFit: 55, skillMatch: 68, aiRanking: 7, status: 'Rejected', experience: '4 years', currentRole: 'Angular Developer at Wipro', skills: ['Angular', 'JavaScript', 'SASS', 'RxJS'], education: 'BCA – Kolkata University', aiReasoning: 'Primary expertise is Angular, not React. Would need significant ramp-up time for the React/TypeScript/Next.js stack. Not recommended for this specific role.', avatar: 'RB' },
  { id: 's8', name: 'Aditya Verma', matchScore: 45, experienceFit: 40, skillMatch: 50, aiRanking: 8, status: 'Rejected', experience: '2 years', currentRole: 'Junior Dev at Startup', skills: ['HTML', 'CSS', 'JavaScript', 'React Basics'], education: 'BSc CS – Delhi University', aiReasoning: 'Too junior for senior role. Only 2 years experience with basic React knowledge. No TypeScript, Next.js, or advanced tooling experience. Consider for junior positions.', avatar: 'AV' },
];

const uploadedFiles = [
  { name: 'Priya_Kapoor_Resume.pdf', size: '245 KB' },
  { name: 'Vikram_Patel_CV.pdf', size: '312 KB' },
  { name: 'Nisha_Agarwal_Resume.docx', size: '198 KB' },
  { name: 'Kavita_Reddy_CV.pdf', size: '267 KB' },
  { name: 'Sneha_Iyer_Resume.pdf', size: '189 KB' },
  { name: 'Arjun_Deshmukh_CV.docx', size: '224 KB' },
  { name: 'Rahul_Bose_Resume.pdf', size: '156 KB' },
  { name: 'Aditya_Verma_CV.pdf', size: '134 KB' },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function getScoreColor(score: number) {
  if (score >= 85) return '#22c55e';
  if (score >= 70) return '#f59e0b';
  return '#ef4444';
}

function getScoreBg(score: number) {
  if (score >= 85) return 'bg-emerald-500/20 text-emerald-400';
  if (score >= 70) return 'bg-amber-500/20 text-amber-400';
  return 'bg-red-500/20 text-red-400';
}

const statusColors: Record<string, string> = {
  New: 'bg-blue-500/20 text-blue-400',
  Shortlisted: 'bg-emerald-500/20 text-emerald-400',
  Rejected: 'bg-red-500/20 text-red-400',
  Review: 'bg-amber-500/20 text-amber-400',
};

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#18181f] border border-[#27272a] rounded-lg px-3 py-2 text-xs shadow-xl">
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }}>{p.name}: <span className="text-[#fafafa] font-medium">{p.value}%</span></p>
      ))}
    </div>
  );
};

// ── Component ────────────────────────────────────────────────────────────────

export default function ScreenerPage() {
  const [activeTab, setActiveTab] = useState<'upload' | 'shortlists' | 'comparison'>('upload');
  const [selectedJR, setSelectedJR] = useState(jrOptions[0].value);
  const [isScreened, setIsScreened] = useState(true);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'matchScore' | 'aiRanking'>('aiRanking');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [comparedCandidates, setComparedCandidates] = useState<string[]>(['s1', 's2', 's3']);

  const sortedCandidates = [...mockCandidates].sort((a, b) => {
    const mul = sortDir === 'asc' ? 1 : -1;
    return (a[sortBy] - b[sortBy]) * mul;
  });

  const comparedData = comparedCandidates.map(id => mockCandidates.find(c => c.id === id)!).filter(Boolean);

  const radarData = [
    { dimension: 'Skills', ...Object.fromEntries(comparedData.map(c => [c.name, c.skillMatch])) },
    { dimension: 'Experience', ...Object.fromEntries(comparedData.map(c => [c.name, c.experienceFit])) },
    { dimension: 'Match', ...Object.fromEntries(comparedData.map(c => [c.name, c.matchScore])) },
    { dimension: 'AI Score', ...Object.fromEntries(comparedData.map(c => [c.name, 100 - (c.aiRanking * 10)])) },
  ];
  const radarColors = ['#6366f1', '#22c55e', '#f59e0b'];

  const toggleSort = (field: 'matchScore' | 'aiRanking') => {
    if (sortBy === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortDir('asc'); }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] px-4 md:px-8 py-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-purple-500/20 relative">
            <Bot size={20} className="text-purple-400" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#09090b]" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">Screener Agent <Sparkles size={16} className="text-purple-400" /></h1>
            <p className="text-xs text-[#a1a1aa]">AI-powered CV analysis and candidate matching</p>
          </div>
        </div>
        {/* Tabs */}
        <div className="flex bg-white/5 rounded-lg p-0.5 w-fit">
          {[
            { key: 'upload', label: 'Upload & Screen' },
            { key: 'shortlists', label: 'Shortlists' },
            { key: 'comparison', label: 'Comparison' },
          ].map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key as any)} className={`text-xs font-medium px-4 py-2 rounded-md transition-all ${activeTab === t.key ? 'bg-indigo-500/20 text-indigo-400' : 'text-[#a1a1aa] hover:text-[#fafafa]'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* ════════ Upload & Screen Tab ════════ */}
        {activeTab === 'upload' && (
          <motion.div key="upload" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            {/* JR Selector */}
            <div className="mb-4">
              <label className="text-[10px] text-[#a1a1aa] uppercase tracking-wider mb-1 block">Screen Against JR</label>
              <select value={selectedJR} onChange={e => setSelectedJR(e.target.value)} className="bg-white/5 border border-[#27272a] rounded-lg px-3 py-2.5 text-sm text-[#fafafa] focus:outline-none focus:border-indigo-500/50 w-full max-w-md">
                {jrOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {/* Upload Zone */}
            {!isScreened && (
              <div className="border-2 border-dashed border-[#27272a] rounded-xl p-12 text-center mb-6 hover:border-indigo-500/30 transition-colors cursor-pointer">
                <Upload size={40} className="mx-auto text-[#a1a1aa] mb-3" />
                <p className="text-sm font-medium mb-1">Drop CVs here or click to browse</p>
                <p className="text-xs text-[#a1a1aa]">Accepted: PDF, DOC, DOCX · Max 10 files</p>
              </div>
            )}

            {/* Uploaded Files */}
            {isScreened && (
              <div className="mb-4 p-4 bg-white/[0.02] border border-[#27272a] rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold">{uploadedFiles.length} files uploaded</p>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1"><Check size={10} /> Screened</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {uploadedFiles.map(f => (
                    <span key={f.name} className="flex items-center gap-1.5 text-[10px] bg-white/5 border border-[#27272a] px-2 py-1 rounded-lg">
                      <FileText size={10} className="text-indigo-400" /> {f.name} <span className="text-[#a1a1aa]">({f.size})</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Results Table */}
            {isScreened && (
              <div className="bg-white/[0.02] border border-[#27272a] rounded-xl overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr_0.5fr_0.8fr_0.8fr] gap-2 px-4 py-3 border-b border-[#27272a] text-[10px] uppercase tracking-wider text-[#a1a1aa] font-medium">
                  <span>Candidate</span>
                  <button onClick={() => toggleSort('matchScore')} className="flex items-center gap-1 hover:text-[#fafafa]">Match Score <ArrowUpDown size={10} /></button>
                  <span>Experience Fit</span>
                  <span>Skill Match</span>
                  <button onClick={() => toggleSort('aiRanking')} className="flex items-center gap-1 hover:text-[#fafafa]">AI Rank <ArrowUpDown size={10} /></button>
                  <span>Status</span>
                  <span>Actions</span>
                </div>
                {/* Rows */}
                {sortedCandidates.map(c => (
                  <div key={c.id}>
                    <div
                      onClick={() => setExpandedRow(expandedRow === c.id ? null : c.id)}
                      className="grid grid-cols-[2fr_1fr_1fr_1fr_0.5fr_0.8fr_0.8fr] gap-2 px-4 py-3 border-b border-[#27272a] hover:bg-white/[0.03] cursor-pointer transition-colors items-center"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] font-bold text-indigo-400 shrink-0">{c.avatar}</div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium truncate">{c.name}</p>
                          <p className="text-[10px] text-[#a1a1aa] truncate">{c.currentRole}</p>
                        </div>
                        {expandedRow === c.id ? <ChevronUp size={12} className="shrink-0 text-[#a1a1aa]" /> : <ChevronDown size={12} className="shrink-0 text-[#a1a1aa]" />}
                      </div>
                      {/* Match Score Bar */}
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${c.matchScore}%`, backgroundColor: getScoreColor(c.matchScore) }} />
                          </div>
                          <span className="text-xs font-bold" style={{ color: getScoreColor(c.matchScore) }}>{c.matchScore}%</span>
                        </div>
                      </div>
                      <div className="text-xs" style={{ color: getScoreColor(c.experienceFit) }}>{c.experienceFit}%</div>
                      <div className="text-xs" style={{ color: getScoreColor(c.skillMatch) }}>{c.skillMatch}%</div>
                      <div className="text-xs font-bold text-center">#{c.aiRanking}</div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium w-fit ${statusColors[c.status]}`}>{c.status}</span>
                      <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                        <button className="p-1 rounded hover:bg-emerald-500/20 text-[#a1a1aa] hover:text-emerald-400 transition-colors" title="Shortlist"><UserPlus size={12} /></button>
                        <button className="p-1 rounded hover:bg-red-500/20 text-[#a1a1aa] hover:text-red-400 transition-colors" title="Reject"><XCircle size={12} /></button>
                        <button className="p-1 rounded hover:bg-indigo-500/20 text-[#a1a1aa] hover:text-indigo-400 transition-colors" title="View Detail"><Eye size={12} /></button>
                      </div>
                    </div>
                    {/* Expanded Row */}
                    <AnimatePresence>
                      {expandedRow === c.id && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="px-6 py-4 bg-white/[0.02] border-b border-[#27272a]">
                            <div className="flex items-start gap-2 mb-3">
                              <Sparkles size={12} className="text-purple-400 mt-0.5 shrink-0" />
                              <div>
                                <p className="text-[10px] uppercase tracking-wider text-purple-400 font-semibold mb-1">AI Reasoning</p>
                                <p className="text-xs text-[#a1a1aa] leading-relaxed">{c.aiReasoning}</p>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              <span className="text-[10px] text-[#a1a1aa]">Skills:</span>
                              {c.skills.map(s => (
                                <span key={s} className="text-[10px] bg-indigo-500/15 text-indigo-300 px-2 py-0.5 rounded">{s}</span>
                              ))}
                            </div>
                            <p className="text-[10px] text-[#a1a1aa] mt-2"><GraduationCap size={10} className="inline mr-1" />{c.education} · {c.experience} experience</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ════════ Shortlists Tab ════════ */}
        {activeTab === 'shortlists' && (
          <motion.div key="shortlists" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <h2 className="text-sm font-semibold mb-4">Shortlisted Candidates – Senior Frontend Engineer</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {mockCandidates.filter(c => c.status === 'Shortlisted' || c.matchScore >= 85).map(c => (
                <motion.div key={c.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:bg-white/[0.07] transition-colors group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-sm font-bold text-indigo-400">{c.avatar}</div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{c.name}</p>
                      <p className="text-[10px] text-[#a1a1aa]">{c.experience}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-lg font-bold ${getScoreBg(c.matchScore).split(' ')[1]}`}>{c.matchScore}%</span>
                    <span className="text-[10px] text-[#a1a1aa]">match</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {c.skills.slice(0, 4).map(s => (
                      <span key={s} className="text-[9px] bg-indigo-500/15 text-indigo-300 px-1.5 py-0.5 rounded">{s}</span>
                    ))}
                    {c.skills.length > 4 && <span className="text-[9px] text-[#a1a1aa]">+{c.skills.length - 4}</span>}
                  </div>
                  {/* AI Score Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-[10px] text-[#a1a1aa] mb-1">
                      <span>AI Score</span>
                      <span style={{ color: getScoreColor(c.matchScore) }}>{c.matchScore}%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${c.matchScore}%`, backgroundColor: getScoreColor(c.matchScore) }} />
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="flex-1 text-[10px] bg-indigo-500/20 text-indigo-400 py-1.5 rounded-lg hover:bg-indigo-500/30 transition-colors">View</button>
                    <button className="flex-1 text-[10px] bg-emerald-500/20 text-emerald-400 py-1.5 rounded-lg hover:bg-emerald-500/30 transition-colors">Pipeline</button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ════════ Comparison Tab ════════ */}
        {activeTab === 'comparison' && (
          <motion.div key="comparison" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold">Candidate Comparison</h2>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#a1a1aa]">Comparing:</span>
                {comparedData.map(c => (
                  <span key={c.id} className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded-lg flex items-center gap-1">
                    {c.name} <X size={10} className="cursor-pointer hover:text-white" onClick={() => setComparedCandidates(prev => prev.filter(id => id !== c.id))} />
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Radar Chart */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5">
                <h3 className="text-xs font-semibold mb-4 flex items-center gap-2"><Target size={14} className="text-indigo-400" /> Comparison Radar</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#27272a" />
                    <PolarAngleAxis dataKey="dimension" tick={{ fill: '#a1a1aa', fontSize: 11 }} />
                    <PolarRadiusAxis tick={{ fill: '#a1a1aa', fontSize: 9 }} domain={[0, 100]} />
                    {comparedData.map((c, i) => (
                      <Radar key={c.id} name={c.name} dataKey={c.name} stroke={radarColors[i]} fill={radarColors[i]} fillOpacity={0.15} strokeWidth={2} />
                    ))}
                    <Legend formatter={v => <span className="text-xs text-[#a1a1aa]">{v}</span>} />
                    <Tooltip content={<CustomTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Comparison Table */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5">
                <h3 className="text-xs font-semibold mb-4 flex items-center gap-2"><BarChart3 size={14} className="text-emerald-400" /> Detailed Breakdown</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Match Score', key: 'matchScore' as const },
                    { label: 'Skills Match', key: 'skillMatch' as const },
                    { label: 'Experience Fit', key: 'experienceFit' as const },
                  ].map(dim => (
                    <div key={dim.key}>
                      <p className="text-[10px] text-[#a1a1aa] uppercase tracking-wider mb-2">{dim.label}</p>
                      {comparedData.map((c, i) => {
                        const val = c[dim.key];
                        const isMax = val === Math.max(...comparedData.map(x => x[dim.key]));
                        return (
                          <div key={c.id} className="flex items-center gap-2 mb-1.5">
                            <span className="text-[10px] w-20 truncate" style={{ color: radarColors[i] }}>{c.name.split(' ')[0]}</span>
                            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${val}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full" style={{ backgroundColor: radarColors[i] }} />
                            </div>
                            <span className={`text-xs font-bold w-10 text-right ${isMax ? 'text-emerald-400' : 'text-[#a1a1aa]'}`}>
                              {val}%{isMax && <Award size={8} className="inline ml-0.5" />}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ))}

                  {/* Education */}
                  <div>
                    <p className="text-[10px] text-[#a1a1aa] uppercase tracking-wider mb-2">Education</p>
                    {comparedData.map((c, i) => (
                      <div key={c.id} className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] w-20 truncate" style={{ color: radarColors[i] }}>{c.name.split(' ')[0]}</span>
                        <span className="text-xs text-[#a1a1aa]">{c.education}</span>
                      </div>
                    ))}
                  </div>

                  {/* AI Ranking */}
                  <div>
                    <p className="text-[10px] text-[#a1a1aa] uppercase tracking-wider mb-2">AI Ranking</p>
                    {comparedData.map((c, i) => (
                      <div key={c.id} className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] w-20 truncate" style={{ color: radarColors[i] }}>{c.name.split(' ')[0]}</span>
                        <span className={`text-xs font-bold ${c.aiRanking === 1 ? 'text-emerald-400' : 'text-[#a1a1aa]'}`}>#{c.aiRanking}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
