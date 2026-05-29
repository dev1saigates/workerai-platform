"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { APPROVALS_BADGE_COUNT, getPageTitle } from "@/lib/app-nav";
import { getStoredSession, logout } from "@/lib/auth-api";
import {
  ONBOARDING_EVENT,
  getOnboardingOverrides,
  type Worker,
} from "@/lib/workers-data";
import { fetchWorkers } from "@/lib/workers-api";
import {
  IconBell,
  IconBook,
  IconChart,
  IconChevronDown,
  IconClaw,
  IconGear,
  IconHome,
  IconInbox,
  IconList,
  IconLogout,
  IconMenu,
  IconPeople,
  IconRobot,
  IconSearch,
  IconWorkflow,
} from "./app-icons";
import { appCanvas } from "@/lib/brand";
import { ThemeToggle } from "./theme-toggle";

/**
 * Shared app chrome: sidebar + header + main slot.
 * Used once in app/(app)/layout.tsx — like PHP header.php + footer.php wrapping every page.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const activePath = pathname;
  const title = getPageTitle(pathname);
  const [mobileNav, setMobileNav] = useState(false);
  const session = getStoredSession();
  const user = session?.user;
  const workspace = session?.workspace;
  const initials = user ? nameInitials(user.fullName) : "??";

  function handleLogout() {
    logout();
    router.replace("/sign-in");
  }

  return (
    <div
      className={`flex min-h-dvh bg-slate-100 text-slate-900 dark:text-white ${appCanvas}`}
    >
      {mobileNav ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          aria-label="Close menu"
          onClick={() => setMobileNav(false)}
        />
      ) : null}

      <aside
        className={[
          "app-panel fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:static lg:translate-x-0",
          mobileNav ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        <div className="border-b border-slate-200 p-4 dark:border-[#00b4ff]/10">
          <div className="flex items-center gap-2">
            <div className="brand-gradient flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white shadow-[0_0_20px_rgba(0,180,255,0.4)]">
              W
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold tracking-tight">WorkerAI</p>
              <span className="mt-0.5 inline-block rounded border border-amber-500/50 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-600 dark:border-amber-500/40 dark:bg-amber-500/15 dark:text-amber-400">
                Professional
              </span>
            </div>
          </div>
          <p className="mt-3 text-xs font-medium text-slate-600 dark:text-slate-300">
            {workspace?.name ?? "Workspace"}
          </p>
          <p className="text-[11px] text-slate-500">{user?.email ?? ""}</p>
        </div>

        <nav className="flex flex-1 flex-col gap-5 overflow-y-auto px-3 py-4">
          <NavGroup label="Main">
            <NavItem
              href="/dashboard"
              active={activePath === "/dashboard"}
              icon={<IconHome />}
              onNavigate={() => setMobileNav(false)}
            >
              Command Centre
            </NavItem>
            <NavItem
              href="/approvals"
              active={activePath === "/approvals"}
              icon={<IconInbox />}
              badge={String(APPROVALS_BADGE_COUNT)}
              onNavigate={() => setMobileNav(false)}
            >
              Approvals
            </NavItem>
            <WorkersNav
              activePath={activePath}
              onNavigate={() => setMobileNav(false)}
            />
            <NavItem
              href="/workflows"
              active={activePath === "/workflows"}
              icon={<IconWorkflow />}
              onNavigate={() => setMobileNav(false)}
            >
              Workflows
            </NavItem>
          </NavGroup>
          <NavGroup label="Data & tools">
            <NavItem href="/claw" active={activePath === "/claw"} icon={<IconClaw />} onNavigate={() => setMobileNav(false)}>
              Claw — Ingestion
            </NavItem>
            <NavItem href="/task-log" active={activePath === "/task-log"} icon={<IconList />} onNavigate={() => setMobileNav(false)}>
              Task Log
            </NavItem>
            <NavItem href="/reports" active={activePath === "/reports"} icon={<IconChart />} onNavigate={() => setMobileNav(false)}>
              Reports
            </NavItem>
          </NavGroup>
          <NavGroup label="Workspace">
            <NavItem href="/team" active={activePath === "/team"} icon={<IconPeople />} onNavigate={() => setMobileNav(false)}>
              Team
            </NavItem>
            <NavItem href="/knowledge" active={activePath === "/knowledge"} icon={<IconBook />} onNavigate={() => setMobileNav(false)}>
              Knowledge Hub
            </NavItem>
            <NavItem href="/settings" active={activePath === "/settings"} icon={<IconGear />} onNavigate={() => setMobileNav(false)}>
              Settings
            </NavItem>
          </NavGroup>
        </nav>

        <div className="border-t border-slate-200 p-3 dark:border-white/[0.08]">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-[#00b4ff]/8 dark:ring-1 dark:ring-[#00b4ff]/15">
            <div className="brand-gradient flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-white">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user?.fullName ?? "User"}</p>
              <p className="text-xs text-slate-500">Owner</p>
            </div>
            <button
              type="button"
              className="shrink-0 rounded-lg p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
              aria-label="Sign out"
              onClick={() => {
                setMobileNav(false);
                handleLogout();
              }}
            >
              <IconLogout />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="app-panel-solid flex h-14 items-center justify-between gap-4 border-b border-slate-200 bg-white/90 px-4 backdrop-blur-md lg:h-16 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="-ml-1 rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 lg:hidden dark:hover:bg-white/5 dark:hover:text-white"
              aria-expanded={mobileNav}
              aria-label="Open menu"
              onClick={() => setMobileNav(true)}
            >
              <IconMenu />
            </button>
            <h1 className="text-lg font-semibold tracking-tight lg:text-xl">{title}</h1>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <ThemeToggle />
            <button
              type="button"
              className="rounded-lg p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-white/5 dark:hover:text-white"
              aria-label="Search"
            >
              <IconSearch />
            </button>
            <button
              type="button"
              className="relative rounded-lg p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-white/5 dark:hover:text-white"
              aria-label="Notifications"
            >
              <IconBell />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#00b4ff] ring-2 ring-white dark:ring-[#061828]" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

function NavGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
        {label}
      </p>
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  );
}

/**
 * AI Workers nav item — expands to show every worker with an onboarding
 * status dot (green = onboarded, amber = needs onboarding).
 *
 * PHP analogy: it's like a <ul> with a toggle, but the open/closed state and
 * the "onboarded" map are React state that re-render automatically.
 */
