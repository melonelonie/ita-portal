import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';

interface AuthGuardProps {
  requiredRole?: 'admin' | 'ta';
}

export default function AuthGuard({ requiredRole }: AuthGuardProps) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  // Show loading state during hydration (persisted store loading)
  if (isAuthenticated === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#09090b]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  // Not authenticated → redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Wrong role → redirect to correct dashboard
  if (requiredRole && user.role !== requiredRole) {
    const redirectPath =
      user.role === 'admin' ? '/admin/dashboard' : '/ta/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
}
