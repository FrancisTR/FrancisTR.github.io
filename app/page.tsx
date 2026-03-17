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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

// Easter date helpers (Western/Gregorian)
function getWesternEaster(year: number): Date {
  // Meeus/Jones/Butcher algorithm
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31); // 3=March, 4=April
  const day = 1 + ((h + l - 7 * m + 114) % 31);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}

function addDays(d: Date, days: number): Date {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + days);
  return startOfDay(copy);
}

// Precompute Easter Sunday for the current year
const YEAR = new Date().getFullYear();
const EASTER_SUNDAY = getWesternEaster(YEAR);
const DAY_AFTER_EASTER = addDays(EASTER_SUNDAY, 1); // exclusive end

// Extend ThemeWindow with id and optional notification message
type HolidayWindow = ThemeWindow & {
  id: string;
  notificationPopUp?: string;
};

// Year, Month (0-based), Day, Hours, Minutes, Seconds, Milliseconds
const windows: HolidayWindow[] = [
  {
    // Valentine's Day (February 14th)
    id: "valentines",
    start: new Date(YEAR, 1, 14, 0, 0, 0, 0),
    end: new Date(YEAR, 1, 15, 0, 0, 0, 0),
    vars: {
      "--shiny-color": "#ff00dd",
      "--shiny-color-light": "rgb(255, 191, 250)",
      "--primary-main-color": "305, 100%, 88%",
      "--card-main-bg": "319, 49%, 10%",
      "--skills-card-bg": "hsl(319, 49%, 10%)",
      "--click-color-1": "rgb(255, 0, 221)",
      "--click-color-2": "rgb(255, 191, 250)",
      "--custom-cursor": "url('/cursorImg/Heart.ico') 16 16, auto",
    },
    notificationPopUp: "❤️ Happy Valentine's Day!",
  },
  {
    // St. Patrick's Day (March 17th)
    id: "st-patricks",
    start: new Date(YEAR, 2, 17, 0, 0, 0, 0),
    end: new Date(YEAR, 2, 18, 0, 0, 0, 0),
    vars: {
      "--shiny-color": "#00ff0dd0",
      "--shiny-color-light": "rgba(159, 255, 162, 0.93)",
      "--primary-main-color": "122, 100%, 81%, 0.93",
      "--card-main-bg": "122, 49%, 10%",
      "--skills-card-bg": "hsl(122, 49%, 10%)",
      "--click-color-1": "rgb(0, 255, 13)",
      "--click-color-2": "rgba(159, 255, 162, 0.93)",
      "--custom-cursor": "url('/cursorImg/Clover.ico') 16 16, auto",
    },
    notificationPopUp: "🍀 Happy St. Patrick's Day!",
  },
  {
    // Easter Sunday (single day)
    id: "easter",
    start: EASTER_SUNDAY, // local midnight at Easter Sunday
    end: DAY_AFTER_EASTER, // ends at Monday 00:00
    vars: {
      "--shiny-color": "#92fbff",
      "--shiny-color-light": "#d0c0ff",
      "--primary-main-color": "205, 70%, 78%",
      "--card-main-bg": "275, 45%, 12%",
      "--skills-card-bg": "hsl(275, 45%, 12%)",
      "--click-color-1": "rgb(255, 196, 232)",
      "--click-color-2": "rgb(255, 241, 153)",
      "--custom-cursor": "url('/cursorImg/Egg.ico') 16 16, auto",
    },
    notificationPopUp: "🐣 Happy Easter!",
  },
  {
    // Halloween (October 31st) — FIXED end date to Nov 1
    id: "halloween",
    start: new Date(YEAR, 9, 31, 0, 0, 0, 0), // Oct is 9
    end: new Date(YEAR, 10, 1, 0, 0, 0, 0), // Nov 1 (next day midnight)
    vars: {
      "--shiny-color": "#ffa600ee",
      "--shiny-color-light": "#ffd47dee",
      "--primary-main-color": "40, 100%, 75%, 0.93",
      "--card-main-bg": "38, 49%, 10%",
      "--skills-card-bg": "hsl(38, 49%, 10%)",
      "--click-color-1": "rgb(255, 166, 0)",
      "--click-color-2": "rgb(255, 212, 125)",
      "--custom-cursor": "url('/cursorImg/Pumpkin.ico') 16 16, auto",
    },
    notificationPopUp: "👻 Happy Halloween!",
  },
  {
    // Christmas (December 25th)
    id: "christmas",
    start: new Date(YEAR, 11, 25, 0, 0, 0, 0),
    end: new Date(YEAR, 11, 26, 0, 0, 0, 0),
    vars: {
      "--shiny-color": "hsl(120, 79%, 40%)",
      "--shiny-color-light": "#ff7a7a",
      "--primary-main-color": "120, 79%, 40%",
      "--card-main-bg": "0, 49%, 10%",
      "--skills-card-bg": "hsl(0, 49%, 10%)",
      "--click-color-1": "rgb(21, 183, 21)",
      "--click-color-2": "rgb(255, 122, 122)",
      "--custom-cursor": "url('/cursorImg/ChristmasTree.ico') 16 16, auto",
    },
    notificationPopUp: "🎄 Merry Christmas!",
  },
];

export default function Home() {
  const auraRef = useRef<HTMLDivElement>(null);

  // Prevent duplicate toasts in React Strict Mode during development
  const shownRef = useRef(false);

  // Track the mouse to update aura vars (existing behavior)
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

  // Show toast only when a holiday window is active; no popup otherwise
  useEffect(() => {
    if (shownRef.current) return; // guard for Strict Mode double-invoke
    const now = new Date();
    const active = windows.find(
      (w) => now >= w.start && now < w.end && !!w.notificationPopUp
    );
    if (!active) return;

    shownRef.current = true;

    toast(active.notificationPopUp!, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: "dark",
    });
  }, []);

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        theme="dark"
        style={{ zIndex: 2147483647 }} // ensure it's on top of everything
      />
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
        }}
        tickMs={1000}
        strict={true}
        allKeys={[
          "--shiny-color",
          "--shiny-color-light",
          "--primary-main-color",
          "--card-main-bg",
          "--skills-card-bg",
          "--click-color-1",
          "--click-color-2",
          "--custom-cursor",
        ]}
        debug={false}
        mode="local"
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