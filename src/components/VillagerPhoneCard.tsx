import React, { useState, useEffect } from 'react';
import { useBhu, jl, nE, zt } from '../context/BhuContext';
import { useLang } from '../context/LangContext';
import { Label } from './UIElements';
import {
  Siren,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
} from 'lucide-react';

export const VillagerPhoneCard: React.FC = () => {
  const state = useBhu();
  const { L } = useLang();
  const [isSafelyReached, setIsSafelyReached] = useState(false);

  useEffect(() => {
    if (!state.adminForceSmsActive && state.phase === 'NOMINAL') {
      setIsSafelyReached(false);
    }
  }, [state.adminForceSmsActive, state.phase]);

  const isMove = state.adminForceSmsActive && !isSafelyReached;
  const isWatch = !isMove && (state.phase === 'ANOMALY' || state.phase === 'VERIFIED');

  const copy = isSafelyReached
    ? { t: 'Safely Reached Muster N-2', sub: 'Verified in Safe Sanctuary', tag: 'SAFE REFUGE' }
    : isMove
    ? { t: L.moveT || 'Evacuate now', sub: 'Admin Force SMS Active', tag: 'EMERGENCY ALERT' }
    : { t: L.safeT || 'Sector secure', sub: 'Normal watch active', tag: L.allSafe || 'ALL SAFE' };

  const bannerColor = isSafelyReached
    ? 'var(--green)'
    : isMove
    ? 'var(--red)'
    : 'var(--green)';

  const emergencyContacts = [
    { label: L.natEmergency || 'National Emergency', num: '112', primary: true },
    {
      label: L.mineControl || 'Mine Control Room',
      num: '1800-345-7007',
      primary: false,
    },
    { label: L.ambulance || 'Ambulance', num: '108', primary: false },
  ];

  return (
    <div
      className="flex h-full flex-col overflow-hidden rounded-lg border shadow-sm"
      style={{
        borderColor: 'var(--line)',
        background: 'var(--surface)',
      }}
    >
      {/* Dynamic Urgency Banner */}
      <div
        className={`px-5 py-6 text-center ${isMove ? 'banner-pulse' : ''}`}
        style={{ background: bannerColor }}
      >
        <div className="flex items-center justify-center gap-2">
          {isMove ? (
            <Siren size={15} className="siren-glow text-white" />
          ) : isWatch ? (
            <AlertTriangle size={15} className="text-white" />
          ) : (
            <ShieldCheck size={15} className="text-white" />
          )}
          <span className="font-mono text-[11px] font-700 uppercase tracking-[0.2em] text-white">
            {copy.tag}
          </span>
        </div>

        <div className="mt-3 text-[20px] font-700 leading-tight text-white">
          {copy.t}
        </div>

        <div className="mt-4 border-t border-white/25 pt-4">
          <div className="font-mono text-[11px] font-600 uppercase tracking-[0.18em] text-white/85">
            {state.tMinus !== null ? L.timeLeft : L.noEvent}
          </div>
          <div
            className={`font-display num mt-1 text-[56px] font-700 leading-none text-white ${
              isMove ? 'soft-pulse' : ''
            }`}
          >
            {state.tMinus !== null ? jl(state.tMinus) : '--:--'}
          </div>
        </div>

        {isMove && !isSafelyReached && (
          <div className="mt-3 space-y-2">
            <div
              className="rounded-md bg-white px-3 py-2 text-[12.5px] font-700 shadow"
              style={{ color: 'var(--red)' }}
            >
              {L.goGate || 'Walk now to GATE N-2 muster point'}
            </div>
            <button
              onClick={() => {
                setIsSafelyReached(true);
                zt.markVillagerSafe('V-02');
              }}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-emerald-700 px-3 py-2.5 text-[12px] font-700 text-white shadow transition-all hover:bg-emerald-600 cursor-pointer border border-white/50"
            >
              <ShieldCheck size={15} />
              <span>I Have Safely Reached Gate N-2</span>
            </button>
          </div>
        )}

        {isSafelyReached && (
          <div className="mt-3 rounded-md bg-emerald-800/80 border border-emerald-400 p-2.5 text-center text-white">
            <div className="flex items-center justify-center gap-1.5 text-[12.5px] font-bold">
              <CheckCircle2 size={16} />
              <span>SAFELY REACHED MUSTER N-2</span>
            </div>
            <div className="mt-0.5 text-[11px] opacity-90">
              Admin & District Control notified of safe arrival.
            </div>
          </div>
        )}
      </div>

      {/* Emergency Contact List */}
      <div className="flex-1 space-y-2 p-4">
        <Label className="mb-1">{L.emergency || 'Emergency Contacts'}</Label>
        {emergencyContacts.map((contact, idx) => (
          <a
            key={idx}
            href={`tel:${contact.num.replace(/[^0-9]/g, '')}`}
            className="flex items-center justify-between rounded-md border px-4 py-3 transition-transform hover:-translate-y-0.5"
            style={{
              borderColor: contact.primary ? 'var(--red)' : 'var(--line)',
              background: contact.primary
                ? 'var(--red-sw)'
                : 'var(--surface-2)',
            }}
          >
            <div className="min-w-0">
              <div
                className="truncate text-[12px]"
                style={{
                  color: contact.primary ? 'var(--red)' : 'var(--mute)',
                }}
              >
                {contact.label}
              </div>
              <div
                className="font-display num text-[18px] font-700 leading-tight"
                style={{
                  color: contact.primary ? 'var(--red)' : 'var(--ink)',
                }}
              >
                {contact.num}
              </div>
            </div>
            <PhoneCall
              size={16}
              style={{
                color: contact.primary ? 'var(--red)' : 'var(--ink)',
              }}
            />
          </a>
        ))}

        {/* Live Ground Telemetry Summary */}
        <div
          className="flex items-center justify-between rounded-md border px-4 py-2.5 text-[11.5px]"
          style={{
            borderColor: 'var(--line)',
            background: 'var(--surface-2)',
            color: 'var(--mute)',
          }}
        >
          <span>
            {L.risk}{' '}
            <strong className="num" style={{ color: 'var(--ink-2)' }}>
              {Math.round(state.risk)}%
            </strong>
          </span>
          <span className="num">
            {state.smsSent.toLocaleString('en-IN')}/4,127
          </span>
        </div>
      </div>
    </div>
  );
};
