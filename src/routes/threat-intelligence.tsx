import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { threatIntel } from "@/lib/ot/data";
import { KpiCard, PageHeader, Panel, Tag } from "@/components/ot/ui";

export const Route = createFileRoute("/threat-intelligence")({
  head: () => ({
    meta: [
      { title: "Threat Intelligence — PROCESSLA OT Guardian" },
      {
        name: "description",
        content:
          "Curated ICS threat intelligence indicators correlated against passive OT network observations.",
      },
      { property: "og:title", content: "Threat Intelligence — PROCESSLA OT Guardian" },
      {
        property: "og:description",
        content: "ICS-focused indicators of compromise matched against your OT traffic.",
      },
    ],
  }),
  component: ThreatIntelligence,
});

function ThreatIntelligence() {
  const [q, setQ] = useState("");
  const rows = threatIntel.filter(
    (t) =>
      t.indicator.toLowerCase().includes(q.toLowerCase()) ||
      t.actor.toLowerCase().includes(q.toLowerCase()) ||
      t.category.toLowerCase().includes(q.toLowerCase()),
  );
  const hits = threatIntel.reduce((s, t) => s + t.hits, 0);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Threat Intelligence"
        description="ICS-specific indicators from vendor, government and community feeds, continuously matched against passively observed OT network metadata."
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search indicator, actor or category"
          className="h-8 w-64 rounded border border-input bg-background/60 px-2 text-xs focus:border-primary/60 focus:outline-none"
        />
      </PageHeader>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Active Indicators" value={threatIntel.length} tone="accent" />
        <KpiCard label="Environment Matches" value={hits} tone="critical" />
        <KpiCard
          label="High Confidence"
          value={threatIntel.filter((t) => t.confidence >= 80).length}
          tone="high"
        />
        <KpiCard label="Feeds Connected" value={6} tone="healthy" />
      </div>

      <Panel title="Indicators of Compromise" bodyClassName="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="label-caps border-b border-border text-left">
            <tr>
              <th className="px-3 py-2">Indicator</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Actor / Family</th>
              <th className="px-3 py-2">Confidence</th>
              <th className="px-3 py-2">Last Seen</th>
              <th className="px-3 py-2">Matches</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t.indicator} className="border-b border-border/60 hover:bg-muted/30">
                <td className="mono-num px-3 py-2 text-foreground">{t.indicator}</td>
                <td className="px-3 py-2">
                  <Tag>{t.type}</Tag>
                </td>
                <td className="px-3 py-2 text-muted-foreground">{t.category}</td>
                <td className="px-3 py-2 text-foreground">{t.actor}</td>
                <td className="mono-num px-3 py-2">{t.confidence}%</td>
                <td className="px-3 py-2 text-muted-foreground">{t.lastSeen}</td>
                <td className="mono-num px-3 py-2">
                  {t.hits ? (
                    <span className="text-critical">{t.hits}</span>
                  ) : (
                    <span className="text-muted-foreground">0</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
