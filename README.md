# Smart Bookmark

A minimal, realtime bookmark manager built with **Next.js 15**, **Supabase**, and **Tailwind CSS v4**. Save, search, and organize your most important links — synced instantly across all open tabs.

## Features

- **Google OAuth** — Sign in with one click, no passwords
- **Realtime Sync** — Add or delete a bookmark in one tab, see it update everywhere instantly via Supabase Realtime
- **Search** — Filter bookmarks by title or URL in real time
- **Dark / Light Mode** — Premium glassmorphic dark theme and a clean, high-contrast light theme
- **Row-Level Security** — Each user can only see and manage their own bookmarks
- **Responsive** — Works on mobile, tablet, and desktop

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, Turbopack) |
| Auth | Supabase Auth (Google OAuth) |
| Database | Supabase PostgreSQL |
| Realtime | Supabase Realtime (postgres_changes) |
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

### 4. Enable Realtime

In your Supabase dashboard, go to **Database → Replication** and ensure the `bookmarks` table has Realtime enabled for `INSERT`, `UPDATE`, and `DELETE`.

### 5. Run Locally

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
│   │   ├── DashboardShell.tsx  # Main dashboard (realtime subscription)
│   │   ├── Sidebar.tsx         # Navigation sidebar
│   │   ├── AddBookmark.tsx     # Add bookmark form
│   │   ├── BookmarkCard.tsx    # Bookmark card with actions
│   │   ├── LoginView.tsx       # Login UI
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
