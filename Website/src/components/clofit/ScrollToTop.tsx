import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Imperatively scrolls the window to (0, 0) on every pathname change.
 * Render once inside <BrowserRouter> (e.g. inside AnimatedRoutes).
 */
export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // "instant" avoids fighting the Framer Motion page transition
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return null;
};
