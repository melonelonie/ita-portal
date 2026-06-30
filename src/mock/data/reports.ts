// ─────────────────────────────────────────────────────────────
// Mock Reports, metrics, and chart data
// ─────────────────────────────────────────────────────────────

import type { Report, ReportMetric, ChartData } from '@/types';

export const mockDashboardMetrics: ReportMetric[] = [
  { id: 'metric_001', label: 'Open Positions', value: 23, previousValue: 19, change: 21.1, trend: 'up', unit: 'count', description: 'Currently active job requisitions' },
  { id: 'metric_002', label: 'Active Candidates', value: 142, previousValue: 128, change: 10.9, trend: 'up', unit: 'count', description: 'Candidates in active pipelines' },
  { id: 'metric_003', label: 'Avg. Time to Fill', value: 34, previousValue: 38, change: -10.5, trend: 'down', unit: 'days', description: 'Average days from open to filled' },
  { id: 'metric_004', label: 'Interviews This Week', value: 18, previousValue: 14, change: 28.6, trend: 'up', unit: 'count', description: 'Interviews scheduled this week' },
  { id: 'metric_005', label: 'Offer Acceptance Rate', value: 84, previousValue: 78, change: 7.7, trend: 'up', unit: '%', description: 'Percentage of offers accepted' },
  { id: 'metric_006', label: 'AI Actions Today', value: 47, previousValue: 32, change: 46.9, trend: 'up', unit: 'count', description: 'AI agent actions performed today' },
];

export const mockChartData: ChartData[] = [
  {
    id: 'chart_001',
    title: 'Pipeline Funnel',
    type: 'funnel',
    xAxisLabel: 'Stage',
    yAxisLabel: 'Candidates',
    series: [
      {
        name: 'Candidates',
        color: '#6366f1',
        data: [
          { label: 'Sourced', value: 142, color: '#6366f1' },
          { label: 'Screening', value: 98, color: '#818cf8' },
          { label: 'Interview', value: 56, color: '#a78bfa' },
          { label: 'Offer', value: 22, color: '#c4b5fd' },
          { label: 'Hired', value: 15, color: '#22c55e' },
        ],
      },
    ],
  },
  {
    id: 'chart_002',
    title: 'Hires by Month',
    type: 'bar',
    xAxisLabel: 'Month',
    yAxisLabel: 'Hires',
    series: [
      {
        name: 'Hires',
        color: '#6366f1',
        data: [
          { label: 'Jan', value: 8 },
          { label: 'Feb', value: 12 },
          { label: 'Mar', value: 10 },
          { label: 'Apr', value: 15 },
          { label: 'May', value: 11 },
        ],
      },
    ],
  },
  {
    id: 'chart_003',
    title: 'Source Effectiveness',
    type: 'pie',
    series: [
      {
        name: 'Source',
        color: '#6366f1',
        data: [
          { label: 'LinkedIn', value: 35, color: '#6366f1' },
          { label: 'Referral', value: 25, color: '#22c55e' },
          { label: 'Job Boards', value: 18, color: '#f59e0b' },
          { label: 'AI Sourced', value: 15, color: '#a78bfa' },
          { label: 'Career Page', value: 5, color: '#ef4444' },
          { label: 'Agency', value: 2, color: '#64748b' },
        ],
      },
    ],
  },
  {
    id: 'chart_004',
    title: 'Time to Fill Trend',
    type: 'line',
    xAxisLabel: 'Month',
    yAxisLabel: 'Days',
    series: [
      {
        name: 'Avg Days',
        color: '#6366f1',
        data: [
          { label: 'Jan', value: 42 },
          { label: 'Feb', value: 39 },
          { label: 'Mar', value: 37 },
          { label: 'Apr', value: 35 },
          { label: 'May', value: 34 },
        ],
      },
    ],
  },
  {
    id: 'chart_005',
    title: 'Recruiter Performance',
    type: 'bar',
    xAxisLabel: 'Recruiter',
    yAxisLabel: 'Hires',
    series: [
      {
        name: 'Hires',
        color: '#6366f1',
        data: [
          { label: 'Emily R.', value: 12 },
          { label: 'James O.', value: 10 },
          { label: 'Priya S.', value: 14 },
          { label: 'Marcus J.', value: 8 },
          { label: 'Aiko T.', value: 9 },
          { label: 'David K.', value: 7 },
          { label: 'Carlos M.', value: 6 },
        ],
      },
    ],
  },
  {
    id: 'chart_006',
    title: 'Offers by Status',
    type: 'donut',
    series: [
      {
        name: 'Status',
        color: '#6366f1',
        data: [
          { label: 'Accepted', value: 42, color: '#22c55e' },
          { label: 'Pending', value: 8, color: '#f59e0b' },
          { label: 'Declined', value: 5, color: '#ef4444' },
          { label: 'Withdrawn', value: 3, color: '#64748b' },
        ],
      },
    ],
  },
];

