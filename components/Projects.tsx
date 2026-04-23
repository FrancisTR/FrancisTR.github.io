"use client";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, ExternalLink, Github } from "lucide-react";

type ProjectItem = {
  imagePath: string;
  title: string;
  type: string;
  stars: string;
  description: string;
  skills: string[];
  demoLink?: string;
  repoLink?: string;
  devtoLink?: string;
  repoPrivate?: boolean;
};

const jobProjects: ProjectItem[] = [
  {
    imagePath: "/Forem.png",
    title: "Forem (Dev.to)",
    type: "Open-Source Contributor",
    stars: "https://img.shields.io/github/stars/forem/forem?label=Stars&logo=github&style=for-the-badge&color=007ec6",
    description:
      "Contributed to Forem, an open-source blogging platform that powers communities like DEV.to. Implemented features and bug fixes to enhance platform functionality and user experience.",
    skills: [
      "HTML",
      "CSS",
      "JavaScript",
      "TypeScript",
      "Ruby on Rails",
      "Preact",
      "Redis",
      "PostgreSQL",
      "Sidekiq",
      "Puma",
    ],
    repoLink: "https://github.com/forem/forem/pulls?q=author:FrancisTRAlt+is:merged",
  },
  {
    imagePath: "/EasyPollVote.png",
    title: "EasyPollVote",
    type: "Personal Project",
    stars: "Private Repo",
    description:
      "A full stack Next.js application where users can create polls and share them without requiring an account. Results update in real time. Repo is currently private.",
    skills: [
      "HTML",
      "CSS",
      "TypeScript",
      "React",
      "Tailwind CSS",
      "Next.js",
      "Supabase",
    ],
    demoLink: "https://easypollvote.vercel.app/",
    devtoLink: "https://dev.to/francistrdev/series/38450",
  },
  {
    imagePath: "/ClassifierAI.png",
    title: "ClassifierAI",
    type: "Personal Project",
    stars: "https://img.shields.io/github/stars/FrancisTR/Classifierai?label=Stars&logo=github&style=for-the-badge&color=007ec6",
    description:
      "Built a Chrome extension that uses machine learning (ml5.js) to classify images in Google Images search results and detect AI-generated content. Utilizes Bootstrap for UI and integrates with browser APIs.",
    skills: [
      "HTML",
      "CSS",
      "JavaScript",
      "Bootstrap",
      "ml5.js",
    ],
    repoLink: "https://github.com/FrancisTR/ClassifierAI",
  },
  // {
  //   imagePath: "/UnknownProject.png",
  //   title: "PokeMarket",
  //   description:
  //     "A Full-Stack application that shows the values for each card in the market. Uses Machine Learning to predict the value of the card.",
  //   skills: [
  //     "Coming Soon",
  //   ],
  //   link: "",
  // },
  // {
  //   imagePath: "/UnknownProject.png",
  //   title: "Lunar Landing RL Research",
  //   description:
  //     "A research project to see which RL algorithms performs the fastest.",
  //   skills: [
  //     "Coming Soon",
  //   ],
  //   link: "",
  // },
];

export default function Projects() {
  return (
    <section id="projects" className="scroll-mt-16 lg:mt-16" data-section="projects">
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-background/0 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="shiny text-xl font-bold uppercase tracking-widest lg:sr-only">
          Projects
        </h2>
      </div>
      <div className="flex flex-col gap-4 mb-8">
        <h2 className="shiny hidden text-3xl font-bold lg:block lg:text-start">
          Projects
        </h2>
      </div>
      <>
        {jobProjects.map((project, index) => (
          <Card
            key={index}
            className="group p-6 mb-8 flex flex-col lg:flex-row w-full min-h-fit gap-0 lg:gap-5 border border-transparent bg-background shadow-sm dark:bg-slate-900/80"
          >
            <CardHeader className="h-full w-full lg:w-1/3 mb-4 p-0">
              <Image
                src={project.imagePath}
                alt={`Screenshot of ${project.title}`}
                width={1920}
                height={1080}
                priority
                className="bg-[#141414] mt-2 border border-muted-foreground"
              />
            </CardHeader>
            <CardContent className="flex flex-col p-0 w-full lg:w-2/3">
              <p className="text-primary font-bold">
                {project.title}{" "}
              </p>
              <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-sm font-medium bg-cyan-500/20 text-cyan-500 px-2 py-1 rounded">
                <p>{project.type}</p>
                <p>
                  {typeof project.stars === "string" && project.stars.startsWith("http") ? (
                    <img src={project.stars} alt="GitHub Stars" className="w-auto" />
                  ) : (
                    <span className="font-semibold">{project.stars}</span>
                  )}
                </p>
              </div>
              <CardDescription className="py-3 text-muted-foreground">
                {project.description}
              </CardDescription>
              <div className="flex flex-wrap gap-2 mt-4">
                {project.demoLink && (
                  <Button asChild size="sm">
                    <a href={project.demoLink} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Project
                    </a>
                  </Button>
                )}
                {project.repoLink ? (
                  <Button asChild variant="outline" size="sm">
                    <a href={project.repoLink} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" />
                      View Repo
                    </a>
                  </Button>
                ) : project.repoPrivate ? (
                  <span className="inline-flex items-center rounded-md border border-muted px-3 py-2 text-sm text-muted-foreground">
                    Repo Private
                  </span>
                ) : null}
                {project.devtoLink && (
                  <Button asChild variant="ghost" size="sm">
                    <a href={project.devtoLink} target="_blank" rel="noopener noreferrer">
                      <BookOpen className="mr-2 h-4 w-4" />
                      View on Dev.to
                    </a>
                  </Button>
                )}
              </div>
              <CardFooter className="p-0 flex flex-wrap gap-2 mt-5">
                {project.skills.map((skill, index) => (
                  <Badge key={index}>{skill}</Badge>
                ))}
              </CardFooter>
            </CardContent>
          </Card>
        ))}
      </>
    </section>
  );
}
