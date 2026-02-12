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
  // { // Testing Purposes
  //   start: new Date(new Date().getFullYear(), 1, 0, 0, 0, 0, 0),
  //   end: new Date(new Date().getFullYear(), 11, 26, 0, 0, 0, 0),
  //   vars: {
  //     "--shiny-color": "hsl(120, 79%, 40%)",
  //     "--shiny-color-light": "#ff7a7a",

  //     "--primary-main-color": "120, 79%, 40%",

  //     "--card-main-bg": "0, 49%, 10%",
  //     "--skills-card-bg": "hsl(0, 49%, 10%)",

  //     "--click-color-1": "rgb(21, 183, 21)",
  //     "--click-color-2": "rgb(255, 122, 122)",

  //     "--custom-cursor": "url('/cursorImg/ChristmasTree.ico') 16 16, auto"
  //   },
  // },

  { // Valentine's Day (February 14th)
    start: new Date(new Date().getFullYear(), 1, 14, 0, 0, 0, 0),
    end: new Date(new Date().getFullYear(), 1, 15, 0, 0, 0, 0),
    vars: {
      "--shiny-color": "#ff00dd",
      "--shiny-color-light": "rgb(255, 191, 250)",

      "--primary-main-color": "305, 100%, 88%",

      "--card-main-bg": "319, 49%, 10%",
      "--skills-card-bg": "hsl(319, 49%, 10%)",

      "--click-color-1": "rgb(255, 0, 221)",
      "--click-color-2": "rgb(255, 191, 250)",

      "--custom-cursor": "url('/cursorImg/Heart.ico') 16 16, auto"
    },
  },
  { // St. Patrick's Day (March 17th)
    start: new Date(new Date().getFullYear(), 2, 17, 0, 0, 0, 0),
    end: new Date(new Date().getFullYear(), 2, 18, 0, 0, 0, 0),
    vars: {
      "--shiny-color": "#00ff0dd0",
      "--shiny-color-light": "rgba(159, 255, 162, 0.93)",

      "--primary-main-color": "122, 100%, 81%, 0.93",

      "--card-main-bg": "122, 49%, 10%",
      "--skills-card-bg": "hsl(122, 49%, 10%)",

      "--click-color-1": "rgb(0, 255, 13)",
      "--click-color-2": "rgba(159, 255, 162, 0.93)",

      "--custom-cursor": "url('/cursorImg/Clover.ico') 16 16, auto"
    },
  },
  { // Halloween (October 31st)
    start: new Date(new Date().getFullYear(), 9, 31, 0, 0, 0, 0),
    end: new Date(new Date().getFullYear(), 9, 31, 0, 0, 0, 0),
    vars: {
      "--shiny-color": "#ffa600ee",
      "--shiny-color-light": "#ffd47dee",

      "--primary-main-color": "40, 100%, 75%, 0.93",

      "--card-main-bg": "38, 49%, 10%",
      "--skills-card-bg": "hsl(38, 49%, 10%)",
      
      "--click-color-1": "rgb(255, 166, 0)",
      "--click-color-2": "rgb(255, 212, 125)",

      "--custom-cursor": "url('/cursorImg/Pumpkin.ico') 16 16, auto"
    },
  },
  { // Christmas (December 25th)
    start: new Date(new Date().getFullYear(), 11, 25, 0, 0, 0, 0),
    end: new Date(new Date().getFullYear(), 11, 26, 0, 0, 0, 0),
    vars: {
      "--shiny-color": "hsl(120, 79%, 40%)",
      "--shiny-color-light": "#ff7a7a",

      "--primary-main-color": "120, 79%, 40%",

      "--card-main-bg": "0, 49%, 10%",
      "--skills-card-bg": "hsl(0, 49%, 10%)",

      "--click-color-1": "rgb(21, 183, 21)",
      "--click-color-2": "rgb(255, 122, 122)",

      "--custom-cursor": "url('/cursorImg/ChristmasTree.ico') 16 16, auto"
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
      <ClickBurst />
      <ThemeScheduler
        windows={windows}
        defaults={{
          "--shiny-color": "#00ccff",
          "--shiny-color-light": "#cef5ff",

          "--primary-main-color": "193 100% 50%",

          "--card-main-bg": "222.2 50% 10%",
          "--skills-card-bg": "#0C1426",
          "--click-color-1": "rgb(255, 255, 255)",
          "--click-color-2": "rgb(255, 255, 255)",
          "--custom-cursor": "url('/cursorImg/IceCream.ico') 16 16, auto"
        }}
        tickMs={1000}
        strict={true}
        allKeys={["--shiny-color", "--shiny-color-light", "--primary-main-color", "--card-main-bg", "--skills-card-bg", "--click-color-1", "--click-color-2", "--custom-cursor"]}
        debug={false}       // <-- watch the console to verify ranges
        mode="local"       // or "utc" if your schedule is authored in UTC
      />
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
