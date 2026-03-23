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
  "I used Google Gemini for the First Time. A Deep Analysis of my Experience so far! ✨": "⭐ Winner of the Google Gemini: Writing Challenge"
};

export default function Blog() {
  const [articles, setArticles] = useState<DevBlog[]>([])
  const [error, setError] = useState<string | null>(null)

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
        })
        .catch(err => {
          if (isUnmounted) return;
          // Ignore abort errors during cleanup or rapid polling
          if ((err as any)?.name === 'AbortError') return;
          // Log transient errors; avoid flipping UI to "No Post yet!"
          console.error('Failed to fetch articles:', err);
        });
    };

    // Initial load
    fetchArticles();
    // Poll every 10 seconds
    const intervalId = setInterval(fetchArticles, 10_000);

    return () => {
      isUnmounted = true;
      clearInterval(intervalId);
      currentController?.abort();
    };
  }, []);

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
      <p>No posts yet. Come back later!</p>
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
      <>
        {filteredArticles.map(a => {
          const pinLabel = PINNED_TITLES[a.title]; // shows label if the title is pinned
          const isRecentTop3 = recentTop3Ids.includes(a.id);
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
                className="group p-6 mb-8 flex flex-col w-full min-h-fit gap-0 border-transparent hover:border dark:lg:hover:border-t-cyan-900 dark:lg:hover:bg-slate-800/50 lg:hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:hover:drop-shadow-lg lg:hover:bg-slate-100/50 lg:hover:border-t-cyan-200"
                data-pinned={pinLabel ? 'true' : 'false'}
                aria-label={pinLabel ? `Pinned: ${pinLabel}` : undefined}
              >
                <CardHeader className="h-full w-full mb-4 p-0">
                  <img
                    src={(a.cover_image && a.cover_image.trim()) || "./Fallback.png"}
                    alt={`Screenshot of ${a.title}`}
                    width={1920}
                    height={1080}
                    className="bg-[#141414] mt-2 border border-muted-foreground w-full h-auto"
                    loading="eager"
                  />
                </CardHeader>
                <CardContent className="flex flex-col p-0 w-full">
                  <p className="text-lg text-primary font-bold">
                    <span className="inline-flex items-center gap-2 flex-wrap align-middle">
                      {pinLabel && (
                        <span
                          className="inline-flex items-center gap-1 bg-amber-200/25 text-amber-700 dark:text-amber-300 ring-1 ring-amber-300/60 px-2 py-0.5 text-[11px] uppercase tracking-wide"
                          title={pinLabel}
                          aria-label={`Pinned: ${pinLabel}`}
                        >
                          {pinLabel}
                        </span>
                      )}
                      <span className="break-words">{a.title}</span>
                    </span>
                  </p>
                  <p className="text-sm text-primary">
                    <span className='text-white'>📅 {formatDate(a.published_timestamp)} 👍{a.positive_reactions_count}</span>
                  </p>
                  <CardDescription className="py-3 text-muted-foreground">
                    {a.description}
                  </CardDescription>
                </CardContent>
                <MoveUpRight className="text-primary font-bold ml-1 inline-block h-5 w-5 shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 motion-reduce:transition-none" />
              </Card>
            </a>
          );
        })}
      </>
      <div className="mt-12 pl-6">
        <a
          className="inline-flex items-center font-medium leading-tight text-foreground group"
          href="https://dev.to/francistrdev" target="_blank"
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