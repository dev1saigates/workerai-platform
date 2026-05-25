import type { Metadata } from "next";
import { TeamContent } from "./team-content";

export const metadata: Metadata = { title: "Team | WorkerAI" };

export default function TeamPage() {
  return <TeamContent />;
}
