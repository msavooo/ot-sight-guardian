import type {
  Alert,
  Asset,
  Baseline,
  Conversation,
  Criticality,
  DeviceType,
  ProtocolStat,
  PurdueLevel,
  Sensor,
  Severity,
  Vulnerability,
  Zone,
} from "./types";

/* ------------------------------------------------------------------ */
/* Deterministic PRNG so SSR and client render identical mock data.    */
/* Replace this whole module with real sensor API calls later.         */
/* ------------------------------------------------------------------ */
function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
const rng = makeRng(20260817);
const pick = <T>(arr: readonly T[]): T => arr[Math.floor(rng() * arr.length)]!;
const int = (min: number, max: number) => min + Math.floor(rng() * (max - min + 1));

const BASE_DATE = new Date("2026-08-17T16:40:00Z");
const iso = (minutesAgo: number) => new Date(BASE_DATE.getTime() - minutesAgo * 60000).toISOString();
export const fmtTime = (s: string) =>
  new Date(s).toISOString().slice(11, 19) + "Z";
export const fmtDateTime = (s: string) => new Date(s).toISOString().slice(0, 16).replace("T", " ") + "Z";

export const SITES = [
  "Global Overview",
  "Onshore Substation",
  "Offshore Substation",
  "Wind Turbine Network",
  "SCADA Datacentre",
  "Corporate/OT DMZ",
] as const;

export const ZONE_NAMES = [
  "Corporate IT",
  "Industrial DMZ",
  "SCADA Network",
  "Engineering Network",
  "Historian Network",
  "Wind Turbine Network",
  "Substation Network",
  "Protection Network",
  "Safety System",
  "Vendor Remote Access",
] as const;

const ZONE_PURDUE: Record<string, PurdueLevel> = {
  "Corporate IT": "Level 4/5",
  "Industrial DMZ": "Level 3.5",
  "SCADA Network": "Level 2",
  "Engineering Network": "Level 3",
  "Historian Network": "Level 3",
  "Wind Turbine Network": "Level 1",
  "Substation Network": "Level 1",
  "Protection Network": "Level 0",
  "Safety System": "Level 0",
  "Vendor Remote Access": "Level 3.5",
};

export const PURDUE_ORDER: PurdueLevel[] = [
  "Level 4/5",
  "Level 3.5",
  "Level 3",
  "Level 2",
  "Level 1",
  "Level 0",
];

export const PURDUE_LABEL: Record<PurdueLevel, string> = {
  "Level 4/5": "Enterprise Network",
  "Level 3.5": "Industrial DMZ",
  "Level 3": "Site Operations",
  "Level 2": "Supervisory Control",
  "Level 1": "Basic Control",
  "Level 0": "Physical Process",
};

export const INDUSTRIAL_PROTOCOLS = [
  "Modbus TCP",
  "S7Comm",
  "S7Comm Plus",
  "OPC UA",
  "OPC DA",
  "DNP3",
  "IEC 60870-5-104",
  "IEC 61850",
  "MMS",
  "GOOSE",
  "PROFINET",
  "EtherNet/IP",
  "CIP",
  "BACnet",
  "MQTT",
] as const;

export const IT_PROTOCOLS = [
  "HTTPS",
  "SSH",
  "RDP",
  "SMB",
  "DNS",
  "DHCP",
  "LDAP",
  "Kerberos",
  "SQL",
] as const;

export const INFRA_PROTOCOLS = ["SNMP", "NTP", "PTP", "HTTP"] as const;

const PROTO_PORT: Record<string, number> = {
  "Modbus TCP": 502,
  S7Comm: 102,
  "S7Comm Plus": 102,
  "OPC UA": 4840,
  "OPC DA": 135,
  DNP3: 20000,
  "IEC 60870-5-104": 2404,
  "IEC 61850": 102,
  MMS: 102,
  GOOSE: 102,
  PROFINET: 34962,
  "EtherNet/IP": 44818,
  CIP: 2222,
  BACnet: 47808,
  MQTT: 1883,
  HTTPS: 443,
  HTTP: 80,
  SSH: 22,
  RDP: 3389,
  SMB: 445,
  DNS: 53,
  DHCP: 67,
  LDAP: 389,
  Kerberos: 88,
  SQL: 1433,
  SNMP: 161,
  NTP: 123,
  PTP: 319,
};
export const protocolPort = (p: string) => PROTO_PORT[p] ?? 502;

const VENDORS: Record<string, { models: string[]; fw: string[] }> = {
  Siemens: { models: ["S7-1500", "S7-1200", "S7-400H", "SIPROTEC 5"], fw: ["V2.9.2", "V4.5.1", "V3.1.7"] },
  "Schneider Electric": { models: ["M580", "M340", "Easergy P3"], fw: ["V3.20", "V2.80"] },
  "Rockwell Automation": { models: ["ControlLogix 5580", "CompactLogix 5380"], fw: ["v33.011", "v32.014"] },
  ABB: { models: ["AC 800M", "RED670", "REF615"], fw: ["6.1.1", "2.2.3"] },
  Hitachi: { models: ["RTU500", "MicroSCADA X"], fw: ["12.6.4"] },
  Honeywell: { models: ["C300", "ControlEdge PLC"], fw: ["R520.1"] },
  Emerson: { models: ["DeltaV MQ", "Ovation OCR"], fw: ["14.3.1"] },
  Cisco: { models: ["IE-4000", "Catalyst 9300"], fw: ["17.6.4"] },
  Fortinet: { models: ["FortiGate 100F", "FortiGate 60F"], fw: ["7.2.5"] },
  Moxa: { models: ["EDS-508A", "NPort 5150"], fw: ["5.7"] },
  Dell: { models: ["PowerEdge R750", "OptiPlex 7090"], fw: ["2.10.2"] },
  HP: { models: ["ProLiant DL380", "Z4 G5"], fw: ["U32 v2.7"] },
  Vestas: { models: ["VMP Top Controller"], fw: ["8.4.2"] },
  "Siemens Gamesa": { models: ["SG Turbine Controller"], fw: ["5.6.0"] },
  APC: { models: ["Symmetra PX", "Smart-UPS SRT"], fw: ["6.9.6"] },
};
const VENDOR_NAMES = Object.keys(VENDORS);

const OS_BY_TYPE: Partial<Record<DeviceType, string>> = {
  "SCADA Server": "Windows Server 2019",
  Historian: "Windows Server 2016",
  "OPC Server": "Windows Server 2019",
  "Engineering Workstation": "Windows 10 Enterprise LTSC",
  Workstation: "Windows 11 Enterprise",
  "Domain Controller": "Windows Server 2022",
  Server: "Red Hat Enterprise Linux 9",
  HMI: "Windows 10 IoT",
};

