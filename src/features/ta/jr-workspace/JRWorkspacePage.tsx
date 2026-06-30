import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Send, FileText, Edit3, RotateCcw, CheckCircle2, Clock,
  ChevronRight, Eye, Plus, Bot, User, X, ChevronDown, Copy, Download,
  Layers, Building2, MapPin, Briefcase, Tag
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────

interface Message {
  id: number;
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
}

interface JR {
  id: number;
  title: string;
  client: string;
  status: 'draft' | 'review' | 'approved' | 'published';
  date: string;
  matches: number;
  version: number;
}

// ── Mock Data ──────────────────────────────────────────────

const existingJRs: JR[] = [
  { id: 1, title: 'Senior Frontend Engineer', client: 'TechVista Solutions', status: 'approved', date: '2024-03-15', matches: 8, version: 3 },
  { id: 2, title: 'Backend Lead - Node.js', client: 'Nexus Dynamics', status: 'review', date: '2024-03-14', matches: 5, version: 2 },
  { id: 3, title: 'DevOps Engineer', client: 'CloudPeak Systems', status: 'draft', date: '2024-03-13', matches: 0, version: 1 },
  { id: 4, title: 'Data Scientist', client: 'Meridian Analytics', status: 'published', date: '2024-03-10', matches: 12, version: 2 },
  { id: 5, title: 'Product Manager', client: 'Apex Innovations', status: 'approved', date: '2024-03-08', matches: 6, version: 1 },
];

const mockClients = ['TechVista Solutions', 'Nexus Dynamics', 'CloudPeak Systems', 'Meridian Analytics', 'Apex Innovations'];

const suggestedPrompts = [
  'Make it more senior-level',
  'Add remote work option',
  'Emphasize leadership skills',
  'Include cloud experience',
  'Reduce experience requirement',
];

const generatedJR = {
  title: 'Senior Frontend Engineer',
  client: 'TechVista Solutions',
  department: 'Engineering',
  location: 'San Francisco, CA (Hybrid)',
  type: 'Full-time',
  experience: '5-8 years',
  description: `We are seeking a highly skilled Senior Frontend Engineer to join TechVista Solutions' growing engineering team. The ideal candidate will lead the development of our next-generation web applications, working closely with design and product teams to deliver exceptional user experiences.

You will be responsible for architecting scalable frontend solutions, mentoring junior developers, and driving technical decisions that impact millions of users. This role offers the opportunity to work with cutting-edge technologies in a fast-paced, innovation-driven environment.`,
  responsibilities: [
    'Lead the architecture and development of complex web applications using React, TypeScript, and modern frontend frameworks',
    'Mentor and guide a team of 3-4 junior and mid-level developers through code reviews and pair programming',
    'Collaborate with UX designers to translate wireframes and prototypes into high-quality, responsive interfaces',
    'Drive performance optimization initiatives, achieving and maintaining Core Web Vitals standards',
    'Establish and enforce coding standards, best practices, and development workflows',
    'Participate in sprint planning, technical discussions, and architectural decision-making',
    'Implement comprehensive testing strategies including unit, integration, and end-to-end testing',
    'Evaluate and integrate new tools, libraries, and technologies to improve development efficiency',
  ],
  requiredSkills: ['React', 'TypeScript', 'Next.js', 'CSS/Tailwind', 'REST APIs', 'GraphQL', 'Git', 'Testing (Jest/Cypress)'],
  experience_req: 'Minimum 5 years of professional frontend development experience with at least 2 years in a senior or lead capacity. Strong portfolio demonstrating complex web application development.',
  preferredQualifications: [
    'Experience with micro-frontend architectures',
    'Familiarity with CI/CD pipelines and DevOps practices',
    'Contributions to open-source projects',
    'Experience with design systems and component libraries',
    'Background in performance monitoring and optimization tools',
  ],
};

const initialMessages: Message[] = [
  { id: 1, role: 'ai', content: 'Hello! I\'m the JR Drafter Agent. I can help you create professional job requisitions from a brief description. You can fill out the form on the left, or just tell me what role you\'re looking for and I\'ll draft a complete JR for you.', timestamp: '10:30 AM' },
];

