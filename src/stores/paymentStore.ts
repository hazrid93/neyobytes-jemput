import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Plan, Payment } from '../types';

// Default demo plans for when Supabase isn't connected
const DEFAULT_PLANS: Plan[] = [
  {
    id: 'plan-basic',
    name: 'Basic',
    name_ms: 'Asas',
    description: 'Semua yang anda perlukan',
    price_myr: 29,
    duration_days: 60,
    features: [
      'Semua rekaan tema',
      'Tiada watermark',
      'RSVP & pengurusan tetamu',
      'Galeri foto',
      'Muzik latar',
      'Hitung mundur',
      'Salam Kaut',
      'Eksport Excel',
    ],
    chatbot_enabled: false,
    chatbot_daily_limit: 0,
    is_active: true,
    sort_order: 0,
  },
  {
    id: 'plan-premium',
    name: 'Premium',
    name_ms: 'Premium',
    description: 'Pengalaman terbaik',
    price_myr: 59,
    duration_days: 60,
    features: [
      'Semua ciri Asas',
      'Chatbot AI untuk tetamu',
      'Analitik terperinci',
      'Sokongan keutamaan',
      'Bahagian khas tanpa had',
      'Senarai hadiah',
    ],
    chatbot_enabled: true,
    chatbot_daily_limit: 20,
    is_active: true,
    sort_order: 1,
  },
];

interface StripeConfig {
  publishableKey: string | null;
  mode: string;
}

interface PaymentState {
  plans: Plan[];
  currentPayment: Payment | null;
  stripeConfig: StripeConfig | null;
  loading: boolean;

  fetchPlans: () => Promise<void>;
  fetchStripeConfig: () => Promise<StripeConfig>;
  createCheckout: (planId: string, invitationId?: string) => Promise<string>;
  verifyPayment: (sessionId: string) => Promise<{
    status: string;
    payment_status: string;
    customer_email?: string;
  }>;
}

export const usePaymentStore = create<PaymentState>((set, get) => ({
  plans: DEFAULT_PLANS,
  currentPayment: null,
  stripeConfig: null,
  loading: false,

  fetchPlans: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        const plans: Plan[] = data.map((row) => ({
          id: row.id,
          name: row.name,
          name_ms: row.name_ms,
          description: row.description ?? '',
          price_myr: Number(row.price_myr),
          duration_days: row.duration_days,
          features:
            typeof row.features === 'string'
              ? JSON.parse(row.features)
              : row.features ?? [],
          chatbot_enabled: row.chatbot_enabled ?? false,
          chatbot_daily_limit: row.chatbot_daily_limit ?? 0,
          stripe_price_id: row.stripe_price_id ?? undefined,
          is_active: row.is_active,
          sort_order: row.sort_order,
        }));
        set({ plans, loading: false });
      } else {
        set({ plans: DEFAULT_PLANS, loading: false });
      }
    } catch {
      set({ plans: DEFAULT_PLANS, loading: false });
    }
  },

  fetchStripeConfig: async () => {
    // Return cached config if available
    const cached = get().stripeConfig;
    if (cached) return cached;

    const API_URL = import.meta.env.VITE_API_URL || '/api';
    const res = await fetch(`${API_URL}/stripe/config`);
    if (!res.ok) throw new Error('Failed to fetch Stripe config');

    const config: StripeConfig = await res.json();
    set({ stripeConfig: config });
    return config;
  },

  createCheckout: async (planId: string, invitationId?: string) => {
    set({ loading: true });
    try {
      const plans = get().plans;
      const plan = plans.find((p) => p.id === planId);
      if (!plan) throw new Error('Plan not found');

      // Free plan: just record it directly
      if (plan.price_myr === 0) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { error } = await supabase.from('payments').insert({
          user_id: user.id,
          invitation_id: invitationId || null,
          plan_id: planId,
          amount: 0,
          currency: 'myr',
          status: 'succeeded',
        });

        if (error) throw error;

        set({ loading: false });
        return '';
      }

      // Paid plan: create Stripe Embedded Checkout session
      if (!plan.stripe_price_id) {
        throw new Error(
          'Pelan ini belum dikonfigurasi untuk pembayaran. Sila hubungi pentadbir.'
        );
      }

      const API_URL = import.meta.env.VITE_API_URL || '/api';

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) throw new Error('Not authenticated');

      const response = await fetch(`${API_URL}/stripe/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          invitationId: invitationId || '',
          userId: session.user.id,
          priceId: plan.stripe_price_id,
          email: session.user.email,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to create checkout session');
      }

      const { clientSecret } = await response.json();

      set({ loading: false });
      return clientSecret as string;
    } catch (err) {
      console.error('Checkout failed:', err);
      set({ loading: false });
      throw err;
    }
  },

  verifyPayment: async (sessionId: string) => {
    const API_URL = import.meta.env.VITE_API_URL || '/api';

    const res = await fetch(
      `${API_URL}/stripe/session-status?session_id=${encodeURIComponent(sessionId)}`
    );
    if (!res.ok) throw new Error('Failed to verify payment');

    return await res.json();
  },
}));
