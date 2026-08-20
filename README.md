# **OT Guardian Pro**

Create a professional, enterprise-grade web application for OT/ICS Network Security Monitoring, Asset Visibility, Threat Detection, and Network Traffic Analysis.

The platform should have the look and usability of a modern industrial cybersecurity SOC/HMI platform. It should be suitable for environments such as:

Offshore wind farms

Power generation

Substations

Manufacturing plants

Oil & gas facilities

Water treatment facilities

Industrial control systems

Renewable energy plants

Critical infrastructure

The application should focus primarily on passive OT network monitoring. It must not require agents on PLCs, RTUs, HMIs, switches, servers, or industrial devices.

The system should conceptually receive network metadata from passive network sensors connected to SPAN/TAP ports.

Product Concept

Build the front-end and application architecture for an OT Network Detection & Response platform.

Temporary product name:

PROCESSLA OT Guardian

Tagline:

See every asset. Understand every connection. Detect every anomaly.

The application should allow cybersecurity engineers and control-system engineers to:

Discover OT assets automatically.

Monitor network communications.

Identify industrial protocols.

Visualize the OT network topology.

Establish normal network communication baselines.

Detect unusual or unauthorized traffic.

Generate cybersecurity alerts.

Identify communication between OT and IT networks.

Detect new or unauthorized devices.

Monitor PLC/RTU/SCADA communication.

Review security events and incidents.

Assess asset vulnerabilities and risks.

Investigate network communications.

Produce cybersecurity reports and dashboards.

1. MAIN DASHBOARD

Create an executive cybersecurity dashboard.

At the top display KPI cards:

Assets

Total Assets: 1,284

Critical Assets: 97

New Assets: 12

Unmanaged Assets: 38

Network

Active Connections: 4,628

OT Protocol Sessions: 2,915

External Connections: 7

Blocked/Unexpected Connections: 14

Cybersecurity

Critical Alerts: 4

High Alerts: 17

Medium Alerts: 42

Low Alerts: 93

Risk

Overall OT Cyber Risk Score: 72/100

Vulnerable Assets: 136

High-Risk Assets: 27

Use professional charts underneath.

Include:

Alerts over the last 24 hours

Network traffic trend

Asset distribution by type

Asset distribution by Purdue Level

Protocol usage

Risk severity distribution

Top risky assets

Top network conversations

Most active protocols

Recently discovered devices

Include a large banner such as:

OT Security Status: Elevated Risk

with explanation:

"4 critical cybersecurity events require investigation."

2. REAL-TIME NETWORK MONITOR

Create a page called:

Network Monitor

Show live network communication in a professional table.

Columns:

Timestamp

Source IP

Source Asset

Source Zone

Destination IP

Destination Asset

Destination Zone

Protocol

Source Port

Destination Port

Packets

Bytes

Connection Status

Risk

Action

Example records:

PLC-WTG-021 → SCADA-SRV-01
Protocol: Modbus TCP
Status: Expected
Risk: Low

ENG-LAPTOP-04 → PLC-WTG-021
Protocol: S7Comm
Status: Unexpected Engineering Access
Risk: High

Historian-01 → Corporate-SQL-03
Protocol: SQL
Status: Cross-Zone Communication
Risk: Medium

Allow filters for:

IP address

Asset

Protocol

Network zone

Risk

Date/time

Source

Destination

Expected / unexpected traffic

Include a search field:

Search IP, hostname, MAC, protocol or asset

3. OT ASSET INVENTORY

Create a complete OT Asset Inventory page.

Each asset should contain:

Asset Name

Asset ID

IP Address

MAC Address

Vendor

Model

Device Type

Firmware

Operating System

Serial Number

Network Zone

Purdue Level

Criticality

Risk Score

First Seen

Last Seen

Protocols Used

Vulnerabilities

Current Status

Device types should include:

PLC

RTU

IED

HMI

SCADA Server

Historian

Engineering Workstation

OPC Server

Network Switch

Firewall

Router

Domain Controller

Server

Workstation

IoT Device

UPS

Wind Turbine Controller

Protection Relay

Example:

Asset:
PLC-WTG-021

Vendor:
Siemens

Model:
S7-1500

IP:
10.20.21.15

Zone:
Wind Turbine OT Network

Purdue Level:
Level 1

Criticality:
Critical

Risk Score:
82/100

When an asset is selected, open an Asset Detail page.

4. ASSET DETAIL VIEW

The asset page should show:

Asset Overview

Asset identity

Manufacturer

Model

Firmware

IP

MAC

Location

Zone

