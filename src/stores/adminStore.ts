import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Plan, UserProfile, Payment, AdminStats, SiteSettings } from '../types';
import { DEFAULT_SITE_SETTINGS, normalizeSiteSettings } from '../lib/site-settings';

interface AdminState {
  plans: Plan[];
  users: UserProfile[];
  payments: Payment[];
  stats: AdminStats | null;
  siteSettings: SiteSettings;
  loading: boolean;
  loadingPlans: boolean;
  loadingUsers: boolean;
  loadingPayments: boolean;
  loadingStats: boolean;
  loadingSiteSettings: boolean;

  fetchPlans: () => Promise<void>;
  createPlan: (plan: Partial<Plan>) => Promise<void>;
  updatePlan: (id: string, updates: Partial<Plan>) => Promise<void>;
  deletePlan: (id: string) => Promise<void>;
  fetchUsers: () => Promise<void>;
  fetchPayments: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchSiteSettings: () => Promise<void>;
  updateSiteSettings: (updates: Partial<SiteSettings>) => Promise<void>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  plans: [],
  users: [],
  payments: [],
  stats: null,
  siteSettings: DEFAULT_SITE_SETTINGS,
  loading: false,
  loadingPlans: false,
  loadingUsers: false,
  loadingPayments: false,
  loadingStats: false,
  loadingSiteSettings: false,

  fetchPlans: async () => {
    set({ loadingPlans: true, loading: true });
    try {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;

      const plans: Plan[] = (data ?? []).map((row) => ({
        id: row.id,
        name: row.name,
        name_ms: row.name_ms,
        description: row.description ?? '',
        price_myr: Number(row.price_myr),
        duration_days: row.duration_days,
        features: typeof row.features === 'string' ? JSON.parse(row.features) : row.features ?? [],
        chatbot_enabled: row.chatbot_enabled ?? false,
        chatbot_daily_limit: row.chatbot_daily_limit ?? 0,
        stripe_price_id: row.stripe_price_id ?? undefined,
        is_active: row.is_active,
        sort_order: row.sort_order,
      }));

      set({ plans });
    } catch (err) {
      console.error('Failed to fetch plans:', err);
    } finally {
      set({ loadingPlans: false, loading: false });
    }
  },

  createPlan: async (plan) => {
    set({ loadingPlans: true, loading: true });
    try {
      const { error } = await supabase.from('plans').insert({
        name: plan.name ?? '',
        name_ms: plan.name_ms ?? '',
        description: plan.description ?? '',
        price_myr: plan.price_myr ?? 0,
        duration_days: plan.duration_days ?? 60,
        features: plan.features ?? [],
        chatbot_enabled: plan.chatbot_enabled ?? false,
        chatbot_daily_limit: plan.chatbot_daily_limit ?? 0,
        stripe_price_id: plan.stripe_price_id ?? null,
        is_active: plan.is_active ?? true,
        sort_order: plan.sort_order ?? 0,
      });

      if (error) throw error;

      // Refresh plans list
      await get().fetchPlans();
    } catch (err) {
      console.error('Failed to create plan:', err);
      throw err;
    } finally {
      set({ loadingPlans: false, loading: false });
    }
  },

  updatePlan: async (id, updates) => {
    set({ loadingPlans: true, loading: true });
    try {
      const payload: Record<string, unknown> = {};
      if (updates.name !== undefined) payload.name = updates.name;
      if (updates.name_ms !== undefined) payload.name_ms = updates.name_ms;
      if (updates.description !== undefined) payload.description = updates.description;
      if (updates.price_myr !== undefined) payload.price_myr = updates.price_myr;
      if (updates.duration_days !== undefined) payload.duration_days = updates.duration_days;
      if (updates.features !== undefined) payload.features = updates.features;
      if (updates.chatbot_enabled !== undefined) payload.chatbot_enabled = updates.chatbot_enabled;
      if (updates.chatbot_daily_limit !== undefined) payload.chatbot_daily_limit = updates.chatbot_daily_limit;
      if (updates.stripe_price_id !== undefined) payload.stripe_price_id = updates.stripe_price_id;
      if (updates.is_active !== undefined) payload.is_active = updates.is_active;
      if (updates.sort_order !== undefined) payload.sort_order = updates.sort_order;

      const { error } = await supabase.from('plans').update(payload).eq('id', id);
      if (error) throw error;

      await get().fetchPlans();
    } catch (err) {
      console.error('Failed to update plan:', err);
      throw err;
    } finally {
      set({ loadingPlans: false, loading: false });
    }
  },

