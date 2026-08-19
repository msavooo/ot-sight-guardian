import { createFileRoute } from "@tanstack/react-router";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts";
import { kpis, riskBreakdown, topRiskyAssets } from "@/lib/ot/data";
import type { Severity } from "@/lib/ot/types";
import { MiniBar, PageHeader, Panel, RiskScore, SeverityBadge, numFmt } from "@/components/ot/ui";

export const Route = createFileRoute("/risk")({
  head: () => ({
    meta: [
      { title: "OT Cyber Risk — PROCESSLA OT Guardian" },
      {
        name: "description",
        content:
          "Overall OT cyber risk score broken into asset, vulnerability, exposure, configuration, threat, segmentation and remote access risk.",
      },
      { property: "og:title", content: "OT Cyber Risk — PROCESSLA OT Guardian" },
      { property: "og:description", content: "Quantified OT cyber risk with a likelihood × impact matrix." },
    ],
  }),
  component: RiskPage,
});

const LIKELIHOOD = ["Rare", "Unlikely", "Possible", "Likely", "Almost Certain"];
const IMPACT = ["Negligible", "Minor", "Moderate", "Major", "Severe"];

function cellSeverity(l: number, i: number): Severity {
  const s = (l + 1) * (i + 1);
  if (s >= 16) return "critical";
  if (s >= 10) return "high";
  if (s >= 5) return "medium";
  return "low";
}

const PLACED: Record<string, string> = {
  "3-4": "Unauthorised engineering access",
  "4-3": "IT→OT lateral movement",
  "2-4": "Protection relay setting change",
  "1-2": "Rogue IoT device",
  "3-2": "Vendor remote access misuse",
};

function RiskPage() {
  const radar = riskBreakdown.map((r) => ({ subject: r.name.replace(" Risk", ""), score: r.score }));

  return (
    <div className="space-y-5">
      <PageHeader
        title="OT Cyber Risk"
        description="Risk is calculated from live network evidence rather than a questionnaire — what is actually connected, exposed, vulnerable and communicating."
      />

      <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
        <Panel title="Overall Score" bodyClassName="flex flex-col items-center gap-3 py-6">
          <RiskScore score={kpis.riskScore} size={150} />
          <p className="text-lg font-semibold tracking-wide text-high uppercase">Elevated</p>
          <p className="px-4 text-center text-[11px] text-muted-foreground">
            OT Cyber Risk {kpis.riskScore} / 100 across {numFmt(kpis.totalAssets)} monitored assets and 12 sensors.
          </p>
          <div className="mt-2 grid w-full grid-cols-2 gap-3 px-4 text-center">
            <div>
              <p className="mono-num text-xl font-semibold text-critical">{kpis.highRiskAssets}</p>
              <p className="label-caps">High-Risk Assets</p>
            </div>
            <div>
              <p className="mono-num text-xl font-semibold text-high">{kpis.vulnerableAssets}</p>
              <p className="label-caps">Vulnerable Assets</p>
            </div>
          </div>
        </Panel>

        <Panel title="Risk Domains" bodyClassName="grid gap-5 lg:grid-cols-2">
          <div className="space-y-3">
            {riskBreakdown.map((r) => (
              <div key={r.name}>
                <div className="mb-1 flex items-baseline justify-between text-xs">
                  <span className="text-foreground">
                    {r.name} <span className="text-muted-foreground">· weight {r.weight}</span>
                  </span>
                  <span className="mono-num text-foreground">{r.score}</span>
                </div>
                <MiniBar value={r.score} tone={r.score >= 80 ? "critical" : r.score >= 65 ? "high" : "medium"} />
                <p className="mt-1 text-[11px] text-muted-foreground">{r.detail}</p>
              </div>
            ))}
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radar} outerRadius="72%">
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", fontSize: 11 }} />
                <Radar dataKey="score" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <Panel title="Risk Matrix" subtitle="Likelihood × Impact — positioned by observed evidence" bodyClassName="overflow-auto">
          <table className="w-full min-w-[640px] text-[11px]">
            <thead>
              <tr>
                <th className="label-caps px-2 py-1 text-left font-normal">Likelihood \ Impact</th>
                {IMPACT.map((i) => (
                  <th key={i} className="label-caps px-2 py-1 font-normal">
                    {i}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...LIKELIHOOD].reverse().map((l, ri) => {
                const li = LIKELIHOOD.length - 1 - ri;
                return (
                  <tr key={l}>
                    <td className="px-2 py-1 whitespace-nowrap text-muted-foreground">{l}</td>
                    {IMPACT.map((_, ii) => {
                      const sev = cellSeverity(li, ii);
                      const label = PLACED[`${li}-${ii}`];
                      return (
                        <td key={ii} className="p-1">
                          <div
                            className="flex h-14 items-center justify-center rounded border px-1 text-center text-[10px] leading-tight"
                            style={{
                              background: `color-mix(in oklab, var(--${sev === "informational" ? "info" : sev}) 22%, transparent)`,
                              borderColor: `var(--${sev === "informational" ? "info" : sev})`,
                              color: label ? "var(--foreground)" : "transparent",
                            }}
                          >
                            {label ?? "·"}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="mt-3 flex flex-wrap gap-3">
            {(["critical", "high", "medium", "low"] as Severity[]).map((s) => (
              <SeverityBadge key={s} severity={s} />
            ))}
          </div>
        </Panel>

        <Panel title="Highest Risk Assets" bodyClassName="space-y-2">
          {topRiskyAssets.map((a) => (
            <div key={a.id} className="flex items-center gap-3 rounded border border-border/60 px-3 py-2">
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs text-foreground">{a.name}</p>
                <p className="truncate text-[10px] text-muted-foreground">
                  {a.type} · {a.zone}
                </p>
              </div>
              <span className="mono-num text-sm font-semibold text-high">{a.riskScore}</span>
            </div>
          ))}
        </Panel>
      </div>
    </div>
  );
}