function WorkersNav({
  activePath,
  onNavigate,
}: {
  activePath: string;
  onNavigate?: () => void;
}) {
  const onWorkersRoute = activePath.startsWith("/workers");
  const [expanded, setExpanded] = useState(onWorkersRoute);
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});
  const [workers, setWorkers] = useState<Worker[]>([]);

  useEffect(() => {
    fetchWorkers()
      .then(setWorkers)
      .catch(() => setWorkers([]));
  }, [activePath]);

  // Auto-expand whenever the user navigates onto any /workers route.
  useEffect(() => {
    if (onWorkersRoute) setExpanded(true);
  }, [onWorkersRoute]);

  // Read onboarding overrides from localStorage and listen for changes so
  // the green/amber dot updates the moment a chat finishes onboarding.
  useEffect(() => {
    const sync = () => setOverrides(getOnboardingOverrides());
    sync();
    window.addEventListener(ONBOARDING_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(ONBOARDING_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const onboardedFor = (w: Worker) =>
    w.slug in overrides ? overrides[w.slug] : w.onboarded;

  const parentActive = activePath === "/workers";

  return (
    <div>
      <div className="flex items-stretch gap-1">
        <Link
          href="/workers"
          onClick={onNavigate}
          className={[
            "group flex flex-1 cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
            parentActive
              ? "bg-[#00b4ff]/10 font-medium text-[#0066ff] ring-1 ring-[#00b4ff]/25 dark:nav-active"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-[#00b4ff]/8 dark:hover:text-white",
          ].join(" ")}
        >
          <span
            className={[
              "transition-colors [&>svg]:shrink-0",
              parentActive
                ? "text-[#0088ff] dark:nav-active-icon"
                : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300",
            ].join(" ")}
          >
            <IconRobot />
          </span>
          <span className="min-w-0 flex-1">AI Workers</span>
        </Link>
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
          aria-label={expanded ? "Collapse AI workers" : "Expand AI workers"}
          className="flex shrink-0 items-center justify-center rounded-lg px-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-white/[0.07] dark:hover:text-white"
        >
          <span
            className={[
              "inline-flex transition-transform",
              expanded ? "rotate-180" : "rotate-0",
            ].join(" ")}
          >
            <IconChevronDown />
          </span>
        </button>
      </div>

      {expanded ? (
        <ul className="mt-1 ml-3 flex flex-col gap-0.5 border-l border-slate-200 pl-2 dark:border-white/[0.08]">
          {workers.map((w) => {
            const onboarded = onboardedFor(w);
            const active = activePath === `/workers/${w.slug}`;
            return (
              <li key={w.id}>
                <Link
                  href={`/workers/${w.slug}`}
                  onClick={onNavigate}
                  className={[
                    "group flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px] transition-colors",
                    active
                      ? "bg-[#00b4ff]/10 font-medium text-[#0066ff] ring-1 ring-[#00b4ff]/25 dark:nav-active"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-[#00b4ff]/8 dark:hover:text-white",
                  ].join(" ")}
                  title={
                    onboarded
                      ? `${w.name} — ready to chat`
                      : `${w.name} — needs onboarding`
                  }
                >
                  <span className="text-base leading-none" aria-hidden>
                    {w.emoji}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{w.name}</span>
                  <span
                    className={[
                      "inline-block h-1.5 w-1.5 shrink-0 rounded-full",
                      onboarded
                        ? "bg-emerald-500 shadow-[0_0_0_2px_rgba(16,185,129,0.18)]"
                        : "bg-amber-500 shadow-[0_0_0_2px_rgba(245,158,11,0.18)]",
                    ].join(" ")}
                    aria-label={onboarded ? "Onboarded" : "Needs onboarding"}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

function NavItem({
  href,
  active,
  children,
  icon,
  badge,
  onNavigate,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
  badge?: string;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={[
        "group flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
        active
          ? "bg-[#00b4ff]/10 font-medium text-[#0066ff] ring-1 ring-[#00b4ff]/25 dark:nav-active"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-[#00b4ff]/8 dark:hover:text-white",
      ].join(" ")}
    >
      <span
        className={[
          "transition-colors [&>svg]:shrink-0",
          active
            ? "text-[#0088ff] dark:nav-active-icon"
            : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300",
        ].join(" ")}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">{children}</span>
      {badge ? (
        <span className="shrink-0 rounded-md bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
          {badge}
        </span>
      ) : null}
    </Link>
  );
}

function nameInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0] ?? ""}${parts[parts.length - 1]![0] ?? ""}`.toUpperCase();
  }
  return fullName.slice(0, 2).toUpperCase();
}
