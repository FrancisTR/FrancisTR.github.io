"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { MoveUpRight, MoveRight } from "lucide-react";

type DevToUser = {
  name?: string;
  username?: string;
};

type DevBlog = {
  id: number;
  title: string;
  url: string;
  user: DevToUser;
  cover_image: string;
  social_image: string;
  published_timestamp: string;
  positive_reactions_count: number;
  description: string;
};

export function formatDate(isoString: string | number | Date) {
  return new Date(isoString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const PINNED_TITLES: Record<string, string> = {
  "I used Google Gemini for the First Time. A Deep Analysis of my Experience so far! ✨":
    `🏆 Winner of the "Google Gemini: Writing Challenge"`,
};

const FALLBACK_IMAGE =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB2aWV3Qm94PSIwIDAgMTkyMCAxMDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiBmaWxsPSIjMTQxNDE0Ii8+Cjx0ZXh0IHg9Ijk2MCIgeT0iNTQwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNmI3MjgwIiBmb250LXNpemU9IjQ4IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZmlsbC1vcGFjaXR5PSIwLjUiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K";

export default function Blog() {
  const [articles, setArticles] = useState<DevBlog[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isUnmounted = false;
    let currentController: AbortController | null = null;

    const fetchArticles = () => {
      currentController?.abort();
      currentController = new AbortController();

      const url = new URL("https://dev.to/api/articles");
      url.searchParams.set("username", "francistrdev");
      url.searchParams.set("per_page", "1000");
      url.searchParams.set("t", String(Date.now()));

      fetch(url.toString(), {
        cache: "no-store",
        signal: currentController.signal,
      })
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then((data: DevBlog[]) => {
          if (isUnmounted) return;
          setArticles(data);
          setError(null);
          setLoading(false);
        })
        .catch((err) => {
          if (isUnmounted) return;
          if ((err as any)?.name === "AbortError") return;

          console.error("Failed to fetch articles:", err);
          setError("Unable to load blog posts at the moment.");
          setLoading(false);
        });
    };

    fetchArticles();

    return () => {
      isUnmounted = true;
      currentController?.abort();
    };
  }, []);

  // Loading Skeleton
  if (loading)
    return (
      <section id="blog" className="scroll-mt-16 lg:mt-16">
        <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-background/0 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
          <h2 className="shiny text-xl font-bold uppercase tracking-widest lg:sr-only">
            Blog
          </h2>
        </div>

        <div className="flex flex-col gap-4 mb-8">
          <h2 className="shiny hidden text-3xl font-bold lg:block lg:text-start">
            Blog
          </h2>
        </div>

        <div className="space-y-8">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-48 bg-muted rounded-lg mb-4" />
              <div className="h-6 bg-muted rounded mb-2" />
              <div className="h-4 bg-muted rounded mb-1 w-1/3" />
              <div className="h-4 bg-muted rounded w-3/4" />
            </Card>
          ))}
        </div>
      </section>
    );

  // Error State
  if (error)
    return (
      <section id="blog" className="scroll-mt-16 lg:mt-16">
        <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-background/0 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
          <h2 className="shiny text-xl font-bold uppercase tracking-widest lg:sr-only">
            Blog
          </h2>
        </div>

        <div className="flex flex-col gap-4 mb-8">
          <h2 className="shiny hidden text-3xl font-bold lg:block lg:text-start">
            Blog
          </h2>
        </div>

        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            Unable to load blog posts at the moment.
          </p>
          <p className="text-sm text-muted-foreground">
            Please check back later or visit my Dev.to profile directly.
          </p>
          <a
            href="https://dev.to/francistrdev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center mt-4 text-primary hover:underline"
          >
            Visit Dev.to Profile <MoveRight className="ml-1 h-4 w-4" />
          </a>
        </div>
      </section>
    );

  // Identify most recent top 3 posts (by published date)
  const recentTop3Ids = [...articles]
    .sort(
      (a, b) =>
        new Date(b.published_timestamp).getTime() -
        new Date(a.published_timestamp).getTime()
    )
    .slice(0, 3)
    .map((a) => a.id);

  // Ensure pinned posts appear at the top (stable ordering)
  const sortedArticles = articles
    .map((a, idx) => ({ a, idx, pin: !!PINNED_TITLES[a.title] }))
    .sort((x, y) => {
      if (x.pin === y.pin) return x.idx - y.idx;
      return x.pin ? -1 : 1;
    })
    .map((x) => x.a);

  // Show only recent (top 3) OR pinned
  const filteredArticles = sortedArticles.filter(
    (a) => recentTop3Ids.includes(a.id) || !!PINNED_TITLES[a.title]
  );

  return (
    <section id="blog" className="scroll-mt-16 lg:mt-16" data-section="blog">
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-background/0 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="shiny text-xl font-bold uppercase tracking-widest lg:sr-only">
          Blog
        </h2>
      </div>

      <div className="flex flex-col gap-4 mb-8">
        <h2 className="shiny hidden text-3xl font-bold lg:block lg:text-start">
          Blog
        </h2>
      </div>

      <>
        {filteredArticles.map((a) => {
          const pinLabel = PINNED_TITLES[a.title];

          const imgSrc =
            (a.cover_image && a.cover_image.trim()) ||
            (a.social_image && a.social_image.trim()) ||
            FALLBACK_IMAGE;

          return (
            <a
              key={a.id}
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className="
                group block hover:cursor-pointer
                focus:outline-none
              "
            >
              <Card
                className="
                  relative overflow-hidden
                  p-6 mb-8 w-full min-h-fit
                  border border-border/60
                  bg-card/70 backdrop-blur
                  shadow-sm
                  transition-all duration-200
                  hover:-translate-y-0.5 hover:shadow-md
                  hover:border-primary/30
                  focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2
                  dark:bg-slate-900/60 dark:hover:bg-slate-900/60
                "
                data-pinned={pinLabel ? "true" : "false"}
                aria-label={pinLabel ? `Pinned: ${pinLabel}` : undefined}
              >
                {/* Subtle highlight on hover (no gray wash) */}
                <div
                  className="
                    pointer-events-none absolute inset-0
                    opacity-0 transition-opacity duration-200
                    group-hover:opacity-100
                    bg-gradient-to-r from-cyan-500/10 via-transparent to-transparent
                  "
                />

                <CardHeader className="h-full w-full mb-4 p-0 relative">
                  <img
                    src={imgSrc}
                    alt={`Cover image for ${a.title}`}
                    width={1920}
                    height={1080}
                    className="
                      bg-[#141414] mt-2
                      border border-muted-foreground/20
                      w-full h-auto rounded-lg
                    "
                    loading="lazy"
                  />
                </CardHeader>

                <CardContent className="flex flex-col p-0 w-full flex-grow relative">
                  <div className="flex items-start justify-between mb-3">
                    <p className="text-lg text-primary font-bold leading-tight flex-1">
                      <span className="inline-flex items-center gap-2 flex-wrap align-middle">
                        {pinLabel && (
                          <span
                            className="
                              inline-flex items-center gap-1
                              bg-amber-200/25 text-amber-700 dark:text-amber-300
                              ring-1 ring-amber-300/60 p-2 text-[11px] uppercase tracking-wide rounded-sm
                            "
                            title={pinLabel}
                            aria-label={`Pinned: ${pinLabel}`}
                          >
                            {pinLabel}
                          </span>
                        )}
                        <span className="break-words">{a.title}</span>
                      </span>
                    </p>

                    <MoveUpRight
                      className="
                        text-primary ml-2 inline-block h-5 w-5 shrink-0
                        transition-transform motion-reduce:transition-none
                        group-hover:-translate-y-1 group-hover:translate-x-1
                      "
                    />
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      📅 {formatDate(a.published_timestamp)}
                    </span>
                    <span className="flex items-center gap-1">
                      👍{a.positive_reactions_count}
                    </span>
                  </div>

                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {a.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </a>
          );
        })}
      </>

      <div className="mt-12 flex">
        <a
          className="inline-flex items-center font-medium leading-tight text-foreground hover:text-primary transition-colors group"
          href="https://dev.to/francistrdev"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="border-b border-transparent pb-px transition hover:border-primary motion-reduce:transition-none">
            View All Posts
          </span>
          <MoveRight className="ml-1 inline-block h-5 w-5 shrink-0 -translate-y-px transition-transform group-hover:translate-x-2 group-focus-visible:translate-x-2 motion-reduce:transition-none" />
        </a>
      </div>
    </section>
  );
}