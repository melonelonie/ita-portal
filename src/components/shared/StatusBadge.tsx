import React from 'react';
import {
  FileText,
  Search,
  CheckCircle2,
  CalendarCheck,
  CalendarClock,
  Trophy,
  Gift,
  UserCheck,
  XCircle,
  type LucideIcon,
} from 'lucide-react';

export type PipelineStage =
  | 'Applied'
  | 'Screened'
  | 'Shortlisted'
  | 'Interview R1'
  | 'Interview R2'
  | 'Final Round'
  | 'Offered'
  | 'Placed'
  | 'Rejected';

export interface StatusBadgeProps {
  stage: PipelineStage;
  className?: string;
}

interface StageConfig {
  color: string;
  bg: string;
  border: string;
  icon: LucideIcon;
}

const stageConfigs: Record<PipelineStage, StageConfig> = {
  Applied: {
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    icon: FileText,
  },
  Screened: {
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    icon: Search,
  },
  Shortlisted: {
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
    icon: CheckCircle2,
  },
  'Interview R1': {
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    icon: CalendarCheck,
  },
  'Interview R2': {
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    icon: CalendarClock,
  },
  'Final Round': {
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20',
    icon: Trophy,
  },
  Offered: {
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    icon: Gift,
  },
  Placed: {
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    icon: UserCheck,
  },
  Rejected: {
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    icon: XCircle,
  },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ stage, className = '' }) => {
  const config = stageConfigs[stage];
  const Icon = config.icon;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium
        rounded-full border whitespace-nowrap
        ${config.color} ${config.bg} ${config.border}
        ${className}
      `}
    >
      <Icon size={12} />
      {stage}
    </span>
  );
};

StatusBadge.displayName = 'StatusBadge';

export { StatusBadge };
export default StatusBadge;
