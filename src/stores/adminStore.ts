import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Plan, UserProfile, Payment, AdminStats } from '../types';

interface AdminState {
  plans: Plan[];
  users: UserProfile[];
  payments: Payment[];
  stats: AdminStats | null;
  loading: boolean;

  fetchPlans: () => Promise<void>;
  createPlan: (plan: Partial<Plan>) => Promise<void>;
  updatePlan: (id: string, updates: Partial<Plan>) => Promise<void>;
  deletePlan: (id: string) => Promise<void>;
  fetchUsers: () => Promise<void>;
  fetchPayments: () => Promise<void>;
  fetchStats: () => Promise<void>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  plans: [],
  users: [],
  payments: [],
  stats: null,
  loading: false,

  fetchPlans: async () => {
    set({ loading: true });
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
        stripe_price_id: row.stripe_price_id ?? undefined,
        is_active: row.is_active,
        sort_order: row.sort_order,
      }));

      set({ plans, loading: false });
    } catch (err) {
      console.error('Failed to fetch plans:', err);
      set({ loading: false });
    }
  },

  createPlan: async (plan) => {
    set({ loading: true });
    try {
      const { error } = await supabase.from('plans').insert({
        name: plan.name ?? '',
        name_ms: plan.name_ms ?? '',
        description: plan.description ?? '',
        price_myr: plan.price_myr ?? 0,
        duration_days: plan.duration_days ?? 60,
        features: plan.features ?? [],
        stripe_price_id: plan.stripe_price_id ?? null,
        is_active: plan.is_active ?? true,
        sort_order: plan.sort_order ?? 0,
      });

      if (error) throw error;

      // Refresh plans list
      await get().fetchPlans();
    } catch (err) {
      console.error('Failed to create plan:', err);
      set({ loading: false });
      throw err;
    }
  },

  updatePlan: async (id, updates) => {
    set({ loading: true });
    try {
      const payload: Record<string, unknown> = {};
      if (updates.name !== undefined) payload.name = updates.name;
      if (updates.name_ms !== undefined) payload.name_ms = updates.name_ms;
      if (updates.description !== undefined) payload.description = updates.description;
      if (updates.price_myr !== undefined) payload.price_myr = updates.price_myr;
      if (updates.duration_days !== undefined) payload.duration_days = updates.duration_days;
      if (updates.features !== undefined) payload.features = updates.features;
      if (updates.stripe_price_id !== undefined) payload.stripe_price_id = updates.stripe_price_id;
      if (updates.is_active !== undefined) payload.is_active = updates.is_active;
      if (updates.sort_order !== undefined) payload.sort_order = updates.sort_order;

      const { error } = await supabase.from('plans').update(payload).eq('id', id);
      if (error) throw error;

      await get().fetchPlans();
    } catch (err) {
      console.error('Failed to update plan:', err);
      set({ loading: false });
      throw err;
    }
  },

  deletePlan: async (id) => {
    set({ loading: true });
    try {
      const { error } = await supabase.from('plans').delete().eq('id', id);
      if (error) throw error;

      await get().fetchPlans();
    } catch (err) {
      console.error('Failed to delete plan:', err);
      set({ loading: false });
      throw err;
    }
  },

  fetchUsers: async () => {
    set({ loading: true });
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

      set({ users, loading: false });
    } catch (err) {
      console.error('Failed to fetch users:', err);
      set({ loading: false });
    }
  },

  fetchPayments: async () => {
    set({ loading: true });
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

      set({ payments, loading: false });
    } catch (err) {
      console.error('Failed to fetch payments:', err);
      set({ loading: false });
    }
  },

  fetchStats: async () => {
    set({ loading: true });
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

      set({ stats, loading: false });
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      set({ loading: false });
    }
  },
}));
