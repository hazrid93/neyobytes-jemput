import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Plan, Payment } from '../types';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  : null;

// Default demo plans for when Supabase isn't connected
const DEFAULT_PLANS: Plan[] = [
  {
    id: 'plan-free',
    name: 'Free',
    name_ms: 'Percuma',
    description: 'Kad asas dengan ciri terhad',
    price_myr: 0,
    duration_days: 30,
    features: [
      'Satu rekaan asas',
      'RSVP',
      'Lokasi & peta',
      'Simpan tarikh',
      'Watermark Jemput',
    ],
    is_active: true,
    sort_order: 0,
  },
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
    is_active: true,
    sort_order: 1,
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
    is_active: true,
    sort_order: 2,
  },
];

interface PaymentState {
  plans: Plan[];
  currentPayment: Payment | null;
  loading: boolean;

  fetchPlans: () => Promise<void>;
  createCheckout: (planId: string, invitationId: string) => Promise<string>;
  verifyPayment: (sessionId: string) => Promise<void>;
}

export const usePaymentStore = create<PaymentState>((set, get) => ({
  plans: DEFAULT_PLANS,
  currentPayment: null,
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
          stripe_price_id: row.stripe_price_id ?? undefined,
          is_active: row.is_active,
          sort_order: row.sort_order,
        }));
        set({ plans, loading: false });
      } else {
        // Fall back to default demo plans
        set({ plans: DEFAULT_PLANS, loading: false });
      }
    } catch {
      // Fall back to default demo plans on error
      set({ plans: DEFAULT_PLANS, loading: false });
    }
  },

  createCheckout: async (planId: string, invitationId: string) => {
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
          invitation_id: invitationId,
          plan_id: planId,
          amount: 0,
          currency: 'myr',
          status: 'succeeded',
        });

        if (error) throw error;

        set({ loading: false });
        return `${window.location.origin}/dashboard`;
      }

      // Paid plan: create Stripe Checkout session
      const stripe = stripePromise ? await stripePromise : null;

      if (stripe && plan.stripe_price_id) {
        // Use Supabase Edge Function to create checkout session
        const { data, error } = await supabase.functions.invoke(
          'create-checkout',
          {
            body: {
              plan_id: planId,
              invitation_id: invitationId,
              price_id: plan.stripe_price_id,
              success_url: `${window.location.origin}/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`,
              cancel_url: `${window.location.origin}/pricing`,
            },
          }
        );

        if (error) throw error;

        set({ loading: false });
        return data.checkout_url as string;
      }

      // Fallback: create a pending payment record (placeholder for when Stripe isn't configured)
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: payment, error } = await supabase
        .from('payments')
        .insert({
          user_id: user.id,
          invitation_id: invitationId,
          plan_id: planId,
          amount: plan.price_myr,
          currency: 'myr',
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      set({
        currentPayment: {
          id: payment.id,
          user_id: payment.user_id,
          invitation_id: payment.invitation_id ?? undefined,
          plan_id: payment.plan_id,
          amount: Number(payment.amount),
          currency: payment.currency,
          status: payment.status,
          created_at: payment.created_at,
        },
        loading: false,
      });

      // Return dashboard URL as fallback
      return `${window.location.origin}/dashboard?payment=pending&id=${payment.id}`;
    } catch (err) {
      console.error('Checkout failed:', err);
      set({ loading: false });
      throw err;
    }
  },

  verifyPayment: async (sessionId: string) => {
    set({ loading: true });
    try {
      // Call Supabase Edge Function to verify the Stripe session
      const { data, error } = await supabase.functions.invoke(
        'verify-payment',
        {
          body: { session_id: sessionId },
        }
      );

      if (error) throw error;

      if (data?.payment) {
        set({
          currentPayment: {
            id: data.payment.id,
            user_id: data.payment.user_id,
            invitation_id: data.payment.invitation_id ?? undefined,
            plan_id: data.payment.plan_id,
            amount: Number(data.payment.amount),
            currency: data.payment.currency,
            stripe_session_id: data.payment.stripe_session_id ?? undefined,
            stripe_payment_intent_id:
              data.payment.stripe_payment_intent_id ?? undefined,
            status: data.payment.status,
            created_at: data.payment.created_at,
          },
          loading: false,
        });
      } else {
        set({ loading: false });
      }
    } catch (err) {
      console.error('Payment verification failed:', err);
      set({ loading: false });
    }
  },
}));
