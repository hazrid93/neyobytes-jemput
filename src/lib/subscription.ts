import { supabase } from './supabase';
import type { UserSubscriptionFeatures } from '../types';

const FREE_SUBSCRIPTION: UserSubscriptionFeatures = {
  plan_id: null,
  plan_name: 'Free',
  plan_name_ms: 'Percuma',
  is_active: false,
  source: 'free',
  invitation_chatbot_enabled: false,
  invitation_chat_daily_limit: 0,
  subscription_status: 'inactive',
  active_from: null,
  expires_at: null,
  granted_features: [],
};

export async function getUserSubscriptionFeatures(
  userId: string,
): Promise<UserSubscriptionFeatures> {
  const { data, error } = await supabase.rpc('get_user_subscription_features', {
    target_user_id: userId,
  });

  if (error) {
    throw error;
  }

  const row = Array.isArray(data) ? data[0] : data;
  if (!row) {
    return FREE_SUBSCRIPTION;
  }

  return {
    plan_id: row.plan_id ?? null,
    plan_name: row.plan_name ?? 'Free',
    plan_name_ms: row.plan_name_ms ?? 'Percuma',
    is_active: Boolean(row.is_active),
    source: (row.source as UserSubscriptionFeatures['source']) || 'free',
    invitation_chatbot_enabled: Boolean(row.invitation_chatbot_enabled),
    invitation_chat_daily_limit: Number(row.invitation_chat_daily_limit ?? 0),
    subscription_status: row.subscription_status ?? null,
    active_from: row.active_from ?? null,
    expires_at: row.expires_at ?? null,
    granted_features: Array.isArray(row.granted_features)
      ? row.granted_features.filter((item: unknown): item is string => typeof item === 'string')
      : [],
  };
}
