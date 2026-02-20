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
import { MoveUpRight } from "lucide-react";

const jobProjects = [
  {
    imagePath: "/ClassifierAI.png",
    title: "ClassifierAI",
    description:
      "A Google Chrome Extension that performs image classification to determine if the images are AI-generated in the google image tab.",
    skills: [
      "HTML",
      "CSS",
      "JavaScript",
      "Bootstrap",
      "ml5.js",
    ],
    link: "https://github.com/FrancisTR/ClassifierAI",
  },
  {
    imagePath: "/RhythmSwipe.png",
    title: "Rhythm Swipe",
    description:
      "A p5.js game where the goal is to collect all gems while following the beat of the music.",
    skills: [
      "HTML",
      "CSS",
      "JavaScript",
      "p5.js",
    ],
    link: "https://github.com/FrancisTR/Rhythm-Swipe",
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
    <section id="projects" className="scroll-mt-16 lg:mt-16">
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
          <a
            key={index}
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:cursor-pointer"
          >
            <Card className="group p-6 mb-8 flex flex-col lg:flex-row w-full min-h-fit gap-0 lg:gap-5 border-transparent hover:border dark:lg:hover:border-t-blue-900 dark:lg:hover:bg-slate-800/50 lg:hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:hover:drop-shadow-lg lg:hover:bg-slate-100/50 lg:hover:border-t-blue-200">
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
                  <MoveUpRight className="ml-1 inline-block h-5 w-5 shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 motion-reduce:transition-none" />
                </p>
                <CardDescription className="py-3 text-muted-foreground">
                  {project.description}
                </CardDescription>
                <CardFooter className="p-0 flex flex-wrap gap-2">
                  {project.skills.map((skill, index) => (
                    <Badge key={index}>{skill}</Badge>
                  ))}
                </CardFooter>
              </CardContent>
            </Card>
          </a>
        ))}
      </>
    </section>
  );
}
