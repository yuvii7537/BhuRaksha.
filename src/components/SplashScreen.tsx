import React, { useEffect, useState } from 'react';
import { AshokaEmblem } from './UIElements';

export const SplashScreen: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [progress, setProgress] = useState(0);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(timer);
          setClosing(true);
          setTimeout(onDone, 600);
          return 100;
        }
        return p + 6;
      });
    }, 45);

    return () => clearInterval(timer);
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[300] flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${
        closing ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
      }`}
      style={{ background: 'var(--bg)' }}
    >
      <div className="tricolor absolute inset-x-0 top-0 h-[3px]" />

      <div className="flex flex-col items-center animate-fade-in">
        <AshokaEmblem size={56} />
        <div
          className="font-display mt-5 text-[20px] font-700"
          style={{ color: 'var(--ink)' }}
        >
          भूरक्षा <span style={{ color: 'var(--saffron)' }}>BHURAKSHA</span>
        </div>
        <div
          className="mt-1.5 text-[12px]"
          style={{ color: 'var(--mute)' }}
        >
          National Mine Subsidence Early Warning System
        </div>
      </div>

      <div className="mt-8 w-60">
        <div
          className="mb-2 flex justify-between text-[11px]"
          style={{ color: 'var(--mute)' }}
        >
          <span>Initialising console</span>
          <span style={{ color: 'var(--green)' }}>Ready</span>
        </div>
        <div
          className="h-[3px] w-full overflow-hidden rounded-full"
          style={{ background: 'var(--line)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-150 ease-out"
            style={{
              width: `${progress}%`,
              background: 'var(--saffron)',
            }}
          />
        </div>
      </div>
    </div>
  );
};
