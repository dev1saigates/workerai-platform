export type WorkflowTrigger = "email" | "manual" | "crm";

export type WorkflowTemplate = {
  id: string;
  emoji: string;
  name: string;
  steps: string;
};

export type UserWorkflow = {
  id: string;
  trigger: WorkflowTrigger;
  name: string;
  steps: string;
  runs: number;
  successRate: number;
  createdBy: string;
  status: "active" | "paused";
};

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: "lead-processing",
    emoji: "🎯",
    name: "Lead Processing",
    steps: "Capture → Qualify → Schedule → Follow-up",
  },
  {
    id: "content-marketing",
    emoji: "✍️",
    name: "Content Marketing",
    steps: "Research → Write → Review → Publish",
  },
  {
    id: "customer-onboarding",
    emoji: "⭐",
    name: "Customer Onboarding",
    steps: "Welcome → Setup → Training → Check-in",
  },
];

export const USER_WORKFLOWS: UserWorkflow[] = [
  {
    id: "wf-1",
    trigger: "email",
    name: "Lead Processing",
    steps: "Capture → Qualify → Schedule → Follow-up → CRM entry",
    runs: 234,
    successRate: 96,
    createdBy: "Sarah Wilson",
    status: "active",
  },
  {
    id: "wf-2",
    trigger: "manual",
    name: "Weekly newsletter draft",
    steps: "Outline → Draft → Manager review → Send",
    runs: 48,
    successRate: 91,
    createdBy: "Sarah Wilson",
    status: "paused",
  },
  {
    id: "wf-3",
    trigger: "crm",
    name: "CRM deal stage updates",
    steps: "Detect change → Notify owner → Log activity → Summary email",
    runs: 112,
    successRate: 98,
    createdBy: "Sarah Wilson",
    status: "active",
  },
];

export const TRIGGER_LABELS: Record<WorkflowTrigger, string> = {
  email: "EMAIL",
  manual: "MANUAL",
  crm: "CRM",
};
