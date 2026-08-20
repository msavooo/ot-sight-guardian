import { createFileRoute } from "@tanstack/react-router";
import { sensors } from "@/lib/ot/data";
import { KpiCard, MiniBar, PageHeader, Panel, Tag, numFmt } from "@/components/ot/ui";

export const Route = createFileRoute("/sensors")({
  head: () => ({
    meta: [
      { title: "Passive Sensors — PROCESSLA OT Guardian" },
      {
        name: "description",
        content:
          "Health, throughput and capture status of passive OT network sensors deployed on SPAN and TAP ports.",
      },
      { property: "og:title", content: "Passive Sensors — PROCESSLA OT Guardian" },
      { property: "og:description", content: "Sensor fleet health and packet capture quality." },
    ],
  }),
  component: Sensors,
});

function Sensors() {
  const pps = sensors.reduce((s, x) => s + x.pps, 0);
  const degraded = sensors.filter((s) => s.status !== "Healthy").length;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Sensors"
        description="Passive collection points mirroring OT traffic. Sensors never transmit onto monitored control networks."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Sensors Deployed" value={sensors.length} tone="accent" />
        <KpiCard label="Healthy" value={sensors.length - degraded} tone="healthy" />
        <KpiCard label="Degraded" value={degraded} tone="high" />
        <KpiCard label="Aggregate Packets/s" value={numFmt(pps)} tone="accent" />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {sensors.map((s) => (
          <Panel
            key={s.id}
            title={s.name}
            subtitle={s.location}
            bodyClassName="space-y-3 p-4"
            action={
              <Tag tone={s.status === "Healthy" ? "healthy" : "warn"}>{s.status}</Tag>
            }
          >
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:grid-cols-3">
              <Field label="Sensor ID" value={s.id} />
              <Field label="Management IP" value={s.ip} />
              <Field label="Firmware" value={s.version} />
              <Field label="Packets / s" value={numFmt(s.pps)} />
              <Field label="Bandwidth" value={s.bandwidth} />
              <Field label="Packet Drops" value={s.packetDrops} />
              <Field label="Last Heartbeat" value={s.lastHeartbeat} />
              <Field label="Interfaces" value={s.interfaces.join(", ")} />
            </div>
            <div>
              <div className="label-caps mb-1 flex items-center justify-between">
                <span>Capture Health</span>
                <span className="mono-num text-foreground">{s.health}%</span>
              </div>
              <MiniBar value={s.health} tone={s.health > 90 ? "accent" : "high"} />
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="label-caps">{label}</p>
      <p className="mono-num truncate text-foreground">{value}</p>
    </div>
  );
}
