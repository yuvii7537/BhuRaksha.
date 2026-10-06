import React, { useState } from 'react';
import { useBhu, zt } from '../context/BhuContext';
import { Villager } from '../types';
import {
  Users,
  Smartphone,
  ShieldCheck,
  ArrowRight,
  MapPin,
  CheckCircle2,
  UserPlus,
  Home,
  UserCheck,
  PlusCircle,
} from 'lucide-react';

interface VillagerLoginProps {
  onLogin: (villager: Villager) => void;
}

export const VillagerLogin: React.FC<VillagerLoginProps> = ({ onLogin }) => {
  const state = useBhu();
  const [activeTab, setActiveTab] = useState<'signin' | 'register'>('signin');
  const [selectedId, setSelectedId] = useState<string>(
    state.villagers[1]?.id || state.villagers[0]?.id || ''
  );
  const [searchPhone, setSearchPhone] = useState('');

  // Register New Account State
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newSector, setNewSector] = useState('Sector B - Mining Pit Edge');
  const [newHouse, setNewHouse] = useState('');
  const [newGroupSize, setNewGroupSize] = useState(4);
  const [formError, setFormError] = useState<string | null>(null);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      setFormError('Please enter the head of household or resident name.');
      return;
    }
    if (!newPhone.trim()) {
      setFormError('Please enter a mobile phone number for emergency SMS dispatch.');
      return;
    }
    if (!newHouse.trim()) {
      setFormError('Please specify the house / quarter number in Gajpahari.');
      return;
    }

    const created = zt.registerVillager({
      name: newName.trim(),
      phone: newPhone.trim(),
      sector: newSector,
      house: newHouse.trim(),
      groupSize: Number(newGroupSize) || 4,
    });

    onLogin(created);
  };

  const handlePhoneSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDigits = searchPhone.replace(/\D/g, '');
    const matched = state.villagers.find((v) =>
      v.phone.replace(/\D/g, '').endsWith(cleanDigits)
    );
    if (matched) {
      onLogin(matched);
    } else {
      const sel = state.villagers.find((v) => v.id === selectedId) || state.villagers[0];
      if (sel) onLogin(sel);
    }
  };

  return (
    <div className="mx-auto flex min-h-[540px] max-w-[560px] flex-col justify-center px-4 py-8">
      <div
        className="overflow-hidden rounded-xl border shadow-lg transition-all"
        style={{
          borderColor: 'var(--line)',
          background: 'var(--surface)',
        }}
      >
        {/* Header */}
        <div
          className="border-b px-6 py-5 text-center"
          style={{ borderColor: 'var(--line)', background: 'var(--surface-2)' }}
        >
          <div className="mx-auto mb-2.5 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-600">
            <Users size={24} />
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600/10 px-2.5 py-0.5 text-[10.5px] font-bold text-emerald-700 dark:text-emerald-400">
            <span>PUBLIC CITIZEN ACCESS · WARD 12 GAJPAHARI</span>
          </div>
          <h2
            className="font-display mt-2 text-[20px] font-700 tracking-tight"
            style={{ color: 'var(--ink)' }}
          >
            Citizen Emergency Evacuation Portal
          </h2>
          <p className="mt-1 text-[12.5px]" style={{ color: 'var(--mute)' }}>
            Sign into your registered household or register a new domestic unit to receive direct SMS alerts and safe refuge check-ins.
          </p>
        </div>

        {/* Tab Switcher: Sign In vs Add New Account */}
        <div
          className="grid grid-cols-2 border-b text-[13px] font-700"
          style={{ borderColor: 'var(--line)', background: 'var(--surface-2)' }}
        >
          <button
            onClick={() => {
              setActiveTab('signin');
              setFormError(null);
            }}
            className="flex items-center justify-center gap-2 py-3 transition-colors cursor-pointer"
            style={{
              background: activeTab === 'signin' ? 'var(--surface)' : 'transparent',
              color: activeTab === 'signin' ? 'var(--ink)' : 'var(--mute)',
              borderBottom: activeTab === 'signin' ? '2px solid var(--green)' : 'none',
            }}
          >
            <UserCheck size={16} />
            <span>Select Existing Household</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('register');
              setFormError(null);
            }}
            className="flex items-center justify-center gap-2 py-3 transition-colors cursor-pointer"
            style={{
              background: activeTab === 'register' ? 'var(--surface)' : 'transparent',
              color: activeTab === 'register' ? 'var(--green)' : 'var(--mute)',
              borderBottom: activeTab === 'register' ? '2px solid var(--green)' : 'none',
            }}
          >
            <UserPlus size={16} />
            <span>+ Add New Account</span>
          </button>
        </div>

        {/* Tab 1: Select Household / Phone Sign-In */}
        {activeTab === 'signin' && (
          <div className="p-6">
            <form onSubmit={handlePhoneSearchSubmit} className="mb-4">
              <label
                className="mb-1.5 block text-[11.5px] font-700 uppercase tracking-wider"
                style={{ color: 'var(--mute)' }}
              >
                Quick Search by Mobile Number
              </label>
              <div className="flex gap-2">
                <input
                  type="tel"
                  value={searchPhone}
                  onChange={(e) => setSearchPhone(e.target.value)}
                  placeholder="e.g. 9832144102 or last 4 digits"
                  className="focus-ring flex-1 rounded border px-3 py-2 text-[13px]"
                  style={{
                    borderColor: 'var(--line)',
                    background: 'var(--surface)',
                    color: 'var(--ink)',
                  }}
                />
                <button
                  type="submit"
                  className="rounded px-4 py-2 text-[12.5px] font-bold text-white transition-opacity hover:opacity-90 cursor-pointer"
                  style={{ background: 'var(--ink)' }}
                >
                  Find
                </button>
              </div>
            </form>

            <div className="mb-2 flex items-center justify-between">
              <label
                className="text-[11.5px] font-700 uppercase tracking-wider"
                style={{ color: 'var(--mute)' }}
              >
                Or Select from Ward 12 Registry ({state.villagers.length} Households):
              </label>
            </div>

            <div
              className="max-h-[220px] overflow-y-auto divide-y rounded-lg border mb-5"
              style={{ borderColor: 'var(--line)' }}
            >
              {state.villagers.map((v) => {
                const isSelected = selectedId === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedId(v.id)}
                    className="flex w-full items-center justify-between p-3 text-left transition-colors cursor-pointer hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                    style={{
                      background: isSelected ? 'var(--surface-2)' : 'var(--surface)',
                    }}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`flex h-4.5 w-4.5 items-center justify-center rounded-full border text-[10px] ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-600 text-white'
                            : 'border-gray-400 text-transparent'
                        }`}
                      >
                        ✓
                      </span>
                      <div>
                        <div className="text-[13px] font-700" style={{ color: 'var(--ink)' }}>
                          {v.name}
                        </div>
                        <div
                          className="flex items-center gap-1.5 text-[11px]"
                          style={{ color: 'var(--mute)' }}
                        >
                          <MapPin size={10} />
                          <span>{v.house}</span>
                          <span>·</span>
                          <span>{v.groupSize} family members</span>
                        </div>
                      </div>
                    </div>

                    <span
                      className="font-mono text-[11px]"
                      style={{ color: 'var(--mute)' }}
                    >
                      {v.phone}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => {
                const sel = state.villagers.find((v) => v.id === selectedId) || state.villagers[0];
                if (sel) onLogin(sel);
              }}
              className="focus-ring flex w-full items-center justify-center gap-2 rounded-lg py-3 text-[13.5px] font-700 text-white transition-opacity hover:opacity-90 cursor-pointer shadow"
              style={{ background: 'var(--green)' }}
            >
              <ShieldCheck size={16} />
              <span>Continue to Citizen Safety Portal</span>
              <ArrowRight size={15} />
            </button>
          </div>
        )}

        {/* Tab 2: Add New Account / Register Household */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="p-6">
            {formError && (
              <div
                className="mb-4 rounded-md border p-3 text-[12px] font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900"
              >
                {formError}
              </div>
            )}

            <div className="space-y-3.5">
              <div>
                <label className="mb-1 block text-[11.5px] font-700 uppercase tracking-wider" style={{ color: 'var(--mute)' }}>
                  Head of Household / Resident Name *
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Surendra Murmu"
                  required
                  className="focus-ring w-full rounded border px-3 py-2 text-[13px]"
                  style={{
                    borderColor: 'var(--line)',
                    background: 'var(--surface)',
                    color: 'var(--ink)',
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[11.5px] font-700 uppercase tracking-wider" style={{ color: 'var(--mute)' }}>
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+91 98321 00000"
                    required
                    className="focus-ring w-full rounded border px-3 py-2 font-mono text-[13px]"
                    style={{
                      borderColor: 'var(--line)',
                      background: 'var(--surface)',
                      color: 'var(--ink)',
                    }}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[11.5px] font-700 uppercase tracking-wider" style={{ color: 'var(--mute)' }}>
                    Family Members *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="15"
                    value={newGroupSize}
                    onChange={(e) => setNewGroupSize(Number(e.target.value))}
                    required
                    className="focus-ring w-full rounded border px-3 py-2 text-[13px]"
                    style={{
                      borderColor: 'var(--line)',
                      background: 'var(--surface)',
                      color: 'var(--ink)',
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[11.5px] font-700 uppercase tracking-wider" style={{ color: 'var(--mute)' }}>
                  Gajpahari Sector *
                </label>
                <select
                  value={newSector}
                  onChange={(e) => setNewSector(e.target.value)}
                  className="focus-ring w-full rounded border px-3 py-2 text-[13px]"
                  style={{
                    borderColor: 'var(--line)',
                    background: 'var(--surface)',
                    color: 'var(--ink)',
                  }}
                >
                  <option value="Sector A - Upper Colliery">Sector A - Upper Colliery</option>
                  <option value="Sector B - Mining Pit Edge">Sector B - Mining Pit Edge</option>
                  <option value="Sector C - Lower Gajpahari Hamlet">Sector C - Lower Gajpahari Hamlet</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-[11.5px] font-700 uppercase tracking-wider" style={{ color: 'var(--mute)' }}>
                  House / Quarter Address *
                </label>
                <input
                  type="text"
                  value={newHouse}
                  onChange={(e) => setNewHouse(e.target.value)}
                  placeholder="e.g. Quarter C-28, Colliery Road"
                  required
                  className="focus-ring w-full rounded border px-3 py-2 text-[13px]"
                  style={{
                    borderColor: 'var(--line)',
                    background: 'var(--surface)',
                    color: 'var(--ink)',
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              className="focus-ring mt-5 flex w-full items-center justify-center gap-2 rounded-lg py-3 text-[13.5px] font-700 text-white transition-opacity hover:opacity-90 cursor-pointer shadow"
              style={{ background: 'var(--green)' }}
            >
              <PlusCircle size={16} />
              <span>Create Account & Enter Safety Portal</span>
              <ArrowRight size={15} />
            </button>
          </form>
        )}

        {/* Footer */}
        <div
          className="border-t px-6 py-3 text-center text-[11.5px]"
          style={{
            borderColor: 'var(--line)',
            background: 'var(--surface-2)',
            color: 'var(--mute)',
          }}
        >
          Coal India Ltd. · DGMS Ward 12 Citizen Life-Safety Registry
        </div>
      </div>
    </div>
  );
};
