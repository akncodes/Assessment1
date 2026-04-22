import Link from "next/link";

import { getCurrentUserProfile, canCreatePost, canEditPost } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const profile = await getCurrentUserProfile();

  if (!profile) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-10 md:px-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-3 text-(--ink-soft)">Please login from the Auth page to manage posts.</p>
      </main>
    );
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-10 md:px-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-3 text-(--ink-soft)">
          Supabase environment variables are missing. Add them in .env.local to load dashboard data.
        </p>
      </main>
    );
  }

  let query = supabase
    .from("posts")
    .select("id, title, created_at, author_id")
    .order("created_at", { ascending: false })
    .limit(30);

  if (profile.role === "author") {
    query = query.eq("author_id", profile.id);
  }

  const { data: posts } = await query;

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 md:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-(--ink-soft)">
            Signed in as {profile.display_name} ({profile.role})
          </p>
        </div>
        {canCreatePost(profile.role) ? (
          <Link
            href="/dashboard/new"
            className="rounded-xl bg-foreground px-4 py-2 text-sm font-semibold text-white"
          >
            New Post
          </Link>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-(--paper-strong)">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {(posts ?? []).map((post) => (
              <tr key={post.id} className="border-t border-black/10">
                <td className="px-4 py-3">{post.title}</td>
                <td className="px-4 py-3">{new Date(post.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Link href={`/posts/${post.id}`} className="font-semibold text-(--accent) hover:underline">
                      Open
                    </Link>
                    {canEditPost(profile.role, post.author_id === profile.id) ? (
                      <Link href={`/dashboard/edit/${post.id}`} className="font-semibold text-foreground hover:underline">
                        Edit
                      </Link>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
