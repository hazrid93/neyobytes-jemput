import { supabase } from './supabase';
import type { SiteSettings } from '../types';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  id: 'main',
  company_name: 'Jemput by Neyobytes',
  company_tagline: 'Platform kad kahwin digital premium untuk pasangan Malaysia moden.',
  about_short:
    'Jemput membantu pasangan Malaysia membina kad kahwin digital yang cantik, mudah dikongsi, dan mudah diurus dari RSVP hingga ke salam kaut digital.',
  contact_email: 'hello@jemput.neyobytes.com',
  contact_phone: '',
  address: 'Malaysia',
  instagram_url: '',
  facebook_url: '',
  x_url: '',
};

export function normalizeSiteSettings(data?: Partial<SiteSettings> | null): SiteSettings {
  return {
    ...DEFAULT_SITE_SETTINGS,
    ...data,
    id: 'main',
  };
}

export async function fetchPublicSiteSettings(): Promise<SiteSettings> {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 'main')
      .maybeSingle();

    if (error) throw error;

    return normalizeSiteSettings(data as Partial<SiteSettings> | null);
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}
