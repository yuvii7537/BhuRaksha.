import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  BhuSnapshot,
  DetectedAp,
  SentinelNode,
  SubsidencePhase,
  AlertItem,
  SmsItem,
  Villager,
  SafeArrivalNotification,
  VillagerStatus,
} from '../types';

const MUSTER_SAFE_ZONE = { x: 14, y: 22 };

const INITIAL_VILLAGERS: Omit<Villager, 'distanceToSafe' | 'etaSec'>[] = [
  {
    id: 'V-01',
    name: 'Ramesh Soren',
    phone: '+91 98321 44102',
    sector: 'Sector B',
    house: 'House B-14 (Colliery Lane)',
    x: 42,
    y: 52,
    initialX: 42,
    initialY: 52,
    status: 'safe',
    safeZoneReached: false,
    speed: 0.28,
    battery: 92,
    groupSize: 3,
  },
  {
    id: 'V-02',
    name: 'Sunita Mahato & Family',
    phone: '+91 94311 88390',
    sector: 'Sector C (Subsidence Zone)',
    house: 'House C-02 (Near Goaf Fault)',
    x: 58,
    y: 59,
    initialX: 58,
    initialY: 59,
    status: 'safe',
    safeZoneReached: false,
    speed: 0.22,
    battery: 78,
    groupSize: 4,
  },
  {
    id: 'V-03',
    name: 'Deepak Hansda',
    phone: '+91 91224 55921',
    sector: 'Sector A',
    house: 'House A-08 (North Ridge)',
    x: 26,
    y: 34,
    initialX: 26,
    initialY: 34,
    status: 'safe',
    safeZoneReached: false,
    speed: 0.35,
    battery: 88,
    groupSize: 2,
  },
  {
    id: 'V-04',
    name: 'Anita Tudu & Mother',
    phone: '+91 97710 33281',
    sector: 'Sector C (Subsidence Zone)',
    house: 'House C-11 (Gajpahari Slope)',
    x: 64,
    y: 53,
    initialX: 64,
    initialY: 53,
    status: 'safe',
    safeZoneReached: false,
    speed: 0.19,
    battery: 84,
    groupSize: 5,
  },
  {
    id: 'V-05',
    name: 'Rajesh Munda',
    phone: '+91 98350 11942',
    sector: 'Sector B',
    house: 'House B-03 (Haul Road)',
    x: 36,
    y: 44,
    initialX: 36,
    initialY: 44,
    status: 'safe',
    safeZoneReached: false,
    speed: 0.31,
    battery: 95,
    groupSize: 3,
  },
  {
    id: 'V-06',
    name: 'Pooja Besra',
    phone: '+91 94701 66205',
    sector: 'Sector A',
    house: 'House A-19 (Upper Ward)',
    x: 22,
    y: 28,
    initialX: 22,
    initialY: 28,
    status: 'safe',
    safeZoneReached: false,
    speed: 0.33,
    battery: 90,
    groupSize: 1,
  },
  {
    id: 'V-07',
    name: 'Vikram Murmu',
    phone: '+91 93084 77119',
    sector: 'Sector C (Subsidence Zone)',
    house: 'House C-07 (Overbreak Border)',
    x: 60,
    y: 63,
    initialX: 60,
    initialY: 63,
    status: 'safe',
    safeZoneReached: false,
    speed: 0.26,
    battery: 73,
    groupSize: 4,
  },
  {
    id: 'V-08',
    name: 'Kavita Baskey & Kids',
    phone: '+91 99342 99014',
    sector: 'Sector B',
    house: 'House B-22 (Market Cross)',
    x: 48,
    y: 40,
    initialX: 48,
    initialY: 40,
    status: 'safe',
    safeZoneReached: false,
    speed: 0.24,
    battery: 81,
    groupSize: 4,
  },
  {
    id: 'V-09',
    name: 'Arjun Karmakar',
    phone: '+91 96081 22478',
    sector: 'Sector A',
    house: 'House A-04 (West Perimeter)',
    x: 18,
    y: 38,
    initialX: 18,
    initialY: 38,
    status: 'safe',
    safeZoneReached: false,
    speed: 0.36,
    battery: 97,
    groupSize: 2,
  },
  {
    id: 'V-10',
    name: 'Meena Devi',
    phone: '+91 94303 55182',
    sector: 'Sector C (Subsidence Zone)',
    house: 'House C-15 (Underground Void Edge)',
    x: 55,
    y: 68,
    initialX: 55,
    initialY: 68,
    status: 'safe',
    safeZoneReached: false,
    speed: 0.21,
    battery: 69,
    groupSize: 3,
  },
];

const Zs = { x: 61, y: 56 };
const $T = 33;
const PT: [number, number][] = [
  [14, 22],
  [30, 14],
  [47, 20],
  [63, 15],
  [80, 24],
  [90, 40],
  [23, 56],
  [38, 66],
  [55, 54],
  [61, 56],
  [72, 66],
  [52, 82],
];

const ro = () => {
  let f = 0,
    i = 0;
  while (f === 0) f = Math.random();
  while (i === 0) i = Math.random();
  return Math.sqrt(-2 * Math.log(f)) * Math.cos(2 * Math.PI * i);
};

const hc = (f: number, i: number, s: number) => Math.min(s, Math.max(i, f));
const oo = (f: number, i: number, s: number) => f + (i - f) * s;
export const Mi = (f: number) => String(f).padStart(2, '0');
export const bh = () => {
  const f = new Date();
  return `${Mi(f.getHours())}:${Mi(f.getMinutes())}:${Mi(f.getSeconds())}`;
};

export const jl = (f: number | null) => {
  if (f === null) return '--:--';
  const i = Math.max(0, f);
  const s = Math.floor(i / 60);
  const a = Math.floor(i % 60);
  return `${Mi(s)}:${Mi(a)}`;
};

const so: { phase: SubsidencePhase; dur: number }[] = [
  { phase: 'ANOMALY', dur: 3.2 },
  { phase: 'VERIFIED', dur: 4 },
  { phase: 'SIREN', dur: 3 },
  { phase: 'UPLINK', dur: 4.2 },
  { phase: 'COUNTDOWN', dur: 9 },
  { phase: 'EVACUATION', dur: 24 },
  { phase: 'SUBSIDENCE', dur: 4.5 },
  { phase: 'CLEAR', dur: 7 },
];

export const tE: Record<
  SubsidencePhase,
  {
    log: string;
    lvl: 'INFO' | 'WARN' | 'CRIT' | 'SAFE';
    sms?: [string, string, string];
  }
