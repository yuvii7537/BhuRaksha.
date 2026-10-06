import React, { useEffect, useRef, useState } from 'react';

const Kh: Record<string, string> = {
  safe: 'var(--green)',
  warn: 'var(--amber)',
  crit: 'var(--red)',
  info: 'var(--blue)',
  dim: 'var(--mute)',
  saffron: 'var(--saffron)',
};

const pT: Record<string, string> = {
  safe: 'var(--green-sw)',
  warn: 'var(--amber-sw)',
  crit: 'var(--red-sw)',
  info: 'var(--surface-3)',
  dim: 'var(--surface-2)',
  saffron: 'var(--saffron-sw)',
};

export interface BadgeProps {
  children: React.ReactNode;
  tone?: 'safe' | 'warn' | 'crit' | 'info' | 'dim' | 'saffron';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  tone = 'dim',
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border px-2.5 py-1 font-mono text-[10px] font-600 uppercase tracking-[0.14em] ${className}`}
      style={{
        borderColor: Kh[tone],
        background: pT[tone],
        color: Kh[tone],
      }}
    >
      {children}
    </span>
  );
};

export interface StatusDotProps {
  tone?: 'safe' | 'warn' | 'crit' | 'info' | 'dim' | 'saffron';
  pulse?: boolean;
  size?: number;
}

export const StatusDot: React.FC<StatusDotProps> = ({
  tone = 'safe',
  pulse = true,
  size = 8,
}) => {
  const color = Kh[tone] || 'var(--green)';
  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
    >
      {pulse && (
        <span
          className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-50"
          style={{ background: color }}
        />
      )}
      <span
        className="relative inline-flex rounded-full"
        style={{ width: size, height: size, background: color }}
      />
    </span>
  );
};

export const Label: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return <div className={`lbl ${className}`}>{children}</div>;
};

export interface AnimatedNumberProps {
  to: number;
  decimals?: number;
  suffix?: string;
  className?: string;
  duration?: number;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  to,
  decimals = 0,
  suffix = '',
  className = '',
  duration = 1.5,
}) => {
  const [val, setVal] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true;
          const start = performance.now();
          const durMs = duration * 1000;

          const tick = (now: number) => {
            const progress = Math.min(1, (now - start) / durMs);
            const ease = 1 - Math.pow(1 - progress, 3);
            setVal(to * ease);
            if (progress < 1) {
              requestAnimationFrame(tick);
            } else {
              setVal(to);
            }
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [to, duration]);

  return (
    <span ref={elementRef} className={`num ${className}`}>
      {val.toFixed(decimals)}
      {suffix}
    </span>
  );
};

export const MarqueeTrack: React.FC<{ items: string[] }> = ({ items }) => {
  const duplicated = items.concat(items);
  return (
    <div
      className="relative overflow-hidden border-y py-2"
      style={{ borderColor: 'var(--line)', background: 'var(--bg-2)' }}
    >
      <div className="marquee-track flex w-max whitespace-nowrap">
        {[0, 1].map((copyIndex) => (
          <div key={copyIndex} className="flex items-center">
            {duplicated.map((item, idx) => (
              <span
                key={idx}
                className="mx-5 flex items-center gap-4 font-mono text-[11px] font-500 uppercase tracking-[0.18em]"
                style={{ color: 'var(--mute)' }}
              >
                {item}
                <span
                  className="inline-block h-1 w-1 rotate-45"
                  style={{ background: 'var(--saffron)' }}
                />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const AshokaEmblem: React.FC<{ size?: number; className?: string }> = ({
  size = 36,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={`shrink-0 drop-shadow-sm ${className}`}
    >
      <defs>
        <linearGradient id="shieldGrad" x1="8" y1="6" x2="56" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="50%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
        <linearGradient id="saffronGrad" x1="20" y1="12" x2="44" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ff9933" />
          <stop offset="100%" stopColor="#f57c00" />
        </linearGradient>
        <linearGradient id="emeraldGrad" x1="18" y1="36" x2="46" y2="54" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Cybernetic Shield Outer Body */}
      <path
        d="M32 4 L54 12 C54 34 44 48 32 60 C20 48 10 34 10 12 Z"
        fill="url(#shieldGrad)"
        stroke="var(--line-2, #334155)"
        strokeWidth="1.8"
      />

      {/* Outer Radar Rings (Subsurface Sensor Range) */}
      <path
        d="M17 26 C20 18 26 14 32 14 C38 14 44 18 47 26"
        stroke="#38bdf8"
        strokeWidth="1.2"
        strokeDasharray="2.5 3"
        strokeOpacity="0.7"
      />
      <path
        d="M21 34 C23 26 27 22 32 22 C37 22 41 26 43 34"
        stroke="#38bdf8"
        strokeWidth="1.4"
        strokeOpacity="0.85"
      />

      {/* Geological Mountain / Subsidence Ridge Strata */}
      <path
        d="M16 42 L26 28 L34 38 L42 26 L48 42 Z"
        fill="url(#saffronGrad)"
        opacity="0.95"
      />

      {/* Bedrock / Underground Sentinel Foundation */}
      <path
        d="M19 43 L32 54 L45 43 L38 41 L32 44 L26 41 Z"
        fill="url(#emeraldGrad)"
      />

      {/* Central LoRa Sentinel Core Jewel */}
      <circle
        cx="32"
        cy="31"
        r="4"
        fill="#ffffff"
        filter="url(#glow)"
      />
      <circle
        cx="32"
        cy="31"
        r="2"
        fill="#ff9933"
      />

      {/* Sentinel Node Beacons (LoRa Mesh) */}
      <circle cx="26" cy="28" r="1.8" fill="#38bdf8" />
      <circle cx="38" cy="26" r="1.8" fill="#38bdf8" />
      <circle cx="48" cy="42" r="1.8" fill="#10b981" />
      <circle cx="16" cy="42" r="1.8" fill="#10b981" />

      {/* Apex Satellite Link Dot */}
      <circle cx="32" cy="9" r="1.8" fill="#38bdf8" />
      <line x1="32" y1="11" x2="32" y2="17" stroke="#38bdf8" strokeWidth="1" strokeDasharray="1 1.5" />
    </svg>
  );
};

export const FadeIn: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className = '', delay = 0 }) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay * 1000);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
      }}
    >
      {children}
    </div>
  );
};

export const SignalBars: React.FC<{ rssi: number }> = ({ rssi }) => {
  const bars = rssi > -50 ? 4 : rssi > -62 ? 3 : rssi > -75 ? 2 : 1;
  return (
    <span className="flex items-end gap-[2px]" title={`${rssi} dBm`}>
      {[1, 2, 3, 4].map((bar) => (
        <span
          key={bar}
          className="w-[3px] rounded-sm transition-colors"
          style={{
            height: 4 + bar * 2.5,
            background: bar <= bars ? 'var(--green)' : 'var(--line-2)',
          }}
        />
      ))}
    </span>
  );
};