Purdue level

Criticality

Risk score

Network Behaviour

Display:

Assets this device communicates with

Protocols used

Communication frequency

Average bandwidth

First communication observed

Last communication observed

Security

Show:

Vulnerabilities

CVEs

Misconfigurations

Active alerts

Suspicious activity

Unauthorized communications

Behaviour Timeline

Create a timeline such as:

10:24 – Modbus communication with SCADA-SRV-01

10:31 – Configuration read performed

10:42 – New engineering workstation communication detected

10:43 – Alert generated: Unauthorized Engineering Access

5. OT NETWORK TOPOLOGY

Create an interactive page called:

Network Map

Visualize devices as nodes and communications as lines.

Use different icons for:

PLC

HMI

Server

Historian

Engineering Workstation

Firewall

Switch

RTU

IED

Internet/External Network

Organize the topology based on the Purdue Model:

Enterprise Network – Level 4/5

Industrial DMZ – Level 3.5

Site Operations – Level 3

Supervisory Control – Level 2

Basic Control – Level 1

Physical Process – Level 0

Use zones and conduits visually.

Connections should communicate risk through visual state:

Normal communication

New communication

Suspicious communication

Critical communication

Clicking a communication line should open a side panel showing:

Source

Destination

Protocol

Port

First Seen

Last Seen

Packets

Bytes

Expected Behaviour

Risk

6. SECURITY ALERTS

Create a cybersecurity alerts page.

Severity:

CRITICAL

HIGH

MEDIUM

LOW

INFORMATIONAL

Example alerts:

Unauthorized PLC Programming Attempt

Source:
ENG-LAPTOP-04

Destination:
PLC-WTG-021

Protocol:
S7Comm

Severity:
Critical

Description:

"An engineering workstation that has not previously communicated with this PLC initiated programming-related communication."

Recommended Action:

"Verify whether the engineering activity is authorized. Review engineering workstation identity and change-management records."

Other sample detection types:

New Device Detected

New Communication Path

Unauthorized Engineering Workstation

PLC Programming Activity

PLC Configuration Change

Unexpected Modbus Write

Unexpected S7 Write Operation

Unauthorized Firmware Change

IT-to-OT Communication

OT-to-Internet Communication

Port Scanning

Network Reconnaissance

Protocol Anomaly

Abnormal Communication Frequency

Abnormal Traffic Volume

New External IP Connection

Failed Authentication Attempts

Rogue Device

MAC Address Change

Duplicate IP Address

Unauthorized Remote Access

Suspicious SMB Activity

Suspicious RDP Activity

Suspicious SSH Activity

Malware Indicator

Known Malicious IP

DNS Anomaly

Unauthorized Protocol

Firewall Policy Violation

Zone Boundary Violation

7. INDUSTRIAL PROTOCOL MONITORING

Create a section:

OT Protocol Intelligence

Support representation of protocols including:

Modbus TCP

Siemens S7Comm

S7Comm Plus

OPC UA

OPC DA

DNP3

IEC 60870-5-104

IEC 61850

MMS

GOOSE

PROFINET

EtherNet/IP

CIP

BACnet

MQTT

SNMP

NTP

PTP

HTTP/HTTPS

SSH

RDP

SMB

DNS

DHCP

LDAP

Kerberos

Display:

Protocol name

Number of assets

Number of sessions

Traffic volume

Unexpected connections

Security alerts

8. BASELINE / ANOMALY DETECTION

Create a page called:

Behaviour Baseline

The concept is that the platform learns normal communication patterns.

For every relationship track:

Source

Destination

Protocol

Port

Frequency

Traffic Volume

Typical Time

Baseline Confidence

Example:

PLC-WTG-021

normally communicates with:

SCADA-SRV-01

using:

Modbus TCP / TCP 502

every:

2 seconds

If the PLC suddenly communicates with:

ENG-LAPTOP-17

using:

SSH

the system should classify it as:

New / Unexpected Communication

Generate an anomaly score.

Example:

Anomaly Score: 94/100

Reason:

New source

New protocol

Communication outside normal maintenance window

Destination is a critical controller

9. INCIDENT INVESTIGATION

Create a page:

Investigation

Allow security engineers to investigate an alert.

Show a graphical attack/communication timeline.

Example:

09:32
Unknown laptop connected to OT network

09:34
Network scan detected

09:35
PLC discovered

09:36
S7Comm connection established

09:38
PLC configuration request

09:39
PLC write operation attempted

09:39
CRITICAL ALERT GENERATED

Allow users to attach:

Analyst notes

Evidence

