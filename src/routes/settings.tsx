import { createFileRoute } from "@tanstack/react-router";
import { roles, SITES } from "@/lib/ot/data";
import { PageHeader, Panel, Tag } from "@/components/ot/ui";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — PROCESSLA OT Guardian" },
      {
        name: "description",
        content:
          "Platform configuration: sites, roles and permissions, detection tuning, integrations and data retention.",
      },
      { property: "og:title", content: "Settings — PROCESSLA OT Guardian" },
      { property: "og:description", content: "Configure sites, access control, integrations and retention." },
    ],
  }),
  component: Settings,
});

const INTEGRATIONS = [
  { name: "Splunk Enterprise Security", type: "SIEM", status: "Connected" },
  { name: "Microsoft Sentinel", type: "SIEM", status: "Connected" },
  { name: "ServiceNow OT", type: "ITSM", status: "Connected" },
  { name: "Syslog (CEF)", type: "Forwarding", status: "Connected" },
  { name: "Active Directory / SAML SSO", type: "Identity", status: "Connected" },
  { name: "Email / SMTP Relay", type: "Notification", status: "Not configured" },
];

function Settings() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Settings"
        description="Platform configuration for sites, access control, integrations and data retention. Changes are recorded in the audit log."
      />

      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Monitored Sites" bodyClassName="divide-y divide-border/60">
          {SITES.map((s) => (
            <div key={s} className="flex items-center justify-between px-4 py-2.5 text-xs">
              <span className="text-foreground">{s}</span>
              <Tag tone="healthy">Monitoring</Tag>
            </div>
          ))}
        </Panel>

        <Panel title="Integrations" bodyClassName="divide-y divide-border/60">
          {INTEGRATIONS.map((i) => (
            <div key={i.name} className="flex items-center justify-between gap-3 px-4 py-2.5 text-xs">
              <div className="min-w-0">
                <p className="truncate text-foreground">{i.name}</p>
                <p className="text-[11px] text-muted-foreground">{i.type}</p>
              </div>
              <Tag tone={i.status === "Connected" ? "healthy" : "neutral"}>{i.status}</Tag>
            </div>
          ))}
        </Panel>
      </div>

      <Panel title="Roles & Permissions" bodyClassName="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="label-caps border-b border-border text-left">
            <tr>
              <th className="px-3 py-2">Role</th>
              <th className="px-3 py-2">Users</th>
              <th className="px-3 py-2">Description</th>
              <th className="px-3 py-2">Permissions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((r) => (
              <tr key={r.name} className="border-b border-border/60 hover:bg-muted/30">
                <td className="px-3 py-2 font-medium text-foreground">{r.name}</td>
                <td className="mono-num px-3 py-2">{r.users}</td>
                <td className="px-3 py-2 text-muted-foreground">{r.description}</td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-1">
                    {r.perms.map((p) => (
                      <Tag key={p}>{p}</Tag>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <Panel title="Data Retention" bodyClassName="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4 text-xs">
        {[
          { label: "Network Metadata", value: "13 months" },
          { label: "Alerts & Investigations", value: "36 months" },
          { label: "Audit Log", value: "24 months" },
          { label: "PCAP Extracts", value: "30 days" },
        ].map((d) => (
          <div key={d.label}>
            <p className="label-caps">{d.label}</p>
            <p className="mono-num text-foreground">{d.value}</p>
          </div>
        ))}
      </Panel>
    </div>
  );
}
