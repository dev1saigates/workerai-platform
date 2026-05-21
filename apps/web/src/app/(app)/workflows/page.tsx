import type { Metadata } from "next";
import { WorkflowsContent } from "./workflows-content";

export const metadata: Metadata = {
  title: "Workflows | WorkerAI",
  description: "Automate multi-step processes across your AI workers",
};

export default function WorkflowsPage() {
  return <WorkflowsContent />;
}
