"use client";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
    type: "Contributor",
    stars: "https://flat.badgen.net/github/stars/Forem/Forem",
    description:
      "Contributing to an open-source blogging platform, that powers dev.to, with over 22K stars and over 3+ millions users registered. Identifying and document low-visibility issues on GitHub, optimizing UI/UX and fixing bugs to enhance user experience. Over 10+ Pull Requests merged onto the Forem Respository within the first 3 months of contribution.",
    skills: [
      "Ruby on Rails",
      "HTML",
      "CSS",
      "TypeScript",
      "PostgreSQL",
    ],
    demoLink: "https://dev.to",
    repoLink: "https://github.com/forem/forem/pulls?q=author:FrancisTRAlt+is:merged",
    devtoLink: "https://dev.to/francistrdev/series/38569",
  },
  {
    imagePath: "/VirtualCoffee.webp",
    title: "Virtual Coffee",
    type: "Contributor",
    stars: "https://flat.badgen.net/github/stars/Virtual-Coffee/virtualcoffee.io",
    description:
      "Tech Community website that provides resources for 1,000 developers registered around the world with over 200 stars on GitHub. Contributing alongside with maintainers and developers to improve the UI/UX, and updating documentation during the migration process.",
    skills: [
      "HTML",
      "CSS",
      "TypeScript",
      "Next.js",
      "Tailwind CSS",
    ],
    demoLink: "https://virtualcoffee.io/",
    repoLink: "https://github.com/Virtual-Coffee/virtualcoffee.io/pulls?q=author:FrancisTRAlt+is:merged",
  },
  {
    imagePath: "/ClassifierAI.png",
    title: "ClassifierAI",
    type: "Personal Project",
    stars: "https://flat.badgen.net/github/stars/FrancisTR/ClassifierAI",
    description:
      "A Chrome extension that uses machine learning to perform Image and Text Classification to determine if the article is AI-Generated on dev.to.",
    skills: [
      "HTML",
      "CSS",
      "JavaScript",
      "Tailwind CSS",
      "Tensorflow.js",
      "Chart.js",
      "Vite",
    ],
    repoLink: "https://github.com/FrancisTR/ClassifierAI",
    devtoLink: "https://dev.to/devengers/two-devs-and-a-copilot-created-classifierai-a-prototype-chrome-extension-that-automatically-4fge",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="scroll-mt-16 lg:mt-16" data-section="projects">
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-background/0 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="shiny text-xl font-bold uppercase tracking-widest text-start lg:sr-only">
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
            className="relative overflow-hidden border border-border/60 bg-card/70 backdrop-blur shadow-md transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 group p-4 sm:p-6 mb-10 flex flex-col lg:flex-row w-full min-h-fit gap-6 lg:gap-8"
          >
            <div className="h-full w-full lg:w-1/3 mb-4 p-0 overflow-hidden rounded-lg flex justify-center max-w-sm mx-auto lg:max-w-none lg:mx-0">
              <Image
                src={project.imagePath}
                alt={`Screenshot of ${project.title}`}
                width={640}
                height={360}
                priority
                className="bg-[#141414] mt-2 border border-muted-foreground/20 rounded-lg overflow-hidden mx-auto will-change-transform backface-visibility-hidden"
              />
            </div>
            <div className="flex flex-col w-full lg:w-2/3">
              <CardHeader className="p-0 mb-4 border-l-4 border-primary pl-4">
                <div className="flex flex-col gap-2">
                  <CardTitle className="text-primary text-2xl font-bold">
                    {project.title}
                  </CardTitle>
                  <div className="inline-flex flex-col md:flex-row items-center justify-between gap-3 text-sm font-medium border border-primary/15 bg-primary/5 text-primary px-3 py-2 rounded-md">
                    <p>{project.type}</p>
                    <p>
                      {typeof project.stars === "string" && project.stars.startsWith("http") ? (
                        <Image 
                          src={project.stars} 
                          alt="GitHub Stars" 
                          width={16} 
                          height={16} 
                          className="w-auto h-7 block" 
                        />
                      ) : (
                        <span className="font-semibold">{project.stars}</span>
                      )}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <CardDescription className="py-4 text-muted-foreground leading-relaxed">
                  {project.description}
                </CardDescription>
                <div className="flex flex-wrap gap-3 mt-4">
                  {project.demoLink && (
                    <Button asChild size="sm">
                      <a href={project.demoLink} target="_blank" rel="noopener noreferrer" aria-label={`View project demo for ${project.title}`}>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Project
                      </a>
                    </Button>
                  )}
                  {project.repoLink ? (
                    <Button asChild variant="outline" size="sm">
                      <a href={project.repoLink} target="_blank" rel="noopener noreferrer" aria-label={`View GitHub repository for ${project.title}`}>
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
                      <a href={project.devtoLink} target="_blank" rel="noopener noreferrer" aria-label={`View article on Dev.to for ${project.title}`}>
                        <BookOpen className="mr-2 h-4 w-4" />
                        View on Dev.to
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-0 flex flex-wrap gap-2 pt-6">
                {project.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">{skill}</Badge>
                ))}
              </CardFooter>
            </div>
          </Card>
        ))}
      </>
    </section>
  );
}
