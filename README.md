# Smart Bookmark

A minimal, realtime bookmark manager built with **Next.js 15**, **Supabase**, and **Tailwind CSS v4**. Save, search, and organize your most important links — synced instantly across all open tabs.

**Live Demo:** [https://smart-bookmark-kohl.vercel.app/](https://smart-bookmark-kohl.vercel.app/)

## Features

- **Google OAuth** — Sign in with one click, no passwords
- **Realtime Sync** — Add or delete a bookmark in one tab, see it update everywhere instantly via Supabase Realtime
- **Search** — Filter bookmarks by title or URL in real time
- **Dark / Light Mode** — Premium glassmorphic dark theme and a clean, high-contrast light theme
- **Row-Level Security** — Each user can only see and manage their own bookmarks
- **Responsive** — Works on mobile, tablet, and desktop

## Technical Challenges & Solutions

During deployment to Vercel, we encountered and resolved several critical issues:

### 1. OAuth Redirect Loop on Vercel
**Problem:** Users would sign in with Google, but get redirected back to `/login` in an infinite loop.
**Cause:** Vercel sits behind a proxy (AWS ALB/Cloudflare), so `request.url` often reports `http` instead of `https`. Checks in `middleware.ts` for secure cookies failed because the protocol didn't match, causing the session to be dropped.
**Solution:** 
- Updated `auth/callback/route.ts` to respect the `x-forwarded-host` and `x-forwarded-proto` headers.
- Forced `https://` for redirect URLs when in production (`NODE_ENV === 'production'`).
- Explicitly appended `?next=/dashboard` to the OAuth flow to ensure consistent redirection.

### 2. Realtime Sync Latency & Reliability
**Problem:** `DELETE` events worked instantly, but `INSERT` events often failed to appear in other tabs in production, ensuring a poor user experience.
**Cause:** 
- `postgres_changes` listens to the database transaction log. Row-Level Security (RLS) policies apply *before* the event is emitted to the client.
- In some cases, the `INSERT` event was being filtered out or delayed significantly because the RLS policy check (checking user session) had a race condition with the event emission.
- `REPLICA IDENTITY FULL` was required for `DELETE` events to carry the `user_id`, otherwise they were silently ignored.
**Solution:**
- **Hybrid Sync Strategy:** We implemented a "Broadcast-First" approach.
- When a user adds a bookmark, the client **broadcasts** the data directly to other connected clients via the Supabase channel. This bypasses the database entirely for the immediate UI update (0ms latency).
- We kept the `postgres_changes` listener as a backup source of truth and for validation.
- Enabled `REPLICA IDENTITY FULL` on the `bookmarks` table to ensure `DELETE` events carry the necessary payload.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, Turbopack) |
| Auth | Supabase Auth (Google OAuth) |
| Database | Supabase PostgreSQL |
| Realtime | Supabase Realtime (Broadcast + Postgres Changes) |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Icons | Lucide React |
| Theme | next-themes |
| Notifications | react-hot-toast |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project with Google OAuth configured

### 1. Clone & Install

```bash
git clone https://github.com/anuragmishrash/smart-bookmark.git
cd smart-bookmark
npm install
```

### 2. Configure Environment

Copy the example env file and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Set Up the Database

Run the SQL in `supabase-schema.sql` in your Supabase SQL Editor. This creates the `bookmarks` table, indexes, and Row-Level Security policies.

**Important:** Run this SQL to enable robust Realtime sync:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;
ALTER TABLE bookmarks REPLICA IDENTITY FULL;
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository
3. Add the environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy — Vercel auto-detects Next.js

> **Important:** In your Supabase Auth settings, add your Vercel deployment URL (e.g. `https://smart-bookmark.vercel.app`) to the **Redirect URLs** list.

## Project Structure

```
├── middleware.ts          # Auth guard (redirect unauthenticated users)
├── src/
│   ├── app/
│   │   ├── layout.tsx     # Root layout (fonts, ThemeProvider, Toaster)
│   │   ├── globals.css    # Design system (dark + light themes)
│   │   ├── page.tsx       # Redirect to /login
│   │   ├── (auth)/login/  # Login page
│   │   └── dashboard/     # Dashboard page + loading skeleton
│   ├── components/
│   │   ├── DashboardShell.tsx  # Main dashboard (realtime logic + broadcast)
│   │   ├── Sidebar.tsx         # Navigation sidebar
│   │   ├── AddBookmark.tsx     # Add bookmark form
│   │   ├── BookmarkCard.tsx    # Bookmark card with actions
│   │   ├── LoginView.tsx       # Login UI
│   │   ├── RealtimeDebug.tsx   # Debug overlay tool
│   │   └── ThemeProvider.tsx   # next-themes wrapper
│   └── lib/
│       ├── supabaseClient.ts   # Browser Supabase client
│       ├── supabaseServer.ts   # Server Supabase client
│       └── types.ts            # TypeScript types
├── supabase-schema.sql    # Database schema + RLS policies
└── next.config.mjs        # Next.js configuration
```

## License

MIT
