"use client";

import { useState } from "react";
import { SETTINGS_TABS, type SettingsTab } from "@/lib/settings-data";
import {
  AuditPanel,
  BillingPanel,
  GdprPanel,
  IntegrationsPanel,
  ProfilePanel,
  WorkspacePanel,
} from "./settings-panels";

export function SettingsContent() {
  const [tab, setTab] = useState<SettingsTab>("workspace");

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 lg:flex-row">
      <nav className="flex shrink-0 flex-row gap-1 overflow-x-auto lg:w-48 lg:flex-col lg:gap-0.5">
        {SETTINGS_TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={[
              "whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm font-medium transition",
              tab === item.id
                ? "bg-[#00b4ff]/15 text-[#0088ff] dark:bg-[#00b4ff]/20 dark:text-[#bae6fd]"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/[0.06]",
            ].join(" ")}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="min-w-0 flex-1">
        {tab === "workspace" && <WorkspacePanel />}
        {tab === "profile" && <ProfilePanel />}
        {tab === "integrations" && <IntegrationsPanel />}
        {tab === "gdpr" && <GdprPanel />}
        {tab === "billing" && <BillingPanel />}
        {tab === "audit" && <AuditPanel />}
      </div>
    </div>
  );
}
