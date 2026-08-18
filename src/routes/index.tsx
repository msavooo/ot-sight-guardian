import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlertTriangle, ArrowRight, Network, ShieldCheck } from "lucide-react";
import {
  alerts24h,
  assetsByPurdue,
  assetsByType,
  fmtDateTime,
  kpis,
  protocolStats,
  recentlyDiscovered,
  riskDistribution,
  topConversations,
  topRiskyAssets,
  trafficTrend,
} from "@/lib/ot/data";
import { KpiCard, MiniBar, Panel, RiskScore, SeverityBadge, SEVERITY_HEX, Tag, bytesFmt, numFmt } from "@/components/ot/ui";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OT Security Overview — PROCESSLA OT Guardian" },
      {
        name: "description",
        content:
          "Executive OT cybersecurity dashboard: asset visibility, network activity, alerts and OT cyber risk across critical infrastructure sites.",
      },
      { property: "og:title", content: "OT Security Overview — PROCESSLA OT Guardian" },
      {
        property: "og:description",
        content: "See every asset. Understand every connection. Detect every anomaly.",
      },
    ],
  }),
  component: Overview,
});

const axis = {
  stroke: "var(--muted-foreground)",
  fontSize: 10,
  tickLine: false,
  axisLine: false,
};

const tooltipStyle = {
  contentStyle: {
    background: "var(--popover)",
    border: "1px solid var(--border)",
    borderRadius: 6,
    fontSize: 11,
  },
  labelStyle: { color: "var(--muted-foreground)", fontSize: 10 },
};

const TYPE_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--muted-foreground)",
];

