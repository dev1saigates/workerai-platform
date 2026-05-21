import type { Metadata } from "next";
import { ClawContent } from "./claw-content";

export const metadata: Metadata = { title: "Claw — Ingestion | WorkerAI" };

export default function ClawPage() {
  return <ClawContent />;
}
