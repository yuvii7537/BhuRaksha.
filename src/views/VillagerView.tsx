import React, { useState, useEffect } from 'react';
import { useBhu, jl, zt } from '../context/BhuContext';
import { useLang } from '../context/LangContext';
import { LanguageModal } from '../components/LanguageModal';
import { VillagerLogin } from '../components/VillagerLogin';
import { EvacuationStatusWidget } from '../components/EvacuationStatusWidget';
import { Villager } from '../types';
import {
  Siren,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
  Footprints,
  Users,
  MapPin,
  LogIn,
  LogOut,
  Send,
} from 'lucide-react';

export const VillagerView: React.FC<{ embedded?: boolean }> = ({
  embedded = false,
}) => {
  const state = useBhu();
  const { L } = useLang();
  const [currentUser, setCurrentUser] = useState<Villager | null>(() => {
    if (embedded) {
      return state.villagers[1] || state.villagers[0] || null;
    }
    const saved = localStorage.getItem('bhuraksha_villager_auth');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const live = state.villagers.find((v) => v.id === parsed.id);
        return live || parsed;
      } catch {}
    }
    return null;
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [hasReportedSafe, setHasReportedSafe] = useState(false);

  // Sync if household is marked safe in store
  useEffect(() => {
    if (currentUser) {
      const live = state.villagers.find((v) => v.id === currentUser.id);
      if (live && live.status === 'safe' && live.safeZoneReached) {
        setHasReportedSafe(true);
      }
    }
  }, [state.villagers, currentUser]);

  useEffect(() => {
    if (!state.adminForceSmsActive && state.phase === 'NOMINAL' && !state.isEvacuationTriggered) {
      setHasReportedSafe(false);
    }
  }, [state.adminForceSmsActive, state.phase, state.isEvacuationTriggered]);

  if (!currentUser && !embedded) {
    return (
      <div className="pt-24 pb-16 px-4">
        <VillagerLogin
          onLogin={(v) => {
            setCurrentUser(v);
            localStorage.setItem('bhuraksha_villager_auth', JSON.stringify(v));
          }}
        />
      </div>
    );
  }

  // The Villager Portal strictly turns RED only when Admin sends Force SMS or evacuation drill is active and user hasn't safely reached
  const isMove = (state.adminForceSmsActive || state.isEvacuationTriggered || state.phase === 'EVACUATION' || state.phase === 'SUBSIDENCE') && !hasReportedSafe;
  const isWatch = !isMove && !hasReportedSafe && (state.phase === 'ANOMALY' || state.phase === 'VERIFIED');

  const handleConfirmSafe = () => {
    setHasReportedSafe(true);
    if (currentUser) {
      zt.markVillagerSafe(currentUser.id);
    } else if (state.villagers.length > 0) {
      zt.markVillagerSafe(state.villagers[0].id);
    }
  };

  const copy = hasReportedSafe
    ? {
        t: 'You are Safe — Checked into Gate N-2',
        sub: `Safe arrival registered in District Control Room for ${currentUser ? currentUser.name : 'Resident'}. All ${currentUser?.groupSize || 4} family members verified safe inside Muster Refuge Shelter.`,
        tag: 'VERIFIED SAFE · CHECK-IN COMPLETE',
      }
    : isMove
    ? {
        t: L.moveT || 'Evacuate now — follow Route N-2',
        sub: 'EMERGENCY EVACUATION ORDER: Evacuation alarm active from Jharia District Control Room. Move calmly toward Gate N-2 muster point.',
        tag: 'CRITICAL ALERT · EVACUATION IN PROGRESS',
      }
    : {
        t: L.safeT || 'Sector secure · Ward 12',
        sub: L.safeS || 'Ground conditions normal. 12 sentinels on watch above Goaf 7. District Control Room has not issued any evacuation order.',
        tag: L.allSafe || 'ALL SAFE · NORMAL WATCH',
      };

  const bannerColor = hasReportedSafe
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
    {
      label: L.marshal || 'Ward Marshal',
      num: '94311-20712',
      primary: false,
    },
  ];

  return (
    <div className={embedded ? 'pb-4 pt-3' : 'pt-[60px]'}>
      {/* Household Verification Bar */}
      {!embedded && (
        <div
          className="border-b px-4 py-2.5 text-[12px]"
          style={{ borderColor: 'var(--line)', background: 'var(--surface-2)' }}
        >
          <div className="mx-auto flex max-w-[1000px] flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-[10px]">
                ✓
              </span>
              <span style={{ color: 'var(--ink)' }}>
                Citizen Household: <strong>{currentUser ? currentUser.name : 'Ward 12 Resident'}</strong> ({currentUser?.house || 'Sector B'}) · {currentUser?.groupSize || 4} family members
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowLoginModal(!showLoginModal)}
                className="flex items-center gap-1 rounded border px-2.5 py-1 text-[11.5px] font-semibold transition-colors cursor-pointer"
                style={{ borderColor: 'var(--line)', background: 'var(--surface)', color: 'var(--ink)' }}
              >
                <LogIn size={12} />
                <span>{showLoginModal ? 'Close Picker' : 'Switch Household'}</span>
              </button>
              <button
                onClick={() => {
                  setCurrentUser(null);
                  localStorage.removeItem('bhuraksha_villager_auth');
                }}
                className="flex items-center gap-1 rounded px-2 py-1 text-[11.5px] font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer"
              >
                <LogOut size={12} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Household Login / Selection Modal */}
      {showLoginModal && (
        <div className="border-b p-4 animate-fadeIn" style={{ borderColor: 'var(--line)', background: 'var(--surface)' }}>
          <VillagerLogin
            onLogin={(v) => {
              setCurrentUser(v);
              localStorage.setItem('bhuraksha_villager_auth', JSON.stringify(v));
              setShowLoginModal(false);
            }}
          />
        </div>
      )}

      {/* High-Contrast Public Alert Banner */}
      <section
        className={`relative overflow-hidden ${
          isMove ? 'banner-pulse' : ''
        }`}
        style={{ background: bannerColor }}
      >
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg,#fff 0 20px,transparent 20px 40px)',
          }}
        />

        <div className="relative mx-auto max-w-[1000px] px-5 py-10 text-center md:py-14">
          {!embedded && (
            <div className="mb-6 flex justify-center">
              <LanguageModal />
            </div>
          )}

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/20 px-3.5 py-1 text-[11.5px] font-medium text-white backdrop-blur-sm">
            <span
              className={`h-2 w-2 rounded-full ${
                isMove ? 'bg-red-400 animate-ping' : 'bg-emerald-400'
              }`}
            />
            <span>
              {hasReportedSafe
                ? 'CHECK-IN CONFIRMED: RESIDENT SAFELY ACCOUNTED FOR AT MUSTER N-2'
                : isMove
                ? 'ALERT LINKED: DISTRICT CONTROL ROOM DISPATCH (EVACUATION ACTIVE)'
                : 'LINKED TO DISTRICT CONTROL ROOM · STANDBY WATCH (SAFE)'}
            </span>
          </div>

          <div className="flex items-center justify-center gap-2.5">
            {hasReportedSafe ? (
              <CheckCircle2 size={24} className="text-white" />
            ) : isMove ? (
              <Siren size={20} className="siren-glow text-white" />
            ) : isWatch ? (
              <AlertTriangle size={20} className="text-white" />
            ) : (
              <ShieldCheck size={20} className="text-white" />
            )}
            <span className="font-mono text-[12px] font-700 uppercase tracking-[0.26em] text-white">
              {copy.tag}
            </span>
          </div>

          <h1 className="mx-auto mt-5 max-w-3xl text-[clamp(1.75rem,5vw,3.25rem)] font-700 leading-[1.18] text-white">
            {copy.t}
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-[clamp(0.95rem,1.6vw,1.1rem)] leading-relaxed text-white/90">
            {copy.sub}
          </p>

          {/* Large Countdown Clock Container */}
          <div className="mx-auto mt-9 w-full max-w-lg rounded-xl border border-white/35 bg-black/15 px-6 py-6 backdrop-blur-sm">
            <div className="font-mono text-[11px] font-600 uppercase tracking-[0.22em] text-white/85">
              {hasReportedSafe ? 'STATUS IN SANCTUARY' : isMove && state.tMinus !== null ? L.timeLeft : L.noEvent}
            </div>
            <div
              className={`font-display num mt-2 text-[clamp(3.4rem,13vw,6rem)] font-700 leading-[1] text-white ${
                isMove ? 'soft-pulse' : ''
              }`}
            >
              {hasReportedSafe ? 'SAFE' : isMove && state.tMinus !== null ? jl(state.tMinus) : '--:--'}
            </div>
            <div className="mt-2 text-[12.5px] text-white/80">
              {hasReportedSafe
                ? `Shelter 1 registration logged with District Incident Command for ${currentUser?.name || 'Resident'}`
                : isMove && state.tMinus !== null
                ? L.estimated
                : L.watching}
            </div>
          </div>

          {/* Action Buttons: Evacuate & Safely Reached (Option 4) */}
          <div className="mx-auto mt-6 max-w-lg space-y-3">
            {isMove && (
              <div className="flex items-center justify-center gap-3 rounded-lg bg-white px-5 py-4 shadow-lg">
                <Footprints
                  size={18}
                  className="shrink-0"
                  style={{ color: 'var(--red)' }}
                />
                <span
                  className="text-[15px] font-700 leading-snug"
                  style={{ color: 'var(--red)' }}
                >
                  {L.goGate || 'Walk calmly along Route N-2 to GATE N-2 refuge'}
                </span>
              </div>
            )}

            {/* Safely Reached Button (Image 4): Turns RED to GREEN and updates Admin */}
            {!hasReportedSafe ? (
              <button
                onClick={handleConfirmSafe}
                className="focus-ring flex w-full items-center justify-center gap-2.5 rounded-xl bg-white px-6 py-4 text-[16px] font-bold text-emerald-800 shadow-xl transition-all hover:bg-emerald-50 cursor-pointer border-2 border-emerald-500"
              >
                <ShieldCheck size={22} className="text-emerald-600 shrink-0" />
                <span>I Have Safely Reached Safe Zone (Gate N-2)</span>
              </button>
            ) : (
              <div className="rounded-xl border border-white/50 bg-black/20 p-5 text-center text-white backdrop-blur-md">
                <div className="flex items-center justify-center gap-2 text-[17px] font-bold">
                  <CheckCircle2 size={22} className="text-emerald-300" />
                  <span>ARRIVAL VERIFIED AT GATE N-2 REFUGE</span>
                </div>
                <p className="mt-1 text-[12.5px] text-white/90">
                  District Incident Commander has received your arrival confirmation. Status updated to <strong>SAFE (GREEN)</strong> in Admin Control Room.
                </p>
                <button
                  onClick={() => setHasReportedSafe(false)}
                  className="mt-3 text-[11.5px] text-white/75 underline hover:text-white cursor-pointer"
                >
                  Reset safe status (for testing or practice drill)
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Emergency Contact & Direction Actions */}
      <section className="mx-auto max-w-[1000px] px-5 py-10">
        <div className="mb-5 flex items-center gap-4">
          <span className="h-px flex-1" style={{ background: 'var(--line)' }} />
          <h2
            className="text-[13px] font-700 uppercase tracking-[0.18em]"
            style={{ color: 'var(--mute)' }}
          >
            {L.emergency || 'Emergency Helplines'}
          </h2>
          <span className="h-px flex-1" style={{ background: 'var(--line)' }} />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {emergencyContacts.map((item, idx) => (
            <a
              key={idx}
              href={`tel:${item.num.replace(/[^0-9]/g, '')}`}
              className="focus-ring group flex items-center justify-between gap-4 rounded-lg border p-5 transition-all duration-300 hover:-translate-y-0.5"
              style={{
                borderColor: item.primary ? 'var(--red)' : 'var(--line)',
                background: item.primary ? 'var(--red-sw)' : 'var(--surface)',
              }}
            >
              <div className="min-w-0">
                <div
                  className="text-[13.5px] font-600"
                  style={{
                    color: item.primary ? 'var(--red)' : 'var(--ink-2)',
                  }}
                >
                  {item.label}
                </div>
                <div
                  className="font-display num mt-1 text-[clamp(1.5rem,4vw,2rem)] font-700 leading-none"
                  style={{
                    color: item.primary ? 'var(--red)' : 'var(--ink)',
                  }}
                >
                  {item.num}
                </div>
              </div>
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white"
                style={{
                  background: item.primary ? 'var(--red)' : 'var(--ink)',
                }}
              >
                <PhoneCall size={18} />
              </span>
            </a>
          ))}
        </div>

        {/* Live Ground Verification Status Strip */}
        <div
          className="mt-5 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 rounded-lg border px-5 py-3.5 text-[12.5px]"
          style={{
            borderColor: 'var(--line)',
            background: 'var(--surface)',
            color: 'var(--mute)',
          }}
        >
          <span
            className="flex items-center gap-2 font-600"
            style={{ color: bannerColor }}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: bannerColor }}
            />
            {L.live || 'LIVE'} · {state.clock}
          </span>
          <span>
            {L.risk}:{' '}
            <strong className="num" style={{ color: 'var(--ink-2)' }}>
              {Math.round(state.risk)}%
            </strong>
          </span>
          <span>
            {L.delivered}:{' '}
            <strong className="num" style={{ color: 'var(--ink-2)' }}>
              {state.smsSent.toLocaleString('en-IN')}/4,127
            </strong>
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={13} />
            <span>{L.muster}:</span>
            <strong style={{ color: 'var(--ink-2)' }}>Gate N-2</strong>
          </span>
        </div>
      </section>



      {/* Community Evacuation Status & Accounted Citizens (Image 5 in Villager Tab) */}
      {!embedded && (
        <section className="mx-auto max-w-[1000px] px-5 pb-16">
          <div className="mb-4">
            <h2 className="text-[15px] font-700 tracking-tight" style={{ color: 'var(--ink)' }}>
              Ward 12 Community Evacuation Tracker (Gate N-2 Sanctuary)
            </h2>
            <p className="text-[12px]" style={{ color: 'var(--mute)' }}>
              Live community progress, neighborhood safe arrivals, and muster capacity
            </p>
          </div>
          <EvacuationStatusWidget />
        </section>
      )}
    </div>
  );
};
