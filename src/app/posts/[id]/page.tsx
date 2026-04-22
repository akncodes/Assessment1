import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CommentForm } from "@/components/CommentForm";
import { canComment, canEditPost, getCurrentUserProfile } from "@/lib/auth";
import { getPostById, getPostComments } from "@/services/posts";

interface PostPageProps {
  params: Promise<{ id: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;
  const [post, comments, profile] = await Promise.all([
    getPostById(id),
    getPostComments(id),
    getCurrentUserProfile(),
  ]);

  if (!post) {
    notFound();
  }

  const canEdit = profile ? canEditPost(profile.role, profile.id === post.author_id) : false;

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 md:px-6">
      <Link href="/" className="text-sm font-medium text-(--accent) hover:underline">
        Back to all posts
      </Link>
      <article className="mt-4 space-y-5 rounded-3xl border border-black/10 bg-white p-6 shadow-[0_12px_40px_rgba(31,41,55,0.08)]">
        {canEdit ? (
          <div className="flex justify-end">
            <Link
              href={`/dashboard/edit/${post.id}`}
              className="rounded-lg border border-black/20 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-foreground transition hover:bg-(--paper-strong)"
            >
              Edit Post
            </Link>
          </div>
        ) : null}
        <h1 className="text-4xl font-bold tracking-tight text-foreground">{post.title}</h1>
        {post.featured_image ? (
          <div className="relative h-80 w-full overflow-hidden rounded-2xl">
            <Image src={post.featured_image} alt={post.title} fill className="object-cover" />
          </div>
        ) : null}
        <p className="rounded-2xl border border-black/10 bg-background p-4 text-sm leading-7 text-(--ink-soft)">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-(--accent)">
            AI Summary
          </span>
          {post.summary}
        </p>
        <div className="prose max-w-none text-foreground">
          <p className="whitespace-pre-wrap leading-8">{post.content}</p>
        </div>
      </article>

      <section className="mt-8 space-y-4">
        <h2 className="text-2xl font-bold">Comments</h2>
        {profile && canComment(profile.role) ? <CommentForm postId={post.id} /> : null}
        {comments.length === 0 ? (
          <p className="rounded-2xl border border-black/10 bg-white p-4 text-sm text-(--ink-soft)">
            No comments yet. Start the conversation.
          </p>
        ) : null}
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="rounded-2xl border border-black/10 bg-white p-4">
              <p className="text-sm font-semibold text-foreground">{comment.author_name ?? "Unknown user"}</p>
              <p className="mt-2 text-sm leading-7 text-foreground">{comment.content}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.12em] text-(--ink-soft)">
                {new Date(comment.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
