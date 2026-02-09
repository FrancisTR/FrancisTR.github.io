"use client";
import { Button } from "@/components/ui/button";
import { Mail, Github, Linkedin} from "lucide-react";
import { FaDev } from "react-icons/fa";
import useActiveSection from "@/hooks/useActiveSection";

type NavItem = {
  name: string;
  href: string;
};

export default function Nav() {
  const activeSection = useActiveSection([
    "skills",
    "experiences",
    "projects",
    "blog",
  ]);

  const navItems: NavItem[] = [
    { name: "Skills", href: "#skills" },
    { name: "Experiences", href: "#experiences" },
    { name: "Projects", href: "#projects" },
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
      <div className="flex flex-col gap-4 lg:pr-20 mt-2">
        <h1 className="text-5xl font-bold lg:text-start">
          Francis Tran
        </h1>
        <h2 className="text-2xl lg:text-start shiny custom-cursor">
          Full-Stack AI Engineer
        </h2>
        <p className="text-lg lg:text-start text-muted-foreground">
          Software Engineering graduate from the University of St. Thomas with 4+ years of overall experience.
        </p>
        <ul className="flex flex-row gap-6 mt-4">
          <a
            href="mailto:xst-tran6832@stthomas.edu"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="icon">
              <Mail className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          </a>
          <a
            href="https://github.com/FrancisTR"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="icon">
              <Github className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          </a>
          <a
            href="https://linkedin.com/in/francistran6832"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="icon">
              <Linkedin className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          </a>
          <a
            href="https://dev.to/francistrdev"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="icon">
              <FaDev className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          </a>
        </ul>
        <nav className="lg:block hidden mt-4">
          <ul className="flex flex-col w-max text-start gap-6 uppercase text-xs font-medium">
            {navItems.map((item: NavItem) => {
              const { linkClass, indicatorClass, textClass } = getNavItemClasses(
                item.href
              );
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
