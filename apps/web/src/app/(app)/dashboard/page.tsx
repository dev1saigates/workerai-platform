import type { Metadata } from "next";
import { DashboardContent } from "./dashboard-content";

export const metadata: Metadata = {
  title: "Command Centre | WorkerAI",
  description: "WorkerAI Professional — workspace command centre",
};

export default function DashboardPage() {
  return <DashboardContent />;
}
