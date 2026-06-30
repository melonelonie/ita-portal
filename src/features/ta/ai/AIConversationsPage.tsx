import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot, Send, User, FileText, Search, GitBranch, BarChart3, Plus,
  Sparkles, Clock, ChevronRight, Paperclip
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────

interface Message {
  id: number;
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
  structured?: { type: 'table' | 'list'; data: any };
}

interface Conversation {
  id: number;
  agent: string;
  agentIcon: typeof FileText;
  agentColor: string;
  topic: string;
  lastMessage: string;
  timestamp: string;
  messages: Message[];
}

// ── Mock Data ──────────────────────────────────────────────

const agents = [
  { id: 'jr-drafter', name: 'JR Drafter Agent', icon: FileText, color: '#6366f1', desc: 'Create & refine job requisitions' },
  { id: 'screener', name: 'Screener Agent', icon: Search, color: '#a78bfa', desc: 'Analyze & score candidates' },
  { id: 'pipeline', name: 'Pipeline Tracker', icon: GitBranch, color: '#22c55e', desc: 'Monitor pipeline & stalls' },
  { id: 'report', name: 'Report Generator', icon: BarChart3, color: '#f59e0b', desc: 'Generate insights & reports' },
];

const mockConversations: Conversation[] = [
  {
    id: 1, agent: 'JR Drafter Agent', agentIcon: FileText, agentColor: '#6366f1',
    topic: 'Backend Engineer JR - Nexus Dynamics', lastMessage: 'I\'ve updated the JR with the additional cloud requirements.', timestamp: '10 min ago',
    messages: [
      { id: 1, role: 'user', content: 'I need a JR for a Backend Engineer position at Nexus Dynamics. They need someone with strong Node.js and AWS experience.', timestamp: '10:15 AM' },
      { id: 2, role: 'ai', content: 'I\'ll draft a comprehensive JR for the Backend Engineer role at Nexus Dynamics. Based on their company profile and similar roles, here\'s what I\'ve prepared:\n\n**Role**: Senior Backend Engineer\n**Experience**: 4-7 years\n**Key Skills**: Node.js, AWS, PostgreSQL, Docker, REST APIs\n\nThe full JR has been generated in the JR Workspace. Would you like me to emphasize any particular aspects?', timestamp: '10:16 AM' },
      { id: 3, role: 'user', content: 'Can you add Kubernetes experience as a requirement and include microservices architecture?', timestamp: '10:20 AM' },
      { id: 4, role: 'ai', content: 'Done! I\'ve updated the JR with the additional cloud requirements. Here\'s what changed:\n\n✅ Added Kubernetes to required skills\n✅ Added microservices architecture experience\n✅ Updated responsibilities to include container orchestration\n✅ Added preferred qualification: service mesh experience (Istio/Linkerd)\n\nThe JR is now at **v2**. You can review it in the JR Workspace.', timestamp: '10:21 AM' },
    ],
  },
  {
    id: 2, agent: 'Screener Agent', agentIcon: Search, agentColor: '#a78bfa',
    topic: 'Frontend Lead Candidate Review', lastMessage: 'Top 3 candidates have been shortlisted with detailed scoring.', timestamp: '2 hrs ago',
    messages: [
      { id: 1, role: 'user', content: 'How are the candidates looking for the Frontend Lead position at TechVista?', timestamp: '8:30 AM' },
      { id: 2, role: 'ai', content: 'I\'ve analyzed 12 candidates against the Frontend Lead JR at TechVista. Here\'s a summary:\n\n🟢 **High Match (>80%)**: 3 candidates\n🟡 **Medium Match (60-80%)**: 5 candidates\n🔴 **Low Match (<60%)**: 4 candidates\n\n**Top 3 Candidates**:\n1. Emily Wang — 94% match (5yr React, led team of 8)\n2. Alex Johnson — 87% match (4yr React, strong TypeScript)\n3. Sophie Laurent — 82% match (6yr frontend, Vue→React transition)\n\nWould you like detailed breakdowns for any candidate?', timestamp: '8:31 AM' },
      { id: 3, role: 'user', content: 'Show me the detailed comparison between Emily and Alex', timestamp: '8:45 AM' },
      { id: 4, role: 'ai', content: '**Emily Wang vs Alex Johnson — Detailed Comparison**\n\n| Dimension | Emily (94%) | Alex (87%) |\n|---|---|---|\n| React Exp | 5 years | 4 years |\n| TypeScript | Advanced | Advanced |\n| Team Lead | 8-person team | 3-person team |\n| System Design | Strong | Moderate |\n| Communication | Excellent | Good |\n\n**Recommendation**: Emily has stronger leadership experience and system design skills. Alex excels in hands-on coding and has more open-source contributions. Both are strong candidates — Emily is better suited for the lead role.\n\nTop 3 candidates have been shortlisted with detailed scoring.', timestamp: '8:46 AM' },
    ],
  },
  {
    id: 3, agent: 'Report Generator', agentIcon: BarChart3, agentColor: '#f59e0b',
    topic: 'Monthly Hiring Summary', lastMessage: 'Your March summary report is ready for download.', timestamp: '1 day ago',
    messages: [
      { id: 1, role: 'user', content: 'Generate my monthly hiring summary for March', timestamp: 'Yesterday, 3:00 PM' },
      { id: 2, role: 'ai', content: '📊 **March 2024 Hiring Summary — Sarah Mitchell**\n\n**Key Metrics**:\n• Placements: 7 (target: 5) ✅\n• Submissions: 42\n• Conversion Rate: 34%\n• Avg Time to Fill: 18 days\n\n**Client Breakdown**:\n• TechVista: 3 placements\n• Nexus: 2 placements\n• CloudPeak: 1 placement\n• Meridian: 1 placement\n\n**Highlights**:\n🏆 Exceeded placement target by 40%\n📈 Conversion rate up 12% from February\n⚡ Fastest placement: 11 days (Frontend Dev at Nexus)\n\nYour March summary report is ready for download.', timestamp: 'Yesterday, 3:02 PM' },
    ],
  },
];

