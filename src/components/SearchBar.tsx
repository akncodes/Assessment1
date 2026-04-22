"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export function SearchBar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();

    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) {
      params.set("q", query.trim());
    } else {
      params.delete("q");
    }
    params.set("page", "1");
    router.push(`/?${params.toString()}`);
  };

  return (
    <form onSubmit={onSubmit} className="flex w-full gap-2">
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search posts..."
        className="h-11 w-full rounded-xl border border-black/15 bg-white px-4 text-sm text-foreground outline-none ring-offset-2 transition focus:ring-2 focus:ring-(--accent)"
      />
      <button
        type="submit"
        className="h-11 rounded-xl bg-(--accent) px-4 text-sm font-semibold text-white transition hover:brightness-110 active:translate-y-px"
      >
        Search
      </button>
    </form>
  );
}
