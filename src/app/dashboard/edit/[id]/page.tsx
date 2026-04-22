import Link from "next/link";
import { notFound } from "next/navigation";

import { PostEditorForm } from "@/components/PostEditorForm";
import { canEditPost, getCurrentUserProfile } from "@/lib/auth";
import { getPostById } from "@/services/posts";

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const profile = await getCurrentUserProfile();
  if (!profile) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-10 md:px-6">
        <h1 className="text-3xl font-bold tracking-tight">Edit Post</h1>
        <p className="mt-3 text-(--ink-soft)">Please login to edit posts.</p>
      </main>
    );
  }

  const { id } = await params;
  const post = await getPostById(id);
  if (!post) {
    notFound();
  }

  if (!canEditPost(profile.role, profile.id === post.author_id)) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-10 md:px-6">
        <h1 className="text-3xl font-bold tracking-tight">Edit Post</h1>
        <p className="mt-3 text-(--ink-soft)">You do not have permission to edit this post.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 md:px-6">
      <div className="mb-6">
        <Link href="/dashboard" className="text-sm font-medium text-(--accent) hover:underline">
          Back to Dashboard
        </Link>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Edit Post</h1>
      </div>
      <PostEditorForm
        mode="edit"
        postId={post.id}
        initialValues={{
          title: post.title,
          featuredImage: post.featured_image,
          content: post.content,
        }}
      />
    </main>
  );
}
