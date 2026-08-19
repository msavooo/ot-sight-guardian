import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { protocolStats } from "@/lib/ot/data";
import { KpiCard, PageHeader, Panel, Tag, numFmt } from "@/components/ot/ui";

export const Route = createFileRoute("/protocols")({
  head: () => ({
    meta: [
      { title: "OT Protocol Intelligence — PROCESSLA OT Guardian" },
      {
        name: "description",
        content:
          "Industrial protocol visibility across Modbus TCP, S7Comm, OPC UA, DNP3, IEC 61850, PROFINET, EtherNet/IP and IT protocols.",
      },
      { property: "og:title", content: "OT Protocol Intelligence — PROCESSLA OT Guardian" },
      { property: "og:description", content: "Deep protocol parsing across industrial and IT traffic." },
    ],
  }),
  component: Protocols,
});

function Protocols() {
  const [cat, setCat] = useState("all");
  const rows = protocolStats
    .filter((p) => (cat === "all" ? true : p.category === cat))
    .sort((a, b) => b.sessions - a.sessions);
  const industrial = protocolStats.filter((p) => p.category === "Industrial");

  return (
    <div className="space-y-5">
      <PageHeader
        title="OT Protocol Intelligence"
        description="Deep packet inspection of industrial protocols performed passively at the sensor. Only metadata is retained — no control traffic is injected."
      >
        <select
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          className="h-8 rounded border border-input bg-background/60 px-2 text-xs focus:outline-none"
        >
          <option value="all">All categories</option>
          <option value="Industrial">Industrial</option>
          <option value="IT">IT</option>
          <option value="Infrastructure">Infrastructure</option>
        </select>
      </PageHeader>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Protocols Identified" value={protocolStats.length} tone="accent" />
        <KpiCard label="Industrial Protocols" value={industrial.length} tone="healthy" />
        <KpiCard
          label="Unexpected Sessions"
          value={protocolStats.reduce((s, p) => s + p.unexpected, 0)}
          tone="high"
        />
        <KpiCard label="Protocol Alerts" value={protocolStats.reduce((s, p) => s + p.alerts, 0)} tone="critical" />
      </div>

      <Panel title="Traffic Volume by Protocol" bodyClassName="h-[300px] p-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows.slice(0, 14)}>
            <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={9} tickLine={false} axisLine={false} angle={-25} textAnchor="end" height={60} />
            <YAxis stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} width={40} />
            <Tooltip
              contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 11 }}
            />
            <Bar dataKey="volumeMb" name="Volume (MB)" fill="var(--chart-1)" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Panel>

      <Panel title="Protocol Table" bodyClassName="p-0">
        <div className="overflow-auto">
          <table className="w-full min-w-[900px] text-xs">
            <thead className="bg-surface-raised">
              <tr className="text-left">
                {["Protocol", "Category", "Default Port", "Assets", "Sessions", "Traffic Volume", "Unexpected Connections", "Security Alerts"].map(
                  (h) => (
                    <th key={h} className="label-caps border-b border-border px-3 py-2.5 font-normal whitespace-nowrap">
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.name} className="border-b border-border/40 hover:bg-accent/30">
                  <td className="px-3 py-2 font-medium whitespace-nowrap text-foreground">{p.name}</td>
                  <td className="px-3 py-2">
                    <Tag tone={p.category === "Industrial" ? "accent" : "neutral"}>{p.category}</Tag>
                  </td>
                  <td className="mono-num px-3 py-2">{p.port}</td>
                  <td className="mono-num px-3 py-2">{p.assets}</td>
                  <td className="mono-num px-3 py-2">{numFmt(p.sessions)}</td>
                  <td className="mono-num px-3 py-2">{p.volume}</td>
                  <td className="mono-num px-3 py-2">
                    {p.unexpected ? <span className="text-high">{p.unexpected}</span> : <span className="text-muted-foreground">0</span>}
                  </td>
                  <td className="mono-num px-3 py-2">
                    {p.alerts ? <span className="text-critical">{p.alerts}</span> : <span className="text-muted-foreground">0</span>}
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
