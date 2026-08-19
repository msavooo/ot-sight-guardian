import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Waves } from "lucide-react";
import { baselines } from "@/lib/ot/data";
import { KpiCard, MiniBar, PageHeader, Panel, SeverityBadge, Tag } from "@/components/ot/ui";

export const Route = createFileRoute("/baseline")({
  head: () => ({
    meta: [
      { title: "Behaviour Baseline — PROCESSLA OT Guardian" },
      {
        name: "description",
        content:
          "Learned OT communication baselines per relationship with frequency, volume, time window, confidence and explainable anomaly scoring.",
      },
      { property: "og:title", content: "Behaviour Baseline — PROCESSLA OT Guardian" },
      { property: "og:description", content: "Understand what is normal before deciding what is abnormal." },
    ],
  }),
  component: BaselinePage,
});

function BaselinePage() {
  const [filter, setFilter] = useState("all");
  const rows = baselines.filter((b) => (filter === "all" ? true : b.state === filter));
  const deviations = baselines.filter((b) => b.state === "Deviation");
  const [selected, setSelected] = useState(deviations[0]?.id ?? baselines[0]!.id);
  const current = baselines.find((b) => b.id === selected)!;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Behaviour Baseline"
        description="The platform learns each communication relationship — source, destination, protocol, port, frequency, volume and typical time — then scores deviations against it."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Learned Relationships" value={baselines.filter((b) => b.state === "Learned").length} tone="healthy" />
        <KpiCard label="Still Learning" value={baselines.filter((b) => b.state === "Learning").length} tone="accent" />
        <KpiCard label="Active Deviations" value={deviations.length} tone="critical" />
        <KpiCard label="Baseline Window" value="30 days" tone="neutral" hint="Rolling, per relationship" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <Panel
          title="Communication Baselines"
          subtitle="Every relationship the sensors have observed"
          bodyClassName="p-0"
          action={
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="h-7 rounded border border-input bg-background/60 px-2 text-[11px] focus:outline-none"
            >
              <option value="all">All states</option>
              <option value="Learned">Learned</option>
              <option value="Learning">Learning</option>
              <option value="Deviation">Deviation</option>
            </select>
          }
        >
          <div className="max-h-[560px] overflow-auto">
            <table className="w-full min-w-[900px] text-xs">
              <thead className="sticky top-0 bg-surface-raised">
                <tr className="text-left">
                  {["Source", "Destination", "Protocol", "Port", "Frequency", "Volume", "Typical Time", "Confidence", "State"].map(
                    (h) => (
                      <th key={h} className="label-caps border-b border-border px-3 py-2.5 font-normal whitespace-nowrap">
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {rows.map((b) => (
                  <tr
                    key={b.id}
                    onClick={() => setSelected(b.id)}
                    className={`cursor-pointer border-b border-border/40 hover:bg-accent/30 ${
                      selected === b.id ? "bg-accent/40" : ""
                    }`}
                  >
                    <td className="px-3 py-2 whitespace-nowrap text-foreground">{b.srcName}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-foreground">{b.dstName}</td>
                    <td className="px-3 py-2">
                      <Tag tone="accent">{b.protocol}</Tag>
                    </td>
                    <td className="mono-num px-3 py-2">{b.port}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">{b.frequency}</td>
                    <td className="mono-num px-3 py-2 text-muted-foreground">{b.volume}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">{b.typicalTime}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className="mono-num w-8">{b.confidence}%</span>
                        <div className="w-14">
                          <MiniBar value={b.confidence} />
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <Tag tone={b.state === "Deviation" ? "danger" : b.state === "Learning" ? "warn" : "healthy"}>
                        {b.state}
                      </Tag>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <div className="space-y-5">
          <Panel title="Anomaly Explanation" subtitle={current.id}>
            <div className="space-y-3 text-xs">
              <div className="rounded border border-border/60 bg-background/40 p-3">
                <p className="text-foreground">
                  {current.srcName} <span className="text-primary">→</span> {current.dstName}
                </p>
                <p className="mono-num mt-1 text-[11px] text-muted-foreground">
                  {current.protocol} / TCP {current.port} · {current.frequency}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div>
                  <p className="label-caps">Anomaly Score</p>
                  <p
                    className="mono-num text-2xl font-semibold"
                    style={{
                      color:
                        current.anomalyScore >= 85
                          ? "var(--critical)"
                          : current.anomalyScore >= 60
                            ? "var(--high)"
                            : "var(--healthy)",
                    }}
                  >
                    {current.anomalyScore}/100
                  </p>
                </div>
                <SeverityBadge
                  severity={current.anomalyScore >= 85 ? "critical" : current.anomalyScore >= 60 ? "high" : "low"}
                />
              </div>
              <div>
                <p className="label-caps mb-1.5">Reason</p>
                {current.reasons.length ? (
                  <ul className="space-y-1.5">
                    {current.reasons.map((r) => (
                      <li key={r} className="flex gap-2 text-[11px] text-muted-foreground">
                        <span className="text-critical">›</span> {r}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[11px] text-muted-foreground">
                    This relationship matches the learned profile. Frequency, volume and time window are all within the
                    observed distribution.
                  </p>
                )}
              </div>
            </div>
          </Panel>

          <Panel title="How Baselining Works" bodyClassName="space-y-2.5 text-[11px] text-muted-foreground">
            <p className="flex gap-2">
              <Waves className="mt-0.5 size-3.5 shrink-0 text-primary" />
              Every observed relationship is profiled for 30 days across frequency, direction, volume, port, protocol and
              time-of-day.
            </p>
            <p>
              A new source, new protocol, out-of-window activity or a critical destination each add weight to the anomaly
              score. Detections always state which of these factors triggered.
            </p>
            <p className="text-foreground">
              Example: PLC-WTG-021 normally speaks Modbus TCP/502 to SCADA-SRV-01 every 2 seconds. SSH from
              ENG-LAPTOP-17 scores 94/100 — new source, new protocol, outside maintenance window, critical controller.
            </p>
          </Panel>
        </div>
      </div>
    </div>
  );
}