> = {
  NOMINAL: { log: '', lvl: 'INFO' },
  ANOMALY: {
    log: 'ANOMALY: 3-NODE CORRELATED TILT DRIFT · IF SCORE 0.71',
    lvl: 'WARN',
  },
  VERIFIED: {
    log: 'AI VERDICT: SUBSIDENCE SIGNATURE · CONF 94% · HORIZON ≈10 MIN',
    lvl: 'CRIT',
    sms: [
      'ADVISORY',
      'BHURAKSHA ADVISORY: ground movement registered in your sector (Ward 12). Stay away from cracked structures. Await instructions.',
      'भूरक्षा सलाह: आपके क्षेत्र (वार्ड 12) में भू-गति दर्ज हुई है। दरारें वाले भवनों से दूर रहें। निर्देशों की प्रतीक्षा करें।',
    ],
  },
  SIREN: {
    log: 'GW-07: 118 dB SIREN + STROBE ARRAY IGNITED ON SURFACE',
    lvl: 'CRIT',
    sms: [
      'WARNING',
      'SIREN IS LIVE — this is a REAL event. Collect drinking water, switch off gas, move calmly toward Gate N-2 muster point.',
      'सायरन चालू है — यह वास्तविक खतरा है। पेयजल लें, गैस बंद करें, शांति से गेट N-2 मस्टर बिंदु की ओर चलें।',
    ],
  },
  UPLINK: {
    log: 'BGAN BURST → DISTRICT CONTROL ROOM JHARIA · ACK 612 MS',
    lvl: 'WARN',
  },
  COUNTDOWN: {
    log: 'CONTROL ROOM: T-MINUS IGNITED · PANEL-C SOP-7 ARMED',
    lvl: 'CRIT',
    sms: [
      'CRITICAL',
      'EVACUATE NOW · T−05:00 ESTIMATED. Follow green Route N-2. Help the elderly & children first. Do not take vehicles.',
      'तुरंत निकलें · अनुमानित T−05:00। हरे रूट N-2 का अनुसरण करें। बुजुर्गों एवं बच्चों को पहले ले जाएं। वाहन न लें।',
    ],
  },
  EVACUATION: {
    log: 'BROADCAST: 4,127 SMS + APP PUSH EN-ROUTE · MUSTER N-2',
    lvl: 'CRIT',
    sms: [
      'CRITICAL',
      'Alert delivered to all 4,127 registered phones. Booth officials & rescue van dispatched to Gate N-2.',
      'सभी 4,127 पंजीकृत फोन पर अलर्ट पहुँचा। बूथ अधिकारी एवं रेस्क्यू वैन गेट N-2 रवाना।',
    ],
  },
  SUBSIDENCE: {
    log: 'SUBSIDENCE EVENT: −1.2 m BOWL · PREDICTED ZONE ONLY',
    lvl: 'CRIT',
    sms: [
      'CRITICAL',
      'Ground event occurred in the predicted zone. Remain at the muster point. DO NOT return home.',
      'भू-धंसाव पूर्व-अनुमानित क्षेत्र में हुआ। मस्टर बिंदु पर बने रहें। घर वापस न जाएं।',
    ],
  },
  CLEAR: {
    log: 'ALL-CLEAR: 0 CASUALTIES · 4,127 ACCOUNTED',
    lvl: 'SAFE',
    sms: [
      'ALLCLEAR',
      'ALL CLEAR declared. 0 casualties. 4,127 accounted. Wait for official instructions before returning.',
      'स्थिति सुरक्षित घोषित। कोई हताहत नहीं। 4,127 उपस्थित। वापसी से पहले आधिकारिक निर्देश की प्रतीक्षा करें।',
    ],
  },
};

export const nE: Record<
  SubsidencePhase,
  {
    banner: 'SAFE' | 'WATCH' | 'MOVE';
    en: string;
    hi: string;
    subEn: string;
    subHi: string;
  }
> = {
  NOMINAL: {
    banner: 'SAFE',
    en: 'Sector secure',
    hi: 'क्षेत्र सुरक्षित',
    subEn: 'Ground conditions normal. 12 sentinels on watch.',
    subHi: 'भू-स्थिति सामान्य। 12 प्रहरी सतर्क हैं।',
  },
  ANOMALY: {
    banner: 'WATCH',
    en: 'Ground tremor noted',
    hi: 'भू-कंपन दर्ज',
    subEn: 'Sensors detected unusual movement. Officials alerted automatically.',
    subHi: 'सेंसर ने असामान्य गति दर्ज की। अधिकारी स्वतः सूचित।',
  },
  VERIFIED: {
    banner: 'WATCH',
    en: 'Stay alert, verify kit',
    hi: 'सतर्क रहें, किट जाँचें',
    subEn: 'AI confirms real ground stress. Keep water, documents & medicine ready.',
    subHi: 'AI ने भू-दबाव की पुष्टि की। पानी, दस्तावेज़ व दवाइयाँ तैयार रखें।',
  },
  SIREN: {
    banner: 'MOVE',
    en: 'Move toward Gate N-2',
    hi: 'गेट N-2 की ओर चलें',
    subEn: 'Siren is live — a REAL event. Walk calmly, do not run.',
    subHi: 'सायरन चालू — वास्तविक खतरा। शांति से चलें, दौड़ें नहीं।',
  },
  UPLINK: {
    banner: 'MOVE',
    en: 'Keep moving — officials informed',
    hi: 'चलते रहें — अधिकारी सूचित',
    subEn: 'District control room has acknowledged. Rescue van dispatched.',
    subHi: 'जिला नियंत्रण कक्ष ने स्वीकार किया। रेस्क्यू वैन रवाना।',
  },
  COUNTDOWN: {
    banner: 'MOVE',
    en: 'Evacuate now — follow Route N-2',
    hi: 'तुरंत निकलें — रूट N-2',
    subEn: 'Help elderly & children first. No vehicles, follow marshals.',
    subHi: 'बुजुर्गों व बच्चों को पहले। वाहन न लें, मार्शल का पालन करें।',
  },
  EVACUATION: {
    banner: 'MOVE',
    en: 'Reach the muster point',
    hi: 'मस्टर बिंदु पहुँचें',
    subEn: 'Head-count at Gate N-2. Report missing persons to marshals.',
    subHi: 'गेट N-2 पर उपस्थिति दर्ज कराएं। लापता की सूचना मार्शल को दें।',
  },
  SUBSIDENCE: {
    banner: 'MOVE',
    en: 'Hold position at muster',
    hi: 'मस्टर बिंदु पर रुकें',
    subEn: 'Ground event is occurring in the predicted zone. Stay where you are.',
    subHi: 'पूर्व-अनुमानित क्षेत्र में घटना हो रही है। जहाँ हैं वहीं रहें।',
  },
  CLEAR: {
    banner: 'SAFE',
    en: 'All clear — 0 casualties',
    hi: 'स्थिति सुरक्षित — 0 हताहत',
    subEn: 'Everyone is accounted for. Await official return instructions.',
    subHi: 'सभी उपस्थित हैं। वापसी के आधिकारिक निर्देश की प्रतीक्षा करें।',
  },
};

