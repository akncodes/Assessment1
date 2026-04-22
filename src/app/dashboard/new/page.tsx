import Link from "next/link";

import { PostEditorForm } from "@/components/PostEditorForm";
import { canCreatePost, getCurrentUserProfile } from "@/lib/auth";

export default async function NewPostPage() {
  const profile = await getCurrentUserProfile();

  if (!profile) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-10 md:px-6">
        <h1 className="text-3xl font-bold tracking-tight">Create Post</h1>
        <p className="mt-3 text-[var(--ink-soft)]">You need to login first.</p>
      </main>
    );
  }

  if (!canCreatePost(profile.role)) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-10 md:px-6">
        <h1 className="text-3xl font-bold tracking-tight">Create Post</h1>
        <p className="mt-3 text-[var(--ink-soft)]">Only authors and admins can create posts.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 md:px-6">
      <div className="mb-6">
        <Link href="/dashboard" className="text-sm font-medium text-[var(--accent)] hover:underline">
          Back to Dashboard
        </Link>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Create New Post</h1>
      </div>
      <PostEditorForm />
    </main>
  );
}
