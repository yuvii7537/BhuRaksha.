import React, { useState } from 'react';
import { BhuSnapshot } from '../types';
import { zt, hasWebSerial } from '../context/BhuContext';
import { useLang } from '../context/LangContext';
import { Badge, Label } from './UIElements';
import {
  Wifi,
  WifiOff,
  CheckCircle,
  AlertTriangle,
  Radio,
  Usb,
  Unplug,
  Loader2,
  PlugZap,
  Info,
  Laptop,
} from 'lucide-react';

export const WifiModal: React.FC<{ s: BhuSnapshot }> = ({ s }) => {
  const { t } = useLang();
  const serialSupported = hasWebSerial();
  const wifiErr = zt.wifiError || s.wifiError;
  const [gatewayIp, setGatewayIp] = useState('192.168.4.1');

  const isOption1Connected = s.wifiConnected || (s.connected && s.connectionType === 'wifi');
  const isOption2Connected = s.usbConnected || (s.connected && s.connectionType === 'usb');

  return (
    <div
      className="rounded-lg border shadow-sm"
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
        <div className="flex items-center gap-3">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-md border"
            style={{
              borderColor: 'var(--line)',
              background: 'var(--surface-2)',
            }}
          >
            <Radio size={18} style={{ color: 'var(--saffron)' }} />
          </span>
          <div className="min-w-0">
            <h2
              className="font-display text-[17px] font-700"
              style={{ color: 'var(--ink)' }}
            >
              {t('wifiTitle') || 'ESP32 Hardware Gateway Link'}
            </h2>
            <p className="text-[12.5px]" style={{ color: 'var(--mute)' }}>
              Independent Option 1 (Wi-Fi Soft-AP) and Option 2 (USB Serial 115200 baud)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isOption1Connected ? (
            <Badge tone="safe">
              <Wifi size={11} />
              <span>OPTION 1 (WI-FI) CONNECTED</span>
            </Badge>
          ) : isOption2Connected ? (
            <Badge tone="safe">
              <Usb size={11} />
              <span>OPTION 2 (USB SERIAL) CONNECTED</span>
            </Badge>
          ) : (
            <Badge tone="crit">
              <WifiOff size={11} />
              <span>NO HARDWARE LINKED (OFFLINE)</span>
            </Badge>
          )}
        </div>
      </div>

      {/* Main Connection Panel */}
      <div className="p-5">
        {/* Error notification banner if connection failed */}
        {wifiErr && (
          <div
            className="mb-5 flex items-start gap-3 rounded-md border p-4 text-[13px] leading-relaxed"
            style={{
              borderColor: 'var(--red)',
              background: 'var(--red-sw)',
              color: 'var(--red)',
            }}
          >
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="font-700">Connection Notice</div>
              <div className="mt-0.5 opacity-90">{wifiErr}</div>
            </div>
          </div>
        )}

        {/* Both Option 1 and Option 2 cards side by side */}
        <div className="grid gap-5 md:grid-cols-2">
          {/* ================= OPTION 1: ESP32 WI-FI ================= */}
          <div
            className="flex flex-col justify-between rounded-lg border p-5 transition-shadow"
            style={{
              borderColor: isOption1Connected ? 'var(--green)' : 'var(--line)',
              background: isOption1Connected ? 'var(--green-sw)' : 'var(--surface-2)',
            }}
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[14px] font-700" style={{ color: 'var(--ink)' }}>
                  <Wifi size={17} style={{ color: isOption1Connected ? 'var(--green)' : 'var(--saffron)' }} />
                  <span>Option 1: Connect via ESP32 Wi-Fi</span>
                </div>
                <span
                  className="rounded px-2 py-0.5 text-[10px] font-bold"
                  style={{
                    background: isOption1Connected ? 'var(--green)' : 'rgba(217,119,6,0.15)',
                    color: isOption1Connected ? '#ffffff' : 'var(--saffron)',
                  }}
                >
                  {isOption1Connected ? 'CONNECTED' : 'DISCONNECTED'}
                </span>
              </div>

              <p className="mt-1.5 text-[12.5px] leading-relaxed" style={{ color: 'var(--mute)' }}>
                Direct HTTP probe to ESP32 gateway Soft-AP (SSID: <strong>BHURAKSHA-GW-xx</strong>).
              </p>

              {isOption1Connected ? (
                <div className="mt-4 rounded-md border bg-white/70 dark:bg-black/30 p-3.5 space-y-1.5 text-[12px]" style={{ borderColor: 'var(--green)' }}>
                  <div className="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-400">
                    <CheckCircle size={15} />
                    <span>Option 1 Active · Wi-Fi Telemetry Streaming</span>
                  </div>
                  <div className="font-mono text-[11.5px] text-zinc-700 dark:text-zinc-300">
                    SSID: <strong>{s.ssid || 'BHURAKSHA-GW-04'}</strong> · IP: <strong>{s.espIp || '192.168.4.1'}</strong>
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    Signal RSSI: {s.wifiRssi || -52} dBm · LoRa 868.1 MHz Gateway Active
                  </div>
                </div>
              ) : (
                <div className="mt-3.5">
                  <Label className="mb-1 text-[11px]">Gateway Endpoint IP / Host</Label>
                  <input
                    type="text"
                    value={gatewayIp}
                    onChange={(e) => setGatewayIp(e.target.value)}
                    placeholder="192.168.4.1"
                    disabled={s.isWifiConnecting}
                    className="focus-ring w-full rounded border px-3 py-2 font-mono text-[13px]"
                    style={{
                      borderColor: 'var(--line)',
                      background: 'var(--surface)',
                      color: 'var(--ink)',
                    }}
                  />
                  {isOption2Connected && (
                    <p className="mt-2 text-[11px] text-zinc-500 italic">
                      * Option 2 (USB) is currently active. Connecting Option 1 will switch to Wi-Fi.
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="mt-4 space-y-2">
              {isOption1Connected ? (
                <button
                  onClick={() => zt.disconnectWifi()}
                  className="focus-ring flex w-full items-center justify-center gap-2 rounded-md border border-rose-300 bg-rose-50 dark:border-rose-900/40 dark:bg-rose-950/20 px-4 py-2.5 text-[12.5px] font-700 text-rose-700 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                >
                  <Unplug size={14} />
                  <span>Disconnect Option 1 Wi-Fi</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => zt.connectGatewayWifi(gatewayIp)}
                    disabled={s.isWifiConnecting || s.isUsbConnecting}
                    className="focus-ring flex w-full items-center justify-center gap-2 rounded-md px-4 py-2.5 text-[13px] font-700 text-white transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer shadow-sm"
                    style={{ background: 'var(--green)' }}
                  >
                    {s.isWifiConnecting ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Probing ESP32 Wi-Fi ({gatewayIp})…</span>
                      </>
                    ) : (
                      <>
                        <PlugZap size={14} />
                        <span>Connect Option 1 via ESP32 Wi-Fi</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => zt.simulateConnect('wifi')}
                    disabled={s.isWifiConnecting || s.isUsbConnecting}
                    className="flex w-full items-center justify-center gap-1.5 rounded border py-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 cursor-pointer"
                    style={{ borderColor: 'var(--line)' }}
                  >
                    <span>Simulate Option 1 Wi-Fi Link (Browser Demo)</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* ================= OPTION 2: USB SERIAL ================= */}
          <div
            className="flex flex-col justify-between rounded-lg border p-5 transition-shadow"
            style={{
              borderColor: isOption2Connected ? '#0284c7' : 'var(--line)',
              background: isOption2Connected ? 'rgba(2, 132, 199, 0.08)' : 'var(--surface-2)',
            }}
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[14px] font-700" style={{ color: 'var(--ink)' }}>
                  <Usb size={17} style={{ color: isOption2Connected ? '#0284c7' : 'var(--saffron)' }} />
                  <span>Option 2: Connect via USB Serial Port</span>
                </div>
                <span
                  className="rounded px-2 py-0.5 text-[10px] font-bold"
                  style={{
                    background: isOption2Connected ? '#0284c7' : 'rgba(2, 132, 199, 0.15)',
                    color: isOption2Connected ? '#ffffff' : '#0369a1',
                  }}
                >
                  {isOption2Connected ? 'CONNECTED' : 'DISCONNECTED'}
                </span>
              </div>

              <p className="mt-1.5 text-[12.5px] leading-relaxed" style={{ color: 'var(--mute)' }}>
                Plug ESP32 into USB cable. Directly streams raw LoRa frames via Web Serial (115200 baud).
              </p>

              {isOption2Connected ? (
                <div className="mt-4 rounded-md border border-sky-300 dark:border-sky-800 bg-white/70 dark:bg-black/30 p-3.5 space-y-1.5 text-[12px]">
                  <div className="flex items-center gap-2 font-bold text-sky-700 dark:text-sky-400">
                    <CheckCircle size={15} />
                    <span>Option 2 Active · USB Serial Streaming</span>
                  </div>
                  <div className="font-mono text-[11.5px] text-zinc-700 dark:text-zinc-300">
                    Port: <strong>USB /dev/ttyUSB0 (COM)</strong> · Baud: <strong>115200</strong>
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    Direct hardware UART link · Zero latency edge packet decoder
                  </div>
                </div>
              ) : (
                <div
                  className="mt-3.5 rounded border p-3 text-[11.5px] leading-relaxed"
                  style={{
                    borderColor: 'var(--line)',
                    background: 'var(--surface)',
                    color: 'var(--ink-2)',
                  }}
                >
                  {serialSupported ? (
                    <span className="flex items-center gap-1.5 text-emerald-600 font-600">
                      <CheckCircle size={13} />
                      Web Serial API supported in this browser.
                    </span>
                  ) : (
                    <span className="text-amber-600">
                      Web Serial requires desktop Chrome, Edge, or Opera.
                    </span>
                  )}
                  {isOption1Connected && (
                    <p className="mt-2 text-[11px] text-zinc-500 italic">
                      * Option 1 (Wi-Fi) is currently active. Connecting Option 2 will switch to USB.
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="mt-4 space-y-2">
              {isOption2Connected ? (
                <button
                  onClick={() => zt.disconnectUsb()}
                  className="focus-ring flex w-full items-center justify-center gap-2 rounded-md border border-rose-300 bg-rose-50 dark:border-rose-900/40 dark:bg-rose-950/20 px-4 py-2.5 text-[12.5px] font-700 text-rose-700 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                >
                  <Unplug size={14} />
                  <span>Disconnect Option 2 USB Port</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => zt.connectUsbSerial()}
                    disabled={s.isUsbConnecting || s.isWifiConnecting}
                    className="focus-ring flex w-full items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-[13px] font-700 transition-colors hover:bg-black/[0.03] dark:hover:bg-white/[0.03] disabled:opacity-50 cursor-pointer shadow-sm"
                    style={{
                      borderColor: 'var(--line-2)',
                      background: 'var(--surface)',
                      color: 'var(--ink)',
                    }}
                  >
                    {s.isUsbConnecting ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Opening USB Serial Port…</span>
                      </>
                    ) : (
                      <>
                        <Laptop size={14} />
                        <span>Connect Option 2 via USB Port</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => zt.simulateConnect('usb')}
                    disabled={s.isUsbConnecting || s.isWifiConnecting}
                    className="flex w-full items-center justify-center gap-1.5 rounded border py-1.5 text-[11px] font-semibold text-sky-700 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/20 cursor-pointer"
                    style={{ borderColor: 'var(--line)' }}
                  >
                    <span>Simulate Option 2 USB Link (Browser Demo)</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Hardware isolation notice */}
        <div
          className="mt-4 flex items-start gap-2.5 rounded-md border px-4 py-3 text-[12px] leading-relaxed"
          style={{
            borderColor: 'var(--line)',
            background: 'var(--surface)',
            color: 'var(--mute)',
          }}
        >
          <Info size={15} className="mt-0.5 shrink-0 text-amber-500" />
          <div>
            <strong>Independent Connection Channels:</strong> Option 1 (Wi-Fi) and Option 2 (USB Serial Port) operate completely separately. Connecting via one will never activate the other. You can switch between them at any time.
          </div>
        </div>
      </div>
    </div>
  );
};
