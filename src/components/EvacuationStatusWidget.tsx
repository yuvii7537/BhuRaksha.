import React, { useState } from 'react';
import { useBhu, zt } from '../context/BhuContext';
import { Villager, VillagerStatus } from '../types';
import {
  Users,
  ShieldCheck,
  AlertTriangle,
  Footprints,
  CheckCircle2,
  Bell,
  Search,
  Battery,
  MapPin,
  Radio,
  Send,
  Sparkles,
} from 'lucide-react';

export const EvacuationStatusWidget: React.FC = () => {
  const state = useBhu();
  const [filter, setFilter] = useState<'all' | VillagerStatus>('all');
  const [search, setSearch] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const villagers = state.villagers || [];
  const safeCount = villagers.filter((v) => v.status === 'safe').length;
  const movingCount = villagers.filter((v) => v.status === 'moving').length;
  const dangerCount = villagers.filter((v) => v.status === 'in-danger').length;
  const totalCount = villagers.length;
  const totalPersons = villagers.reduce((acc, v) => acc + v.groupSize, 0);
  const safePersons = villagers
    .filter((v) => v.status === 'safe')
    .reduce((acc, v) => acc + v.groupSize, 0);
  const safePercentage = totalCount > 0 ? Math.round((safeCount / totalCount) * 100) : 100;

  const filteredVillagers = villagers.filter((v) => {
    const matchesFilter = filter === 'all' || v.status === filter;
    const matchesSearch =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.sector.toLowerCase().includes(search.toLowerCase()) ||
      v.house.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleManualMarkSafe = (villager: Villager) => {
    zt.markVillagerSafe(villager.id);
    setToastMsg(`Manual confirmation: ${villager.name} verified safe at Muster N-2`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handlePingSms = (villager: Villager) => {
    zt.pingVillagerSms(villager.id);
    setToastMsg(`Priority LoRa SMS ping sent to ${villager.phone} (${villager.name})`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div
      className="rounded-lg border shadow-sm transition-all"
      style={{
        borderColor: 'var(--line)',
        background: 'var(--surface)',
      }}
    >
      {/* Widget Header */}
      <div
        className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4"
        style={{ borderColor: 'var(--line)' }}
      >
        <div>
          <div className="flex items-center gap-2">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-md"
              style={{
                background:
                  dangerCount > 0 ? 'var(--red-sw)' : 'var(--green-sw)',
                color: dangerCount > 0 ? 'var(--red)' : 'var(--green)',
              }}
            >
              <Users size={15} />
            </span>
            <h3
              className="font-display text-[16px] font-700 tracking-tight"
              style={{ color: 'var(--ink)' }}
            >
              Live Villager Evacuation & Safe Zone Tracker
            </h3>
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-700"
              style={{
                background: 'var(--green-sw)',
                color: 'var(--green)',
              }}
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              LIVE TELEMETRY
            </span>
          </div>
          <p className="mt-0.5 text-[12px]" style={{ color: 'var(--mute)' }}>
            Real-time GPS & LoRa tag tracking toward Safe Zone Alpha (Gate N-2 Muster Sanctuary)
          </p>
        </div>

        {/* Universal SMS Ping & Progress Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              zt.pingVillagerSms();
              setToastMsg('Universal LoRa SMS check-in ping broadcast to all Ward 12 households');
              setTimeout(() => setToastMsg(null), 3500);
            }}
            title="Transmit priority LoRa radio ping to all registered citizens at any time"
            className="focus-ring flex items-center gap-1.5 rounded-md border px-3 py-2 text-[12px] font-700 transition-colors cursor-pointer shadow-sm"
            style={{
              borderColor: 'var(--saffron)',
              background: 'var(--saffron-sw)',
              color: 'var(--saffron)',
            }}
          >
            <Send size={12} />
            <span>Universal SMS Ping</span>
          </button>

          <div className="text-right">
            <div className="text-[11px] font-600" style={{ color: 'var(--mute)' }}>
              EVACUATION SAFE RATE
            </div>
            <div
              className="font-mono text-[14px] font-700"
              style={{ color: safePercentage === 100 ? 'var(--green)' : 'var(--saffron)' }}
            >
              {safePersons} / {totalPersons} Citizens ({safePercentage}%)
            </div>
          </div>
          <div
            className="h-9 w-24 overflow-hidden rounded border p-0.5"
            style={{ borderColor: 'var(--line)', background: 'var(--surface-2)' }}
          >
            <div
              className="h-full rounded transition-all duration-500"
              style={{
                width: `${safePercentage}%`,
                background:
                  safePercentage === 100
                    ? 'var(--green)'
                    : safePercentage > 50
                    ? 'var(--saffron)'
                    : 'var(--red)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Live Toast Notice for Recent Safe Arrival */}
      {state.recentSafeArrival && (
        <div
          className="flex items-center justify-between gap-3 border-b px-5 py-2.5 text-[12px] font-600"
          style={{
            background: 'var(--green-sw)',
            borderColor: 'var(--green)',
            color: 'var(--green)',
          }}
        >
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white">
              <CheckCircle2 size={12} />
            </span>
            <span>
              <strong>SAFE ARRIVAL NOTIFICATION:</strong> {state.recentSafeArrival.villagerName} ({state.recentSafeArrival.groupSize} citizens) has reached{' '}
              {state.recentSafeArrival.zoneName} safely!
            </span>
          </div>
          <span className="font-mono text-[11px] opacity-80">
            {state.recentSafeArrival.t}
          </span>
        </div>
      )}

      {toastMsg && (
        <div
          className="flex items-center gap-2 border-b px-5 py-2 text-[12px] font-600"
          style={{
            background: 'var(--saffron-sw)',
            borderColor: 'var(--line)',
            color: 'var(--ink)',
          }}
        >
          <Bell size={13} style={{ color: 'var(--saffron)' }} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Metric Counters Grid */}
      <div
        className="grid grid-cols-2 gap-px border-b sm:grid-cols-4"
        style={{ background: 'var(--line)' }}
      >
        <button
          onClick={() => setFilter('all')}
          className="flex flex-col p-3.5 text-left transition-colors cursor-pointer"
          style={{
            background: filter === 'all' ? 'var(--surface-2)' : 'var(--surface)',
          }}
        >
          <span className="text-[11px] font-600 uppercase tracking-wider" style={{ color: 'var(--mute)' }}>
            Total Registered
          </span>
          <span className="font-display num mt-0.5 text-[22px] font-700" style={{ color: 'var(--ink)' }}>
            {totalCount} <span className="text-[13px] font-400 font-sans" style={{ color: 'var(--mute)' }}>({totalPersons} people)</span>
          </span>
        </button>

        <button
          onClick={() => setFilter('safe')}
          className="flex flex-col p-3.5 text-left transition-colors cursor-pointer"
          style={{
            background: filter === 'safe' ? 'var(--green-sw)' : 'var(--surface)',
          }}
        >
          <span className="flex items-center gap-1.5 text-[11px] font-600 uppercase tracking-wider" style={{ color: 'var(--green)' }}>
            <ShieldCheck size={13} />
            Safe in Refuge
          </span>
          <span className="font-display num mt-0.5 text-[22px] font-700" style={{ color: 'var(--green)' }}>
            {safeCount} <span className="text-[13px] font-400 font-sans opacity-80">({safePersons} safe)</span>
          </span>
        </button>

        <button
          onClick={() => setFilter('moving')}
          className="flex flex-col p-3.5 text-left transition-colors cursor-pointer"
          style={{
            background: filter === 'moving' ? 'var(--saffron-sw)' : 'var(--surface)',
          }}
        >
          <span className="flex items-center gap-1.5 text-[11px] font-600 uppercase tracking-wider" style={{ color: 'var(--saffron)' }}>
            <Footprints size={13} />
            Moving to Safety
          </span>
          <span className="font-display num mt-0.5 text-[22px] font-700" style={{ color: 'var(--saffron)' }}>
            {movingCount}
          </span>
        </button>

        <button
          onClick={() => setFilter('in-danger')}
          className="flex flex-col p-3.5 text-left transition-colors cursor-pointer"
          style={{
            background: filter === 'in-danger' ? 'var(--red-sw)' : 'var(--surface)',
          }}
        >
          <span className="flex items-center gap-1.5 text-[11px] font-600 uppercase tracking-wider" style={{ color: 'var(--red)' }}>
            <AlertTriangle size={13} />
            In Hazard Zone
          </span>
          <span className="font-display num mt-0.5 text-[22px] font-700" style={{ color: 'var(--red)' }}>
            {dangerCount}
          </span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3 text-[12.5px]"
        style={{ borderColor: 'var(--line)', background: 'var(--surface-2)' }}
      >
        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              { key: 'all', label: `All Citizens (${totalCount})` },
              { key: 'safe', label: `Safe (${safeCount})` },
              { key: 'moving', label: `Moving (${movingCount})` },
              { key: 'in-danger', label: `In Danger (${dangerCount})` },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className="rounded-md px-3 py-1 text-[11.5px] font-600 transition-colors cursor-pointer"
              style={{
                background: filter === tab.key ? 'var(--ink)' : 'var(--surface)',
                color: filter === tab.key ? 'var(--surface)' : 'var(--mute)',
                border: '1px solid var(--line)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <Search
            size={13}
            className="absolute left-2.5 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--mute)' }}
          />
          <input
            type="text"
            placeholder="Search citizen, ward, or house..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border py-1.5 pl-8 pr-3 text-[12px] outline-none transition-colors"
            style={{
              borderColor: 'var(--line)',
              background: 'var(--surface)',
              color: 'var(--ink)',
            }}
          />
        </div>
      </div>

      {/* Villagers Real-Time Roster */}
      <div className="divide-y max-h-[460px] overflow-y-auto" style={{ borderColor: 'var(--line)' }}>
        {!state.isEvacuationTriggered ? (
          <div className="py-12 px-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-black/5 dark:bg-white/5" style={{ color: 'var(--mute)' }}>
              <Users size={22} />
            </div>
            <div className="text-[14.5px] font-700" style={{ color: 'var(--ink)' }}>
              Evacuation Ledger Standby · Ground Stable
            </div>
            <p className="mx-auto mt-1 max-w-md text-[12px] leading-relaxed" style={{ color: 'var(--mute)' }}>
              No active evacuation event is triggered. Once a subsidence drill or Force SMS is initiated, all citizens will appear here in red alert until they reach Gate N-2 Safe Sanctuary.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => zt.trigger()}
                className="focus-ring flex items-center gap-1.5 rounded-md px-3.5 py-2 text-[12px] font-700 text-white cursor-pointer shadow-sm"
                style={{ background: 'var(--red)' }}
              >
                <AlertTriangle size={13} />
                <span>Trigger Subsidence Evacuation Drill</span>
              </button>
              <button
                onClick={() => zt.manualSms()}
                className="focus-ring flex items-center gap-1.5 rounded-md border px-3 py-2 text-[12px] font-600 cursor-pointer"
                style={{ borderColor: 'var(--line-2)', background: 'var(--surface-2)', color: 'var(--ink)' }}
              >
                <Send size={13} />
                <span>Send Emergency SMS Ping</span>
              </button>
            </div>
          </div>
        ) : filteredVillagers.length === 0 ? (
          <div className="py-8 text-center text-[13px]" style={{ color: 'var(--mute)' }}>
            No citizens match the selected filter.
          </div>
        ) : (
          filteredVillagers.map((villager) => {
            const isSafe = villager.status === 'safe';
            const isMoving = villager.status === 'moving';
            const isDanger = villager.status === 'in-danger';

            const statusColor = isSafe
              ? 'var(--green)'
              : isMoving
              ? 'var(--saffron)'
              : 'var(--red)';
            const statusBg = isSafe
              ? 'var(--green-sw)'
              : isMoving
              ? 'var(--saffron-sw)'
              : 'var(--red-sw)';

            return (
              <div
                key={villager.id}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
              >
                {/* Left: Identity & Sector */}
                <div className="flex items-center gap-3 min-w-[200px]">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-[13px] font-700"
                    style={{
                      background: statusBg,
                      borderColor: statusColor,
                      color: statusColor,
                    }}
                  >
                    {isSafe ? (
                      <CheckCircle2 size={16} />
                    ) : isMoving ? (
                      <Footprints size={15} />
                    ) : (
                      <AlertTriangle size={15} />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[13.5px] font-700" style={{ color: 'var(--ink)' }}>
                        {villager.name}
                      </span>
                      <span
                        className="rounded px-1.5 py-0.2 text-[10px] font-600"
                        style={{ background: 'var(--surface-2)', color: 'var(--mute)' }}
                      >
                        {villager.groupSize} {villager.groupSize === 1 ? 'person' : 'persons'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11.5px]" style={{ color: 'var(--mute)' }}>
                      <span>{villager.house}</span>
                      <span>·</span>
                      <span className="font-mono">{villager.sector}</span>
                    </div>
                  </div>
                </div>

                {/* Center: Live GPS & Distance to Safe Zone */}
                <div className="flex items-center gap-4 text-[12px]">
                  <div className="hidden sm:block">
                    <div className="flex items-center gap-1 font-mono text-[11px]" style={{ color: 'var(--mute)' }}>
                      <MapPin size={11} />
                      <span>Grid {Math.round(villager.x)}E, {Math.round(villager.y)}N</span>
                    </div>
                    <div className="mt-0.5 text-[11px]" style={{ color: 'var(--ink-2)' }}>
                      {isSafe ? (
                        <span className="font-semibold text-emerald-600">At Safe Sanctuary</span>
                      ) : (
                        <span>
                          <strong>{Math.round(villager.distanceToSafe * 10)}m</strong> to Muster N-2 (~{villager.etaSec}s)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-700"
                    style={{ background: statusBg, color: statusColor }}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isSafe
                          ? 'bg-emerald-500'
                          : isMoving
                          ? 'animate-pulse bg-amber-500'
                          : 'animate-ping bg-rose-600'
                      }`}
                    />
                    <span>
                      {isSafe
                        ? 'SAFE IN REFUGE'
                        : isMoving
                        ? 'EN ROUTE'
                        : 'IN HAZARD ZONE'}
                    </span>
                  </div>
                </div>

                {/* Right: LoRa Battery & Quick Actions */}
                <div className="flex items-center gap-2">
                  <div
                    className="hidden md:flex items-center gap-1 rounded px-2 py-1 text-[11px] font-mono"
                    style={{ background: 'var(--surface-2)', color: 'var(--mute)' }}
                    title="Mesh LoRa tag battery"
                  >
                    <Battery size={12} />
                    <span>{Math.round(villager.battery)}%</span>
                  </div>

                  {!isSafe && (
                    <button
                      onClick={() => handleManualMarkSafe(villager)}
                      title="Manual check-in confirmation"
                      className="focus-ring flex items-center gap-1 rounded border px-2.5 py-1 text-[11px] font-600 transition-colors cursor-pointer"
                      style={{
                        borderColor: 'var(--green)',
                        background: 'var(--green-sw)',
                        color: 'var(--green)',
                      }}
                    >
                      <CheckCircle2 size={12} />
                      <span className="hidden sm:inline">Confirm Safe</span>
                    </button>
                  )}

                  <button
                    onClick={() => handlePingSms(villager)}
                    title="Send direct priority LoRa ping"
                    className="focus-ring flex items-center gap-1 rounded border px-2.5 py-1 text-[11px] font-600 transition-colors cursor-pointer"
                    style={{
                      borderColor: 'var(--line-2)',
                      background: 'var(--surface)',
                      color: 'var(--ink-2)',
                    }}
                  >
                    <Send size={11} />
                    <span className="hidden sm:inline">SMS Ping</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer / Safe Zone Details */}
      <div
        className="flex flex-wrap items-center justify-between gap-3 border-t px-5 py-3 text-[11.5px]"
        style={{ borderColor: 'var(--line)', background: 'var(--surface-2)', color: 'var(--mute)' }}
      >
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} style={{ color: 'var(--green)' }} />
          <span>
            Designated Safe Zone: <strong>Muster Point N-2 (Elevated Bedrock Ridge · Refuge Shelter 1)</strong>
          </span>
        </div>
        <div>
          <span>Auto-verification radius: <strong>25 meters</strong> from muster beacon</span>
        </div>
      </div>
    </div>
  );
};
