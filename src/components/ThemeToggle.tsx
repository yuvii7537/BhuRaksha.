import React from 'react';
import { useLang } from '../context/LangContext';
import { Moon, Sun } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useLang();
  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle colour theme"
      title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      className="focus-ring flex h-9 w-9 items-center justify-center rounded-md border transition-colors cursor-pointer"
      style={{
        borderColor: 'var(--line)',
        background: 'var(--surface)',
        color: 'var(--ink-2)',
      }}
    >
      {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
    </button>
  );
};
