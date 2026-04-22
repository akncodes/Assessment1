import { Pagination } from "@/components/Pagination";
import { PostCard } from "@/components/PostCard";
import { SearchBar } from "@/components/SearchBar";
import { hasSupabaseEnv } from "@/lib/env";
import { getPosts } from "@/services/posts";

interface HomeProps {
  searchParams: Promise<{ page?: string; q?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const page = Number(params.page ?? "1");
  const q = params.q ?? "";

  const feed = hasSupabaseEnv() ? await getPosts({ page, search: q }) : null;

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-10">
        <section className="rounded-3xl border border-black/10 bg-white p-6 md:p-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">Latest Posts</h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-(--ink-soft)">
            Discover new writing, AI summaries, and community comments in one clean feed.
          </p>
        </section>

        <section className="mt-8">
          <SearchBar />
        </section>

        {!hasSupabaseEnv() ? (
          <section className="mt-8 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-900">
            Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local to load live posts.
          </section>
        ) : null}

        <section className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {feed?.posts.map((post) => <PostCard key={post.id} post={post} />)}
        </section>

        {feed && feed.posts.length === 0 ? (
          <p className="mt-8 rounded-2xl border border-black/10 bg-white p-4 text-sm text-(--ink-soft)">
            {q ? "No posts match your search." : "No posts yet. Be the first to write one!"}
          </p>
        ) : null}

        {feed ? (
          <Pagination page={feed.page} total={feed.total} pageSize={feed.pageSize} query={q} />
        ) : null}
      </main>
    </div>
  );
}
