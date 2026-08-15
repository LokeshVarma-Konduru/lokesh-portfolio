"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Reads a media query without holding it in state.
 *
 * The obvious version — `useState(false)` plus an effect that calls
 * `setState(query.matches)` — makes React render once with the wrong answer and
 * then again with the right one, which is what `react-hooks/set-state-in-effect`
 * objects to. Subscribing directly gives the server a stable `false` and the
 * client the real value on its first render.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query]
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
}
