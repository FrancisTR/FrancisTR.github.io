import { useEffect } from "react";

export type ThemeWindow = {
  start: string;                         // e.g. "2026-02-14T00:00:00" (local) or "2026-02-14T06:00:00Z" (UTC)
  end: string;                           // exclusive end
  vars: Record<`--${string}`, string>;   // CSS variables to set while active
};

export default function ThemeScheduler({
  windows,
  defaults = {},
  tickMs = 1000,
  strict = false,
  allKeys = [],
}: {
  windows: ThemeWindow[];
  /** Variables to apply when no window is active (your light/dark base, etc.) */
  defaults?: Record<`--${string}`, string>;
  /** How often to re-check (ms). Default: 1000 */
  tickMs?: number;
  /**
   * If true, remove all listed keys before applying the current set,
   * ensuring no stale inline vars linger. Provide `allKeys` when strict=true.
   */
  strict?: boolean;
  /** Full list of variable names you might set (only needed if strict=true) */
  allKeys?: Array<`--${string}`>;
}) {
  useEffect(() => {
    const rootStyle = document.documentElement.style;

    const applyVars = (vars: Record<`--${string}`, string>) => {
      if (strict && allKeys.length) {
        // Remove any previously inlined variables so only the active set remains
        for (const key of allKeys) rootStyle.removeProperty(key);
      }
      for (const [k, v] of Object.entries(vars)) {
        rootStyle.setProperty(k, v);
      }
    };

    const check = () => {
      const now = Date.now();
      let active: Record<`--${string}`, string> | null = null;

      for (const w of windows) {
        const start = new Date(w.start).getTime();
        const end = new Date(w.end).getTime();
        if (now >= start && now < end) {
          active = w.vars;
          break; // first match wins
        }
      }

      if (active) applyVars(active);
      else applyVars(defaults);
    };

    check();
    const t = setInterval(check, tickMs);
    return () => clearInterval(t);
  }, [windows, defaults, tickMs, strict, allKeys]);

  return null;
}