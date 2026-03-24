import { create } from 'zustand';
import type { Invitation, RSVP, GuestbookMessage } from '../types';
import { supabase } from '../lib/supabase';

interface DashboardState {
  invitations: Invitation[];
  currentInvitation: Invitation | null;
  rsvps: RSVP[];
  guestbook: GuestbookMessage[];
  loading: boolean;

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

  fetchMyInvitations: async () => {
    set({ loading: true });
    const { data } = await supabase
      .from('invitations')
      .select('*')
      .order('created_at', { ascending: false });
    set({ invitations: (data as Invitation[]) || [], loading: false });
  },

  fetchInvitationDetails: async (id: string) => {
    set({ loading: true });
    const [invRes, rsvpRes, gbRes] = await Promise.all([
      supabase.from('invitations').select('*').eq('id', id).single(),
      supabase.from('rsvps').select('*').eq('invitation_id', id).order('created_at', { ascending: false }),
      supabase.from('guestbook_messages').select('*').eq('invitation_id', id).order('created_at', { ascending: false }),
    ]);
    set({
      currentInvitation: invRes.data as Invitation,
      rsvps: (rsvpRes.data as RSVP[]) || [],
      guestbook: (gbRes.data as GuestbookMessage[]) || [],
      loading: false,
    });
  },

  createInvitation: async (inv) => {
    const { data, error } = await supabase.from('invitations').insert(inv).select().single();
    if (error) throw error;
    const newInv = data as Invitation;
    set({ invitations: [newInv, ...get().invitations] });
    return newInv;
  },

  updateInvitation: async (id, updates) => {
    const { error } = await supabase.from('invitations').update(updates).eq('id', id);
    if (error) throw error;
    set({
      invitations: get().invitations.map((inv) => (inv.id === id ? { ...inv, ...updates } : inv)),
      currentInvitation: get().currentInvitation?.id === id
        ? { ...get().currentInvitation!, ...updates }
        : get().currentInvitation,
    });
  },

  deleteInvitation: async (id) => {
    await supabase.from('invitations').delete().eq('id', id);
    set({ invitations: get().invitations.filter((inv) => inv.id !== id) });
  },

  deleteGuestbookMessage: async (id) => {
    await supabase.from('guestbook_messages').delete().eq('id', id);
    set({ guestbook: get().guestbook.filter((msg) => msg.id !== id) });
  },
}));
