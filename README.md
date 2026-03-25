# Jemput - Kad Kahwin Digital

Jemput is a digital wedding invitation platform built for the Malaysian market. Couples can create beautiful, themed digital wedding cards (kad kahwin) complete with RSVP management, guest book, photo gallery, money gift (Salam Kaut) integration, countdown timer, Google Maps location, background music, and an AI-powered chatbot that answers guest questions about the event. The platform supports Stripe payments with tiered subscription plans and includes a full admin panel for platform management.

## Features

### Invitation Builder
- 8 professionally designed theme templates with Malay names
- Drag-and-drop section ordering with 18 section types
- Custom text, image, and video sections
- Islamic greeting (Salam Pembukaan) section
- Couple info with parent names and photo uploads
- Event details with date, time, and venue
- Itinerary / aturcara timeline
- Google Maps embed for venue location
- Contact list with WhatsApp links
- Background music (YouTube or direct URL)
- Cover photo and couple photo uploads
- Live preview before publishing
- Unique shareable URL via slug (`jemput.neyobytes.com/<slug>`)

### RSVP & Guest Management
- Public RSVP form for guests (no login required)
- Track attending/not attending with adult and child counts
- Guest messages and wishes
- RSVP deadline setting
- Export guest list to Excel (.xlsx)

### Guestbook
- Public guest book for wishes and messages
- Visible on the published invitation
- Owner can manage and delete entries

### Gallery
- Photo gallery with image uploads
- Drag-and-drop reordering
- Carousel display on published invitation
- 5MB per image limit (JPEG, PNG, WebP, GIF)

### Money Gift (Salam Kaut)
- Bank account details display
- QR code for DuitNow payments
- Account name and number display

### Countdown Timer
- Live countdown to the wedding date
- Displays days, hours, minutes, seconds

### Save the Date
- Add-to-calendar functionality
- Supports Google Calendar, Apple Calendar, Outlook

### AI Chatbot (Premium)
- AI-powered chatbot embedded in published invitations
- Answers guest questions about event details, dress code, parking, etc.
- Configurable context from the invitation owner
- Daily question quota per visitor (default: 20/day)
- Supports multiple LLM providers (Novita AI, Alibaba DashScope, Ollama)
- OpenAI-compatible API format

### Payments & Plans
- Stripe integration for one-time payments
- Tiered plans (Asas / Premium)
- 60-day active invitation duration
- Payment status tracking (free, paid, expired)

### Admin Panel
- Platform statistics (users, invitations, revenue)
- Plan management (create, edit, toggle active)
- User and invitation overview
- Payment history

### Dashboard
- User dashboard to manage all invitations
- Create, edit, publish, and delete invitations
- View RSVP statistics and guest list
- Export data to Excel

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 8 |
| UI Library | Mantine UI v8 |
| State Management | Zustand 5 |
| Backend / Auth / DB | Supabase (PostgreSQL, Auth, Storage) |
| Payments | Stripe |
| Animations | Framer Motion 12 |
| Routing | React Router v7 |
| Icons | Tabler Icons |
| Excel Export | xlsx (SheetJS) |
| Date Handling | Day.js |
| Carousel | Embla Carousel |
| Fonts | Playfair Display, Cormorant Garamond, Poppins |
| Web Server | Nginx + Let's Encrypt SSL |

## Quick Start

### Prerequisites

- Node.js 18+
- npm
- A Supabase project (free tier works)
- A Stripe account (for payments, optional for development)

### Installation

```bash
git clone https://github.com/hazrid93/neyobytes-jemput.git
cd neyobytes-jemput
npm install
```

### Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | Yes | Your Supabase project URL (e.g., `https://xxxx.supabase.co`) |
| `VITE_SUPABASE_ANON_KEY` | Yes | Supabase anonymous/public API key |
| `VITE_APP_URL` | Yes | Public URL of the app (e.g., `https://jemput.neyobytes.com`) |
| `VITE_STRIPE_PUBLISHABLE_KEY` | No | Stripe publishable key for payment integration |
| `LLM_PROVIDER` | No | Server-side LLM provider: `novita`, `alibaba`, or `ollama-cloud` |
| `LLM_MODEL` | No | Model name (e.g., `kimi-k2.5:cloud`) |
| `LLM_API_KEY` | No | API key for the LLM provider |
| `LLM_BASE_URL` | No | Base URL for the LLM API (OpenAI-compatible endpoint) |
| `LLM_MAX_TOKENS` | No | Maximum tokens per chatbot response (default: 2048) |
| `LLM_TEMPERATURE` | No | LLM temperature for response randomness (default: 0.7) |

The chatbot request is proxied through `server/index.js`, so the active LLM settings should be defined with `LLM_*` server-side environment variables. For backward compatibility, the server also accepts legacy `VITE_LLM_*` names if they already exist in your deployment.

