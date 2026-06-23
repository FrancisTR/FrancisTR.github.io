"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, MailOpen, Github, Linkedin } from "lucide-react";
import { FaDev } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";

type NavItem = {
  name: string;
  href: string;
};

export default function Nav({
  showPicker,
  setShowPicker,
}: {
  showPicker: boolean;
  setShowPicker: (val: boolean) => void;
}) {
  const [activeSection, setActiveSection] = useState<string>("skills");

  // Scroll-position based active section logic
  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("section[id]")
    );

    const headerOffset = 96; // must match your sticky header height

    const onScroll = () => {
      requestAnimationFrame(() => {
        const scrollPos = window.scrollY + headerOffset + 1;

        let current = sections[0]?.id;

        for (const section of sections) {
          if (section.offsetTop <= scrollPos) {
            current = section.id;
          }
        }

        if (current) setActiveSection(current);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // initialize on load

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems: NavItem[] = [
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Experiences", href: "#experiences" },
    { name: "Blog", href: "#blog" },
  ];

  const getNavItemClasses = (href: string) => {
    const isActive = activeSection === href.substring(1);

    return {
      linkClass: isActive ? "active" : "",
      indicatorClass: `nav-indicator mr-4 h-px w-8 bg-slate-600 transition-all ${isActive
          ? "active w-16 bg-foreground h-2"
          : "group-hover:w-16 group-hover:bg-foreground group-hover:h-px"
        }`,
      textClass: `nav-text text-xs font-bold uppercase tracking-widest ${isActive
          ? "text-foreground"
          : "text-slate-500 group-hover:text-foreground"
        }`,
    };
  };

  return (
    <header className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-1/2 lg:flex-col lg:justify-between lg:py-20 flex flex-col lg:gap-4">
      <div className="flex flex-col gap-4 lg:pr-20 mt-2 px-6 lg:px-0 items-center lg:items-start text-center lg:text-start">
        <div className="flex w-full flex-col-reverse items-center justify-center gap-4 sm:w-auto sm:flex-row sm:gap-5 lg:justify-start">
          <h1 className="text-center text-4xl font-bold leading-tight drop-shadow-[0_0_15px_rgba(0,204,255,0.5)] sm:text-4xl lg:text-start">
            Francis Tran
          </h1>

          <div
            className="profile-image-ring h-10 w-10 sm:h-[3.25rem] sm:w-[3.25rem] md:h-16 md:w-16"
            aria-label="Profile image of Francis Tran"
          >
            <img
              src="/OGavatar.png"
              alt="Francis Tran"
              className="profile-image"
            />
          </div>
        </div>

        <h2 className="text-2xl shiny drop-shadow-[0_0_10px_rgba(206,245,255,0.6)] flex items-center gap-3">
          <span className="custom-cursor">Full-Stack Developer</span>
        </h2>

        <p className="text-lg text-muted-foreground">
          Software Engineering graduate from the University of St. Thomas with
          4+ years of overall professional experience.
        </p>

        <ul className="flex flex-wrap gap-4 mt-4 justify-center lg:justify-start">
          <a
            href="mailto:xst-tran6832@stthomas.edu"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              size="icon"
              className="relative group flex items-center justify-center overflow-hidden"
              aria-label="Email Francis Tran"
            >
              <div className="relative h-[1.2rem] w-[1.2rem] flex items-center justify-center">
                <Mail className="h-[1.2rem] w-[1.2rem] transition-all duration-300 opacity-100 group-hover:opacity-0 pointer-events-none" />
                <MailOpen className="h-[1.2rem] w-[1.2rem] absolute transition-all duration-300 opacity-0 group-hover:opacity-100 pointer-events-none" />
              </div>
            </Button>
          </a>

          <a
            href="https://github.com/FrancisTR"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="icon" aria-label="GitHub">
              <Github className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          </a>

          <a
            href="https://linkedin.com/in/francistran6832"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="icon" aria-label="LinkedIn">
              <Linkedin className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          </a>

          <a
            href="https://dev.to/francistrdev"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="icon" aria-label="Dev.to">
              <FaDev className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          </a>

          <a
            href="https://leetcode.com/u/FrancisTRdev/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="icon" aria-label="LeetCode">
              <SiLeetcode className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          </a>

          <div
            onClick={() => setShowPicker(!showPicker)}
            aria-label="Toggle holiday theme selector"
            className="group cursor-pointer"
          >
            <Button
              variant="outline"
              size="icon"
              className="relative group flex items-center justify-center overflow-visible"
            >
              <div
                className={`cube-button ${showPicker ? "opened" : ""}`}
                aria-hidden="true"
              >
                <div className="cube">
                  <span className="face front">🎉</span>
                  <span className="face back">🎄</span>
                  <span className="face right">🎃</span>
                  <span className="face left">🍀</span>
                  <span className="face top">🐣</span>
                  <span className="face bottom">❤️</span>
                </div>
              </div>
            </Button>
          </div>
        </ul>

        <nav className="lg:block hidden mt-4">
          <ul className="flex flex-col w-max text-start gap-6 uppercase text-xs font-medium">
            {navItems.map((item) => {
              const { linkClass, indicatorClass, textClass } =
                getNavItemClasses(item.href);

              return (
                <li key={item.name} className="group">
                  <a href={item.href} className={`py-3 ${linkClass}`}>
                    <span className={indicatorClass}></span>
                    <span className={textClass}>{item.name}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
