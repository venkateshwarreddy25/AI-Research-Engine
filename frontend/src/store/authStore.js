import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user:        null,
      accessToken: null,
      isLoading:   false,
      isAuth:      false,

      setUser: (user) => set({ user, isAuth: !!user }),

      setToken: (accessToken) => set({ accessToken }),

      setLoading: (isLoading) => set({ isLoading }),

      login:   (user, accessToken) => set({ user, accessToken, isAuth: true, isLoading: false }),
      setAuth: (user, accessToken) => set({ user, accessToken, isAuth: true, isLoading: false }),

      logout: () => set({ user: null, accessToken: null, isAuth: false }),

      updateProfile: (updates) => set((s) => ({
        user: s.user ? { ...s.user, ...updates } : null,
      })),

      isAdmin: () => {
        const role = get().user?.role;
        return role === 'admin' || role === 'super_admin';
      },

      isCitizen: () => get().user?.role === 'citizen',
    }),
    {
      name:    'gov-auth',
      partialize: (s) => ({
        user:        s.user,
        accessToken: s.accessToken,
        isAuth:      s.isAuth,
      }),
    }
  )
);
