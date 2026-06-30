"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, MailOpen, Github, Linkedin } from "lucide-react";
import { FaDev } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import PokemonProfile from "./PokemonProfile";

type NavItem = {
  name: string;
  href: string;
};

type Pokemon = {
  id: number;
  name: string;
  image?: string;
};

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
  const [randomPokemon, setRandomPokemon] = useState<Pokemon | null>(null);
  const [isPokemonLoading, setIsPokemonLoading] = useState(false);
  const [pokemonError, setPokemonError] = useState<string | null>(null);

  /**
   * Refs prevent stale state inside event handlers/callbacks.
   */
  const isProfileChargingRef = useRef(false);
  const hasProgressCompletedRef = useRef(false);
  const hasProfileEvolvedRef = useRef(false);
  const randomPokemonRef = useRef<Pokemon | null>(null);
  const isPokemonLoadingRef = useRef(false);
  const hasRequestedPokemonRef = useRef(false);

  useEffect(() => {
    isProfileChargingRef.current = isProfileCharging;
  }, [isProfileCharging]);

  useEffect(() => {
    hasProgressCompletedRef.current = hasProgressCompleted;
  }, [hasProgressCompleted]);

  useEffect(() => {
    hasProfileEvolvedRef.current = hasProfileEvolved;
  }, [hasProfileEvolved]);

  useEffect(() => {
    randomPokemonRef.current = randomPokemon;
  }, [randomPokemon]);

  useEffect(() => {
    isPokemonLoadingRef.current = isPokemonLoading;
  }, [isPokemonLoading]);

  const revealPokemon = useCallback((pokemon?: Pokemon | null) => {
    const pokemonToReveal = pokemon ?? randomPokemonRef.current;

    if (!pokemonToReveal || hasProfileEvolvedRef.current) return;

    setRandomPokemon(pokemonToReveal);
    setHasProgressCompleted(true);
    setHasProfileEvolved(true);
    setIsProfileCharging(false);
    setIsPokemonLoading(false);
    setPokemonError(null);

    hasProgressCompletedRef.current = true;
    hasProfileEvolvedRef.current = true;
    isProfileChargingRef.current = false;
    randomPokemonRef.current = pokemonToReveal;
    isPokemonLoadingRef.current = false;
  }, []);

  const underlineOnRevealClass = hasProfileEvolved
    ? "bg-[linear-gradient(to_right,var(--shiny-color),var(--shiny-color))] bg-left-bottom bg-no-repeat bg-[length:100%_2px] drop-shadow-[0_0_6px_var(--shiny-color)] transition-[background-size,filter] duration-700 ease-out"
    : "bg-[linear-gradient(to_right,var(--shiny-color),var(--shiny-color))] bg-left-bottom bg-no-repeat bg-[length:0%_2px] transition-[background-size,filter] duration-700 ease-out";

  /**
   * Scroll-position based active section logic
   */
  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("section[id]")
    );

    const headerOffset = 96;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;

      ticking = true;

      requestAnimationFrame(() => {
        const scrollPos = window.scrollY + headerOffset + 1;

        let current = sections[0]?.id;

        for (const section of sections) {
          if (section.offsetTop <= scrollPos) {
            current = section.id;
          }
        }

        if (current) setActiveSection(current);

        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

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

  const requestPokemonFetch = useCallback(() => {
    if (
      hasProfileEvolvedRef.current ||
      randomPokemonRef.current ||
      isPokemonLoadingRef.current ||
      hasRequestedPokemonRef.current
    ) {
      return;
    }

    hasRequestedPokemonRef.current = true;
    window.dispatchEvent(new CustomEvent("trigger-pokemon-fetch"));
  }, []);

  const handleProfileMouseEnter = useCallback(() => {
    if (hasProfileEvolvedRef.current) return;

    setPokemonError(null);
    setIsProfileCharging(true);

    isProfileChargingRef.current = true;

    /**
     * Start fetching immediately on hover.
     * This allows the Pokémon to be ready by the time progress reaches 100%.
     */
    requestPokemonFetch();
  }, [requestPokemonFetch]);

  const handleProfileMouseLeave = useCallback(() => {
    if (hasProfileEvolvedRef.current) return;

    /**
     * If progress already completed, do not cancel the reveal flow.
     * The Pokémon should reveal once ready.
     */
    if (hasProgressCompletedRef.current) return;

    setIsProfileCharging(false);
    setHasProgressCompleted(false);

    isProfileChargingRef.current = false;
    hasProgressCompletedRef.current = false;
  }, []);

  const handlePokemonFetch = useCallback(
    (pokemon: Pokemon | null, loading: boolean, error: string | null) => {
      setIsPokemonLoading(loading);
      setPokemonError(error);

      isPokemonLoadingRef.current = loading;

      if (error) {
        hasRequestedPokemonRef.current = false;
      }

      if (pokemon) {
        setRandomPokemon(pokemon);
        randomPokemonRef.current = pokemon;
        hasRequestedPokemonRef.current = false;

        /**
         * If progress already reached 100%, reveal immediately as soon
         * as the Pokémon data arrives.
         */
        if (
          hasProgressCompletedRef.current &&
          !hasProfileEvolvedRef.current
        ) {
          revealPokemon(pokemon);
        }
      }
    },
    [revealPokemon]
  );

  const handleProfileTransitionEnd = useCallback(
    (event: React.TransitionEvent<HTMLDivElement>) => {
      if (event.currentTarget !== event.target) return;

      if (
        event.propertyName !== "--profile-border-progress" ||
        hasProfileEvolvedRef.current ||
        !isProfileChargingRef.current
      ) {
        return;
      }

      setHasProgressCompleted(true);
      hasProgressCompletedRef.current = true;

      /**
       * At 100%, reveal immediately if the Pokémon is already loaded.
       * Otherwise, keep loading and reveal inside handlePokemonFetch.
       */
      if (randomPokemonRef.current) {
        revealPokemon(randomPokemonRef.current);
      } else {
        requestPokemonFetch();
      }
    },
    [requestPokemonFetch, revealPokemon]
  );

  const profileImageSrc = hasProfileEvolved
    ? randomPokemon?.image || "/GreatBall.png"
    : "/GreatBall.png";

  const profileImageAlt =
    hasProfileEvolved && randomPokemon
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
              className={`profile-image-ring h-10 w-10 lg:h-[3.25rem] lg:w-[3.25rem] ${
                isProfileCharging ? "profile-image-ring-charging" : ""
              } ${hasProfileEvolved ? "profile-image-ring-evolved" : ""}`}
              aria-label={profileImageAlt}
              onMouseEnter={handleProfileMouseEnter}
              onMouseLeave={handleProfileMouseLeave}
              onTransitionEnd={handleProfileTransitionEnd}
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

          <PokemonProfile
            hasProfileEvolved={hasProfileEvolved}
            onFetchPokemon={handlePokemonFetch}
          />
        </div>

        <h2 className="text-2xl shiny drop-shadow-[0_0_10px_rgba(206,245,255,0.6)] flex items-center gap-3 text-center lg:text-start">
          <span className="custom-cursor">Full-Stack Developer</span>
        </h2>

        <p className="text-md text-muted-foreground text-center lg:text-start">
          Software Engineering student with{" "}
          <span className={underlineOnRevealClass}>
            4+ years of experience
          </span>
          . Open-source{" "}
          <span className={underlineOnRevealClass}>
            contributor on Forem (dev.to)
          </span>
          , a platform supporting a community of{" "}
          <span className={underlineOnRevealClass}>3M+ developers</span> and
          backed by organizations such as{" "}
          <span className={underlineOnRevealClass}>Google and GitHub</span>.
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
                  <span className="face left">🍀</span>
                  <span className="face top">🐣</span>
                  <span className="face bottom">❤️</span>
                  <span className="face right">🎃</span>
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
