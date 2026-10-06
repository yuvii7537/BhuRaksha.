import React from 'react';
import { useLang } from '../context/LangContext';
import { AshokaEmblem, MarqueeTrack } from './UIElements';

export const Footer: React.FC = () => {
  const { t } = useLang();

  const marqueeItems = [
    'BHURAKSHA · Bharat listens to its land',
    'Real-time Autonomous LoRa Mesh',
    '12 nodes · 1 mesh · 4,127 lives',
    'Smart · sustainable · indigenous mining',
  ];

  return (
    <footer
      className="border-t"
      style={{
        borderColor: 'var(--line)',
        background: 'var(--bg-2)',
      }}
    >
      <MarqueeTrack items={marqueeItems} />

      <div className="mx-auto max-w-[1600px] px-4 py-8 md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <AshokaEmblem size={34} />
            <div>
              <div
                className="font-display text-[14px] font-700"
                style={{ color: 'var(--ink)' }}
              >
                BHURAKSHA EWS
              </div>
              <div
                className="text-[12px]"
                style={{ color: 'var(--mute)' }}
              >
                {t('footerSys') ||
                  'National Mine Subsidence Early Warning System'}
              </div>
            </div>
          </div>

          <div
            className="flex flex-wrap items-center gap-x-8 gap-y-2 text-[12px]"
            style={{ color: 'var(--mute)' }}
          >
            <span>National Early-Warning Network · Coal India Ltd.</span>
            <span>
              {t('emergencyWord') || 'Emergency'}:{' '}
              <a
                href="tel:112"
                className="font-700"
                style={{ color: 'var(--red)' }}
              >
                112
              </a>
            </span>
            <span style={{ color: 'var(--ink-2)' }}>
              Team Bhuraksha © MMXXV
            </span>
          </div>
        </div>

        <div
          className="mt-5 border-t pt-4 text-[11.5px]"
          style={{
            borderColor: 'var(--line)',
            color: 'var(--mute)',
          }}
        >
          Demonstration console · simulation ×17 time dilation · field
          deployment runs at real time 1×
        </div>
      </div>

      <div className="tricolor h-1" />
    </footer>
  );
};
