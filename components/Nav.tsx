"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, MailOpen, Github, Linkedin } from "lucide-react";
import { FaDev } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";

type NavItem = {
  name: string;
  href: string;
};

type RandomPokemon = {
  id: number;
  name: string;
  image: string;
};

function formatPokemonName(name: string) {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getRandomPokemonId() {
  /**
   * Current mainline Pokédex range.
   * If you want to include forms/variants too, you can increase this,
   * but 1-1025 keeps it to standard Pokémon.
   */
  const maxPokemonId = 1025;

  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return (array[0] % maxPokemonId) + 1;
  }

  return Math.floor(Math.random() * maxPokemonId) + 1;
}

export default function Nav({
  showPicker,
  setShowPicker,
}: {
  showPicker: boolean;
  setShowPicker: (val: boolean) => void;
}) {
  const [activeSection, setActiveSection] = useState<string>("skills");

  /**
   * Pokémon profile reveal state
   */
  const [isProfileCharging, setIsProfileCharging] = useState(false);
  const [hasProgressCompleted, setHasProgressCompleted] = useState(false);
  const [hasProfileEvolved, setHasProfileEvolved] = useState(false);

  const [randomPokemon, setRandomPokemon] = useState<RandomPokemon | null>(null);
  const [isPokemonLoading, setIsPokemonLoading] = useState(false);
  const [pokemonError, setPokemonError] = useState<string | null>(null);

  const fetchRandomPokemon = useCallback(async () => {
    if (hasProfileEvolved || isPokemonLoading || randomPokemon) return;

    try {
      setIsPokemonLoading(true);
      setPokemonError(null);

      const randomId = getRandomPokemonId();

      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${randomId}`
      );

      if (!response.ok) {
        throw new Error("Failed to catch Pokémon.");
      }

      const data = await response.json();

      const pokemonImage =
        data.sprites?.other?.["official-artwork"]?.front_default ||
        data.sprites?.other?.home?.front_default ||
        data.sprites?.front_default;

      if (!pokemonImage) {
        throw new Error("This Pokémon has no available sprite.");
      }

      setRandomPokemon({
        id: data.id,
        name: formatPokemonName(data.name),
        image: pokemonImage,
      });
    } catch (error) {
      console.error(error);
      setPokemonError("The Poké Ball shook... but nothing appeared.");
      setHasProgressCompleted(false);
      setIsProfileCharging(false);
    } finally {
      setIsPokemonLoading(false);
    }
  }, [hasProfileEvolved, isPokemonLoading, randomPokemon]);

  useEffect(() => {
    if (hasProgressCompleted && randomPokemon && !hasProfileEvolved) {
      setHasProfileEvolved(true);
      setIsProfileCharging(false);
    }
  }, [hasProgressCompleted, randomPokemon, hasProfileEvolved]);

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
      indicatorClass: `nav-indicator mr-4 h-px w-8 bg-slate-600 transition-all ${
        isActive
          ? "active w-16 bg-foreground h-2"
          : "group-hover:w-16 group-hover:bg-foreground group-hover:h-px"
      }`,
      textClass: `nav-text text-xs font-bold uppercase tracking-widest ${
        isActive
          ? "text-foreground"
          : "text-slate-500 group-hover:text-foreground"
      }`,
    };
  };

  const handleProfileMouseEnter = () => {
    if (hasProfileEvolved) return;

    setIsProfileCharging(true);
    void fetchRandomPokemon();
  };

  const handleProfileMouseLeave = () => {
    if (hasProfileEvolved) return;

    /**
     * If they leave before the progress finishes, reset it.
     * If the progress already completed, keep waiting for the PokeAPI fetch.
     */
    if (!hasProgressCompleted) {
      setIsProfileCharging(false);
    }
  };

  const profileImageSrc = hasProfileEvolved
    ? randomPokemon?.image || "/OGavatar.png"
    : "/GreatBall.png";

  const profileImageAlt = hasProfileEvolved && randomPokemon
    ? `Random Pokémon revealed: ${randomPokemon.name}`
    : "Poké Ball. Hover until the progress bar fills to reveal a random Pokémon.";

  return (
    <header className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-1/2 lg:flex-col lg:justify-between lg:py-20 flex flex-col lg:gap-4">
      <div className="flex flex-col gap-4 lg:pr-20 mt-2 px-6 lg:px-0 items-center lg:items-start text-center lg:text-start">
        <div className="flex w-full flex-col-reverse items-center justify-center gap-4 sm:w-auto lg:flex-row sm:gap-5 lg:justify-start">
          <h1 className="text-center text-5xl font-bold leading-tight drop-shadow-[0_0_15px_rgba(0,204,255,0.5)] sm:text-4xl lg:text-start">
            Francis Tran
          </h1>

          <div className="profile-catch-wrapper">
            <div
              className={`profile-image-ring h-10 w-10 lg:h-[4rem] lg:w-[4rem] ${
                isProfileCharging ? "profile-image-ring-charging" : ""
              } ${hasProfileEvolved ? "profile-image-ring-evolved" : ""}`}
              aria-label={profileImageAlt}
              onMouseEnter={handleProfileMouseEnter}
              onMouseLeave={handleProfileMouseLeave}
              onTransitionEnd={(event) => {
                /**
                 * Only trigger when the custom progress property finishes.
                 * This prevents transform or shadow transitions from evolving it.
                 */
                if (
                  !hasProfileEvolved &&
                  isProfileCharging &&
                  event.propertyName === "--profile-border-progress"
                ) {
                  setHasProgressCompleted(true);
                }
              }}
            >
              <img
                src={profileImageSrc}
                alt={profileImageAlt}
                className={`profile-image ${
                  hasProfileEvolved
                    ? "profile-image-pokemon"
                    : "profile-image-pokeball"
                }`}
                draggable={false}
              />

              {!hasProfileEvolved && isPokemonLoading && (
                <span className="profile-loading-dot" aria-hidden="true" />
              )}
            </div>

            {hasProfileEvolved && randomPokemon && (
              <span className="profile-catch-label">
                #{randomPokemon.id} {randomPokemon.name}
              </span>
            )}

            {!hasProfileEvolved && pokemonError && (
              <span className="profile-catch-error">{pokemonError}</span>
            )}
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
