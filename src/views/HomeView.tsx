import React from 'react';
import { useBhu, jl } from '../context/BhuContext';
import { useLang } from '../context/LangContext';
import { ViewMode } from '../types';
import {
  Badge,
  StatusDot,
  Label,
  AnimatedNumber,
  FadeIn,
} from '../components/UIElements';
import { SiteMap } from '../components/SiteMap';
import { SeismicAnalytics } from '../components/SeismicAnalytics';
import {
  Presentation,
  Users,
  LayoutDashboard,
  Wifi,
  WifiOff,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface HomeViewProps {
  onMode: (mode: ViewMode) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onMode }) => {
  const state = useBhu();
  const { t } = useLang();
  const isEvent = state.tMinus !== null;

  const modeCards: {
    mode: ViewMode;
    icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
    title: string;
    desc: string;
    bullets: string[];
    cta: string;
  }[] = [
    {
      mode: 'demo',
      icon: Presentation,
      title: t('demoT') || 'Guided Demo Mode',
      desc:
        t('demoD') ||
        'The full 10-minute subsidence scenario compressed into real-time demonstration with 8 checkpoints.',
      bullets: [
        'Presenter checkpoint rail',
        'Villager alert + control room, live',
        'Self-operated sandbox inside',
      ],
      cta: t('ctaDemo') || 'Launch demo scenario',
    },
    {
      mode: 'villager',
      icon: Users,
      title: t('vilT') || 'Public Villager Alert',
      desc:
        t('vilD') ||
        'High-contrast, audio-enabled emergency portal for residents of Gajpahari Ward 12 with evacuation routes.',
      bullets: [
        'Alert banner & live countdown',
        'Emergency numbers, one tap',
        '11 Indian languages',
      ],
      cta: t('ctaVil') || 'Open villager portal',
    },
    {
      mode: 'admin',
      icon: LayoutDashboard,
      title: t('admT') || 'District Control Room',
      desc:
        t('admD') ||
        'Engineering console for mine safety officers, featuring ESP32 gateway link and real-time geotechnical telemetry.',
      bullets: [
        'ESP32 Wi-Fi provisioning gate',
        'Live map + 12-node sentry grid',
        'Dispatch & event ledger',
      ],
      cta: t('ctaAdm') || 'Enter control room',
    },
  ];

  return (
    <div>
      <div className="mx-auto max-w-[1600px] px-4 pb-16 pt-28 md:px-8 md:pt-32">
        {/* Top Telemetry Strip */}
        <FadeIn>
          <div
            className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-3"
            style={{
              borderColor: 'var(--line)',
              background: 'var(--surface)',
            }}
          >
            <div
              className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[12.5px]"
              style={{ color: 'var(--mute)' }}
            >
              <span
                className="flex items-center gap-2 font-700"
                style={{
                  color: state.connected ? 'var(--green)' : 'var(--mute)',
                }}
              >
                {state.connected ? <Wifi size={14} /> : <WifiOff size={14} />}
                {state.connected
                  ? t('statusLive') || 'Gateway linked · system active'
                  : t('statusOffline') || 'Gateway offline · connect in admin'}
              </span>
              <span>Panel C · Gajpahari · Goaf 7</span>
              <span className="hidden md:inline">{state.clock} IST</span>
            </div>

            <div
              className="flex items-center gap-2 text-[12.5px] font-700"
              style={{
                color: isEvent ? 'var(--red)' : 'var(--green)',
              }}
            >
              {isEvent && <StatusDot tone="crit" size={7} />}
              {isEvent
                ? `${t('eventProgress') || 'Event in progress'} · T−${jl(
                    state.tMinus
                  )}`
                : t('sectorSecure') || 'Sector secure'}
            </div>
          </div>
        </FadeIn>

        {/* Hero Section */}
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <FadeIn delay={0.05}>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="saffron">Autonomous Geo-Mesh Protocol</Badge>
                <Badge tone="dim">Coal India Limited</Badge>
                <Badge tone="dim">Smart automation</Badge>
              </div>
            </FadeIn>

            <FadeIn delay={0.12}>
              <h1
                className="font-display mt-6 text-[clamp(2rem,4.4vw,3.6rem)] font-700 leading-[1.14]"
                style={{ color: 'var(--ink)' }}
              >
                <span style={{ color: 'var(--saffron)' }}>भूरक्षा</span> —{' '}
                {t('heroTitle') || 'Predictive Mine Subsidence Early Warning'}
              </h1>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p
                className="mt-6 max-w-xl text-[15.5px] leading-relaxed"
                style={{ color: 'var(--ink-2)' }}
              >
                {t('heroLede') ||
                  '12 edge-autonomous LoRa sentinel nodes deployed across Jharia Coalfield continuously measure micro-tilt, sub-surface strain, and seismic flex to predict catastrophic ground subsidence up to 10 minutes prior.'}
              </p>
            </FadeIn>

            <FadeIn delay={0.28}>
              <div
                className="mt-8 grid max-w-xl grid-cols-3 gap-px overflow-hidden rounded-lg border"
                style={{
                  borderColor: 'var(--line)',
                  background: 'var(--line)',
                }}
              >
                {[
                  [
                    <AnimatedNumber key="a" to={10} duration={1.3} />,
                    t('statMin') || 'Min warning horizon',
                  ],
                  [
                    <AnimatedNumber key="b" to={12} />,
                    t('statNodes') || 'Autonomous sentinels',
                  ],
                  [
                    <AnimatedNumber key="c" to={4127} />,
                    t('statCitizens') || 'Residents safeguarded',
                  ],
                ].map(([val, label], idx) => (
                  <div
                    key={idx}
                    className="px-4 py-4"
                    style={{ background: 'var(--surface)' }}
                  >
                    <div
                      className="font-display num text-[26px] font-700"
                      style={{ color: 'var(--ink)' }}
                    >
                      {val}
                    </div>
                    <div
                      className="mt-1 text-[11.5px]"
                      style={{ color: 'var(--mute)' }}
                    >
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.18}>
            <div
              className="overflow-hidden rounded-lg border shadow-sm"
              style={{
                borderColor: 'var(--line)',
                background: 'var(--surface)',
              }}
            >
              <div
                className="flex items-center justify-between border-b px-4 py-3"
                style={{ borderColor: 'var(--line)' }}
              >
                <span
                  className="text-[13px] font-600"
                  style={{ color: 'var(--ink)' }}
                >
                  {t('deploySite') || 'Deployment site: Panel C, Gajpahari'}
                </span>
                <span
                  className="flex items-center gap-2 text-[12px]"
                  style={{
                    color: state.connected ? 'var(--green)' : 'var(--mute)',
                  }}
                >
                  <StatusDot
                    tone={state.connected ? 'safe' : 'dim'}
                    size={6}
                    pulse={state.connected}
                  />
                  <span>12 nodes</span>
                </span>
              </div>
              <SiteMap className="h-[340px]" />
            </div>
          </FadeIn>
        </div>

        {/* Real-Time Seismic Analytics Section */}
        <FadeIn delay={0.2}>
          <SeismicAnalytics />
        </FadeIn>

        {/* 3 Interactive Operational Portals */}
        <div className="mt-16">
          <FadeIn>
            <div className="mb-5 flex items-center gap-4">
              <span className="h-px flex-1" style={{ background: 'var(--line)' }} />
              <Label>{t('selectMode') || 'Select operational mode'}</Label>
              <span className="h-px flex-1" style={{ background: 'var(--line)' }} />
            </div>
          </FadeIn>

          <div className="grid gap-5 md:grid-cols-3">
            {modeCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <FadeIn key={card.mode} delay={0.07 * idx}>
                  <button
                    onClick={() => onMode(card.mode)}
                    className="focus-ring group flex h-full w-full flex-col rounded-lg border p-6 text-left transition-all duration-300 hover:-translate-y-1.5 cursor-pointer shadow-sm"
                    style={{
                      borderColor: 'var(--line)',
                      background: 'var(--surface)',
                    }}
                  >
                    <span
                      className="flex h-11 w-11 items-center justify-center rounded-md border"
                      style={{
                        borderColor: 'var(--line)',
                        background: 'var(--surface-2)',
                      }}
                    >
                      <Icon size={19} style={{ color: 'var(--saffron)' }} />
                    </span>

                    <h3
                      className="font-display mt-5 text-[19px] font-700"
                      style={{ color: 'var(--ink)' }}
                    >
                      {card.title}
                    </h3>
                    <p
                      className="mt-2 text-[13px] leading-relaxed"
                      style={{ color: 'var(--mute)' }}
                    >
                      {card.desc}
                    </p>

                    <ul className="mt-4 space-y-2 flex-1">
                      {card.bullets.map((bullet, bIdx) => (
                        <li
                          key={bIdx}
                          className="flex items-start gap-2.5 text-[12.5px]"
                          style={{ color: 'var(--ink-2)' }}
                        >
                          <span
                            className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45"
                            style={{ background: 'var(--saffron)' }}
                          />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>

                    <div
                      className="mt-6 flex items-center gap-2 border-t pt-4 text-[12.5px] font-700"
                      style={{
                        borderColor: 'var(--line)',
                        color: 'var(--saffron)',
                      }}
                    >
                      <span>{card.cta}</span>
                      <ArrowRight
                        size={14}
                        className="transition-transform duration-300 group-hover:translate-x-1.5"
                      />
                    </div>
                  </button>
                </FadeIn>
              );
            })}
          </div>
        </div>

        {/* Technical Highlights Badges */}
        <FadeIn delay={0.1}>
          <div
            className="mt-14 flex flex-wrap items-center justify-center gap-x-9 gap-y-3 rounded-lg border px-6 py-4"
            style={{
              borderColor: 'var(--line)',
              background: 'var(--surface)',
            }}
          >
            {[
              'Edge-autonomous · 0 internet needed',
              'DGMS-aligned SOP-7',
              'Offline-first GIS',
              'AES-128 mesh',
              'Made in India',
            ].map((text, idx) => (
              <span
                key={idx}
                className="flex items-center gap-2 text-[12.5px]"
                style={{ color: 'var(--mute)' }}
              >
                <ShieldCheck size={14} style={{ color: 'var(--green)' }} />
                <span>{text}</span>
              </span>
            ))}
          </div>
        </FadeIn>
      </div>
    </div>
  );
};
