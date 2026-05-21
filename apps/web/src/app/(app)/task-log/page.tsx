import type { Metadata } from "next";
import { TaskLogContent } from "./task-log-content";

export const metadata: Metadata = { title: "Task Log | WorkerAI" };

export default function TaskLogPage() {
  return <TaskLogContent />;
}