Screenshots

PCAP references

Incident owner

Incident status

Status options:

New

Under Investigation

Confirmed Incident

False Positive

Mitigated

Closed

10. NETWORK ZONES

Create a section:

Zones & Conduits

Example network zones:

Corporate IT

Industrial DMZ

SCADA Network

Engineering Network

Historian Network

Wind Turbine Network

Substation Network

Protection Network

Safety System

Vendor Remote Access

For every zone show:

Number of assets

Traffic

Risk

Alerts

Connections to other zones

Unauthorized communication

11. CYBER RISK DASHBOARD

Create an OT Risk page.

Overall score:

OT Cyber Risk: 72 / 100

Break risk into:

Asset Risk

Vulnerability Risk

Network Exposure

Configuration Risk

Threat Activity

Segmentation Risk

Remote Access Risk

Use a matrix:

Likelihood × Impact

Display:

Critical

High

Medium

Low

12. VULNERABILITY MANAGEMENT

Create:

Vulnerabilities

Columns:

CVE

Asset

Vendor

Product

CVSS Score

Exploitability

Asset Criticality

Risk Score

Patch Available

Mitigation Available

Status

Example:

CVE-XXXX-XXXX

Asset:
SCADA-SRV-01

CVSS:
9.8

Asset Criticality:
Critical

Final OT Risk:
Critical

Include a concept of contextual OT risk so that an asset with a serious CVE is prioritized differently depending on whether it is reachable, critical, exposed, and actively communicating.

13. SENSOR MANAGEMENT

Create:

Sensors

Sensors represent passive network monitoring appliances deployed around the OT network.

Example sensors:

ONS-SCADA-SENSOR-01

OSS-SUBSTATION-SENSOR-01

WTG-SENSOR-01

DMZ-SENSOR-01

Display:

Sensor Name

Location

IP Address

Status

Packets Per Second

Bandwidth

Interfaces

Last Heartbeat

Packet Drops

Software Version

Health

Example:

Sensor Status:
Healthy

Traffic:
218 Mbps

Packets:
37,421 packets/sec

Packet Loss:
0.02%

14. SENSOR ARCHITECTURE

Conceptually design the system around:

Network TAP / SPAN port

↓

Passive OT Sensor

↓

Protocol Parsing / Metadata Extraction

↓

Central Analytics Engine

↓

Detection & Behaviour Analytics

↓

Database

↓

API

↓

Web HMI / SOC Dashboard

Do not build offensive cybersecurity functionality.

The sensor should only conceptually perform:

Packet capture

Protocol identification

Flow metadata extraction

Asset fingerprinting

Communication relationship identification

Passive device discovery

Security-event generation

15. THREAT INTELLIGENCE

Create:

Threat Intelligence

Show:

Malicious IP indicators

Malicious domains

File hashes

Known OT malware

Known industrial threat actors

Threat campaigns

Relevant vulnerabilities

Provide sample categories such as:

Ransomware

ICS Malware

Remote Access Trojan

Credential Attack

Supply Chain Threat

Reconnaissance

Do not provide offensive tooling or exploit execution.

16. MITRE ATT&CK FOR ICS

Create:

MITRE ATT&CK for ICS

Map detected events to relevant ATT&CK-for-ICS techniques where appropriate.

Display a matrix-style interface.

Each technique should allow:

Technique name

Description

Detected assets

Associated alerts

Evidence

Risk

17. REPORTING

Create a Reporting page.

Report types:

Daily OT Cybersecurity Report

Weekly Security Report

Monthly Executive Report

Asset Inventory Report

Vulnerability Report

Network Communication Report

Security Incident Report

New Asset Report

Network Change Report

Purdue Architecture Report

Zones & Conduits Report

Risk Assessment Report

Allow export placeholders for:

PDF

CSV

Excel

18. USER ROLES

Support roles:

Administrator

OT Security Engineer

SOC Analyst

Control Engineer

Network Engineer

Viewer

Auditor

Implement role-based access control conceptually.

19. AUDIT LOG

Create:

Audit Log

Record important user actions.

Examples:

User login

Alert acknowledged

Alert closed

Asset modified

Risk accepted

Configuration changed

User created

Sensor configured

20. SETTINGS

Include:

Users

Roles

Sensors

Network Zones

Asset Criticality

Alert Rules

Detection Rules

Notifications

Threat Intelligence

API Integrations

SIEM Integration

Syslog

SMTP

SNMP

Backup

Licensing

System Health

DESIGN STYLE

The application must look like a premium industrial cybersecurity platform.

