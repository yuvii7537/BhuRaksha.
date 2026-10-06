import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  kc,
  uiLangs,
  defaultUI,
  VillagerContent,
  UIContent,
} from '../i18n/languages';

interface LangContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  lang: string;
  setLang: (lang: string) => void;
  L: VillagerContent;
  t: (key: string) => string;
}

const LangContext = createContext<LangContextType>({
  theme: 'light',
  toggleTheme: () => {},
  lang: 'en',
  setLang: () => {},
  L: kc.en,
  t: (key: string) => defaultUI[key] || key,
});

export const useLang = () => useContext(LangContext);

export const LangProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('bhu-theme');
      if (stored === 'dark' || stored === 'light') return stored;
    }
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  const [lang, setLang] = useState<string>(() => {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('bhu-lang');
      if (stored && stored in kc) return stored;
    }
    return 'en';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('bhu-theme', theme);
    } catch {}
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem('bhu-lang', lang);
    } catch {}
  }, [lang]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const L = kc[lang] || kc.en;
  const t = (key: string): string => {
    const currentDict = uiLangs[lang];
    if (currentDict && key in currentDict) {
      return currentDict[key];
    }
    return defaultUI[key] || key;
  };

  return (
    <LangContext.Provider
      value={{
        theme,
        toggleTheme,
        lang,
        setLang,
        L,
        t,
      }}
    >
      {children}
    </LangContext.Provider>
  );
};