// ── Status Badge Component ─────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    draft: 'bg-zinc-500/10 text-zinc-400',
    review: 'bg-amber-500/10 text-amber-400',
    approved: 'bg-emerald-500/10 text-emerald-400',
    published: 'bg-indigo-500/10 text-indigo-400',
  };
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${styles[status] || styles.draft}`}>
      {status}
    </span>
  );
}

// ── Main Page ──────────────────────────────────────────────

export default function JRWorkspacePage() {
  const [activeTab, setActiveTab] = useState<'new' | 'list'>('new');
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedJR, setSelectedJR] = useState<JR | null>(existingJRs[0]);
  const [showPreview, setShowPreview] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentVersion, setCurrentVersion] = useState(3);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Brief form state
  const [brief, setBrief] = useState({
    client: 'TechVista Solutions',
    title: 'Senior Frontend Engineer',
    department: 'Engineering',
    experience: '5-8 years',
    skills: 'React, TypeScript, Next.js',
    location: 'San Francisco, CA',
    type: 'Full-time',
    description: 'Looking for a senior frontend engineer to lead our web development team.',
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const userMsg: Message = { id: Date.now(), role: 'user', content: inputValue, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg: Message = {
        id: Date.now() + 1,
        role: 'ai',
        content: `Great suggestion! I've updated the JR to incorporate your feedback. The ${inputValue.toLowerCase().includes('remote') ? 'remote work policy' : inputValue.toLowerCase().includes('senior') ? 'seniority requirements' : 'job description'} has been refined in version ${currentVersion + 1}. Please review the updated preview on the right.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
      setCurrentVersion((v) => v + 1);
    }, 1500);
  };

  const handleGenerate = () => {
    const userMsg: Message = { id: Date.now(), role: 'user', content: `Generate a JR for "${brief.title}" at ${brief.client}. ${brief.description}`, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    setShowPreview(true);

    setTimeout(() => {
      const aiMsg: Message = {
        id: Date.now() + 1,
        role: 'ai',
        content: `I've generated a comprehensive JR for the "${brief.title}" position at ${brief.client}. The draft includes role description, responsibilities, required skills, and preferred qualifications. Please review it in the preview panel and let me know if you'd like any refinements!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 h-[calc(100vh-7rem)]">
      {/* ── Left Panel: Brief + Chat ──────────────── */}
      <div className="w-[420px] shrink-0 flex flex-col rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl overflow-hidden">
        {/* Agent Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-[#0f0f14] rounded-full" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-200">JR Drafter Agent</h3>
            <p className="text-[10px] text-emerald-400">Active · Ready to draft</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/[0.06]">
          {(['new', 'list'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-xs font-medium transition-colors relative ${activeTab === tab ? 'text-zinc-200' : 'text-zinc-500 hover:text-zinc-400'}`}
            >
              {tab === 'new' ? 'New JR' : 'My JRs'}
              {activeTab === tab && (
                <motion.div layoutId="jr-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
              )}
            </button>
          ))}
        </div>

        {activeTab === 'new' ? (
          <>
            {/* Brief Form */}
            <div className="p-4 space-y-3 border-b border-white/[0.06] overflow-y-auto max-h-[260px]">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1 block">Client</label>
                  <select value={brief.client} onChange={(e) => setBrief({ ...brief, client: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none">
                    {mockClients.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1 block">Role Title</label>
                  <input value={brief.title} onChange={(e) => setBrief({ ...brief, title: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none" />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1 block">Experience</label>
                  <input value={brief.experience} onChange={(e) => setBrief({ ...brief, experience: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none" />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1 block">Location</label>
                  <input value={brief.location} onChange={(e) => setBrief({ ...brief, location: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1 block">Key Skills</label>
                <input value={brief.skills} onChange={(e) => setBrief({ ...brief, skills: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none" placeholder="Comma-separated skills" />
              </div>
              <div>
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1 block">Brief Description</label>
                <textarea value={brief.description} onChange={(e) => setBrief({ ...brief, description: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none resize-none" />
              </div>
              <button onClick={handleGenerate} className="w-full py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all flex items-center justify-center gap-2">
                <Sparkles className="w-3.5 h-3.5" /> Generate JR
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                  <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                    {msg.role === 'ai' && (
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                    <div className={`max-w-[85%] px-3 py-2.5 rounded-xl text-xs leading-relaxed ${msg.role === 'ai' ? 'bg-white/[0.04] border border-purple-500/10 text-zinc-300' : 'bg-indigo-600 text-white'}`}>
                      {msg.content}
                      <p className={`text-[9px] mt-1 ${msg.role === 'ai' ? 'text-zinc-600' : 'text-indigo-200'}`}>{msg.timestamp}</p>
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-7 h-7 rounded-lg bg-zinc-700 flex items-center justify-center shrink-0 mt-0.5">
                        <User className="w-3.5 h-3.5 text-zinc-300" />
                      </div>
                    )}
                  </motion.div>
                ))}
                {isTyping && (
                  <div className="flex gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="px-3 py-3 rounded-xl bg-white/[0.04] border border-purple-500/10">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:0ms]" />
                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:150ms]" />
                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:300ms]" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggested Prompts */}
              <div className="px-4 pb-2 flex gap-2 flex-wrap">
                {suggestedPrompts.slice(0, 3).map((prompt) => (
                  <button key={prompt} onClick={() => { setInputValue(prompt); }} className="text-[10px] px-2.5 py-1 rounded-full border border-purple-500/20 text-purple-400 hover:bg-purple-500/10 transition-colors">
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="p-3 border-t border-white/[0.06]">
                <div className="flex gap-2">
                  <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Refine the JR..."
                    className="flex-1 px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-200 placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none"
                  />
                  <button onClick={handleSend} disabled={!inputValue.trim()} className="px-3 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* My JRs List */
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {existingJRs.map((jr) => (
              <div
                key={jr.id}
                onClick={() => { setSelectedJR(jr); setShowPreview(true); }}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedJR?.id === jr.id ? 'border-indigo-500/30 bg-indigo-500/5' : 'border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.04]'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-zinc-200 truncate">{jr.title}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{jr.client}</p>
                  </div>
                  <StatusBadge status={jr.status} />
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[10px] text-zinc-600 flex items-center gap-1"><Clock className="w-3 h-3" />{jr.date}</span>
                  <span className="text-[10px] text-zinc-600 flex items-center gap-1"><Layers className="w-3 h-3" />v{jr.version}</span>
                  <span className="text-[10px] text-zinc-600 flex items-center gap-1"><User className="w-3 h-3" />{jr.matches} matches</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Right Panel: JR Preview ──────────────── */}
      <div className="flex-1 rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl overflow-hidden flex flex-col">
        {showPreview ? (
          <>
            {/* Toolbar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-semibold text-zinc-200">{generatedJR.title}</span>
                <StatusBadge status={selectedJR?.status || 'draft'} />
                <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                  <Layers className="w-3 h-3" /> v{currentVersion}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setIsEditing(!isEditing)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${isEditing ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-white/5 text-zinc-400 border border-white/10 hover:bg-white/10'}`}>
                  <Edit3 className="w-3.5 h-3.5" /> {isEditing ? 'Editing' : 'Edit'}
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-400 hover:bg-white/10 transition-all">
                  <RotateCcw className="w-3.5 h-3.5" /> Regenerate
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 text-white text-xs font-semibold hover:from-emerald-500 hover:to-green-500 transition-all">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                </button>
              </div>
            </div>

            {/* JR Content */}
            <div className="flex-1 overflow-y-auto p-8 max-w-3xl mx-auto w-full">
              <div className="space-y-8">
                {/* Header */}
                <div>
                  <h1 className="text-3xl font-bold text-zinc-100 mb-2">{generatedJR.title}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
                    <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4" /> {generatedJR.client}</span>
                    <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {generatedJR.department}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {generatedJR.location}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {generatedJR.type}</span>
                  </div>
                </div>

                <hr className="border-white/[0.06]" />

                {/* Description */}
                <div>
                  <h2 className="text-lg font-semibold text-zinc-200 mb-3">Role Description</h2>
                  <div className={`text-sm text-zinc-400 leading-relaxed whitespace-pre-line ${isEditing ? 'bg-white/[0.03] border border-white/10 rounded-lg p-4' : ''}`} contentEditable={isEditing} suppressContentEditableWarning>
                    {generatedJR.description}
                  </div>
                </div>

                {/* Responsibilities */}
                <div>
                  <h2 className="text-lg font-semibold text-zinc-200 mb-3">Key Responsibilities</h2>
                  <ul className="space-y-2">
                    {generatedJR.responsibilities.map((r, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-zinc-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                        <span className={isEditing ? 'bg-white/[0.03] border border-white/10 rounded px-2 py-1 flex-1' : ''} contentEditable={isEditing} suppressContentEditableWarning>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Skills */}
                <div>
                  <h2 className="text-lg font-semibold text-zinc-200 mb-3">Required Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {generatedJR.requiredSkills.map((skill) => (
                      <span key={skill} className="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-medium border border-indigo-500/20">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Experience */}
                <div>
                  <h2 className="text-lg font-semibold text-zinc-200 mb-3">Experience Requirements</h2>
                  <p className={`text-sm text-zinc-400 leading-relaxed ${isEditing ? 'bg-white/[0.03] border border-white/10 rounded-lg p-4' : ''}`} contentEditable={isEditing} suppressContentEditableWarning>
                    {generatedJR.experience_req}
                  </p>
                </div>

                {/* Preferred */}
                <div>
                  <h2 className="text-lg font-semibold text-zinc-200 mb-3">Preferred Qualifications</h2>
                  <ul className="space-y-2">
                    {generatedJR.preferredQualifications.map((q, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-zinc-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0" />
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* AI Confidence */}
                <div className="p-4 rounded-xl border border-purple-500/10 bg-purple-500/[0.03]">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-semibold text-purple-400">AI Confidence</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-white/[0.05] rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} transition={{ duration: 1, delay: 0.5 }} className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
                    </div>
                    <span className="text-sm font-bold text-purple-400">92%</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-2">This JR closely matches industry standards and client requirements.</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-zinc-600" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-300">Create your first JR</h3>
              <p className="text-sm text-zinc-500 mt-1 max-w-sm">Fill out the brief on the left or chat with the AI agent to generate a professional job requisition.</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
