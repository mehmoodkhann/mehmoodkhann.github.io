import { createContext, useContext, useEffect, useState } from "react";
const ThemeContext = createContext(null);
const KEY = "mk_portfolio_v1:theme";
function initial() {
  try {
    const saved = window.localStorage.getItem(KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch {}
  return "dark";
}
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(initial);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.classList.toggle("light", theme === "light");
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#0f1111" : "#f8faf5");
    try {
      window.localStorage.setItem(KEY, theme);
    } catch {}
  }, [theme]);
  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("ThemeProvider is required");
  return ctx;
}
