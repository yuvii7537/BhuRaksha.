import React from 'react';
import { useBhu, jl } from '../context/BhuContext';
import { useLang } from '../context/LangContext';
import { ViewMode } from '../types';
import { AshokaEmblem, StatusDot } from './UIElements';
import { LanguageModal } from './LanguageModal';
import { ThemeToggle } from './ThemeToggle';
import {
  Presentation,
  Users,
  LayoutDashboard,
  Wifi,
  WifiOff,
} from 'lucide-react';

interface HeaderProps {
  mode: ViewMode;
  onMode: (mode: ViewMode) => void;
}

export const Header: React.FC<HeaderProps> = ({ mode, onMode }) => {
  const state = useBhu();
  const { t } = useLang();
  const isEvent = state.tMinus !== null;

  const navItems: {
    key: ViewMode;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
  }[] = [
    { key: 'demo', label: t('navDemo') || 'Demo', icon: Presentation },
    { key: 'villager', label: t('navVillager') || 'Villager', icon: Users },
    { key: 'admin', label: t('navAdmin') || 'Admin', icon: LayoutDashboard },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-[120]">
      {/* Top Bharat Tricolor Stripe */}
      <div className="tricolor h-[3px]" />

      <div
        className="border-b backdrop-blur-md"
        style={{
          borderColor: 'var(--line)',
          background: 'color-mix(in srgb, var(--bg) 92%, transparent)',
        }}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 py-2.5 md:px-8">
          {/* Brand Logo & Title */}
          <button
            onClick={() => onMode('home')}
            className="focus-ring flex shrink-0 items-center gap-2.5 text-left cursor-pointer"
          >
            <AshokaEmblem size={36} />
            <span className="leading-tight">
              <span
                className="font-display flex items-center gap-1.5 text-[16px] font-800 tracking-tight"
                style={{ color: 'var(--ink)' }}
              >
                <span>BHURAKSHA</span>
                <span
                  className="rounded border px-1.5 py-0.2 font-mono text-[9.5px] font-700 tracking-wider"
                  style={{
                    borderColor: 'var(--saffron)',
                    color: 'var(--saffron)',
                    background: 'var(--saffron-sw)',
                  }}
                >
                  EWS
                </span>
              </span>
              <span
                className="hidden max-w-[240px] truncate text-[10.5px] sm:block"
                style={{ color: 'var(--mute)' }}
              >
                {t('brandSub') || 'Mine Subsidence Early Warning System'}
              </span>
            </span>
          </button>

          {/* Center Navigation Capsule Tabs */}
          <nav
            className="hide-scroll flex items-center gap-1 overflow-x-auto rounded-full border p-1"
            style={{
              borderColor: 'var(--line)',
              background: 'var(--surface)',
            }}
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = mode === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => onMode(item.key)}
                  className="focus-ring flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-[13px] font-600 transition-all duration-300 cursor-pointer"
                  style={{
                    background: active ? 'var(--ink)' : 'transparent',
                    color: active ? 'var(--surface)' : 'var(--ink-2)',
                  }}
                >
                  <Icon size={14} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Status Indicator, Language & Theme Controls */}
          <div className="flex shrink-0 items-center gap-2">
            <span
              className="mr-1 hidden items-center gap-2 font-mono text-[11.5px] lg:flex"
              style={{
                color: isEvent
                  ? 'var(--red)'
                  : state.connected
                  ? 'var(--green)'
                  : 'var(--mute)',
              }}
            >
              {state.connected ? <Wifi size={13} /> : <WifiOff size={13} />}
              {isEvent ? (
                <>
                  <StatusDot tone="crit" size={6} /> T−{jl(state.tMinus)}
                </>
              ) : state.connected ? (
                t('navLinked') || 'Linked'
              ) : (
                t('navOffline') || 'Offline'
              )}
            </span>

            <LanguageModal compact={true} />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};
