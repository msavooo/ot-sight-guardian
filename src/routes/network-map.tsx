import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PURDUE_LABEL, PURDUE_ORDER, assets, conversations, fmtDateTime } from "@/lib/ot/data";
import type { Severity } from "@/lib/ot/types";
import { PageHeader, Panel, SeverityBadge, Tag, bytesFmt, numFmt } from "@/components/ot/ui";

export const Route = createFileRoute("/network-map")({
  head: () => ({
    meta: [
      { title: "OT Network Map — PROCESSLA OT Guardian" },
      {
        name: "description",
        content:
          "Interactive Purdue-model topology of OT assets, zones and conduits with risk-coloured communication paths.",
      },
      { property: "og:title", content: "OT Network Map — PROCESSLA OT Guardian" },
      { property: "og:description", content: "Purdue-model topology with zones, conduits and risk-coloured links." },
    ],
  }),
  component: NetworkMap,
});

const LANE_H = 118;
const WIDTH = 1160;

interface Node {
  id: string;
  name: string;
  type: string;
  zone: string;
  purdue: string;
  risk: number;
  x: number;
  y: number;
}

const GLYPH: Record<string, string> = {
  PLC: "▣",
  RTU: "▤",
  IED: "◈",
  "Protection Relay": "◈",
  HMI: "▭",
  "SCADA Server": "▥",
  Historian: "▦",
  "Engineering Workstation": "▧",
  "OPC Server": "▨",
  "Network Switch": "⬡",
  Firewall: "⬢",
  Router: "⬣",
  "Domain Controller": "▩",
  Server: "▥",
  Workstation: "▭",
  "IoT Device": "◌",
  UPS: "▮",
  "Wind Turbine Controller": "✦",
};

