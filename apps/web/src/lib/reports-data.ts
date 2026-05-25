export type ReportRange = "7d" | "30d" | "90d";

export const RANGE_LABELS: Record<ReportRange, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
};

export type KpiCard = {
  label: string;
  value: string;
  footer: string;
  valueTone?: "default" | "danger";
};

export type DayBar = {
  date: string;
  total: number;
  approved: number;
};

export type WorkerPerformanceRow = {
  id: string;
  emoji: string;
  name: string;
  totalTasks: number;
  inPeriod: number;
  approved: number;
  rate: number;
};

export const WORKER_PERFORMANCE: WorkerPerformanceRow[] = [
  { id: "w1", emoji: "⭐", name: "Customer Success", totalTasks: 156, inPeriod: 0, approved: 145, rate: 93 },
  { id: "w2", emoji: "📋", name: "Admin Assistant", totalTasks: 445, inPeriod: 0, approved: 432, rate: 97 },
  { id: "w3", emoji: "✍️", name: "Blog Writer", totalTasks: 67, inPeriod: 0, approved: 64, rate: 96 },
  { id: "w4", emoji: "📱", name: "Social Manager", totalTasks: 312, inPeriod: 0, approved: 275, rate: 88 },
  { id: "w5", emoji: "📞", name: "Receptionist", totalTasks: 190, inPeriod: 0, approved: 173, rate: 91 },
  { id: "w6", emoji: "🎯", name: "Executive Assistant", totalTasks: 234, inPeriod: 0, approved: 220, rate: 94 },
];

/** Approval rate % by day label (30-day window mock). */
export const APPROVAL_TREND_30D: { label: string; rate: number }[] = [
  { label: "04-28", rate: 0 },
  { label: "05-01", rate: 0 },
  { label: "05-05", rate: 0 },
  { label: "05-09", rate: 0 },
  { label: "05-13", rate: 0 },
  { label: "05-17", rate: 0 },
  { label: "05-21", rate: 0 },
  { label: "05-23", rate: 0 },
];

export const REPORT_DATA: Record<
  ReportRange,
  {
    kpis: KpiCard[];
    days: DayBar[];
    roi: { platform: string; hours: string; value: string; net: string; pct: string };
  }
> = {
  "7d": {
    kpis: [
      { label: "Tasks (7d)", value: "2", footer: "AI-handled", valueTone: "default" },
      { label: "Approval rate", value: "0%", footer: "— Stable", valueTone: "default" },
      { label: "Auto-executed", value: "0", footer: "No human touch", valueTone: "default" },
      { label: "Est. cost savings", value: "£0", footer: "0h saved @ £25/hr", valueTone: "danger" },
    ],
    days: [
      { date: "Mon", total: 0, approved: 0 },
      { date: "Tue", total: 1, approved: 0 },
      { date: "Wed", total: 0, approved: 0 },
      { date: "Thu", total: 1, approved: 0 },
      { date: "Fri", total: 0, approved: 0 },
      { date: "Sat", total: 0, approved: 0 },
      { date: "Sun", total: 0, approved: 0 },
    ],
    roi: {
      platform: "£499/mo",
      hours: "0h",
      value: "£0",
      net: "£-499",
      pct: "-100%",
    },
  },
  "30d": {
    kpis: [
      { label: "Tasks (30d)", value: "6", footer: "AI-handled", valueTone: "default" },
      { label: "Approval rate", value: "0%", footer: "— Stable", valueTone: "default" },
      { label: "Auto-executed", value: "0", footer: "No human touch", valueTone: "default" },
      { label: "Est. cost savings", value: "£0", footer: "0h saved @ £25/hr", valueTone: "danger" },
    ],
    days: [
      { date: "Apr 19", total: 0, approved: 0 },
      { date: "Apr 20", total: 0, approved: 0 },
      { date: "Apr 21", total: 0, approved: 0 },
      { date: "Apr 22", total: 0, approved: 0 },
      { date: "Apr 23", total: 6, approved: 0 },
      { date: "Apr 24", total: 0, approved: 0 },
      { date: "Apr 25", total: 0, approved: 0 },
    ],
    roi: {
      platform: "£499/mo",
      hours: "0h",
      value: "£0",
      net: "£-499",
      pct: "-100%",
    },
  },
  "90d": {
    kpis: [
      { label: "Tasks (90d)", value: "6", footer: "AI-handled", valueTone: "default" },
      { label: "Approval rate", value: "0%", footer: "— Stable", valueTone: "default" },
      { label: "Auto-executed", value: "0", footer: "No human touch", valueTone: "default" },
      { label: "Est. cost savings", value: "£0", footer: "0h saved @ £25/hr", valueTone: "danger" },
    ],
    days: [
      { date: "Mar", total: 0, approved: 0 },
      { date: "Apr", total: 6, approved: 0 },
      { date: "May", total: 0, approved: 0 },
    ],
    roi: {
      platform: "£499/mo",
      hours: "0h",
      value: "£0",
      net: "£-499",
      pct: "-100%",
    },
  },
};
