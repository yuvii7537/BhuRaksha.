import React, { useMemo, useState } from 'react';
import { useBhu } from '../context/BhuContext';
import { SentinelNode, Villager } from '../types';
import {
  ShieldCheck,
  Radio,
  Footprints,
  AlertTriangle,
  CheckCircle2,
  Battery,
  Activity,
  Layers,
  Crosshair,
} from 'lucide-react';

function generateContour(
  cx: number,
  cy: number,
  r: number,
  phaseShift: number
): string {
  const points: string[] = [];
  for (let i = 0; i <= 48; i++) {
    const angle = (i / 48) * Math.PI * 2;
    const factor =
      1 +
      0.15 * Math.sin(angle * 3 + phaseShift) +
      0.09 * Math.sin(angle * 5 + phaseShift * 2);
    const px = (cx + Math.cos(angle) * r * factor).toFixed(1);
    const py = (cy + Math.sin(angle) * r * factor * 0.84).toFixed(1);
    points.push(`${px},${py}`);
  }
  return `M${points.join(' L')} Z`;
}

export const SchematicView: React.FC<{
  compact?: boolean;
  className?: string;
}> = ({ compact = false, className = '' }) => {
  const state = useBhu();
  const [selectedNode, setSelectedNode] = useState<SentinelNode | null>(null);
  const [selectedVillager, setSelectedVillager] = useState<Villager | null>(null);

  const contours = useMemo(
    () => [
      generateContour(52, 56, 47, 1.3),
      generateContour(50, 54, 37, 4.1),
      generateContour(54, 58, 27, 2.2),
      generateContour(51, 55, 18, 5.7),
      generateContour(53, 56, 9.5, 3.3),
    ],
    []
  );

  const isWarn = state.risk > 40;
  const isCrit = state.risk > 80;
  const riskColor = isCrit
    ? 'var(--red)'
    : isWarn
    ? 'var(--saffron)'
    : 'var(--green)';

  return (
    <div
      className={`relative select-none overflow-hidden ${className}`}
      style={{
        background: 'var(--surface-2)',
        color: 'var(--ink)',
      }}
    >
      <svg
        viewBox="0 0 100 100"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Subtle glow filter for high-tech look */}
          <filter id="schematicGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Epicenter gradient */}
          <radialGradient id="subsidenceGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={riskColor} stopOpacity="0.32" />
            <stop offset="60%" stopColor={riskColor} stopOpacity="0.12" />
            <stop offset="100%" stopColor={riskColor} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Tactical Coordinate Grid */}
        {Array.from({ length: 9 }, (_, idx) => (idx + 1) * 10).map((pos) => (
          <g key={`grid-${pos}`}>
            <line
              x1={pos}
              y1="0"
              x2={pos}
              y2="100"
              stroke="var(--line)"
              strokeWidth="0.25"
              strokeDasharray="1 3"
            />
            <line
              x1="0"
              y1={pos}
              x2="100"
              y2={pos}
              stroke="var(--line)"
              strokeWidth="0.25"
              strokeDasharray="1 3"
            />
            {/* Axis distance markers */}
            <text
              x={pos + 0.5}
              y="3.2"
              fill="var(--mute)"
              fontSize="1.8"
              fontFamily="JetBrains Mono, monospace"
              opacity="0.6"
            >
              {pos * 10}m
            </text>
            <text
              x="1"
              y={pos - 0.5}
              fill="var(--mute)"
              fontSize="1.8"
              fontFamily="JetBrains Mono, monospace"
              opacity="0.6"
            >
              {pos * 10}m
            </text>
          </g>
        ))}

        {/* Topographic Contours with Depth Shading */}
        {contours.map((d, idx) => (
          <g key={`contour-${idx}`}>
            <path
              d={d}
              fill={idx % 2 === 0 ? 'var(--line)' : 'none'}
              fillOpacity={idx % 2 === 0 ? '0.04' : '0'}
              stroke="var(--line-2)"
              strokeWidth={idx === 4 ? '0.5' : '0.35'}
              strokeDasharray={idx === 3 ? '1.5 1.2' : undefined}
            />
            <text
              x="49"
              y={64 + idx * 7.5}
              fill="var(--mute)"
              fontSize="1.6"
              fontFamily="JetBrains Mono, monospace"
              opacity="0.5"
            >
              +{(5 - idx) * 20}m RL
            </text>
          </g>
        ))}

        {/* Fault Fracture / Stream Line */}
        <path
          d="M0,74 Q18,70 26,76 T54,88 T100,90"
          fill="none"
          stroke="var(--blue)"
          strokeWidth="0.8"
          opacity="0.6"
        />
        <text
          x="32"
          y="81"
          fill="var(--blue)"
          fontSize="2"
          fontFamily="JetBrains Mono, monospace"
          opacity="0.75"
        >
          KASIS FAULT LINE
        </text>

        {/* Gajpahari Settlement Footprint */}
        <g fill="var(--line-2)" stroke="var(--mute)" strokeWidth="0.15">
          <rect x="18" y="60" width="3.2" height="2.4" rx="0.3" />
          <rect x="23" y="63" width="3.2" height="2.4" rx="0.3" />
          <rect x="15" y="65" width="3.2" height="2.4" rx="0.3" />
          <rect x="27" y="61" width="2.8" height="2" rx="0.3" />
        </g>
        <text
          x="13"
          y="72"
          fill="var(--mute)"
          fontSize="2.6"
          fontFamily="JetBrains Mono, monospace"
          fontWeight="600"
        >
          GAJPAHARI SETTLEMENT · 4,127 RESIDENTS
        </text>

        {/* Underground Goaf 7 Void Boundary */}
        <rect
          x="44"
          y="48"
          width="34"
          height="16"
          rx="1"
          fill="var(--saffron)"
          fillOpacity="0.08"
          stroke="var(--saffron)"
          strokeOpacity="0.7"
          strokeWidth="0.45"
          strokeDasharray="2 1.6"
        />
        <text
          x="46"
          y="56"
          fill="var(--saffron)"
          fontSize="2.8"
          fontFamily="JetBrains Mono, monospace"
          fontWeight="700"
        >
          GOAF 7 VOID · DEPTH −300 m
        </text>

        {/* Subsidence Epicenter Circle */}
        <circle
          cx={state.epicenter.x}
          cy={state.epicenter.y}
          r={state.epicenter.r + 8}
          fill="url(#subsidenceGrad)"
        />
        <circle
          cx={state.epicenter.x}
          cy={state.epicenter.y}
          r={state.epicenter.r}
          fill="none"
          stroke={riskColor}
          strokeOpacity="0.9"
          strokeWidth="0.6"
          strokeDasharray="2.2 1.8"
          className="dash-flow"
        />

        {/* Evacuation Trajectory to Gate N-2 */}
        <path
          d="M52,82 Q40,60 26,40 T14,22"
          fill="none"
          stroke="var(--green)"
          strokeWidth="0.8"
          strokeDasharray="2 1.8"
          className="dash-flow-rev"
        />

        {/* Designated Safe Sanctuary: Gate N-2 Muster Point */}
        <g transform="translate(14,22)">
          {/* Pulsing refuge circle */}
          <circle
            r="4.2"
            fill="none"
            stroke="var(--green)"
            strokeWidth="0.4"
            className="pulse-ring"
          />
          <circle
            r="2.8"
            fill="var(--green)"
            stroke="#fff"
            strokeWidth="0.6"
          />
          <text
            x="-1.2"
            y="1"
            fill="#fff"
            fontSize="3"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            ✓
          </text>
          <text
            x="-8"
            y="-4.2"
            fill="var(--green)"
            fontSize="3"
            fontFamily="JetBrains Mono, monospace"
            fontWeight="700"
          >
            MUSTER N-2 (SAFE)
          </text>
        </g>

        {/* Gateway GW-07 LoRa Mesh Master Node */}
        <g transform="translate(92,20)">
          <rect
            x="-2.5"
            y="-2.5"
            width="5"
            height="5"
            fill="var(--surface)"
            stroke="var(--blue)"
            strokeWidth="0.6"
            transform="rotate(45)"
          />
          {state.siren && (
            <circle
              r="6.5"
              fill="none"
              stroke="var(--red)"
              strokeWidth="0.6"
              className="pulse-ring"
            />
          )}
          <text
            x="4.2"
            y="1.2"
            fill="var(--blue)"
            fontSize="3"
            fontFamily="JetBrains Mono, monospace"
            fontWeight="700"
          >
            GW-07
          </text>
        </g>

        {/* 12 Sentinel Sentry Nodes */}
        {state.nodes.map((node) => {
          const color =
            node.status === 'CRIT'
              ? 'var(--red)'
              : node.status === 'WARN'
              ? 'var(--amber)'
              : 'var(--green)';

          return (
            <g
              key={node.id}
              transform={`translate(${node.x},${node.y})`}
              className="cursor-pointer"
              onClick={() => setSelectedNode(node)}
              onMouseEnter={() => setSelectedNode(node)}
              onMouseLeave={() => setSelectedNode(null)}
            >
              {node.status !== 'OK' && (
                <circle
                  r="3.6"
                  fill="none"
                  stroke={color}
                  strokeWidth="0.5"
                  className="pulse-ring"
                />
              )}
              <circle
                r="1.8"
                fill="var(--surface)"
                stroke={color}
                strokeWidth="0.6"
              />
              <circle r="0.9" fill={color} />
              {!compact && (
                <text
                  x="2.6"
                  y="1"
                  fill="var(--mute)"
                  fontSize="2.4"
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight="600"
                >
                  {String(node.id).padStart(2, '0')}
                </text>
              )}
            </g>
          );
        })}

        {/* Live Villagers Moving on the Schematic */}
        {(state.villagers || []).map((v) => {
          const isSafe = v.status === 'safe';
          const isDanger = v.status === 'in-danger';
          const dotColor = isSafe
            ? 'var(--green)'
            : isDanger
            ? 'var(--red)'
            : 'var(--saffron)';

          return (
            <g
              key={`v-sch-${v.id}`}
              transform={`translate(${v.x},${v.y})`}
              className="cursor-pointer"
              onClick={() => setSelectedVillager(v)}
              onMouseEnter={() => setSelectedVillager(v)}
              onMouseLeave={() => setSelectedVillager(null)}
            >
              {!isSafe && (
                <circle
                  r="2.6"
                  fill="none"
                  stroke={dotColor}
                  strokeWidth="0.4"
                  className="pulse-ring"
                />
              )}
              <circle
                r="1.4"
                fill={dotColor}
                stroke="#fff"
                strokeWidth="0.4"
              />
            </g>
          );
        })}

        {/* Compass Rose */}
        <g transform="translate(94,7)">
          <path d="M0,-3.2 L-1.4,1 L0,0 L1.4,1 Z" fill="var(--ink)" />
          <path d="M0,3.2 L-1.4,-1 L0,0 L1.4,-1 Z" fill="var(--mute)" opacity="0.6" />
          <text
            x="-1.2"
            y="6.2"
            fontSize="2.8"
            fill="var(--ink)"
            fontFamily="JetBrains Mono, monospace"
            fontWeight="700"
          >
            N
          </text>
        </g>

        {/* Scale Bar */}
        <g transform="translate(74,94)">
          <line x1="0" y1="0" x2="20" y2="0" stroke="var(--ink)" strokeWidth="0.6" />
          <line x1="0" y1="-1" x2="0" y2="1" stroke="var(--ink)" strokeWidth="0.6" />
          <line x1="20" y1="-1" x2="20" y2="1" stroke="var(--ink)" strokeWidth="0.6" />
          <text
            x="4"
            y="-2"
            fill="var(--ink)"
            fontSize="2.2"
            fontFamily="JetBrains Mono, monospace"
            fontWeight="600"
          >
            200 METERS
          </text>
        </g>
      </svg>

      {/* Floating Node Telemetry Tooltip */}
      {selectedNode && (
        <div
          className="pointer-events-none absolute left-4 top-4 z-20 flex flex-col gap-1 rounded-md border p-2.5 shadow-lg backdrop-blur-md"
          style={{
            borderColor: 'var(--line)',
            background: 'color-mix(in srgb, var(--surface) 95%, transparent)',
            color: 'var(--ink)',
          }}
        >
          <div className="flex items-center justify-between gap-3 text-[11px] font-700">
            <span>SENTRY {selectedNode.label}</span>
            <span
              className="rounded px-1.5 py-0.2 text-[9.5px]"
              style={{
                background:
                  selectedNode.status === 'OK'
                    ? 'var(--green-sw)'
                    : selectedNode.status === 'WARN'
                    ? 'var(--saffron-sw)'
                    : 'var(--red-sw)',
                color:
                  selectedNode.status === 'OK'
                    ? 'var(--green)'
                    : selectedNode.status === 'WARN'
                    ? 'var(--saffron)'
                    : 'var(--red)',
              }}
            >
              {selectedNode.status}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-[10px]" style={{ color: 'var(--mute)' }}>
            <div>Tilt: {selectedNode.tilt.toFixed(3)}°</div>
            <div>Vib: {selectedNode.vib.toFixed(1)} mm/s</div>
            <div>Batt: {Math.round(selectedNode.battery)}%</div>
            <div>RSSI: {Math.round(selectedNode.rssi)} dBm</div>
          </div>
        </div>
      )}

      {/* Floating Villager Info Tooltip */}
      {selectedVillager && (
        <div
          className="pointer-events-none absolute right-4 top-4 z-20 flex flex-col gap-1 rounded-md border p-2.5 shadow-lg backdrop-blur-md"
          style={{
            borderColor: 'var(--line)',
            background: 'color-mix(in srgb, var(--surface) 95%, transparent)',
            color: 'var(--ink)',
          }}
        >
          <div className="text-[11.5px] font-700">{selectedVillager.name}</div>
          <div className="text-[10.5px]" style={{ color: 'var(--mute)' }}>
            {selectedVillager.house} ({selectedVillager.groupSize} souls)
          </div>
          <div className="font-mono text-[10px] font-semibold" style={{ color: selectedVillager.status === 'safe' ? 'var(--green)' : 'var(--saffron)' }}>
            Status: {selectedVillager.status.toUpperCase()} · {Math.round(selectedVillager.distanceToSafe * 10)}m to Refuge
          </div>
        </div>
      )}
    </div>
  );
};
