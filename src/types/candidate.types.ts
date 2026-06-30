// ─────────────────────────────────────────────────────────────
// Candidate types
// ─────────────────────────────────────────────────────────────

import type { BaseFilters, Timestamped, SoftDeletable } from './common.types';

export type PipelineStage =
  | 'sourced'
  | 'screening'
  | 'interview_scheduled'
  | 'interview_in_progress'
  | 'offer_pending'
  | 'offer_extended'
  | 'offer_accepted'
  | 'hired'
  | 'rejected'
  | 'withdrawn';

export type CandidateSource =
  | 'linkedin'
  | 'referral'
  | 'job_board'
  | 'career_page'
  | 'agency'
  | 'ai_sourced'
  | 'other';

export type ExperienceLevel = 'intern' | 'junior' | 'mid' | 'senior' | 'lead' | 'principal' | 'executive';

export interface Skill {
  name: string;
  yearsOfExperience: number;
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  graduationYear: number;
  gpa?: number;
}

export interface WorkExperience {
  company: string;
  title: string;
  startDate: string;
  endDate: string | null; // null = current
  description: string;
  isCurrent: boolean;
}

export interface CandidateScore {
  overall: number; // 0–100
  skillMatch: number;
  experienceMatch: number;
  cultureFit: number;
  communicationScore: number;
  aiConfidence: number; // how confident the AI is in this score
  scoredAt: string;
  scoredBy: 'ai' | 'manual';
}

export interface SkillGap {
  skill: string;
  required: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  actual: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'missing';
  gapSeverity: 'none' | 'minor' | 'moderate' | 'critical';
}

export interface Candidate extends Timestamped, SoftDeletable {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl: string | null;
  linkedinUrl?: string;
  portfolioUrl?: string;
  resumeUrl: string | null;
  location: string;
  currentTitle: string;
  currentCompany: string;
  experienceLevel: ExperienceLevel;
  totalYearsExperience: number;
  expectedSalary?: number;
  noticePeriod?: number; // days
  source: CandidateSource;
  skills: Skill[];
  education: Education[];
  workExperience: WorkExperience[];
  tags: string[];

  // Pipeline tracking
  jobId: string | null; // which JR they're mapped to
  pipelineStage: PipelineStage;
  score: CandidateScore | null;
  skillGaps: SkillGap[];

  // Assigned TA
  assignedTaId: string | null;
  notes?: string;
}

export interface CandidateFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  currentTitle: string;
  currentCompany: string;
  experienceLevel: ExperienceLevel;
  totalYearsExperience: number;
  expectedSalary?: number;
  noticePeriod?: number;
  source: CandidateSource;
  skills: Skill[];
  education: Education[];
  linkedinUrl?: string;
  portfolioUrl?: string;
  tags: string[];
  notes?: string;
}

export interface CandidateFilters extends BaseFilters {
  pipelineStage?: PipelineStage[];
  source?: CandidateSource[];
  experienceLevel?: ExperienceLevel[];
  skills?: string[];
  minScore?: number;
  maxScore?: number;
  jobId?: string;
  assignedTaId?: string;
  location?: string;
}

export interface PipelineStageSummary {
  stage: PipelineStage;
  count: number;
  avgDaysInStage: number;
}
