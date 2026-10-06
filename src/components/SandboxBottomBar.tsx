import React from 'react';
import { useBhu, jl, zt } from '../context/BhuContext';
import { useLang } from '../context/LangContext';
import { Gamepad2, Zap, Send, RotateCcw } from 'lucide-react';

export const SandboxBottomBar: React.FC = () => {
  const state = useBhu();
  const { t } = useLang();
  const isEvent = state.tMinus !== null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[110] border-t backdrop-blur-md"
      style={{
        borderColor: 'var(--line)',
        background: 'color-mix(in srgb, var(--surface) 94%, transparent)',
      }}
    >
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-8">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span
            className="flex items-center gap-2 text-[12.5px] font-700"
            style={{ color: 'var(--saffron)' }}
          >
            <Gamepad2 size={15} />
            <span>{t('operating') || 'You are operating this'}</span>
          </span>
          <span
            className="font-mono num text-[12px]"
            style={{ color: isEvent ? 'var(--red)' : 'var(--mute)' }}
          >
            {isEvent
              ? `${t('eventLive') || 'Event live'} · T−${jl(state.tMinus)}`
              : t('idle') || 'Idle · ground asleep'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => zt.trigger()}
            disabled={zt.busy}
            className="focus-ring flex items-center gap-2 rounded-md px-4 py-2.5 text-[12.5px] font-700 text-white transition-opacity hover:opacity-90 disabled:opacity-40 cursor-pointer shadow-sm"
            style={{ background: 'var(--red)' }}
          >
            <Zap size={13} />
            <span>
              {t('triggerEvent') || 'Trigger subsidence event'}
            </span>
          </button>

          {state.adminForceSmsActive ? (
            <button
              onClick={() => zt.cancelForceSms()}
              className="focus-ring flex items-center gap-2 rounded-md border px-3.5 py-2.5 text-[12.5px] font-600 transition-colors cursor-pointer"
              style={{
                borderColor: 'var(--green)',
                background: 'var(--green-sw)',
                color: 'var(--green)',
              }}
            >
              <RotateCcw size={13} />
              <span>Cancel Alert (Reset Safe)</span>
            </button>
          ) : (
            <button
              onClick={() => zt.manualSms()}
              className="focus-ring flex items-center gap-2 rounded-md border px-3.5 py-2.5 text-[12.5px] font-600 transition-colors cursor-pointer"
              style={{
                borderColor: 'var(--red)',
                background: 'var(--red-sw)',
                color: 'var(--red)',
              }}
            >
              <Send size={13} />
              <span>{t('forceSms') || 'Force SMS'}</span>
            </button>
          )}

          <button
            onClick={() => zt.reset()}
            className="focus-ring flex items-center gap-2 rounded-md border px-3.5 py-2.5 text-[12.5px] font-600 transition-colors cursor-pointer"
            style={{
              borderColor: 'var(--line-2)',
              background: 'var(--surface)',
              color: 'var(--ink-2)',
            }}
          >
            <RotateCcw size={13} />
            <span>{t('reset') || 'Reset'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
