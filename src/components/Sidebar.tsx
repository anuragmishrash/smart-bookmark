"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { useTheme } from "next-themes";
import {
  LogOut,
  Moon,
  Sun,
  BookmarkIcon,
  Sparkles,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";
import toast from "react-hot-toast";

type SidebarProps = {
  user: User;
};

export default function Sidebar({ user }: SidebarProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message || "Unable to log out.");
        return;
      }
      router.push("/login");
    } catch {
      toast.error("Unexpected error during logout. Please try again.");
    }
  }, [router]);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  const displayName =
    (user.user_metadata?.full_name as string | undefined) ||
    user.email?.split("@")[0] ||
    "User";

  const avatarUrl =
    (user.user_metadata?.avatar_url as string | undefined) ?? null;

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside className="glass-panel flex h-full w-full max-w-[240px] flex-col justify-between rounded-3xl border border-slate-800/80 p-4">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-cyan-400 to-violet-500 shadow-lg shadow-sky-500/40">
            <BookmarkIcon className="h-4 w-4 text-slate-950" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-50">
              Smart Bookmark
            </p>
            <p className="text-[11px] text-slate-400">Personal workspace</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-3 text-xs text-slate-400 shadow-inner shadow-black/40">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-sky-400" />
            <p className="font-medium text-slate-200">
              My Bookmarks, in sync
            </p>
          </div>
          <p className="mt-2 text-[11px] leading-relaxed">
            Organize your most important URLs with realtime updates across all
            your tabs.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={toggleTheme}
          className="pill-ghost w-full justify-between"
        >
          <span className="flex items-center gap-2 text-xs">
            {!mounted ? (
              <>
                <Sun className="h-3.5 w-3.5 text-amber-300" />
                <span>Theme</span>
              </>
            ) : theme === "dark" ? (
              <>
                <Sun className="h-3.5 w-3.5 text-amber-300" />
                <span>Light mode</span>
              </>
            ) : (
              <>
                <Moon className="h-3.5 w-3.5 text-sky-200" />
                <span>Dark mode</span>
              </>
            )}
          </span>
          <span className="text-[11px] text-slate-400">Toggle</span>
        </button>

        <div className="flex items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-900/80 px-3 py-2.5">
          <div className="flex items-center gap-2">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={displayName}
                className="h-7 w-7 rounded-full border border-slate-700 object-cover"
              />
            ) : (
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-[11px] font-semibold text-slate-200">
                {initials}
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-xs font-medium text-slate-100">
                {displayName}
              </span>
              <span className="text-[11px] text-slate-500 truncate max-w-[120px]">
                {user.email}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-800/80 text-slate-300 transition hover:bg-slate-700 hover:text-slate-50"
            aria-label="Log out"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
