import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "ratiolab-theme";

function readStored() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "dark";
  } catch {
    return false;
  }
}

export function useTheme() {
  const [dark, setDark] = useState(readStored);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }, [dark]);

  const toggle = useCallback(() => {
    setDark((prev) => {
      const next = !prev;
      try { localStorage.setItem(STORAGE_KEY, next ? "dark" : "light"); } catch {}
      return next;
    });
  }, []);
  return { dark, toggle };
}
