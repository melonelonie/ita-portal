/**
 * Development-only mock credentials.
 * 
 * This file is used ONLY during frontend development while the backend
 * API is under construction. Once the backend is live, the authStore
 * should call the real POST /api/auth/login endpoint instead of
 * referencing this file.
 * 
 * TODO: Remove this file entirely once backend authentication is integrated.
 */

import type { User } from '../../store/authStore';

interface MockUserEntry {
  password: string;
  user: User;
  token: string;
}

export const MOCK_USERS: Record<string, MockUserEntry> = {
  'admin@initus.com': {
    password: 'admin123',
    user: {
      id: '1',
      name: 'Arjun Mehta',
      email: 'admin@initus.com',
      role: 'admin',
      avatar: undefined,
    },
    token: 'dev-mock-token-admin',
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
    token: 'dev-mock-token-ta',
  },
};
