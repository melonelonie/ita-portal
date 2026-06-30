// ─────────────────────────────────────────────────────────────
// Job Requisition (JR) types
// ─────────────────────────────────────────────────────────────

import type { BaseFilters, Timestamped, SoftDeletable } from './common.types';
import type { ExperienceLevel, Skill } from './candidate.types';

export type JRStatus =
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'open'
  | 'on_hold'
  | 'filled'
  | 'cancelled';

export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'freelance' | 'internship';

export type WorkMode = 'remote' | 'hybrid' | 'onsite';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface SalaryRange {
  min: number;
  max: number;
  currency: string;
  period: 'annual' | 'monthly' | 'hourly';
}

export interface JRBrief {
  roleOverview: string;
  keyResponsibilities: string[];
  mustHaveSkills: string[];
  niceToHaveSkills: string[];
  idealCandidateProfile: string;
  interviewProcess: string[];
  teamInfo: string;
}

export interface JRDraft {
  id: string;
  jobId: string;
  version: number;
  content: JRBrief;
  generatedBy: 'ai' | 'manual';
  status: 'draft' | 'reviewed' | 'approved';
  reviewedBy: string | null;
  reviewNotes?: string;
  createdAt: string;
}

export interface JobRequisition extends Timestamped, SoftDeletable {
  id: string;
  title: string;
  clientId: string;
  clientName: string; // denormalized for convenience
  department: string;
  location: string;
  workMode: WorkMode;
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;
  salaryRange: SalaryRange;
  status: JRStatus;
  priority: Priority;
  openings: number;
  filledCount: number;
  description: string;
  requirements: string[];
  requiredSkills: Skill[];
  preferredSkills: Skill[];
  benefits: string[];
  brief: JRBrief | null;
  drafts: JRDraft[];

  // Assignment & tracking
  assignedTaIds: string[];
  hiringManagerId: string | null;
  targetDate: string | null; // deadline
  publishedAt: string | null;
  closedAt: string | null;

  // Metrics
  totalApplicants: number;
  shortlisted: number;
  interviewed: number;
  avgTimeToFill?: number; // days
}

export interface JobFormData {
  title: string;
  clientId: string;
  department: string;
  location: string;
  workMode: WorkMode;
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;
  salaryRange: SalaryRange;
  priority: Priority;
  openings: number;
  description: string;
  requirements: string[];
  requiredSkills: Skill[];
  preferredSkills: Skill[];
  benefits: string[];
  assignedTaIds: string[];
  hiringManagerId?: string;
  targetDate?: string;
}

export interface JobFilters extends BaseFilters {
  status?: JRStatus[];
  clientId?: string;
  workMode?: WorkMode[];
  employmentType?: EmploymentType[];
  experienceLevel?: ExperienceLevel[];
  priority?: Priority[];
  assignedTaId?: string;
}

export interface JobStats {
  totalJobs: number;
  openJobs: number;
  filledThisMonth: number;
  avgTimeToFill: number;
  urgentJobs: number;
}
