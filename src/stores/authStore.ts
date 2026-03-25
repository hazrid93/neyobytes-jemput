import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { UserProfile } from '../types';

function getAuthRedirectUrl(path = '/login') {
  const baseUrl = (import.meta.env.VITE_APP_URL || window.location.origin).replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}

interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  initialized: boolean;

  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  initialized: false,

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        set({
          user: {
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name,
            role: 'user',
            created_at: session.user.created_at,
          },
          initialized: true,
        });
      } else {
        set({ initialized: true });
      }
    } catch {
      set({ initialized: true });
    }

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        set({
          user: {
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name,
            role: 'user',
            created_at: session.user.created_at,
          },
        });
      } else {
        set({ user: null });
      }
    });
  },

  signIn: async (email, password) => {
    set({ loading: true });
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    set({ loading: false });
    if (error) throw error;
  },

  signUp: async (email, password, fullName) => {
    set({ loading: true });
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: getAuthRedirectUrl('/login'),
      },
    });
    set({ loading: false });
    if (error) throw error;
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },

  resetPassword: async (email) => {
    set({ loading: true });
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: getAuthRedirectUrl('/login?reset=true'),
    });
    set({ loading: false });
    if (error) throw error;
  },

  updatePassword: async (newPassword) => {
    set({ loading: true });
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    set({ loading: false });
    if (error) throw error;
  },
}));
