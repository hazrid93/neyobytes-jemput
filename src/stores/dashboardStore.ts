import { create } from 'zustand';
import type { Invitation, RSVP, GuestbookMessage } from '../types';
import { supabase } from '../lib/supabase';

function handleSlugError(error: { code?: string; message?: string }): never {
  if (error.code === '23505' || error.message?.includes('unique') || error.message?.includes('duplicate')) {
    throw new Error('Slug URL ini telah digunakan. Sila pilih slug yang lain.');
  }
  throw error;
}

interface DashboardState {
  invitations: Invitation[];
  currentInvitation: Invitation | null;
  rsvps: RSVP[];
  guestbook: GuestbookMessage[];
  loading: boolean;
  loadingDetails: boolean;

  fetchMyInvitations: () => Promise<void>;
  fetchInvitationDetails: (id: string) => Promise<void>;
  createInvitation: (inv: Partial<Invitation>) => Promise<Invitation>;
  updateInvitation: (id: string, updates: Partial<Invitation>) => Promise<void>;
  deleteInvitation: (id: string) => Promise<void>;
  deleteGuestbookMessage: (id: string) => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  invitations: [],
  currentInvitation: null,
  rsvps: [],
  guestbook: [],
  loading: false,
  loadingDetails: false,

  fetchMyInvitations: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      set({ invitations: (data as Invitation[]) || [] });
    } catch (err) {
      console.error('Failed to fetch invitations:', err);
    } finally {
      set({ loading: false });
    }
  },

  fetchInvitationDetails: async (id: string) => {
    set({ loadingDetails: true });
    try {
      const [invRes, rsvpRes, gbRes] = await Promise.all([
        supabase.from('invitations').select('*').eq('id', id).single(),
        supabase.from('rsvps').select('*').eq('invitation_id', id).order('created_at', { ascending: false }),
        supabase.from('guestbook_messages').select('*').eq('invitation_id', id).order('created_at', { ascending: false }),
      ]);
      if (invRes.error) throw invRes.error;
      set({
        currentInvitation: invRes.data as Invitation,
        rsvps: (rsvpRes.data as RSVP[]) || [],
        guestbook: (gbRes.data as GuestbookMessage[]) || [],
      });
    } catch (err) {
      console.error('Failed to fetch invitation details:', err);
    } finally {
      set({ loadingDetails: false });
    }
  },

  createInvitation: async (inv) => {
    const { data, error } = await supabase
      .from('invitations')
      .insert(inv)
      .select()
      .maybeSingle();

    if (error && error.code !== 'PGRST116') handleSlugError(error);

    let newInv = data as Invitation | null;

    // Some Supabase/PostgREST setups return 0 rows after insert even when the
    // write succeeds, so fall back to reading the row back by slug.
    if (!newInv && inv.slug) {
      const query = supabase
        .from('invitations')
        .select('*')
        .eq('slug', inv.slug)
        .order('created_at', { ascending: false })
        .limit(1);

      const fetchResult = inv.user_id
        ? await query.eq('user_id', inv.user_id).maybeSingle()
        : await query.maybeSingle();

      if (fetchResult.error) handleSlugError(fetchResult.error);
      newInv = fetchResult.data as Invitation | null;
    }

    if (!newInv) {
      throw new Error('Kad jemputan berjaya disimpan tetapi data tidak dapat dimuat semula. Sila segar semula halaman.');
    }

    set({ invitations: [newInv, ...get().invitations] });
    return newInv;
  },

  updateInvitation: async (id, updates) => {
    const { error } = await supabase.from('invitations').update(updates).eq('id', id);
    if (error) handleSlugError(error);
    set({
      invitations: get().invitations.map((inv) => (inv.id === id ? { ...inv, ...updates } : inv)),
      currentInvitation: get().currentInvitation?.id === id
        ? { ...get().currentInvitation!, ...updates }
        : get().currentInvitation,
    });
  },

  deleteInvitation: async (id) => {
    const { error } = await supabase.from('invitations').delete().eq('id', id);
    if (error) throw error;
    set({ invitations: get().invitations.filter((inv) => inv.id !== id) });
  },

  deleteGuestbookMessage: async (id) => {
    const { error } = await supabase.from('guestbook_messages').delete().eq('id', id);
    if (error) throw error;
    set({ guestbook: get().guestbook.filter((msg) => msg.id !== id) });
  },
}));
