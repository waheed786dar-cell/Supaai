# Lumina AI Chat · Setup Guide

A production-ready AI chat SaaS built with Next.js + Tailwind CSS + Supabase.

---

## 🚀 Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase-schema.sql`
3. Go to **Project Settings → API** and copy your URL and anon key

### 3. Configure environment

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4. Connect an AI provider (server-side)

Open `pages/api/chat.ts` and uncomment one of the sections:

**Option A: OpenAI**
```env
OPENAI_API_KEY=sk-...
```

**Option B: Anthropic**
```env
ANTHROPIC_API_KEY=sk-ant-...
```

> ⚠️ These keys go in `.env.local` ONLY — never in frontend code.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
├── pages/
│   ├── index.tsx          # Redirect to /chat or /login
│   ├── login.tsx          # Login page (password + magic link)
│   ├── register.tsx       # Registration page
│   ├── chat.tsx           # Main chat interface
│   ├── upgrade.tsx        # Pricing/upgrade page
│   └── api/
│       └── chat.ts        # 🔒 AI API proxy (keeps key server-side)
├── components/            # (Add shared components here)
├── hooks/
│   └── useAuth.ts         # Auth state management
├── lib/
│   └── supabase.ts        # Supabase browser client
├── styles/
│   └── globals.css        # Global styles + CSS variables
├── supabase-schema.sql    # Database schema — run in Supabase
├── .env.example           # Environment variable template
└── tailwind.config.js     # Theme configuration
```

---

## 🔐 Security Notes

- AI API keys are **server-side only** in `pages/api/chat.ts`
- Supabase uses Row Level Security (RLS) — users can only access their own data
- Supabase anon key is safe to expose (it's designed to be public)
- Auth state is managed via Supabase's secure JWT tokens

---

## 💳 Adding Real Payments

The upgrade page is UI-only. To add real payments:

1. Create a [Stripe](https://stripe.com) or [LemonSqueezy](https://lemonsqueezy.com) account
2. Create a product/price
3. Add payment API keys to `.env.local` (server-side)
4. Create `pages/api/create-checkout.ts` to generate checkout sessions
5. Add a webhook handler to update `profiles.plan` to `'pro'` after payment
6. Update the button in `pages/upgrade.tsx` to call your checkout API

---

## 🎨 Design System

The app uses a dark ink/parchment theme with CSS variables defined in `styles/globals.css`.
Key variables:
- `--accent` → Ember orange (#e8851a)
- `--bg-primary` → Deep ink (#0d0b08)
- `--text-primary` → Warm white (#f0ebe3)
- `--border` → Dark border (#3d3428)

Fonts:
- Display: Georgia (serif) for headings
- Body: DM Sans
- Mono: JetBrains Mono for code

---

## 📦 Deploy

```bash
npm run build
```

Deploy to [Vercel](https://vercel.com) for best Next.js support:

```bash
npx vercel
```

Add all environment variables in the Vercel dashboard.
