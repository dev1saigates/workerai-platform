export type ClawChannelStatus = "disconnected" | "connected";

export type ClawChannel = {
  id: string;
  icon: string;
  iconBg: string;
  name: string;
  hint: string;
  status: ClawChannelStatus;
};

export type ClawIngestItem = {
  id: string;
  channel: string;
  source: string;
  subject: string;
  snippet: string;
  tag: string;
  sentiment: "positive" | "neutral" | "negative";
  ago: string;
};

export const CLAW_STATS = {
  today: 0,
  unprocessed: 3,
  channels: 3,
  total: 5,
} as const;

export const CLAW_WEBHOOK_URL =
  "https://workerai.pages.dev/api/claw/ingest/ws_demo_001";

export const CLAW_CHANNELS: ClawChannel[] = [
  {
    id: "email",
    icon: "✉️",
    iconBg: "bg-blue-500/15 text-blue-600 dark:text-blue-300",
    name: "Email",
    hint: "Connect Gmail / Outlook",
    status: "disconnected",
  },
  {
    id: "web-forms",
    icon: "📝",
    iconBg: "bg-violet-500/15 text-violet-600 dark:text-violet-300",
    name: "Web Forms",
    hint: "Webhook + embed forms",
    status: "connected",
  },
  {
    id: "linkedin",
    icon: "💼",
    iconBg: "bg-sky-500/15 text-sky-600 dark:text-sky-300",
    name: "LinkedIn",
    hint: "Connect LinkedIn",
    status: "disconnected",
  },
  {
    id: "whatsapp",
    icon: "💬",
    iconBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
    name: "WhatsApp",
    hint: "Connect WhatsApp Biz",
    status: "disconnected",
  },
  {
    id: "calendar",
    icon: "📅",
    iconBg: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
    name: "Calendar",
    hint: "Connect Google Calendar",
    status: "disconnected",
  },
  {
    id: "calls",
    icon: "📞",
    iconBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
    name: "Calls",
    hint: "Upload transcripts",
    status: "disconnected",
  },
];

export const CLAW_RECENT_ITEMS: ClawIngestItem[] = [
  {
    id: "i1",
    channel: "Email",
    source: "James Harrison · TechCorp Ltd",
    subject: "Social media quote request",
    snippet: "Hi, I need a quote for social media management for our Q2 campaign…",
    tag: "lead",
    sentiment: "positive",
    ago: "20d ago",
  },
  {
    id: "i2",
    channel: "Web Form",
    source: "Website · Contact page",
    subject: "New enquiry — office fit-out",
    snippet: "Company size 25+, budget range £40k–£60k, preferred start date June…",
    tag: "lead",
    sentiment: "positive",
    ago: "19d ago",
  },
  {
    id: "i3",
    channel: "LinkedIn",
    source: "Maria Chen · GrowthCo",
    subject: "DM — partnership intro",
    snippet: "Would love to explore a co-marketing opportunity for our SaaS launch…",
    tag: "partnership",
    sentiment: "neutral",
    ago: "18d ago",
  },
  {
    id: "i4",
    channel: "WhatsApp",
    source: "+44 7700 900123",
    subject: "Support — invoice copy",
    snippet: "Please resend invoice #1042 for last month, our accounts team needs it…",
    tag: "support",
    sentiment: "neutral",
    ago: "17d ago",
  },
  {
    id: "i5",
    channel: "Calendar",
    source: "Google Calendar",
    subject: "Meeting booked — discovery call",
    snippet: "Prospect booked 30 min slot Tue 14:00 with Sarah Wilson…",
    tag: "meeting",
    sentiment: "positive",
    ago: "16d ago",
  },
];
