"use client";
import ThemeScheduler from "@/components/ui/ThemeScheduler";
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
        windows={[
          {
            start: "2026-02-14T00:00:00",
            end: "2026-02-15T00:00:00",
            className: "Portfolio-valentines-day",
          },
          {
            start: "2026-12-25T00:00:00",
            end: "2026-12-26T00:00:00",
            className: "Portfolio-christmas",
          },
        ]}
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
