import { createFileRoute } from "@tanstack/react-router";
import { FileBarChart, Download } from "lucide-react";
import { reportTypes } from "@/lib/ot/data";
import { KpiCard, PageHeader, Panel, Tag } from "@/components/ot/ui";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — PROCESSLA OT Guardian" },
      {
        name: "description",
        content:
          "Scheduled and on-demand OT security reporting for executives, engineering and compliance audiences.",
      },
      { property: "og:title", content: "Reports — PROCESSLA OT Guardian" },
      { property: "og:description", content: "Executive, operational and compliance OT security reporting." },
    ],
  }),
  component: Reports,
});

function Reports() {
  const scheduled = reportTypes.filter((r) => r.cadence !== "On demand").length;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Reports"
        description="Generate operational and executive reporting from observed OT network evidence. Reports are rendered from immutable metadata records."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Report Templates" value={reportTypes.length} tone="accent" />
        <KpiCard label="Scheduled" value={scheduled} tone="healthy" />
        <KpiCard label="Generated (30d)" value={124} tone="accent" />
        <KpiCard label="Retention" value="24 mo" tone="accent" />
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {reportTypes.map((r) => (
          <Panel key={r.name} bodyClassName="space-y-3 p-4">
            <div className="flex items-start gap-2.5">
              <span className="flex size-8 shrink-0 items-center justify-center rounded bg-primary/15 ring-1 ring-primary/40">
                <FileBarChart className="size-4 text-primary" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{r.name}</p>
                <p className="text-[11px] text-muted-foreground">Owner: {r.owner}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <Tag tone={r.cadence === "On demand" ? "neutral" : "accent"}>{r.cadence}</Tag>
              <Tag>{r.pages} pages</Tag>
            </div>
            <button className="flex w-full items-center justify-center gap-1.5 rounded border border-border py-1.5 text-[11px] text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground">
              <Download className="size-3.5" /> Generate PDF
            </button>
          </Panel>
        ))}
      </div>
    </div>
  );
}
