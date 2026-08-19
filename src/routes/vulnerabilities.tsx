import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { vulnerabilities } from "@/lib/ot/data";
import { KpiCard, MiniBar, PageHeader, Panel, SeverityBadge, Tag } from "@/components/ot/ui";

export const Route = createFileRoute("/vulnerabilities")({
  head: () => ({
    meta: [
      { title: "Vulnerability Management — PROCESSLA OT Guardian" },
      {
        name: "description",
        content:
          "CVE exposure across OT assets with contextual OT risk scoring based on criticality, reachability, exposure and live communication.",
      },
      { property: "og:title", content: "Vulnerability Management — PROCESSLA OT Guardian" },
      { property: "og:description", content: "Contextual OT vulnerability prioritisation, not raw CVSS." },
    ],
  }),
  component: Vulns,
});

function Vulns() {
  const [status, setStatus] = useState("all");
  const rows = vulnerabilities
    .filter((v) => (status === "all" ? true : v.status === status))
    .sort((a, b) => b.riskScore - a.riskScore);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Vulnerabilities"
        description="CVSS alone does not describe OT risk. Each finding is re-scored using asset criticality, network reachability, exposure and whether the asset is actively communicating."
      >
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-8 rounded border border-input bg-background/60 px-2 text-xs focus:outline-none"
        >
          <option value="all">All statuses</option>
          {["Open", "Mitigated", "Risk Accepted", "Patched"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </PageHeader>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Vulnerable Assets" value={136} tone="high" />
        <KpiCard label="Critical OT Risk" value={vulnerabilities.filter((v) => v.otRisk === "critical").length} tone="critical" />
        <KpiCard label="Weaponised Exploits" value={vulnerabilities.filter((v) => v.exploitability === "Weaponised").length} tone="critical" />
        <KpiCard label="Patch Available" value={vulnerabilities.filter((v) => v.patchAvailable).length} tone="healthy" />
      </div>

      <Panel title="Contextual OT Risk Model" bodyClassName="grid gap-3 sm:grid-cols-4 text-xs">
        {[
          ["CVSS Base", "Vendor-published technical severity of the flaw."],
          ["Asset Criticality", "Process impact if the asset is degraded or lost."],
          ["Reachability", "Can the vulnerable service actually be reached from a lower-trust zone?"],
          ["Activity", "Is the asset communicating now, and with whom?"],
        ].map(([t, d]) => (
          <div key={t} className="rounded border border-border/60 p-3">
            <p className="label-caps">{t}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">{d}</p>
          </div>
        ))}
      </Panel>

      <Panel title={`Findings (${rows.length})`} bodyClassName="p-0">
        <div className="overflow-auto">
          <table className="w-full min-w-[1300px] text-xs">
            <thead className="bg-surface-raised">
              <tr className="text-left">
                {[
                  "CVE",
                  "Asset",
                  "Vendor",
                  "Product",
                  "CVSS",
                  "Exploitability",
                  "Asset Criticality",
                  "Reachable",
                  "Final OT Risk",
                  "Risk Score",
                  "Patch",
                  "Mitigation",
                  "Status",
                ].map((h) => (
                  <th key={h} className="label-caps border-b border-border px-3 py-2.5 font-normal whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((v) => (
                <tr key={v.cve} className="border-b border-border/40 hover:bg-accent/30">
                  <td className="mono-num px-3 py-2 whitespace-nowrap text-primary">{v.cve}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <Link to="/assets/$assetId" params={{ assetId: v.assetId }} className="text-foreground hover:underline">
                      {v.assetName}
                    </Link>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">{v.vendor}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">{v.product}</td>
                  <td className="mono-num px-3 py-2 font-semibold" style={{ color: v.cvss >= 9 ? "var(--critical)" : v.cvss >= 7 ? "var(--high)" : "var(--medium)" }}>
                    {v.cvss.toFixed(1)}
                  </td>
                  <td className="px-3 py-2">
                    <Tag tone={v.exploitability === "Weaponised" ? "danger" : v.exploitability === "Public PoC" ? "warn" : "neutral"}>
                      {v.exploitability}
                    </Tag>
                  </td>
                  <td className="px-3 py-2">
                    <Tag tone={v.criticality === "Critical" ? "danger" : "neutral"}>{v.criticality}</Tag>
                  </td>
                  <td className="px-3 py-2">
                    <Tag tone={v.reachable ? "danger" : "healthy"}>{v.reachable ? "Yes" : "Segmented"}</Tag>
                  </td>
                  <td className="px-3 py-2">
                    <SeverityBadge severity={v.otRisk} />
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="mono-num w-6">{v.riskScore}</span>
                      <div className="w-14">
                        <MiniBar value={v.riskScore} tone={v.otRisk} />
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2">{v.patchAvailable ? <Tag tone="healthy">Available</Tag> : <Tag>None</Tag>}</td>
                  <td className="px-3 py-2">{v.mitigationAvailable ? <Tag tone="accent">Available</Tag> : <Tag>None</Tag>}</td>
                  <td className="px-3 py-2">
                    <Tag tone={v.status === "Open" ? "warn" : "healthy"}>{v.status}</Tag>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="Prioritised Remediation Guidance" bodyClassName="space-y-2 text-[11px] text-muted-foreground">
        <p className="text-foreground">
          Patching a Level 1 controller usually requires a process outage. Where a patch is not viable, the platform
          recommends compensating controls.
        </p>
        <p>· Restrict the vulnerable service at the conduit rather than the endpoint (firewall or ACL at the zone boundary).</p>
        <p>· Remove reachability from lower-trust zones — most OT CVEs become unexploitable once segmented.</p>
        <p>· Where risk is accepted, record the decision with an owner and review date; this is written to the audit log.</p>
      </Panel>
    </div>
  );
}
