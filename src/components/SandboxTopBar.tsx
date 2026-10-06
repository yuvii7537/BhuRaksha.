import React from 'react';
import { Badge } from './UIElements';
import { ArrowLeft } from 'lucide-react';

export const SandboxTopBar: React.FC<{
  title: string;
  onBack: () => void;
}> = ({ title, onBack }) => {
  return (
    <div
      className="sticky top-[57px] z-[90] border-b"
      style={{
        borderColor: 'var(--line)',
        background: 'var(--saffron-sw)',
      }}
    >
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3 px-4 py-2.5 md:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="focus-ring flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-[12px] font-600 transition-colors cursor-pointer"
            style={{
              borderColor: 'var(--line-2)',
              background: 'var(--surface)',
              color: 'var(--ink-2)',
            }}
          >
            <ArrowLeft size={12} />
            <span>Sandbox</span>
          </button>
          <span className="text-[12.5px]" style={{ color: 'var(--mute)' }}>
            Demo sandbox /{' '}
            <strong style={{ color: 'var(--saffron)' }}>{title}</strong>
          </span>
        </div>

        <Badge tone="saffron">Self-operated · not production</Badge>
      </div>
    </div>
  );
};
