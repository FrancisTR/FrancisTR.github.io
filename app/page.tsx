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
  // Testing
  {
    start: new Date(2026, 1, 9, 13, 0, 0, 0),      // inclusive
    end: new Date(2026, 1, 9, 13, 5, 0, 0),     // exclusive
    vars: {
      "--shiny-color": "#285800",
      "--shiny-color-light": "#cef5ff",

      "--primary-main-color": "193 100% 50%",

      "--card-main-bg": "222.2 50% 10%",
      "--skills-card-bg": "#0C1426",
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
        allKeys={["--shiny-color", "--shiny-color-light", "--primary-main-color", "--card-main-bg", "--skills-card-bg"]}
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
