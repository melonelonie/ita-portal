import type { RouteObject } from 'react-router-dom';
import { lazy } from 'react';

const TADashboard = lazy(() => import('../features/ta/dashboard/TADashboardPage'));
const JRWorkspacePage = lazy(() => import('../features/ta/jr-workspace/JRWorkspacePage'));
const CandidatePipelinePage = lazy(() => import('../features/ta/pipeline/CandidatePipelinePage'));
const ScreenerPage = lazy(() => import('../features/ta/screener/ScreenerPage'));
const InterviewTrackingPage = lazy(() => import('../features/ta/interviews/InterviewTrackingPage'));
const TAReportsPage = lazy(() => import('../features/ta/reports/TAReportsPage'));
const AIConversationsPage = lazy(() => import('../features/ta/ai/AIConversationsPage'));
const SettingsPage = lazy(() => import('../features/shared/SettingsPage'));
const ProfilePage = lazy(() => import('../features/shared/ProfilePage'));
const NotificationsPage = lazy(() => import('../features/shared/NotificationsPage'));

export const taRoutes: RouteObject[] = [
  { index: true, lazy: () => import('../features/ta/dashboard/TADashboardPage').then((m) => ({ Component: m.default })) },
  { path: 'dashboard', element: <TADashboard /> },
  { path: 'jr-workspace', element: <JRWorkspacePage /> },
  { path: 'pipeline', element: <CandidatePipelinePage /> },
  { path: 'screener', element: <ScreenerPage /> },
  { path: 'interviews', element: <InterviewTrackingPage /> },
  { path: 'reports', element: <TAReportsPage /> },
  { path: 'ai', element: <AIConversationsPage /> },
  { path: 'settings', element: <SettingsPage /> },
  { path: 'profile', element: <ProfilePage /> },
  { path: 'notifications', element: <NotificationsPage /> },
];
