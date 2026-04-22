import Image from "next/image";
import Link from "next/link";

import type { BlogPost } from "@/types";

export function PostCard({ post }: { post: BlogPost }) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_12px_40px_rgba(31,41,55,0.08)] transition hover:-translate-y-1 hover:shadow-[0_16px_44px_rgba(31,41,55,0.12)]">
      {post.featured_image ? (
        <div className="relative h-56 w-full overflow-hidden">
          <Image
            src={post.featured_image}
            alt={post.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="h-56 bg-[linear-gradient(130deg,#f7c56f_0%,#f48b73_45%,#5db7de_100%)]" />
      )}
      <div className="space-y-4 p-5">
        <h2 className="line-clamp-2 text-xl font-bold tracking-tight text-foreground">
          <Link href={`/posts/${post.id}`} className="hover:underline">
            {post.title}
          </Link>
        </h2>
        <p className="line-clamp-4 text-sm leading-6 text-(--ink-soft)">{post.summary}</p>
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.16em] text-(--accent)">
            {new Date(post.created_at).toLocaleDateString()}
          </p>
          <Link
            href={`/posts/${post.id}`}
            className="rounded-lg border border-black/20 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-foreground transition hover:bg-(--paper-strong)"
          >
            Read More
          </Link>
        </div>
      </div>
    </article>
  );
}
