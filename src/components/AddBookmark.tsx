"use client";

import { useCallback, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import type { Bookmark } from "@/lib/types";
import { Loader2, Plus, Link2 } from "lucide-react";
import toast from "react-hot-toast";

type AddBookmarkProps = {
  userId: string;
  onBookmarkAdded?: (bookmark: Bookmark) => void;
};

export default function AddBookmark({ userId, onBookmarkAdded }: AddBookmarkProps) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const validateUrl = (value: string) => {
    try {
      const parsed = new URL(value);
      return !!parsed.protocol && !!parsed.hostname;
    } catch {
      return false;
    }
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!url.trim() || !title.trim()) {
        toast.error("Please provide both URL and title.");
        return;
      }

      if (!validateUrl(url.trim())) {
        toast.error("Please enter a valid URL (including https://).");
        return;
      }

      setLoading(true);
      const supabase = getSupabaseBrowserClient();

      try {
        const { data, error } = await supabase
          .from("bookmarks")
          .insert({
            user_id: userId,
            url: url.trim(),
            title: title.trim(),
          })
          .select()
          .single();

        if (error) {
          toast.error(error.message || "Unable to add bookmark.");
          return;
        }

        /* Optimistic update — show it instantly */
        if (data && onBookmarkAdded) {
          onBookmarkAdded(data as Bookmark);
        }

        setUrl("");
        setTitle("");
        toast.success("Bookmark added.");
      } catch {
        toast.error("Unexpected error while adding bookmark.");
      } finally {
        setLoading(false);
      }
    },
    [title, url, userId, onBookmarkAdded],
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-panel card-hover flex flex-col gap-4 rounded-3xl border border-slate-800/80 p-4 md:p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-sky-400">
            New bookmark
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Paste a URL and give it a short, meaningful title.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 md:flex-row">
        <div className="flex-1 space-y-2">
          <label className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
            <Link2 className="h-3 w-3 text-sky-400" />
            URL
          </label>
          <input
            autoFocus
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="glass-input w-full rounded-2xl px-3 py-2.5 text-sm text-slate-100 outline-none"
          />
        </div>
        <div className="flex-1 space-y-2">
          <label className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Why this link is important"
            className="glass-input w-full rounded-2xl px-3 py-2.5 text-sm text-slate-100 outline-none"
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 text-[11px] text-slate-500">
        <span>Press Enter to save instantly.</span>
        <button
          type="submit"
          disabled={loading}
          className="pill-primary min-w-[130px] justify-center disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Plus className="h-3.5 w-3.5" />
              Add bookmark
            </>
          )}
        </button>
      </div>
    </form>
  );
}
