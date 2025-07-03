import { useEffect, useState } from "react";

export const useTheme = () => {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");

  useEffect(() => {
    const updateTheme = () => {
      const storedTheme = localStorage.getItem("theme");

      // If no theme in localStorage or it's set to "system", use system theme
      if (!storedTheme || storedTheme === "system") {
        // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
        setTheme("system");
      } else {
        // Otherwise use the stored theme value
        // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
        setTheme(storedTheme as "light" | "dark");
      }
    };

    // Set initial theme
    updateTheme();

    // Watch for changes to localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "theme") {
        updateTheme();
      }
    };

    // Listen for localStorage changes from other tabs/windows
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return { theme };
};
