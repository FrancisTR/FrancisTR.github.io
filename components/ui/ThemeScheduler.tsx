import { useEffect } from "react";

export type ThemeWindow = {
  start: string;      // "2026-02-14T00:00:00"
  end: string;        // "2026-02-15T00:00:00"
  className: string;  // the CSS class to apply
};

/**
 * Simple, readable, and supports multiple windows.
 */
export default function ThemeScheduler({ windows }: { windows: ThemeWindow[] }) {
  useEffect(() => {
    const root = document.documentElement;

    const check = () => {
      const now = new Date().getTime();
      let activeClass = null;

      for (const w of windows) {
        const start = new Date(w.start).getTime();
        const end = new Date(w.end).getTime();

        if (now >= start && now < end) {
          activeClass = w.className;
          break;
        }
      }

      // remove all possible classes
      for (const w of windows) {
        root.classList.remove(w.className);
      }

      // apply if active
      if (activeClass) root.classList.add(activeClass);
    };

    check();
    const t = setInterval(check, 1000);
    return () => clearInterval(t);
  }, [windows]);

  return null;
}