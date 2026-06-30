// ─────────────────────────────────────────────────────────────
// Interview types
// ─────────────────────────────────────────────────────────────

import type { BaseFilters, Timestamped } from './common.types';

export type InterviewStatus =
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show'
  | 'rescheduled';

export type InterviewType =
  | 'phone_screen'
  | 'technical'
  | 'behavioral'
  | 'system_design'
  | 'culture_fit'
  | 'hiring_manager'
  | 'panel'
  | 'final';

export type InterviewMode = 'video' | 'phone' | 'in_person';

export type EvaluationRating = 1 | 2 | 3 | 4 | 5;

export interface EvaluationCriteria {
  name: string;
  rating: EvaluationRating;
  notes: string;
  weight: number; // 0-1
}

export interface InterviewFeedback {
  id: string;
  interviewRoundId: string;
  interviewerId: string;
  interviewerName: string;
  overallRating: EvaluationRating;
  recommendation: 'strong_hire' | 'hire' | 'no_hire' | 'strong_no_hire' | 'undecided';
  criteria: EvaluationCriteria[];
  strengths: string[];
  concerns: string[];
  summary: string;
  submittedAt: string;
}

export interface InterviewRound {
  id: string;
  interviewId: string;
  roundNumber: number;
  type: InterviewType;
  mode: InterviewMode;
  scheduledAt: string;
  duration: number; // minutes
  interviewerIds: string[];
  interviewerNames: string[];
  meetingLink?: string;
  location?: string;
  status: InterviewStatus;
  feedback: InterviewFeedback[];
  notes?: string;
}

export interface Interview extends Timestamped {
  id: string;
  candidateId: string;
  candidateName: string;
  jobId: string;
  jobTitle: string;
  clientName: string;
  rounds: InterviewRound[];
  currentRound: number;
  totalRounds: number;
  overallStatus: InterviewStatus;
  finalDecision: 'pending' | 'selected' | 'rejected' | null;
  scheduledBy: string; // user ID
  notes?: string;
}

export interface InterviewFormData {
  candidateId: string;
  jobId: string;
  rounds: {
    type: InterviewType;
    mode: InterviewMode;
    scheduledAt: string;
    duration: number;
    interviewerIds: string[];
    meetingLink?: string;
    location?: string;
  }[];
  notes?: string;
}

export interface InterviewFilters extends BaseFilters {
  status?: InterviewStatus[];
  type?: InterviewType[];
  candidateId?: string;
  jobId?: string;
  interviewerId?: string;
  scheduledFrom?: string;
  scheduledTo?: string;
}

export interface InterviewStats {
  totalScheduled: number;
  completedThisWeek: number;
  upcomingToday: number;
  avgFeedbackScore: number;
  noShowRate: number;
}