function buildGraph() {
  const nodes: Node[] = [];
  PURDUE_ORDER.forEach((level, li) => {
    const inLevel = assets.filter((a) => a.purdue === level).slice(0, 11);
    const gap = WIDTH / (inLevel.length + 1);
    inLevel.forEach((a, i) => {
      nodes.push({
        id: a.id,
        name: a.name,
        type: a.type,
        zone: a.zone,
        purdue: a.purdue,
        risk: a.riskScore,
        x: gap * (i + 1),
        y: li * LANE_H + 62,
      });
    });
  });
  const index = new Map(nodes.map((n) => [n.id, n]));
  const seen = new Set<string>();
  const links = conversations
    .filter((c) => index.has(c.srcId) && index.has(c.dstId) && c.srcId !== c.dstId)
    .filter((c) => {
      const key = `${c.srcId}-${c.dstId}-${c.protocol}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 90);
  return { nodes, index, links };
}

const riskColor = (r: Severity) =>
  r === "critical" ? "var(--critical)" : r === "high" ? "var(--high)" : r === "medium" ? "var(--medium)" : "var(--low)";

function NetworkMap() {
  const { nodes, index, links } = useMemo(buildGraph, []);
  const [selectedLink, setSelectedLink] = useState<string | null>(null);
  const [hoverNode, setHoverNode] = useState<string | null>(null);

  const link = links.find((l) => l.id === selectedLink) ?? null;
  const height = PURDUE_ORDER.length * LANE_H + 40;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Network Map"
        description="Zones and conduits arranged by Purdue level. Link colour communicates whether a conversation is normal, new, suspicious or critical."
      >
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["Normal", "low"],
              ["New", "medium"],
              ["Suspicious", "high"],
              ["Critical", "critical"],
            ] as Array<[string, Severity]>
          ).map(([label, sev]) => (
            <span key={label} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className="h-0.5 w-5 rounded" style={{ background: riskColor(sev) }} />
              {label}
            </span>
          ))}
        </div>
      </PageHeader>

      <div className="grid gap-5 xl:grid-cols-[1fr_330px]">
        <Panel title="Purdue Topology" subtitle="Click a communication line to inspect the conduit" bodyClassName="overflow-x-auto p-2">
          <svg width={WIDTH} height={height} className="grid-bg min-w-[900px] rounded">
            {PURDUE_ORDER.map((level, li) => (
              <g key={level}>
                <rect
                  x={0}
                  y={li * LANE_H + 10}
                  width={WIDTH}
                  height={LANE_H - 12}
                  fill={li % 2 ? "color-mix(in oklab, var(--surface-raised) 45%, transparent)" : "transparent"}
                  stroke="var(--border)"
                  rx={6}
                />
                <text x={12} y={li * LANE_H + 28} fill="var(--muted-foreground)" fontSize={10} letterSpacing={2}>
                  {level.toUpperCase()} — {PURDUE_LABEL[level].toUpperCase()}
                </text>
              </g>
            ))}

            {links.map((l) => {
              const s = index.get(l.srcId)!;
              const d = index.get(l.dstId)!;
              const active = selectedLink === l.id;
              const highlighted = hoverNode === l.srcId || hoverNode === l.dstId;
              return (
                <line
                  key={l.id}
                  x1={s.x}
                  y1={s.y}
                  x2={d.x}
                  y2={d.y}
                  stroke={riskColor(l.risk)}
                  strokeWidth={active ? 2.5 : highlighted ? 2 : 1}
                  strokeOpacity={active || highlighted ? 0.95 : 0.32}
                  className={l.risk === "critical" || l.risk === "high" ? "flow-line cursor-pointer" : "cursor-pointer"}
                  onClick={() => setSelectedLink(l.id)}
                />
              );
            })}

            {nodes.map((n) => {
              const sev: Severity = n.risk >= 85 ? "critical" : n.risk >= 70 ? "high" : n.risk >= 45 ? "medium" : "low";
              return (
                <g
                  key={n.id}
                  transform={`translate(${n.x},${n.y})`}
                  onMouseEnter={() => setHoverNode(n.id)}
                  onMouseLeave={() => setHoverNode(null)}
                  className="cursor-pointer"
                >
                  <circle r={14} fill="var(--surface-raised)" stroke={riskColor(sev)} strokeWidth={1.6} />
                  <text textAnchor="middle" y={4.5} fontSize={13} fill={riskColor(sev)}>
                    {GLYPH[n.type] ?? "●"}
                  </text>
                  <text textAnchor="middle" y={28} fontSize={8.5} fill="var(--muted-foreground)">
                    {n.name}
                  </text>
                </g>
              );
            })}

            <g transform={`translate(${WIDTH - 130},18)`}>
              <rect width={118} height={26} rx={4} fill="var(--critical)" fillOpacity={0.14} stroke="var(--critical)" />
              <text x={10} y={17} fontSize={10} fill="var(--critical)">
                ⌘ External / Internet
              </text>
            </g>
          </svg>
        </Panel>

        <Panel title="Conduit Inspector" subtitle={link ? link.id : "Select a communication line"}>
          {link ? (
            <div className="space-y-2 text-xs">
              <div className="rounded border border-border/60 bg-background/40 p-3">
                <p className="text-foreground">
                  {link.srcName} <span className="text-primary">→</span> {link.dstName}
                </p>
                <p className="mono-num mt-1 text-[11px] text-muted-foreground">
                  {link.srcZone} → {link.dstZone}
                </p>
              </div>
              {[
                ["Source", `${link.srcName} (${link.srcIp})`],
                ["Destination", `${link.dstName} (${link.dstIp})`],
                ["Protocol", link.protocol],
                ["Port", String(link.dstPort)],
                ["First Seen", fmtDateTime(link.timestamp)],
                ["Last Seen", fmtDateTime(link.timestamp)],
                ["Packets", numFmt(link.packets)],
                ["Bytes", bytesFmt(link.bytes)],
                ["Expected Behaviour", link.status],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-2 border-b border-border/50 pb-1.5">
                  <span className="text-[11px] tracking-wide text-muted-foreground uppercase">{k}</span>
                  <span className="mono-num text-right text-foreground">{v}</span>
                </div>
              ))}
              <div className="pt-1">
                <SeverityBadge severity={link.risk} />
              </div>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              Lines represent observed conduits between zones. Animated lines indicate a suspicious or critical
              communication currently deviating from baseline.
            </p>
          )}

          <div className="mt-4 border-t border-border pt-3">
            <p className="label-caps mb-2">Node Legend</p>
            <div className="grid grid-cols-2 gap-1.5 text-[11px] text-muted-foreground">
              {["PLC", "RTU", "IED", "HMI", "SCADA Server", "Historian", "Engineering Workstation", "Firewall", "Network Switch"].map(
                (t) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <span className="text-primary">{GLYPH[t]}</span> {t}
                  </span>
                ),
              )}
            </div>
          </div>

          <div className="mt-4 border-t border-border pt-3">
            <p className="label-caps mb-2">Zones In View</p>
            <div className="flex flex-wrap gap-1">
              {Array.from(new Set(nodes.map((n) => n.zone))).map((z) => (
                <Tag key={z} tone="accent">
                  {z}
                </Tag>
              ))}
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
