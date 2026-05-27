"use client";

import { useState } from "react";
import { AddEntryModal } from "@/components/add-entry-modal";
import { IconUserRemove } from "@/components/app-icons";
import { TEAM_MEMBERS, type TeamMember, type TeamRole } from "@/lib/team-data";

const INVITE_FIELDS = [
  { name: "name", label: "Full name", required: true },
  { name: "email", label: "Work email", type: "email" as const, required: true },
  {
    name: "role",
    label: "Role",
    type: "select" as const,
    required: true,
    options: [
      { value: "manager", label: "Manager" },
      { value: "member", label: "Member" },
    ],
  },
];

export function TeamContent() {
  const [members, setMembers] = useState(TEAM_MEMBERS);
  const [inviteOpen, setInviteOpen] = useState(false);

  function removeMember(id: string) {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Team
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {members.length} {members.length === 1 ? "member" : "members"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setInviteOpen(true)}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg btn-brand px-4 py-2.5 text-sm font-semibold text-white"
        >
          <span className="text-lg leading-none">+</span>
          Invite
        </button>
      </div>

      <AddEntryModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title="Invite team member"
        fields={INVITE_FIELDS}
        submitLabel="Send invite"
        onSubmit={(v) => {
          const name = v.name.trim();
          const parts = name.split(/\s+/);
          const initials = (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? parts[0]?.[1] ?? "");
          setMembers((prev) => [
            ...prev,
            {
              id: `m-${Date.now()}`,
              initials: initials.toUpperCase() || "?",
              name,
              email: v.email.trim(),
              role: (v.role || "member") as TeamRole,
              lastSeen: "Invite sent",
              canRemove: true,
            },
          ]);
        }}
      />

      <ul className="space-y-3">
        {members.map((member) => (
          <MemberRow
            key={member.id}
            member={member}
            onRemove={() => removeMember(member.id)}
          />
        ))}
      </ul>
    </div>
  );
}

function MemberRow({
  member,
  onRemove,
}: {
  member: TeamMember;
  onRemove: () => void;
}) {
  return (
    <li>
      <article className="flex items-center gap-4 rounded-xl border border-slate-200/80 bg-white px-4 py-4 shadow-sm dark:border-white/[0.08] dark:bg-white/[0.03]">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#00b4ff] to-[#0066ff] text-sm font-semibold text-white">
          {member.initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-slate-900 dark:text-white">{member.name}</h3>
            <RoleBadge role={member.role} />
          </div>
          <p className="mt-0.5 truncate text-sm text-slate-500 dark:text-slate-400">
            {member.email}
          </p>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{member.lastSeen}</p>
        </div>
        {member.canRemove ? (
          <button
            type="button"
            onClick={onRemove}
            className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-500 dark:hover:text-rose-400"
            aria-label={`Remove ${member.name}`}
          >
            <IconUserRemove />
          </button>
        ) : null}
      </article>
    </li>
  );
}

function RoleBadge({ role }: { role: TeamRole }) {
  const styles: Record<TeamRole, string> = {
    owner:
      "bg-slate-100 text-slate-700 ring-slate-200/80 dark:bg-white/10 dark:text-slate-200 dark:ring-white/10",
    manager:
      "bg-amber-500/15 text-amber-800 ring-amber-500/30 dark:text-amber-300",
    member:
      "bg-[#00b4ff]/15 text-[#0088ff] ring-[#00b4ff]/25 dark:text-[#7dd3fc]",
  };
  return (
    <span
      className={[
        "inline-flex rounded-md px-2 py-0.5 text-[10px] font-semibold lowercase ring-1 ring-inset",
        styles[role],
      ].join(" ")}
    >
      {role}
    </span>
  );
}
