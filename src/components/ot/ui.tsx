import { cn } from "@/lib/utils";
import type { Severity } from "@/lib/ot/types";
import type { ReactNode } from "react";

export const SEVERITY_HEX: Record<Severity, string> = {
  critical: "oklch(0.58 0.22 22)",
  high: "oklch(0.68 0.17 48)",
  medium: "oklch(0.83 0.15 90)",
  low: "oklch(0.72 0.13 195)",
  informational: "oklch(0.66 0.05 250)",
};

const sevClass: Record<Severity, string> = {
  critical: "border-critical/50 bg-critical/15 text-critical",
  high: "border-high/50 bg-high/15 text-high",
  medium: "border-medium/50 bg-medium/15 text-medium",
  low: "border-low/50 bg-low/15 text-low",
  informational: "border-info/50 bg-info/15 text-info",
};

export function SeverityBadge({
  severity,
  label,
  className,
}: {
  severity: Severity;
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded border px-1.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase",
        sevClass[severity],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {label ?? severity}
    </span>
  );
}

export function Tag({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "accent" | "healthy" | "warn" | "danger";
  className?: string;
}) {
  const tones = {
    neutral: "border-border bg-secondary/60 text-muted-foreground",
    accent: "border-primary/40 bg-primary/10 text-primary",
    healthy: "border-healthy/40 bg-healthy/10 text-healthy",
    warn: "border-medium/40 bg-medium/10 text-medium",
    danger: "border-critical/40 bg-critical/10 text-critical",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-medium tracking-wide whitespace-nowrap",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Panel({
  title,
  subtitle,
  action,
  children,
  className,
  bodyClassName,
}: {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("panel flex min-w-0 flex-col", className)}>
      {(title || action) && (
        <header className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
          <div className="min-w-0">
            {title && <h2 className="text-sm font-semibold tracking-wide text-foreground">{title}</h2>}
            {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      <div className={cn("min-w-0 flex-1 p-4", bodyClassName)}>{children}</div>
    </section>
  );
}

export function PageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-wide text-foreground uppercase">{title}</h1>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{description}</p>
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}

export function KpiCard({
  label,
  value,
  hint,
  tone = "neutral",
  icon,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: "neutral" | "accent" | "healthy" | "medium" | "high" | "critical";
  icon?: ReactNode;
}) {
  const bar = {
    neutral: "bg-muted-foreground/40",
    accent: "bg-primary",
    healthy: "bg-healthy",
    medium: "bg-medium",
    high: "bg-high",
    critical: "bg-critical",
  } as const;
  const text = {
    neutral: "text-foreground",
    accent: "text-primary",
    healthy: "text-healthy",
    medium: "text-medium",
    high: "text-high",
    critical: "text-critical",
  } as const;
  return (
    <div className="panel relative overflow-hidden px-4 py-3">
      <span className={cn("absolute inset-y-0 left-0 w-[3px]", bar[tone])} />
      <div className="flex items-start justify-between gap-2">
        <p className="label-caps">{label}</p>
        {icon && <span className="text-muted-foreground">{icon}</span>}
      </div>
      <p className={cn("mono-num mt-1.5 text-2xl leading-none font-semibold", text[tone])}>{value}</p>
      {hint && <p className="mt-1.5 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function MiniBar({ value, max = 100, tone = "accent" }: { value: number; max?: number; tone?: "accent" | Severity }) {
  const pct = Math.min(100, (value / max) * 100);
  const color =
    tone === "accent" ? "var(--primary)" : SEVERITY_HEX[tone as Severity] ?? "var(--primary)";
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

export function RiskScore({ score, size = 92 }: { score: number; size?: number }) {
  const sev: Severity = score >= 85 ? "critical" : score >= 70 ? "high" : score >= 45 ? "medium" : "low";
  const r = size / 2 - 7;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--secondary)" strokeWidth={7} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={SEVERITY_HEX[sev]}
          strokeWidth={7}
          strokeLinecap="round"
          strokeDasharray={`${(score / 100) * c} ${c}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="mono-num text-lg leading-none font-semibold" style={{ color: SEVERITY_HEX[sev] }}>
          {score}
        </span>
        <span className="text-[9px] tracking-widest text-muted-foreground">/100</span>
      </div>
    </div>
  );
}

export function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border/60 py-1.5 last:border-0">
      <span className="text-[11px] tracking-wide text-muted-foreground uppercase">{label}</span>
      <span className="mono-num text-right text-xs text-foreground">{value}</span>
    </div>
  );
}

export function LiveDot({ label = "LIVE" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded border border-healthy/40 bg-healthy/10 px-1.5 py-0.5 text-[10px] font-semibold tracking-widest text-healthy">
      <span className="live-dot size-1.5 rounded-full bg-healthy" />
      {label}
    </span>
  );
}

export function bytesFmt(b: number) {
  if (b > 1e9) return `${(b / 1e9).toFixed(2)} GB`;
  if (b > 1e6) return `${(b / 1e6).toFixed(1)} MB`;
  if (b > 1e3) return `${(b / 1e3).toFixed(1)} KB`;
  return `${b} B`;
}

export function numFmt(n: number) {
  return n.toLocaleString("en-GB");
}
