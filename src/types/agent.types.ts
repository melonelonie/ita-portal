// ─────────────────────────────────────────────────────────────
// AI Agent types
// ─────────────────────────────────────────────────────────────

import type { Timestamped } from './common.types';

export type AgentType =
  | 'sourcing'
  | 'screening'
  | 'jd_generator'
  | 'interview_scheduler'
  | 'report_generator'
  | 'skill_assessor';

export type AgentStatus = 'idle' | 'running' | 'paused' | 'error' | 'disabled';

export type AgentActionType =
  | 'candidate_sourced'
  | 'candidate_scored'
  | 'jd_generated'
  | 'interview_scheduled'
  | 'report_generated'
  | 'skill_gap_analyzed'
  | 'email_drafted'
  | 'recommendation_made';

export interface AgentConfig {
  maxConcurrency: number;
  autoApprove: boolean;
  confidenceThreshold: number; // 0-1, actions below this need human review
  enabledFeatures: string[];
  schedule?: string; // cron expression
  customPrompt?: string;
  model: string; // e.g., 'gpt-4o', 'claude-3.5-sonnet'
  temperature: number;
  maxTokens: number;
}

export interface AgentAction {
  id: string;
  agentId: string;
  type: AgentActionType;
  description: string;
  entityType: string; // 'candidate', 'job', etc.
  entityId: string;
  confidence: number; // 0-1
  status: 'pending_review' | 'approved' | 'rejected' | 'auto_approved' | 'executed';
  result?: Record<string, unknown>;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}

export interface AgentLog {
  id: string;
  agentId: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

export interface AgentMetrics {
  totalActions: number;
  successRate: number;
  avgConfidence: number;
  actionsToday: number;
  pendingReview: number;
  avgResponseTime: number; // ms
}

export interface Agent extends Timestamped {
  id: string;
  name: string;
  type: AgentType;
  description: string;
  status: AgentStatus;
  config: AgentConfig;
  metrics: AgentMetrics;
  lastRunAt: string | null;
  nextRunAt: string | null;
  recentActions: AgentAction[];
  recentLogs: AgentLog[];
  version: string;
  avatarEmoji: string; // e.g., '🔍', '📝'
}

export interface AgentFilters {
  type?: AgentType[];
  status?: AgentStatus[];
}
