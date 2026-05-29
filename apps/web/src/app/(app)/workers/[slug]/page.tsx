import type { Metadata } from "next";
import { WorkerChatLoader } from "./worker-chat-loader";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const title = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return {
    title: `Chat — ${title} | WorkerAI`,
  };
}

export default async function WorkerChatPage({ params }: PageProps) {
  const { slug } = await params;
  return <WorkerChatLoader slug={slug} />;
}
