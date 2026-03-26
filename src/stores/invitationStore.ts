import { create } from 'zustand';
import type { Invitation, RSVP, GuestbookMessage } from '../types';
import { supabase } from '../lib/supabase';
import {
  demoInvitation,
  demoRSVPs,
  demoGuestbook,
  TRIAL_PREVIEW_STORAGE_KEY,
} from '../lib/demo-data';

interface InvitationState {
  invitation: Invitation | null;
  rsvps: RSVP[];
  guestbook: GuestbookMessage[];
  loading: boolean;
  error: string | null;
  musicPlaying: boolean;

  fetchInvitation: (slug: string) => Promise<void>;
  submitRSVP: (rsvp: Omit<RSVP, 'id' | 'created_at'>) => Promise<void>;
  submitGuestbook: (msg: Omit<GuestbookMessage, 'id' | 'created_at'>) => Promise<void>;
  toggleMusic: () => void;
  setInvitation: (inv: Invitation) => void;
}

export const useInvitationStore = create<InvitationState>((set, get) => ({
  invitation: null,
  rsvps: [],
  guestbook: [],
  loading: false,
  error: null,
  musicPlaying: false,

  fetchInvitation: async (slug: string) => {
    set({ loading: true, error: null });

    // Demo slug — use local demo data immediately, skip Supabase entirely
    if (slug === 'aiman-nadia') {
      let trialInvitation = demoInvitation;

      if (typeof window !== 'undefined') {
        const raw = window.localStorage.getItem(TRIAL_PREVIEW_STORAGE_KEY);

        if (raw) {
          try {
            trialInvitation = {
              ...demoInvitation,
              ...JSON.parse(raw),
            } as Invitation;
          } catch {
            trialInvitation = demoInvitation;
          }
        }
      }

      set({ invitation: trialInvitation, rsvps: demoRSVPs, guestbook: demoGuestbook, loading: false });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error || !data) {
        // Fall back to demo data
        set({ invitation: demoInvitation, rsvps: demoRSVPs, guestbook: demoGuestbook, loading: false });
        return;
      }

      // Fetch RSVPs and guestbook
      const [rsvpRes, gbRes] = await Promise.all([
        supabase.from('rsvps').select('*').eq('invitation_id', data.id).order('created_at', { ascending: false }),
        supabase
          .from('guestbook_messages')
          .select('*')
          .eq('invitation_id', data.id)
          .order('created_at', { ascending: false }),
      ]);

      set({
        invitation: data as Invitation,
        rsvps: (rsvpRes.data as RSVP[]) || [],
        guestbook: (gbRes.data as GuestbookMessage[]) || [],
        loading: false,
      });
    } catch {
      set({ invitation: demoInvitation, rsvps: demoRSVPs, guestbook: demoGuestbook, loading: false });
    }
  },

  submitRSVP: async (rsvp) => {
    try {
      const { data, error } = await supabase.from('rsvps').insert(rsvp).select().single();
      if (error) throw error;
      set({ rsvps: [data as RSVP, ...get().rsvps] });
    } catch {
      // Demo mode fallback
      const newRsvp: RSVP = { ...rsvp, id: crypto.randomUUID(), created_at: new Date().toISOString() };
      set({ rsvps: [newRsvp, ...get().rsvps] });
    }
  },

  submitGuestbook: async (msg) => {
    try {
      const { data, error } = await supabase.from('guestbook_messages').insert(msg).select().single();
      if (error) throw error;
      set({ guestbook: [data as GuestbookMessage, ...get().guestbook] });
    } catch {
      const newMsg: GuestbookMessage = { ...msg, id: crypto.randomUUID(), created_at: new Date().toISOString() };
      set({ guestbook: [newMsg, ...get().guestbook] });
    }
  },

  toggleMusic: () => set({ musicPlaying: !get().musicPlaying }),
  setInvitation: (inv) => set({ invitation: inv }),
}));
