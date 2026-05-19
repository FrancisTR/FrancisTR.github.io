"use client";
import ThemeScheduler, { ThemeWindow } from "@/components/ui/ThemeScheduler";
import { Button } from "@/components/ui/button";
import Head from "next/head";
import Nav from "@/components/Nav";
import ExpCard from "@/components/ExpCards";
import Projects from "@/components/Projects";
import About from "@/components/Skills";
import Contact from "@/components/Blog";
import Footer from "@/components/Footer";
import { useEffect, useRef, useState } from "react";
import { Inter } from "next/font/google";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HOLIDAY_WINDOWS, DEFAULT_THEME_VARS, HolidayWindow } from "@/lib/themes";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const auraRef = useRef<HTMLDivElement>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [forcedHolidayId, setForcedHolidayId] = useState<string | null>(null);
  const lastToastHolidayId = useRef<string | null>(null);

  // Check for holiday testing parameter or forced selection
  // Ex: http://localhost:3000/?holiday=valentines
  const getForcedHoliday = () => {
    if (forcedHolidayId) {
      return HOLIDAY_WINDOWS.find((w) => w.id === forcedHolidayId) || null;
    }

    if (typeof window === "undefined") return null;
    const urlParams = new URLSearchParams(window.location.search);
    const holidayParam = urlParams.get("holiday");
    return holidayParam && HOLIDAY_WINDOWS.some((w) => w.id === holidayParam)
      ? HOLIDAY_WINDOWS.find((w) => w.id === holidayParam) || null
      : null;
  };

  const updateHoliday = (holidayId: string | null) => {
    setForcedHolidayId(holidayId);
    if (typeof window === "undefined") return;
    const baseUrl = window.location.pathname;
    const query = holidayId ? `?holiday=${holidayId}` : "";
    window.history.pushState(null, "", `${baseUrl}${query}`);
  };

  // Get active windows (forced holiday takes precedence for testing)
  const getActiveWindows = () => {
    const forcedHoliday = getForcedHoliday();
    if (forcedHoliday) {
      // For testing, create a window that starts now and ends in 24 hours
      const now = new Date();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      return [{
        ...forcedHoliday,
        start: now,
        end: tomorrow,
      }];
    }
    return HOLIDAY_WINDOWS;
  };

  const activeWindows = getActiveWindows();

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
    const now = new Date();
    const forcedHoliday = getForcedHoliday();
    const active = forcedHoliday || HOLIDAY_WINDOWS.find(
      (w) => now >= w.start && now < w.end && !!w.notificationPopUp
    );
    if (!active || lastToastHolidayId.current === active.id) return;

    lastToastHolidayId.current = active.id;
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
  }, [forcedHolidayId]);

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
      <ThemeScheduler
        windows={activeWindows}
        defaults={DEFAULT_THEME_VARS}
        tickMs={1000}
        strict={true}
        allKeys={[
          "--shiny-color",
          "--shiny-color-light",
          "--primary-main-color",
          "--card-main-bg",
          "--skills-card-bg",
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
          <main className="flex flex-col pt-6 lg:pt-24 lg:w-1/2 lg:py-24 gap-12 md:gap-16">
            <About />
            <ExpCard />
            <Projects />
            <Contact />
            <Footer />
          </main>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setShowPicker(true)}
        aria-label="Open holiday theme selector"
        className="fixed bottom-5 right-5 z-[9999] group"
      >
        <div className="relative flex items-center justify-center w-12 h-12 transition-transform duration-300 ease-out hover:scale-110 active:scale-95">
          <div className="absolute inset-0 rounded-full bg-primary/30 blur-md group-hover:blur-lg transition-all duration-500"></div>
          <div className="relative w-10 h-10 rounded-full bg-transparent shadow-none flex items-center justify-center overflow-hidden">
            <span className="cube-button scale-75" aria-hidden="true">
              <span className="cube">
                <span className="face front">🎉</span>
                <span className="face back">🎄</span>
                <span className="face right">🎃</span>
                <span className="face left">🍀</span>
                <span className="face top">🐣</span>
                <span className="face bottom">❤️</span>
              </span>
            </span>
          </div>
        </div>
      </button>
      {showPicker && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6"
          onClick={() => setShowPicker(false)}
        >
          <div
            className="w-full max-w-sm sm:max-w-2xl rounded-2xl border border-white/10 bg-card/90 p-6 shadow-2xl ring-1 ring-white/20 backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 mb-8">
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Holiday Themes</h2>
                <p className="text-sm text-muted-foreground">Personalize your experience</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowPicker(false)}
                className="rounded-full hover:bg-white/10"
                aria-label="Close holiday theme selector"
              >
                <span className="text-xl">✕</span>
              </Button>
            </div>
            <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)] items-center">
              <div className="rounded-2xl bg-white/5 p-6 text-center shadow-inner ring-1 ring-white/10 order-2 lg:order-1 backdrop-blur-sm">
                <div className="mb-4 inline-flex flex-wrap justify-center gap-3">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20 text-2xl transition-transform hover:scale-110 cursor-default">❤️</span>
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20 text-2xl transition-transform hover:scale-110 cursor-default">🍀</span>
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/20 text-2xl transition-transform hover:scale-110 cursor-default">🐣</span>
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/20 text-2xl transition-transform hover:scale-110 cursor-default">🎃</span>
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-sky-500/20 text-2xl transition-transform hover:scale-110 cursor-default">🎄</span>
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  Select a theme to apply
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 order-1 lg:order-2">
                <Button
                  variant="outline"
                  onClick={() => { updateHoliday(null); setShowPicker(false); }}
                  className="min-h-[3.5rem] rounded-xl border-white/10 bg-white/5 hover:bg-white/10 transition-all"
                >
                  Default Theme
                </Button>
                <Button
                  variant="outline"
                  onClick={() => { updateHoliday('valentines'); setShowPicker(false); }}
                  className="min-h-[3.5rem] rounded-xl border-white/10 bg-white/5 hover:bg-white/10 transition-all"
                >
                  Valentine's Day
                </Button>
                <Button
                  variant="outline"
                  onClick={() => { updateHoliday('st-patricks'); setShowPicker(false); }}
                  className="min-h-[3.5rem] rounded-xl border-white/10 bg-white/5 hover:bg-white/10 transition-all"
                >
                  St. Patrick's Day
                </Button>
                <Button
                  variant="outline"
                  onClick={() => { updateHoliday('easter'); setShowPicker(false); }}
                  className="min-h-[3.5rem] rounded-xl border-white/10 bg-white/5 hover:bg-white/10 transition-all"
                >
                  Easter
                </Button>
                <Button
                  variant="outline"
                  onClick={() => { updateHoliday('halloween'); setShowPicker(false); }}
                  className="min-h-[3.5rem] rounded-xl border-white/10 bg-white/5 hover:bg-white/10 transition-all"
                >
                  Halloween
                </Button>
                <Button
                  variant="outline"
                  onClick={() => { updateHoliday('christmas'); setShowPicker(false); }}
                  className="min-h-[3.5rem] rounded-xl border-white/10 bg-white/5 hover:bg-white/10 transition-all"
                >
                  Christmas
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}