function macAddr() {
  const h = () => int(0, 255).toString(16).padStart(2, "0").toUpperCase();
  return [pick(["00:1B:1B", "28:63:36", "00:80:F4", "00:0C:29", "B4:2E:99"]), h(), h(), h()].join(":");
}

interface AssetSeed {
  name: string;
  type: DeviceType;
  zone: string;
  criticality: Criticality;
  vendor?: string;
  protocols: string[];
  subnet: number;
  site: string;
  location: string;
}

const NAMED_SEEDS: AssetSeed[] = [
  { name: "SCADA-SRV-01", type: "SCADA Server", zone: "SCADA Network", criticality: "Critical", vendor: "Dell", protocols: ["Modbus TCP", "OPC UA", "IEC 60870-5-104", "SQL"], subnet: 10, site: "SCADA Datacentre", location: "Datacentre Rack A1" },
  { name: "SCADA-SRV-02", type: "SCADA Server", zone: "SCADA Network", criticality: "Critical", vendor: "Dell", protocols: ["Modbus TCP", "OPC UA", "DNP3"], subnet: 10, site: "SCADA Datacentre", location: "Datacentre Rack A2" },
  { name: "HISTORIAN-01", type: "Historian", zone: "Historian Network", criticality: "High", vendor: "HP", protocols: ["OPC UA", "SQL", "HTTPS"], subnet: 11, site: "SCADA Datacentre", location: "Datacentre Rack B1" },
  { name: "HISTORIAN-02", type: "Historian", zone: "Historian Network", criticality: "Medium", vendor: "HP", protocols: ["OPC UA", "SQL"], subnet: 11, site: "SCADA Datacentre", location: "Datacentre Rack B2" },
  { name: "OPC-SRV-01", type: "OPC Server", zone: "SCADA Network", criticality: "Critical", vendor: "Dell", protocols: ["OPC UA", "OPC DA", "Modbus TCP"], subnet: 10, site: "SCADA Datacentre", location: "Datacentre Rack A3" },
  { name: "ENG-WS-01", type: "Engineering Workstation", zone: "Engineering Network", criticality: "High", vendor: "HP", protocols: ["S7Comm", "RDP", "SMB"], subnet: 30, site: "Onshore Substation", location: "Control Room" },
  { name: "ENG-WS-02", type: "Engineering Workstation", zone: "Engineering Network", criticality: "High", vendor: "HP", protocols: ["S7Comm Plus", "RDP"], subnet: 30, site: "Onshore Substation", location: "Control Room" },
  { name: "ENG-LAPTOP-04", type: "Engineering Workstation", zone: "Engineering Network", criticality: "Medium", vendor: "Dell", protocols: ["S7Comm", "SSH", "SMB"], subnet: 30, site: "Onshore Substation", location: "Mobile / Field" },
  { name: "RTU-OSS-01", type: "RTU", zone: "Substation Network", criticality: "Critical", vendor: "Hitachi", protocols: ["IEC 60870-5-104", "DNP3"], subnet: 40, site: "Offshore Substation", location: "OSS Topside Bay 1" },
  { name: "RTU-OSS-02", type: "RTU", zone: "Substation Network", criticality: "Critical", vendor: "Hitachi", protocols: ["IEC 60870-5-104"], subnet: 40, site: "Offshore Substation", location: "OSS Topside Bay 2" },
  { name: "IED-BAY-01", type: "IED", zone: "Protection Network", criticality: "Critical", vendor: "ABB", protocols: ["IEC 61850", "MMS", "GOOSE"], subnet: 41, site: "Onshore Substation", location: "Feeder Bay 01" },
  { name: "IED-BAY-02", type: "IED", zone: "Protection Network", criticality: "Critical", vendor: "ABB", protocols: ["IEC 61850", "GOOSE"], subnet: 41, site: "Onshore Substation", location: "Feeder Bay 02" },
  { name: "FW-DMZ-01", type: "Firewall", zone: "Industrial DMZ", criticality: "Critical", vendor: "Fortinet", protocols: ["HTTPS", "SNMP"], subnet: 5, site: "Corporate/OT DMZ", location: "DMZ Rack" },
  { name: "SW-OT-CORE-01", type: "Network Switch", zone: "SCADA Network", criticality: "High", vendor: "Cisco", protocols: ["SNMP", "PTP"], subnet: 10, site: "SCADA Datacentre", location: "Datacentre Rack A0" },
  { name: "DC-OT-01", type: "Domain Controller", zone: "Industrial DMZ", criticality: "High", vendor: "Dell", protocols: ["LDAP", "Kerberos", "DNS"], subnet: 5, site: "Corporate/OT DMZ", location: "DMZ Rack" },
  { name: "NTP-OT-01", type: "Server", zone: "Industrial DMZ", criticality: "Medium", vendor: "Dell", protocols: ["NTP", "PTP"], subnet: 5, site: "Corporate/OT DMZ", location: "DMZ Rack" },
  { name: "HMI-CTRL-01", type: "HMI", zone: "SCADA Network", criticality: "High", vendor: "Siemens", protocols: ["S7Comm", "OPC UA"], subnet: 12, site: "Onshore Substation", location: "Control Room" },
  { name: "HMI-CTRL-02", type: "HMI", zone: "SCADA Network", criticality: "High", vendor: "Siemens", protocols: ["S7Comm"], subnet: 12, site: "Onshore Substation", location: "Control Room" },
  { name: "CORPORATE-SQL-03", type: "Server", zone: "Corporate IT", criticality: "Medium", vendor: "Dell", protocols: ["SQL", "SMB", "HTTPS"], subnet: 1, site: "Corporate/OT DMZ", location: "Corporate Datacentre" },
  { name: "VENDOR-JUMP-01", type: "Server", zone: "Vendor Remote Access", criticality: "High", vendor: "Dell", protocols: ["RDP", "SSH", "HTTPS"], subnet: 6, site: "Corporate/OT DMZ", location: "Remote Access Rack" },
  { name: "UPS-DC-01", type: "UPS", zone: "SCADA Network", criticality: "Medium", vendor: "APC", protocols: ["SNMP", "HTTP"], subnet: 10, site: "SCADA Datacentre", location: "Datacentre" },
  { name: "SAFETY-PLC-01", type: "PLC", zone: "Safety System", criticality: "Critical", vendor: "Siemens", protocols: ["PROFINET", "S7Comm"], subnet: 45, site: "Onshore Substation", location: "Safety Cabinet" },
];