### Development

```bash
npm run dev
```

The development server starts on the port configured by Vite (default: `http://localhost:5173`).

### Production Build

```bash
npm run build
```

The production build is output to the `dist/` directory, ready to be served by Nginx or any static file server.

## Post-Setup Guide

### 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase/migration.sql` -- this creates all tables, RLS policies, triggers, storage buckets, and seeds the default plans
3. Copy your **Project URL** and **anon key** from **Settings > API** into your `.env` file
4. Go to **Authentication > Providers** and ensure **Email** auth is enabled
5. (Optional) Customize email templates under **Authentication > Email Templates** for Malay language
6. The storage bucket `invitation-images` is created automatically by the migration. Verify it exists under **Storage**

### 2. DNS Configuration

1. Go to your DNS provider (e.g., Cloudflare)
2. Add an **A record**: `jemput` pointing to your server IP (e.g., `51.68.228.80`)
3. Set **Proxy status to OFF** (grey cloud) initially so that Certbot can generate SSL certificates via HTTP-01 challenge
4. After SSL is configured, you may enable the proxy if desired

### 3. Nginx & SSL

```bash
# Copy the Nginx config
sudo cp nginx/jemput.conf /etc/nginx/sites-available/jemput

# Enable the site
sudo ln -sf /etc/nginx/sites-available/jemput /etc/nginx/sites-enabled/jemput

# Generate SSL certificate
sudo certbot --nginx -d jemput.neyobytes.com

# Reload Nginx
sudo systemctl reload nginx
```

The Nginx config serves the Vite production build from `/home/debian/neyobytes-jemput/dist`, enables gzip compression, sets security headers, caches static assets for 1 year, and handles SPA routing by falling back to `index.html`.

### 4. Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com) (Malaysia region)
2. Create products and prices in the Stripe Dashboard:
   - **Asas (Basic)**: RM29 one-time payment
   - **Premium**: RM59 one-time payment
3. Copy the **Publishable Key** to `VITE_STRIPE_PUBLISHABLE_KEY` in your `.env`
4. Set the Stripe **Price IDs** in the admin panel or directly in the Supabase `plans` table (`stripe_price_id` column)
5. Configure a webhook endpoint: `https://jemput.neyobytes.com/api/stripe/webhook`
6. Subscribe to these webhook events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`

### 5. LLM Chatbot Setup

The AI chatbot uses an OpenAI-compatible API format. Supported providers:

| Provider | Base URL | Notes |
|----------|----------|-------|
| **Novita AI** | `https://api.novita.ai/openai` | Cloud-hosted, pay-per-token |
| **Alibaba DashScope** | `https://coding-intl.dashscope.aliyuncs.com/v1` | Cloud-hosted, international endpoint |
| **Ollama Cloud** | `https://ollama.com/v1` | Cloud-hosted Ollama Pro / team plans |

Configure via environment variables:

```env
LLM_PROVIDER=ollama-cloud
LLM_MODEL=kimi-k2.5:cloud
LLM_API_KEY=your_ollama_cloud_key_here
LLM_BASE_URL=https://ollama.com/v1
LLM_MAX_TOKENS=2048
LLM_TEMPERATURE=0.7
```

### 6. Admin Access

1. Register a normal user account through the app
2. In the Supabase **SQL Editor**, promote yourself to admin:

```sql
UPDATE public.profiles SET role = 'admin' WHERE email = 'your@email.com';
```

3. Access the admin panel at `/admin`

From the admin panel you can manage plans, view all users and invitations, track payments, and see platform statistics.

## Subscription Plans

| Feature | Asas (RM29) | Premium (RM59) |
|---------|:-----------:|:--------------:|
| All theme templates | Yes | Yes |
| RSVP management | Yes | Yes |
| Photo gallery & music | Yes | Yes |
| Money gift (Salam Kaut) | Yes | Yes |
| Excel export | Yes | Yes |
| Guestbook | Yes | Yes |
| Google Maps location | Yes | Yes |
| Save-to-calendar | Yes | Yes |
| WhatsApp sharing | Yes | Yes |
| AI Chatbot | No | Yes (20 q/day) |
| Custom sections | Limited | Unlimited |
| Priority support | No | Yes |
| Duration | 60 days | 60 days |

## Project Structure

