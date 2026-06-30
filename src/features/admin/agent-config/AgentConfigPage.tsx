import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bot, Cpu, Search, BarChart3, FileText, Zap, Shield,
  Bell, Clock, Mail, Settings, ChevronDown, Plus, Trash2,
  Save, AlertTriangle, CheckCircle2
} from 'lucide-react';

// ─── Animations ────────────────────────────────────────────────────────────────
const pageVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const itemVariants = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Agent {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'active' | 'idle';
  lastAction: string;
  enabled: boolean;
  color: string;
}

interface EscalationRule {
  id: string;
  condition: string;
  priority: string;
  action: string;
  channel: string;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const initialAgents: Agent[] = [
  { id: '1', name: 'JR Drafter', description: 'Generates and refines job requirement descriptions using market data', icon: <FileText size={20} />, status: 'active', lastAction: 'Generated JR for "Senior React Dev" – 2 min ago', enabled: true, color: '#6366f1' },
  { id: '2', name: 'Screener', description: 'Screens and scores candidates against job requirements automatically', icon: <Search size={20} />, status: 'active', lastAction: 'Screened 14 candidates – 5 min ago', enabled: true, color: '#22c55e' },
  { id: '3', name: 'Pipeline Tracker', description: 'Monitors pipeline stages and detects stalls or bottlenecks', icon: <BarChart3 size={20} />, status: 'active', lastAction: 'Detected 3 stalled candidates – 12 min ago', enabled: true, color: '#f59e0b' },
  { id: '4', name: 'Report Generator', description: 'Creates performance reports and sends them to stakeholders', icon: <Cpu size={20} />, status: 'idle', lastAction: 'Weekly report sent – 28 min ago', enabled: true, color: '#a78bfa' },
];

const initialEscalationRules: EscalationRule[] = [
  { id: '1', condition: 'Candidate stalled > 5 days', priority: 'High', action: 'Notify TA + Admin', channel: 'Email + Slack' },
  { id: '2', condition: 'SLA breach imminent (< 1 day)', priority: 'Critical', action: 'Escalate to Admin', channel: 'Email + SMS' },
  { id: '3', condition: 'Client feedback pending > 3 days', priority: 'Medium', action: 'Send reminder to client', channel: 'Email' },
  { id: '4', condition: 'Offer not accepted in 48 hrs', priority: 'High', action: 'Notify TA + Hiring Manager', channel: 'Email + Slack' },
];

// ─── Sub-Components ────────────────────────────────────────────────────────────
function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${enabled ? 'bg-[#6366f1]' : 'bg-white/10'}`}
    >
      <motion.div
        animate={{ x: enabled ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
      />
    </button>
  );
}

function Slider({ value, onChange, min = 0, max = 100, label, suffix = '' }: { value: number; onChange: (v: number) => void; min?: number; max?: number; label: string; suffix?: string }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm text-[#a1a1aa]">{label}</label>
        <span className="text-sm font-semibold text-[#fafafa]">{value}{suffix}</span>
      </div>
      <div className="relative h-2 bg-white/5 rounded-full">
        <div className="absolute inset-y-0 left-0 rounded-full bg-[#6366f1]" style={{ width: `${pct}%` }} />
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />
        <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#6366f1] border-2 border-[#0f0f14] shadow-lg"
          style={{ left: `calc(${pct}% - 8px)` }} />
      </div>
    </div>
  );
}

function SelectDropdown({ value, onChange, options, label }: { value: string; onChange: (v: string) => void; options: string[]; label: string }) {
  return (
    <div>
      <label className="block text-sm text-[#a1a1aa] mb-1.5">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="appearance-none w-full px-3 py-2.5 pr-8 text-sm bg-white/5 border border-white/10 rounded-lg text-[#fafafa] focus:outline-none focus:border-[#6366f1]/50 cursor-pointer"
        >
          {options.map(o => <option key={o} value={o} className="bg-[#0f0f14]">{o}</option>)}
        </select>
        <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#a1a1aa] pointer-events-none" />
      </div>
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${active ? 'bg-[#6366f1] text-white' : 'text-[#a1a1aa] hover:text-[#fafafa] hover:bg-white/5'}`}>
      {children}
    </button>
  );
}

