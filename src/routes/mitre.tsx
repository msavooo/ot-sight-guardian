import { createFileRoute } from "@tanstack/react-router";
import { mitreMatrix } from "@/lib/ot/data";
import { KpiCard, PageHeader, Panel, SeverityBadge } from "@/components/ot/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mitre")({
  head: () => ({
    meta: [
      { title: "MITRE ATT&CK for ICS — PROCESSLA OT Guardian" },
      {
        name: "description",
        content:
          "Detection coverage mapped to MITRE ATT&CK for ICS tactics and techniques across the OT environment.",
      },
      { property: "og:title", content: "MITRE ATT&CK for ICS — PROCESSLA OT Guardian" },
      { property: "og:description", content: "Technique-level detection coverage for industrial control systems." },
    ],
  }),
  component: Mitre;
});

function Mitre() {
  const techniques = mitreMatrix.flatMap((t) => t.techniques);
  const detections = techniques.reduce((s, t) => s + t.detections, 0);
  const covered = techniques.filter((t) => t.detections > 0).length;

  return (
    <div className="space-y-5">
      <PageHeader
        title="MITRE ATT&CK for ICS"
        description="Every detection produced by the platform is mapped to adversary tactics and techniques, giving a coverage view of the industrial kill chain."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Tactics Monitored" value={mitreMatrix.length} tone="accent" />
        <KpiCard label="Techniques Tracked" value={techniques.length} tone="accent" />
        <KpiCard label="Techniques With Activity" value={covered} tone="high" />
        <KpiCard label="Detections (30d)" value={detections} tone="critical" />
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {mitreMatrix.map((col) => (
          <Panel key={col.tactic} title={col.tactic} bodyClassName="space-y-2 p-3">
            {col.techniques.map((t) => (
              <div
                key={t.id}
                className={cn(
                  "rounded border p-2.5",
                  t.detections > 0
                    ? "border-critical/40 bg-critical/10"
                    : "border-border bg-muted/20",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="mono-num text-[11px] text-primary">{t.id}</span>
                  <SeverityBadge severity={t.risk} />
                </div>
                <p className="mt-1 text-xs font-medium text-foreground">{t.name}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {t.detections} detection{t.detections === 1 ? "" : "s"}
                  {t.assets.length ? ` — ${t.assets.join(", ")}` : ""}
                </p>
              </div>
            ))}
          </Panel>
        ))}
      </div>
    </div>
  );
}
