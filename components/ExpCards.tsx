"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoveRight } from "lucide-react";

const jobPositions = [
  {
    timeline: "May 2022 — Present",
    currentPosition: "CRM Salesforce Student Administrator",
    place: "University of St. Thomas",
    previousPositions: [""],
    description:
      `Collaborated with stakeholders to document requirements, define project scope, and implement solutions across various university applications. Led the development of interactive front-end widgets in partnership with the Admissions Department, enhancing the UI/UX of the college application system.`,
    skills: [
      "Salesforce",
      "HTML",
      "CSS",
      "JavaScript",
      "Jira",
      "UI/UX Design",
      "Agile",
      "Planning",
      "Leadership",
      "Testing & QA",
      "Git"
    ],
  },
  {
    timeline: "June 2024 — June 2025",
    currentPosition: "Software Developer",
    place: "Games For Love",
    previousPositions: [""],
    description:
      `Directed a team in developing monthly video games for children using Godot. Managed UI/UX improvements for the organization's itch.io platform to increase user engagement and participation in game jams.`,
    skills: [
      "Godot",
      "HTML",
      "CSS",
      "JavaScript",
      "Figma",
      "UI/UX Design",
      "Project Management",
      "Planning",
      "Leadership",
      "Testing & QA",
      "Git",
    ],
  },
  {
    timeline: "Feb 2022 — May 2022",
    currentPosition: "Computer Science Tutor",
    place: "University of St. Thomas",
    previousPositions: [""],
    description:
      `Provided personalized tutoring for Computer Science students, focusing on problem-solving techniques and coding assignments to support academic success.`,
    skills: [
      "Python",
      "Problem-Solving",
      "Communication",
    ],
  },
];

export default function ExpCard() {
  return (
    <section id="experiences" className="scroll-mt-16 lg:mt-16" data-section="experiences">
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-background/0 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="shiny text-xl font-bold uppercase tracking-widest lg:sr-only">
          Experience
        </h2>
      </div>
      <div className="flex flex-col gap-4 mb-8">
        <h2 className="shiny hidden text-3xl font-bold lg:block lg:text-start">
          Experience
        </h2>
      </div>
      <>
        {jobPositions.map((job, index) => (
          <Card
            key={index}
            className="p-6 mb-8 lg:flex-row w-full min-h-fit gap-0 lg:gap-5 border-transparent"
          >
            <CardHeader className="p-0 mb-4 border-l-2 border-primary pl-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                  {job.timeline}
                </span>
                <p className="text-lg lg:text-xl text-primary font-bold group-hover:text-primary transition-colors">
                  {job.currentPosition}
                </p>
                <p className="text-sm text-muted-foreground font-medium">
                  @ {job.place}
                </p>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <CardDescription className="py-3 text-muted-foreground leading-relaxed">
                {job.description}
              </CardDescription>
              <CardFooter className="p-0 flex flex-wrap gap-2 pt-3">
                {job.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </CardFooter>
            </CardContent>
          </Card>
        ))}
      </>
      <div className="mt-12 pl-6">
        <a
          className="inline-flex items-center font-medium leading-tight text-foreground group"
          href="/Francis_Tran_Resume.pdf" target="_blank"
        >
          <span className="border-b border-transparent pb-px transition hover:border-primary motion-reduce:transition-none">
            View Full Resume
          </span>
          <MoveRight className="ml-1 inline-block h-5 w-5 shrink-0 -translate-y-px transition-transform group-hover:translate-x-2 group-focus-visible:translate-x-2 motion-reduce:transition-none" />
        </a>
      </div>
    </section>
  );
}