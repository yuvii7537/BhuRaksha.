import React, { useEffect, useRef, useState } from 'react';
import { useLang } from '../context/LangContext';
import { languageList } from '../i18n/languages';
import { Languages, ChevronDown, Check } from 'lucide-react';

export const LanguageModal: React.FC<{ compact?: boolean }> = ({
  compact = false,
}) => {
  const { lang, setLang, L, t } = useLang();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Change language"
        className="focus-ring flex h-9 items-center gap-2 rounded-md border px-3 transition-colors cursor-pointer"
        style={{
          borderColor: 'var(--line)',
          background: 'var(--surface)',
          color: 'var(--ink-2)',
        }}
      >
        <Languages size={15} strokeWidth={2} />
        <span className="text-[13px] font-600 leading-none">
          {compact ? L.code.toUpperCase() : L.native}
        </span>
        <ChevronDown
          size={13}
          className={`transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 z-[200] mt-2 max-h-[340px] w-60 overflow-y-auto rounded-md border py-1.5 shadow-xl"
          style={{
            borderColor: 'var(--line)',
            background: 'var(--surface)',
            boxShadow: 'var(--shadow)',
          }}
        >
          <div className="lbl px-3.5 pb-1.5 pt-1">
            {t('selectLang') || 'Select language'}
          </div>
          {languageList.map((item) => {
            const active = item.code === lang;
            return (
              <button
                key={item.code}
                onClick={() => {
                  setLang(item.code);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between gap-3 px-3.5 py-2 text-left transition-colors cursor-pointer"
                style={{
                  background: active ? 'var(--surface-3)' : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (!active)
                    e.currentTarget.style.background = 'var(--surface-2)';
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.background = 'transparent';
                }}
              >
                <span className="min-w-0">
                  <span
                    className="block truncate text-[14px] font-600"
                    style={{ color: 'var(--ink)' }}
                  >
                    {item.native}
                  </span>
                  <span
                    className="block truncate text-[11px]"
                    style={{ color: 'var(--mute)' }}
                  >
                    {item.english}
                  </span>
                </span>
                {active && (
                  <Check size={15} style={{ color: 'var(--saffron)' }} />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
