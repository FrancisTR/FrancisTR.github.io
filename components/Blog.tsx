"use client";
import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { MoveUpRight, MoveRight } from "lucide-react";

type DevToUser = {
  name?: string
  username?: string
}
type DevBlog = {
  id: number
  title: string
  url: string
  user: DevToUser
  cover_image: string
  social_image: string
  published_timestamp: string
  positive_reactions_count: number
  description: string
}

export function formatDate(isoString: string | number | Date) {
  return new Date(isoString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const PINNED_TITLES: Record<string, string> = {
  "I used Google Gemini for the First Time. A Deep Analysis of my Experience so far! ✨": "🏆 Winner of the Google Gemini: Writing Challenge"
};

export default function Blog() {
  const [articles, setArticles] = useState<DevBlog[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Poll every 10s and ensure fresh data on GitHub Pages
    let isUnmounted = false;
    let currentController: AbortController | null = null;

    const fetchArticles = () => {
      // Abort any in-flight request before starting a new one (prevents overlaps on slow networks)
      currentController?.abort();
      currentController = new AbortController();

      const url = new URL('https://dev.to/api/articles');
      url.searchParams.set('username', 'francistrdev');
      url.searchParams.set('per_page', '1000'); // Get all posts
      url.searchParams.set('t', String(Date.now())); // cache-buster per request

      fetch(url.toString(), {
        cache: 'no-store',
        signal: currentController.signal,
      })
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then(data => {
          if (isUnmounted) return;
          setArticles(data);
          setError(null); // clear any prior error on success
          setLoading(false);
        })
        
        .catch(err => {
          if (isUnmounted) return;
          // Ignore abort errors during cleanup or rapid polling
          if ((err as any)?.name === 'AbortError') return;
          // Log transient errors; avoid flipping UI to "No Post yet!"
          console.error('Failed to fetch articles:', err);
          setLoading(false);
        });
    };

    // Initial load
    fetchArticles();

    return () => {
      isUnmounted = true;
      currentController?.abort();
    };
  }, []);

  if (loading) return (
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
            <div className="h-48 bg-muted rounded-lg mb-4"></div>
            <div className="h-6 bg-muted rounded mb-2"></div>
            <div className="h-4 bg-muted rounded mb-1 w-1/3"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </Card>
        ))}
      </div>
    </section>
  )

  if (error) return (
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
        <p className="text-muted-foreground mb-4">Unable to load blog posts at the moment.</p>
        <p className="text-sm text-muted-foreground">Please check back later or visit my Dev.to profile directly.</p>
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
  )

  // identify the most recent top 3 posts (by published date)
  const recentTop3Ids = [...articles]
    .sort((a, b) => new Date(b.published_timestamp).getTime() - new Date(a.published_timestamp).getTime())
    .slice(0, 3)
    .map(a => a.id);

  // ensure pinned posts appear at the top (stable ordering)
  const sortedArticles = articles
    .map((a, idx) => ({ a, idx, pin: !!PINNED_TITLES[a.title] }))
    .sort((x, y) => {
      if (x.pin === y.pin) return x.idx - y.idx; // preserve original order within groups
      return x.pin ? -1 : 1; // pinned first
    })
    .map(x => x.a);

  // show only recent (top 3) OR pinned
  const filteredArticles = sortedArticles.filter(
    a => recentTop3Ids.includes(a.id) || !!PINNED_TITLES[a.title]
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
        {filteredArticles.map(a => {
          const pinLabel = PINNED_TITLES[a.title]; // shows label of Pinned
          return (
            <a
              key={a.id}
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:cursor-pointer"
            >
              <Card
                // Make the image sit on TOP by keeping a vertical layout
                className="p-6 mb-8 w-full min-h-fit border border-transparent bg-background shadow-sm dark:bg-slate-900/80 flex flex-col gap-0 groupg:hover:bg-slate-800/50 lg:hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:hover:drop-shadow-lg lg:hover:bg-slate-100/50 lg:hover:border-t-cyan-200 transition-all duration-200"
                data-pinned={pinLabel ? 'true' : 'false'}
                aria-label={pinLabel ? `Pinned: ${pinLabel}` : undefined}
              >
                <CardHeader className="h-full w-full mb-4 p-0">
                  <img
                    src={(a.cover_image && a.cover_image.trim()) || a.social_image && a.social_image.trim() || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB2aWV3Qm94PSIwIDAgMTkyMCAxMDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiBmaWxsPSIjMTQxNDE0Ii8+Cjx0ZXh0IHg9Ijk2MCIgeT0iNTQwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNmI3MjgwIiBmb250LXNpemU9IjQ4IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZmlsbC1vcGFjaXR5PSIwLjUiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K"}
                    alt={`Cover image for ${a.title}`}
                    width={1920}
                    height={1080}
                    className="bg-[#141414] mt-2 border border-muted-foreground/20 w-full h-auto rounded-lg"
                    loading="eager"
                  />
                </CardHeader>
                <CardContent className="flex flex-col p-0 w-full flex-grow">
                  <div className="flex items-start justify-between mb-3">
                    <p className="text-lg text-primary font-bold leading-tight flex-1">
                      <span className="inline-flex items-center gap-2 flex-wrap align-middle">
                        {pinLabel && (
                          <span
                            className="inline-flex items-center gap-1 bg-amber-200/25 text-amber-700 dark:text-amber-300 ring-1 ring-amber-300/60 px-2 py-0.5 text-[11px] uppercase tracking-wide rounded-full"
                            title={pinLabel}
                            aria-label={`Pinned: ${pinLabel}`}
                          >{pinLabel}
                          </span>
                        )}
                        <span className="break-words">{a.title}</span>
                      </span>
                    </p>
                    <MoveUpRight className="text-primary font-bold ml-2 inline-block h-5 w-5 shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 motion-reduce:transition-none" />
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      📅 {formatDate(a.published_timestamp)}
                    </span>
                    <span className="flex items-center gap-1">
                      👍 {a.positive_reactions_count}
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
      <div className="mt-12 flex justify-center">
        <a
          className="inline-flex items-center font-medium leading-tight text-foreground hover:text-primary transition-colors group"
          href="https://dev.to/francistrdev" target="_blank"
          rel="noopener noreferrer"
        >
          <span className="border-b border-transparent pb-px transition hover:border-primary motion-reduce:transition-none">
            View All Posts
          </span>
          <MoveRight className="ml-1 inline-block h-5 w-5 shrink-0 -translate-y-px transition-transform group-hover:translate-x-2 group-focus-visible:translate-x-2 motion-reduce:transition-none" />
        </a>
      </div>
    </section>
  )
}