import React, { useState } from 'react';
import { useBhu, jl, zt } from '../context/BhuContext';
import { useLang } from '../context/LangContext';
import { Badge, Label, StatusDot } from '../components/UIElements';
import { SiteMap } from '../components/SiteMap';
import { WifiModal } from '../components/WifiModal';
import { EvacuationStatusWidget } from '../components/EvacuationStatusWidget';
import { SentryBatteryAnalytics } from '../components/SentryBatteryAnalytics';
import { AdminLogin } from '../components/AdminLogin';
import {
  Siren,
  Smartphone,
  Send,
  RotateCcw,
  Zap,
  Terminal,
  Unplug,
  PlugZap,
  Clock,
  Layers,
  Lock,
  AlertTriangle,
  Radio,
  ShieldCheck,
  CheckCircle2,
  Users,
  LogOut,
} from 'lucide-react';

export const AdminView: React.FC<{ sandbox?: boolean }> = ({
  sandbox = false,
}) => {
  const liveState = useBhu();
  const { t } = useLang();
  const [showHardwareModal, setShowHardwareModal] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState<'console' | 'villagers'>('console');
  const [adminUser, setAdminUser] = useState<{ name: string; email: string; role: string } | null>(() => {
    if (sandbox) {
      return {
        name: 'Cmdr. Y. Satpute',
        email: 'incident.commander@dgms.gov.in',
        role: 'District Incident Commander',
      };
    }
    const saved = localStorage.getItem('bhuraksha_admin_auth');
    return saved ? JSON.parse(saved) : null;
  });

  const state = liveState;
  const isCached = zt.cached !== null;
  const isOperable = liveState.connected || !sandbox;

  if (!adminUser && !sandbox) {
    return (
      <div className="pt-24 pb-16 px-4">
        <AdminLogin
          onLoginSuccess={(user) => {
            setAdminUser(user);
            localStorage.setItem('bhuraksha_admin_auth', JSON.stringify(user));
          }}
        />
      </div>
    );
  }

  // Gauge needle rotation: from -115 deg to +115 deg
  const needleDeg = -115 + ((state?.risk ?? 0) / 100) * 230;
  const gaugeColor = state
    ? state.risk > 80
      ? 'var(--red)'
      : state.risk > 40
      ? 'var(--saffron)'
      : 'var(--green)'
    : 'var(--mute)';

  return (
    <div
      className={`mx-auto max-w-[1600px] px-4 pb-16 md:px-8 ${
        sandbox ? 'pt-6' : 'pt-24'
      }`}
    >
      {/* Top Console Bar */}
      {!sandbox && (
        <div
          className="mb-6 flex flex-wrap items-end justify-between gap-4 rounded-lg border px-5 py-4"
          style={{
            borderColor: 'var(--line)',
            background: 'var(--surface)',
          }}
        >
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="saffron">DGMS SOP-7 COMPLIANT</Badge>
              <Badge tone={liveState.connected ? 'safe' : 'crit'}>
                {liveState.connected ? 'LIVE TELEMETRY · ACTIVE' : 'ADMIN DISABLED · ESP32 OFFLINE'}
              </Badge>
              {isCached && <Badge tone="warn">CACHED BUFFER</Badge>}
            </div>
            <h1
              className="font-display mt-2 text-[22px] font-700 leading-tight md:text-[28px]"
              style={{ color: 'var(--ink)' }}
            >
              {t('admTitle') || 'District Control Room · Jharia Coalfield'}
            </h1>
            <p className="mt-1 text-[13px]" style={{ color: 'var(--mute)' }}>
              {t('admSub') ||
                'Edge-autonomous telemetry console · 12-node LoRa mesh above Goaf 7'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowHardwareModal(!showHardwareModal)}
              className="focus-ring flex items-center gap-1.5 rounded-md border px-3 py-2 text-[12px] font-600 transition-colors cursor-pointer"
              style={{
                borderColor: showHardwareModal ? 'var(--saffron)' : 'var(--line-2)',
                background: showHardwareModal ? 'var(--saffron-sw)' : 'var(--surface-2)',
                color: showHardwareModal ? 'var(--saffron)' : 'var(--ink-2)',
              }}
            >
              <Radio size={13} />
              <span>{showHardwareModal ? 'Close Hardware Panel' : 'ESP32 Gateway Link'}</span>
            </button>

            {liveState.connected ? (
              <button
                onClick={() => zt.disconnect()}
                className="focus-ring flex items-center gap-1.5 rounded-md border px-3 py-2 text-[12px] font-600 transition-colors cursor-pointer"
                style={{
                  borderColor: 'var(--line-2)',
                  background: 'var(--surface-2)',
                  color: 'var(--ink-2)',
                }}
              >
                <Unplug size={13} />
                <span>{t('disconnect') || 'Disconnect link'}</span>
              </button>
            ) : (
              <button
                onClick={() => setShowHardwareModal(true)}
                className="focus-ring flex items-center gap-1.5 rounded-md px-3.5 py-2 text-[12px] font-700 text-white transition-opacity hover:opacity-90 cursor-pointer"
                style={{ background: 'var(--green)' }}
              >
                <PlugZap size={13} />
                <span>Connect ESP32</span>
              </button>
            )}

            {adminUser && (
              <div
                className="flex items-center gap-2 rounded-md border px-3 py-1.5 text-[11.5px]"
                style={{ borderColor: 'var(--line)', background: 'var(--surface-2)' }}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-[9.5px]">
                  YS
                </span>
                <div className="hidden sm:block">
                  <div className="font-bold leading-tight" style={{ color: 'var(--ink)' }}>
                    {adminUser.name}
                  </div>
                  <div className="text-[10px]" style={{ color: 'var(--mute)' }}>
                    {adminUser.role}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setAdminUser(null);
                    localStorage.removeItem('bhuraksha_admin_auth');
                  }}
                  title="Sign out of command session"
                  className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                >
                  <LogOut size={11} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hardware Connection State Banner: Disabled warning or Active confirmation */}
      {!liveState.connected ? (
        <div
          className="mb-6 rounded-lg border-2 p-5 shadow-sm"
          style={{
            borderColor: 'var(--saffron)',
            background: 'var(--saffron-sw)',
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg shadow-sm"
                style={{ background: 'var(--saffron)', color: '#ffffff' }}
              >
                <Lock size={22} />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2
                    className="font-display text-[16px] font-700 tracking-tight"
                    style={{ color: 'var(--ink)' }}
                  >
                    Admin Console Disabled · ESP32 Hardware Not Connected
                  </h2>
                  <Badge tone="crit">CONTROLS LOCKED</Badge>
                </div>
                <p
                  className="mt-1 text-[13px] leading-relaxed max-w-3xl"
                  style={{ color: 'var(--ink-2)' }}
                >
                  As per DGMS SOP-7 safety protocols, the District Control Room console is disabled until live ESP32 hardware is connected. Field event injection, emergency alerts, and live mesh telemetry remain locked. Displaying last recorded historical cache.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setShowHardwareModal(true)}
                className="focus-ring flex items-center gap-2 rounded-md px-4 py-2.5 text-[13px] font-700 text-white shadow transition-all hover:opacity-90 cursor-pointer"
                style={{ background: 'var(--green)' }}
              >
                <PlugZap size={15} />
                <span>Connect ESP32 (Wi-Fi or Port)</span>
              </button>
              <button
                onClick={() => zt.simulateConnect('wifi')}
                className="focus-ring flex items-center gap-1.5 rounded-md border px-3 py-2.5 text-[12px] font-600 transition-colors cursor-pointer"
                style={{
                  borderColor: 'var(--line-2)',
                  background: 'var(--surface)',
                  color: 'var(--ink)',
                }}
              >
                <span>Simulate Link (Test)</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border px-5 py-3 shadow-sm"
          style={{
            borderColor: 'var(--green)',
            background: 'var(--green-sw)',
          }}
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={18} style={{ color: 'var(--green)' }} />
            <span className="text-[13px] font-700" style={{ color: 'var(--green)' }}>
              ADMIN CONSOLE OPERATIONAL · ESP32 {liveState.connectionType === 'usb' ? 'USB SERIAL PORT' : 'WI-FI GATEWAY'} LINKED & VERIFIED
            </span>
          </div>
          <span className="font-mono text-[11.5px] font-600" style={{ color: 'var(--ink-2)' }}>
            Endpoint: {liveState.espIp || '192.168.4.1'} · Command Authority Active
          </span>
        </div>
      )}

      {/* Hardware Gateway Wi-Fi / USB Modal Card */}
      {showHardwareModal && (
        <div className="mb-6 animate-fadeIn">
          <WifiModal s={liveState} />
        </div>
      )}

      {/* Live Admin Safe Arrival Notification Banner */}
      {state?.recentSafeArrival && (
        <div
          className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border px-5 py-3.5 shadow-sm"
          style={{
            borderColor: 'var(--green)',
            background: 'var(--green-sw)',
            color: 'var(--ink)',
          }}
        >
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white shadow">
              <CheckCircle2 size={20} />
            </span>
            <div>
              <div className="text-[13.5px] font-700 text-emerald-800 dark:text-emerald-300">
                SAFE ZONE ARRIVAL NOTIFICATION: {state.recentSafeArrival.villagerName} ({state.recentSafeArrival.groupSize} citizens) has reached safely!
              </div>
              <div className="text-[12px] opacity-85">
                Checked into {state.recentSafeArrival.zoneName} · Resident status automatically updated to SAFE
              </div>
            </div>
          </div>
          <span className="font-mono text-[12px] font-bold opacity-80">
            {state.recentSafeArrival.t}
          </span>
        </div>
      )}

      {/* Admin Navigation Tabs */}
      <div className="mb-5 flex flex-wrap items-center gap-2 border-b pb-3" style={{ borderColor: 'var(--line)' }}>
        <button
          onClick={() => setActiveAdminTab('console')}
          className="focus-ring flex items-center gap-2 rounded-lg px-4 py-2 text-[13px] font-700 transition-colors cursor-pointer"
          style={{
            background: activeAdminTab === 'console' ? 'var(--ink)' : 'var(--surface-2)',
            color: activeAdminTab === 'console' ? 'var(--surface)' : 'var(--ink-2)',
          }}
        >
          <Layers size={14} />
          <span>Control Room Console (Sentry Grid & Site Map)</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('villagers')}
          className="focus-ring flex items-center gap-2 rounded-lg px-4 py-2 text-[13px] font-700 transition-colors cursor-pointer"
          style={{
            background: activeAdminTab === 'villagers' ? 'var(--ink)' : 'var(--surface-2)',
            color: activeAdminTab === 'villagers' ? 'var(--surface)' : 'var(--ink-2)',
          }}
        >
          <Users size={14} />
          <span>Know Villagers & Safe Arrival Tracker (Image 5)</span>
          <span
            className="ml-1 rounded px-1.5 py-0.2 text-[10px] font-bold"
            style={{
              background:
                state.villagers.filter((v) => v.status === 'safe').length === state.villagers.length
                  ? 'var(--green-sw)'
                  : 'var(--saffron-sw)',
              color:
                state.villagers.filter((v) => v.status === 'safe').length === state.villagers.length
                  ? 'var(--green)'
                  : 'var(--saffron)',
            }}
          >
            {state.villagers.filter((v) => v.status === 'safe').length}/{state.villagers.length} Safe
          </span>
        </button>
      </div>

      {activeAdminTab === 'villagers' ? (
        /* TAB 2: KNOW VILLAGERS & EVACUATION STATUS (IMAGE 5) */
        <div className="space-y-6">
          <EvacuationStatusWidget />
        </div>
      ) : (
        /* TAB 1: MAIN CONTROL PANEL DASHBOARD */
        <>
          <div className="grid gap-4 lg:grid-cols-[330px_1fr_360px]">
            {/* LEFT COLUMN: 12-Node Sentinel Grid & Mesh Topology */}
            <div
              className="flex flex-col rounded-lg border p-4 shadow-sm"
              style={{
                borderColor: 'var(--line)',
                background: 'var(--surface)',
              }}
            >
              <div className="mb-3 flex items-center justify-between">
                <Label>
                  {state.connected
                    ? t('sentryGrid') || 'Sentinel Grid · 12 Nodes'
                    : 'Sentinel Grid · Recent Baseline'}
                </Label>
                <span
                  className="flex items-center gap-1 text-[11px] font-mono"
                  style={{ color: state.connected ? 'var(--green)' : 'var(--mute)' }}
                >
                  <StatusDot tone={state.connected ? 'safe' : 'dim'} size={6} />
                  <span>
                    {state.connected ? 'ALL SENSORS REPORTING' : 'RECENT BASELINE (OFFLINE)'}
                  </span>
                </span>
              </div>

            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-3">
              {state.nodes.map((node) => {
                const nodeColor =
                  node.status === 'CRIT'
                    ? 'var(--red)'
                    : node.status === 'WARN'
                    ? 'var(--amber)'
                    : 'var(--green)';

                return (
                  <div
                    key={node.id}
                    className="rounded border p-2 text-center transition-colors"
                    style={{
                      borderColor:
                        node.status === 'OK' ? 'var(--line)' : nodeColor,
                      background: 'var(--surface-2)',
                    }}
                  >
                    <div className="flex items-center justify-between text-[10.5px]">
                      <span
                        className="font-mono font-600"
                        style={{ color: 'var(--mute)' }}
                      >
                        {node.label}
                      </span>
                      <span
                        className={`h-2 w-2 rounded-full ${
                          node.status === 'CRIT' && state.connected
                            ? 'animate-ping'
                            : ''
                        }`}
                        style={{ background: nodeColor }}
                      />
                    </div>
                    <div
                      className="font-mono num mt-1 text-[15px] font-700"
                      style={{
                        color: node.status === 'OK' ? 'var(--ink)' : nodeColor,
                      }}
                    >
                      {node.tilt.toFixed(2)}°
                    </div>
                    <div
                      className="mt-1 flex justify-between font-mono text-[10px]"
                      style={{ color: 'var(--mute)' }}
                    >
                      <span>{Math.round(node.vib)}mg</span>
                      <span>{Math.round(node.battery)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* LoRa Mesh Network Specifications */}
            <div
              className="mt-5 border-t pt-4"
              style={{ borderColor: 'var(--line)' }}
            >
              <Label className="mb-2.5">
                {t('meshProtocol') || 'Mesh Protocol'}
              </Label>
              {[
                ['Channel', 'LoRa 868.1 MHz'],
                ['Spreading', 'SF9 / BW125'],
                ['Topology', 'Self-healing ≤ 3 hops'],
                ['Cipher', 'AES-128'],
                ['Power', 'Solar + 18650'],
                ['Fallback', 'Cellular + BGAN'],
              ].map(([k, v], idx) => (
                <div
                  key={idx}
                  className="flex items-baseline justify-between gap-3 py-1 text-[12px]"
                >
                  <span style={{ color: 'var(--mute)' }}>{k}</span>
                  <span
                    className="font-mono text-[11.5px] text-right"
                    style={{ color: 'var(--ink-2)' }}
                  >
                    {v}
                  </span>
                </div>
              ))}
            </div>

            {/* Field Emergency Response Teams Status */}
            <div
              className="mt-4 border-t pt-4"
              style={{ borderColor: 'var(--line)' }}
            >
              <Label className="mb-2.5">
                {t('responseUnits') || 'Response Units'}
              </Label>
              {[
                ['Rescue Van 04', 'En route'],
                ['Marshal Team B', 'On site'],
                ['District Control', 'Line open'],
                ['CMO Jharia', state.siren ? 'Notified' : 'Standby'],
              ].map(([unit, status], idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-1 text-[12.5px]"
                >
                  <span style={{ color: 'var(--ink-2)' }}>{unit}</span>
                  <span
                    className="font-mono text-[11px]"
                    style={{
                      color:
                        idx === 3 && state.siren
                          ? 'var(--red)'
                          : 'var(--green)',
                    }}
                  >
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CENTER COLUMN: Live Interactive GIS Surface Map & Confidence Stats */}
          <div
            className="flex flex-col overflow-hidden rounded-lg border shadow-sm"
            style={{
              borderColor: 'var(--line)',
              background: 'var(--surface)',
            }}
          >
            <div
              className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3"
              style={{ borderColor: 'var(--line)' }}
            >
              <span
                className="text-[13px] font-600"
                style={{ color: 'var(--ink)' }}
              >
                {state.connected
                  ? 'Live site map — Gajpahari, Panel C (Real-Time LoRa Mesh)'
                  : 'Site map — Gajpahari, Panel C (Recent Known Layout)'}
              </span>
              {state.siren && state.connected && (
                <span
                  className="flex items-center gap-2 rounded px-2.5 py-1 text-[11.5px] font-700 text-white animate-pulse"
                  style={{ background: 'var(--red)' }}
                >
                  <Siren size={12} className="siren-glow" />
                  <span>118 dB SIREN LIVE</span>
                </span>
              )}
            </div>

            <SiteMap className="min-h-[430px] flex-1" />

            {/* Geotechnical Multi-Node Quorum Metrics */}
            <div
              className="grid grid-cols-2 gap-px border-t sm:grid-cols-4"
              style={{
                borderColor: 'var(--line)',
                background: 'var(--line)',
              }}
            >
              {[
                [
                  'AI confidence',
                  `${Math.round(state.correlation * 100)}%`,
                  state.correlation > 0.8 ? 'var(--red)' : 'var(--ink)',
                ],
                [
                  'Correlated nodes',
                  `${state.nodes.filter((n) => n.status !== 'OK').length} / 12`,
                  'var(--ink)',
                ],
                ['Packet loss', '0.3%', 'var(--green)'],
                ['Sensor health', '98.7%', 'var(--green)'],
              ].map(([label, val, color], idx) => (
                <div
                  key={idx}
                  className="px-4 py-3"
                  style={{ background: 'var(--surface)' }}
                >
                  <Label>{label}</Label>
                  <div
                    className="font-display num mt-1 text-[19px] font-700"
                    style={{ color: color as string }}
                  >
                    {val}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Early-Warning Horizon, Risk Dial, Triggers & SMS Log */}
          <div className="flex flex-col gap-4">
            {/* Countdown Box & Curved Risk Arc Gauge */}
            <div
              className="rounded-lg border p-4 shadow-sm"
              style={{
                borderColor: 'var(--line)',
                background: 'var(--surface)',
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Label>{t('timeToSub') || 'Time to Subsidence'}</Label>
                  <div
                    className="font-display num mt-1 text-[46px] font-700 leading-none"
                    style={{
                      color:
                        state.tMinus !== null &&
                        state.tMinus < 180 &&
                        state.tMinus > 0
                          ? 'var(--red)'
                          : state.tMinus !== null
                          ? 'var(--saffron)'
                          : 'var(--green)',
                    }}
                  >
                    {state.tMinus !== null ? jl(state.tMinus) : '--:--'}
                  </div>
                </div>

                {/* SVG Semi-Circular Risk Dial */}
                <svg viewBox="0 0 80 56" className="w-24 shrink-0">
                  <path
                    d="M8,46 A34,34 0 0 1 72,46"
                    fill="none"
                    stroke="var(--line)"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M8,46 A34,34 0 0 1 72,46"
                    fill="none"
                    stroke={gaugeColor}
                    strokeWidth="6"
                    strokeLinecap="round"
                    pathLength={100}
                    strokeDasharray="100"
                    strokeDashoffset={100 - state.risk}
                    style={{ transition: 'stroke-dashoffset .3s, stroke .3s' }}
                  />
                  <line
                    x1="40"
                    y1="46"
                    x2="40"
                    y2="19"
                    stroke="var(--ink)"
                    strokeWidth="1.8"
                    style={{
                      transform: `rotate(${needleDeg}deg)`,
                      transformOrigin: '40px 46px',
                      transition: 'transform .3s',
                    }}
                  />
                  <text
                    x="40"
                    y="54"
                    fill="var(--mute)"
                    fontSize="8"
                    fontFamily="JetBrains Mono"
                    textAnchor="middle"
                  >
                    RISK {Math.round(state.risk)}%
                  </text>
                </svg>
              </div>

              {/* SMS + App Dispatch Progress */}
              <div
                className="mt-4 rounded-md border px-3.5 py-3"
                style={{
                  borderColor: 'var(--line)',
                  background: 'var(--surface-2)',
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="flex items-center gap-2 text-[12px]"
                    style={{ color: 'var(--mute)' }}
                  >
                    <Smartphone size={12} />
                    <span>SMS + app dispatch</span>
                  </span>
                  <span
                    className="font-mono num text-[13.5px] font-700"
                    style={{
                      color:
                        state.smsSent >= 4127
                          ? 'var(--green)'
                          : 'var(--ink)',
                    }}
                  >
                    {state.smsSent.toLocaleString('en-IN')}/4,127
                  </span>
                </div>
                <div
                  className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full"
                  style={{ background: 'var(--line)' }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(state.smsSent / 4127) * 100}%`,
                      background: 'var(--green)',
                    }}
                  />
                </div>
              </div>

              {/* Emergency Operator Action Buttons */}
              <div className="mt-3 space-y-2">
                {state.connected ? (
                  <button
                    onClick={() => zt.trigger()}
                    disabled={zt.busy}
                    className="focus-ring flex w-full items-center justify-center gap-2 rounded-md px-3 py-3 text-[13px] font-700 text-white transition-opacity hover:opacity-90 disabled:opacity-40 cursor-pointer shadow-sm"
                    style={{ background: 'var(--red)' }}
                  >
                    <Zap size={14} />
                    <span>{t('injectField') || 'Inject subsidence event'}</span>
                  </button>
                ) : (
                  <div
                    className="flex items-center justify-center gap-2 rounded-md border px-3 py-2.5 text-[11.5px] font-medium"
                    style={{
                      borderColor: 'var(--line)',
                      background: 'var(--surface-2)',
                      color: 'var(--mute)',
                    }}
                  >
                    <Lock size={12} className="text-amber-500" />
                    <span>Field Event Injection (Locked until ESP32 Link)</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  {state.adminForceSmsActive ? (
                    <button
                      onClick={() => zt.cancelForceSms()}
                      disabled={!state.connected || zt.busy}
                      className="focus-ring flex items-center justify-center gap-1.5 rounded-md border px-2 py-2.5 text-[12px] font-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      style={{
                        borderColor: 'var(--green)',
                        background: 'var(--green-sw)',
                        color: 'var(--green)',
                      }}
                    >
                      <RotateCcw size={12} />
                      <span>Cancel Alert</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => zt.manualSms()}
                      disabled={!state.connected || zt.busy}
                      title={!state.connected ? 'Connect ESP32 hardware to enable emergency SMS broadcast' : ''}
                      className="focus-ring flex items-center justify-center gap-1.5 rounded-md border px-2 py-2.5 text-[12px] font-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      style={{
                        borderColor: 'var(--red)',
                        background: 'var(--red-sw)',
                        color: 'var(--red)',
                      }}
                    >
                      <Send size={12} />
                      <span>{t('forceSms') || 'Force SMS'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => zt.reset()}
                    disabled={!state.connected || zt.busy}
                    title={!state.connected ? 'Connect ESP32 hardware to enable reset' : ''}
                    className="focus-ring flex items-center justify-center gap-1.5 rounded-md border px-2 py-2.5 text-[12px] font-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    style={{
                      borderColor: 'var(--line-2)',
                      background: 'var(--surface)',
                      color: 'var(--ink-2)',
                    }}
                  >
                    <RotateCcw size={12} />
                    <span>{t('reset') || 'Reset'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Event Ledger Live Stream */}
            <div
              className="flex-1 rounded-lg border p-4 shadow-sm"
              style={{
                borderColor: 'var(--line)',
                background: 'var(--surface)',
              }}
            >
              <Label className="mb-2.5 flex items-center gap-1.5">
                <Terminal size={12} />
                <span>{t('eventLedger') || 'Event Ledger'}</span>
              </Label>
              <div className="hide-scroll max-h-[320px] space-y-2 overflow-y-auto font-mono">
                {state.alerts.slice(0, 14).map((alert, idx) => {
                  const lvlColor =
                    alert.lvl === 'CRIT'
                      ? 'var(--red)'
                      : alert.lvl === 'WARN'
                      ? 'var(--amber)'
                      : alert.lvl === 'SAFE'
                      ? 'var(--green)'
                      : 'var(--blue)';

                  return (
                    <div
                      key={`${alert.t}-${idx}`}
                      className="flex gap-2 text-[11.5px] leading-relaxed"
                      style={{ opacity: idx === 0 ? 1 : 0.68 }}
                    >
                      <span
                        className="shrink-0"
                        style={{ color: 'var(--mute)' }}
                      >
                        {alert.t}
                      </span>
                      <span
                        className="shrink-0 font-700"
                        style={{ color: lvlColor }}
                      >
                        {alert.lvl}
                      </span>
                      <span style={{ color: 'var(--ink-2)' }}>
                        {alert.msg}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Live Villager Evacuation Status Widget */}
        <div className="mt-5">
          <EvacuationStatusWidget />
        </div>

        {/* 24-Hour Battery Health Trends Recharts Graph */}
        <div className="mt-5">
          <SentryBatteryAnalytics />
        </div>
      </>
    )}

      {/* DGMS Standards & Simulation Speed Bar */}
      <div
        className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border px-4 py-3 text-[11.5px]"
        style={{
          borderColor: 'var(--line)',
          background: 'var(--surface)',
          color: 'var(--mute)',
        }}
      >
        <span>
          DGMS-aligned SOP-7 · Edge-autonomous (surface siren triggers with 0
          internet)
        </span>
        <span style={{ color: 'var(--saffron)' }}>
          {isOperable
            ? 'Demo time-dilation ×17 — field rate 1×'
            : 'Awaiting ESP32 link'}
        </span>
      </div>
    </div>
  );
};