// Web Serial Link Helpers
let ua: any = null;
let dr: any = null;
let is: any = null;
let Cl = '';
const KT = new TextDecoder();
const WT = new TextEncoder();

export function hasWebSerial(): boolean {
  return typeof navigator !== 'undefined' && !!(navigator as any).serial;
}

export async function openSerialPort() {
  if (ua) return;
  const navSerial = (navigator as any).serial;
  if (!navSerial) {
    throw new Error(
      'Web Serial is not supported in this browser. Use Chrome or Edge on desktop with the gateway on USB.'
    );
  }
  try {
    const ports = await navSerial.getPorts?.();
    ua = ports?.length ? ports[0] : await navSerial.requestPort();
    await ua.open({ baudRate: 115200 });
    dr = ua.readable.getReader();
    is = ua.writable.getWriter();
  } catch (err: any) {
    ua = null;
    dr = null;
    is = null;
    if (err?.name === 'NotFoundError') {
      throw new Error('No port selected — the console stays disconnected.');
    }
    throw new Error(
      err?.message ||
        'Could not open the serial port. Unplug the gateway, replug it, then scan again.'
    );
  }
}

export async function writeSerial(cmd: string) {
  if (!is) throw new Error('Serial link is not open.');
  await is.write(WT.encode(cmd + '\r\n'));
}

export async function readSerialUntil(
  timeoutMs: number,
  condition: (line: string) => boolean
): Promise<string[]> {
  if (!dr) throw new Error('Serial link is not open.');
  const lines: string[] = [];
  const deadline = performance.now() + timeoutMs;
  while (performance.now() < deadline) {
    let res: any;
    try {
      res = await Promise.race([
        dr.read(),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error('__timeout')),
            Math.max(50, deadline - performance.now())
          )
        ),
      ]);
    } catch (e: any) {
      if (e?.message === '__timeout') return lines;
      throw new Error('Serial link lost.');
    }
    if (!res || res.done) return lines;
    Cl += KT.decode(res.value, { stream: true });
    let newlineIdx: number;
    while ((newlineIdx = Cl.indexOf('\n')) >= 0) {
      const line = Cl.slice(0, newlineIdx).replace(/[\r\n]+$/, '').trim();
      Cl = Cl.slice(newlineIdx + 1);
      if (line) {
        lines.push(line);
        if (condition(line)) return lines;
      }
    }
  }
  return lines;
}

function parseApLine(line: string): DetectedAp | null {
  let m = line.match(/^SELF,([^,]+),(-?\d+)/i);
  if (m) {
    return {
      ssid: m[1],
      rssi: +m[2],
      secure: true,
      self: true,
      device: 'ESP32-WROOM · this gateway',
    };
  }
  m = line.match(/^AP:?,([^,]+),(-?\d+)(?:,(\w+))?/i);
  if (m) {
    const role = (m[3] || 'OTHER').toUpperCase();
    return {
      ssid: m[1],
      rssi: +m[2],
      secure: true,
      device: role === 'GW' ? 'ESP32-WROOM · gateway' : 'Nearby network (heard by radio)',
    };
  }
  m = line.match(/\+CWLAP:\([^,]*,"([^"]+)",(-?\d+)/i);
  if (m) {
    return {
      ssid: m[1],
      rssi: +m[2],
      secure: true,
      device: 'Nearby network (AT firmware)',
    };
  }
  return null;
}

export class BhuStore {
  listeners = new Set<(snap: BhuSnapshot) => void>();
  adminForceSmsActive = false;
  nodes: SentinelNode[];
  villagers: Villager[] = [];
  safeNotifications: SafeArrivalNotification[] = [];
  recentSafeArrival: SafeArrivalNotification | null = null;
  isEvacuationTriggered = false;
  alerts: AlertItem[] = [];
  smsLog: SmsItem[] = [];
  smsSeq = 0;
  phase: SubsidencePhase = 'NOMINAL';
  phaseT = 0;
  segIdx = -1;
  eventAt: number | null = null;
  risk = 6;
  corr = 0.12;
  sms = 0;
  siren = false;
  running = false;
  startedAt = 0;
  targetTilt = 0;
  bowl = 0;
  bootAt = Date.now();
  linkState: 'OFFLINE' | 'LIVE' | 'HANDSHAKE' = 'OFFLINE';
  lastSyncAt: number | null = null;
  frozen: BhuSnapshot | null = null;
  hsTimer: any = null;
  wifiState: 'DISCONNECTED' | 'SCANNING' | 'JOINING' | 'CONNECTED' = 'DISCONNECTED';
  connectionType: 'wifi' | 'usb' | null = null;
  isWifiConnecting = false;
  isUsbConnecting = false;
  ssid: string | null = null;
  wifiErr: string | null = null;
  detectedAps: DetectedAp[] = [];
  espIpAddr: string | null = null;

  constructor() {
    this.nodes = PT.map(([x, y], idx) => ({
      id: idx + 1,
      label: `ND-${Mi(idx + 1)}`,
      x,
      y,
      tilt: 0.03 + Math.random() * 0.03,
      vib: 4 + Math.random() * 5,
      stretch: 0.05,
      battery: 76 + Math.random() * 22,
      rssi: -72 - Math.random() * 18,
      hops: Math.hypot(x - 92, y - 20) / 30 > 2 ? 3 : 2,
      status: 'OK',
      lag: 0.8 + Math.random() * 0.5,
    }));
    this.initVillagers();
    this.boot();
  }

  initVillagers() {
    this.isEvacuationTriggered = false;
    this.villagers = INITIAL_VILLAGERS.map((v) => {
      const d = Math.hypot(v.initialX - MUSTER_SAFE_ZONE.x, v.initialY - MUSTER_SAFE_ZONE.y);
      return {
        ...v,
        x: v.initialX,
        y: v.initialY,
        status: 'safe',
        safeZoneReached: false,
        distanceToSafe: d,
        etaSec: Math.max(0, Math.round(d / (v.speed * 0.45))),
      };
    });
    this.safeNotifications = [];
    this.recentSafeArrival = null;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.startedAt = performance.now();
    // Do NOT auto-trigger ground subsidence! Villager view remains NOMINAL / ALL SAFE (Green)
    // until explicitly triggered by admin Force SMS or scenario controller.
    this.eventAt = null;
    setInterval(() => this.tick(), 160);
  }

