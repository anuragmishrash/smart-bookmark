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

    // Determine where to redirect after login (default to /dashboard)
    // We explicitly append ?next=/dashboard to the callback URL
    const origin = window.location.origin;
    const redirectTo = `${origin}/auth/callback?next=/dashboard`;

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
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
    <div className="flex min-h-screen w-full flex-col md:grid md:grid-cols-2">
      {/* Left Panel: Feature Showcase */}
      <div className="relative flex flex-col justify-between overflow-hidden bg-slate-900 p-8 text-slate-50 md:p-12 lg:p-16">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute -left-[10%] -top-[10%] h-[50vw] w-[50vw] rounded-full bg-sky-500/20 blur-[120px]" />
          <div className="absolute -bottom-[10%] -right-[10%] h-[50vw] w-[50vw] rounded-full bg-purple-500/10 blur-[120px]" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
        </div>

        {/* Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 shadow-lg shadow-sky-500/30">
            <BookmarkIcon className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-white">
            Smart Bookmark
          </span>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 my-auto space-y-8">
          <h1 className="max-w-md text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
            Focus on the links that{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">
              matter most.
            </span>
          </h1>
          <p className="max-w-sm text-lg text-slate-400">
            A minimal, intelligent workspace for your most important URLs. Syncs
            instantly across every device you own.
          </p>

          <div className="flex flex-wrap gap-3">
            {[
              "Realtime Sync",
              "Instant Search",
              "Dark Mode",
              "Privacy First",
            ].map((feature) => (
              <span
                key={feature}
                className="rounded-full border border-sky-500/40 bg-sky-500/10 px-4 py-1.5 text-sm font-medium text-sky-100 backdrop-blur-sm"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex items-center gap-2 text-xs text-slate-500">
          <Sparkles className="h-3.5 w-3.5 text-sky-500" />
          <span>Powered by Vercel, Supabase & Next.js 15</span>
        </div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="flex flex-col items-center justify-center bg-slate-50 p-6 dark:bg-slate-950 md:p-12">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Sign in to access your personal workspace
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleSignIn}
              className="flex w-full items-center justify-center gap-3 rounded-full bg-slate-900 px-8 py-3.5 text-sm font-medium text-white transition-transform hover:scale-[1.02] hover:bg-slate-800 active:scale-[0.98] dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>
            <p className="text-center text-xs text-slate-500">
              By clicking continue, you agree to our{" "}
              <a href="#" className="underline hover:text-slate-700 dark:hover:text-slate-300">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="underline hover:text-slate-700 dark:hover:text-slate-300">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