function generateAssets(): Asset[] {
  const assets: Asset[] = [];
  const push = (seed: AssetSeed, hostIdx: number) => {
    const vendor = seed.vendor ?? pick(VENDOR_NAMES);
    const v = VENDORS[vendor]!;
    const criticality = seed.criticality;
    const baseRisk =
      criticality === "Critical" ? int(58, 92) : criticality === "High" ? int(42, 80) : int(12, 62);
    const isNew = rng() < 0.09;
    const id = `AST-${String(assets.length + 1).padStart(4, "0")}`;
    assets.push({
      id,
      name: seed.name,
      ip: `10.${seed.subnet}.${int(1, 6)}.${hostIdx}`,
      mac: macAddr(),
      vendor,
      model: pick(v.models),
      type: seed.type,
      firmware: pick(v.fw),
      os: OS_BY_TYPE[seed.type] ?? "Embedded RTOS",
      serial: `SN-${int(100000, 999999)}`,
      zone: seed.zone,
      purdue: ZONE_PURDUE[seed.zone]!,
      criticality,
      riskScore: baseRisk,
      firstSeen: iso(int(4000, 260000)),
      lastSeen: iso(int(0, 40)),
      protocols: seed.protocols,
      vulnerabilities: rng() < 0.42 ? int(1, 5) : 0,
      status: rng() < 0.94 ? "Online" : rng() < 0.6 ? "Degraded" : "Offline",
      managed: rng() > 0.12,
      isNew,
      location: seed.location,
      site: seed.site,
    });
  };

  NAMED_SEEDS.forEach((s, i) => push(s, 10 + i));

  // Wind turbine controllers + PLCs
  for (let i = 1; i <= 34; i++) {
    push(
      {
        name: `PLC-WTG-${String(i).padStart(3, "0")}`,
        type: "PLC",
        zone: "Wind Turbine Network",
        criticality: i <= 12 ? "Critical" : "High",
        vendor: "Siemens",
        protocols: ["Modbus TCP", "PROFINET", i % 5 === 0 ? "S7Comm" : "OPC UA"],
        subnet: 20 + (i % 4),
        site: "Wind Turbine Network",
        location: `Turbine WTG-${String(i).padStart(3, "0")}`,
      },
      20 + i,
    );
  }
  for (let i = 1; i <= 18; i++) {
    push(
      {
        name: `WTC-NAC-${String(i).padStart(3, "0")}`,
        type: "Wind Turbine Controller",
        zone: "Wind Turbine Network",
        criticality: "High",
        vendor: pick(["Vestas", "Siemens Gamesa"]),
        protocols: ["Modbus TCP", "MQTT"],
        subnet: 22,
        site: "Wind Turbine Network",
        location: `Nacelle WTG-${String(i).padStart(3, "0")}`,
      },
      60 + i,
    );
  }
  for (let i = 3; i <= 14; i++) {
    push(
      {
        name: `IED-BAY-${String(i).padStart(2, "0")}`,
        type: i % 3 === 0 ? "Protection Relay" : "IED",
        zone: "Protection Network",
        criticality: "Critical",
        vendor: pick(["ABB", "Siemens", "Schneider Electric"]),
        protocols: ["IEC 61850", "GOOSE", "MMS"],
        subnet: 41,
        site: pick(["Onshore Substation", "Offshore Substation"]),
        location: `Feeder Bay ${String(i).padStart(2, "0")}`,
      },
      40 + i,
    );
  }
  for (let i = 3; i <= 8; i++) {
    push(
      {
        name: `RTU-OSS-${String(i).padStart(2, "0")}`,
        type: "RTU",
        zone: "Substation Network",
        criticality: "High",
        vendor: pick(["Hitachi", "Schneider Electric"]),
        protocols: ["IEC 60870-5-104", "DNP3"],
        subnet: 40,
        site: "Offshore Substation",
        location: `OSS Bay ${i}`,
      },
      50 + i,
    );
  }
  for (let i = 2; i <= 9; i++) {
    push(
      {
        name: `SW-OT-ACC-${String(i).padStart(2, "0")}`,
        type: "Network Switch",
        zone: pick(["SCADA Network", "Substation Network", "Wind Turbine Network"]),
        criticality: "Medium",
        vendor: pick(["Cisco", "Moxa"]),
        protocols: ["SNMP", "PTP"],
        subnet: 10,
        site: pick(["Onshore Substation", "Offshore Substation"]),
        location: `Cabinet ${i}`,
      },
      80 + i,
    );
  }
  for (let i = 3; i <= 8; i++) {
    push(
      {
        name: `HMI-OPS-${String(i).padStart(2, "0")}`,
        type: "HMI",
        zone: "SCADA Network",
        criticality: "High",
        vendor: pick(["Siemens", "Schneider Electric", "Rockwell Automation"]),
        protocols: ["S7Comm", "EtherNet/IP", "OPC UA"],
        subnet: 12,
        site: "Onshore Substation",
        location: "Operations Room",
      },
      90 + i,
    );
  }
  for (let i = 1; i <= 10; i++) {
    push(
      {
        name: `IOT-SENS-${String(i).padStart(3, "0")}`,
        type: "IoT Device",
        zone: pick(["Wind Turbine Network", "Substation Network"]),
        criticality: "Low",
        vendor: "Moxa",
        protocols: ["MQTT", "BACnet", "SNMP"],
        subnet: 24,
        site: "Wind Turbine Network",
        location: `Field Cabinet ${i}`,
      },
      120 + i,
    );
  }
  for (let i = 1; i <= 8; i++) {
    push(
      {
        name: `CORP-WS-${String(i).padStart(3, "0")}`,
        type: "Workstation",
        zone: "Corporate IT",
        criticality: "Low",
        vendor: pick(["Dell", "HP"]),
        protocols: ["HTTPS", "SMB", "DNS"],
        subnet: 1,
        site: "Corporate/OT DMZ",
        location: "Corporate Office",
      },
      140 + i,
    );
  }
  for (let i = 1; i <= 6; i++) {
    push(
      {
        name: `SRV-APP-${String(i).padStart(2, "0")}`,
        type: "Server",
        zone: pick(["Industrial DMZ", "Historian Network"]),
        criticality: "Medium",
        vendor: pick(["Dell", "HP"]),
        protocols: ["HTTPS", "SQL", "SSH"],
        subnet: 5,
        site: "Corporate/OT DMZ",
        location: "DMZ Rack",
      },
      160 + i,
    );
  }
  push(
    {
      name: "ENG-LAPTOP-17",
      type: "Engineering Workstation",
      zone: "Engineering Network",
      criticality: "Medium",
      vendor: "Dell",
      protocols: ["SSH", "S7Comm", "SMB"],
      subnet: 30,
      site: "Onshore Substation",
      location: "Unknown / Mobile",
    },
    77,
  );
  push(
    { name: "RTR-WAN-01", type: "Router", zone: "Corporate IT", criticality: "High", vendor: "Cisco", protocols: ["HTTPS", "SNMP"], subnet: 1, site: "Corporate/OT DMZ", location: "Edge Rack" },
    200,
  );
  return assets;
}

export const assets: Asset[] = generateAssets();
export const assetByName = new Map(assets.map((a) => [a.name, a]));
export const assetById = new Map(assets.map((a) => [a.id, a]));

