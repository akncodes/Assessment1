import { NextRequest, NextResponse } from "next/server";

import { canComment, getCurrentUserProfile } from "@/lib/auth";
import { createComment } from "@/services/comments";

export async function POST(request: NextRequest) {
  const profile = await getCurrentUserProfile();

  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!canComment(profile.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as { postId?: string; content?: string };

  const postId = body.postId?.trim() ?? "";
  const content = body.content?.trim() ?? "";

  if (!postId || !content) {
    return NextResponse.json({ error: "Missing postId or content" }, { status: 400 });
  }

  try {
    const comment = await createComment({ postId, userId: profile.id, content });
    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create comment";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
