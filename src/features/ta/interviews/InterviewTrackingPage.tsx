import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar, Clock, User, Plus, Star, ChevronRight, Video,
  Phone, MapPin, X, CheckCircle2, AlertTriangle, MessageSquare
} from 'lucide-react';

// ── Mock Data ──────────────────────────────────────────────

const upcomingInterviews = [
  { id: 1, candidate: 'Alex Johnson', role: 'Frontend Lead', client: 'TechVista Solutions', round: 'R2', roundLabel: 'Technical Round', date: '2024-03-20', time: '2:00 PM', interviewer: 'John Smith', mode: 'Video', status: 'confirmed', avatar: 'AJ' },
  { id: 2, candidate: 'Maria Garcia', role: 'Backend Engineer', client: 'Nexus Dynamics', round: 'R1', roundLabel: 'Screening', date: '2024-03-20', time: '4:30 PM', interviewer: 'Sarah Mitchell', mode: 'Phone', status: 'scheduled', avatar: 'MG' },
  { id: 3, candidate: 'James Wilson', role: 'DevOps Lead', client: 'CloudPeak Systems', round: 'Final', roundLabel: 'Final Round', date: '2024-03-21', time: '10:00 AM', interviewer: 'David Chen', mode: 'In-person', status: 'confirmed', avatar: 'JW' },
  { id: 4, candidate: 'Priya Sharma', role: 'Data Scientist', client: 'Meridian Analytics', round: 'R1', roundLabel: 'Technical Screen', date: '2024-03-21', time: '2:00 PM', interviewer: 'Emma Rodriguez', mode: 'Video', status: 'scheduled', avatar: 'PS' },
  { id: 5, candidate: 'Kevin Park', role: 'ML Engineer', client: 'Meridian Analytics', round: 'R2', roundLabel: 'System Design', date: '2024-03-22', time: '11:00 AM', interviewer: 'Raj Patel', mode: 'Video', status: 'rescheduled', avatar: 'KP' },
  { id: 6, candidate: 'Sophie Laurent', role: 'Product Manager', client: 'Apex Innovations', round: 'R1', roundLabel: 'Culture Fit', date: '2024-03-22', time: '3:00 PM', interviewer: 'Lisa Thompson', mode: 'Video', status: 'confirmed', avatar: 'SL' },
];

const completedInterviews = [
  { id: 7, candidate: 'Ryan Torres', role: 'Senior Backend Engineer', client: 'TechVista Solutions', round: 'R1', date: '2024-03-18', interviewer: 'David Chen', rating: 4, feedback: 'Strong technical skills, good problem-solving approach. Could improve on system design discussions. Recommended for R2.', status: 'passed', avatar: 'RT' },
  { id: 8, candidate: 'Emily Wang', role: 'Frontend Developer', client: 'Nexus Dynamics', round: 'R2', date: '2024-03-17', interviewer: 'Sarah Mitchell', rating: 5, feedback: 'Exceptional candidate. Outstanding React knowledge, clean code practices, and excellent communication skills. Strong hire recommendation.', status: 'passed', avatar: 'EW' },
  { id: 9, candidate: 'Carlos Mendez', role: 'DevOps Engineer', client: 'CloudPeak Systems', round: 'R1', date: '2024-03-16', interviewer: 'John Smith', rating: 2, feedback: 'Limited experience with Kubernetes and CI/CD pipelines. Does not meet the minimum technical requirements for this role.', status: 'rejected', avatar: 'CM' },
  { id: 10, candidate: 'Aisha Patel', role: 'Data Analyst', client: 'Meridian Analytics', round: 'Final', date: '2024-03-15', interviewer: 'Emma Rodriguez', rating: 4, feedback: 'Great analytical mindset, strong SQL skills. Good cultural fit. Ready for offer stage.', status: 'passed', avatar: 'AP' },
];

const calendarSlots = [
  { time: '9:00 AM', mon: null, tue: null, wed: { candidate: 'Kevin Park', round: 'R2', color: '#f59e0b' }, thu: null, fri: null },
  { time: '10:00 AM', mon: null, tue: null, wed: null, thu: { candidate: 'James Wilson', round: 'Final', color: '#ec4899' }, fri: null },
  { time: '11:00 AM', mon: null, tue: null, wed: { candidate: 'Kevin Park', round: 'R2', color: '#f59e0b' }, thu: null, fri: null },
  { time: '12:00 PM', mon: null, tue: null, wed: null, thu: null, fri: null },
  { time: '1:00 PM', mon: null, tue: null, wed: null, thu: null, fri: null },
  { time: '2:00 PM', mon: { candidate: 'Alex Johnson', round: 'R2', color: '#6366f1' }, tue: null, wed: null, thu: { candidate: 'Priya Sharma', round: 'R1', color: '#8b5cf6' }, fri: null },
  { time: '3:00 PM', mon: null, tue: null, wed: null, thu: null, fri: { candidate: 'Sophie Laurent', round: 'R1', color: '#22c55e' } },
  { time: '4:00 PM', mon: null, tue: null, wed: null, thu: null, fri: null },
  { time: '4:30 PM', mon: { candidate: 'Maria Garcia', round: 'R1', color: '#a78bfa' }, tue: null, wed: null, thu: null, fri: null },
  { time: '5:00 PM', mon: null, tue: null, wed: null, thu: null, fri: null },
];

// ── Components ─────────────────────────────────────────────

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`w-3.5 h-3.5 ${s <= rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-700'}`} />
      ))}
    </div>
  );
}

function ModeIcon({ mode }: { mode: string }) {
  if (mode === 'Video') return <Video className="w-3.5 h-3.5" />;
  if (mode === 'Phone') return <Phone className="w-3.5 h-3.5" />;
  return <MapPin className="w-3.5 h-3.5" />;
}

