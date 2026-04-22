import { NextRequest, NextResponse } from "next/server";

import { canEditPost, getCurrentUserProfile } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

interface Context {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, context: Context) {
  const profile = await getCurrentUserProfile();

  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase environment variables are missing." }, { status: 503 });
  }

  const { data: existingPost } = await supabase
    .from("posts")
    .select("id, author_id")
    .eq("id", id)
    .single();

  if (!existingPost) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  if (!canEditPost(profile.role, existingPost.author_id === profile.id)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as {
    title?: string;
    content?: string;
    featuredImage?: string;
    summary?: string;
  };

  const updates = {
    title: body.title,
    content: body.content,
    featured_image: body.featuredImage,
    summary: body.summary,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("posts").update(updates).eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
