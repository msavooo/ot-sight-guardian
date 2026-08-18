import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Server } from "lucide-react";
import { assets, fmtDateTime, PURDUE_ORDER, ZONE_NAMES } from "@/lib/ot/data";
import type { Criticality } from "@/lib/ot/types";
import { KpiCard, MiniBar, PageHeader, Panel, Tag, numFmt } from "@/components/ot/ui";

export const Route = createFileRoute("/assets/")({
  head: () => ({
    meta: [
      { title: "OT Asset Inventory — PROCESSLA OT Guardian" },
      {
        name: "description",
        content:
          "Passively discovered OT asset inventory with vendor, model, firmware, zone, Purdue level, criticality, risk score and vulnerabilities.",
      },
      { property: "og:title", content: "OT Asset Inventory — PROCESSLA OT Guardian" },
      { property: "og:description", content: "Every industrial asset, discovered without agents or active scanning." },
    ],
  }),
  component: AssetInventory,
});

const DEVICE_TYPES = Array.from(new Set(assets.map((a) => a.type))).sort();
const CRITICALITIES: Criticality[] = ["Critical", "High", "Medium", "Low"];

function AssetInventory() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [zone, setZone] = useState("all");
  const [purdue, setPurdue] = useState("all");
  const [crit, setCrit] = useState("all");

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return assets.filter((a) => {
      if (type !== "all" && a.type !== type) return false;
      if (zone !== "all" && a.zone !== zone) return false;
      if (purdue !== "all" && a.purdue !== purdue) return false;
      if (crit !== "all" && a.criticality !== crit) return false;
      if (!needle) return true;
      return [a.name, a.ip, a.mac, a.vendor, a.model, a.type, a.zone, a.protocols.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [q, type, zone, purdue, crit]);

  return (
    <div className="space-y-5">
      <PageHeader
        title="OT Asset Inventory"
        description="Every asset is fingerprinted passively from observed traffic — vendor, model, firmware and protocol behaviour, with no agents installed on PLCs, RTUs, HMIs or servers."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Assets In Inventory" value={numFmt(1284)} tone="accent" hint={`${assets.length} in current site scope`} />
        <KpiCard label="Critical Assets" value={97} tone="critical" hint="Process-critical controllers and relays" />
        <KpiCard label="Unmanaged" value={38} tone="high" hint="No owner or change record" />
        <KpiCard label="New (24h)" value={12} tone="medium" hint="Newly fingerprinted devices" />
      </div>

      <Panel title="Inventory Filters" bodyClassName="space-y-3">
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
          <Sel label="Device Type" value={type} onChange={setType} options={DEVICE_TYPES} />
          <Sel label="Network Zone" value={zone} onChange={setZone} options={[...ZONE_NAMES]} />
          <Sel label="Purdue Level" value={purdue} onChange={setPurdue} options={[...PURDUE_ORDER]} />
          <Sel label="Criticality" value={crit} onChange={setCrit} options={CRITICALITIES} />
        </div>
      </Panel>

      <Panel title={`Assets (${rows.length})`} bodyClassName="p-0">
        <div className="max-h-[680px] overflow-auto">
          <table className="w-full min-w-[1500px] text-xs">
            <thead className="sticky top-0 z-10 bg-surface-raised">
              <tr className="text-left">
                {[
                  "Asset",
                  "Asset ID",
                  "IP Address",
                  "MAC",
                  "Vendor",
                  "Model",
                  "Type",
                  "Firmware",
                  "OS",
                  "Zone",
                  "Purdue",
                  "Criticality",
                  "Risk",
                  "Protocols",
                  "Vulns",
                  "First Seen",
                  "Last Seen",
                  "Status",
                ].map((h) => (
                  <th key={h} className="label-caps border-b border-border px-3 py-2.5 font-normal whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a.id} className="border-b border-border/40 hover:bg-accent/30">
                  <td className="px-3 py-2 whitespace-nowrap">
                    <Link
                      to="/assets/$assetId"
                      params={{ assetId: a.id }}
                      className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
                    >
                      <Server className="size-3.5" />
                      {a.name}
                    </Link>
                  </td>
                  <td className="mono-num px-3 py-2 text-muted-foreground">{a.id}</td>
                  <td className="mono-num px-3 py-2">{a.ip}</td>
                  <td className="mono-num px-3 py-2 text-muted-foreground">{a.mac}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{a.vendor}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">{a.model}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <Tag>{a.type}</Tag>
                  </td>
                  <td className="mono-num px-3 py-2 text-muted-foreground">{a.firmware}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">{a.os}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{a.zone}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">{a.purdue}</td>
                  <td className="px-3 py-2">
                    <Tag
                      tone={
                        a.criticality === "Critical"
                          ? "danger"
                          : a.criticality === "High"
                            ? "warn"
                            : "neutral"
                      }
                    >
                      {a.criticality}
                    </Tag>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="mono-num w-6 text-foreground">{a.riskScore}</span>
                      <div className="w-14">
                        <MiniBar
                          value={a.riskScore}
                          tone={a.riskScore >= 85 ? "critical" : a.riskScore >= 70 ? "high" : a.riskScore >= 45 ? "medium" : "low"}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-1">
                      {a.protocols.slice(0, 3).map((p) => (
                        <Tag key={p} tone="accent">
                          {p}
                        </Tag>
                      ))}
                    </div>
                  </td>
                  <td className="mono-num px-3 py-2 text-center">
                    {a.vulnerabilities > 0 ? (
                      <span className="text-high">{a.vulnerabilities}</span>
                    ) : (
                      <span className="text-muted-foreground">0</span>
                    )}
                  </td>
                  <td className="mono-num px-3 py-2 whitespace-nowrap text-muted-foreground">{fmtDateTime(a.firstSeen)}</td>
                  <td className="mono-num px-3 py-2 whitespace-nowrap text-muted-foreground">{fmtDateTime(a.lastSeen)}</td>
                  <td className="px-3 py-2">
                    <Tag tone={a.status === "Online" ? "healthy" : a.status === "Degraded" ? "warn" : "danger"}>
                      {a.status}
                    </Tag>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

function Sel({
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
        className="mt-1 h-8 w-full rounded border border-input bg-background/60 px-2 text-xs focus:border-primary/60 focus:outline-none"
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
