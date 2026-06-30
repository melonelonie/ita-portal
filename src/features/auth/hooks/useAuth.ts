import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';

export function useAuth() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const error = useAuthStore((s) => s.error);
  const loginAction = useAuthStore((s) => s.login);
  const logoutAction = useAuthStore((s) => s.logout);
  const clearError = useAuthStore((s) => s.clearError);

  const login = useCallback(
    async (email: string, password: string) => {
      await loginAction(email, password);
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        navigate(
          currentUser.role === 'admin' ? '/admin/dashboard' : '/ta/dashboard',
          { replace: true }
        );
      }
    },
    [loginAction, navigate]
  );

  const logout = useCallback(() => {
    logoutAction();
    navigate('/login', { replace: true });
  }, [logoutAction, navigate]);

  const role = user?.role ?? null;

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    role,
    login,
    logout,
    clearError,
  };
}
