import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { UserProfile } from '../types';

function getAuthRedirectUrl(path = '/login') {
  const baseUrl = (import.meta.env.VITE_APP_URL || window.location.origin).replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}

async function buildUserProfile(sessionUser: {
  id: string;
  email?: string;
  created_at: string;
  user_metadata?: { full_name?: string };
}): Promise<UserProfile> {
  const fallbackProfile: UserProfile = {
    id: sessionUser.id,
    email: sessionUser.email || '',
    full_name: sessionUser.user_metadata?.full_name,
    role: 'user',
    created_at: sessionUser.created_at,
  };

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('email, full_name, phone, role, stripe_customer_id, created_at')
      .eq('id', sessionUser.id)
      .maybeSingle();

    if (error || !data) {
      return fallbackProfile;
    }

    return {
      id: sessionUser.id,
      email: data.email || sessionUser.email || '',
      full_name: data.full_name ?? sessionUser.user_metadata?.full_name,
      phone: data.phone ?? undefined,
      role: data.role === 'admin' ? 'admin' : 'user',
      stripe_customer_id: data.stripe_customer_id ?? undefined,
      created_at: data.created_at || sessionUser.created_at,
    };
  } catch {
    return fallbackProfile;
  }
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
        const userProfile = await buildUserProfile(session.user);
        set({
          user: userProfile,
          initialized: true,
        });
      } else {
        set({ initialized: true });
      }
    } catch {
      set({ initialized: true });
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const userProfile = await buildUserProfile(session.user);
        set({
          user: userProfile,
        });
      } else {
        set({ user: null });
      }
    });

    // Store the unsubscribe function for cleanup
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__authUnsubscribe = () => subscription.unsubscribe();
  },

  signIn: async (email, password) => {
    set({ loading: true });
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } finally {
      set({ loading: false });
    }
  },

  signUp: async (email, password, fullName) => {
    set({ loading: true });
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: getAuthRedirectUrl('/login'),
        },
      });
      if (error) throw error;
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {
      await supabase.auth.signOut();
    } finally {
      set({ user: null });
    }
  },

  resetPassword: async (email) => {
    set({ loading: true });
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: getAuthRedirectUrl('/login?reset=true'),
      });
      if (error) throw error;
    } finally {
      set({ loading: false });
    }
  },

  updatePassword: async (newPassword) => {
    set({ loading: true });
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
