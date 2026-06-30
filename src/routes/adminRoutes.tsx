import type { RouteObject } from 'react-router-dom';
import { lazy } from 'react';

const AdminDashboard = lazy(() => import('../features/admin/dashboard/AdminDashboardPage'));
const ClientsListPage = lazy(() => import('../features/admin/clients/ClientsListPage'));
const ClientDetailPage = lazy(() => import('../features/admin/clients/ClientDetailPage'));
const TAManagementPage = lazy(() => import('../features/admin/ta-management/TAManagementPage'));
const AgentConfigPage = lazy(() => import('../features/admin/agent-config/AgentConfigPage'));
const AdminReportsPage = lazy(() => import('../features/admin/reports/AdminReportsPage'));
const ActivityLogsPage = lazy(() => import('../features/admin/activity/ActivityLogsPage'));
const SettingsPage = lazy(() => import('../features/shared/SettingsPage'));
const ProfilePage = lazy(() => import('../features/shared/ProfilePage'));
const NotificationsPage = lazy(() => import('../features/shared/NotificationsPage'));

export const adminRoutes: RouteObject[] = [
  { index: true, lazy: () => import('../features/admin/dashboard/AdminDashboardPage').then((m) => ({ Component: m.default })) },
  { path: 'dashboard', element: <AdminDashboard /> },
  { path: 'clients', element: <ClientsListPage /> },
  { path: 'clients/:id', element: <ClientDetailPage /> },
  { path: 'team', element: <TAManagementPage /> },
  { path: 'agent-config', element: <AgentConfigPage /> },
  { path: 'reports', element: <AdminReportsPage /> },
  { path: 'activity', element: <ActivityLogsPage /> },
  { path: 'settings', element: <SettingsPage /> },
  { path: 'profile', element: <ProfilePage /> },
  { path: 'notifications', element: <NotificationsPage /> },
];