  deletePlan: async (id) => {
    set({ loadingPlans: true, loading: true });
    try {
      const { error } = await supabase.from('plans').delete().eq('id', id);
      if (error) throw error;

      await get().fetchPlans();
    } catch (err) {
      console.error('Failed to delete plan:', err);
      throw err;
    } finally {
      set({ loadingPlans: false, loading: false });
    }
  },

  fetchUsers: async () => {
    set({ loadingUsers: true, loading: true });
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const users: UserProfile[] = (data ?? []).map((row) => ({
        id: row.id,
        email: row.email,
        full_name: row.full_name ?? undefined,
        phone: row.phone ?? undefined,
        role: row.role ?? 'user',
        stripe_customer_id: row.stripe_customer_id ?? undefined,
        created_at: row.created_at,
      }));

      set({ users });
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      set({ loadingUsers: false, loading: false });
    }
  },

  fetchPayments: async () => {
    set({ loadingPayments: true, loading: true });
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const payments: Payment[] = (data ?? []).map((row) => ({
        id: row.id,
        user_id: row.user_id,
        invitation_id: row.invitation_id ?? undefined,
        plan_id: row.plan_id,
        amount: Number(row.amount),
        currency: row.currency,
        stripe_session_id: row.stripe_session_id ?? undefined,
        stripe_payment_intent_id: row.stripe_payment_intent_id ?? undefined,
        status: row.status,
        created_at: row.created_at,
      }));

      set({ payments });
    } catch (err) {
      console.error('Failed to fetch payments:', err);
    } finally {
      set({ loadingPayments: false, loading: false });
    }
  },

  fetchStats: async () => {
    set({ loadingStats: true, loading: true });
    try {
      // Fetch counts in parallel
      const [usersRes, invitationsRes, paymentsRes, activeRes, expiredRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('invitations').select('id', { count: 'exact', head: true }),
        supabase.from('payments').select('amount, status'),
        supabase
          .from('invitations')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'published'),
        supabase
          .from('invitations')
          .select('id', { count: 'exact', head: true })
          .eq('payment_status', 'expired'),
      ]);

      const successfulPayments = (paymentsRes.data ?? []).filter(
        (p) => p.status === 'succeeded'
      );
      const revenueMyr = successfulPayments.reduce(
        (sum, p) => sum + Number(p.amount),
        0
      );

      const stats: AdminStats = {
        total_users: usersRes.count ?? 0,
        total_invitations: invitationsRes.count ?? 0,
        total_payments: (paymentsRes.data ?? []).length,
        revenue_myr: revenueMyr,
        active_invitations: activeRes.count ?? 0,
        expired_invitations: expiredRes.count ?? 0,
      };

      set({ stats });
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      set({ loadingStats: false, loading: false });
    }
  },

  fetchSiteSettings: async () => {
    set({ loadingSiteSettings: true, loading: true });
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 'main')
        .maybeSingle();

      if (error) throw error;

      set({ siteSettings: normalizeSiteSettings(data as Partial<SiteSettings> | null) });
    } catch (err) {
      console.error('Failed to fetch site settings:', err);
      set({ siteSettings: DEFAULT_SITE_SETTINGS });
    } finally {
      set({ loadingSiteSettings: false, loading: false });
    }
  },

  updateSiteSettings: async (updates) => {
    set({ loadingSiteSettings: true, loading: true });
    try {
      const payload = {
        ...normalizeSiteSettings({ ...get().siteSettings, ...updates }),
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('site_settings').upsert(payload, { onConflict: 'id' });
      if (error) throw error;

      set({ siteSettings: normalizeSiteSettings(payload) });
    } catch (err) {
      console.error('Failed to update site settings:', err);
      throw err;
    } finally {
      set({ loadingSiteSettings: false, loading: false });
    }
  },
}));
