"use client";
import { useEffect, useState } from 'react'
import Image from "next/image";
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
  description: string
}

export default function Blog() {
  const [articles, setArticles] = useState<DevBlog[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('https://dev.to/api/articles?username=francistrdev&per_page=3') // Show the top 3 recent
      .then(res => res.json())
      .then(setArticles)
      .catch(err => setError(String(err)))
  }, [])


  if (error) return <p>No Post yet!</p>
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
          // <div key={a.id}>
          //   <h3>{a.title}</h3>
          //   <p>by {a.user.name || a.user.username}</p>
          //   <a href={a.url} target="_blank" rel="noreferrer">Read →</a>
          // </div>
          <a
            key={a.id}
            href={a.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:cursor-pointer"
          >
            <Card className="group p-6 mb-8 flex flex-col lg:flex-row w-full min-h-fit gap-0 lg:gap-5 border-transparent hover:border dark:lg:hover:border-t-blue-900 dark:lg:hover:bg-slate-800/50 lg:hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:hover:drop-shadow-lg lg:hover:bg-slate-100/50 lg:hover:border-t-blue-200">
              <CardHeader className="h-full w-full lg:w-1/3 mb-4 p-0">
                <Image
                  src={a.cover_image?.trim() || "./Fallback.png"}
                  alt={`Screenshot of ${a.title}`}
                  width={1920}
                  height={1080}
                  priority
                  className="bg-[#141414] mt-2 border border-muted-foreground rounded-[0.5rem]"
                />
              </CardHeader>
              <CardContent className="flex flex-col p-0 w-full lg:w-2/3">
                <p className="text-primary font-bold">
                  {a.title}{" "}
                  <MoveUpRight className="ml-1 inline-block h-5 w-5 shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 motion-reduce:transition-none" />
                </p>
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