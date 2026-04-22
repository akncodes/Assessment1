import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function createComment(input: { postId: string; userId: string; content: string }) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    throw new Error("Supabase environment variables are missing.");
  }

  const { data, error } = await supabase
    .from("comments")
    .insert({
      post_id: input.postId,
      user_id: input.userId,
      content: input.content,
    })
    .select("id, post_id, user_id, content, created_at")
    .single();

  if (error) {
    throw error;
  }

  return data;
}
