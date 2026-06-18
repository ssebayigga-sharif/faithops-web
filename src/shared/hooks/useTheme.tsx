import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Theme } from "@carbon/react";

export type CarbonTheme = "white" | "g10" | "g90" | "g100";

interface ThemeContextType {
  theme: CarbonTheme;
  setTheme: (theme: CarbonTheme) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<CarbonTheme>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("faithops-theme");
      if (saved === "white" || saved === "g10" || saved === "g90" || saved === "g100") {
        return saved;
      }
    }
    return "g10"; // default theme
  });

  const setTheme = (newTheme: CarbonTheme) => {
    setThemeState(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("faithops-theme", newTheme);
    }
  };

  const isDarkMode = theme === "g90" || theme === "g100";

  const toggleDarkMode = () => {
    setTheme(isDarkMode ? "g10" : "g100");
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Toggle class on document element so standard CSS can react to it
      if (isDarkMode) {
        document.documentElement.classList.add("dark-mode");
        document.documentElement.setAttribute("data-theme", theme);
      } else {
        document.documentElement.classList.remove("dark-mode");
        document.documentElement.setAttribute("data-theme", theme);
      }
    }
  }, [theme, isDarkMode]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDarkMode, toggleDarkMode }}>
      <Theme theme={theme}>
        {children}
      </Theme>
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useAppTheme must be used within a ThemeProvider");
  }
  return context;
};
