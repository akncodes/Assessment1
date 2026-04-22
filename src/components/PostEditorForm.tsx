"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface PostEditorFormProps {
  mode?: "create" | "edit";
  postId?: string;
  initialValues?: {
    title?: string;
    featuredImage?: string | null;
    content?: string;
  };
}

export function PostEditorForm({
  mode = "create",
  postId,
  initialValues,
}: PostEditorFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [featuredImage, setFeaturedImage] = useState(initialValues?.featuredImage ?? "");
  const [content, setContent] = useState(initialValues?.content ?? "");
  const [loading, setLoading] = useState(false);
  const [loadingLabel, setLoadingLabel] = useState("Generating summary...");
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      return;
    }

    setLoadingLabel(mode === "create" ? "Generating summary..." : "Saving updates...");
    const timer =
      mode === "create"
        ? window.setTimeout(() => {
            setLoadingLabel("Creating post...");
          }, 1400)
        : undefined;

    return () => {
      if (timer !== undefined) {
        window.clearTimeout(timer);
      }
    };
  }, [loading, mode]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim() || !content.trim()) {
      setMessage("Please add a title and content before publishing.");
      return;
    }

    setLoading(true);
    setMessage("");

    const endpoint = mode === "create" ? "/api/posts" : `/api/posts/${postId}`;
    const method = mode === "create" ? "POST" : "PATCH";

    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, featuredImage, content }),
    });

    const payload = (await response.json()) as { error?: string; postId?: string };

    if (!response.ok) {
      setMessage(payload.error ?? "Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    setMessage(mode === "create" ? "Post created with AI summary." : "Post updated successfully.");
    setLoading(false);
    if (mode === "create") {
      router.push(payload.postId ? `/posts/${payload.postId}` : "/dashboard");
    } else {
      router.push(postId ? `/posts/${postId}` : "/dashboard");
    }
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-3xl border border-black/10 bg-white p-6">
      <div>
        <label className="mb-1 block text-sm font-medium">Title</label>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="h-11 w-full rounded-xl border border-black/15 px-3"
          placeholder="Write a clear post title"
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Featured Image URL</label>
        <input
          value={featuredImage}
          onChange={(event) => setFeaturedImage(event.target.value)}
          className="h-11 w-full rounded-xl border border-black/15 px-3"
          placeholder="https://..."
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Content</label>
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          className="min-h-60 w-full rounded-xl border border-black/15 p-3"
          placeholder="Write your full post content here..."
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-foreground px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
      >
        {loading ? loadingLabel : mode === "create" ? "Publish Post" : "Save Changes"}
      </button>
      {message ? <p className="text-sm text-(--ink-soft)">{message}</p> : null}
    </form>
  );
}
