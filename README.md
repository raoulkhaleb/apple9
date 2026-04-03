# Apple 9

A full-stack international student services platform. Apple 9 helps students discover universities worldwide, apply with a streamlined payment flow, manage visa documentation, explore scholarships, book flights, and get AI-powered admissions counseling — all in one place.

---

## Features

- **College Directory** — Browse and filter 20+ universities across 13+ countries; apply for $3 via Stripe
- **Scholarships** — Explore active scholarship programs with deadlines, amounts, and eligibility filters
- **Visa Assistance** — Multi-step document upload (PDF/JPG/PNG) to Supabase Storage + $5 service fee
- **Flights** — Kiwi.com affiliate widget with email enquiry fallback
- **AI Counselor** — Streaming chat powered by Claude (`claude-sonnet-4-6`), auth-gated
- **Internal Messaging** — Student ↔ admin messaging with admin broadcast capability
- **Admin Dashboard** — Finance, users, applications, visa requests, media & partnerships management
- **Role-based access** — STUDENT, ADMIN, MEDIA_DIRECTOR with middleware + server-side checks

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (CSS-based config via `@theme`) |
| Database | PostgreSQL via Supabase |
| ORM | Prisma |
| Auth | NextAuth.js v5 (Credentials provider, PrismaAdapter, JWT) |
| Payments | Stripe Checkout (hosted, webhook fulfillment) |
| Storage | Supabase Storage (signed upload URLs) |
| AI | Anthropic Claude API (streaming SSE) |
| Email | Resend |
| Fonts | Syne 800 (headings) + DM Sans 300/400/500 (body) |
| Deployment | Vercel |

---

## Prerequisites

