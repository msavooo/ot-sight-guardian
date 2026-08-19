import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, ShieldAlert } from "lucide-react";
import { alerts, fmtDateTime, severityRank } from "@/lib/ot/data";
import type { Severity } from "@/lib/ot/types";
import { KpiCard, PageHeader, Panel, SeverityBadge, Tag } from "@/components/ot/ui";

export const Route = createFileRoute("/alerts")({
  head: () => ({
    meta: [
      { title: "Security Alerts — PROCESSLA OT Guardian" },
      {
        name: "description",
        content:
          "OT cybersecurity alerts with explainable detection logic, affected assets, MITRE ATT&CK for ICS mapping and recommended actions.",
      },
      { property: "og:title", content: "Security Alerts — PROCESSLA OT Guardian" },
      { property: "og:description", content: "Explainable OT detections mapped to assets and ATT&CK for ICS." },
    ],
  }),
  component: AlertsPage;
});

const SEVERITIES: Severity[] = ["critical", "high", "medium", "low", "informational"];

function AlertsPage() {
  const [q, setQ] = useState("");
  const [sev, setSev] = useState("all");
  const [status, setStatus] = useState("all");
  const [selectedId, setSelectedId] = useState(alerts[0]?.id ?? "");

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return [...alerts]
      .filter((a) => {
        if (sev !== "all" && a.severity !== sev) return false;
        if (status !== "all" && a.status !== status) return false;
        if (!needle) return true;
        return [a.title, a.srcName, a.dstName, a.protocol, a.zone, a.type].join(" ").toLowerCase().includes(needle);
      })
      .sort((a, b) => severityRank[a.severity] - severityRank[b.severity] || b.timestamp.localeCompare(a.timestamp));
  }, [q, sev, status]);

  const selected = alerts.find((a) => a.id === selectedId) ?? rows[0] ?? null;
  const count = (s: Severity) => alerts.filter((a) => a.severity === s).length;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Security Alerts"
        description="Every detection is asset-centric and explainable: the platform states which baseline the behaviour violated and why it matters to the process."
      />

      <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-5">
        <KpiCard label="Critical" value={count("critical")} tone="critical" />
        <KpiCard label="High" value={count("high")} tone="high" />
        <KpiCard label="Medium" value={count("medium")} tone="medium" />
        <KpiCard label="Low" value={count("low")} tone="accent" />
        <KpiCard label="Informational" value={count("informational")} tone="neutral" />
      </div>

      <Panel bodyClassName="grid gap-2 sm:grid-cols-3">
        <div className="relative sm:col-span-1">
          <Search className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search alerts, assets or protocols"
            className="h-9 w-full rounded border border-input bg-background/60 pr-3 pl-8 text-xs focus:border-primary/60 focus:outline-none"
          />
        </div>
        <select
          value={sev}
          onChange={(e) => setSev(e.target.value)}
          className="h-9 rounded border border-input bg-background/60 px-2 text-xs capitalize focus:outline-none"
        >
          <option value="all">All severities</option>
          {SEVERITIES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-9 rounded border border-input bg-background/60 px-2 text-xs focus:outline-none"
        >
          <option value="all">All statuses</option>
          {["New", "Under Investigation", "Confirmed Incident", "False Positive", "Mitigated", "Closed"].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </Panel>

      <div className="grid gap-5 xl:grid-cols-[1fr_400px]">
        <Panel title={`Alert Queue (${rows.length})`} bodyClassName="p-0">
          <div className="max-h-[640px] overflow-auto">
            {rows.map((a) => (
              <button
                key={a.id}
                onClick={() => setSelectedId(a.id)}
                className={`flex w-full items-start gap-3 border-b border-border/40 px-4 py-3 text-left transition-colors hover:bg-accent/30 ${
                  selected?.id === a.id ? "bg-accent/40" : ""
                }`}
              >
                <ShieldAlert
                  className="mt-0.5 size-4 shrink-0"
                  style={{
                    color:
                      a.severity === "critical"
                        ? "var(--critical)"
                        : a.severity === "high"
                          ? "var(--high)"
                          : a.severity === "medium"
                            ? "var(--medium)"
                            : "var(--muted-foreground)",
                  }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{a.title}</span>
                    <SeverityBadge severity={a.severity} />
                    <Tag>{a.status}</Tag>
                  </div>
                  <p className="mono-num mt-1 truncate text-[11px] text-muted-foreground">
                    {a.srcName} → {a.dstName} · {a.protocol} · {a.zone}
                  </p>
                </div>
                <span className="mono-num shrink-0 text-[10px] text-muted-foreground">{fmtDateTime(a.timestamp)}</span>
              </button>
            ))}
          </div>
        </Panel>

        <Panel title="Alert Detail" subtitle={selected?.id}>
          {selected ? (
            <div className="space-y-4 text-xs">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <SeverityBadge severity={selected.severity} />
                  <Tag tone="accent">{selected.type}</Tag>
                </div>
                <h3 className="mt-2 text-base font-semibold text-foreground">{selected.title}</h3>
              </div>

              <div className="rounded border border-border/60 bg-background/40 p-3">
                <p className="mono-num text-foreground">
                  {selected.srcName} <span className="text-primary">→</span> {selected.dstName}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {selected.protocol} · {selected.zone} · {fmtDateTime(selected.timestamp)}
                </p>
              </div>

              <Block title="Description">{selected.description}</Block>
              <Block title="Why this was flagged (explainable detection)">{selected.explanation}</Block>
              <Block title="Recommended Action">{selected.recommendation}</Block>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="label-caps">Anomaly Score</p>
                  <p className="mono-num text-lg font-semibold text-high">{selected.anomalyScore}/100</p>
                </div>
                <div>
                  <p className="label-caps">ATT&amp;CK for ICS</p>
                  <p className="text-foreground">{selected.mitre}</p>
                </div>
                <div>
                  <p className="label-caps">Status</p>
                  <p className="text-foreground">{selected.status}</p>
                </div>
                <div>
                  <p className="label-caps">Owner</p>
                  <p className="text-foreground">{selected.owner}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <Link
                  to="/investigations"
                  className="rounded bg-primary px-3 py-1.5 text-[11px] font-semibold tracking-wide text-primary-foreground uppercase"
                >
                  Investigate
                </Link>
                <button className="rounded border border-border px-3 py-1.5 text-[11px] font-semibold tracking-wide uppercase hover:border-primary/60">
                  Acknowledge
                </button>
                <button className="rounded border border-border px-3 py-1.5 text-[11px] font-semibold tracking-wide uppercase hover:border-primary/60">
                  Mark False Positive
                </button>
                <Link
                  to="/assets/$assetId"
                  params={{ assetId: selected.assetId }}
                  className="rounded border border-border px-3 py-1.5 text-[11px] font-semibold tracking-wide uppercase hover:border-primary/60"
                >
                  View Asset
                </Link>
              </div>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">No alerts match the current filters.</p>
          )}
        </Panel>
      </div>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="label-caps mb-1">{title}</p>
      <p className="text-[11px] leading-relaxed text-muted-foreground">{children}</p>
    </div>
  );
}
