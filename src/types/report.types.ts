// ─────────────────────────────────────────────────────────────
// Report & analytics types
// ─────────────────────────────────────────────────────────────

import type { DateRange, Timestamped } from './common.types';

export type ReportType =
  | 'pipeline_funnel'
  | 'time_to_fill'
  | 'source_effectiveness'
  | 'recruiter_performance'
  | 'client_summary'
  | 'diversity'
  | 'offer_acceptance'
  | 'custom';

export type ChartType = 'bar' | 'line' | 'pie' | 'donut' | 'area' | 'stacked_bar' | 'funnel';

export type MetricTrend = 'up' | 'down' | 'flat';

export type ExportFormat = 'pdf' | 'xlsx' | 'csv';

export interface ReportMetric {
  id: string;
  label: string;
  value: number;
  previousValue?: number;
  change?: number; // percentage change
  trend: MetricTrend;
  unit: string; // e.g., 'days', '%', 'count', '$'
  description?: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
  metadata?: Record<string, unknown>;
}

export interface ChartSeries {
  name: string;
  data: ChartDataPoint[];
  color: string;
}

export interface ChartData {
  id: string;
  title: string;
  type: ChartType;
  series: ChartSeries[];
  xAxisLabel?: string;
  yAxisLabel?: string;
}

export interface ReportQuery {
  type: ReportType;
  dateRange: DateRange;
  clientId?: string;
  recruiterId?: string;
  jobId?: string;
  groupBy?: 'day' | 'week' | 'month' | 'quarter';
  filters?: Record<string, string[]>;
}

export interface Report extends Timestamped {
  id: string;
  name: string;
  type: ReportType;
  description: string;
  query: ReportQuery;
  metrics: ReportMetric[];
  charts: ChartData[];
  generatedBy: string; // user ID
  isFavorite: boolean;
  isScheduled: boolean;
  scheduleExpression?: string; // cron
  lastRunAt: string | null;
}

export interface DashboardWidget {
  id: string;
  title: string;
  type: 'metric' | 'chart' | 'table' | 'list';
  size: 'sm' | 'md' | 'lg' | 'xl';
  metric?: ReportMetric;
  chart?: ChartData;
  position: { x: number; y: number; w: number; h: number };
}

export interface Dashboard {
  id: string;
  name: string;
  widgets: DashboardWidget[];
  isDefault: boolean;
  createdBy: string;
}
