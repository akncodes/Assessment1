import { NextRequest, NextResponse } from "next/server";

import { canCreatePost, getCurrentUserProfile } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { generatePostSummary } from "@/services/ai";
import { getPosts } from "@/services/posts";

export async function GET(request: NextRequest) {
  const page = Number(request.nextUrl.searchParams.get("page") ?? "1");
  const q = request.nextUrl.searchParams.get("q") ?? "";
  const payload = await getPosts({ page, search: q });

  return NextResponse.json(payload);
}

export async function POST(request: NextRequest) {
  const profile = await getCurrentUserProfile();

  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!canCreatePost(profile.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as {
    title?: string;
    featuredImage?: string;
    content?: string;
  };

  const title = body.title?.trim() ?? "";
  const content = body.content?.trim() ?? "";
  const featuredImage = body.featuredImage?.trim() || null;

  if (!title || !content) {
    return NextResponse.json({ error: "Title and content are required." }, { status: 400 });
  }

  const summary = await generatePostSummary(content);

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase environment variables are missing." }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("posts")
    .insert({
      title,
      content,
      summary,
      featured_image: featuredImage,
      author_id: profile.id,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ postId: data.id }, { status: 201 });
}
