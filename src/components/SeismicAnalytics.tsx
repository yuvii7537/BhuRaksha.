import React, { useState, useMemo } from 'react';
import { useBhu } from '../context/BhuContext';
import { useLang } from '../context/LangContext';
import { Badge, Label, StatusDot } from './UIElements';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import {
  Activity,
  Layers,
  TrendingUp,
  AlertCircle,
  Clock,
  Radio,
} from 'lucide-react';

interface DataPoint {
  time: string;
  hour: number;
  displacement: number;
  seismicEnergy: number;
  porePressure: number;
  anomalyScore: number;
}

export const SeismicAnalytics: React.FC = () => {
  const state = useBhu();
  const { t } = useLang();
  const [activeMetric, setActiveMetric] = useState<'displacement' | 'seismic' | 'pore'>('displacement');
  const [selectedSector, setSelectedSector] = useState<'all' | 'goaf' | 'village'>('all');

  // Generate 24-hour historical baseline data ending at "Now" with current live simulation telemetry
  const chartData = useMemo<DataPoint[]>(() => {
    const points: DataPoint[] = [];
    const now = new Date();
    const liveRiskFactor = (state.risk / 100);

    for (let i = 24; i >= 0; i--) {
      const pointTime = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hourLabel = i === 0 ? 'Now (Live)' : `-${i}h`;

      // Baseline ground creep with diurnal and atmospheric fluctuations
      const timeFactor = Math.sin((24 - i) / 3.8);
      const isRecent = i <= 3;
      const recentMultiplier = isRecent ? 1 + liveRiskFactor * 3.5 : 1;

      let dispBase = 0.22 + (24 - i) * 0.045 + timeFactor * 0.08;
      let seismicBase = 12 + Math.abs(Math.sin((24 - i) * 0.8)) * 14 + (isRecent ? liveRiskFactor * 85 : 0);
      let poreBase = 42.5 + Math.cos((24 - i) * 0.4) * 3.2 + (isRecent ? liveRiskFactor * 12 : 0);
      let anomalyBase = Math.min(0.98, 0.08 + (isRecent ? liveRiskFactor * 0.88 : 0.04 * Math.random()));

      if (selectedSector === 'goaf') {
        dispBase *= 1.45;
        seismicBase *= 1.35;
      } else if (selectedSector === 'village') {
        dispBase *= 0.65;
        seismicBase *= 0.7;
      }

      // Live node tilt integration for the 0th hour (Now)
      if (i === 0) {
        const avgTilt = state.nodes.reduce((acc, n) => acc + n.tilt, 0) / state.nodes.length;
        dispBase += avgTilt * 2.8;
        seismicBase += (state.nodes.reduce((acc, n) => acc + n.vib, 0) / state.nodes.length) * 0.8;
      }

      points.push({
        time: hourLabel,
        hour: pointTime.getHours(),
        displacement: Number((dispBase * recentMultiplier).toFixed(2)),
        seismicEnergy: Number(seismicBase.toFixed(1)),
        porePressure: Number(poreBase.toFixed(1)),
        anomalyScore: Number(anomalyBase.toFixed(2)),
      });
    }
    return points;
  }, [state.risk, state.nodes, selectedSector]);

  const latest = chartData[chartData.length - 1];

  const metricConfigs = {
    displacement: {
      label: 'Subsurface Displacement',
      unit: 'mm',
      color: 'var(--saffron)',
      fill: 'url(#gradientSaffron)',
      val: latest?.displacement,
      threshold: 1.2,
      desc: 'Cumulative vertical shear flex across Goaf 7 borehole extensometers',
    },
    seismic: {
      label: 'Micro-Seismic Vibration Index',
      unit: 'mg',
      color: state.risk > 40 ? 'var(--red)' : 'var(--blue)',
      fill: 'url(#gradientBlue)',
      val: latest?.seismicEnergy,
      threshold: 45,
      desc: 'High-frequency acoustic ground fracture vibrations registered by 12 sentinels',
    },
    pore: {
      label: 'Pore Water Pressure',
      unit: 'kPa',
      color: 'var(--green)',
      fill: 'url(#gradientGreen)',
      val: latest?.porePressure,
      threshold: 52,
      desc: 'Sub-surface aquifer hydraulic pressure indicating strata delamination',
    },
  };

  const currentCfg = metricConfigs[activeMetric];

  return (
    <div
      className="mt-14 overflow-hidden rounded-lg border shadow-sm"
      style={{
        borderColor: 'var(--line)',
        background: 'var(--surface)',
      }}
    >
      {/* Header Bar */}
      <div
        className="flex flex-wrap items-center justify-between gap-4 border-b px-6 py-4"
        style={{ borderColor: 'var(--line)' }}
      >
        <div className="flex items-center gap-3">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-md border"
            style={{
              borderColor: 'var(--line)',
              background: 'var(--surface-2)',
            }}
          >
            <Activity size={19} style={{ color: 'var(--saffron)' }} />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2
                className="font-display text-[18px] font-700 leading-tight"
                style={{ color: 'var(--ink)' }}
              >
                Seismic Analytics & Subsurface Flex
              </h2>
              <Badge tone={state.risk > 60 ? 'crit' : state.risk > 30 ? 'warn' : 'safe'}>
                {state.risk > 60 ? 'HIGH STRESS ACTIVITY' : 'NOMINAL SEISMIC CREEP'}
              </Badge>
            </div>
            <p className="mt-0.5 text-[12.5px]" style={{ color: 'var(--mute)' }}>
              Continuous 24-hour geotechnical telemetry across the Jharia Sector-4 borehole network
            </p>
          </div>
        </div>

        {/* Sector Filter Control */}
        <div className="flex items-center gap-1 rounded-lg border p-1" style={{ borderColor: 'var(--line)', background: 'var(--surface-2)' }}>
          {[
            { id: 'all', label: 'All 12 Sentinels' },
            { id: 'goaf', label: 'Goaf 7 Core (ND 08-11)' },
            { id: 'village', label: 'Gajpahari Sector (ND 01-04)' },
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => setSelectedSector(sec.id as any)}
              className="rounded px-2.5 py-1 text-[11px] font-600 transition-colors cursor-pointer"
              style={{
                background: selectedSector === sec.id ? 'var(--ink)' : 'transparent',
                color: selectedSector === sec.id ? 'var(--surface)' : 'var(--mute)',
              }}
            >
              {sec.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Switcher Cards */}
      <div
        className="grid grid-cols-1 border-b sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x"
        style={{ borderColor: 'var(--line)' }}
      >
        {(['displacement', 'seismic', 'pore'] as const).map((mKey) => {
          const cfg = metricConfigs[mKey];
          const isSelected = activeMetric === mKey;
          return (
            <button
              key={mKey}
              onClick={() => setActiveMetric(mKey)}
              className="p-4 text-left transition-colors cursor-pointer"
              style={{
                background: isSelected ? 'var(--surface-2)' : 'var(--surface)',
              }}
            >
              <div className="flex items-center justify-between">
                <span className="lbl text-[10px]">{cfg.label}</span>
                {isSelected && (
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: cfg.color }}
                  />
                )}
              </div>
              <div className="mt-1.5 flex items-baseline gap-2">
                <span
                  className="font-display num text-[24px] font-700"
                  style={{ color: isSelected ? cfg.color : 'var(--ink)' }}
                >
                  {cfg.val}
                </span>
                <span className="font-mono text-[12px]" style={{ color: 'var(--mute)' }}>
                  {cfg.unit}
                </span>
              </div>
              <p className="mt-1 line-clamp-1 text-[11.5px]" style={{ color: 'var(--mute)' }}>
                {cfg.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Main Chart Area */}
      <div className="p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-[12px]">
          <div className="flex items-center gap-2" style={{ color: 'var(--ink-2)' }}>
            <TrendingUp size={14} style={{ color: currentCfg.color }} />
            <span className="font-semibold">{currentCfg.label} Trend (Past 24 Hours)</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]" style={{ color: 'var(--mute)' }}>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: currentCfg.color }} />
              Live Sensor Rolling Feed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-0.5 w-3 border-t border-dashed border-red-500" />
              Critical Anomaly Horizon ({currentCfg.threshold} {currentCfg.unit})
            </span>
          </div>
        </div>

        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradientSaffron" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d2560f" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#d2560f" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gradientBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gradientGreen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#15713a" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#15713a" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--line)"
                opacity={0.6}
              />

              <XAxis
                dataKey="time"
                tick={{ fill: 'var(--mute)', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                axisLine={{ stroke: 'var(--line)' }}
                tickLine={false}
              />

              <YAxis
                tick={{ fill: 'var(--mute)', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                axisLine={{ stroke: 'var(--line)' }}
                tickLine={false}
                domain={['auto', 'auto']}
              />

              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as DataPoint;
                    return (
                      <div
                        className="rounded-md border p-3 shadow-lg"
                        style={{
                          borderColor: 'var(--line)',
                          background: 'var(--surface)',
                          color: 'var(--ink)',
                        }}
                      >
                        <div className="flex items-center justify-between gap-4 font-mono text-[11px] pb-1 border-b border-[var(--line)]">
                          <span style={{ color: 'var(--mute)' }}>Timeline:</span>
                          <span className="font-semibold">{data.time}</span>
                        </div>
                        <div className="mt-2 space-y-1 text-[12px]">
                          <div className="flex items-center justify-between gap-4">
                            <span style={{ color: 'var(--mute)' }}>Displacement:</span>
                            <span className="font-mono font-bold" style={{ color: 'var(--saffron)' }}>
                              {data.displacement} mm
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span style={{ color: 'var(--mute)' }}>Seismic Energy:</span>
                            <span className="font-mono font-bold" style={{ color: 'var(--blue)' }}>
                              {data.seismicEnergy} mg
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span style={{ color: 'var(--mute)' }}>Pore Pressure:</span>
                            <span className="font-mono font-bold" style={{ color: 'var(--green)' }}>
                              {data.porePressure} kPa
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4 pt-1 border-t border-[var(--line)] text-[11px]">
                            <span style={{ color: 'var(--mute)' }}>AI Quorum Score:</span>
                            <span
                              className="font-mono font-bold"
                              style={{ color: data.anomalyScore > 0.6 ? 'var(--red)' : 'var(--green)' }}
                            >
                              {(data.anomalyScore * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <ReferenceLine
                y={currentCfg.threshold}
                stroke="var(--red)"
                strokeDasharray="4 3"
                label={{
                  value: `CRITICAL THRESHOLD`,
                  position: 'insideTopRight',
                  fill: 'var(--red)',
                  fontSize: 10,
                  fontFamily: 'JetBrains Mono',
                }}
              />

              <Area
                type="monotone"
                dataKey={activeMetric}
                stroke={currentCfg.color}
                strokeWidth={2}
                fill={currentCfg.fill}
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Footer Data Footnotes */}
        <div
          className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t pt-3 text-[11.5px]"
          style={{ borderColor: 'var(--line)', color: 'var(--mute)' }}
        >
          <div className="flex items-center gap-2">
            <Radio size={12} className="text-green-600 animate-pulse" />
            <span>Sampled every 60s via SX1262 LoRa Star-Mesh · Synchronized to UTC+05:30 (IST)</span>
          </div>
          <div className="font-mono">
            Latest Packet: <strong style={{ color: 'var(--ink)' }}>{state.packets} pkts/s</strong> · SNR: <strong style={{ color: 'var(--ink)' }}>+9.4 dB</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
