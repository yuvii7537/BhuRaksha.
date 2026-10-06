import React, { useState, useEffect, useRef } from 'react';
import { LangProvider } from './context/LangContext';
import { ViewMode } from './types';
import { SplashScreen } from './components/SplashScreen';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { DemoView } from './views/DemoView';
import { VillagerView } from './views/VillagerView';
import { AdminView } from './views/AdminView';

function AppContent() {
  const [booted, setBooted] = useState(false);
  const [mode, setMode] = useState<ViewMode>('home');
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (booted) {
      window.scrollTo(0, 0);
    }
  }, [mode, booted]);

  return (
    <div
      className="relative min-h-screen font-ui selection:bg-[var(--saffron)] selection:text-white"
      style={{ background: 'var(--bg)', color: 'var(--ink)' }}
    >
      {/* Boot & Initialization Sequence */}
      {!booted && <SplashScreen onDone={() => setBooted(true)} />}

      {/* Main Persistent Application Bar */}
      {booted && <Header mode={mode} onMode={setMode} />}

      {/* Dynamic View Mode Router */}
      <main
        ref={mainRef}
        style={{ opacity: booted ? 1 : 0 }}
        className="transition-opacity duration-300"
      >
        {mode === 'home' && <HomeView onMode={setMode} />}
        {mode === 'demo' && <DemoView />}
        {mode === 'villager' && <VillagerView />}
        {mode === 'admin' && <AdminView />}
      </main>

      {/* Standardized Footer */}
      {booted && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <LangProvider>
      <AppContent />
    </LangProvider>
  );
}