export const mockReports: Report[] = [
  {
    id: 'rpt_001',
    name: 'Monthly Pipeline Report',
    type: 'pipeline_funnel',
    description: 'Overview of candidate pipeline flow across all active job requisitions for the current month.',
    query: {
      type: 'pipeline_funnel',
      dateRange: { from: '2026-05-01T00:00:00Z', to: '2026-05-31T23:59:59Z' },
      groupBy: 'week',
    },
    metrics: [mockDashboardMetrics[0]!, mockDashboardMetrics[1]!, mockDashboardMetrics[4]!],
    charts: [mockChartData[0]!],
    generatedBy: 'usr_001',
    isFavorite: true,
    isScheduled: true,
    scheduleExpression: '0 9 1 * *', // 1st of every month at 9am
    lastRunAt: '2026-05-01T09:00:00Z',
    createdAt: '2025-06-01T08:00:00Z',
    updatedAt: '2026-05-28T09:00:00Z',
  },
  {
    id: 'rpt_002',
    name: 'Source Effectiveness Analysis',
    type: 'source_effectiveness',
    description: 'Breakdown of candidate sources and their conversion rates through the pipeline.',
    query: {
      type: 'source_effectiveness',
      dateRange: { from: '2026-01-01T00:00:00Z', to: '2026-05-31T23:59:59Z' },
      groupBy: 'month',
    },
    metrics: [],
    charts: [mockChartData[2]!],
    generatedBy: 'usr_003',
    isFavorite: true,
    isScheduled: false,
    lastRunAt: '2026-05-25T14:00:00Z',
    createdAt: '2026-02-15T08:00:00Z',
    updatedAt: '2026-05-25T14:00:00Z',
  },
  {
    id: 'rpt_003',
    name: 'Recruiter Performance Dashboard',
    type: 'recruiter_performance',
    description: 'Performance metrics for each recruiter including hires, time-to-fill, and candidate pipeline.',
    query: {
      type: 'recruiter_performance',
      dateRange: { from: '2026-01-01T00:00:00Z', to: '2026-05-31T23:59:59Z' },
      groupBy: 'month',
    },
    metrics: [mockDashboardMetrics[2]!],
    charts: [mockChartData[4]!],
    generatedBy: 'usr_001',
    isFavorite: false,
    isScheduled: true,
    scheduleExpression: '0 9 * * 1', // Every Monday at 9am
    lastRunAt: '2026-05-27T09:00:00Z',
    createdAt: '2025-09-01T08:00:00Z',
    updatedAt: '2026-05-27T09:00:00Z',
  },
  {
    id: 'rpt_004',
    name: 'Time to Fill Trend Report',
    type: 'time_to_fill',
    description: 'Tracks the average time-to-fill metric over the past 6 months.',
    query: {
      type: 'time_to_fill',
      dateRange: { from: '2025-12-01T00:00:00Z', to: '2026-05-31T23:59:59Z' },
      groupBy: 'month',
    },
    metrics: [mockDashboardMetrics[2]!],
    charts: [mockChartData[3]!],
    generatedBy: 'usr_002',
    isFavorite: true,
    isScheduled: false,
    lastRunAt: '2026-05-26T10:00:00Z',
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-05-26T10:00:00Z',
  },
  {
    id: 'rpt_005',
    name: 'Offer Analytics',
    type: 'offer_acceptance',
    description: 'Offer acceptance, decline, and withdrawal rates across all clients.',
    query: {
      type: 'offer_acceptance',
      dateRange: { from: '2026-01-01T00:00:00Z', to: '2026-05-31T23:59:59Z' },
      groupBy: 'month',
    },
    metrics: [mockDashboardMetrics[4]!],
    charts: [mockChartData[5]!],
    generatedBy: 'usr_001',
    isFavorite: false,
    isScheduled: false,
    lastRunAt: '2026-05-20T10:00:00Z',
    createdAt: '2026-03-01T08:00:00Z',
    updatedAt: '2026-05-20T10:00:00Z',
  },
];
