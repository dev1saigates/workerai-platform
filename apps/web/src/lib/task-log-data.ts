export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "pending" | "approved" | "rejected" | "auto_executed";
export type TaskFilter = "all" | TaskStatus;

export type TaskLogEntry = {
  id: string;
  icon: string;
  title: string;
  worker: string;
  type: string;
  ago: string;
  priority: TaskPriority;
  status: TaskStatus;
};

export const TASK_LOG_ENTRIES: TaskLogEntry[] = [
  {
    id: "t1",
    icon: "🎯",
    title: "Email reply to TechCorp inquiry",
    worker: "Executive Assistant",
    type: "email draft",
    ago: "20d ago",
    priority: "medium",
    status: "pending",
  },
  {
    id: "t2",
    icon: "📄",
    title: "LinkedIn post — Q2 expansion announcement",
    worker: "Social Manager",
    type: "social post",
    ago: "20d ago",
    priority: "medium",
    status: "pending",
  },
  {
    id: "t3",
    icon: "🧾",
    title: "Send 3 overdue invoices (total £8,750)",
    worker: "Admin Assistant",
    type: "invoice",
    ago: "19d ago",
    priority: "high",
    status: "pending",
  },
  {
    id: "t4",
    icon: "📞",
    title: "New lead qualified: TechCorp Ltd",
    worker: "Receptionist",
    type: "lead qualify",
    ago: "18d ago",
    priority: "low",
    status: "pending",
  },
  {
    id: "t5",
    icon: "✍️",
    title: "Blog draft — sustainability report summary",
    worker: "Content Writer",
    type: "blog draft",
    ago: "17d ago",
    priority: "low",
    status: "pending",
  },
  {
    id: "t6",
    icon: "📋",
    title: "Follow-up call script — Acme Corp renewal",
    worker: "Sales Assistant",
    type: "call script",
    ago: "16d ago",
    priority: "medium",
    status: "pending",
  },
];

export const FILTER_LABELS: Record<TaskFilter, string> = {
  all: "All",
  pending: "pending",
  approved: "approved",
  rejected: "rejected",
  auto_executed: "auto executed",
};