// ── Main Page ──────────────────────────────────────────────

export default function AIConversationsPage() {
  const [conversations] = useState(mockConversations);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(mockConversations[0]);
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConv?.messages]);

  const handleSend = () => {
    if (!inputValue.trim() || !selectedConv) return;
    const newMsg: Message = {
      id: Date.now(), role: 'user', content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    selectedConv.messages.push(newMsg);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg: Message = {
        id: Date.now() + 1, role: 'ai',
        content: 'I understand your request. Let me process that for you. I\'ll have the updated results ready shortly.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      selectedConv.messages.push(aiMsg);
      setIsTyping(false);
      setSelectedConv({ ...selectedConv });
    }, 1500);
    setSelectedConv({ ...selectedConv });
  };

  const filteredConversations = conversations.filter((c) =>
    c.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.agent.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getQuickActions = () => {
    if (!selectedConv) return [];
    if (selectedConv.agent.includes('JR')) return ['Regenerate JR', 'Add more skills', 'Change experience level'];
    if (selectedConv.agent.includes('Screener')) return ['Show top candidates', 'Compare candidates', 'Export shortlist'];
    if (selectedConv.agent.includes('Pipeline')) return ['Show stalled candidates', 'SLA violations', 'Pipeline summary'];
    return ['Generate report', 'Export data', 'Schedule report'];
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 h-[calc(100vh-7rem)]">
      {/* ── Left Panel: Conversation List ── */}
      <div className="w-80 shrink-0 flex flex-col rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl overflow-hidden">
        <div className="p-4 border-b border-white/[0.06]">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-zinc-200">Conversations</h2>
            <button className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition-colors">
              <Plus className="w-4 h-4 text-white" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-200 placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Agent Groups */}
          {agents.map((agent) => {
            const agentConvs = filteredConversations.filter((c) => c.agent === agent.name);
            if (agentConvs.length === 0) return null;
            return (
              <div key={agent.id}>
                <div className="px-4 py-2 flex items-center gap-2">
                  <agent.icon className="w-3 h-3" style={{ color: agent.color }} />
                  <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: agent.color }}>{agent.name}</span>
                </div>
                {agentConvs.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConv(conv)}
                    className={`mx-2 mb-1 p-3 rounded-lg cursor-pointer transition-all ${selectedConv?.id === conv.id ? 'bg-white/[0.06] border border-white/[0.1]' : 'hover:bg-white/[0.03] border border-transparent'}`}
                  >
                    <p className="text-xs font-medium text-zinc-200 truncate">{conv.topic}</p>
                    <p className="text-[10px] text-zinc-500 truncate mt-1">{conv.lastMessage}</p>
                    <p className="text-[9px] text-zinc-600 mt-1">{conv.timestamp}</p>
                  </div>
                ))}
              </div>
            );
          })}

          {/* Start New Section */}
          <div className="p-4 border-t border-white/[0.06] mt-2">
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-3">Start New Conversation</p>
            <div className="space-y-2">
              {agents.map((agent) => (
                <button key={agent.id} className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/[0.04] transition-colors group">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${agent.color}15` }}>
                    <agent.icon className="w-4 h-4" style={{ color: agent.color }} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-medium text-zinc-300">{agent.name}</p>
                    <p className="text-[10px] text-zinc-600">{agent.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Panel: Chat ── */}
      <div className="flex-1 rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl overflow-hidden flex flex-col">
        {selectedConv ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${selectedConv.agentColor}15` }}>
                <selectedConv.agentIcon className="w-5 h-5" style={{ color: selectedConv.agentColor }} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-200">{selectedConv.agent}</h3>
                <p className="text-xs text-zinc-500">{selectedConv.topic}</p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: selectedConv.agentColor }} />
                  <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: selectedConv.agentColor }} />
                </span>
                <span className="text-[10px] text-emerald-400">Active</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {selectedConv.messages.map((msg) => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                  {msg.role === 'ai' && (
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-1" style={{ backgroundColor: `${selectedConv.agentColor}15` }}>
                      <Bot className="w-4 h-4" style={{ color: selectedConv.agentColor }} />
                    </div>
                  )}
                  <div className={`max-w-[75%] px-4 py-3 rounded-xl text-sm leading-relaxed ${msg.role === 'ai' ? 'bg-white/[0.04] border border-white/[0.06] text-zinc-300' : 'bg-indigo-600 text-white'}`}
                    style={msg.role === 'ai' ? { borderColor: `${selectedConv.agentColor}20` } : undefined}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                    <p className={`text-[9px] mt-2 ${msg.role === 'ai' ? 'text-zinc-600' : 'text-indigo-200'}`}>{msg.timestamp}</p>
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-zinc-700 flex items-center justify-center shrink-0 mt-1">
                      <User className="w-4 h-4 text-zinc-300" />
                    </div>
                  )}
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${selectedConv.agentColor}15` }}>
                    <Bot className="w-4 h-4" style={{ color: selectedConv.agentColor }} />
                  </div>
                  <div className="px-4 py-3 rounded-xl bg-white/[0.04] border" style={{ borderColor: `${selectedConv.agentColor}20` }}>
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full animate-bounce [animation-delay:0ms]" style={{ backgroundColor: selectedConv.agentColor }} />
                      <span className="w-2 h-2 rounded-full animate-bounce [animation-delay:150ms]" style={{ backgroundColor: selectedConv.agentColor }} />
                      <span className="w-2 h-2 rounded-full animate-bounce [animation-delay:300ms]" style={{ backgroundColor: selectedConv.agentColor }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="px-5 pb-2 flex gap-2 flex-wrap">
              {getQuickActions().map((action) => (
                <button key={action} onClick={() => setInputValue(action)} className="text-[10px] px-2.5 py-1 rounded-full border text-zinc-400 hover:bg-white/5 transition-colors" style={{ borderColor: `${selectedConv.agentColor}30` }}>
                  {action}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/[0.06]">
              <div className="flex gap-2">
                <button className="px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-zinc-500 hover:bg-white/10 transition-all">
                  <Paperclip className="w-4 h-4" />
                </button>
                <input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={`Message ${selectedConv.agent}...`}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none"
                />
                <button onClick={handleSend} disabled={!inputValue.trim()} className="px-4 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-30 transition-all">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-sm">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-purple-500/10 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-300">Start a Conversation</h3>
              <p className="text-sm text-zinc-500 mt-2">Select an existing conversation or start a new one with any AI agent.</p>
              <div className="grid grid-cols-2 gap-3 mt-6">
                {agents.map((agent) => (
                  <button key={agent.id} className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06] transition-all text-center">
                    <agent.icon className="w-6 h-6 mx-auto mb-2" style={{ color: agent.color }} />
                    <p className="text-xs font-medium text-zinc-300">{agent.name}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