  subscribe(listener: (snap: BhuSnapshot) => void) {
    this.listeners.add(listener);
    listener(this.snapshot());
    return () => {
      this.listeners.delete(listener);
    };
  }

  trigger() {
    // When triggered, immediately activate evacuation and show all citizens in danger (RED)
    this.isEvacuationTriggered = true;
    this.villagers.forEach((v) => {
      if (!v.safeZoneReached) {
        v.status = 'in-danger';
      }
    });
    if (this.segIdx === -1) {
      this.eventAt = 0.0001;
      this.push('SCENARIO: SUBSIDENCE EVENT DRILL TRIGGERED · EVACUATION PROTOCOL ARMED', 'WARN');
    }
    this.emit();
  }

  get busy() {
    return this.segIdx !== -1;
  }

  get wifi() {
    return this.wifiState;
  }

  get wifiError() {
    return this.wifiErr;
  }

  get detected() {
    return this.detectedAps.length > 0;
  }

  async connectGatewayWifi(targetIp: string = '192.168.4.1') {
    if (this.isWifiConnecting || this.isUsbConnecting || this.linkState === 'LIVE') return;
    this.isWifiConnecting = true;
    this.wifiErr = null;
    this.push(`GW-LINK [OPTION 1]: PROBING REAL ESP32 GATEWAY WI-FI AT ${targetIp}…`, 'INFO');
    this.emit();

    try {
      const cleanIp = targetIp.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '') || '192.168.4.1';
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 3000);

      let success = false;
      try {
        const res = await fetch(`http://${cleanIp}/status`, {
          method: 'GET',
          signal: controller.signal,
          mode: 'cors',
        });
        if (res.ok) success = true;
      } catch {
        try {
          const resPing = await fetch(`http://${cleanIp}/ping`, {
            method: 'GET',
            signal: controller.signal,
            mode: 'no-cors',
          });
          if (resPing) success = true;
        } catch {
          success = false;
        }
      }

      clearTimeout(timer);

