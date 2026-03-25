import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import { config } from 'dotenv';

config(); // loads .env from project root

const app = express();
const PORT = process.env.API_PORT || 3002;
const LLM_PROVIDER_DEFAULTS = {
  novita: {
    baseUrl: 'https://api.novita.ai/openai',
    model: 'meta-llama/llama-3.1-8b-instruct',
  },
  alibaba: {
    baseUrl: 'https://coding-intl.dashscope.aliyuncs.com/v1',
    model: 'qwen-plus',
  },
  'ollama-cloud': {
    baseUrl: 'https://ollama.com/v1',
    model: 'kimi-k2.5:cloud',
  },
};

function getEnv(...keys) {
  for (const key of keys) {
    const value = process.env[key];
    if (value !== undefined && value !== '') {
      return value;
    }
  }

  return undefined;
}

// CORS - allow frontend
app.use(cors({
  origin: [process.env.APP_URL || 'https://jemput.neyobytes.com', 'http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}));

// Raw body for Stripe webhooks
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

// POST /api/chat - Proxies LLM chat requests (hides API key from browser)
app.post('/api/chat', async (req, res) => {
  const { messages, systemPrompt } = req.body;

  const provider = getEnv('LLM_PROVIDER', 'VITE_LLM_PROVIDER') || 'ollama-cloud';
  const providerDefaults = LLM_PROVIDER_DEFAULTS[provider] || LLM_PROVIDER_DEFAULTS['ollama-cloud'];
  const baseUrl = (getEnv('LLM_BASE_URL', 'VITE_LLM_BASE_URL') || providerDefaults.baseUrl).replace(/\/$/, '');
  const apiKey = getEnv('LLM_API_KEY', 'VITE_LLM_API_KEY');
  const model = getEnv('LLM_MODEL', 'VITE_LLM_MODEL') || providerDefaults.model;
  const maxTokens = parseInt(getEnv('LLM_MAX_TOKENS', 'VITE_LLM_MAX_TOKENS') || '512', 10);
  const temperature = parseFloat(getEnv('LLM_TEMPERATURE', 'VITE_LLM_TEMPERATURE') || '0.7');

  try {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (apiKey) {
      headers.Authorization = `Bearer ${apiKey}`;
    }

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        max_tokens: maxTokens,
        temperature,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: err });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || 'Maaf, tiada respons.';
    res.json({ content });
  } catch (err) {
    res.status(500).json({ error: 'LLM request failed' });
  }
});

// POST /api/stripe/checkout - Creates a Stripe checkout session
app.post('/api/stripe/checkout', async (req, res) => {
  const { planId, invitationId, userId, priceId, email } = req.body;

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  if (!process.env.STRIPE_SECRET_KEY) return res.status(500).json({ error: 'Stripe not configured' });

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'payment', // one-time, NOT subscription
      success_url: `${process.env.APP_URL || 'https://jemput.neyobytes.com'}/dashboard/subscription?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL || 'https://jemput.neyobytes.com'}/pricing?canceled=true`,
      customer_email: email,
      metadata: { user_id: userId, invitation_id: invitationId, plan_id: planId },
    });

    res.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/stripe/webhook - Handles Stripe webhook events
app.post('/api/stripe/webhook', async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).json({ error: 'Webhook signature failed' });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const { user_id, invitation_id, plan_id } = session.metadata;

      // Update invitation payment status and expiry via Supabase REST API
      // Using service role key for server-side operations
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (supabaseUrl && supabaseServiceKey) {
        // Get plan duration
        const planRes = await fetch(`${supabaseUrl}/rest/v1/plans?id=eq.${plan_id}&select=duration_days`, {
          headers: { 'apikey': supabaseServiceKey, 'Authorization': `Bearer ${supabaseServiceKey}` },
        });
        const plans = await planRes.json();
        const durationDays = plans[0]?.duration_days || 60;

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + durationDays);

        // Update invitation
        await fetch(`${supabaseUrl}/rest/v1/invitations?id=eq.${invitation_id}`, {
          method: 'PATCH',
          headers: {
            'apikey': supabaseServiceKey,
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify({
            payment_status: 'paid',
            expires_at: expiresAt.toISOString(),
          }),
        });

        // Record payment
        await fetch(`${supabaseUrl}/rest/v1/payments`, {
          method: 'POST',
          headers: {
            'apikey': supabaseServiceKey,
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id,
            invitation_id,
            plan_id,
            amount: session.amount_total / 100,
            currency: session.currency || 'myr',
            stripe_session_id: session.id,
            stripe_payment_intent_id: session.payment_intent,
            status: 'succeeded',
          }),
        });
      }
      break;
    }
    case 'payment_intent.payment_failed': {
      console.log('Payment failed:', event.data.object.id);
      break;
    }
  }

  res.json({ received: true });
});

// POST /api/stripe/portal - Creates Stripe billing portal
app.post('/api/stripe/portal', async (req, res) => {
  const { customerId } = req.body;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.APP_URL}/dashboard/subscription`,
    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/health
app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'jemput-api' }));

app.listen(PORT, () => console.log(`Jemput API running on port ${PORT}`));
