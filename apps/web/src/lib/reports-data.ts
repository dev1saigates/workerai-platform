export type ReportRange = "7d" | "30d" | "90d";

export type KpiTile = {
  label: string;
  value: string;
  change: string;
  positive: boolean;
};

export type ChartPoint = {
  label: string;
  value: number;
};

export const RANGE_LABELS: Record<ReportRange, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
};

export const REPORT_KPIS: Record<ReportRange, KpiTile[]> = {
  "7d": [
    { label: "Tasks completed", value: "38", change: "+12%", positive: true },
    { label: "Approval rate", value: "94%", change: "+3%", positive: true },
    { label: "Hours saved", value: "14.5h", change: "+8%", positive: true },
    { label: "Avg. review time", value: "4.2m", change: "-18%", positive: true },
  ],
  "30d": [
    { label: "Tasks completed", value: "156", change: "+22%", positive: true },
    { label: "Approval rate", value: "91%", change: "+1%", positive: true },
    { label: "Hours saved", value: "62h", change: "+15%", positive: true },
    { label: "Avg. review time", value: "5.1m", change: "-9%", positive: true },
  ],
  "90d": [
    { label: "Tasks completed", value: "412", change: "+31%", positive: true },
    { label: "Approval rate", value: "89%", change: "-2%", positive: false },
    { label: "Hours saved", value: "178h", change: "+28%", positive: true },
    { label: "Avg. review time", value: "5.8m", change: "-4%", positive: true },
  ],
};

export const TASKS_BY_DAY: Record<ReportRange, ChartPoint[]> = {
  "7d": [
    { label: "Mon", value: 4 },
    { label: "Tue", value: 7 },
    { label: "Wed", value: 5 },
    { label: "Thu", value: 9 },
    { label: "Fri", value: 6 },
    { label: "Sat", value: 2 },
    { label: "Sun", value: 5 },
  ],
  "30d": [
    { label: "W1", value: 28 },
    { label: "W2", value: 35 },
    { label: "W3", value: 42 },
    { label: "W4", value: 51 },
  ],
  "90d": [
    { label: "Jan", value: 98 },
    { label: "Feb", value: 124 },
    { label: "Mar", value: 190 },
  ],
};

export const APPROVAL_SPLIT: Record<ReportRange, ChartPoint[]> = {
  "7d": [
    { label: "Approved", value: 32 },
    { label: "Edited", value: 4 },
    { label: "Rejected", value: 2 },
  ],
  "30d": [
    { label: "Approved", value: 128 },
    { label: "Edited", value: 18 },
    { label: "Rejected", value: 10 },
  ],
  "90d": [
    { label: "Approved", value: 340 },
    { label: "Edited", value: 48 },
    { label: "Rejected", value: 24 },
  ],
};

export const TOP_WORKERS: Record<ReportRange, { name: string; tasks: number; rate: number }[]> = {
  "7d": [
    { name: "Executive Assistant", tasks: 12, rate: 96 },
    { name: "Social Manager", tasks: 9, rate: 92 },
    { name: "Admin Assistant", tasks: 8, rate: 88 },
  ],
  "30d": [
    { name: "Executive Assistant", tasks: 48, rate: 94 },
    { name: "Social Manager", tasks: 36, rate: 90 },
    { name: "Receptionist", tasks: 28, rate: 93 },
  ],
  "90d": [
    { name: "Executive Assistant", tasks: 124, rate: 92 },
    { name: "Social Manager", tasks: 98, rate: 89 },
    { name: "Content Writer", tasks: 72, rate: 91 },
  ],
};
