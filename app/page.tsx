"use client";
import ThemeScheduler, { ThemeWindow } from "@/components/ui/ThemeScheduler";
import ClickBurst from "@/components/ui/ClickBurst";
import Head from "next/head";
import Nav from "@/components/Nav";
import ExpCard from "@/components/ExpCards";
import Projects from "@/components/Projects";
import About from "@/components/Skills";
import Contact from "@/components/Blog";
import Footer from "@/components/Footer";
import { useEffect, useRef } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

// new Date(2026, 1, 9, 0, 0, 0, 0)
// Year, Month, day, hours, minutes, seconds, milliseconds
const windows: ThemeWindow[] = [
  { // Testing
    start: new Date(new Date().getFullYear(), 11, 25, 0, 0, 0, 0),
    end: new Date(new Date().getFullYear(), 11, 26, 0, 0, 0, 0),
    vars: {
      "--shiny-color": "hsl(120, 79%, 40%)",
      "--shiny-color-light": "#ff7a7a",

      "--primary-main-color": "46, 100%, 50%",
    },
  },

  { // Valentine's Day (February 14th)
    start: new Date(new Date().getFullYear(), 1, 14, 0, 0, 0, 0),
    end: new Date(new Date().getFullYear(), 1, 15, 0, 0, 0, 0),
    vars: {
      "--shiny-color": "#ff00dd",
      "--shiny-color-light": "#ffcefb",

      "--primary-main-color": "340, 60%, 70%",
    },
  },
  { // St. Patrick's Day (March 17th)
    start: new Date(new Date().getFullYear(), 2, 17, 0, 0, 0, 0),
    end: new Date(new Date().getFullYear(), 2, 18, 0, 0, 0, 0),
    vars: {
      "--shiny-color": "#00ff0dee",
      "--shiny-color-light": "#c7ffca",

      "--primary-main-color": "128, 60%, 70%",
    },
  },
  { // Halloween (October 31st)
    start: new Date(new Date().getFullYear(), 9, 31, 0, 0, 0, 0),
    end: new Date(new Date().getFullYear(), 9, 31, 0, 0, 0, 0),
    vars: {
      "--shiny-color": "#ffa600ee",
      "--shiny-color-light": "#6e5b36ee",

      "--primary-main-color": "39, 100%, 50%, 0.93",
    },
  },
  { // Christmas (December 25th)
    start: new Date(new Date().getFullYear(), 11, 25, 0, 0, 0, 0),
    end: new Date(new Date().getFullYear(), 11, 26, 0, 0, 0, 0),
    vars: {
      "--shiny-color": "hsl(120, 79%, 40%)",
      "--shiny-color-light": "#ff7a7a",

      "--primary-main-color": "46, 100%, 50%",
    },
  },
];

export default function Home() {
  const auraRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateAuraPosition = (e: MouseEvent) => {
      if (auraRef.current) {
        auraRef.current.style.setProperty("--mouse-x", `${e.clientX}px`);
        auraRef.current.style.setProperty("--mouse-y", `${e.clientY}px`);
      }
    };
    window.addEventListener("pointermove", updateAuraPosition);

    return () => {
      window.removeEventListener("pointermove", updateAuraPosition);
    };
  }, []);

  return (
    <>
      <ThemeScheduler
        windows={windows}
        defaults={{
          "--shiny-color": "#00ccff",
          "--shiny-color-light": "#cef5ff",

          "--primary-main-color": "193 100% 50%",

          "--card-main-bg": "222.2 50% 10%",
          "--skills-card-bg": "#0C1426",
        }}
        tickMs={1000}
        strict={true}
        allKeys={["--shiny-color", "--shiny-color-light", "--primary-main-color"]}
        debug={false}       // <-- watch the console to verify ranges
        mode="local"       // or "utc" if your schedule is authored in UTC
      />
      <ClickBurst />
      <Head>
        <style jsx global>{`
          body {
            font-family: "${inter.style.fontFamily}";
          }
        `}</style>
      </Head>
      <div className="mx-auto min-h-screen max-w-screen-2xl px-6 py-12 md:px-12 md:py-20 lg:px-24 lg:py-0">
        <div className="lg:flex lg:justify-between lg:gap-4">
          <Nav />
          <main className="flex flex-col pt-6 lg:pt-24 lg:w-1/2 lg:py-24 gap-8">
            <About />
            <ExpCard />
            <Projects />
            <Contact />
            <Footer />
          </main>
        </div>
      </div>
    </>
  );
}
