"use client";
import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { MoveUpRight } from "lucide-react";

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
      url.searchParams.set('per_page', '3'); // Show the top 3 recent
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
        {/* Show the top 3 post in the portfolio */}
        {articles.map(a => (
          <a
            key={a.id}
            href={a.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:cursor-pointer"
          >
            <Card className="group p-6 mb-8 flex flex-col lg:flex-row w-full min-h-fit gap-0 lg:gap-5 border-transparent hover:border dark:lg:hover:border-t-blue-900 dark:lg:hover:bg-slate-800/50 lg:hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:hover:drop-shadow-lg lg:hover:bg-slate-100/50 lg:hover:border-t-blue-200">
              <CardHeader className="h-full w-full lg:w-1/3 mb-4 p-0">
                <img
                  src={(a.cover_image && a.cover_image.trim()) || "./Fallback.png"}
                  alt={`Screenshot of ${a.title}`}
                  width={1920}
                  height={1080}
                  className="bg-[#141414] mt-2 border border-muted-foreground w-full h-auto"
                  loading="eager"
                />
              </CardHeader>
              <CardContent className="flex flex-col p-0 w-full lg:w-2/3">
                <p className="text-lg text-primary font-bold">
                  {a.title}{" "}
                  <MoveUpRight className="ml-1 inline-block h-5 w-5 shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 motion-reduce:transition-none" />
                </p>
                <p className="text-sm text-primary">Date Published: <span className='text-white'>{formatDate(a.published_timestamp)}</span></p>
                <p className="text-sm text-muted-foreground">👍{a.positive_reactions_count}</p>
                <CardDescription className="py-3 text-muted-foreground">
                  {a.description}
                </CardDescription>
              </CardContent>
            </Card>
          </a>
        ))}
      </>
    </section>
  )
}