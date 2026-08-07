"use client";

import { useEffect, useState } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";

// Matches the theme signal broadcast by ThemeToggle / the pre-paint script.
const THEME_EVENT = "sunnyr:theme-change";

function currentTheme(): "light" | "dark" {
  if (typeof document === "undefined") return "light";
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

export function CalEmbed({ calLink }: { calLink: string }) {
  // Start at the SSR default ("light") to match the server render, then sync to
  // the real theme after mount — mirrors how ThemeToggle reads the same state.
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const sync = () => setTheme(currentTheme());
    sync();
    window.addEventListener(THEME_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(THEME_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    (async () => {
      const cal = await getCalApi();
      cal("ui", {
        theme,
        styles: { branding: { brandColor: "#f5a623" } },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, [theme]);

  return (
    <Cal
      calLink={calLink}
      style={{ width: "100%", height: "100%", minHeight: "600px" }}
      config={{ layout: "month_view" }}
    />
  );
}
