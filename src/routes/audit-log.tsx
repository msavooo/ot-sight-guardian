import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { auditLog, fmtDateTime } from "@/lib/ot/data";
import { KpiCard, PageHeader, Panel, Tag } from "@/components/ot/ui";

export const Route = createFileRoute("/audit-log")({
  head: () => ({
    meta: [
      { title: "Audit Log — PROCESSLA OT Guardian" },
      {
        name: "description",
        content:
          "Tamper-evident audit trail of every operator action, configuration change and export within the OT monitoring platform.",
      },
      { property: "og:title", content: "Audit Log — PROCESSLA OT Guardian" },
      { property: "og:description", content: "Complete, exportable record of platform activity." },
    ],
  }),
  component: AuditLog,
});

function AuditLog() {
  const [q, setQ] = useState("");
  const rows = auditLog.filter((e) =>
    `${e.user} ${e.action} ${e.target} ${e.role}`.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="Audit Log"
        description="Every action is recorded with user, role, source address and timestamp. Entries are append-only and exportable for regulatory audit."
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search user, action or target"
          className="h-8 w-64 rounded border border-input bg-background/60 px-2 text-xs focus:border-primary/60 focus:outline-none"
        />
      </PageHeader>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Events (24h)" value={auditLog.length} tone="accent" />
        <KpiCard
          label="Unique Users"
          value={new Set(auditLog.map((e) => e.user)).size}
          tone="accent"
        />
        <KpiCard label="Config Changes" value={auditLog.filter((e) => e.action.includes("updated") || e.action.includes("created")).length} tone="high" />
        <KpiCard label="Integrity" value="Verified" tone="healthy" />
      </div>

      <Panel title="Activity Trail" bodyClassName="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="label-caps border-b border-border text-left">
            <tr>
              <th className="px-3 py-2">Timestamp</th>
              <th className="px-3 py-2">User</th>
              <th className="px-3 py-2">Role</th>
              <th className="px-3 py-2">Action</th>
              <th className="px-3 py-2">Target</th>
              <th className="px-3 py-2">Source IP</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((e, i) => (
              <tr key={i} className="border-b border-border/60 hover:bg-muted/30">
                <td className="mono-num px-3 py-2 text-muted-foreground">{fmtDateTime(e.time)}</td>
                <td className="px-3 py-2 text-foreground">{e.user}</td>
                <td className="px-3 py-2">
                  <Tag>{e.role}</Tag>
                </td>
                <td className="px-3 py-2 text-foreground">{e.action}</td>
                <td className="mono-num px-3 py-2 text-muted-foreground">{e.target}</td>
                <td className="mono-num px-3 py-2 text-muted-foreground">{e.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