function Overview() {
  const protoTop = [...protocolStats].sort((a, b) => b.sessions - a.sessions).slice(0, 8);

  return (
    <div className="space-y-5">
      {/* HERO */}
      <section className="panel grid-bg relative overflow-hidden px-6 py-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_-10%,color-mix(in_oklab,var(--primary)_22%,transparent),transparent_60%)]" />
        <div className="relative max-w-4xl">
          <Tag tone="accent">Passive OT Network Detection &amp; Response</Tag>
          <h1 className="mt-3 text-4xl leading-tight font-semibold tracking-wide text-foreground uppercase">
            Complete Visibility Into Your OT Network
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
            Continuously discover industrial assets, understand network communications, detect abnormal behaviour and
            identify cyber threats without disrupting operations.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              to="/network-map"
              className="inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-xs font-semibold tracking-wide text-primary-foreground uppercase transition-opacity hover:opacity-90"
            >
              <Network className="size-4" /> View Network
            </Link>
            <Link
              to="/alerts"
              className="inline-flex items-center gap-2 rounded border border-critical/50 bg-critical/10 px-4 py-2 text-xs font-semibold tracking-wide text-critical uppercase transition-colors hover:bg-critical/20"
            >
              <AlertTriangle className="size-4" /> Investigate Alerts
            </Link>
          </div>
          <dl className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {[
              ["Assets Monitored", numFmt(kpis.totalAssets)],
              ["Active Connections", numFmt(kpis.activeConnections)],
              ["Sensors Online", `${kpis.sensorsOnline}`],
              ["Critical Alerts", `${kpis.criticalAlerts}`],
              ["Monitoring Availability", kpis.availability],
            ].map(([label, value]) => (
              <div key={label} className="border-l-2 border-primary/40 pl-3">
                <dd className="mono-num text-xl font-semibold text-foreground">{value}</dd>
                <dt className="label-caps">{label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* STATUS BANNER */}
      <section className="flex flex-wrap items-center gap-4 rounded-lg border border-high/50 bg-high/10 px-5 py-4">
        <AlertTriangle className="size-6 shrink-0 text-high" />
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold tracking-wide text-high uppercase">OT Security Status: Elevated Risk</h2>
          <p className="text-sm text-foreground/80">4 critical cybersecurity events require investigation.</p>
        </div>
        <Link
          to="/investigations"
          className="inline-flex items-center gap-1.5 rounded border border-high/50 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-high uppercase hover:bg-high/15"
        >
          Open Investigations <ArrowRight className="size-3.5" />
        </Link>
      </section>

      {/* KPI GROUPS */}
      <div className="grid gap-5 xl:grid-cols-4">
        <KpiGroup title="Assets">
          <KpiCard label="Total Assets" value={numFmt(kpis.totalAssets)} tone="accent" />
          <KpiCard label="Critical Assets" value={kpis.criticalAssets} tone="critical" />
          <KpiCard label="New Assets (24h)" value={kpis.newAssets} tone="medium" />
          <KpiCard label="Unmanaged Assets" value={kpis.unmanagedAssets} tone="high" />
        </KpiGroup>
        <KpiGroup title="Network">
          <KpiCard label="Active Connections" value={numFmt(kpis.activeConnections)} tone="accent" />
          <KpiCard label="OT Protocol Sessions" value={numFmt(kpis.otSessions)} tone="accent" />
          <KpiCard label="External Connections" value={kpis.externalConnections} tone="high" />
          <KpiCard label="Blocked / Unexpected" value={kpis.blockedConnections} tone="critical" />
        </KpiGroup>
        <KpiGroup title="Cybersecurity">
          <KpiCard label="Critical Alerts" value={kpis.criticalAlerts} tone="critical" />
          <KpiCard label="High Alerts" value={kpis.highAlerts} tone="high" />
          <KpiCard label="Medium Alerts" value={kpis.mediumAlerts} tone="medium" />
          <KpiCard label="Low Alerts" value={kpis.lowAlerts} tone="accent" />
        </KpiGroup>
        <KpiGroup title="Risk">
          <div className="panel flex items-center gap-4 px-4 py-3">
            <RiskScore score={kpis.riskScore} size={76} />
            <div>
              <p className="label-caps">Overall OT Cyber Risk</p>
              <p className="mono-num text-lg font-semibold text-high">{kpis.riskScore}/100</p>
              <p className="text-[11px] text-muted-foreground">Elevated — trending +6 this week</p>
            </div>
          </div>
          <KpiCard label="Vulnerable Assets" value={kpis.vulnerableAssets} tone="high" />
          <KpiCard label="High-Risk Assets" value={kpis.highRiskAssets} tone="critical" />
        </KpiGroup>
      </div>

      {/* CHARTS */}
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Alerts — Last 24 Hours" subtitle="Detections grouped by severity" bodyClassName="h-[260px] p-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={alerts24h} barCategoryGap={2}>
              <XAxis dataKey="hour" {...axis} interval={3} />
              <YAxis {...axis} width={26} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="low" stackId="a" fill={SEVERITY_HEX.low} />
              <Bar dataKey="medium" stackId="a" fill={SEVERITY_HEX.medium} />
              <Bar dataKey="high" stackId="a" fill={SEVERITY_HEX.high} />
              <Bar dataKey="critical" stackId="a" fill={SEVERITY_HEX.critical} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Network Traffic Trend" subtitle="Mbps observed at sensor SPAN/TAP ports" bodyClassName="h-[260px] p-3">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trafficTrend}>
              <defs>
                <linearGradient id="gOt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.55} />
                  <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.03} />
                </linearGradient>
                <linearGradient id="gIt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <XAxis dataKey="t" {...axis} interval={7} />
              <YAxis {...axis} width={30} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Area type="monotone" dataKey="ot" name="OT protocols" stroke="var(--chart-1)" fill="url(#gOt)" strokeWidth={1.5} />
              <Area type="monotone" dataKey="it" name="IT protocols" stroke="var(--chart-2)" fill="url(#gIt)" strokeWidth={1.5} />
              <Area type="monotone" dataKey="external" name="External" stroke={SEVERITY_HEX.critical} fill="transparent" strokeWidth={1.5} />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Panel title="Asset Distribution by Type" bodyClassName="h-[280px] p-3">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={assetsByType.slice(0, 7)} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={2}>
                {assetsByType.slice(0, 7).map((_, i) => (
                  <Cell key={i} fill={TYPE_COLORS[i % TYPE_COLORS.length]} stroke="var(--surface)" />
                ))}
              </Pie>
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Tooltip {...tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Assets by Purdue Level" subtitle="Enterprise → Physical process" bodyClassName="space-y-3">
          {assetsByPurdue.map((p, i) => (
            <div key={p.name}>
              <div className="mb-1 flex items-baseline justify-between text-xs">
                <span className="text-foreground">
                  {p.name} <span className="text-muted-foreground">· {p.label}</span>
                </span>
                <span className="mono-num text-muted-foreground">{p.value}</span>
              </div>
              <div className="h-2 overflow-hidden rounded bg-secondary">
                <div
                  className="h-full rounded"
                  style={{
                    width: `${(p.value / Math.max(...assetsByPurdue.map((x) => x.value))) * 100}%`,
                    background: TYPE_COLORS[i % TYPE_COLORS.length],
                  }}
                />
              </div>
            </div>
          ))}
        </Panel>

        <Panel title="Risk Severity Distribution" bodyClassName="space-y-3">
          {riskDistribution.map((r) => (
            <div key={r.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <SeverityBadge severity={r.key} label={r.name} />
                <span className="mono-num text-muted-foreground">{numFmt(r.value)} assets</span>
              </div>
              <MiniBar value={r.value} max={1284} tone={r.key} />
            </div>
          ))}
          <p className="pt-2 text-[11px] text-muted-foreground">
            Risk is contextual: severity is weighted by asset criticality, reachability and observed communication.
          </p>
        </Panel>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Most Active Protocols" subtitle="Sessions observed in the last 24h" bodyClassName="h-[280px] p-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={protoTop} layout="vertical" margin={{ left: 30 }}>
              <XAxis type="number" {...axis} />
              <YAxis type="category" dataKey="name" {...axis} width={110} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="sessions" fill="var(--chart-2)" radius={[0, 2, 2, 0]} barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Top Risky Assets" subtitle="Highest contextual OT risk score">
          <div className="space-y-2">
            {topRiskyAssets.map((a) => (
              <Link
                key={a.id}
                to="/assets/$assetId"
                params={{ assetId: a.id }}
                className="flex items-center gap-3 rounded border border-border/60 px-3 py-2 transition-colors hover:border-primary/50 hover:bg-accent/40"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-foreground">{a.name}</p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {a.type} · {a.zone} · {a.purdue}
                  </p>
                </div>
                <div className="w-24">
                  <MiniBar value={a.riskScore} tone={a.riskScore >= 85 ? "critical" : a.riskScore >= 70 ? "high" : "medium"} />
                </div>
                <span className="mono-num w-10 text-right text-xs font-semibold text-foreground">{a.riskScore}</span>
              </Link>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Top Network Conversations" subtitle="By traffic volume">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="label-caps py-2 font-normal">Source</th>
                  <th className="label-caps py-2 font-normal">Destination</th>
                  <th className="label-caps py-2 font-normal">Protocol</th>
                  <th className="label-caps py-2 text-right font-normal">Bytes</th>
                </tr>
              </thead>
              <tbody>
                {topConversations.map((c) => (
                  <tr key={c.id} className="border-b border-border/40 last:border-0">
                    <td className="py-2 text-foreground">{c.srcName}</td>
                    <td className="py-2 text-foreground">{c.dstName}</td>
                    <td className="py-2">
                      <Tag tone="accent">{c.protocol}</Tag>
                    </td>
                    <td className="mono-num py-2 text-right text-muted-foreground">{bytesFmt(c.bytes)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Recently Discovered Devices" subtitle="Passively fingerprinted — no active scanning">
          <div className="space-y-2">
            {recentlyDiscovered.map((a) => (
              <div key={a.id} className="flex items-center gap-3 rounded border border-border/60 px-3 py-2">
                <ShieldCheck className={a.managed ? "size-4 text-healthy" : "size-4 text-high"} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-foreground">{a.name}</p>
                  <p className="mono-num truncate text-[11px] text-muted-foreground">
                    {a.ip} · {a.vendor} {a.model}
                  </p>
                </div>
                <span className="mono-num text-[10px] text-muted-foreground">{fmtDateTime(a.firstSeen)}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function KpiGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h2 className="label-caps border-l-2 border-primary pl-2">{title}</h2>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
