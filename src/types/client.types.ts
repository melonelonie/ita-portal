// ─────────────────────────────────────────────────────────────
// Client (company / hiring organisation) types
// ─────────────────────────────────────────────────────────────

import type { BaseFilters, Timestamped, SoftDeletable } from './common.types';

export type ClientStatus = 'active' | 'inactive' | 'prospect' | 'churned';

export type ClientTier = 'enterprise' | 'mid_market' | 'startup';

export type Industry =
  | 'technology'
  | 'finance'
  | 'healthcare'
  | 'consulting'
  | 'e_commerce'
  | 'manufacturing'
  | 'education'
  | 'media'
  | 'other';

export interface ClientContact {
  name: string;
  email: string;
  phone: string;
  designation: string;
  isPrimary: boolean;
}

export interface Client extends Timestamped, SoftDeletable {
  id: string;
  name: string;
  logoUrl: string | null;
  industry: Industry;
  tier: ClientTier;
  status: ClientStatus;
  website: string;
  headquarters: string;
  employeeCount: number;
  description: string;
  contacts: ClientContact[];
  assignedTaIds: string[]; // user IDs of assigned TAs
  activeJobs: number; // count of open JRs
  totalHires: number;
  contractStartDate: string;
  contractEndDate: string | null;
  notes?: string;
}

export interface ClientFormData {
  name: string;
  industry: Industry;
  tier: ClientTier;
  status: ClientStatus;
  website: string;
  headquarters: string;
  employeeCount: number;
  description: string;
  contacts: ClientContact[];
  assignedTaIds: string[];
  contractStartDate: string;
  contractEndDate?: string;
  notes?: string;
}

export interface ClientFilters extends BaseFilters {
  status?: ClientStatus[];
  tier?: ClientTier[];
  industry?: Industry[];
  assignedTaId?: string;
}

export interface ClientStats {
  totalClients: number;
  activeClients: number;
  totalOpenJobs: number;
  avgTimeToFill: number; // days
}
