export type SettingsTab =
  | "workspace"
  | "profile"
  | "integrations"
  | "gdpr"
  | "billing"
  | "audit";

export const SETTINGS_TABS: { id: SettingsTab; label: string }[] = [
  { id: "workspace", label: "Workspace" },
  { id: "profile", label: "Profile" },
  { id: "integrations", label: "Integrations" },
  { id: "gdpr", label: "GDPR & Privacy" },
  { id: "billing", label: "Billing" },
  { id: "audit", label: "Audit Log" },
];

export const WORKSPACE_DEFAULTS = {
  companyName: "Innovate Digital Ltd",
  industry: "",
  website: "",
  workStart: "09:00",
  workEnd: "17:30",
  timezone: "Europe/London",
};