/* ---------------------------- conversations ----------------------- */

const FIXED_CONVOS: Array<Partial<Conversation> & { src: string; dst: string; protocol: string }> = [
  { src: "PLC-WTG-021", dst: "SCADA-SRV-01", protocol: "Modbus TCP", status: "Expected", risk: "low", anomalyScore: 4 },
  { src: "ENG-LAPTOP-04", dst: "PLC-WTG-021", protocol: "S7Comm", status: "Unexpected Engineering Access", risk: "high", anomalyScore: 88 },
  { src: "HISTORIAN-01", dst: "CORPORATE-SQL-03", protocol: "SQL", status: "Cross-Zone Communication", risk: "medium", anomalyScore: 54 },
  { src: "ENG-LAPTOP-17", dst: "PLC-WTG-021", protocol: "SSH", status: "New", risk: "critical", anomalyScore: 94 },
  { src: "VENDOR-JUMP-01", dst: "RTU-OSS-01", protocol: "IEC 60870-5-104", status: "Cross-Zone Communication", risk: "high", anomalyScore: 76 },
  { src: "IED-BAY-01", dst: "IED-BAY-02", protocol: "GOOSE", status: "Expected", risk: "low", anomalyScore: 2 },
  { src: "SCADA-SRV-01", dst: "RTU-OSS-01", protocol: "IEC 60870-5-104", status: "Expected", risk: "low", anomalyScore: 6 },
  { src: "CORP-WS-003", dst: "HISTORIAN-01", protocol: "SMB", status: "Blocked", risk: "medium", anomalyScore: 61 },
];