      if (success) {
        this.wifiState = 'CONNECTED';
        this.connectionType = 'wifi';
        this.ssid = 'BHURAKSHA-GW-04';
        this.espIpAddr = cleanIp;
        this.linkState = 'LIVE';
        this.wifiErr = null;
        this.detectedAps = [
          {
            ssid: 'BHURAKSHA-GW-04',
            rssi: -52,
            secure: true,
            self: true,
            device: `ESP32-WROOM · real hardware gateway (${cleanIp})`,
          },
        ];
        this.push(`GW-LINK: REAL ESP32 WI-FI GATEWAY DETECTED AT ${cleanIp}`, 'SAFE');
        this.push('GW-LINK: HARDWARE BOUND · LoRa TELEMETRY STREAMING ACTIVE', 'SAFE');
      } else {
        throw new Error(
          `Cannot connect: No real ESP32 gateway detected at ${cleanIp}. Please ensure your device's Wi-Fi is connected to the BHURAKSHA ESP32 access point (BHURAKSHA-GW-04), verify power, and try again.`
        );
      }
    } catch (err: any) {
      this.wifiState = 'DISCONNECTED';
      this.linkState = 'OFFLINE';
      this.connectionType = null;
      this.detectedAps = [];
      const msg =
        err?.message ||
        `Cannot connect: No real ESP32 gateway Wi-Fi detected at ${targetIp}. Connect your device to the BHURAKSHA ESP32 Wi-Fi network and try again.`;
      this.wifiErr = msg;
      this.push(`GW-LINK [WI-FI]: ${msg.toUpperCase()}`, 'CRIT');
    } finally {
      this.isWifiConnecting = false;
      this.emit();
    }
  }

  async connectUsbSerial() {
    if (this.isUsbConnecting || this.isWifiConnecting || this.linkState === 'LIVE') return;
    this.isUsbConnecting = true;
    this.wifiErr = null;
    this.push('GW-LINK [OPTION 2]: SCANNING USB SERIAL PORTS (115200 BAUD)…', 'INFO');
    this.emit();

    try {
      if (hasWebSerial()) {
        try {
          await openSerialPort();
          this.wifiState = 'DISCONNECTED';
          this.connectionType = 'usb';
          this.linkState = 'LIVE';
          this.ssid = 'ESP32-USB-PORT';
          this.espIpAddr = 'USB /dev/ttyUSB0';
          this.wifiErr = null;
          this.detectedAps = [
            {
              ssid: 'ESP32-USB-PORT',
              rssi: -40,
              secure: true,
              self: true,
              device: 'ESP32-WROOM (115200 baud USB COM port)',
            },
          ];
          this.push('GW-LINK [OPTION 2]: REAL ESP32 USB SERIAL PORT DETECTED & LINKED', 'SAFE');
          this.push('GW-LINK [OPTION 2]: LoRa TELEMETRY STREAMING ACTIVE OVER USB', 'SAFE');
        } catch (e: any) {
          throw new Error(
            e?.message || 'USB serial selection cancelled or port unavailable. Plug in your ESP32 board and select the COM port.'
          );
        }
      } else {
        throw new Error(
          'Web Serial API requires desktop Chrome, Edge, or Opera. For other browsers, please connect via Option 1 Wi-Fi.'
        );
      }
    } catch (err: any) {
      this.wifiState = 'DISCONNECTED';
      this.linkState = 'OFFLINE';
      this.connectionType = null;
      const msg = err?.message || 'USB serial connection failed.';
      this.wifiErr = msg;
      this.push(`GW-LINK [OPTION 2 USB]: ${msg.toUpperCase()}`, 'CRIT');
    } finally {
      this.isUsbConnecting = false;
      this.emit();
    }
  }

  simulateConnect(type: 'wifi' | 'usb') {
    this.dropWifi();
    this.connectionType = type;
    this.linkState = 'LIVE';
    this.wifiErr = null;
    if (type === 'wifi') {
      this.wifiState = 'CONNECTED';
      this.ssid = 'BHURAKSHA-GW-04';
      this.espIpAddr = '192.168.4.1';
      this.detectedAps = [
        {
          ssid: 'BHURAKSHA-GW-04',
          rssi: -50,
          secure: true,
          self: true,
          device: 'ESP32-WROOM · Wi-Fi Soft-AP Mode',
        },
      ];
      this.push('GW-LINK [OPTION 1]: ESP32 WI-FI GATEWAY LINKED (192.168.4.1)', 'SAFE');
    } else {
      this.wifiState = 'DISCONNECTED';
      this.ssid = 'ESP32-USB-PORT';
      this.espIpAddr = 'USB Serial /dev/ttyUSB0';
      this.detectedAps = [
        {
          ssid: 'ESP32-USB-PORT',
          rssi: -38,
          secure: true,
          self: true,
          device: 'ESP32-WROOM · USB 115200 Baud Direct',
        },
      ];
      this.push('GW-LINK [OPTION 2]: ESP32 USB SERIAL LINKED (115200 BAUD)', 'SAFE');
    }
    this.push('GW-LINK: LoRa TELEMETRY STREAMING ACTIVE', 'SAFE');
    this.emit();
  }

  disconnectWifi() {
    if (this.connectionType === 'wifi') {
      this.dropWifi();
      this.push('GW-LINK [OPTION 1]: ESP32 WI-FI DISCONNECTED', 'INFO');
    }
  }

  disconnectUsb() {
    if (this.connectionType === 'usb') {
      this.dropWifi();
      this.push('GW-LINK [OPTION 2]: ESP32 USB SERIAL PORT DISCONNECTED', 'INFO');
    }
  }

  async joinWifi(ssid: string) {
    if (this.wifiState === 'JOINING' || this.wifiState === 'CONNECTED') return;
    if (!ssid.startsWith('BHURAKSHA-')) {
      this.wifiErr = `"${ssid}" is not a BHURAKSHA gateway. The telemetry endpoint exists only on gateway hardware.`;
      this.push(`GW-LINK: JOIN REJECTED — "${ssid}" IS NOT A GATEWAY AP`, 'WARN');
      this.emit();
      return;
    }
    this.wifiState = 'JOINING';
    this.wifiErr = null;
    this.push(
      `GW-LINK: JOINING "${ssid}" · ASKING THE ESP32 TO VERIFY ITS RADIO…`,
      'INFO'
    );
    this.emit();

    try {
      if (!hasWebSerial() || !ua) {
        throw new Error(
          'Real ESP32 serial link is not open. Scan and select the gateway port first.'
        );
      }
      Cl = '';
      await writeSerial('JOIN,' + ssid);
      const lines = await readSerialUntil(10000, (s) =>
        /^JOIN_(OK|FAIL)/i.test(s)
      );
      let joined = false;
      for (const s of lines) {
        const okMatch = s.match(/^JOIN_OK(?:,(\S+))?/i);
        if (okMatch) {
          this.wifiState = 'CONNECTED';
          this.ssid = ssid;
          this.espIpAddr = okMatch[1] || '192.168.4.1';
          this.push(
            `GW-LINK: JOIN_OK — "${ssid}" · ENDPOINT ${this.espIpAddr}:80`,
            'SAFE'
          );
          this.push(
            'GW-LINK: ESP32 Wi-Fi SUBSYSTEM VERIFIED · PRESS "BIND GATEWAY"',
            'SAFE'
          );
          joined = true;
          break;
        }
        const failMatch = s.match(/^JOIN_FAIL(?:,(.+))?/i);
        if (failMatch) {
          throw new Error(`Gateway refused join: ${failMatch[1] || 'rejected'}`);
        }
      }
      if (!joined) {
        throw new Error(
          'No response from real ESP32 gateway. Device did not answer join command.'
        );
      }
    } catch (err: any) {
      this.wifiState = 'DISCONNECTED';
      const msg = err?.message || 'Serial join failed.';
      this.wifiErr = msg;
      this.push(`GW-LINK: ${msg.toUpperCase()}`, 'CRIT');
    }
    this.emit();
  }

  async dropWifi() {
    if (this.linkState === 'LIVE') {
      this.frozen = this.snapshot();
    }
    this.linkState = 'OFFLINE';
    this.wifiState = 'DISCONNECTED';
    this.connectionType = null;
    this.isWifiConnecting = false;
    this.isUsbConnecting = false;
    this.ssid = null;
    this.wifiErr = null;
    this.detectedAps = [];
    this.espIpAddr = null;
    this.push(
      'GW-LINK: DISCONNECTED · SERIAL PORT CLOSED · CONSOLE DARK UNTIL RE-DETECTED',
      'WARN'
    );
    this.emit();
    try {
      if (is) await writeSerial('LEAVE');
      dr?.releaseLock?.();
      is?.releaseLock?.();
      await ua?.close?.();
    } catch {}
    ua = null;
    dr = null;
    is = null;
    Cl = '';
  }

  get link() {
    return this.linkState;
  }

  get cached() {
    return this.frozen;
  }

  connect() {
    if (this.wifiState !== 'CONNECTED') {
      this.wifiErr = 'Connect to the ESP32 gateway Wi-Fi first.';
      this.push('BIND REJECTED — NO ESP32 Wi-Fi ASSOCIATION', 'WARN');
      this.emit();
      return;
    }
    if (this.linkState === 'OFFLINE') {
      this.linkState = 'HANDSHAKE';
      this.push('BINDING GATEWAY GW-07 · LoRa HANDSHAKE INITIATED', 'INFO');
      this.emit();
      this.hsTimer = setTimeout(() => {
        this.linkState = 'LIVE';
        this.lastSyncAt = Date.now();
        this.push(
          'GATEWAY GW-07 LINK ESTABLISHED · TELEMETRY STREAMING 6 Hz',
          'SAFE'
        );
        this.push('12× SENTRY NODES REPORTING · PACKET LOSS 0.3%', 'SAFE');
        this.emit();
      }, 1900);
    }
  }

  disconnect() {
    if (this.hsTimer) {
      clearTimeout(this.hsTimer);
      this.hsTimer = null;
    }
    if (this.linkState === 'LIVE') {
      this.frozen = this.snapshot();
    }
    this.linkState = 'OFFLINE';
    this.push(
      'GATEWAY LINK CLOSED BY OPERATOR · CONSOLE SHOWING CACHED FRAME',
      'WARN'
    );
    this.emit();
  }

  reset() {
    this.adminForceSmsActive = false;
    this.segIdx = -1;
    this.phase = 'NOMINAL';
    this.phaseT = 0;
    this.risk = 6;
    this.corr = 0.12;
    this.sms = 0;
    this.siren = false;
    this.targetTilt = 0;
    this.bowl = 0;
    this.eventAt = null;
    this.alerts = [];
    this.smsLog = [];
    this.smsSeq = 0;
    this.initVillagers();
    this.boot();
    this.nodes.forEach((n) => {
      n.status = 'OK';
      n.tilt = 0.03 + Math.random() * 0.03;
    });
    this.push('SYSTEM RESET BY OPERATOR · BASELINES RECALIBRATED · NORMAL WATCH', 'INFO');
    this.pushSms(
      'ADVISORY',
      'Network restored to normal watch. No action required from residents.',
      'नेटवर्क सामान्य निगरानी पर वापस। निवासियों से कोई कार्रवाई अपेक्षित नहीं।'
    );
    this.emit();
  }

  markVillagerSafe(id: string) {
    const v = this.villagers.find((item) => item.id === id);
    if (v) {
      v.status = 'safe';
      v.safeZoneReached = true;
      v.reachedAt = bh();
      v.x = MUSTER_SAFE_ZONE.x + (Math.random() - 0.5) * 2;
      v.y = MUSTER_SAFE_ZONE.y + (Math.random() - 0.5) * 2;
      v.distanceToSafe = 0;
      v.etaSec = 0;
      const notif: SafeArrivalNotification = {
        id: `safe-${v.id}-${Date.now()}`,
        villagerId: v.id,
        villagerName: v.name,
        sector: v.sector,
        groupSize: v.groupSize,
        t: bh(),
        zoneName: 'Safe Zone Alpha (Muster N-2)',
      };
      this.recentSafeArrival = notif;
      this.safeNotifications = [notif, ...this.safeNotifications.slice(0, 15)];
      this.push(
        `[OPERATOR VERIFIED] ${v.name} manually confirmed safe at Safe Zone Alpha (${v.groupSize} checked in)`,
        'SAFE'
      );
      this.emit();
    }
  }

  registerVillager(data: { name: string; phone: string; sector: string; house: string; groupSize: number }): Villager {
    const id = `V-${String(this.villagers.length + 1).padStart(2, '0')}`;
    const initialX = 30 + Math.random() * 25;
    const initialY = 35 + Math.random() * 25;
    const d = Math.hypot(initialX - MUSTER_SAFE_ZONE.x, initialY - MUSTER_SAFE_ZONE.y);
    const newVillager: Villager = {
      id,
      name: data.name,
      phone: data.phone,
      sector: data.sector || 'Sector B',
      house: data.house || `House ${id}`,
      x: initialX,
      y: initialY,
      initialX,
      initialY,
      status: this.isEvacuationTriggered ? 'in-danger' : 'safe',
      safeZoneReached: false,
      speed: 0.16 + Math.random() * 0.08,
      battery: 85 + Math.round(Math.random() * 12),
      groupSize: Number(data.groupSize) || 4,
      distanceToSafe: d,
      etaSec: Math.max(10, Math.round(d / 0.1)),
    };
    this.villagers = [newVillager, ...this.villagers];
    this.push(
      `CITIZEN REGISTRATION: ${data.name} (${data.house}, ${data.groupSize} family members) added to safety network`,
      'SAFE'
    );
    this.emit();
    return newVillager;
  }

  pingVillagerSms(id?: string) {
    if (id) {
      const v = this.villagers.find((item) => item.id === id);
      if (v) {
        this.push(
          `[PRIORITY LORA SMS] Radio ping transmitted to ${v.name} (${v.phone})`,
          'WARN'
        );
        this.pushSms(
          'ALERT',
          `EVACUATION PING: ${v.name}, confirm safe status. Proceed toward Gate N-2 Muster Refuge if alert is active.`,
          `निकासी संदेश: ${v.name}, अपनी सुरक्षित स्थिति की पुष्टि करें। यदि चेतावनी सक्रिय है तो गेट N-2 पर पहुँचें।`
        );
        this.emit();
        return;
      }
    }

    // Broadcast SMS Ping to all registered citizens
    this.push(
      '[PRIORITY LORA SMS] Universal radio ping broadcast transmitted to all registered villagers in Ward 12',
      'WARN'
    );
    this.pushSms(
      'ALERT',
      'CITIZEN RADIO PING: District Incident Command check-in ping to all domestic households. Keep emergency channel open.',
      'नागरिक रेडियो पिंग: जिला नियंत्रण कक्ष द्वारा सभी परिवारों को पिंग। आपातकालीन चैनल खुला रखें।'
    );
    this.emit();
  }

  manualSms() {
    this.isEvacuationTriggered = true;
    this.adminForceSmsActive = true;
    this.villagers.forEach((v) => {
      if (!v.safeZoneReached) {
        v.status = 'in-danger';
      }
    });
    this.sms = 4.127;
    this.enter('EVACUATION');
    this.siren = true;
    this.targetTilt = 0.55;
    this.risk = Math.max(this.risk, 97);
    this.push(
      'MANUAL DISPATCH: OPERATOR FORCED SMS BROADCAST — 4,127 RECIPIENTS · VILLAGER ALERT ACTIVE',
      'WARN'
    );
    this.pushSms(
      'CRITICAL',
      'EMERGENCY EVACUATION ORDER: Manual Force SMS broadcast from District Control. Evacuate via Route N-2 to Gate N-2 immediately.',
      'आपातकालीन निकासी आदेश: जिला नियंत्रण कक्ष द्वारा तत्काल फोर्स SMS। तुरंत रूट N-2 से मस्टर बिंदु गेट N-2 पर पहुँचें।'
    );
    this.emit();
  }

  cancelForceSms() {
    this.adminForceSmsActive = false;
    this.phase = 'NOMINAL';
    this.siren = false;
    this.risk = 6;
    this.sms = 0;
    this.targetTilt = 0;
    this.nodes.forEach((n) => (n.status = 'OK'));
    this.initVillagers();
    this.push('OPERATOR CANCELLED FORCE SMS — VILLAGER PORTAL RETURNED TO NORMAL WATCH', 'SAFE');
    this.pushSms(
      'ALLCLEAR',
      'ALL CLEAR: Evacuation broadcast cancelled by District Control. Sector returned to safe status.',
      'स्थिति सुरक्षित: जिला नियंत्रण कक्ष द्वारा निकासी अलर्ट वापस लिया गया। स्थिति सामान्य।'
    );
    this.emit();
  }

  elapsed() {
    return (performance.now() - this.startedAt) / 1000;
  }

  boot() {
    const bootLogs: [string, 'INFO' | 'SAFE' | 'WARN' | 'CRIT'][] = [
      ['SECURE LINK ESTABLISHED · CERT CIL-NOC-7841', 'INFO'],
      ['12× SENTRY HANDSHAKE · LoRa 868.1 MHz · SF9/BW125', 'INFO'],
      ['MESH TOPOLOGY LOCKED · REDUNDANT PATHS 14/14', 'SAFE'],
      ['MODEL bhuraksha-net v3.2 (IF + LSTM) · EDGE-LOADED', 'INFO'],
      ['GIS TILE CACHE SYNCED · OFFLINE-FIRST ARMED', 'INFO'],
      ['WATCH: PANEL C · GAJPAHARI ABOVE GOAF 7', 'INFO'],
    ];
    bootLogs.forEach(([msg, lvl]) => this.push(msg, lvl));
  }

  push(msg: string, lvl: 'INFO' | 'SAFE' | 'WARN' | 'CRIT') {
    this.alerts.unshift({ t: bh(), msg, lvl });
    this.alerts = this.alerts.slice(0, 40);
  }

  pushSms(lvl: string, en: string, hi: string) {
    this.smsLog.unshift({
      seq: ++this.smsSeq,
      t: bh(),
      lvl,
      en,
      hi,
    });
    this.smsLog = this.smsLog.slice(0, 12);
  }

  enter(phase: SubsidencePhase) {
    this.phase = phase;
    this.phaseT = 0;
    const item = tE[phase];
    if (item.log) this.push(item.log, item.lvl);
    if (item.sms) this.pushSms(item.sms[0], item.sms[1], item.sms[2]);
    if (phase === 'SIREN' || phase === 'EVACUATION' || phase === 'COUNTDOWN') {
      this.siren = true;
    }
    if (phase === 'SUBSIDENCE' || phase === 'CLEAR' || phase === 'NOMINAL') {
      this.siren = false;
    }
  }

  tick() {
    this.phaseT += 0.16;
    const el = this.elapsed();
    if (this.segIdx === -1 && this.eventAt !== null && el >= this.eventAt) {
      this.segIdx = 0;
      this.enter('ANOMALY');
    }

    if (this.segIdx >= 0) {
      const currentSegment = so[this.segIdx];
      if (this.phaseT >= currentSegment.dur) {
        this.segIdx++;
        if (this.segIdx >= so.length) {
          this.segIdx = -1;
          this.enter('NOMINAL');
          this.push(
            'AFTERSHOCK WATCH ACTIVE · MESH RECALIBRATING BASELINES',
            'INFO'
          );
          this.eventAt = null; // Do not auto-schedule after scenario completes
          this.targetTilt = 0;
          this.sms = 0;
          this.nodes.forEach((n) => (n.status = 'OK'));
        } else {
          this.enter(so[this.segIdx].phase);
        }
      }
    }

    const curPhase = this.phase;
    const isEvent = [
      'ANOMALY',
      'VERIFIED',
      'SIREN',
      'UPLINK',
      'COUNTDOWN',
      'EVACUATION',
      'SUBSIDENCE',
    ].includes(curPhase);

    this.targetTilt = isEvent ? (curPhase === 'SUBSIDENCE' ? 1.35 : 0.55) : 0;
    this.bowl = oo(
      this.bowl,
      isEvent ? 1 : 0,
      curPhase === 'SUBSIDENCE' ? 0.1 : 0.02
    );

    if (this.linkState === 'LIVE') {
      this.nodes.forEach((n) => {
        const dist = Math.hypot(n.x - Zs.x, n.y - Zs.y);
        const gaussian = Math.exp(-(dist * dist) / 950);
        const y = this.targetTilt * gaussian * n.lag;
        const noise = 0.02 + Math.abs(ro()) * 0.012;
        n.tilt = oo(n.tilt, 0.03 + y + noise, 0.045);
        n.vib = hc(
          oo(n.vib, 5 + y * 260 * (0.6 + Math.random() * 0.8), 0.12),
          2,
          340
        );
        n.stretch = oo(n.stretch, 0.05 + y * 3.1, 0.05);
        n.battery = hc(n.battery - 0.00003, 0, 100);
        n.status = n.tilt > 0.42 ? 'CRIT' : n.tilt > 0.14 ? 'WARN' : 'OK';
      });
    }

    const nodeStress = this.nodes.map(
      (n) =>
        n.tilt * Math.exp(-(Math.hypot(n.x - Zs.x, n.y - Zs.y) ** 2) / 950)
    );
    this.corr = hc(
      0.1 + (nodeStress.reduce((acc, v) => acc + v, 0) / nodeStress.length) * 2.6,
      0.08,
      0.99
    );

    const riskLevels: Record<SubsidencePhase, number> = {
      NOMINAL: 6,
      ANOMALY: 34,
      VERIFIED: 71,
      SIREN: 83,
      UPLINK: 88,
      COUNTDOWN: 93,
      EVACUATION: 97,
      SUBSIDENCE: 100,
      CLEAR: 41,
    };
    this.risk = oo(this.risk, riskLevels[curPhase], 0.035);

    if (curPhase === 'EVACUATION' || curPhase === 'SUBSIDENCE') {
      this.sms = hc(
        this.sms + 4.12 * 0.16 * (curPhase === 'EVACUATION' ? 1 : 0.2),
        0,
        4.127
      );
    }

    const isEvacuationActive =
      this.adminForceSmsActive ||
      [
        'ANOMALY',
        'VERIFIED',
        'SIREN',
        'UPLINK',
        'COUNTDOWN',
        'EVACUATION',
        'SUBSIDENCE',
      ].includes(curPhase);

    if (isEvacuationActive) {
      this.villagers.forEach((v) => {
        if (!v.safeZoneReached) {
          const dx = MUSTER_SAFE_ZONE.x - v.x;
          const dy = MUSTER_SAFE_ZONE.y - v.y;
          const dist = Math.hypot(dx, dy);

          if (dist <= 3.2) {
            // Reached Safe Zone Alpha!
            v.safeZoneReached = true;
            v.status = 'safe';
            v.reachedAt = bh();
            v.x = MUSTER_SAFE_ZONE.x + (Math.random() - 0.5) * 2.2;
            v.y = MUSTER_SAFE_ZONE.y + (Math.random() - 0.5) * 2.2;
            v.distanceToSafe = 0;
            v.etaSec = 0;

            const notif: SafeArrivalNotification = {
              id: `safe-${v.id}-${Date.now()}`,
              villagerId: v.id,
              villagerName: v.name,
              sector: v.sector,
              groupSize: v.groupSize,
              t: bh(),
              zoneName: 'Safe Zone Alpha (Muster N-2)',
            };
            this.recentSafeArrival = notif;
            this.safeNotifications = [notif, ...this.safeNotifications.slice(0, 15)];
            this.push(
              `[SAFE ARRIVAL] ${v.name} has reached Safe Zone Alpha safely (${v.groupSize} citizens verified)`,
              'SAFE'
            );
          } else {
            // Move toward safe zone
            const angle = Math.atan2(dy, dx);
            v.x += Math.cos(angle) * (v.speed * 0.42);
            v.y += Math.sin(angle) * (v.speed * 0.42);
            v.distanceToSafe = Math.hypot(MUSTER_SAFE_ZONE.x - v.x, MUSTER_SAFE_ZONE.y - v.y);
            v.etaSec = Math.max(1, Math.round(v.distanceToSafe / (v.speed * 0.42)));

            // User requirement: When triggered show all people in red not safe, until they reach safe zone or click reached safe zone
            v.status = 'in-danger';
          }
        }
      });
    }

    this.emit();
  }

  tMinus(): number | null {
    if (this.phase === 'EVACUATION' && this.segIdx < 0) {
      return Math.max(0, 300 - Math.floor(this.phaseT));
    }
    if (this.segIdx < 0) return null;
    const idx = this.segIdx;
    const startIdx = 4;
    if (idx < startIdx) return null;
    if (idx === startIdx || idx === startIdx + 1) {
      let rem = so[idx].dur - this.phaseT;
      if (idx === startIdx) {
        rem += so[startIdx + 1].dur;
      }
      return (rem / $T) * 600;
    }
    return 0;
  }

  snapshot(): BhuSnapshot {
    const uptimeSec = Math.floor((Date.now() - this.bootAt) / 1000);
    if (this.linkState === 'LIVE') {
      this.lastSyncAt = Date.now();
    }
    const syncDate = this.lastSyncAt ? new Date(this.lastSyncAt) : null;

    return {
      connected: this.linkState === 'LIVE',
      linkState: this.linkState,
      wifi: this.wifiState,
      connectionType: this.connectionType,
      wifiConnected: this.linkState === 'LIVE' && this.connectionType === 'wifi',
      usbConnected: this.linkState === 'LIVE' && this.connectionType === 'usb',
      isWifiConnecting: this.isWifiConnecting,
      isUsbConnecting: this.isUsbConnecting,
      apsFound: this.detectedAps.length > 0,
      detectedAps: this.detectedAps,
      ssid: this.ssid,
      espIp: this.espIpAddr,
      wifiRssi:
        this.wifiState === 'CONNECTED'
          ? (this.detectedAps.find((a) => a.ssid === this.ssid)?.rssi ?? -55) +
            Math.round(ro() * 2)
          : 0,
      lastSync: syncDate
        ? `${Mi(syncDate.getHours())}:${Mi(syncDate.getMinutes())}:${Mi(syncDate.getSeconds())}`
        : null,
      gwSignal:
        this.linkState === 'LIVE' ? Math.round(72 + Math.abs(ro()) * 16) : 0,
      clock: bh(),
      phase: this.phase,
      phaseIdx: this.segIdx,
      risk: this.risk,
      correlation: this.corr,
      tMinus: this.tMinus(),
      nodes: this.nodes,
      alerts: this.alerts,
      smsLog: this.smsLog,
      smsSent: Math.round(this.sms * 1000),
      gwLatency: Math.round(26 + Math.abs(ro()) * 9 + (this.siren ? 6 : 0)),
      satLatency: Math.round(610 + Math.abs(ro()) * 60),
      packets: Math.round(170 + this.risk * 3.4),
      siren: this.siren,
      epicenter: {
        x: Zs.x,
        y: Zs.y,
        r: 6 + this.bowl * (this.phase === 'SUBSIDENCE' ? 30 : 20),
      },
      meshUptime: `${Mi(Math.floor(uptimeSec / 3600))}:${Mi(
        Math.floor((uptimeSec % 3600) / 60)
      )}:${Mi(uptimeSec % 60)}`,
      adminForceSmsActive: this.adminForceSmsActive,
      wifiError: this.wifiErr,
      villagers: this.villagers,
      safeNotifications: this.safeNotifications,
      recentSafeArrival: this.recentSafeArrival,
      isEvacuationTriggered: this.isEvacuationTriggered,
    };
  }

  emit() {
    const snap = this.snapshot();
    this.listeners.forEach((listener) => listener(snap));
  }
}

