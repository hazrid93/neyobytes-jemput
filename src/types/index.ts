export interface Invitation {
  id: string;
  user_id: string;
  slug: string;
  status: 'draft' | 'published';
  template: string;

  // Couple info
  bride_name: string;
  groom_name: string;
  bride_parent_names: string;
  groom_parent_names: string;
  couple_photo_url?: string;
  cover_photo_url?: string;

  // Event details
  event_date: string;
  event_time_start: string;
  event_time_end: string;
  venue_name: string;
  venue_address: string;
  venue_lat?: number;
  venue_lng?: number;

  // Content
  invitation_text: string;
  music_url?: string;
  itinerary: ItineraryItem[];
  contacts: ContactPerson[];
  money_gift?: MoneyGift;
  wishlist: WishlistItem[];
  theme_config: ThemeConfig;

  // Gallery
  gallery_images: GalleryImage[];

  created_at: string;
  updated_at: string;
}

export interface ItineraryItem {
  time: string;
  event: string;
  icon?: string;
}

export interface ContactPerson {
  name: string;
  phone: string;
  role: string;
}

export interface MoneyGift {
  bank_name: string;
  account_name: string;
  account_number: string;
  qr_code_url?: string;
}

export interface WishlistItem {
  id: string;
  name: string;
  claimed: boolean;
  claimed_by?: string;
}

export interface ThemeConfig {
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  bg_color: string;
  text_color: string;
  font_display: string;
  font_body: string;
  font_arabic: string;
}

export interface RSVP {
  id: string;
  invitation_id: string;
  guest_name: string;
  phone?: string;
  attending: boolean;
  num_adults: number;
  num_children: number;
  message?: string;
  created_at: string;
}

export interface GuestbookMessage {
  id: string;
  invitation_id: string;
  name: string;
  message: string;
  created_at: string;
}

export interface GalleryImage {
  id: string;
  invitation_id: string;
  url: string;
  sort_order: number;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  created_at: string;
}
