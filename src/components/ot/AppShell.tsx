import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  Activity,
  AlertTriangle,
  Bell,
  BookLock,
  ChevronLeft,
  Crosshair,
  FileBarChart,
  Gauge,
  Grid3x3,
  LayoutDashboard,
  Layers,
  Network,
  Radar,
  Radio,
  Search,
  Server,
  Settings,
  ShieldAlert,
  Siren,
  Waves,
  Bug,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SITES, kpis } from "@/lib/ot/data";
import { LiveDot } from "./ui";

const NAV = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/network-monitor", label: "Network Monitor", icon: Activity },
  { to: "/assets", label: "Assets", icon: Server },
  { to: "/network-map", label: "Network Map", icon: Network },
  { to: "/alerts", label: "Alerts", icon: Siren, badge: 4 },
  { to: "/investigations", label: "Investigations", icon: Search },
  { to: "/baseline", label: "Behaviour Baseline", icon: Waves },
  { to: "/protocols", label: "OT Protocols", icon: Radio },
  { to: "/zones", label: "Zones & Conduits", icon: Layers },
  { to: "/vulnerabilities", label: "Vulnerabilities", icon: Bug },
  { to: "/risk", label: "Risk", icon: Gauge },
  { to: "/threat-intelligence", label: "Threat Intelligence", icon: Crosshair },
  { to: "/mitre", label: "MITRE ATT&CK", icon: Grid3x3 },
  { to: "/sensors", label: "Sensors", icon: Radar },
  { to: "/reports", label: "Reports", icon: FileBarChart },
  { to: "/audit-log", label: "Audit Log", icon: BookLock },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [site, setSite] = useState<string>(SITES[0]);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={cn(
          "sticky top-0 flex h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200",
          collapsed ? "w-[68px]" : "w-[248px]",
        )}
      >
        <div className="flex h-14 items-center gap-2.5 border-b border-sidebar-border px-4">
          <span className="flex size-8 shrink-0 items-center justify-center rounded bg-primary/15 ring-1 ring-primary/40">
            <ShieldAlert className="size-4 text-primary" />
          </span>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-[13px] leading-none font-semibold tracking-wide text-sidebar-foreground">
                PROCESSLA
              </p>
              <p className="truncate text-[10px] tracking-[0.16em] text-primary uppercase">OT Guardian</p>
            </div>
          )}
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3">
          {NAV.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                title={item.label}
                className={cn(
                  "group flex items-center gap-2.5 rounded px-2.5 py-2 text-[13px] font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-[inset_2px_0_0_0_var(--sidebar-primary)]"
                    : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                )}
              >
                <Icon className={cn("size-4 shrink-0", active && "text-primary")} />
                {!collapsed && <span className="truncate">{item.label}</span>}
                {!collapsed && "badge" in item && item.badge ? (
                  <span className="mono-num ml-auto rounded bg-critical/20 px-1.5 text-[10px] font-semibold text-critical">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-2 border-t border-sidebar-border p-3">
          {!collapsed ? (
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">System Health</span>
                <span className="font-semibold text-healthy">Healthy</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Sensors Online</span>
                <span className="mono-num font-semibold text-foreground">
                  {kpis.sensorsOnline} / {kpis.sensorsTotal}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Last Update</span>
                <LiveDot />
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <span className="live-dot size-2 rounded-full bg-healthy" />
            </div>
          )}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="flex w-full items-center justify-center gap-1.5 rounded border border-sidebar-border py-1.5 text-[11px] text-muted-foreground transition-colors hover:text-sidebar-foreground"
          >
            <ChevronLeft className={cn("size-3.5 transition-transform", collapsed && "rotate-180")} />
            {!collapsed && "Collapse"}
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-surface/95 px-4 backdrop-blur">
          <div className="relative w-full max-w-md">
            <Search className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search IP, hostname, MAC, protocol or asset"
              className="h-9 w-full rounded border border-input bg-background/60 pr-3 pl-8 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none"
            />
          </div>

          <label className="ml-auto hidden items-center gap-2 lg:flex">
            <span className="label-caps">Site</span>
            <select
              value={site}
              onChange={(e) => setSite(e.target.value)}
              className="h-8 rounded border border-input bg-background/60 px-2 text-xs text-foreground focus:border-primary/60 focus:outline-none"
            >
              {SITES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <div className="hidden items-center gap-2 md:flex">
            <span className="inline-flex items-center gap-1.5 rounded border border-critical/40 bg-critical/10 px-2 py-1 text-[11px] font-semibold text-critical">
              <AlertTriangle className="size-3.5" /> 4 Critical
            </span>
            <span className="inline-flex items-center gap-1.5 rounded border border-healthy/40 bg-healthy/10 px-2 py-1 text-[11px] font-semibold text-healthy">
              <Radar className="size-3.5" /> 12/12 Sensors
            </span>
            <button className="relative rounded border border-border p-1.5 text-muted-foreground hover:text-foreground">
              <Bell className="size-4" />
              <span className="absolute -top-1 -right-1 size-2 rounded-full bg-high" />
            </button>
          </div>

          <div className="flex items-center gap-2 border-l border-border pl-3">
            <span className="flex size-7 items-center justify-center rounded-full bg-primary/15 ring-1 ring-primary/40">
              <User className="size-3.5 text-primary" />
            </span>
            <div className="hidden leading-tight sm:block">
              <p className="text-xs font-medium text-foreground">a.mcleod</p>
              <p className="text-[10px] text-muted-foreground">OT Security Engineer</p>
            </div>
          </div>
        </header>

        <main className="min-w-0 flex-1 p-4 lg:p-6">{children}</main>

        <footer className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border px-4 py-2.5 text-[11px] text-muted-foreground">
          <span>PROCESSLA OT Guardian 4.8.2</span>
          <span className="text-primary">Passive monitoring — no active scanning of control systems</span>
          <span className="ml-auto">Site: {site}</span>
          <span>Availability {kpis.availability}</span>
        </footer>
      </div>
    </div>
  );
}
