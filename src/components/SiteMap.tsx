import React, { useState } from 'react';
import { useBhu } from '../context/BhuContext';
import { useLang } from '../context/LangContext';
import { SchematicView } from './SchematicView';
import {
  Satellite as SatelliteIcon,
  Map as MapIcon,
  Layers as LayersIcon,
  Crosshair,
  ExternalLink,
  ShieldCheck,
  Users,
  Footprints,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

const Ks = { lat: 23.7402, lng: 86.4146 };

export const SiteMap: React.FC<{ className?: string }> = ({ className = '' }) => {
  const state = useBhu();
  const { t } = useLang();
  const [mapMode, setMapMode] = useState<'satellite' | 'street' | 'schematic'>('satellite');

  const embedUrl = `https://maps.google.com/maps?q=${Ks.lat},${Ks.lng}&t=${
    mapMode === 'satellite' ? 'k' : 'm'
  }&z=15&hl=en&ie=UTF8&output=embed`;

  const tabs: {
    k: 'satellite' | 'street' | 'schematic';
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
  }[] = [
    { k: 'satellite', label: t('satellite') || 'Satellite', icon: SatelliteIcon },
    { k: 'street', label: t('mapWord') || 'Map', icon: MapIcon },
    { k: 'schematic', label: t('schematic') || 'Schematic', icon: LayersIcon },
  ];

  return (
    <div
      className={`relative flex flex-col ${className}`}
      style={{ background: 'var(--surface-2)' }}
    >
      {/* Map Header Toolbar */}
      <div
        className="flex flex-wrap items-center justify-between gap-2 border-b px-3 py-2"
        style={{ borderColor: 'var(--line)' }}
      >
        <div className="flex items-center gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = mapMode === tab.k;
            return (
              <button
                key={tab.k}
                onClick={() => setMapMode(tab.k)}
                className="focus-ring flex items-center gap-1.5 rounded px-2.5 py-1.5 text-[11px] font-600 transition-colors cursor-pointer"
                style={{
                  background: active ? 'var(--ink)' : 'transparent',
                  color: active ? 'var(--surface)' : 'var(--mute)',
                }}
              >
                <Icon size={12} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <span className="lbl flex items-center gap-1.5">
            <Crosshair size={11} />
            <span>
              {Ks.lat}° N · {Ks.lng}° E
            </span>
          </span>
          <a
            href={`https://www.google.com/maps/@${Ks.lat},${Ks.lng},15z`}
            target="_blank"
            rel="noreferrer"
            className="focus-ring flex items-center gap-1 text-[11px] font-600"
            style={{ color: 'var(--saffron)' }}
          >
            <span>OPEN</span>
            <ExternalLink size={11} />
          </a>
        </div>
      </div>

      {/* Main View Area */}
      <div className="relative min-h-[360px] flex-1 overflow-hidden">
        {mapMode === 'schematic' ? (
          <SchematicView className="absolute inset-0 h-full w-full" />
        ) : (
          <>
            <iframe
              key={mapMode}
              title="BHURAKSHA deployment site"
              src={embedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="map-frame absolute inset-0 h-full w-full border-0"
            />
            {/* Live Interactive Geotechnical Overlay */}
            <div className="pointer-events-none absolute inset-0">
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full"
              >
                {/* Underground Goaf footprint */}
                <rect
                  x="44"
                  y="48"
                  width="34"
                  height="16"
                  fill="var(--saffron)"
                  fillOpacity="0.14"
                  stroke="var(--saffron)"
                  strokeWidth="0.4"
                  strokeDasharray="2 1.6"
                  vectorEffect="non-scaling-stroke"
                />
                {/* Subsidence Epicenter Circle */}
                <circle
                  cx={state.epicenter.x}
                  cy={state.epicenter.y}
                  r={state.epicenter.r}
                  fill={
                    state.risk > 80
                      ? 'var(--red)'
                      : state.risk > 40
                      ? 'var(--saffron)'
                      : 'var(--green)'
                  }
                  fillOpacity="0.2"
                  stroke={state.risk > 80 ? 'var(--red)' : 'var(--saffron)'}
                  strokeWidth="0.5"
                  strokeDasharray="2 1.6"
                  className="dash-flow"
                  vectorEffect="non-scaling-stroke"
                />
                {/* Evacuation Trajectory to Gate N-2 */}
                <path
                  d="M52,82 Q40,60 26,40 T14,22"
                  fill="none"
                  stroke="var(--green)"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                  className="dash-flow-rev"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>

              {/* 12 Live Nodes Anchored on Satellite Terrain */}
              {state.nodes.map((node) => {
                const color =
                  node.status === 'CRIT'
                    ? 'var(--red)'
                    : node.status === 'WARN'
                    ? 'var(--amber)'
                    : 'var(--green)';
                return (
                  <div
                    key={node.id}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  >
                    {node.status !== 'OK' && (
                      <span
                        className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full"
                        style={{ background: color, opacity: 0.35 }}
                      />
                    )}
                    <span
                      className="relative flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 shadow-md"
                      style={{
                        background: 'var(--surface)',
                        borderColor: color,
                      }}
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: color }}
                      />
                    </span>
                  </div>
                );
              })}

              {/* Designated Safe Sanctuary: Gate N-2 */}
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                style={{ left: '14%', top: '22%' }}
              >
                <div className="relative flex flex-col items-center">
                  {/* Safe Zone Perimeter Beacon */}
                  <span
                    className="absolute -inset-3 rounded-full animate-ping opacity-30"
                    style={{ background: 'var(--green)' }}
                  />
                  <div
                    className="relative flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-700 text-white shadow-lg border border-white/40"
                    style={{ background: 'var(--green)' }}
                  >
                    <ShieldCheck size={13} />
                    <span>SAFE REFUGE N-2</span>
                  </div>
                </div>
              </div>

              {/* Live Villager Positions on the Map */}
              {(state.villagers || []).map((v) => {
                const isSafe = v.status === 'safe';
                const isMoving = v.status === 'moving';
                const isDanger = v.status === 'in-danger';

                const pinColor = isSafe
                  ? 'var(--green)'
                  : isMoving
                  ? 'var(--saffron)'
                  : 'var(--red)';

                return (
                  <div
                    key={v.id}
                    className="group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer pointer-events-auto transition-all duration-300 hover:z-30"
                    style={{ left: `${v.x}%`, top: `${v.y}%` }}
                  >
                    {/* Pulsing ring during danger or transit */}
                    {!isSafe && (
                      <span
                        className="absolute -inset-2.5 rounded-full animate-ping opacity-50"
                        style={{ background: pinColor }}
                      />
                    )}

                    {/* Villager Pin Avatar */}
                    <div
                      className="relative flex h-6 w-6 items-center justify-center rounded-full border-2 text-[10px] font-bold shadow-md transition-transform group-hover:scale-125"
                      style={{
                        background: isSafe ? 'var(--green)' : 'var(--surface)',
                        borderColor: pinColor,
                        color: isSafe ? '#fff' : pinColor,
                      }}
                    >
                      {isSafe ? (
                        <CheckCircle2 size={13} />
                      ) : isMoving ? (
                        <Footprints size={12} />
                      ) : (
                        <AlertTriangle size={12} />
                      )}
                    </div>

                    {/* Compact Name Tag */}
                    <div
                      className="absolute left-1/2 top-full mt-0.5 -translate-x-1/2 whitespace-nowrap rounded px-1.5 py-0.2 text-[9.5px] font-600 shadow-sm transition-opacity"
                      style={{
                        background: 'rgba(0, 0, 0, 0.75)',
                        color: '#fff',
                      }}
                    >
                      {v.name.split(' ')[0]}
                      {isSafe && ' ✓'}
                    </div>

                    {/* Detailed Hover Card */}
                    <div
                      className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 rounded-md border p-2.5 text-[11px] shadow-xl group-hover:block z-50 whitespace-nowrap"
                      style={{
                        background: 'var(--surface)',
                        borderColor: 'var(--line)',
                        color: 'var(--ink)',
                      }}
                    >
                      <div className="font-700 flex items-center gap-1.5">
                        <Users size={12} style={{ color: pinColor }} />
                        <span>{v.name}</span>
                        <span
                          className="rounded px-1 text-[9.5px] font-bold text-white"
                          style={{ background: pinColor }}
                        >
                          {v.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-[10px] mt-0.5" style={{ color: 'var(--mute)' }}>
                        {v.house} · {v.groupSize} citizens
                      </div>
                      <div className="mt-1 font-mono text-[10px]">
                        {isSafe ? (
                          <span className="text-emerald-600 font-semibold">Verified Safe at Shelter</span>
                        ) : (
                          <span>Distance: {Math.round(v.distanceToSafe * 10)}m (~{v.etaSec}s)</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Gateway GW-07 Pin */}
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                style={{ left: '92%', top: '20%' }}
              >
                <span
                  className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-700 shadow-md"
                  style={{ background: 'var(--ink)', color: 'var(--surface)' }}
                >
                  GW-07
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Map Legend Footer */}
      <div
        className="flex flex-wrap items-center justify-between gap-x-5 gap-y-1.5 border-t px-3 py-2 text-[11px]"
        style={{ borderColor: 'var(--line)' }}
      >
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-600" style={{ color: 'var(--ink)' }}>Sensors:</span>
          {[
            ['var(--green)', 'Normal'],
            ['var(--amber)', 'Warning'],
            ['var(--red)', 'Critical'],
          ].map(([color, label], idx) => (
            <span
              key={idx}
              className="flex items-center gap-1.5"
              style={{ color: 'var(--mute)' }}
            >
              <span
                className="h-2 w-2 rounded-full border-2"
                style={{ borderColor: color, background: 'var(--surface)' }}
              />
              <span>{label}</span>
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="font-600" style={{ color: 'var(--ink)' }}>Villagers:</span>
          <span className="flex items-center gap-1 text-emerald-600 font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Safe ({(state.villagers || []).filter((v) => v.status === 'safe').length})
          </span>
          <span className="flex items-center gap-1 text-amber-600 font-medium">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            Moving ({(state.villagers || []).filter((v) => v.status === 'moving').length})
          </span>
          <span className="flex items-center gap-1 text-rose-600 font-medium">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            Hazard ({(state.villagers || []).filter((v) => v.status === 'in-danger').length})
          </span>
        </div>
      </div>
    </div>
  );
};
