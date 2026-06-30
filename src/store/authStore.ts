import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'ta';
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  clearError: () => void;
}

/**
 * Authentication Store
 *
 * Current implementation uses mock credentials from src/mock/data/mockAuth.ts
 * for frontend development purposes.
 *
 * TODO: Replace the mock login logic below with a real API call:
 *   const response = await fetch('/api/auth/login', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ email, password }),
 *   });
 *   const data = await response.json();
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        // TODO: Replace with real API call — POST /api/auth/login
        // Simulated network delay for development UX
        await new Promise((resolve) => setTimeout(resolve, 1200));

        // Dynamic import keeps mock data out of production bundles
        // when tree-shaking is enabled and this code path is replaced.
        const { MOCK_USERS } = await import('../mock/data/mockAuth');
        const mockEntry = MOCK_USERS[email.toLowerCase()];

        if (!mockEntry || mockEntry.password !== password) {
          set({ isLoading: false, error: 'Invalid email or password' });
          return;
        }

        set({
          user: mockEntry.user,
          token: mockEntry.token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      setUser: (user: User) => {
        set({ user });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'ita-auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
