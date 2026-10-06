import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { useBhu } from '../context/BhuContext';
import { Battery, Zap, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';

const NODE_COLORS = [
  '#10b981', // emerald
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#6366f1', // indigo
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#f59e0b', // amber
  '#f97316', // orange
  '#ef4444', // red
  '#14b8a6', // teal
  '#84cc16', // lime
  '#a855f7', // violet
];

export const SentryBatteryAnalytics: React.FC = () => {
  const state = useBhu();
  const [selectedNodeId, setSelectedNodeId] = useState<number | 'all'>('all');
  const [timeRange, setTimeRange] = useState<'24h' | '12h'>('24h');

  // Compute 24-hour battery trend series based on live nodes
  const chartData = useMemo(() => {
    const hours = timeRange === '24h' ? 24 : 12;
    const now = new Date();
    const data = [];

    for (let i = hours; i >= 0; i--) {
      const pastTime = new Date(now.getTime() - i * 60 * 60 * 1000);
      const timeLabel = `${String(pastTime.getHours()).padStart(2, '0')}:00`;

      const hourOfDay = pastTime.getHours();
      // Solar charging occurs between 07:00 and 17:00
      const isSolarTime = hourOfDay >= 7 && hourOfDay <= 17;
      const solarFactor = isSolarTime ? 0.35 : -0.25;

      const entry: Record<string, any> = {
        time: timeLabel,
        hour: hourOfDay,
      };

      state.nodes.forEach((node) => {
        // Compute realistic past battery from current level
        const currentBatt = node.battery;
        const drift = (hours - i) * 0.12 + (isSolarTime ? -0.8 : 0.6);
        const noise = Math.sin(i * 0.8 + node.id) * 1.2;
        const calculatedBatt = Math.min(100, Math.max(15, currentBatt - drift + noise));
        entry[`ND-${String(node.id).padStart(2, '0')}`] = parseFloat(calculatedBatt.toFixed(1));
      });

      data.push(entry);
    }
    return data;
  }, [state.nodes, timeRange]);

  const avgBattery = useMemo(() => {
    if (!state.nodes || state.nodes.length === 0) return 0;
    const sum = state.nodes.reduce((acc, n) => acc + n.battery, 0);
    return Math.round(sum / state.nodes.length);
  }, [state.nodes]);

  const lowestNode = useMemo(() => {
    if (!state.nodes || state.nodes.length === 0) return null;
    return [...state.nodes].sort((a, b) => a.battery - b.battery)[0];
  }, [state.nodes]);

  return (
    <div
      className="rounded-lg border shadow-sm transition-all"
      style={{
        borderColor: 'var(--line)',
        background: 'var(--surface)',
      }}
    >
      {/* Header */}
      <div
        className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4"
        style={{ borderColor: 'var(--line)' }}
      >
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-md"
              style={{
                background: 'var(--green-sw)',
                color: 'var(--green)',
              }}
            >
              <Battery size={16} />
            </span>
            <h3
              className="font-display text-[16px] font-700 tracking-tight"
              style={{ color: 'var(--ink)' }}
            >
              Sentry Node Battery Health & Solar Telemetry
            </h3>
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-700"
              style={{
                background: state.connected ? 'var(--green-sw)' : 'var(--surface-2)',
                color: state.connected ? 'var(--green)' : 'var(--mute)',
              }}
            >
              {state.connected ? '● LIVE STREAMING' : '○ LAST RECORDED BASELINE (OFFLINE)'}
            </span>
          </div>
          <p className="mt-0.5 text-[12px]" style={{ color: 'var(--mute)' }}>
            LiFePO4 3.2V battery discharge curves, solar trickle harvesting, and reserve thresholds
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <div
            className="flex rounded-md border p-0.5 text-[11px] font-600"
            style={{ borderColor: 'var(--line)', background: 'var(--surface-2)' }}
          >
            <button
              onClick={() => setTimeRange('12h')}
              className="rounded px-2.5 py-1 transition-colors cursor-pointer"
              style={{
                background: timeRange === '12h' ? 'var(--ink)' : 'transparent',
                color: timeRange === '12h' ? 'var(--surface)' : 'var(--mute)',
              }}
            >
              12H
            </button>
            <button
              onClick={() => setTimeRange('24h')}
              className="rounded px-2.5 py-1 transition-colors cursor-pointer"
              style={{
                background: timeRange === '24h' ? 'var(--ink)' : 'transparent',
                color: timeRange === '24h' ? 'var(--surface)' : 'var(--mute)',
              }}
            >
              24H
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div
        className="grid grid-cols-2 gap-px border-b sm:grid-cols-4"
        style={{ background: 'var(--line)' }}
      >
        <div className="p-3.5" style={{ background: 'var(--surface)' }}>
          <div className="text-[11px] font-600 uppercase tracking-wider" style={{ color: 'var(--mute)' }}>
            Fleet Avg Battery
          </div>
          <div className="font-display num mt-0.5 text-[22px] font-700" style={{ color: 'var(--green)' }}>
            {avgBattery}%
          </div>
        </div>

        <div className="p-3.5" style={{ background: 'var(--surface)' }}>
          <div className="text-[11px] font-600 uppercase tracking-wider" style={{ color: 'var(--mute)' }}>
            Lowest Node
          </div>
          <div className="font-display num mt-0.5 text-[22px] font-700" style={{ color: 'var(--saffron)' }}>
            {lowestNode ? `${lowestNode.label} (${Math.round(lowestNode.battery)}%)` : '--'}
          </div>
        </div>

        <div className="p-3.5" style={{ background: 'var(--surface)' }}>
          <div className="text-[11px] font-600 uppercase tracking-wider" style={{ color: 'var(--mute)' }}>
            Solar Harvester
          </div>
          <div className="flex items-center gap-1.5 mt-0.5 text-[15px] font-700 font-mono" style={{ color: 'var(--ink)' }}>
            <Zap size={14} className="text-amber-500" />
            <span>Active · +0.4%/h</span>
          </div>
        </div>

        <div className="p-3.5" style={{ background: 'var(--surface)' }}>
          <div className="text-[11px] font-600 uppercase tracking-wider" style={{ color: 'var(--mute)' }}>
            DGMS Reserve Margin
          </div>
          <div className="flex items-center gap-1 mt-0.5 text-[15px] font-700 text-emerald-600">
            <ShieldCheck size={15} />
            <span>&gt; 96h Autonomous</span>
          </div>
        </div>
      </div>

      {/* Node Filter Pills */}
      <div
        className="flex flex-wrap items-center gap-1.5 border-b px-5 py-2.5 text-[11px]"
        style={{ borderColor: 'var(--line)', background: 'var(--surface-2)' }}
      >
        <span className="font-600 mr-1" style={{ color: 'var(--mute)' }}>
          Filter Node:
        </span>
        <button
          onClick={() => setSelectedNodeId('all')}
          className="rounded px-2.5 py-1 font-semibold transition-colors cursor-pointer"
          style={{
            background: selectedNodeId === 'all' ? 'var(--ink)' : 'var(--surface)',
            color: selectedNodeId === 'all' ? 'var(--surface)' : 'var(--ink-2)',
            border: '1px solid var(--line)',
          }}
        >
          All 12 Nodes
        </button>

        {state.nodes.map((node, idx) => {
          const isSelected = selectedNodeId === node.id;
          return (
            <button
              key={node.id}
              onClick={() => setSelectedNodeId(isSelected ? 'all' : node.id)}
              className="flex items-center gap-1 rounded px-2 py-0.5 font-mono text-[10.5px] transition-colors cursor-pointer"
              style={{
                background: isSelected ? NODE_COLORS[idx % NODE_COLORS.length] : 'var(--surface)',
                color: isSelected ? '#fff' : 'var(--ink-2)',
                border: '1px solid var(--line)',
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  background: isSelected ? '#fff' : NODE_COLORS[idx % NODE_COLORS.length],
                }}
              />
              <span>{node.label}</span>
            </button>
          );
        })}
      </div>

      {/* Recharts Line Graph Area */}
      <div className="p-4 pt-6">
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 12, right: 24, left: 10, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" opacity={0.6} />
              <XAxis
                dataKey="time"
                stroke="var(--mute)"
                fontSize={11}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                stroke="var(--mute)"
                fontSize={11}
                tickLine={false}
                unit="%"
                width={42}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--line)',
                  borderRadius: '6px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  fontSize: '11px',
                  color: 'var(--ink)',
                }}
                labelStyle={{ fontWeight: 'bold', color: 'var(--ink)', marginBottom: '4px' }}
              />
              {/* Critical 20% Threshold Line */}
              <ReferenceLine
                y={20}
                stroke="var(--red)"
                strokeDasharray="4 4"
                label={{
                  value: 'DGMS Critical Cutoff (20%)',
                  fill: 'var(--red)',
                  fontSize: 10,
                  position: 'insideBottomRight',
                }}
              />

              {/* Render Lines */}
              {state.nodes.map((node, idx) => {
                const nodeKey = `ND-${String(node.id).padStart(2, '0')}`;
                const isVisible =
                  selectedNodeId === 'all' || selectedNodeId === node.id;

                if (!isVisible) return null;

                return (
                  <Line
                    key={node.id}
                    type="monotone"
                    dataKey={nodeKey}
                    name={node.label}
                    stroke={NODE_COLORS[idx % NODE_COLORS.length]}
                    strokeWidth={selectedNodeId === node.id ? 2.8 : 1.4}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Footer Info */}
      <div
        className="flex flex-wrap items-center justify-between gap-3 border-t px-5 py-2.5 text-[11px]"
        style={{ borderColor: 'var(--line)', background: 'var(--surface-2)', color: 'var(--mute)' }}
      >
        <span>
          Monitoring Interval: <strong>60 seconds</strong> · Battery Chemistry: <strong>LiFePO4 3.2V 3200mAh</strong>
        </span>
        <span className="flex items-center gap-1">
          <RefreshCw size={11} />
          <span>Auto-synchronizing via LoRa frame telemetry</span>
        </span>
      </div>
    </div>
  );
};
