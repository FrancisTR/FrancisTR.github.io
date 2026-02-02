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
    currentPosition: "CRM Student Salesforce Intern",
    place: "University of St. Thomas",
    previousPositions: [""],
    description:
      ` Engaging with stakeholders to document issues, define project requirements, and implement solutions for various applications and
      pioneered the front-end development of interactive widgets with the collaboration of the Department of Admissions to 
      enhance the UI/UX of the college application system.`,
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
      `Led a team to develop video games for young audiences using Godot each month and 
      responsible for enhancing UI/UX design for the organization itch.io page 
      to attract more users for the monthly game jam.`,
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
      `Tutored Computer Science students for a one-on-one guidance to improve problem-solving skills 
      and assist students in coding assignments.`,
    skills: [
      "Python",
      "Problem-Solving",
      "Communication",
    ],
  },
];

export default function ExpCard() {
  return (
    <section id="experiences" className="scroll-mt-16 lg:mt-16">
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
            <CardHeader className="h-full w-full p-0">
              <CardTitle className="text-base text-slate-400 whitespace-nowrap">
                {job.timeline}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col p-0">
              <p className="text-primary font-bold">
                {job.currentPosition} @ {job.place}
              </p>
              {job.previousPositions.map((position, index) => (
                <p key={index} className="text-slate-400 text-sm font-bold">
                  {position}
                </p>
              ))}
              <CardDescription className="py-3 text-muted-foreground">
                {job.description}
              </CardDescription>
              <CardFooter className="p-0 flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <Badge key={index}>{skill}</Badge>
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