function generateConversations(): Conversation[] {
  const out: Conversation[] = [];
  const mk = (
    src: Asset,
    dst: Asset,
    protocol: string,
    status: Conversation["status"],
    risk: Severity,
    anomalyScore: number,
    minutesAgo: number,
  ): Conversation => ({
    id: `CONV-${String(out.length + 1).padStart(5, "0")}`,
    timestamp: iso(minutesAgo),
    srcId: src.id,
    srcName: src.name,
    srcIp: src.ip,
    srcZone: src.zone,
    dstId: dst.id,
    dstName: dst.name,
    dstIp: dst.ip,
    dstZone: dst.zone,
    protocol,
    srcPort: int(32768, 60999),
    dstPort: protocolPort(protocol),
    packets: int(40, 240000),
    bytes: int(4000, 88000000),
    status,
    risk,
    anomalyScore,
  });

  FIXED_CONVOS.forEach((c, i) => {
    const s = assetByName.get(c.src);
    const d = assetByName.get(c.dst);
    if (s && d) out.push(mk(s, d, c.protocol, c.status!, c.risk!, c.anomalyScore!, i));
  });

  const talkers = assets.filter((a) => a.protocols.length);
  for (let i = 0; i < 520; i++) {
    const src = pick(talkers);
    let dst = pick(talkers);
    if (dst.id === src.id) dst = pick(talkers);
    const protocol = pick(src.protocols);
    const crossZone = src.zone !== dst.zone;
    const roll = rng();
    let status: Conversation["status"] = "Expected";
    let risk: Severity = "low";
    let anomaly = int(1, 18);
    if (roll > 0.96) {
      status = "Blocked";
      risk = "high";
      anomaly = int(70, 92);
    } else if (roll > 0.9) {
      status = "New";
      risk = "medium";
      anomaly = int(48, 78);
    } else if (crossZone && roll > 0.7) {
      status = "Cross-Zone Communication";
      risk = "medium";
      anomaly = int(35, 66);
    }
    out.push(mk(src, dst, protocol, status, risk, anomaly, int(0, 1440)));
  }
  return out.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

export const conversations: Conversation[] = generateConversations();

/* ------------------------------- alerts --------------------------- */

const ALERT_TYPES = [
  "New Device Detected",
  "New Communication Path",
  "Unauthorized Engineering Workstation",
  "PLC Programming Activity",
  "PLC Configuration Change",
  "Unexpected Modbus Write",
  "Unexpected S7 Write Operation",
  "Unauthorized Firmware Change",
  "IT-to-OT Communication",
  "OT-to-Internet Communication",
  "Port Scanning",
  "Network Reconnaissance",
  "Protocol Anomaly",
  "Abnormal Communication Frequency",
  "Abnormal Traffic Volume",
  "New External IP Connection",
  "Failed Authentication Attempts",
  "Rogue Device",
  "MAC Address Change",
  "Duplicate IP Address",
  "Unauthorized Remote Access",
  "Suspicious SMB Activity",
  "Suspicious RDP Activity",
  "Suspicious SSH Activity",
  "Malware Indicator",
  "Known Malicious IP",
  "DNS Anomaly",
  "Unauthorized Protocol",
  "Firewall Policy Violation",
  "Zone Boundary Violation",
] as const;

const MITRE_IDS = [
  "T0812 Default Credentials",
  "T0842 Network Sniffing",
  "T0846 Remote System Discovery",
  "T0855 Unauthorized Command Message",
  "T0857 System Firmware",
  "T0859 Valid Accounts",
  "T0866 Exploitation of Remote Services",
  "T0886 Remote Services",
  "T0889 Modify Program",
  "T0836 Modify Parameter",
];

const OWNERS = ["a.mcleod", "j.okafor", "s.hansen", "r.patel", "Unassigned"];

function generateAlerts(): Alert[] {
  const out: Alert[] = [];
  out.push({
    id: "ALT-0001",
    title: "Unauthorized PLC Programming Attempt",
    type: "PLC Programming Activity",
    severity: "critical",
    srcName: "ENG-LAPTOP-04",
    dstName: "PLC-WTG-021",
    protocol: "S7Comm",
    zone: "Wind Turbine Network",
    timestamp: iso(18),
    description:
      "An engineering workstation that has not previously communicated with this PLC initiated programming-related communication.",
    recommendation:
      "Verify whether the engineering activity is authorized. Review engineering workstation identity and change-management records.",
    explanation:
      "This communication has not been observed during the previous 30-day baseline. The source workstation has never communicated with PLC-WTG-021 and the requested protocol is normally restricted to approved engineering stations.",
    status: "Under Investigation",
    assetId: assetByName.get("PLC-WTG-021")?.id ?? "AST-0001",
    mitre: "T0889 Modify Program",
    anomalyScore: 96,
    owner: "a.mcleod",
  });
  out.push({
    id: "ALT-0002",
    title: "New Unmanaged Device On Engineering Network",
    type: "Rogue Device",
    severity: "critical",
    srcName: "ENG-LAPTOP-17",
    dstName: "Engineering Network",
    protocol: "DHCP",
    zone: "Engineering Network",
    timestamp: iso(94),
    description: "A previously unseen MAC address obtained a lease on the engineering VLAN and began host discovery.",
    recommendation: "Physically locate the device, isolate the switch port and confirm ownership with site operations.",
    explanation:
      "The MAC OUI has never been observed by any sensor. Within 120 seconds of joining, the host contacted 34 addresses across two zones — behaviour consistent with discovery, not normal engineering use.",
    status: "New",
    assetId: assetByName.get("ENG-LAPTOP-17")?.id ?? "AST-0001",
    mitre: "T0846 Remote System Discovery",
    anomalyScore: 94,
    owner: "Unassigned",
  });
  out.push({
    id: "ALT-0003",
    title: "OT Asset Initiated Outbound Internet Connection",
    type: "OT-to-Internet Communication",
    severity: "critical",
    srcName: "HISTORIAN-02",
    dstName: "203.0.113.44 (External)",
    protocol: "HTTPS",
    zone: "Historian Network",
    timestamp: iso(212),
    description: "A Level 3 historian established a direct outbound session to an external address not on the allow list.",
    recommendation: "Block egress at FW-DMZ-01, capture full flow records and review historian scheduled tasks.",
    explanation:
      "No OT asset in this zone has ever initiated outbound internet traffic in the 90-day baseline. The destination ASN matches a threat-intel indicator for commodity RAT infrastructure.",
    status: "Confirmed Incident",
    assetId: assetByName.get("HISTORIAN-02")?.id ?? "AST-0001",
    mitre: "T0866 Exploitation of Remote Services",
    anomalyScore: 91,
    owner: "j.okafor",
  });
  out.push({
    id: "ALT-0004",
    title: "Unexpected Write To Protection Relay",
    type: "Unexpected S7 Write Operation",
    severity: "critical",
    srcName: "VENDOR-JUMP-01",
    dstName: "IED-BAY-01",
    protocol: "IEC 61850",
    zone: "Protection Network",
    timestamp: iso(340),
    description: "A vendor remote-access jump host issued a setting-group change to a protection relay outside a maintenance window.",
    recommendation: "Confirm the change against the permit-to-work record. If unauthorised, restore the previous setting group.",
    explanation:
      "Writes to this relay are only observed during scheduled maintenance windows (Tue 02:00–04:00). The source has never written to Level 0 devices before.",
    status: "Under Investigation",
    assetId: assetByName.get("IED-BAY-01")?.id ?? "AST-0001",
    mitre: "T0836 Modify Parameter",
    anomalyScore: 89,
    owner: "s.hansen",
  });

  const severities: Severity[] = ["high", "high", "high", "medium", "medium", "low", "informational"];
  for (let i = 5; i <= 38; i++) {
    const type = pick(ALERT_TYPES);
    const src = pick(assets);
    const dst = pick(assets);
    const sev = pick(severities);
    out.push({
      id: `ALT-${String(i).padStart(4, "0")}`,
      title: type,
      type,
      severity: sev,
      srcName: src.name,
      dstName: dst.name,
      protocol: pick(src.protocols.length ? src.protocols : ["HTTPS"]),
      zone: dst.zone,
      timestamp: iso(int(20, 6000)),
      description: `${type} observed between ${src.name} (${src.zone}) and ${dst.name} (${dst.zone}).`,
      recommendation:
        "Validate the activity against change management. If unrecognised, isolate the source and preserve the associated flow records.",
      explanation: `The behaviour deviates from the learned baseline for ${dst.name}: the source/protocol pair falls outside the observed communication profile for the previous 30 days.`,
      status: pick(["New", "Under Investigation", "Mitigated", "False Positive", "Closed"]),
      assetId: dst.id,
      mitre: pick(MITRE_IDS),
      anomalyScore: sev === "high" ? int(70, 88) : sev === "medium" ? int(40, 69) : int(10, 39),
      owner: pick(OWNERS),
    });
  }
  return out.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

export const alerts: Alert[] = generateAlerts();

export const severityRank: Record<Severity, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
  informational: 4,
};

/* --------------------------- baselines ---------------------------- */

export const baselines: Baseline[] = (() => {
  const out: Baseline[] = [
    {
      id: "BL-0001",
      srcName: "PLC-WTG-021",
      dstName: "SCADA-SRV-01",
      protocol: "Modbus TCP",
      port: 502,
      frequency: "every 2 seconds",
      volume: "1.4 MB/h",
      typicalTime: "Continuous (24/7)",
      confidence: 99,
      state: "Learned",
      anomalyScore: 3,
      reasons: [],
    },
    {
      id: "BL-0002",
      srcName: "ENG-LAPTOP-17",
      dstName: "PLC-WTG-021",
      protocol: "SSH",
      port: 22,
      frequency: "first observation",
      volume: "84 KB",
      typicalTime: "17:12 (outside maintenance window)",
      confidence: 0,
      state: "Deviation",
      anomalyScore: 94,
      reasons: [
        "New source asset — never observed communicating with this destination",
        "New protocol — SSH is not part of this controller's learned profile",
        "Communication outside the approved maintenance window",
        "Destination is a Level 1 critical controller",
      ],
    },
  ];
  for (let i = 3; i <= 46; i++) {
    const src = pick(assets);
    const dst = pick(assets);
    const proto = pick(src.protocols.length ? src.protocols : ["HTTPS"]);
    const deviation = rng() < 0.16;
    out.push({
      id: `BL-${String(i).padStart(4, "0")}`,
      srcName: src.name,
      dstName: dst.name,
      protocol: proto,
      port: protocolPort(proto),
      frequency: pick(["every 1 second", "every 2 seconds", "every 5 seconds", "every 30 seconds", "hourly", "daily"]),
      volume: `${(rng() * 40 + 0.2).toFixed(1)} MB/h`,
      typicalTime: pick(["Continuous (24/7)", "06:00 – 22:00", "Maintenance window only", "Business hours"]),
      confidence: deviation ? int(0, 30) : int(78, 100),
      state: deviation ? "Deviation" : rng() < 0.12 ? "Learning" : "Learned",
      anomalyScore: deviation ? int(62, 93) : int(1, 22),
      reasons: deviation
        ? pick([
            ["New protocol for this relationship", "Volume 6x above learned mean"],
            ["Communication outside typical time window", "New destination port"],
            ["Frequency deviation greater than 4 sigma"],
          ])
        : [],
    });
  }
  return out;
})();

/* ------------------------------ zones ----------------------------- */

export const zones: Zone[] = ZONE_NAMES.map((name) => {
  const zoneAssets = assets.filter((a) => a.zone === name);
  const zoneAlerts = alerts.filter((a) => a.zone === name).length;
  const risk: Severity =
    zoneAlerts > 4 ? "critical" : zoneAlerts > 2 ? "high" : zoneAlerts > 0 ? "medium" : "low";
  return {
    name,
    purdue: ZONE_PURDUE[name]!,
    assets: zoneAssets.length,
    traffic: `${(rng() * 400 + 12).toFixed(0)} Mbps`,
    risk,
    alerts: zoneAlerts,
    conduits: Array.from(
      new Set(
        conversations
          .filter((c) => c.srcZone === name && c.dstZone !== name)
          .slice(0, 40)
          .map((c) => c.dstZone),
      ),
    ).slice(0, 4),
    unauthorized: conversations.filter(
      (c) => (c.srcZone === name || c.dstZone === name) && (c.status === "Blocked" || c.status === "New"),
    ).length,
  };
});

/* ----------------------------- sensors ---------------------------- */

export const sensors: Sensor[] = [
  {
    id: "SNS-01",
    name: "ONS-SCADA-SENSOR-01",
    location: "Onshore Substation — SCADA Core SPAN",
    ip: "10.10.9.20",
    status: "Healthy",
    pps: 37421,
    bandwidth: "218 Mbps",
    interfaces: ["mon0 (SPAN)", "mon1 (TAP)", "mgmt0"],
    lastHeartbeat: "2s ago",
    packetDrops: "0.02%",
    version: "4.8.2",
    health: 99,
  },
  {
    id: "SNS-02",
    name: "OSS-SUBSTATION-SENSOR-01",
    location: "Offshore Substation — Topside Bay TAP",
    ip: "10.40.9.20",
    status: "Healthy",
    pps: 12880,
    bandwidth: "74 Mbps",
    interfaces: ["mon0 (TAP)", "mgmt0"],
    lastHeartbeat: "3s ago",
    packetDrops: "0.00%",
    version: "4.8.2",
    health: 100,
  },
  {
    id: "SNS-03",
    name: "WTG-SENSOR-01",
    location: "Wind Turbine Ring — Collector Switch SPAN",
    ip: "10.20.9.20",
    status: "Degraded",
    pps: 51204,
    bandwidth: "402 Mbps",
    interfaces: ["mon0 (SPAN)", "mon1 (SPAN)", "mgmt0"],
    lastHeartbeat: "6s ago",
    packetDrops: "1.42%",
    version: "4.7.9",
    health: 76,
  },
  {
    id: "SNS-04",
    name: "DMZ-SENSOR-01",
    location: "Industrial DMZ — Firewall Mirror Port",
    ip: "10.5.9.20",
    status: "Healthy",
    pps: 9640,
    bandwidth: "58 Mbps",
    interfaces: ["mon0 (SPAN)", "mgmt0"],
    lastHeartbeat: "1s ago",
    packetDrops: "0.01%",
    version: "4.8.2",
    health: 98,
  },
];

/* ------------------------- protocol stats ------------------------- */

export const protocolStats: ProtocolStat[] = [
  ...INDUSTRIAL_PROTOCOLS.map((n) => ({ n, c: "Industrial" as const })),
  ...IT_PROTOCOLS.map((n) => ({ n, c: "IT" as const })),
  ...INFRA_PROTOCOLS.map((n) => ({ n, c: "Infrastructure" as const })),
].map(({ n, c }) => {
  const sessions = c === "Industrial" ? int(120, 4200) : int(30, 1800);
  const mb = Math.round(sessions * (rng() * 3 + 0.4));
  return {
    name: n,
    category: c,
    assets: int(2, 96),
    sessions,
    volume: mb > 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${mb} MB`,
    volumeMb: mb,
    unexpected: rng() < 0.4 ? int(1, 9) : 0,
    alerts: rng() < 0.35 ? int(1, 5) : 0,
    port: protocolPort(n),
  };
});

/* ------------------------ vulnerabilities ------------------------- */

const VULN_SEED = [
  { cve: "CVE-2024-38434", product: "SIMATIC S7-1500 CPU", cvss: 9.8, desc: "Improper input validation in the PROFINET stack allows remote denial of service and potential code execution." },
  { cve: "CVE-2023-27522", product: "Windows Server 2019 (SCADA host)", cvss: 9.8, desc: "Request smuggling in the web front-end permits unauthenticated command relay." },
  { cve: "CVE-2024-21762", product: "FortiOS SSL-VPN", cvss: 9.6, desc: "Out-of-bounds write allows unauthenticated remote code execution on the perimeter firewall." },
  { cve: "CVE-2023-3595", product: "ControlLogix Communication Module", cvss: 9.8, desc: "Malformed CIP message can corrupt firmware memory and enable persistence." },
  { cve: "CVE-2022-45789", product: "Modicon M580 Controller", cvss: 8.1, desc: "Authentication bypass via replayed Modbus session tokens." },
  { cve: "CVE-2024-2312", product: "RTU500 Series", cvss: 7.5, desc: "IEC 60870-5-104 parser crash on malformed ASDU causing loss of telemetry." },
  { cve: "CVE-2023-6448", product: "NPort Serial Device Server", cvss: 9.8, desc: "Hardcoded credential permits configuration takeover." },
  { cve: "CVE-2024-1234", product: "MicroSCADA X SYS600", cvss: 8.8, desc: "Improper access control in the monitoring API allows privileged operations." },
  { cve: "CVE-2023-4809", product: "RED670 Protection IED", cvss: 7.2, desc: "MMS service accepts setting-group writes without re-authentication." },
  { cve: "CVE-2024-5910", product: "OPC UA Server Runtime", cvss: 9.1, desc: "Missing authentication on the certificate management endpoint." },
  { cve: "CVE-2023-29552", product: "Historian Web Console", cvss: 6.5, desc: "Reflected cross-site scripting in the trend export view." },
  { cve: "CVE-2024-0762", product: "IE-4000 Industrial Switch", cvss: 7.6, desc: "Buffer overflow in the boot loader allows privileged persistence." },
];

export const vulnerabilities: Vulnerability[] = VULN_SEED.map((v, i) => {
  const asset = assets[(i * 7 + 3) % assets.length]!;
  const reachable = rng() > 0.35;
  const critical = asset.criticality === "Critical";
  const risk = Math.min(
    100,
    Math.round(v.cvss * 7 + (critical ? 18 : 6) + (reachable ? 12 : 0) + (asset.status === "Online" ? 5 : 0)),
  );
  const otRisk: Severity = risk >= 88 ? "critical" : risk >= 72 ? "high" : risk >= 50 ? "medium" : "low";
  return {
    cve: v.cve,
    assetId: asset.id,
    assetName: asset.name,
    vendor: asset.vendor,
    product: v.product,
    cvss: v.cvss,
    exploitability: pick(["Weaponised", "Public PoC", "Theoretical", "None"]),
    criticality: asset.criticality,
    riskScore: risk,
    otRisk,
    patchAvailable: rng() > 0.4,
    mitigationAvailable: rng() > 0.2,
    status: pick(["Open", "Open", "Mitigated", "Risk Accepted", "Patched"]),
    description: v.desc,
    reachable,
  };
});

/* ---------------------------- KPI values -------------------------- */

export const kpis = {
  totalAssets: 1284,
  criticalAssets: 97,
  newAssets: 12,
  unmanagedAssets: 38,
  activeConnections: 4628,
  otSessions: 2915,
  externalConnections: 7,
  blockedConnections: 14,
  criticalAlerts: 4,
  highAlerts: 17,
  mediumAlerts: 42,
  lowAlerts: 93,
  riskScore: 72,
  vulnerableAssets: 136,
  highRiskAssets: 27,
  sensorsOnline: 12,
  sensorsTotal: 12,
  availability: "99.98%",
};

/* --------------------------- chart series ------------------------- */

export const alerts24h = Array.from({ length: 24 }, (_, i) => ({
  hour: `${String(i).padStart(2, "0")}:00`,
  critical: i === 17 ? 2 : i % 7 === 0 ? 1 : 0,
  high: int(0, 3),
  medium: int(1, 6),
  low: int(2, 10),
}));

export const trafficTrend = Array.from({ length: 48 }, (_, i) => ({
  t: `${String(Math.floor(i / 2)).padStart(2, "0")}:${i % 2 ? "30" : "00"}`,
  ot: Math.round(180 + Math.sin(i / 4) * 45 + rng() * 30),
  it: Math.round(90 + Math.cos(i / 5) * 30 + rng() * 25),
  external: Math.round(4 + rng() * 6),
}));

export const assetsByType = Object.entries(
  assets.reduce<Record<string, number>>((acc, a) => {
    acc[a.type] = (acc[a.type] ?? 0) + 1;
    return acc;
  }, {}),
)
  .map(([name, value]) => ({ name, value }))
  .sort((a, b) => b.value - a.value);

export const assetsByPurdue = PURDUE_ORDER.map((p) => ({
  name: p,
  label: PURDUE_LABEL[p],
  value: assets.filter((a) => a.purdue === p).length,
}));

export const riskDistribution = [
  { name: "Critical", value: 27, key: "critical" as Severity },
  { name: "High", value: 61, key: "high" as Severity },
  { name: "Medium", value: 148, key: "medium" as Severity },
  { name: "Low", value: 1048, key: "low" as Severity },
];

export const topRiskyAssets = [...assets].sort((a, b) => b.riskScore - a.riskScore).slice(0, 8);

export const topConversations = [...conversations]
  .sort((a, b) => b.bytes - a.bytes)
  .slice(0, 8);

export const recentlyDiscovered = [...assets]
  .sort((a, b) => b.firstSeen.localeCompare(a.firstSeen))
  .slice(0, 8);

export const riskBreakdown = [
  { name: "Asset Risk", score: 74, weight: "18%", detail: "97 critical assets, 38 unmanaged" },
  { name: "Vulnerability Risk", score: 81, weight: "20%", detail: "136 vulnerable assets, 4 weaponised CVEs" },
  { name: "Network Exposure", score: 66, weight: "14%", detail: "7 external connections observed" },
  { name: "Configuration Risk", score: 58, weight: "12%", detail: "Default credentials on 9 devices" },
  { name: "Threat Activity", score: 84, weight: "16%", detail: "4 critical detections in 24h" },
  { name: "Segmentation Risk", score: 69, weight: "12%", detail: "14 zone boundary violations" },
  { name: "Remote Access Risk", score: 77, weight: "8%", detail: "Vendor jump host reaching Level 0" },
];

export const threatIntel = [
  { indicator: "203.0.113.44", type: "IPv4", category: "Remote Access Trojan", actor: "COMMODITY-RAT", confidence: 92, lastSeen: "18m ago", hits: 3 },
  { indicator: "grid-updates[.]net", type: "Domain", category: "Supply Chain Threat", actor: "ELECTRUM-LIKE", confidence: 78, lastSeen: "4h ago", hits: 1 },
  { indicator: "a4f1c2...9de3", type: "SHA-256", category: "ICS Malware", actor: "PIPEDREAM-FAMILY", confidence: 88, lastSeen: "2d ago", hits: 0 },
  { indicator: "198.51.100.7", type: "IPv4", category: "Reconnaissance", actor: "SCANNER-INFRA", confidence: 64, lastSeen: "51m ago", hits: 11 },
  { indicator: "c9be31...11af", type: "SHA-256", category: "Ransomware", actor: "LOCKGRID", confidence: 95, lastSeen: "6d ago", hits: 0 },
  { indicator: "vendor-portal-login[.]co", type: "Domain", category: "Credential Attack", actor: "PHISH-CLUSTER-14", confidence: 71, lastSeen: "1d ago", hits: 2 },
  { indicator: "192.0.2.211", type: "IPv4", category: "ICS Malware", actor: "XENOTIME-LIKE", confidence: 83, lastSeen: "9d ago", hits: 0 },
  { indicator: "5b7e40...c0a2", type: "MD5", category: "Remote Access Trojan", actor: "COMMODITY-RAT", confidence: 69, lastSeen: "3d ago", hits: 1 },
];

export const mitreMatrix: Array<{ tactic: string; techniques: Array<{ id: string; name: string; detections: number; assets: string[]; risk: Severity }> }> = [
  {
    tactic: "Initial Access",
    techniques: [
      { id: "T0817", name: "Drive-by Compromise", detections: 0, assets: [], risk: "low" },
      { id: "T0886", name: "Remote Services", detections: 3, assets: ["VENDOR-JUMP-01", "ENG-WS-01"], risk: "high" },
      { id: "T0865", name: "Spearphishing Attachment", detections: 1, assets: ["CORP-WS-003"], risk: "medium" },
    ],
  },
  {
    tactic: "Execution",
    techniques: [
      { id: "T0807", name: "Command-Line Interface", detections: 2, assets: ["ENG-LAPTOP-17"], risk: "high" },
      { id: "T0871", name: "Execution through API", detections: 0, assets: [], risk: "low" },
      { id: "T0853", name: "Scripting", detections: 1, assets: ["ENG-LAPTOP-04"], risk: "medium" },
    ],
  },
  {
    tactic: "Persistence",
    techniques: [
      { id: "T0857", name: "System Firmware", detections: 1, assets: ["PLC-WTG-021"], risk: "critical" },
      { id: "T0889", name: "Modify Program", detections: 2, assets: ["PLC-WTG-021", "SAFETY-PLC-01"], risk: "critical" },
      { id: "T0859", name: "Valid Accounts", detections: 4, assets: ["VENDOR-JUMP-01"], risk: "high" },
    ],
  },
  {
    tactic: "Discovery",
    techniques: [
      { id: "T0846", name: "Remote System Discovery", detections: 5, assets: ["ENG-LAPTOP-17"], risk: "critical" },
      { id: "T0842", name: "Network Sniffing", detections: 0, assets: [], risk: "low" },
      { id: "T0840", name: "Network Connection Enumeration", detections: 2, assets: ["ENG-LAPTOP-17"], risk: "high" },
    ],
  },
  {
    tactic: "Lateral Movement",
    techniques: [
      { id: "T0812", name: "Default Credentials", detections: 2, assets: ["IOT-SENS-004"], risk: "high" },
      { id: "T0866", name: "Exploitation of Remote Services", detections: 1, assets: ["HISTORIAN-02"], risk: "critical" },
      { id: "T0867", name: "Lateral Tool Transfer", detections: 0, assets: [], risk: "low" },
    ],
  },
  {
    tactic: "Impair Process Control",
    techniques: [
      { id: "T0836", name: "Modify Parameter", detections: 2, assets: ["IED-BAY-01"], risk: "critical" },
      { id: "T0855", name: "Unauthorized Command Message", detections: 1, assets: ["RTU-OSS-01"], risk: "high" },
      { id: "T0806", name: "Brute Force I/O", detections: 0, assets: [], risk: "low" },
    ],
  },
  {
    tactic: "Inhibit Response Function",
    techniques: [
      { id: "T0800", name: "Activate Firmware Update Mode", detections: 0, assets: [], risk: "low" },
      { id: "T0878", name: "Alarm Suppression", detections: 0, assets: [], risk: "low" },
      { id: "T0803", name: "Block Command Message", detections: 1, assets: ["RTU-OSS-02"], risk: "medium" },
    ],
  },
];

export const auditLog = [
  { time: iso(4), user: "a.mcleod", role: "OT Security Engineer", action: "Alert acknowledged", target: "ALT-0001", ip: "10.30.1.44" },
  { time: iso(19), user: "j.okafor", role: "SOC Analyst", action: "Incident status changed to Confirmed Incident", target: "ALT-0003", ip: "10.1.4.19" },
  { time: iso(46), user: "s.hansen", role: "Administrator", action: "Detection rule updated", target: "RULE-OT-114", ip: "10.5.2.8" },
  { time: iso(88), user: "r.patel", role: "Control Engineer", action: "Asset criticality modified", target: "PLC-WTG-021", ip: "10.30.1.51" },
  { time: iso(140), user: "a.mcleod", role: "OT Security Engineer", action: "Risk accepted", target: "CVE-2023-29552", ip: "10.30.1.44" },
  { time: iso(220), user: "system", role: "Platform", action: "Sensor configuration applied", target: "WTG-SENSOR-01", ip: "10.20.9.20" },
  { time: iso(300), user: "s.hansen", role: "Administrator", action: "User created", target: "m.dupont (Auditor)", ip: "10.5.2.8" },
  { time: iso(420), user: "j.okafor", role: "SOC Analyst", action: "User login", target: "SSO / SAML", ip: "10.1.4.19" },
  { time: iso(600), user: "m.dupont", role: "Auditor", action: "Report exported (PDF)", target: "Monthly Executive Report", ip: "10.1.9.30" },
  { time: iso(900), user: "s.hansen", role: "Administrator", action: "Network zone created", target: "Vendor Remote Access", ip: "10.5.2.8" },
];

export const investigationTimeline = [
  { time: "09:32", label: "Unknown laptop connected to OT network", detail: "New MAC 5C:26:0A:14:9F:02 obtained DHCP lease 10.30.4.77 on the engineering VLAN.", severity: "medium" as Severity },
  { time: "09:34", label: "Network scan detected", detail: "34 unique destinations contacted in 118 seconds across two zones.", severity: "high" as Severity },
  { time: "09:35", label: "PLC discovered", detail: "TCP/102 probe answered by PLC-WTG-021 (Siemens S7-1500).", severity: "high" as Severity },
  { time: "09:36", label: "S7Comm connection established", detail: "Session negotiated with rack 0 / slot 1 CPU.", severity: "high" as Severity },
  { time: "09:38", label: "PLC configuration request", detail: "Read of SZL system status list and block list observed.", severity: "high" as Severity },
  { time: "09:39", label: "PLC write operation attempted", detail: "Download-block request issued to OB1 — no confirmation observed.", severity: "critical" as Severity },
  { time: "09:39", label: "CRITICAL ALERT GENERATED", detail: "ALT-0001 Unauthorized PLC Programming Attempt raised and routed to the OT SOC.", severity: "critical" as Severity },
];

export const reportTypes = [
  { name: "Daily OT Cybersecurity Report", cadence: "Daily 06:00", owner: "OT SOC", pages: 8 },
  { name: "Weekly Security Report", cadence: "Monday 07:00", owner: "OT SOC", pages: 18 },
  { name: "Monthly Executive Report", cadence: "1st of month", owner: "CISO Office", pages: 12 },
  { name: "Asset Inventory Report", cadence: "On demand", owner: "Control Engineering", pages: 46 },
  { name: "Vulnerability Report", cadence: "Weekly", owner: "OT Security", pages: 22 },
  { name: "Network Communication Report", cadence: "Weekly", owner: "Network Engineering", pages: 31 },
  { name: "Security Incident Report", cadence: "Per incident", owner: "OT SOC", pages: 9 },
  { name: "New Asset Report", cadence: "Daily", owner: "Control Engineering", pages: 4 },
  { name: "Network Change Report", cadence: "Weekly", owner: "Network Engineering", pages: 11 },
  { name: "Purdue Architecture Report", cadence: "Quarterly", owner: "OT Architecture", pages: 27 },
  { name: "Zones & Conduits Report", cadence: "Quarterly", owner: "OT Architecture", pages: 19 },
  { name: "Risk Assessment Report", cadence: "Quarterly", owner: "CISO Office", pages: 34 },
];

export const roles = [
  { name: "Administrator", users: 3, description: "Full platform configuration, user and sensor management.", perms: ["Read all", "Write all", "Manage users", "Manage sensors", "Manage rules"] },
  { name: "OT Security Engineer", users: 6, description: "Detection tuning, risk acceptance, investigation ownership.", perms: ["Read all", "Manage alerts", "Manage rules", "Accept risk"] },
  { name: "SOC Analyst", users: 11, description: "Triage and investigate alerts, escalate incidents.", perms: ["Read all", "Manage alerts", "Create investigations"] },
  { name: "Control Engineer", users: 14, description: "Asset context, criticality and process validation.", perms: ["Read assets", "Edit asset criticality", "Comment"] },
  { name: "Network Engineer", users: 5, description: "Topology, zones and conduit configuration.", perms: ["Read all", "Manage zones", "Manage sensors"] },
  { name: "Viewer", users: 22, description: "Read-only dashboards and reports.", perms: ["Read dashboards"] },
  { name: "Auditor", users: 4, description: "Read-only access including full audit trail export.", perms: ["Read all", "Export audit log"] },
];
