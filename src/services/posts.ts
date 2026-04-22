import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { BlogPost, Comment, PaginatedPosts } from "@/types";

export const PAGE_SIZE = 6;

export async function getPosts(params: { page?: number; search?: string }): Promise<PaginatedPosts> {
  const page = Math.max(1, params.page ?? 1);
  const search = params.search?.trim() ?? "";
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return {
      posts: [],
      total: 0,
      page,
      pageSize: PAGE_SIZE,
    };
  }

  let query = supabase
    .from("posts")
    .select("id, title, content, summary, featured_image, author_id, created_at, updated_at", {
      count: "exact",
    })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (search) {
    query = query.ilike("title", `%${search}%`);
  }

  const { data, count } = await query;

  return {
    posts: (data ?? []) as BlogPost[],
    total: count ?? 0,
    page,
    pageSize: PAGE_SIZE,
  };
}

export async function getPostById(postId: string) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { data } = await supabase
    .from("posts")
    .select("id, title, content, summary, featured_image, author_id, created_at, updated_at")
    .eq("id", postId)
    .single();

  return (data as BlogPost | null) ?? null;
}

export async function getPostComments(postId: string) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return [];
  }

  const { data } = await supabase
    .from("comments")
    .select("id, post_id, user_id, content, created_at")
    .eq("post_id", postId)
    .order("created_at", { ascending: false });

  const comments = (data ?? []) as Comment[];
  const userIds = [...new Set(comments.map((item) => item.user_id))];
  if (userIds.length === 0) {
    return comments;
  }

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, display_name, email")
    .in("id", userIds);

  const authorById = new Map<string, string>();
  for (const profile of profiles ?? []) {
    const name = (profile.display_name as string | null)?.trim();
    const email = (profile.email as string | null)?.trim();
    authorById.set(profile.id as string, name || email || "Unknown user");
  }

  return comments.map((item) => ({
    ...item,
    author_name: authorById.get(item.user_id) ?? "Unknown user",
  }));
}
