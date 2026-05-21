import type { Metadata } from "next";
import { WorkersContent } from "./workers-content";

export const metadata: Metadata = {
  title: "AI Workers | WorkerAI",
  description: "Manage AI worker personas in your workspace",
};

export default function WorkersPage() {
  return <WorkersContent />;
}