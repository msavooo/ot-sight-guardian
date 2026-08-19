import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Cpu, ShieldAlert } from "lucide-react";
import {
  alerts,
  assetById,
  conversations,
  fmtDateTime,
  fmtTime,
  vulnerabilities,
} from "@/lib/ot/data";
import {
  DetailRow,
  MiniBar,
  Panel,
  RiskScore,
  SeverityBadge,
  Tag,
  bytesFmt,
  numFmt,
} from "@/components/ot/ui";

export const Route = createFileRoute("/assets/$assetId")({
  loader: ({ params }) => {
    const asset = assetById.get(params.assetId);
    if (!asset) throw notFound();
    return { asset };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Asset unavailable — PROCESSLA OT Guardian" }, { name: "robots", content: "noindex" }] };
    }
    const a = loaderData.asset;
    const title = `${a.name} — Asset Detail — PROCESSLA OT Guardian`;
    const description = `${a.type} by ${a.vendor} ${a.model} in ${a.zone} (${a.purdue}). Risk ${a.riskScore}/100, criticality ${a.criticality}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: AssetDetail,
  notFoundComponent: AssetNotFound,
});

function AssetNotFound() {
  return (
    <div className="panel p-8 text-center">
      <h1 className="text-lg font-semibold text-foreground">Asset not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">This asset is no longer in the inventory.</p>
      <Link to="/assets" className="mt-4 inline-block text-sm text-primary hover:underline">
        Back to inventory
      </Link>
    </div>
  );
}

function AssetDetail() {
  const { asset } = Route.useLoaderData();
  const peers = conversations.filter((c) => c.srcId === asset.id || c.dstId === asset.id).slice(0, 12);
  const assetAlerts = alerts.filter((a) => a.assetId === asset.id || a.srcName === asset.name || a.dstName === asset.name);
  const assetVulns = vulnerabilities.filter((v) => v.assetId === asset.id);

  const timeline = [
    { time: "10:24", text: `Modbus communication with SCADA-SRV-01`, sev: "informational" as const },
    { time: "10:31", text: "Configuration read performed", sev: "low" as const },
    { time: "10:42", text: "New engineering workstation communication detected", sev: "high" as const },
    { time: "10:43", text: "Alert generated: Unauthorized Engineering Access", sev: "critical" as const },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-4">
        <div>
          <Link to="/assets" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary">
            <ArrowLeft className="size-3.5" /> Asset Inventory
          </Link>
          <h1 className="mt-2 flex items-center gap-2 text-2xl font-semibold tracking-wide text-foreground uppercase">
            <Cpu className="size-6 text-primary" />
            {asset.name}
          </h1>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Tag>{asset.type}</Tag>
            <Tag tone="accent">{asset.zone}</Tag>
            <Tag>{asset.purdue}</Tag>
            <Tag tone={asset.criticality === "Critical" ? "danger" : "warn"}>{asset.criticality}</Tag>
            <Tag tone={asset.status === "Online" ? "healthy" : "warn"}>{asset.status}</Tag>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <RiskScore score={asset.riskScore} />
          <div className="text-xs">
            <p className="label-caps">Contextual OT Risk</p>
            <p className="text-muted-foreground">
              Criticality, exposure and live communication weighted against {assetVulns.length} known vulnerabilities.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Panel title="Asset Overview" bodyClassName="pt-1">
          <DetailRow label="Asset ID" value={asset.id} />
          <DetailRow label="Manufacturer" value={asset.vendor} />
          <DetailRow label="Model" value={asset.model} />
          <DetailRow label="Firmware" value={asset.firmware} />
          <DetailRow label="Operating System" value={asset.os} />
          <DetailRow label="Serial Number" value={asset.serial} />
          <DetailRow label="IP Address" value={asset.ip} />
          <DetailRow label="MAC Address" value={asset.mac} />
          <DetailRow label="Location" value={asset.location} />
          <DetailRow label="Site" value={asset.site} />
          <DetailRow label="Zone" value={asset.zone} />
          <DetailRow label="Purdue Level" value={asset.purdue} />
          <DetailRow label="Criticality" value={asset.criticality} />
          <DetailRow label="Managed" value={asset.managed ? "Yes" : "No — unmanaged"} />
        </Panel>

        <Panel title="Network Behaviour" subtitle="Learned from passive observation" bodyClassName="space-y-4">
          <div>
            <p className="label-caps mb-1.5">Protocols Used</p>
            <div className="flex flex-wrap gap-1">
              {asset.protocols.map((p) => (
                <Tag key={p} tone="accent">
                  {p}
                </Tag>
              ))}
            </div>
          </div>
          <div className="space-y-1">
            <DetailRow label="Communication Frequency" value="every 2 seconds (median)" />
            <DetailRow label="Average Bandwidth" value="1.4 Mbps" />
            <DetailRow label="First Communication" value={fmtDateTime(asset.firstSeen)} />
            <DetailRow label="Last Communication" value={fmtDateTime(asset.lastSeen)} />
            <DetailRow label="Peers Observed" value={numFmt(peers.length)} />
          </div>
          <div>
            <p className="label-caps mb-1.5">Communicates With</p>
            <div className="space-y-1.5">
              {peers.slice(0, 6).map((c) => (
                <div key={c.id} className="flex items-center justify-between gap-2 rounded border border-border/60 px-2 py-1.5 text-[11px]">
                  <span className="truncate text-foreground">
                    {c.srcId === asset.id ? c.dstName : c.srcName}
                  </span>
                  <Tag tone="accent">{c.protocol}</Tag>
                  <span className="mono-num text-muted-foreground">{bytesFmt(c.bytes)}</span>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        <Panel title="Security" subtitle="Vulnerabilities, misconfigurations and active detections" bodyClassName="space-y-4">
          <div>
            <p className="label-caps mb-1.5">Vulnerabilities / CVEs</p>
            {assetVulns.length ? (
              <div className="space-y-1.5">
                {assetVulns.map((v) => (
                  <div key={v.cve} className="rounded border border-border/60 p-2">
                    <div className="flex items-center justify-between">
                      <span className="mono-num text-xs text-foreground">{v.cve}</span>
                      <SeverityBadge severity={v.otRisk} />
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">{v.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-muted-foreground">
                No CVEs currently matched to the observed firmware ({asset.firmware}).
              </p>
            )}
          </div>
          <div>
            <p className="label-caps mb-1.5">Misconfigurations</p>
            <ul className="space-y-1 text-[11px] text-muted-foreground">
              <li>· Plaintext protocol in use on a Level 1 segment</li>
              <li>· Device management interface reachable from Engineering Network</li>
              {!asset.managed && <li>· Asset has no registered owner or change record</li>}
            </ul>
          </div>
          <div>
            <p className="label-caps mb-1.5">Active Alerts</p>
            {assetAlerts.length ? (
              <div className="space-y-1.5">
                {assetAlerts.slice(0, 5).map((a) => (
                  <Link
                    key={a.id}
                    to="/alerts"
                    className="flex items-center gap-2 rounded border border-border/60 px-2 py-1.5 text-[11px] hover:border-primary/50"
                  >
                    <ShieldAlert className="size-3.5 text-high" />
                    <span className="min-w-0 flex-1 truncate text-foreground">{a.title}</span>
                    <SeverityBadge severity={a.severity} />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-muted-foreground">No active detections for this asset.</p>
            )}
          </div>
        </Panel>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <Panel title="Behaviour Timeline" subtitle="Observed activity for this asset today">
          <ol className="relative space-y-4 border-l border-border pl-5">
            {timeline.map((t, i) => (
              <li key={i} className="relative">
                <span
                  className="absolute top-1 -left-[23px] size-2.5 rounded-full ring-4 ring-surface"
                  style={{
                    background:
                      t.sev === "critical"
                        ? "var(--critical)"
                        : t.sev === "high"
                          ? "var(--high)"
                          : t.sev === "low"
                            ? "var(--low)"
                            : "var(--muted-foreground)",
                  }}
                />
                <div className="flex items-baseline gap-3">
                  <span className="mono-num text-xs text-muted-foreground">{t.time}</span>
                  <span className="text-xs text-foreground">{t.text}</span>
                </div>
              </li>
            ))}
          </ol>
        </Panel>

        <Panel title="Recent Flows" bodyClassName="p-0">
          <div className="max-h-[320px] overflow-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-surface-raised">
                <tr className="text-left">
                  {["Time", "Peer", "Protocol", "Bytes", "Risk"].map((h) => (
                    <th key={h} className="label-caps border-b border-border px-3 py-2 font-normal">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {peers.map((c) => (
                  <tr key={c.id} className="border-b border-border/40">
                    <td className="mono-num px-3 py-2 text-muted-foreground">{fmtTime(c.timestamp)}</td>
                    <td className="px-3 py-2 text-foreground">{c.srcId === asset.id ? c.dstName : c.srcName}</td>
                    <td className="px-3 py-2">
                      <Tag tone="accent">{c.protocol}</Tag>
                    </td>
                    <td className="mono-num px-3 py-2">{bytesFmt(c.bytes)}</td>
                    <td className="px-3 py-2">
                      <SeverityBadge severity={c.risk} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-border p-3">
            <p className="label-caps mb-1">Baseline Confidence</p>
            <MiniBar value={94} />
          </div>
        </Panel>
      </div>
    </div>
  );
}
