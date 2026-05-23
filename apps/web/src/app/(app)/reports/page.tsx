import type { Metadata } from "next";
import { ReportsContent } from "./reports-content";

export const metadata: Metadata = { title: "Reports | WorkerAI" };

export default function ReportsPage() {
  return <ReportsContent />;
}
