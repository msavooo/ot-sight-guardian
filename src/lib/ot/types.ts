export type Severity = "critical" | "high" | "medium" | "low" | "informational";
export type Criticality = "Critical" | "High" | "Medium" | "Low";
export type PurdueLevel = "Level 0" | "Level 1" | "Level 2" | "Level 3" | "Level 3.5" | "Level 4/5";

export type DeviceType =
  | "PLC"
  | "RTU"
  | "IED"
  | "HMI"
  | "SCADA Server"
  | "Historian"
  | "Engineering Workstation"
  | "OPC Server"
  | "Network Switch"
  | "Firewall"
  | "Router"
  | "Domain Controller"
  | "Server"
  | "Workstation"
  | "IoT Device"
  | "UPS"
  | "Wind Turbine Controller"
  | "Protection Relay";

export interface Vulnerability {
  cve: string;
  assetId: string;
  assetName: string;
  vendor: string;
  product: string;
  cvss: number;
  exploitability: "Weaponised" | "Public PoC" | "Theoretical" | "None";
  criticality: Criticality;
  riskScore: number;
  otRisk: Severity;
  patchAvailable: boolean;
  mitigationAvailable: boolean;
  status: "Open" | "Mitigated" | "Risk Accepted" | "Patched";
  description: string;
  reachable: boolean;
}

export interface Asset {
  id: string;
  name: string;
  ip: string;
  mac: string;
  vendor: string;
  model: string;
  type: DeviceType;
  firmware: string;
  os: string;
  serial: string;
  zone: string;
  purdue: PurdueLevel;
  criticality: Criticality;
  riskScore: number;
  firstSeen: string;
  lastSeen: string;
  protocols: string[];
  vulnerabilities: number;
  status: "Online" | "Offline" | "Degraded";
  managed: boolean;
  isNew: boolean;
  location: string;
  site: string;
}

export interface Conversation {
  id: string;
  timestamp: string;
  srcId: string;
  srcName: string;
  srcIp: string;
  srcZone: string;
  dstId: string;
  dstName: string;
  dstIp: string;
  dstZone: string;
  protocol: string;
  srcPort: number;
  dstPort: number;
  packets: number;
  bytes: number;
  status: "Expected" | "New" | "Unexpected Engineering Access" | "Cross-Zone Communication" | "Blocked";
  risk: Severity;
  anomalyScore: number;
}

export interface Alert {
  id: string;
  title: string;
  type: string;
  severity: Severity;
  srcName: string;
  dstName: string;
  protocol: string;
  zone: string;
  timestamp: string;
  description: string;
  recommendation: string;
  explanation: string;
  status: "New" | "Under Investigation" | "Confirmed Incident" | "False Positive" | "Mitigated" | "Closed";
  assetId: string;
  mitre: string;
  anomalyScore: number;
  owner: string;
}

export interface Baseline {
  id: string;
  srcName: string;
  dstName: string;
  protocol: string;
  port: number;
  frequency: string;
  volume: string;
  typicalTime: string;
  confidence: number;
  state: "Learned" | "Learning" | "Deviation";
  anomalyScore: number;
  reasons: string[];
}

export interface Zone {
  name: string;
  purdue: PurdueLevel;
  assets: number;
  traffic: string;
  risk: Severity;
  alerts: number;
  conduits: string[];
  unauthorized: number;
}

export interface Sensor {
  id: string;
  name: string;
  location: string;
  ip: string;
  status: "Healthy" | "Degraded" | "Offline";
  pps: number;
  bandwidth: string;
  interfaces: string[];
  lastHeartbeat: string;
  packetDrops: string;
  version: string;
  health: number;
}

export interface ProtocolStat {
  name: string;
  category: "Industrial" | "IT" | "Infrastructure";
  assets: number;
  sessions: number;
  volume: string;
  volumeMb: number;
  unexpected: number;
  alerts: number;
  port: number;
}
