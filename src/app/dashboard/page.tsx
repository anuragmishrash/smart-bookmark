import { redirect } from "next/navigation";
import { getServerSupabaseClient } from "@/lib/auth";
import type { Bookmark } from "@/lib/types";
import DashboardShell from "@/components/DashboardShell";

export default async function DashboardPage() {
  const supabase = await getServerSupabaseClient();

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    redirect("/login");
  }

  const {
    data: bookmarks,
    error: bookmarksError,
  } = await supabase
    .from("bookmarks")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <DashboardShell
      user={session.user}
      initialBookmarks={(bookmarks ?? []) as Bookmark[]}
      initialError={bookmarksError?.message}
    />
  );
}