- **Node.js** 18 or later
- **npm** 9 or later
- A **Supabase** project (free tier works) — [supabase.com](https://supabase.com)
- A **Stripe** account (test mode) — [stripe.com](https://stripe.com)
- A **Resend** account with a verified sending domain — [resend.com](https://resend.com)
- An **Anthropic API key** — [console.anthropic.com](https://console.anthropic.com)
- *(Optional)* A **Kiwi.com** affiliate ID for the flight widget — [partners.kiwi.com](https://partners.kiwi.com)

---

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourname/apple9.git
cd apple9
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in all required values. See the comments in `.env.example` for where to find each value.

### 4. Set up the database

Run Prisma migrations against your Supabase database (uses `DIRECT_URL`):

```bash
npx prisma migrate dev --name init
```

Generate the Prisma client:

```bash
npx prisma generate
```

### 5. Seed demo data

Creates 3 demo accounts, 20 colleges, 8 scholarships, and 3 partnerships:

```bash
npx prisma db seed
```

**Demo accounts:**

| Email | Password | Role |
|-------|----------|------|
| admin@apple9.com | admin123456 | ADMIN |
| media@apple9.com | media123456 | MEDIA_DIRECTOR |
| student@example.com | student123456 | STUDENT |

### 6. Create the Supabase storage bucket

In your Supabase dashboard go to **Storage** and create a bucket named `visa-documents`. Set it to **private** (not public).

### 7. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 8. Set up Stripe webhooks (local testing)

Install the [Stripe CLI](https://stripe.com/docs/stripe-cli), then in a separate terminal:

```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

The CLI will print a webhook signing secret — copy it into `STRIPE_WEBHOOK_SECRET` in `.env.local`.

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | Supabase pooler URL with `?pgbouncer=true` |
| `DIRECT_URL` | ✅ | Supabase direct URL for Prisma migrations |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase service role key (server-only) |
| `AUTH_SECRET` | ✅ | NextAuth secret (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | ✅ | Canonical app URL (e.g. `http://localhost:3000`) |
| `STRIPE_SECRET_KEY` | ✅ | Stripe secret key (`sk_test_...` or `sk_live_...`) |
| `STRIPE_WEBHOOK_SECRET` | ✅ | Stripe webhook signing secret (`whsec_...`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ✅ | Stripe publishable key |
| `ANTHROPIC_API_KEY` | ✅ | Anthropic API key for Claude |
| `RESEND_API_KEY` | ✅ | Resend API key for transactional email |
| `RESEND_FROM_EMAIL` | ✅ | Verified "from" address (e.g. `noreply@yourdomain.com`) |
| `NEXT_PUBLIC_URL` | ✅ | Public base URL (used in emails) |
| `NEXT_PUBLIC_KIWI_AFFILIATE_ID` | ⬜ | Kiwi.com affiliate ID (flight widget, optional) |

---

## Project Structure

```
apple9/
├── prisma/
│   ├── schema.prisma          # Database schema (15 models)
│   └── seed.ts                # Demo data seeder
├── src/
│   ├── app/                   # Next.js App Router pages & API routes
│   │   ├── admin/             # Admin dashboard (overview, finance, users, applications, visa, media, messages)
│   │   ├── ai-counseling/     # AI chat page
│   │   ├── apply/             # College directory + detail + success
│   │   ├── flights/           # Flight booking page
│   │   ├── messages/          # Inbox, compose, thread view
│   │   ├── scholarships/      # Scholarship listing + detail
│   │   ├── visa/              # Visa request wizard + success
│   │   ├── profile/           # User profile
│   │   └── api/               # All API route handlers
│   ├── components/
│   │   ├── layout/            # Navbar, Footer, AdminSidebar, Providers
│   │   └── ui/                # Button, Card, Input, Badge, Skeleton, Modal, PageHeader
│   ├── lib/                   # auth, prisma, stripe, supabase, resend, anthropic, utils
│   ├── middleware.ts           # Role-based route protection (Edge)
│   └── types/                 # NextAuth type augmentation
└── .env.example
```

---

## Deployment (Vercel)

### 1. Push to GitHub and connect to Vercel

Import the repository in the [Vercel dashboard](https://vercel.com/new).

### 2. Set all environment variables

In Vercel project settings → **Environment Variables**, add every variable from the table above with your production values.

Key differences from local:
- `NEXTAUTH_URL` → `https://yourdomain.vercel.app`
- `NEXT_PUBLIC_URL` → `https://yourdomain.vercel.app`
- Use Stripe **live** keys if going to production, or keep test keys for staging
- `DATABASE_URL` must use the Supabase **pooler** URL with `?pgbouncer=true`

### 3. Run database migrations on first deploy

After the first deploy, run migrations via the Vercel CLI or connect to your Supabase database directly:

```bash
npx dotenv-cli -e .env.production -- npx prisma migrate deploy
```

### 4. Register the Stripe production webhook

In **Stripe Dashboard → Developers → Webhooks**, add an endpoint:

- **URL:** `https://yourdomain.vercel.app/api/stripe/webhook`
- **Events:** `checkout.session.completed`, `checkout.session.expired`

Copy the signing secret into `STRIPE_WEBHOOK_SECRET` in Vercel.

### 5. Verify Resend sending domain

In **Resend Dashboard → Domains**, add and verify your domain's DNS records before sending production emails.

### 6. Seed production data (optional)

```bash
npx dotenv-cli -e .env.production -- npx prisma db seed
```

---

## Payment Flows

### College Application — $3

1. User clicks **Apply Now** on a college page
2. `POST /api/stripe/checkout` creates an `Application` (paymentStatus: UNPAID) + Stripe Checkout session
3. User completes payment on Stripe hosted page
4. Stripe fires `checkout.session.completed` webhook → `Application.paymentStatus` → PAID, `Transaction` created
5. User lands on `/apply/success`

### Visa Service — $5

1. User completes multi-step visa form (country, document upload, notes)
2. Documents are uploaded directly to Supabase Storage via server-issued signed URLs
3. `POST /api/stripe/checkout` creates a `VisaRequest` (paymentStatus: UNPAID) + Stripe session
4. Webhook fulfillment updates `VisaRequest.paymentStatus` → PAID
5. User lands on `/visa/success`

---

## Admin Roles

| Action | ADMIN | MEDIA_DIRECTOR |
|--------|-------|----------------|
| Overview dashboard | ✅ | ❌ |
| Finance / transactions | ✅ | ❌ |
| Manage users & roles | ✅ | ❌ |
| Review applications | ✅ | ❌ |
| Manage visa requests | ✅ | ❌ |
| Media & partnerships | ✅ | ✅ |
| Broadcast messages | ✅ | ❌ |

---

## License

MIT
