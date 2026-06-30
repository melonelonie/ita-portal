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

const MOCK_USERS: Record<string, { password: string; user: User; token: string }> = {
  'admin@initus.com': {
    password: 'admin123',
    user: {
      id: '1',
      name: 'Arjun Mehta',
      email: 'admin@initus.com',
      role: 'admin',
      avatar: undefined,
    },
    token: 'mock-admin-jwt-token-xyz',
  },
  'ta@initus.com': {
    password: 'ta123',
    user: {
      id: '2',
      name: 'Priya Sharma',
      email: 'ta@initus.com',
      role: 'ta',
      avatar: undefined,
    },
    token: 'mock-ta-jwt-token-abc',
  },
};

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

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1200));

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
