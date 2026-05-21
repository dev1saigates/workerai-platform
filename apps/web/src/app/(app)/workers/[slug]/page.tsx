import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findWorker, WORKERS } from "@/lib/workers-data";
import { WorkerChat } from "./worker-chat";

/**
 * Dynamic chat page for a single AI worker.
 *
 * Next.js 16 passes `params` as a Promise — same pattern as the App Router
 * docs. We await it to get the `slug`, then look up the worker.
 *
 * PHP analogy: think of `[slug]` as `?slug=` in the URL — Next.js gives it
 * to us already typed, no $_GET parsing needed.
 */

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return WORKERS.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const worker = findWorker(slug);
  return {
    title: worker ? `Chat — ${worker.name} | WorkerAI` : "Worker | WorkerAI",
    description: worker?.description,
  };
}

export default async function WorkerChatPage({ params }: PageProps) {
  const { slug } = await params;
  const worker = findWorker(slug);
  if (!worker) notFound();
  return <WorkerChat worker={worker} />;
}