export const zt = new BhuStore();

export function startBhuSimulation() {
  zt.start();
}

export function useBhu(): BhuSnapshot {
  const [state, setState] = useState<BhuSnapshot>(() => zt.snapshot());

  useEffect(() => {
    startBhuSimulation();
    return zt.subscribe(setState);
  }, []);

  return state;
}

export interface CheckpointItem {
  key: string;
  label: string;
  desc: string;
  state: 'wait' | 'active' | 'done';
}

export function useCheckpoints(state: BhuSnapshot): CheckpointItem[] {
  const phaseIdx = state.phaseIdx;
  const progressRatio = Math.min(1, state.smsSent / 4127);
  const steps: [string, string, string][] = [
    ['detect', 'Ground flex detected', '3-node correlated tilt 0.4°'],
    ['verdict', 'AI quorum verdict', 'subsidence signature · 94%'],
    ['siren', 'Surface siren + strobe', '118 dB · villagers alerted'],
    ['uplink', 'Satellite uplink ACK', '612 ms · district control'],
    ['countdown', 'Countdown ignition', 'T-minus on ops board'],
    ['broadcast', 'SMS blast · 4,127', 'Hindi + English + app push'],
    [
      'muster',
      'Movement to muster',
      `${Math.round(progressRatio * 4127).toLocaleString('en-IN')}/4,127 reached`,
    ],
    ['impact', 'Impact-0 · all clear', 'field drops · nobody in it'],
  ];

  const mapIndices = [0, 1, 2, 3, 4, 5, 6, 7];

  return steps.map(([key, label, desc], stepIdx) => {
    let s: 'wait' | 'active' | 'done' = 'wait';
    if (phaseIdx === -1) {
      s = stepIdx < 0 ? 'done' : 'wait';
    } else {
      const activeStep = mapIndices[phaseIdx];
      if (stepIdx < activeStep) s = 'done';
      else if (stepIdx === activeStep) s = 'active';
      else if (stepIdx === 6 && phaseIdx === 5) {
        s = progressRatio > 0.35 ? 'active' : 'wait';
      }
    }
    if (phaseIdx === 7 && stepIdx <= 7) s = 'done';
    if (phaseIdx === 6 && stepIdx <= 6) s = 'done';
    if (phaseIdx === 6 && stepIdx === 7) s = 'active';

    return { key, label, desc, state: s };
  });
}
