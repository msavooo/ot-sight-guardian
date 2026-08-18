import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Filter, Search } from "lucide-react";
import { conversations, fmtTime, protocolStats, ZONE_NAMES } from "@/lib/ot/data";
import type { Severity } from "@/lib/ot/types";
import { KpiCard, LiveDot, PageHeader, Panel, SeverityBadge, Tag, bytesFmt, numFmt } from "@/components/ot/ui";

export const Route = createFileRoute("/network-monitor")({
  head: () => ({
    meta: [
      { title: "Network Monitor — PROCESSLA OT Guardian" },
      {
        name: "description",
        content:
          "Live OT network communication records with source and destination assets, zones, industrial protocols, ports and risk classification.",
      },
      { property: "og:title", content: "Network Monitor — PROCESSLA OT Guardian" },
      { property: "og:description", content: "Live OT network communications from passive SPAN/TAP sensors." },
    ],
  }),
  component: NetworkMonitor,
});

const STATUSES = ["Expected", "New", "Unexpected Engineering Access", "Cross-Zone Communication", "Blocked"] as const;
const RISKS: Severity[] = ["critical", "high", "medium", "low"];

function NetworkMonitor() {
  const [q, setQ] = useState("");
  const [protocol, setProtocol] = useState("all");
  const [zone, setZone] = useState("all");
  const [risk, setRisk] = useState("all");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<string | null>(null);

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return conversations
      .filter((c) => {
        if (protocol !== "all" && c.protocol !== protocol) return false;
        if (zone !== "all" && c.srcZone !== zone && c.dstZone !== zone) return false;
        if (risk !== "all" && c.risk !== risk) return false;
        if (status !== "all" && c.status !== status) return false;
        if (!needle) return true;
        return [c.srcIp, c.dstIp, c.srcName, c.dstName, c.protocol, c.srcZone, c.dstZone]
          .join(" ")
          .toLowerCase()
          .includes(needle);
      })
      .slice(0, 300);
  }, [q, protocol, zone, risk, status]);

  const detail = conversations.find((c) => c.id === selected) ?? null;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Network Monitor"
        description="Flow metadata extracted passively from SPAN/TAP ports. No agents, no active probing of control systems."
      >
        <LiveDot label="STREAMING" />
      </PageHeader>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Active Connections" value={numFmt(4628)} tone="accent" hint="Across 4 sensors" />
        <KpiCard label="OT Protocol Sessions" value={numFmt(2915)} tone="accent" hint="63% of all sessions" />
        <KpiCard label="Unexpected Flows" value={14} tone="critical" hint="Policy or baseline deviation" />
        <KpiCard label="Cross-Zone Flows" value={186} tone="medium" hint="Conduit traversals in 24h" />
      </div>

      <Panel
        title="Filters"
        subtitle="Narrow the flow table by asset, protocol, zone, risk or expectation"
        bodyClassName="space-y-3"
        action={<Filter className="size-4 text-muted-foreground" />}
      >
        <div className="relative">
          <Search className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search IP, hostname, MAC, protocol or asset"
            className="h-9 w-full rounded border border-input bg-background/60 pr-3 pl-8 text-xs focus:border-primary/60 focus:outline-none"
          />
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <Select label="Protocol" value={protocol} onChange={setProtocol} options={protocolStats.map((p) => p.name)} />
          <Select label="Network Zone" value={zone} onChange={setZone} options={[...ZONE_NAMES]} />
          <Select label="Risk" value={risk} onChange={setRisk} options={RISKS} />
          <Select label="Expectation" value={status} onChange={setStatus} options={[...STATUSES]} />
        </div>
        <p className="text-[11px] text-muted-foreground">
          Showing {rows.length} of {numFmt(conversations.length)} retained flow records · window: last 24 hours
        </p>
      </Panel>

      <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
        <Panel title="Live Communications" bodyClassName="p-0">
          <div className="max-h-[620px] overflow-auto">
            <table className="w-full min-w-[1400px] text-xs">
              <thead className="sticky top-0 z-10 bg-surface-raised">
                <tr className="text-left">
                  {[
                    "Timestamp",
                    "Source IP",
                    "Source Asset",
                    "Source Zone",
                    "Destination IP",
                    "Destination Asset",
                    "Dest Zone",
                    "Protocol",
                    "Src Port",
                    "Dst Port",
                    "Packets",
                    "Bytes",
                    "Status",
                    "Risk",
                    "Action",
                  ].map((h) => (
                    <th key={h} className="label-caps border-b border-border px-3 py-2.5 font-normal whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((c) => (
                  <tr key={c.id} className="border-b border-border/40 hover:bg-accent/30">
                    <td className="mono-num px-3 py-2 whitespace-nowrap text-muted-foreground">{fmtTime(c.timestamp)}</td>
                    <td className="mono-num px-3 py-2 whitespace-nowrap">{c.srcIp}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-foreground">{c.srcName}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">{c.srcZone}</td>
                    <td className="mono-num px-3 py-2 whitespace-nowrap">{c.dstIp}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-foreground">{c.dstName}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">{c.dstZone}</td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <Tag tone="accent">{c.protocol}</Tag>
                    </td>
                    <td className="mono-num px-3 py-2 text-muted-foreground">{c.srcPort}</td>
                    <td className="mono-num px-3 py-2">{c.dstPort}</td>
                    <td className="mono-num px-3 py-2 text-right">{numFmt(c.packets)}</td>
                    <td className="mono-num px-3 py-2 text-right">{bytesFmt(c.bytes)}</td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <Tag tone={c.status === "Expected" ? "healthy" : c.status === "Blocked" ? "danger" : "warn"}>
                        {c.status}
                      </Tag>
                    </td>
                    <td className="px-3 py-2">
                      <SeverityBadge severity={c.risk} />
                    </td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => setSelected(c.id)}
                        className="rounded border border-border px-2 py-1 text-[10px] font-semibold tracking-wide uppercase hover:border-primary/60 hover:text-primary"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Flow Inspector" subtitle={detail ? detail.id : "Select a flow to inspect"}>
          {detail ? (
            <div className="space-y-3 text-xs">
              <div className="rounded border border-border/60 bg-background/40 p-3">
                <p className="text-foreground">
                  {detail.srcName} <span className="text-primary">→</span> {detail.dstName}
                </p>
                <p className="mono-num mt-1 text-[11px] text-muted-foreground">
                  {detail.srcIp}:{detail.srcPort} → {detail.dstIp}:{detail.dstPort}
                </p>
              </div>
              {[
                ["Protocol", detail.protocol],
                ["Source Zone", detail.srcZone],
                ["Destination Zone", detail.dstZone],
                ["Packets", numFmt(detail.packets)],
                ["Bytes", bytesFmt(detail.bytes)],
                ["Expectation", detail.status],
                ["Anomaly Score", `${detail.anomalyScore}/100`],
                ["Observed", fmtTime(detail.timestamp)],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between border-b border-border/50 pb-1.5">
                  <span className="text-[11px] tracking-wide text-muted-foreground uppercase">{k}</span>
                  <span className="mono-num text-foreground">{v}</span>
                </div>
              ))}
              <div>
                <p className="label-caps mb-1">Why this classification</p>
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  {detail.status === "Expected"
                    ? `This relationship is part of the learned 30-day baseline for ${detail.dstName} on ${detail.protocol}.`
                    : `The source/protocol pair falls outside the learned communication profile for ${detail.dstName}. Zone traversal ${detail.srcZone} → ${detail.dstZone} is not covered by an approved conduit rule.`}
                </p>
              </div>
              <SeverityBadge severity={detail.risk} />
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              Choose <span className="text-foreground">Inspect</span> on any flow to see protocol context, zone
              traversal, baseline expectation and the reasoning behind its risk classification.
            </p>
          )}
        </Panel>
      </div>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="label-caps">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 h-8 w-full rounded border border-input bg-background/60 px-2 text-xs capitalize focus:border-primary/60 focus:outline-none"
      >
        <option value="all">All</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
