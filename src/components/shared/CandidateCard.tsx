import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MoreHorizontal,
  Eye,
  MessageSquare,
  CalendarPlus,
  Star,
  Sparkles,
} from 'lucide-react';

export type PipelineStage =
  | 'Applied' | 'Screened' | 'Shortlisted'
  | 'Interview R1' | 'Interview R2' | 'Final Round'
  | 'Offered' | 'Placed' | 'Rejected';

export interface CandidateCardProps {
  name: string;
  avatar?: string;
  role: string;
  matchPercentage: number;
  skills: string[];
  aiScore: number;
  stage: PipelineStage;
  onView?: () => void;
  onMessage?: () => void;
  onSchedule?: () => void;
  className?: string;
}

// StatusBadge inline (self-contained)
const stageBg: Record<string, string> = {
  Applied: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Screened: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  Shortlisted: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  'Interview R1': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'Interview R2': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  'Final Round': 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  Offered: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Placed: 'bg-green-500/10 text-green-400 border-green-500/20',
  Rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function getColorFromName(name: string): string {
  const colors = [
    'bg-violet-600', 'bg-blue-600', 'bg-emerald-600', 'bg-amber-600',
    'bg-rose-600', 'bg-cyan-600', 'bg-indigo-600', 'bg-teal-600',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

const CandidateCard: React.FC<CandidateCardProps> = ({
  name,
  avatar,
  role,
  matchPercentage,
  skills,
  aiScore,
  stage,
  onView,
  onMessage,
  onSchedule,
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);
  const showImg = avatar && !imgError;

  const scoreColor =
    aiScore >= 80 ? 'bg-emerald-500' : aiScore >= 60 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={`
        rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-xl
        p-4 transition-all duration-200 hover:border-white/20
        ${className}
      `}
    >
      {/* Top Row: Avatar + Name + Status */}
      <div className="flex items-start gap-3 mb-3">
        <div
          className={`w-10 h-10 rounded-full overflow-hidden flex items-center justify-center text-white font-semibold text-sm shrink-0 ${showImg ? '' : getColorFromName(name)}`}
        >
          {showImg ? (
            <img src={avatar} alt={name} className="w-full h-full object-cover" onError={() => setImgError(true)} />
          ) : (
            getInitials(name)
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-[#fafafa] truncate">{name}</h4>
          <p className="text-xs text-[#a1a1aa] truncate">{role}</p>
        </div>
        <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-full border whitespace-nowrap ${stageBg[stage] || stageBg.Applied}`}>
          {stage}
        </span>
      </div>

      {/* Match % */}
      <div className="flex items-center gap-2 mb-3">
        <Star size={14} className="text-amber-400" />
        <span className="text-xs text-[#a1a1aa]">Match</span>
        <span className="text-xs font-semibold text-[#fafafa] ml-auto">{matchPercentage}%</span>
      </div>

      {/* Skill Tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {skills.slice(0, 4).map((skill) => (
          <span key={skill} className="px-2 py-0.5 text-[10px] rounded-md bg-[#18181f] text-[#a1a1aa] border border-[#27272a]">
            {skill}
          </span>
        ))}
        {skills.length > 4 && (
          <span className="px-2 py-0.5 text-[10px] rounded-md bg-[#18181f] text-[#52525b] border border-[#27272a]">
            +{skills.length - 4}
          </span>
        )}
      </div>

      {/* AI Score Bar */}
      <div className="mb-4">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Sparkles size={12} className="text-[#6366f1]" />
          <span className="text-[10px] text-[#a1a1aa]">AI Score</span>
          <span className="text-[10px] font-semibold text-[#fafafa] ml-auto">{aiScore}/100</span>
        </div>
        <div className="h-1.5 rounded-full bg-[#27272a] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${aiScore}%` }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`h-full rounded-full ${scoreColor}`}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 pt-3 border-t border-white/5">
        {onView && (
          <button onClick={onView} className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs text-[#a1a1aa] hover:text-[#fafafa] hover:bg-white/5 rounded-lg transition-colors">
            <Eye size={13} /> View
          </button>
        )}
        {onMessage && (
          <button onClick={onMessage} className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs text-[#a1a1aa] hover:text-[#fafafa] hover:bg-white/5 rounded-lg transition-colors">
            <MessageSquare size={13} /> Message
          </button>
        )}
        {onSchedule && (
          <button onClick={onSchedule} className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs text-[#a1a1aa] hover:text-[#fafafa] hover:bg-white/5 rounded-lg transition-colors">
            <CalendarPlus size={13} /> Schedule
          </button>
        )}
      </div>
    </motion.div>
  );
};

CandidateCard.displayName = 'CandidateCard';

export { CandidateCard };
export default CandidateCard;
