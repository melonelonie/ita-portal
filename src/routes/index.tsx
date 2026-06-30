import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';
import AuthGuard from '../features/auth/components/AuthGuard';
import AdminLayout from '../components/layout/AdminLayout';
import TALayout from '../components/layout/TALayout';
import { adminRoutes } from './adminRoutes';
import { taRoutes } from './taRoutes';

// Auth pages (lazy loaded)
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'));
const ForgotPasswordPage = lazy(() => import('../features/auth/pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../features/auth/pages/ResetPasswordPage'));

// Loading fallback
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#09090b]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <p className="text-sm text-zinc-500 animate-pulse">Loading...</p>
      </div>
    </div>
  );
}

// 404 page
function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#09090b] text-center px-6">
      <h1 className="text-7xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
        404
      </h1>
      <p className="text-xl text-zinc-400 mb-2">Page not found</p>
      <p className="text-sm text-zinc-600 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <a
        href="/login"
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-500 hover:to-purple-500 transition-all"
      >
        Go to Login
      </a>
    </div>
  );
}

export const router = createBrowserRouter([
  // Root redirect
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },

  // Public routes
  {
    path: '/login',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: '/forgot-password',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ForgotPasswordPage />
      </Suspense>
    ),
  },
  {
    path: '/reset-password',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ResetPasswordPage />
      </Suspense>
    ),
  },

  // Protected admin routes
  {
    path: '/admin',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <AuthGuard requiredRole="admin" />
      </Suspense>
    ),
    children: [
      {
        element: <AdminLayout />,
        children: adminRoutes.map((route) => ({
          ...route,
          element: route.element ? (
            <Suspense fallback={<LoadingFallback />}>{route.element}</Suspense>
          ) : undefined,
        })),
      },
    ],
  },

  // Protected TA routes
  {
    path: '/ta',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <AuthGuard requiredRole="ta" />
      </Suspense>
    ),
    children: [
      {
        element: <TALayout />,
        children: taRoutes.map((route) => ({
          ...route,
          element: route.element ? (
            <Suspense fallback={<LoadingFallback />}>{route.element}</Suspense>
          ) : undefined,
        })),
      },
    ],
  },

  // 404 catch-all
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
