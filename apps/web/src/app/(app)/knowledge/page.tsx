import type { Metadata } from "next";
import { KnowledgeContent } from "./knowledge-content";

export const metadata: Metadata = { title: "Knowledge Hub | WorkerAI" };

export default function KnowledgePage() {
  return <KnowledgeContent />;
}
