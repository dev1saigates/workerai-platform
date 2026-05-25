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

export const PROFILE_DEFAULTS = {
  initials: "SW",
  fullName: "Sarah Wilson",
  email: "sarah@innovatedigital.co.uk",
  role: "Owner",
};

export type IntegrationItem = {
  id: string;
  name: string;
  description: string;
  emoji: string;
  status: "connected" | "not_connected";
  category: "email" | "calendar" | "social" | "crm" | "finance" | "automation";
};

/** UK/EU-approved services only (per project data residency list). */
export const INTEGRATIONS: IntegrationItem[] = [
  {
    id: "gmail",
    name: "Gmail",
    description: "Inbound email & draft replies",
    emoji: "📧",
    status: "not_connected",
    category: "email",
  },
  {
    id: "outlook",
    name: "Microsoft Outlook",
    description: "Office 365 mailboxes",
    emoji: "📨",
    status: "not_connected",
    category: "email",
  },
  {
    id: "google-calendar",
    name: "Google Calendar",
    description: "Meeting scheduling & reminders",
    emoji: "📅",
    status: "not_connected",
    category: "calendar",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    description: "Social posts & company page",
    emoji: "💼",
    status: "not_connected",
    category: "social",
  },
  {
    id: "hubspot",
    name: "HubSpot CRM",
    description: "Leads & deal sync",
    emoji: "🎯",
    status: "not_connected",
    category: "crm",
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Billing & invoices (EU entity)",
    emoji: "💳",
    status: "connected",
    category: "finance",
  },
  {
    id: "xero",
    name: "Xero",
    description: "Accounting & invoice data",
    emoji: "📊",
    status: "not_connected",
    category: "finance",
  },
  {
    id: "brevo",
    name: "Brevo",
    description: "EU-hosted transactional email",
    emoji: "✉️",
    status: "not_connected",
    category: "email",
  },
  {
    id: "slack",
    name: "Slack",
    description: "Team notifications & approvals",
    emoji: "💬",
    status: "not_connected",
    category: "automation",
  },
  {
    id: "teams",
    name: "Microsoft Teams",
    description: "Alerts for managers",
    emoji: "👥",
    status: "not_connected",
    category: "automation",
  },
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    description: "Claw ingestion channel",
    emoji: "📱",
    status: "not_connected",
    category: "social",
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "Trigger workflows from 5,000+ apps",
    emoji: "⚡",
    status: "not_connected",
    category: "automation",
  },
];

export const INTEGRATION_CATEGORY_LABELS: Record<IntegrationItem["category"], string> = {
  email: "Email",
  calendar: "Calendar",
  social: "Social & messaging",
  crm: "CRM",
  finance: "Finance",
  automation: "Notifications & automation",
};
