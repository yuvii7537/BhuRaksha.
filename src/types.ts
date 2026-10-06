export type SubsidencePhase =
  | 'NOMINAL'
  | 'ANOMALY'
  | 'VERIFIED'
  | 'SIREN'
  | 'UPLINK'
  | 'COUNTDOWN'
  | 'EVACUATION'
  | 'SUBSIDENCE'
  | 'CLEAR';

export interface SentinelNode {
  id: number;
  label: string;
  x: number;
  y: number;
  tilt: number;
  vib: number;
  stretch: number;
  battery: number;
  rssi: number;
  hops: number;
  status: 'OK' | 'WARN' | 'CRIT';
  lag: number;
}

export interface AlertItem {
  t: string;
  msg: string;
  lvl: 'INFO' | 'WARN' | 'CRIT' | 'SAFE';
}

export interface SmsItem {
  seq: number;
  t: string;
  lvl: string;
  en: string;
  hi: string;
}

export interface DetectedAp {
  ssid: string;
  rssi: number;
  secure: boolean;
  self?: boolean;
  device: string;
}

export interface Epicenter {
  x: number;
  y: number;
  r: number;
}

export interface BhuSnapshot {
  connected: boolean;
  linkState: 'OFFLINE' | 'LIVE' | 'HANDSHAKE';
  wifi: 'DISCONNECTED' | 'SCANNING' | 'JOINING' | 'CONNECTED';
  connectionType: 'wifi' | 'usb' | null;
  wifiConnected: boolean;
  usbConnected: boolean;
  isWifiConnecting: boolean;
  isUsbConnecting: boolean;
  apsFound: boolean;
  detectedAps: DetectedAp[];
  ssid: string | null;
  espIp: string | null;
  wifiRssi: number;
  lastSync: string | null;
  gwSignal: number;
  clock: string;
  phase: SubsidencePhase;
  phaseIdx: number;
  risk: number;
  correlation: number;
  tMinus: number | null;
  nodes: SentinelNode[];
  alerts: AlertItem[];
  smsLog: SmsItem[];
  smsSent: number;
  gwLatency: number;
  satLatency: number;
  packets: number;
  siren: boolean;
  epicenter: Epicenter;
  meshUptime: string;
  adminForceSmsActive: boolean;
  wifiError: string | null;
  villagers: Villager[];
  safeNotifications: SafeArrivalNotification[];
  recentSafeArrival: SafeArrivalNotification | null;
  isEvacuationTriggered: boolean;
}

export type VillagerStatus = 'moving' | 'safe' | 'in-danger';

export interface Villager {
  id: string;
  name: string;
  phone: string;
  sector: string;
  house: string;
  x: number;
  y: number;
  initialX: number;
  initialY: number;
  status: VillagerStatus;
  safeZoneReached: boolean;
  reachedAt?: string;
  speed: number;
  battery: number;
  groupSize: number;
  distanceToSafe: number;
  etaSec: number;
}

export interface SafeArrivalNotification {
  id: string;
  villagerId: string;
  villagerName: string;
  sector: string;
  groupSize: number;
  t: string;
  zoneName: string;
}

export type ViewMode = 'home' | 'demo' | 'villager' | 'admin';
export type SandboxSubMode = 'main' | 'pick' | 'sb-admin' | 'sb-villager';
