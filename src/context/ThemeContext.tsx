import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface ThemeContextValue {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  isDark: true,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Default: dark mode (matches Cohere's dark product field aesthetic)
  const [isDark, setIsDark] = useState<boolean>(() => {
    const stored = localStorage.getItem('logisim-theme');
    return stored ? stored === 'dark' : true;
  });

  // Apply/remove the `dark` class on <html> so Tailwind dark: variants work
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('logisim-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/** Convenience hook */
export function useTheme() {
  return useContext(ThemeContext);
}
