// ============================================================================
// INVITATION & SECTIONS
// ============================================================================

export type SectionType =
  | 'cover'
  | 'islamic_greeting'
  | 'invitation_text'
  | 'couple'
  | 'event_details'
  | 'countdown'
  | 'itinerary'
  | 'location'
  | 'contact'
  | 'rsvp'
  | 'money_gift'
  | 'gallery'
  | 'guestbook'
  | 'calendar_save'
  | 'footer'
  | 'custom_text'
  | 'custom_image'
  | 'custom_video';

export interface InvitationSection {
  id: string;
  type: SectionType;
  enabled: boolean;
  sort_order: number;
  config?: Record<string, unknown>; // section-specific overrides
}

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
  venue_google_maps_embed?: string;

  // RSVP settings
  rsvp_deadline?: string;
  rsvp_enabled: boolean;

  // Content
  invitation_text: string;
  music_url?: string;
  music_type?: 'direct' | 'youtube';
  itinerary: ItineraryItem[];
  contacts: ContactPerson[];
  money_gift?: MoneyGift;
  wishlist: WishlistItem[];
  theme_config: ThemeConfig;

  // Sections layout
  sections: InvitationSection[];

  // AI Chatbot
  chatbot_enabled: boolean;
  chatbot_context?: string; // extra context the user provides for the chatbot

  // Gallery
  gallery_images: GalleryImage[];

  // Payment / Expiry
  expires_at?: string;
  payment_status?: 'free' | 'paid' | 'expired';

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
  ornament_style?: 'classic' | 'floral' | 'geometric' | 'minimal' | 'batik';
}

// ============================================================================
// THEME TEMPLATES
// ============================================================================

export interface ThemeTemplate {
  id: string;
  name: string;
  name_ms: string; // Malay name
  description: string;
  preview_colors: string[]; // 3-4 color swatches for preview
  theme_config: ThemeConfig;
  default_sections: InvitationSection[];
}

// ============================================================================
// RSVP & GUESTBOOK
// ============================================================================

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

// ============================================================================
// USER & AUTH
// ============================================================================

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  role: 'user' | 'admin';
  stripe_customer_id?: string;
  created_at: string;
}

// ============================================================================
// PAYMENT & PLANS
// ============================================================================

export interface Plan {
  id: string;
  name: string;
  name_ms: string;
  description: string;
  price_myr: number; // price in MYR
  duration_days: number; // how long the invitation stays active
  features: string[];
  chatbot_enabled: boolean; // whether this plan includes AI chatbot
  chatbot_daily_limit: number; // max questions per invitee per day (0 = unlimited)
  stripe_price_id?: string;
  is_active: boolean;
  sort_order: number;
}

export interface Payment {
  id: string;
  user_id: string;
  invitation_id?: string;
  plan_id: string;
  amount: number;
  currency: string;
  stripe_session_id?: string;
  stripe_payment_intent_id?: string;
  status: 'pending' | 'succeeded' | 'failed';
  created_at: string;
}

// ============================================================================
// AI CHATBOT
// ============================================================================

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatQuota {
  invitation_id: string;
  visitor_id: string; // fingerprint or session ID
  date: string; // YYYY-MM-DD
  count: number;
  limit: number;
}

export interface ChatbotConfig {
  provider: 'alibaba' | 'ollama-cloud' | 'novita';
  model: string;
  api_key: string;
  base_url?: string;
  max_tokens?: number;
  temperature?: number;
}

// ============================================================================
// ADMIN
// ============================================================================

export interface AdminStats {
  total_users: number;
  total_invitations: number;
  total_payments: number;
  revenue_myr: number;
  active_invitations: number;
  expired_invitations: number;
}
