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


const windows: ThemeWindow[] = [
  // Valentine’s Day — change accent + bg + fg
  {
    start: "2026-02-14T00:00:00",
    end: "2026-02-15T00:00:00",
    vars: {
      "--bg": "#fff1f2",
      "--fg": "#9f1239",
      "--accent": "#e11d48",
    },
  },
  // St. Patrick’s — green palette
  {
    start: "2026-03-17T00:00:00",
    end: "2026-03-18T00:00:00",
    vars: {
      "--bg": "#ecfdf5",
      "--fg": "#065f46",
      "--accent": "#10b981",
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
          "--bg": "#ffffff",
          "--fg": "#0f172a",
          "--accent": "#2563eb",
        }}
        tickMs={1000}
        // Set strict=true if you want to ensure no stale inline vars linger.
        // If you do, list every var you might set in any window/defaults:
        strict={true}
        allKeys={["--bg", "--fg", "--accent"]}
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
