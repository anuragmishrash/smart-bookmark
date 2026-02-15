"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Copy, ExternalLink } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import type { Bookmark } from "@/lib/types";
import toast from "react-hot-toast";

type BookmarkCardProps = {
  bookmark: Bookmark;
  onDeleted?: (bookmarkId: string) => void;
};

export default function BookmarkCard({ bookmark, onDeleted }: BookmarkCardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDelete = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    try {
      /* Optimistic delete — remove from UI immediately */
      if (onDeleted) {
        onDeleted(bookmark.id);
      }

      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("id", bookmark.id);
      if (error) {
        toast.error(error.message || "Unable to delete bookmark.");
        return;
      }
      toast.success("Bookmark removed.");
    } catch {
      toast.error("Unexpected error while deleting bookmark.");
    }
  }, [bookmark.id, onDeleted]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(bookmark.url);
      toast.success("URL copied to clipboard.");
    } catch {
      toast.error("Unable to copy URL.");
    }
  }, [bookmark.url]);

  let hostname = bookmark.url;
  try {
    const parsed = new URL(bookmark.url);
    hostname = parsed.hostname;
  } catch {
    // ignore, keep original string
  }

  const faviconUrl = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(
    hostname,
  )}&sz=64`;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.98 }}
      transition={{ duration: 0.16, ease: "easeOut" }}
      className="glass-panel card-hover flex flex-col rounded-3xl border border-slate-800/80 p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-1 items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={faviconUrl}
            alt={hostname}
            className="h-8 w-8 rounded-xl border border-slate-700/80 bg-slate-900/80 object-contain p-1"
          />
          <div className="min-w-0">
            <h3 className="truncate text-sm font-medium text-slate-50">
              {bookmark.title}
            </h3>
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-0.5 flex items-center gap-1 text-xs text-sky-300/90 hover:text-sky-200"
            >
              <span className="truncate">{hostname}</span>
              <ExternalLink className="h-3 w-3 shrink-0" />
            </a>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDelete}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/80 text-slate-400 transition hover:bg-red-500/10 hover:text-red-300"
          aria-label="Delete bookmark"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 text-[11px] text-slate-500">
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-2.5 py-1 text-[11px] text-slate-300 transition hover:bg-slate-800 hover:text-slate-50"
        >
          <Copy className="h-3 w-3" />
          Copy URL
        </button>
        <span suppressHydrationWarning>
          {mounted
            ? new Date(bookmark.created_at).toLocaleString(undefined, {
              month: "short",
              day: "numeric",
            })
            : ""}
        </span>
      </div>
    </motion.article>
  );
}
