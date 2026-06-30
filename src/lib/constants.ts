// Pipeline stages
export const PIPELINE_STAGES = [
  'Applied',
  'Screened',
  'Shortlisted',
  'Interview R1',
  'Interview R2',
  'Final Round',
  'Offered',
  'Placed',
  'Rejected',
] as const;

export type PipelineStage = (typeof PIPELINE_STAGES)[number];

// Stage colors
export const STAGE_COLORS: Record<string, string> = {
  Applied: '#6366f1',
  Screened: '#8b5cf6',
  Shortlisted: '#a78bfa',
  'Interview R1': '#f59e0b',
  'Interview R2': '#f97316',
  'Final Round': '#ec4899',
  Offered: '#22c55e',
  Placed: '#10b981',
  Rejected: '#ef4444',
};

// Routes
export const ROUTES = {
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    CLIENTS: '/admin/clients',
    TEAM: '/admin/team',
    AGENT_CONFIG: '/admin/agent-config',
    REPORTS: '/admin/reports',
    ACTIVITY: '/admin/activity',
    SETTINGS: '/admin/settings',
    PROFILE: '/admin/profile',
  },
  TA: {
    DASHBOARD: '/ta/dashboard',
    JR_WORKSPACE: '/ta/jr-workspace',
    PIPELINE: '/ta/pipeline',
    SCREENER: '/ta/screener',
    INTERVIEWS: '/ta/interviews',
    REPORTS: '/ta/reports',
    AI_CHAT: '/ta/ai',
    SETTINGS: '/ta/settings',
    PROFILE: '/ta/profile',
  },
} as const;

// Agent types
export const AGENT_TYPES = [
  { id: 'jr-drafter', name: 'JR Drafter Agent', icon: 'FileText', color: '#6366f1' },
  { id: 'screener', name: 'Screener Agent', icon: 'Search', color: '#a78bfa' },
  { id: 'pipeline-tracker', name: 'Pipeline Tracker Agent', icon: 'GitBranch', color: '#22c55e' },
  { id: 'report-generator', name: 'Report Generator Agent', icon: 'BarChart3', color: '#f59e0b' },
] as const;

// Chart colors
export const CHART_COLORS = {
  primary: '#6366f1',
  secondary: '#a78bfa',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
  muted: '#71717a',
};

// SLA defaults (in days)
export const SLA_DEFAULTS: Record<string, number> = {
  Applied: 2,
  Screened: 3,
  Shortlisted: 5,
  'Interview R1': 7,
  'Interview R2': 5,
  'Final Round': 3,
  Offered: 5,
};

export const APP_NAME = 'ITA';
export const APP_FULL_NAME = 'Initus Talent Acquisition Portal';
export const COMPANY_NAME = 'Initus Consulting';
