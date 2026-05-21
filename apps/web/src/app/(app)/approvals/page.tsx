import type { Metadata } from "next";
import { ApprovalsContent } from "./approvals-content";

export const metadata: Metadata = {
  title: "Approvals Queue | WorkerAI",
  description: "Review and approve AI-generated tasks",
};

export default function ApprovalsPage() {
  return <ApprovalsContent />;
}
