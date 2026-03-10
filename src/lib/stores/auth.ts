import { writable } from 'svelte/store';
import { apiUrl } from '$lib/api';

export type User = {
  id: number;
  username: string;
  role: string;
};

export type AuthState = {
  isLoggedIn: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
};

function createAuthStore() {
  const initialState: AuthState = {
    isLoggedIn: false,
    user: null,
    loading: true,
    error: null
  };

  const { subscribe, set, update } = writable<AuthState>(initialState);

  return {
    subscribe,

    /**
     * Login with username and password
     */
    async login(username: string, password: string) {
      update((state) => ({ ...state, loading: true, error: null }));

      try {
        const response = await fetch(apiUrl('/login'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
          const error = await response.json();
          update((state) => ({
            ...state,
            loading: false,
            error: error.message || 'Login failed'
          }));
          return false;
        }

        const data = await response.json();
        update((state) => ({
          ...state,
          isLoggedIn: true,
          user: data.user,
          loading: false,
          error: null
        }));

        return true;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Network error';
        update((state) => ({
          ...state,
          loading: false,
          error: errorMsg
        }));
        return false;
      }
    },

    /**
     * Logout
     */
    async logout() {
      update((state) => ({ ...state, loading: true }));

      try {
        await fetch(apiUrl('/logout'), {
          method: 'POST',
          credentials: 'include'
        });
      } catch (err) {
        console.error('Logout error:', err);
      }

      set(initialState);
      update((state) => ({ ...state, loading: false }));
    },

    /**
     * Check if user is logged in
     */
    async checkAuth() {
      update((state) => ({ ...state, loading: true }));

      try {
        const response = await fetch(apiUrl('/me'), {
          credentials: 'include'
        });

        if (response.ok) {
          const user = await response.json();
          update((state) => ({
            ...state,
            isLoggedIn: true,
            user,
            loading: false,
            error: null
          }));
        } else {
          set(initialState);
          update((state) => ({ ...state, loading: false }));
        }
      } catch (err) {
        console.error('Auth check error:', err);
        set(initialState);
        update((state) => ({ ...state, loading: false }));
      }
    }
  };
}

export const authStore = createAuthStore();