Use a dark professional SOC theme.

Main colors:

Dark navy/charcoal background

Blue/cyan accents

Green = healthy

Yellow = warning

Orange = high risk

Red = critical

Use modern typography.

Design inspiration should come from professional:

OT cybersecurity platforms

Network Operations Centres

Security Operations Centres

SCADA monitoring platforms

Industrial HMIs

Do NOT directly copy proprietary interfaces or logos from Dragos, Claroty, Nozomi, Siemens, Schneider, Honeywell, or other vendors.

Create an original UI.

Use:

Cards

Graphs

Interactive tables

Side panels

Tooltips

Network diagrams

Risk indicators

Status badges

Heatmaps

Timelines

Search/filter controls

The UI should be information dense but easy to understand.

LEFT NAVIGATION

Create a collapsible sidebar containing:

Overview

Network Monitor

Assets

Network Map

Alerts

Investigations

Behaviour Baseline

OT Protocols

Zones & Conduits

Vulnerabilities

Risk

Threat Intelligence

MITRE ATT&CK

Sensors

Reports

Audit Log

Settings

At the bottom display:

System Health: Healthy

Sensors Online: 12 / 12

Last Update: Live

TOP BAR

Include:

Global Search

Current Site

Alerts

Notifications

Sensor Health

User Profile

Allow changing sites:

Global Overview

Onshore Substation

Offshore Substation

Wind Turbine Network

SCADA Datacentre

Corporate/OT DMZ

DEMO DATA

Populate the application with realistic mock OT data so the platform immediately looks operational.

Create at least:

100 sample assets

500 network relationships

30 cybersecurity alerts

10 vulnerabilities

4 monitoring sensors

Multiple industrial protocols

Several Purdue levels

Several network zones

Include realistic asset names such as:

SCADA-SRV-01

SCADA-SRV-02

HISTORIAN-01

OPC-SRV-01

ENG-WS-01

ENG-WS-02

PLC-WTG-001

PLC-WTG-002

PLC-WTG-003

RTU-OSS-01

IED-BAY-01

IED-BAY-02

FW-DMZ-01

SW-OT-CORE-01

DC-OT-01

NTP-OT-01

TECHNICAL ARCHITECTURE

Build the application so it can later integrate with a real backend.

Recommended architecture:

Frontend:
React + TypeScript

UI:
Tailwind CSS

Charts:
Recharts

Network visualization:
React Flow or suitable graph visualization library

Backend-ready API structure:
REST API

Database-ready design:
PostgreSQL / TimescaleDB

Real-time updates:
WebSocket

Authentication:
Role-based authentication

Future sensor integration should support receiving normalized network telemetry in a format such as:

{
"timestamp": "...",
"sensor_id": "...",
"src_ip": "...",
"dst_ip": "...",
"src_mac": "...",
"dst_mac": "...",
"src_port": 0,
"dst_port": 0,
"protocol": "...",
"industrial_protocol": "...",
"asset_type": "...",
"bytes": 0,
"packets": 0,
"zone_source": "...",
"zone_destination": "...",
"event_type": "...",
"severity": "...",
"anomaly_score": 0
}

Create clean reusable components and separate mock data from UI components so that the mock data can later be replaced with real sensor APIs.

IMPORTANT PRODUCT PRINCIPLES

The platform should follow these principles:

Passive by Design
Never interfere with control-system operation.

OT Context
Understand assets, industrial protocols, zones, conduits, and process criticality.

Behaviour First
Determine what is normal before deciding what is abnormal.

Asset Centric
Every alert should be related to the affected OT asset.

Explainable Detection
Do not simply state "AI detected anomaly."

Explain WHY the activity was considered suspicious.

Example:

"This communication has not been observed during the previous 30-day baseline. The source workstation has never communicated with PLC-WTG-021 and the requested protocol is normally restricted to approved engineering stations."

Safety First
Monitoring must not send active scanning traffic to operational PLCs or protection systems by default.

HOME PAGE HERO

At the top of the main dashboard show:

Complete Visibility Into Your OT Network

Subheading:

"Continuously discover industrial assets, understand network communications, detect abnormal behaviour and identify cyber threats without disrupting operations."

Buttons:

View Network

Investigate Alerts

Below show:

1,284 Assets Monitored

4,628 Active Connections

12 Sensors Online

4 Critical Alerts

99.98% Monitoring Availability

Make the interface feel like a real commercial OT cybersecurity product rather than a generic admin dashboard.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://ot-sight-guardian.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/331ddacf-e51c-4a17-9088-7cfaacee29a5).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