```
neyobytes-jemput/
├── dist/                        # Production build output
├── nginx/
│   └── jemput.conf              # Nginx site configuration
├── public/                      # Static assets
├── src/
│   ├── assets/                  # Images and static resources
│   ├── components/
│   │   ├── common/              # Shared UI components
│   │   ├── dashboard/           # Dashboard widgets and views
│   │   ├── invitation/          # Invitation builder and viewer components
│   │   └── landing/             # Landing page sections
│   ├── lib/
│   │   ├── chatbot.ts           # LLM chatbot API integration
│   │   ├── demo-data.ts         # Demo invitation data
│   │   ├── export.ts            # Excel export utilities
│   │   ├── supabase.ts          # Supabase client initialization
│   │   ├── themes.ts            # Theme templates and section labels
│   │   └── upload.ts            # File upload utilities
│   ├── pages/
│   │   ├── AdminPage.tsx        # Admin panel
│   │   ├── DashboardPage.tsx    # User dashboard
│   │   ├── InvitationPage.tsx   # Public invitation viewer
│   │   ├── LandingPage.tsx      # Homepage / marketing page
│   │   ├── LoginPage.tsx        # Authentication (login/register)
│   │   └── PricingPage.tsx      # Pricing plans page
│   ├── stores/
│   │   ├── adminStore.ts        # Admin state (Zustand)
│   │   ├── authStore.ts         # Auth state (Zustand)
│   │   ├── dashboardStore.ts    # Dashboard state (Zustand)
│   │   ├── invitationStore.ts   # Invitation state (Zustand)
│   │   └── paymentStore.ts      # Payment state (Zustand)
│   ├── theme/                   # Mantine theme customization
│   ├── types/
│   │   └── index.ts             # All TypeScript type definitions
│   ├── App.tsx                  # Root component with routes
│   ├── main.tsx                 # Application entry point
│   └── index.css                # Global styles
├── supabase/
│   └── migration.sql            # Complete database schema
├── .env.example                 # Environment variable template
├── index.html                   # HTML entry point
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── postcss.config.cjs
└── eslint.config.js
```

## Available Theme Templates

| # | Theme ID | English Name | Malay Name (Nama) | Style |
|---|----------|-------------|-------------------|-------|
| 1 | `elegant-gold` | Elegant Gold | Emas Elegan | Warm gold on cream, classic luxury |
| 2 | `sage-garden` | Sage Garden | Taman Sage | Soft sage green, botanical elegance |
| 3 | `royal-navy` | Royal Navy | Biru Diraja | Deep navy with gold, regal |
| 4 | `blush-rose` | Blush Rose | Mawar Merah Jambu | Soft pink and rose gold, romantic |
| 5 | `midnight-luxe` | Midnight Luxe | Kemewahan Malam | Dark moody with gold, dramatic |
| 6 | `batik-heritage` | Batik Heritage | Warisan Batik | Earth tones, Malaysian cultural pride |
| 7 | `lavender-dream` | Lavender Dream | Mimpi Lavender | Soft purple and lilac, whimsical |
| 8 | `white-minimal` | White Minimal | Putih Minimalis | Clean white, modern minimalist |

Each theme includes a full color palette (primary, secondary, accent, background, text), font selections (display, body, Arabic), and an ornament style (classic, floral, geometric, minimal, or batik).

## Service Management

```bash
# Development
npm run dev              # Start Vite dev server
npm run lint             # Run ESLint

# Production
npm run build            # TypeScript check + Vite production build
npm run preview          # Preview the production build locally

# Server (production deployment)
sudo systemctl reload nginx      # Reload Nginx after config changes
sudo certbot renew               # Renew Let's Encrypt SSL certificates
sudo certbot renew --dry-run     # Test renewal without making changes
```

## Configuration Reference

### Editable Configurations

| What | Where | Notes |
|------|-------|-------|
| **Theme templates** | `src/lib/themes.ts` | Add or modify theme colors, fonts, and ornament styles |
| **Section types** | `src/lib/themes.ts` (`SECTION_LABELS`) | Add new section types with Malay labels and icons |
| **Subscription plans** | Admin panel (`/admin`) or Supabase `plans` table | Name, price, duration, features, chatbot limits |
| **Chatbot daily limit** | Admin panel or `plans.chatbot_daily_limit` column | Max questions per visitor per day (0 = unlimited) |
| **Default expiry** | Admin panel or `plans.duration_days` column | How many days an invitation stays active after payment |
| **LLM provider** | `.env` file (`LLM_*` variables) | Change provider, model, or API key; restart the API server |
| **Nginx config** | `nginx/jemput.conf` | Domain, SSL paths, caching, security headers |
| **Supabase schema** | `supabase/migration.sql` | Database tables, RLS policies, triggers, storage |

### Database Tables

| Table | Purpose |
|-------|---------|
| `profiles` | User profiles extending Supabase auth |
| `invitations` | Wedding invitation data and configuration |
| `rsvps` | Guest RSVP responses |
| `guestbook_messages` | Guest book entries |
| `gallery_images` | Photo gallery for invitations |
| `plans` | Subscription plan definitions |
| `payments` | Payment transaction records |
| `chatbot_usage` | AI chatbot daily quota tracking |

## License

Private project. All rights reserved.
