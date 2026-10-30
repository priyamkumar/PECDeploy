import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'light' | 'dark';
export type FontPair = 'broadsheet' | 'modern' | 'heritage' | 'grotesque';

export interface FontPairOption {
  id: FontPair;
  name: string;
  headlineFont: string;
  bodyFont: string;
  description: string;
}

export const FONT_PAIRS: FontPairOption[] = [
  {
    id: 'broadsheet',
    name: 'Broadsheet Classic',
    headlineFont: 'Newsreader',
    bodyFont: 'Spectral',
    description: 'Optical serif headlines (700) with French editorial book serif (400, 1.85 line-height)',
  },
  {
    id: 'heritage',
    name: 'Heritage Broadsheet',
    headlineFont: 'Playfair Display',
    bodyFont: 'Merriweather',
    description: 'High-contrast display serif with robust, high x-height reading serif',
  },
  {
    id: 'modern',
    name: 'Modern Editorial',
    headlineFont: 'Newsreader',
    bodyFont: 'Inter',
    description: 'Newsprint serif masthead paired with razor-sharp neo-grotesque UI copy',
  },
  {
    id: 'grotesque',
    name: 'The Technical Dispatch',
    headlineFont: 'Cinzel',
    bodyFont: 'Spectral',
    description: 'Engraved roman caps kicker with tabular monospaced metadata and clear serif',
  },
];

interface ThemeContextValue {
  theme: Theme;
  fontPair: FontPair;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  setFontPair: (pair: FontPair) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('incogniread-theme');
      if (saved === 'light' || saved === 'dark') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });

  const [fontPair, setFontPairState] = useState<FontPair>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('incogniread-font-pair');
      if (saved && ['broadsheet', 'modern', 'heritage', 'grotesque'].includes(saved)) {
        return saved as FontPair;
      }
    }
    return 'broadsheet';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('incogniread-theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('font-pair-broadsheet', 'font-pair-modern', 'font-pair-heritage', 'font-pair-grotesque');
    root.classList.add(`font-pair-${fontPair}`);
    localStorage.setItem('incogniread-font-pair', fontPair);
  }, [fontPair]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (t: Theme) => {
    setThemeState(t);
  };

  const setFontPair = (pair: FontPair) => {
    setFontPairState(pair);
  };

  return (
    <ThemeContext.Provider value={{ theme, fontPair, toggleTheme, setTheme, setFontPair }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