// ── Main Page ──────────────────────────────────────────────

export default function InterviewTrackingPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'calendar'>('upcoming');
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const tabs = [
    { id: 'upcoming' as const, label: 'Upcoming', count: upcomingInterviews.length },
    { id: 'completed' as const, label: 'Completed', count: completedInterviews.length },
    { id: 'calendar' as const, label: 'Calendar View', count: null },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Interview Tracking</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage and track all interview rounds</p>
        </div>
        <button onClick={() => setShowScheduleModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all">
          <Plus className="w-4 h-4" /> Schedule Interview
        </button>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={item} className="flex gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-white/[0.08] text-zinc-200' : 'text-zinc-500 hover:text-zinc-400'}`}
          >
            {tab.label}
            {tab.count !== null && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/5 text-zinc-600'}`}>{tab.count}</span>
            )}
          </button>
        ))}
      </motion.div>

      {/* Tab Content */}
      {activeTab === 'upcoming' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcomingInterviews.map((interview) => (
            <motion.div key={interview.id} variants={item} className="rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-5 hover:border-white/[0.12] transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{interview.avatar}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-200">{interview.candidate}</p>
                    <p className="text-xs text-zinc-500">{interview.role} · {interview.client}</p>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${interview.round === 'Final' ? 'bg-pink-500/10 text-pink-400' : interview.round === 'R2' ? 'bg-amber-500/10 text-amber-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                  {interview.roundLabel}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 mb-3">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{interview.date}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{interview.time}</span>
                <span className="flex items-center gap-1.5"><ModeIcon mode={interview.mode} />{interview.mode}</span>
                <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" />{interview.interviewer}</span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${interview.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400' : interview.status === 'rescheduled' ? 'bg-amber-500/10 text-amber-400' : 'bg-zinc-500/10 text-zinc-400'}`}>
                  {interview.status}
                </span>
                <div className="flex items-center gap-2">
                  <button className="text-xs text-zinc-500 hover:text-zinc-300 px-2 py-1 rounded hover:bg-white/5 transition-all">Reschedule</button>
                  <button className="text-xs text-zinc-500 hover:text-zinc-300 px-2 py-1 rounded hover:bg-white/5 transition-all">Add Feedback</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'completed' && (
        <div className="space-y-3">
          {completedInterviews.map((interview) => (
            <motion.div key={interview.id} variants={item} className="rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-5 hover:border-white/[0.12] transition-all">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-white">{interview.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <p className="text-sm font-semibold text-zinc-200">{interview.candidate}</p>
                      <p className="text-xs text-zinc-500">{interview.role} · {interview.client} · {interview.round} · {interview.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StarRating rating={interview.rating} />
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${interview.status === 'passed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                        {interview.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <MessageSquare className="w-3 h-3 text-zinc-500" />
                      <span className="text-[10px] text-zinc-500 font-medium">Feedback from {interview.interviewer}</span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">{interview.feedback}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'calendar' && (
        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl overflow-hidden">
          <div className="grid grid-cols-6 border-b border-white/[0.06]">
            <div className="p-3" />
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
              <div key={day} className="p-3 text-center border-l border-white/[0.06]">
                <p className="text-xs font-medium text-zinc-400">{day}</p>
              </div>
            ))}
          </div>
          <div>
            {calendarSlots.map((slot) => (
              <div key={slot.time} className="grid grid-cols-6 border-b border-white/[0.04] min-h-[48px]">
                <div className="p-2 flex items-start">
                  <span className="text-[10px] text-zinc-600">{slot.time}</span>
                </div>
                {['mon', 'tue', 'wed', 'thu', 'fri'].map((day) => {
                  const event = (slot as any)[day];
                  return (
                    <div key={day} className="border-l border-white/[0.04] p-1">
                      {event && (
                        <div className="rounded-lg px-2 py-1.5 text-[10px] cursor-pointer hover:opacity-80 transition-opacity" style={{ backgroundColor: `${event.color}15`, borderLeft: `2px solid ${event.color}` }}>
                          <p className="font-medium text-zinc-200">{event.candidate}</p>
                          <p className="text-zinc-500">{event.round}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowScheduleModal(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0f0f14] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-zinc-200">Schedule Interview</h2>
              <button onClick={() => setShowScheduleModal(false)} className="p-1 rounded-lg hover:bg-white/5"><X className="w-5 h-5 text-zinc-500" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Candidate</label>
                  <select className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-zinc-200 focus:border-indigo-500 focus:outline-none">
                    <option>Alex Johnson</option><option>Maria Garcia</option><option>James Wilson</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Job Requisition</label>
                  <select className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-zinc-200 focus:border-indigo-500 focus:outline-none">
                    <option>Frontend Lead - TechVista</option><option>Backend Engineer - Nexus</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Round</label>
                  <select className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-zinc-200 focus:border-indigo-500 focus:outline-none">
                    <option>R1 - Screening</option><option>R2 - Technical</option><option>Final Round</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Date</label>
                  <input type="date" className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-zinc-200 focus:border-indigo-500 focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Time</label>
                  <input type="time" className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-zinc-200 focus:border-indigo-500 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="text-xs text-zinc-500 mb-1 block">Interviewer</label>
                <select className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-zinc-200 focus:border-indigo-500 focus:outline-none">
                  <option>John Smith</option><option>Sarah Mitchell</option><option>David Chen</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-zinc-500 mb-1 block">Notes</label>
                <textarea rows={2} className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-zinc-200 focus:border-indigo-500 focus:outline-none resize-none" placeholder="Optional notes..." />
              </div>
              <button className="w-full py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all">
                Schedule Interview
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
