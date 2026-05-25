export type TeamRole = "owner" | "manager" | "member";

export type TeamMember = {
  id: string;
  initials: string;
  name: string;
  email: string;
  role: TeamRole;
  lastSeen: string;
  canRemove: boolean;
};

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "m1",
    initials: "SW",
    name: "Sarah Wilson",
    email: "sarah@innovatedigital.co.uk",
    role: "owner",
    lastSeen: "Last seen 5h ago",
    canRemove: false,
  },
  {
    id: "m2",
    initials: "MB",
    name: "Marcus Brown",
    email: "marcus@innovatedigital.co.uk",
    role: "manager",
    lastSeen: "Never logged in",
    canRemove: true,
  },
];
