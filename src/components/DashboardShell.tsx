"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import type { Bookmark } from "@/lib/types";
import type { User } from "@supabase/supabase-js";
import Sidebar from "@/components/Sidebar";
import AddBookmark from "@/components/AddBookmark";
import BookmarkCard from "@/components/BookmarkCard";
import RealtimeDebug from "@/components/RealtimeDebug";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, FolderOpenDot } from "lucide-react";
import toast from "react-hot-toast";

type DashboardShellProps = {
  user: User;
  initialBookmarks: Bookmark[];
  initialError?: string;
};

type DebugLog = {
  time: string;
  message: string;
  type: "info" | "success" | "error";
};

export default function DashboardShell({
  user,
  initialBookmarks,
  initialError,
}: DashboardShellProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("CONNECTING");
  const [logs, setLogs] = useState<DebugLog[]>([]);

  const addLog = (message: string, type: DebugLog["type"] = "info") => {
    setLogs((prev) => [
      {
        time: new Date().toLocaleTimeString().split(" ")[0], // HH:MM:SS
        message,
        type,
      },
      ...prev.slice(0, 49),
    ]);
  };

  useEffect(() => {
    if (initialError) {
      toast.error(initialError);
      addLog(`Initial Error: ${initialError}`, "error");
    }
  }, [initialError]);

  /* ─── Optimistic callbacks for child components ─── */
  const handleOptimisticInsert = useCallback((bookmark: Bookmark) => {
    setBookmarks((current) =>
      current.some((b) => b.id === bookmark.id)
        ? current
        : [bookmark, ...current],
    );
    addLog(`Optimistic add: ${bookmark.title}`, "info");
  }, []);

  const handleOptimisticDelete = useCallback((bookmarkId: string) => {
    setBookmarks((current) => current.filter((b) => b.id !== bookmarkId));
    addLog(`Optimistic delete: ${bookmarkId}`, "info");
  }, []);

  /* ─── Supabase Realtime subscription (cross‑tab sync) ─── */
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    addLog("Initializing subscription...", "info");

    // Use a unique channel per user to prevent collisions
    const channel = supabase
      .channel(`bookmarks-realtime-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bookmarks",
          // We rely on RLS. If this fails silently, logs will stay empty.
        },
        (payload) => {
          console.log("[Realtime] INSERT received", payload.new);
          addLog(`INSERT received: ${payload.new.title}`, "success");
          const newBookmark = payload.new as Bookmark;
          setBookmarks((current) =>
            current.some((b) => b.id === newBookmark.id)
              ? current
              : [newBookmark, ...current],
          );
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "bookmarks",
        },
        (payload) => {
          console.log("[Realtime] UPDATE received", payload.new);
          addLog(`UPDATE received: ${payload.new.title}`, "success");
          const updated = payload.new as Bookmark;
          setBookmarks((current) =>
            current.map((b) => (b.id === updated.id ? updated : b)),
          );
        },
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "bookmarks",
        },
        (payload) => {
          console.log("[Realtime] DELETE received", payload.old);
          addLog("DELETE received", "success");
          const oldBookmark = payload.old as { id: string };
          setBookmarks((current) =>
            current.filter((b) => b.id !== oldBookmark.id),
          );
        },
      )
      .subscribe((status, err) => {
        console.log("[Realtime] Subscription status:", status);
        setStatus(status);

        if (status === "SUBSCRIBED") {
          addLog("Subscribed to channel", "success");
        }
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || err) {
          console.error("[Realtime] Subscription error:", err);
          const msg = err?.message || "Unknown error";
          addLog(`Subscription Error: ${status} - ${msg}`, "error");
          toast.error(`Sync disconnected: ${status}`);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user.id]);

  const filteredBookmarks = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return bookmarks;
    return bookmarks.filter((b) => {
      const title = b.title.toLowerCase();
      const url = b.url.toLowerCase();
      return title.includes(query) || url.includes(query);
    });
  }, [bookmarks, search]);

  const hasBookmarks = bookmarks.length > 0;

  return (
    <div className="flex min-h-screen items-stretch justify-center px-4 py-6 md:px-6 md:py-8">
      <div className="flex w-full max-w-6xl gap-5 md:gap-6">
        <Sidebar user={user} />

        <main className="flex min-h-full flex-1 flex-col gap-4 rounded-3xl border border-slate-800/80 bg-slate-950/60 p-4 shadow-2xl shadow-black/50 backdrop-blur-2xl md:p-6">
          <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                <Sparkles className="h-3.5 w-3.5 text-sky-400" />
                <span>My Bookmarks</span>
              </div>
              <p className="mt-1 text-sm text-slate-400">
                A focused, realtime home for the links you revisit the most.
              </p>
            </div>

            <div className="mt-1 flex w-full max-w-xs items-center rounded-full border border-slate-800/80 bg-slate-900/70 px-3 py-1.5 text-xs text-slate-300 shadow-inner shadow-black/40">
              <Search className="mr-2 h-3.5 w-3.5 text-slate-500" />
              <input
                type="search"
                placeholder="Search by title or URL"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-xs text-slate-100 placeholder:text-slate-500 outline-none"
              />
            </div>
          </header>

          <section className="mt-2">
            <AddBookmark
              userId={user.id}
              onBookmarkAdded={handleOptimisticInsert}
            />
          </section>

          <section className="mt-3 flex-1 space-y-3 overflow-hidden">
            {!hasBookmarks ? (
              <EmptyState />
            ) : filteredBookmarks.length === 0 ? (
              <NoSearchResults />
            ) : (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                <AnimatePresence>
                  {filteredBookmarks.map((bookmark) => (
                    <BookmarkCard
                      key={bookmark.id}
                      bookmark={bookmark}
                      onDeleted={handleOptimisticDelete}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </section>
        </main>
      </div>

      {/* Debug Overlay */}
      <RealtimeDebug status={status} logs={logs} />
    </div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className="glass-panel flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-slate-800/80 px-6 py-10 text-center"
    >
      <div className="relative">
        <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-sky-500 via-cyan-400 to-violet-500 opacity-80 blur-md" />
        <div className="absolute inset-0 flex items-center justify-center">
          <FolderOpenDot className="h-8 w-8 text-slate-950" />
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-slate-50">
          Save your first bookmark to get started 🚀
        </p>
        <p className="text-xs text-slate-400">
          Drop in a link above — we&apos;ll keep it synced and ready whenever
          you come back.
        </p>
      </div>
    </motion.div>
  );
}

function NoSearchResults() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className="glass-panel flex flex-col items-center justify-center gap-3 rounded-3xl border border-slate-800/80 px-5 py-8 text-center"
    >
      <p className="text-sm font-medium text-slate-50">
        No bookmarks match your search.
      </p>
      <p className="text-xs text-slate-400">
        Try a different keyword, or clear the search box to see everything.
      </p>
    </motion.div>
  );
}