function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl ${className}`}>{children}</div>;
}

function SaveButton({ onClick }: { onClick: () => void }) {
  const [saved, setSaved] = useState(false);
  return (
    <button
      onClick={() => { setSaved(true); onClick(); setTimeout(() => setSaved(false), 2000); }}
      className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg transition-all ${
        saved ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-[#6366f1] hover:bg-[#818cf8] text-white'
      }`}
    >
      {saved ? <><CheckCircle2 size={16} /> Saved!</> : <><Save size={16} /> Save Changes</>}
    </button>
  );
}

// ─── Agent Card ────────────────────────────────────────────────────────────────
function AgentCard({ agent, onToggle }: { agent: Agent; onToggle: () => void }) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -2 }}
      className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 overflow-hidden group"
    >
      {/* Pulsing glow for active agents */}
      {agent.status === 'active' && agent.enabled && (
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ boxShadow: `inset 0 0 40px ${agent.color}10, 0 0 30px ${agent.color}05` }} />
      )}

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="relative p-2.5 rounded-xl" style={{ backgroundColor: `${agent.color}15` }}>
              <div style={{ color: agent.color }}>{agent.icon}</div>
              {agent.status === 'active' && agent.enabled && (
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0f0f14]">
                  <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-40" />
                </div>
              )}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#fafafa]">{agent.name}</h3>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                agent.status === 'active' && agent.enabled ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-500/10 text-zinc-400'
              }`}>
                {agent.enabled ? agent.status : 'disabled'}
              </span>
            </div>
          </div>
          <Toggle enabled={agent.enabled} onChange={onToggle} />
        </div>

        <p className="text-xs text-[#52525b] mb-3">{agent.description}</p>

        <div className="flex items-center gap-1.5 text-[10px] text-[#a1a1aa] bg-white/[0.03] px-2.5 py-1.5 rounded-lg">
          <Zap size={10} className="text-[#818cf8]" />
          {agent.lastAction}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function AgentConfigPage() {
  const [agents, setAgents] = useState(initialAgents);
  const [activeTab, setActiveTab] = useState('screening');

  // Screening settings
  const [matchScore, setMatchScore] = useState(70);
  const [skillsWeight, setSkillsWeight] = useState(40);
  const [experienceWeight, setExperienceWeight] = useState(30);
  const [educationWeight, setEducationWeight] = useState(20);
  const [autoReject, setAutoReject] = useState(true);
  const [autoRejectThreshold, setAutoRejectThreshold] = useState(40);
  const [skillGapTolerance, setSkillGapTolerance] = useState('Moderate');

  // Pipeline settings
  const [stallThreshold, setStallThreshold] = useState('5');
  const [autoNudge, setAutoNudge] = useState('3');
  const [escalationTrigger, setEscalationTrigger] = useState('7');

  // Scheduling settings
  const [dailyReport, setDailyReport] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [monthlyReport, setMonthlyReport] = useState(false);
  const [reportTime, setReportTime] = useState('09:00');
  const [autoSend, setAutoSend] = useState(true);
  const [reportTypes, setReportTypes] = useState({ pipeline: true, performance: true, sla: true, client: false });

  // Escalation settings
  const [escalationRules, setEscalationRules] = useState(initialEscalationRules);

  const toggleAgent = (id: string) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  const tabs = ['Screening', 'Pipeline', 'Scheduling', 'Escalation'];

  return (
    <div className="min-h-screen bg-[#09090b] p-6">
      <motion.div variants={pageVariants} initial="hidden" animate="visible" className="max-w-[1400px] mx-auto space-y-6">
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#fafafa] flex items-center gap-3">
              <div className="p-2 bg-[#a78bfa]/10 rounded-lg"><Bot size={22} className="text-[#a78bfa]" /></div>
              Agent Configuration
            </h1>
            <p className="text-sm text-[#a1a1aa] mt-1">Configure AI agent behavior and automation rules</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#a78bfa]/10 border border-[#a78bfa]/20 rounded-full">
            <div className="w-2 h-2 rounded-full bg-[#a78bfa] animate-pulse" />
            <span className="text-xs font-medium text-[#a78bfa]">3 Agents Active</span>
          </div>
        </motion.div>

        {/* Agent Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {agents.map(agent => (
            <AgentCard key={agent.id} agent={agent} onToggle={() => toggleAgent(agent.id)} />
          ))}
        </div>

        {/* Configuration Tabs */}
        <motion.div variants={itemVariants} className="flex gap-1 bg-white/[0.02] border border-white/5 rounded-xl p-1.5">
          {tabs.map(tab => (
            <TabButton key={tab} active={activeTab === tab.toLowerCase()} onClick={() => setActiveTab(tab.toLowerCase())}>
              {tab}
            </TabButton>
          ))}
        </motion.div>

        {/* Tab Content */}
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

          {/* ── Screening Tab ──────────────────────────────────────────── */}
          {activeTab === 'screening' && (
            <GlassCard className="p-6 space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Search size={16} className="text-[#6366f1]" />
                <h3 className="text-sm font-semibold text-[#fafafa]">Screening Configuration</h3>
              </div>

              <Slider value={matchScore} onChange={setMatchScore} label="Minimum Match Score Threshold" suffix="%" />

              <div className="border-t border-white/5 pt-6">
                <p className="text-xs font-medium text-[#52525b] uppercase tracking-wider mb-4">Scoring Weights</p>
                <div className="space-y-5">
                  <Slider value={skillsWeight} onChange={setSkillsWeight} label="Required Skills Weight" suffix="%" />
                  <Slider value={experienceWeight} onChange={setExperienceWeight} label="Experience Weight" suffix="%" />
                  <Slider value={educationWeight} onChange={setEducationWeight} label="Education Weight" suffix="%" />
                </div>
                <p className="text-xs text-[#52525b] mt-3">
                  Total: <span className={`font-medium ${skillsWeight + experienceWeight + educationWeight === 100 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {skillsWeight + experienceWeight + educationWeight}%
                  </span>
                  {skillsWeight + experienceWeight + educationWeight !== 100 && ' (should be 100%)'}
                </p>
              </div>

              <div className="border-t border-white/5 pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#a1a1aa]">Auto-reject below score</p>
                    <p className="text-xs text-[#52525b]">Automatically reject candidates scoring below threshold</p>
                  </div>
                  <Toggle enabled={autoReject} onChange={setAutoReject} />
                </div>
                {autoReject && (
                  <Slider value={autoRejectThreshold} onChange={setAutoRejectThreshold} label="Auto-reject Threshold" suffix="%" />
                )}
              </div>

              <SelectDropdown value={skillGapTolerance} onChange={setSkillGapTolerance} options={['Strict', 'Moderate', 'Lenient']} label="Skill Gap Tolerance" />

              <div className="flex justify-end pt-4">
                <SaveButton onClick={() => {}} />
              </div>
            </GlassCard>
          )}

          {/* ── Pipeline Tab ───────────────────────────────────────────── */}
          {activeTab === 'pipeline' && (
            <GlassCard className="p-6 space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 size={16} className="text-[#f59e0b]" />
                <h3 className="text-sm font-semibold text-[#fafafa]">Pipeline Configuration</h3>
              </div>

              <SelectDropdown value={stallThreshold} onChange={setStallThreshold} options={['3', '5', '7', '10', '14']} label="Stall Detection Threshold (days)" />
              <SelectDropdown value={autoNudge} onChange={setAutoNudge} options={['1', '2', '3', '5', '7']} label="Auto-nudge Timing (days after stall)" />
              <SelectDropdown value={escalationTrigger} onChange={setEscalationTrigger} options={['3', '5', '7', '10', '14']} label="Escalation Trigger (days)" />

              <div className="border-t border-white/5 pt-6">
                <p className="text-xs font-medium text-[#52525b] uppercase tracking-wider mb-4">SLA Configuration per Stage</p>
                <div className="space-y-3">
                  {[
                    { stage: 'Screening', sla: '3 days' },
                    { stage: 'Shortlisting', sla: '2 days' },
                    { stage: 'Interview', sla: '5 days' },
                    { stage: 'Offer', sla: '3 days' },
                    { stage: 'Onboarding', sla: '7 days' },
                  ].map(s => (
                    <div key={s.stage} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/5">
                      <span className="text-sm text-[#a1a1aa]">{s.stage}</span>
                      <div className="relative">
                        <select className="appearance-none px-3 py-1.5 pr-7 text-sm bg-white/5 border border-white/10 rounded-lg text-[#fafafa] focus:outline-none cursor-pointer"
                          defaultValue={s.sla}>
                          {['1 day', '2 days', '3 days', '5 days', '7 days', '10 days', '14 days'].map(o => (
                            <option key={o} value={o} className="bg-[#0f0f14]">{o}</option>
                          ))}
                        </select>
                        <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#a1a1aa] pointer-events-none" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <SaveButton onClick={() => {}} />
              </div>
            </GlassCard>
          )}

          {/* ── Scheduling Tab ─────────────────────────────────────────── */}
          {activeTab === 'scheduling' && (
            <GlassCard className="p-6 space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={16} className="text-[#a78bfa]" />
                <h3 className="text-sm font-semibold text-[#fafafa]">Report Scheduling</h3>
              </div>

              <div className="space-y-4">
                <p className="text-xs font-medium text-[#52525b] uppercase tracking-wider">Report Schedule</p>
                {[
                  { label: 'Daily Report', enabled: dailyReport, onChange: setDailyReport },
                  { label: 'Weekly Report', enabled: weeklyReport, onChange: setWeeklyReport },
                  { label: 'Monthly Report', enabled: monthlyReport, onChange: setMonthlyReport },
                ].map(r => (
                  <div key={r.label} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/5">
                    <span className="text-sm text-[#a1a1aa]">{r.label}</span>
                    <Toggle enabled={r.enabled} onChange={r.onChange} />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm text-[#a1a1aa] mb-1.5">Report Delivery Time</label>
                <input
                  type="time"
                  value={reportTime}
                  onChange={e => setReportTime(e.target.value)}
                  className="px-3 py-2.5 text-sm bg-white/5 border border-white/10 rounded-lg text-[#fafafa] focus:outline-none focus:border-[#6366f1]/50"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/5">
                <div>
                  <p className="text-sm text-[#a1a1aa]">Auto-send to Stakeholders</p>
                  <p className="text-xs text-[#52525b]">Automatically email reports to all stakeholders</p>
                </div>
                <Toggle enabled={autoSend} onChange={setAutoSend} />
              </div>

              <div className="border-t border-white/5 pt-6">
                <p className="text-xs font-medium text-[#52525b] uppercase tracking-wider mb-4">Report Types to Include</p>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(reportTypes).map(([key, value]) => (
                    <label key={key} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/5 cursor-pointer hover:bg-white/[0.05] transition-colors">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={() => setReportTypes(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                        className="rounded border-white/20 bg-white/5 text-[#6366f1] focus:ring-[#6366f1]/20"
                      />
                      <span className="text-sm text-[#a1a1aa] capitalize">{key} Report</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <SaveButton onClick={() => {}} />
              </div>
            </GlassCard>
          )}

          {/* ── Escalation Tab ─────────────────────────────────────────── */}
          {activeTab === 'escalation' && (
            <GlassCard className="p-6 space-y-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={16} className="text-[#ef4444]" />
                  <h3 className="text-sm font-semibold text-[#fafafa]">Escalation Rules</h3>
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg bg-[#6366f1]/10 text-[#818cf8] hover:bg-[#6366f1]/20 transition-colors">
                  <Plus size={12} /> Add Rule
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      {['Condition', 'Priority', 'Action', 'Channel', ''].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[#52525b] uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {escalationRules.map(rule => (
                      <tr key={rule.id} className="border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors">
                        <td className="px-4 py-3.5 text-sm text-[#a1a1aa]">{rule.condition}</td>
                        <td className="px-4 py-3.5">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            rule.priority === 'Critical' ? 'bg-red-500/10 text-red-400' :
                            rule.priority === 'High' ? 'bg-orange-500/10 text-orange-400' :
                            'bg-yellow-500/10 text-yellow-400'
                          }`}>{rule.priority}</span>
                        </td>
                        <td className="px-4 py-3.5 text-sm text-[#a1a1aa]">{rule.action}</td>
                        <td className="px-4 py-3.5">
                          <div className="flex gap-1.5">
                            {rule.channel.split(' + ').map(ch => (
                              <span key={ch} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-[#a1a1aa]">{ch}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <button className="p-1.5 rounded-lg hover:bg-red-500/10 text-[#52525b] hover:text-red-400 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end pt-4">
                <SaveButton onClick={() => {}} />
              </div>
            </GlassCard>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
