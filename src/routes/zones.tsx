import { createFileRoute } from "@tanstack/react-router";
import { conversations, zones, ZONE_NAMES } from "@/lib/ot/data";
import { KpiCard, PageHeader, Panel, SeverityBadge, Tag, numFmt } from "@/components/ot/ui";

export const Route = createFileRoute("/zones")({
  head: () => ({
    meta: [
      { title: "Zones & Conduits — PROCESSLA OT Guardian" },
      {
        name: "description",
        content:
          "IEC 62443 style zones and conduits: assets, traffic, risk, alerts and unauthorised communication between OT and IT network segments.",
      },
      { property: "og:title", content: "Zones & Conduits — PROCESSLA OT Guardian" },
      { property: "og:description", content: "Segmentation visibility across OT and IT network zones." },
    ],
  }),
  component: Zones,
});

function Zones() {
  const matrix = ZONE_NAMES.map((src) => ({
    src,
    cells: ZONE_NAMES.map((dst) => ({
      dst,
      count: conversations.filter((c) => c.srcZone === src && c.dstZone === dst).length,
      bad: conversations.filter(
        (c) => c.srcZone === src && c.dstZone === dst && (c.status === "Blocked" || c.status === "New"),
      ).length,
    })),
  }));
  const max = Math.max(...matrix.flatMap((r) => r.cells.map((c) => c.count)), 1);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Zones & Conduits"
        description="Segmentation model of the plant. Each conduit is validated against the approved communication policy; traversals outside policy raise zone boundary violations."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Defined Zones" value={zones.length} tone="accent" />
        <KpiCard label="Active Conduits" value={matrix.flatMap((r) => r.cells).filter((c) => c.count > 0).length} tone="accent" />
        <KpiCard label="Boundary Violations" value={14} tone="critical" hint="Last 24 hours" />
        <KpiCard label="IT↔OT Flows" value={186} tone="medium" hint="Through Industrial DMZ" />
      </div>

      <Panel title="Zone Traffic Matrix" subtitle="Source zone (rows) to destination zone (columns) — heat by flow count" bodyClassName="overflow-auto p-3">
        <table className="min-w-[900px] text-[11px]">
          <thead>
            <tr>
              <th className="label-caps px-2 py-1 text-left font-normal">Source \ Destination</th>
              {ZONE_NAMES.map((z) => (
                <th key={z} className="label-caps px-1.5 py-1 text-left font-normal">
                  <span className="block max-w-[70px] leading-tight">{z}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row) => (
              <tr key={row.src}>
                <td className="px-2 py-1 whitespace-nowrap text-foreground">{row.src}</td>
                {row.cells.map((c) => (
                  <td key={c.dst} className="p-0.5">
                    <div
                      title={`${row.src} → ${c.dst}: ${c.count} flows, ${c.bad} unexpected`}
                      className="mono-num flex h-9 items-center justify-center rounded border"
                      style={{
                        background: c.bad
                          ? `color-mix(in oklab, var(--critical) ${Math.min(70, 20 + c.bad * 6)}%, transparent)`
                          : `color-mix(in oklab, var(--primary) ${(c.count / max) * 60}%, transparent)`,
                        borderColor: c.bad ? "var(--critical)" : "var(--border)",
                      }}
                    >
                      {c.count || ""}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {zones.map((z) => (
          <Panel key={z.name} title={z.name} subtitle={`${z.purdue}`} bodyClassName="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="label-caps">Assets</p>
                <p className="mono-num text-lg font-semibold text-foreground">{numFmt(z.assets)}</p>
              </div>
              <div>
                <p className="label-caps">Traffic</p>
                <p className="mono-num text-lg font-semibold text-foreground">{z.traffic}</p>
              </div>
              <div>
                <p className="label-caps">Alerts</p>
                <p className="mono-num text-lg font-semibold text-high">{z.alerts}</p>
              </div>
              <div>
                <p className="label-caps">Unauthorised</p>
                <p className="mono-num text-lg font-semibold text-critical">{z.unauthorized}</p>
              </div>
            </div>
            <div>
              <p className="label-caps mb-1.5">Zone Risk</p>
              <SeverityBadge severity={z.risk} />
            </div>
            <div>
              <p className="label-caps mb-1.5">Conduits To</p>
              <div className="flex flex-wrap gap-1">
                {z.conduits.length ? (
                  z.conduits.map((c) => (
                    <Tag key={c} tone="accent">
                      {c}
                    </Tag>
                  ))
                ) : (
                  <span className="text-[11px] text-muted-foreground">Isolated — no outbound conduits observed</span>
                )}
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
