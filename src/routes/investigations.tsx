import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Paperclip, UserCircle2 } from "lucide-react";
import { alerts, fmtDateTime, investigationTimeline } from "@/lib/ot/data";
import { PageHeader, Panel, SeverityBadge, Tag } from "@/components/ot/ui";

export const Route = createFileRoute("/investigations")({
  head: () => ({
    meta: [
      { title: "Incident Investigation — PROCESSLA OT Guardian" },
      {
        name: "description",
        content:
          "Investigate OT security incidents with a communication timeline, analyst notes, evidence, PCAP references and incident status tracking.",
      },
      { property: "og:title", content: "Incident Investigation — PROCESSLA OT Guardian" },
      { property: "og:description", content: "Timeline-driven OT incident investigation for control-system engineers." },
    ],
  }),
  component: Investigations,
});

const STATUSES = ["New", "Under Investigation", "Confirmed Incident", "False Positive", "Mitigated", "Closed"] as const;

function Investigations() {
  const open = alerts.filter((a) => a.severity === "critical" || a.severity === "high").slice(0, 8);
  const [caseId, setCaseId] = useState(open[0]?.id ?? "");
  const [status, setStatus] = useState<string>("Under Investigation");
  const [owner, setOwner] = useState("a.mcleod");
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([
    {
      author: "a.mcleod",
      time: "17:02Z",
      text: "Confirmed the source MAC is not registered in the engineering asset register. Switch port Gi1/0/14 identified on SW-OT-ACC-03.",
    },
    {
      author: "r.patel",
      time: "17:11Z",
      text: "Control engineering confirms no permit-to-work is open for WTG-021 today. Escalating to confirmed incident pending site check.",
    },
  ]);

  const current = alerts.find((a) => a.id === caseId) ?? open[0]!;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Investigation"
        description="Reconstruct what happened on the network, capture analyst reasoning and evidence, and drive the incident to a defensible conclusion."
      />

      <div className="grid gap-5 xl:grid-cols-[280px_1fr_320px]">
        <Panel title="Open Cases" bodyClassName="p-0">
          <div className="max-h-[560px] overflow-auto">
            {open.map((a) => (
              <button
                key={a.id}
                onClick={() => setCaseId(a.id)}
                className={`w-full border-b border-border/40 px-3 py-2.5 text-left hover:bg-accent/30 ${
                  current.id === a.id ? "bg-accent/40" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="mono-num text-[10px] text-muted-foreground">{a.id}</span>
                  <SeverityBadge severity={a.severity} />
                </div>
                <p className="mt-1 text-xs text-foreground">{a.title}</p>
                <p className="mono-num text-[10px] text-muted-foreground">{fmtDateTime(a.timestamp)}</p>
              </button>
            ))}
          </div>
        </Panel>

        <div className="space-y-5">
          <Panel
            title={current.title}
            subtitle={`${current.id} · ${current.srcName} → ${current.dstName} · ${current.protocol}`}
            bodyClassName="space-y-3"
          >
            <div className="flex flex-wrap items-center gap-2">
              <SeverityBadge severity={current.severity} />
              <Tag tone="accent">{current.mitre}</Tag>
              <Tag>Anomaly {current.anomalyScore}/100</Tag>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">{current.explanation}</p>
          </Panel>

          <Panel title="Attack / Communication Timeline" subtitle="Reconstructed from passive flow metadata">
            <ol className="relative space-y-5 border-l border-border pl-6">
              {investigationTimeline.map((t, i) => (
                <li key={i} className="relative">
                  <span
                    className="absolute top-1 -left-[27px] size-3 rounded-full ring-4 ring-surface"
                    style={{
                      background:
                        t.severity === "critical"
                          ? "var(--critical)"
                          : t.severity === "high"
                            ? "var(--high)"
                            : "var(--medium)",
                    }}
                  />
                  <div className="flex flex-wrap items-baseline gap-3">
                    <span className="mono-num text-xs font-semibold text-foreground">{t.time}</span>
                    <span
                      className={`text-xs font-medium ${t.severity === "critical" ? "text-critical" : "text-foreground"}`}
                    >
                      {t.label}
                    </span>
                    <SeverityBadge severity={t.severity} />
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">{t.detail}</p>
                </li>
              ))}
            </ol>
          </Panel>

          <Panel title="Analyst Notes">
            <div className="space-y-3">
              {notes.map((n, i) => (
                <div key={i} className="rounded border border-border/60 bg-background/40 p-3">
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <UserCircle2 className="size-3.5" /> {n.author} · {n.time}
                  </div>
                  <p className="mt-1.5 text-xs text-foreground">{n.text}</p>
                </div>
              ))}
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="Record your analysis, actions taken and evidence references…"
                className="w-full rounded border border-input bg-background/60 p-2.5 text-xs focus:border-primary/60 focus:outline-none"
              />
              <button
                onClick={() => {
                  if (!note.trim()) return;
                  setNotes((n) => [...n, { author: owner, time: "now", text: note.trim() }]);
                  setNote("");
                }}
                className="rounded bg-primary px-3 py-1.5 text-[11px] font-semibold tracking-wide text-primary-foreground uppercase"
              >
                Add Note
              </button>
            </div>
          </Panel>
        </div>

        <div className="space-y-5">
          <Panel title="Case Management" bodyClassName="space-y-3">
            <label className="block">
              <span className="label-caps">Incident Status</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 h-8 w-full rounded border border-input bg-background/60 px-2 text-xs focus:outline-none"
              >
                {STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="label-caps">Incident Owner</span>
              <select
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="mt-1 h-8 w-full rounded border border-input bg-background/60 px-2 text-xs focus:outline-none"
              >
                {["a.mcleod", "j.okafor", "s.hansen", "r.patel"].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </label>
            <div className="rounded border border-border/60 p-2.5 text-[11px] text-muted-foreground">
              Status changes and ownership transfers are written to the immutable audit log.
            </div>
          </Panel>

          <Panel title="Evidence" bodyClassName="space-y-2">
            {[
              { icon: FileText, label: "flow-export-ALT-0001.csv", meta: "3.2 MB · flow metadata" },
              { icon: Paperclip, label: "wtg021-s7comm.pcapng", meta: "PCAP reference · sensor WTG-SENSOR-01" },
              { icon: Paperclip, label: "switch-port-evidence.png", meta: "Screenshot · SW-OT-ACC-03 Gi1/0/14" },
            ].map((e) => (
              <div key={e.label} className="flex items-center gap-2.5 rounded border border-border/60 px-2.5 py-2">
                <e.icon className="size-4 text-primary" />
                <div className="min-w-0">
                  <p className="truncate text-xs text-foreground">{e.label}</p>
                  <p className="truncate text-[10px] text-muted-foreground">{e.meta}</p>
                </div>
              </div>
            ))}
            <button className="w-full rounded border border-dashed border-border py-2 text-[11px] text-muted-foreground hover:border-primary/60 hover:text-primary">
              Attach evidence
            </button>
          </Panel>

          <Panel title="Related Detections" bodyClassName="space-y-2">
            {alerts.slice(0, 5).map((a) => (
              <div key={a.id} className="flex items-center gap-2 text-[11px]">
                <SeverityBadge severity={a.severity} />
                <span className="min-w-0 flex-1 truncate text-foreground">{a.title}</span>
              </div>
            ))}
          </Panel>
        </div>
      </div>
    </div>
  );
}
