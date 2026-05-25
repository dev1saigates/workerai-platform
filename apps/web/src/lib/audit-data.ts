export type AuditEvent = {
  id: string;
  action: string;
  actor: string;
  resource: string;
  ip: string;
  ago: string;
};

export const AUDIT_EVENTS: AuditEvent[] = [
  {
    id: "a1",
    action: "task.approved",
    actor: "Sarah Wilson",
    resource: "task",
    ip: "2409:40c1:…",
    ago: "5h ago",
  },
  {
    id: "a2",
    action: "auth.login",
    actor: "Sarah Wilson",
    resource: "—",
    ip: "217.35.25.158",
    ago: "10d ago",
  },
  {
    id: "a3",
    action: "auth.logout",
    actor: "Sarah Wilson",
    resource: "—",
    ip: "—",
    ago: "11d ago",
  },
  {
    id: "a4",
    action: "worker.updated",
    actor: "Sarah Wilson",
    resource: "worker",
    ip: "217.35.25.158",
    ago: "12d ago",
  },
  {
    id: "a5",
    action: "task.rejected",
    actor: "Marcus Brown",
    resource: "task",
    ip: "192.168.1.42",
    ago: "14d ago",
  },
];
