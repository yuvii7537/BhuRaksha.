import React, { useState } from 'react';
import { useBhu, useCheckpoints, jl, zt } from '../context/BhuContext';
import { useLang } from '../context/LangContext';
import { SandboxSubMode } from '../types';
import { Badge, Label } from '../components/UIElements';
import { SiteMap } from '../components/SiteMap';
import { VillagerPhoneCard } from '../components/VillagerPhoneCard';
import { VillagerView } from './VillagerView';
import { AdminView } from './AdminView';
import { SandboxTopBar } from '../components/SandboxTopBar';
import { SandboxBottomBar } from '../components/SandboxBottomBar';
import { EvacuationStatusWidget } from '../components/EvacuationStatusWidget';
import {
  Presentation,
  Play,
  RotateCcw,
  CheckCircle,
  CircleDot,
  Circle,
  Gamepad2,
  ArrowRight,
  ArrowLeft,
  Megaphone,
  LayoutDashboard,
  Users,
  Lock,
} from 'lucide-react';

export const DemoView: React.FC = () => {
  const state = useBhu();
  const { t } = useLang();
  const [subMode, setSubMode] = useState<SandboxSubMode>('main');
  const checkpoints = useCheckpoints(state);

  const isEvent = state.tMinus !== null;
  const isRunning = state.phaseIdx !== -1;

  if (subMode === 'sb-admin') {
    return (
      <div className="pb-24">
        <SandboxTopBar
          title="Admin console"
          onBack={() => setSubMode('pick')}
        />
        <div className="pt-16">
          <AdminView sandbox={true} />
        </div>
        <SandboxBottomBar />
      </div>
    );
  }

  if (subMode === 'sb-villager') {
    return (
      <div className="pb-24">
        <SandboxTopBar
          title="Villager site"
          onBack={() => setSubMode('pick')}
        />
        <div className="pt-16">
          <VillagerView embedded={false} />
        </div>
        <SandboxBottomBar />
      </div>
    );
  }

  if (subMode === 'pick') {
    const sandboxCards = [
      {
        key: 'sb-villager' as const,
        icon: Users,
        title: t('publicAlert') || 'Public Villager Alert',
        desc: 'Operate the citizen-facing emergency evacuation portal in real time.',
        points: [
          'High-contrast warning banner & countdown',
          'Emergency speed dial directory',
          'One-click multi-lingual audio broadcast',
        ],
      },
      {
        key: 'sb-admin' as const,
        icon: LayoutDashboard,
        title: t('controlRoom') || 'District Control Room',
        desc: 'Operate the geotechnical monitoring console with live telemetry controls.',
        points: [
          '12 Sentinel Nodes live sensor status table',
          'Trigger field subsidence events on demand',
          'Simulated / live ESP32 serial gateway binding',
        ],
      },
    ];

    return (
      <div className="mx-auto max-w-[1200px] px-4 pb-16 pt-28 md:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="lbl" style={{ color: 'var(--saffron)' }}>
              Interactive Sandbox Mode
            </div>
            <h1
              className="font-display mt-2 text-[26px] font-700 leading-tight md:text-[32px]"
              style={{ color: 'var(--ink)' }}
            >
              {t('sandbox') || 'Self-operated sandbox'}
            </h1>
            <p className="mt-1 text-[13.5px]" style={{ color: 'var(--mute)' }}>
              {t('sandboxD') || 'Admin & villager · operate yourself'}
            </p>
          </div>

          <button
            onClick={() => setSubMode('main')}
            className="focus-ring flex items-center gap-2 rounded-md border px-4 py-2.5 text-[12.5px] font-600 transition-colors cursor-pointer"
            style={{
              borderColor: 'var(--line-2)',
              background: 'var(--surface)',
              color: 'var(--ink-2)',
            }}
          >
            <ArrowLeft size={14} />
            <span>{t('backGuided') || 'Back to guided demo'}</span>
          </button>
        </div>

        <div
          className="rounded-lg border p-6 shadow-sm"
          style={{
            borderColor: 'var(--line)',
            background: 'var(--surface-2)',
          }}
        >
          <p className="text-[13.5px] leading-relaxed" style={{ color: 'var(--ink-2)' }}>
            In the sandbox, the automatic scenario controller is disabled. A toolbar stays anchored at the bottom so{' '}
            <strong>you</strong> decide when the ground moves and when the alert goes out. Both share one live mesh, so a trigger in the admin console is felt instantly on the villager site.
          </p>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {sandboxCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <button
                key={card.key}
                onClick={() => setSubMode(card.key)}
                className="focus-ring group flex h-full flex-col rounded-lg border p-6 text-left transition-all duration-300 hover:-translate-y-1 cursor-pointer shadow-sm"
                style={{
                  borderColor: 'var(--line)',
                  background: 'var(--surface)',
                }}
              >
                <div className="flex items-start justify-between">
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-md border"
                    style={{
                      borderColor: 'var(--line)',
                      background: 'var(--surface-2)',
                    }}
                  >
                    <Icon size={21} style={{ color: 'var(--saffron)' }} />
                  </span>
                  <span
                    className="font-display text-[26px] font-700"
                    style={{ color: 'var(--line-2)' }}
                  >
                    0{idx + 1}
                  </span>
                </div>

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
                  {card.points.map((pt, pIdx) => (
                    <li
                      key={pIdx}
                      className="flex items-start gap-2.5 text-[12.5px]"
                      style={{ color: 'var(--ink-2)' }}
                    >
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45"
                        style={{ background: 'var(--saffron)' }}
                      />
                      <span>{pt}</span>
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
                  <span>{t('openOperate') || 'Open & operate'}</span>
                  <ArrowRight
                    size={14}
                    className="transition-transform duration-300 group-hover:translate-x-1.5"
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Main Presenter Console View
  return (
    <div className="mx-auto max-w-[1600px] px-4 pb-16 pt-24 md:px-8">
      {/* View Header */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="lbl" style={{ color: 'var(--saffron)' }}>
            Presenter console · live end-to-end
          </div>
          <h1
            className="font-display mt-2 text-[26px] font-700 leading-tight md:text-[32px]"
            style={{ color: 'var(--ink)' }}
          >
            {t('demoTitle') || 'Demo Mode — the full ten minutes, compressed'}
          </h1>
          <p
            className="mt-1.5 max-w-2xl text-[13.5px] leading-relaxed"
            style={{ color: 'var(--mute)' }}
          >
            {t('demoSub') ||
              'One scenario, two screens: what the village sees and what the district control room sees — same live mesh.'}
          </p>
        </div>

        <button
          onClick={() => setSubMode('pick')}
          className="focus-ring group flex items-center gap-3 rounded-lg border px-5 py-3 text-left transition-all duration-300 hover:-translate-y-0.5 cursor-pointer shadow-sm"
          style={{
            borderColor: 'var(--saffron)',
            background: 'var(--saffron-sw)',
          }}
        >
          <Gamepad2 size={17} style={{ color: 'var(--saffron)' }} />
          <span>
            <span
              className="block text-[12.5px] font-700"
              style={{ color: 'var(--saffron)' }}
            >
              {t('sandbox') || 'Self-operated sandbox'}
            </span>
            <span className="block text-[11.5px]" style={{ color: 'var(--mute)' }}>
              {t('sandboxD') || 'Admin & villager · operate yourself'}
            </span>
          </span>
          <ArrowRight
            size={15}
            style={{ color: 'var(--saffron)' }}
            className="transition-transform duration-300 group-hover:translate-x-1.5"
          />
        </button>
      </div>

      {/* 3-Column Parallel Demonstration View */}
      <div className="grid gap-4 xl:grid-cols-[350px_1fr_1fr]">
        {/* COLUMN 1: Scenario Controller & Checkpoints Rail */}
        <div
          className="hud-corner flex flex-col rounded-lg border p-5 shadow-sm"
          style={{
            borderColor: 'var(--line)',
            background: 'var(--surface)',
          }}
        >
          <Label>{t('controller') || 'Demo controller'}</Label>

          {/* Status Box */}
          <div
            className="mt-4 rounded-md border px-4 py-4"
            style={{
              borderColor: isEvent ? 'var(--red)' : 'var(--green)',
              background: isEvent ? 'var(--red-sw)' : 'var(--green-sw)',
            }}
          >
            <div
              className="flex items-center justify-between text-[12px] font-600"
              style={{ color: isEvent ? 'var(--red)' : 'var(--green)' }}
            >
              <span>{isEvent ? 'Event running' : 'Ground asleep'}</span>
              <span className="num">
                {isEvent ? `T−${jl(state.tMinus)}` : 'Standby'}
              </span>
            </div>
            <div
              className="font-display num mt-2 text-[40px] font-700 leading-none"
              style={{ color: isEvent ? 'var(--red)' : 'var(--green)' }}
            >
              {isEvent ? jl(state.tMinus) : '10:00'}
            </div>
            <div className="mt-1 text-[11.5px]" style={{ color: 'var(--mute)' }}>
              {isEvent
                ? 'Simulated minutes remaining'
                : 'Early-warning horizon'}
            </div>
          </div>

          {/* Action Trigger & Reset Buttons */}
          <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
            <button
              onClick={() => zt.trigger()}
              disabled={isRunning}
              className="focus-ring flex items-center justify-center gap-2.5 rounded-md px-4 py-3.5 text-[13.5px] font-700 transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer shadow-sm text-white"
              style={{
                background: 'var(--ink)',
              }}
            >
              <Play size={16} />
              <span>
                {isRunning
                  ? t('running') || 'Scenario live…'
                  : t('start') || 'Start demo scenario'}
              </span>
            </button>

            <button
              onClick={() => zt.reset()}
              title="Reset"
              className="focus-ring flex w-12 items-center justify-center rounded-md border transition-colors cursor-pointer"
              style={{
                borderColor: 'var(--line-2)',
                background: 'var(--surface)',
                color: 'var(--ink-2)',
              }}
            >
              <RotateCcw size={16} />
            </button>
          </div>

          <div
            className="mt-3 flex items-start gap-2 rounded-md border p-3 text-[11.5px] leading-relaxed"
            style={{
              borderColor: 'var(--line)',
              background: 'var(--surface-2)',
              color: 'var(--mute)',
            }}
          >
            <span className="h-2 w-2 mt-1 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <div>
              <strong style={{ color: 'var(--ink)' }}>Live Demo Mode:</strong> Demonstrates real-world DGMS early-warning sequence with LoRa telemetry, automatic countdown, and live villager evacuation tracking to Muster N-2.
            </div>
          </div>

          {/* 8 Checkpoints Rail */}
          <div className="mt-6 flex-1">
            <Label className="mb-3">
              {t('checkpoints') || 'Sequence checkpoints'}
            </Label>
            {checkpoints.map((cp, idx) => (
              <div
                key={cp.key}
                className="relative flex items-start gap-3 pb-4 last:pb-0"
              >
                {idx < checkpoints.length - 1 && (
                  <span
                    className="absolute left-[10px] top-6 h-[calc(100%-1.4rem)] w-px"
                    style={{
                      background:
                        cp.state === 'done' ? 'var(--green)' : 'var(--line)',
                    }}
                  />
                )}
                <span className="mt-0.5 shrink-0">
                  {cp.state === 'done' ? (
                    <CheckCircle
                      size={20}
                      style={{ color: 'var(--green)' }}
                    />
                  ) : cp.state === 'active' ? (
                    <span className="relative flex h-5 w-5 items-center justify-center">
                      <span
                        className="absolute h-full w-full animate-ping rounded-full opacity-40"
                        style={{ background: 'var(--saffron)' }}
                      />
                      <CircleDot
                        size={20}
                        style={{ color: 'var(--saffron)' }}
                      />
                    </span>
                  ) : (
                    <Circle size={20} style={{ color: 'var(--line-2)' }} />
                  )}
                </span>
                <div className="min-w-0">
                  <div
                    className="text-[12.5px] font-700"
                    style={{
                      color:
                        cp.state === 'done'
                          ? 'var(--green)'
                          : cp.state === 'active'
                          ? 'var(--saffron)'
                          : 'var(--mute)',
                    }}
                  >
                    {String(idx + 1).padStart(2, '0')} · {cp.label}
                  </div>
                  <div
                    className="mt-0.5 text-[11.5px] leading-snug"
                    style={{ color: 'var(--mute)' }}
                  >
                    {cp.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!isRunning && state.alerts.length > 6 && (
            <div
              className="mt-3 rounded-md border px-3.5 py-3 text-[12.5px] font-600"
              style={{
                borderColor: 'var(--green)',
                background: 'var(--green-sw)',
                color: 'var(--green)',
              }}
            >
              Scenario complete — 0 casualties, 4,127 accounted.
            </div>
          )}
        </div>

        {/* COLUMN 2: Public Villager Live Screen Preview */}
        <div className="flex flex-col">
          <div className="mb-2 flex items-center justify-between">
            <span
              className="flex items-center gap-2 text-[12.5px] font-600"
              style={{ color: 'var(--mute)' }}
            >
              <Megaphone size={14} />
              <span>
                {t('publicAlert') || 'Public villager alert'} · Ward 12
              </span>
            </span>
            <Badge tone={isEvent ? 'crit' : 'safe'}>
              {isEvent ? 'Broadcasting' : 'Idle'}
            </Badge>
          </div>
          <div className="min-h-[560px] flex-1">
            <VillagerPhoneCard />
          </div>
        </div>

        {/* COLUMN 3: District Control Room Live Console Preview */}
        <div className="flex flex-col">
          <div className="mb-2 flex items-center justify-between">
            <span
              className="flex items-center gap-2 text-[12.5px] font-600"
              style={{ color: 'var(--mute)' }}
            >
              <LayoutDashboard size={14} />
              <span>
                {t('controlRoom') || 'District control room'} · Unit 07
              </span>
            </span>
            <Badge tone={isEvent ? 'crit' : 'safe'}>
              {isEvent ? 'SOP-7 armed' : 'Standby'}
            </Badge>
          </div>

          <div
            className="flex flex-1 flex-col overflow-hidden rounded-lg border shadow-sm"
            style={{
              borderColor: 'var(--line)',
              background: 'var(--surface)',
            }}
          >
            {/* Top 3 metrics */}
            <div
              className="grid grid-cols-3 gap-px border-b"
              style={{
                borderColor: 'var(--line)',
                background: 'var(--line)',
              }}
            >
              {[
                [
                  'T-minus',
                  isEvent ? jl(state.tMinus) : '--:--',
                  isEvent ? 'var(--red)' : 'var(--green)',
                ],
                [
                  'AI risk',
                  `${Math.round(state.risk)}%`,
                  state.risk > 80
                    ? 'var(--red)'
                    : state.risk > 40
                    ? 'var(--saffron)'
                    : 'var(--green)',
                ],
                [
                  'Siren',
                  state.siren ? 'LIVE' : 'Off',
                  state.siren ? 'var(--red)' : 'var(--mute)',
                ],
              ].map(([lbl, val, col], idx) => (
                <div
                  key={idx}
                  className="px-3.5 py-3"
                  style={{ background: 'var(--surface)' }}
                >
                  <Label>{lbl}</Label>
                  <div
                    className="font-display num mt-1 text-[19px] font-700 leading-none"
                    style={{ color: col }}
                  >
                    {val}
                  </div>
                </div>
              ))}
            </div>

            <SiteMap className="min-h-[300px] flex-1" />

            {/* Quick Ledger Snapshot */}
            <div
              className="border-t p-4"
              style={{ borderColor: 'var(--line)' }}
            >
              <Label className="mb-2">Live ledger</Label>
              <div className="space-y-1.5 font-mono">
                {state.alerts.slice(0, 4).map((al, idx) => (
                  <div
                    key={`${al.t}-${idx}`}
                    className="flex gap-2 text-[11.5px]"
                    style={{ opacity: idx === 0 ? 1 : 0.6 }}
                  >
                    <span
                      className="shrink-0"
                      style={{ color: 'var(--mute)' }}
                    >
                      {al.t}
                    </span>
                    <span
                      className="truncate"
                      style={{ color: 'var(--ink-2)' }}
                    >
                      {al.msg}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Citizen Safe Evacuation & Muster Tracker (Image 5 in Demo) */}
      <div className="mt-6">
        <EvacuationStatusWidget />
      </div>
    </div>
  );
};
