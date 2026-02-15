"use client";

import { useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { LogIn, Sparkles, BookmarkIcon } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginView() {
  const searchParams = useSearchParams();

  const handleSignIn = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        toast.error(error.message || "Unable to sign in with Google.");
      }
    } catch {
      toast.error("Unexpected error during sign in. Please try again.");
    }
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 md:flex-row md:items-stretch">
        <div className="glass-panel relative flex flex-1 flex-col justify-between rounded-3xl p-8 md:p-10">
          <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-sky-500/20 via-transparent to-purple-500/10 opacity-80" />
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500/90 shadow-lg shadow-sky-500/40">
              <BookmarkIcon className="h-5 w-5 text-slate-950" />
            </div>
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">
                Smart Bookmark
              </p>
              <p className="text-xs text-slate-500">
                Minimal realtime bookmark workspace
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-10 space-y-6">
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-slate-50 md:text-5xl">
              Save links that{" "}
              <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
                actually matter
              </span>
              .
            </h1>
            <p className="max-w-md text-sm leading-relaxed text-slate-400 md:text-base">
              One clean, realtime board for your most important links. Built
              with Next.js, Supabase, and a design that feels like a modern
              SaaS product.
            </p>

            <div className="flex flex-wrap gap-3 text-xs text-slate-400">
              <Badge>Google-only sign in</Badge>
              <Badge>Row-level security</Badge>
              <Badge>Live across tabs</Badge>
            </div>
          </div>

          <div className="relative z-10 mt-10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <div className="flex -space-x-2">
                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-sky-500 to-cyan-400" />
                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-purple-500 to-sky-500" />
              </div>
              <span>Designed for focused, fast workflows.</span>
            </div>
            <Sparkles className="h-5 w-5 text-sky-400/80" />
          </div>
        </div>

        <div className="glass-panel relative flex w-full max-w-md flex-1 flex-col justify-between rounded-3xl p-8 md:p-10">
          <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-b from-white/5 via-transparent to-sky-500/10" />
          <div className="relative z-10 space-y-8">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-slate-50">
                Login to your workspace
              </h2>
              <p className="text-xs text-slate-400">
                Use your Google account to access your personal bookmark board.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSignIn}
              className="pill-primary w-full justify-center"
            >
              <LogIn className="h-4 w-4" />
              Continue with Google
            </button>

            <p className="text-[11px] leading-relaxed text-slate-500">
              By continuing, you agree that{" "}
              <span className="text-slate-300">
                each bookmark is stored securely per account using Supabase row
                level security
              </span>{" "}
              — only you can see or manage your own links.
            </p>
          </div>

          <div className="relative z-10 mt-8 flex items-center justify-between text-[11px] text-slate-500">
            <span>No passwords. Just Google.</span>
            <span className="text-slate-400">
              Built with{" "}
              <span className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
                Next.js + Supabase
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-sky-500/40 bg-sky-500/10 px-3 py-1 text-[11px] text-sky-100 shadow-sm shadow-sky-500/20">
      {children}
    </span>
  );
}
