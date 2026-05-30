"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { fetchWorkerBySlug, type UiWorker } from "@/lib/workers-api";
import { WorkerChat } from "./worker-chat";

export function WorkerChatLoader({ slug }: { slug: string }) {
  const [worker, setWorker] = useState<UiWorker | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchWorkerBySlug(slug)
      .then((w) => {
        if (!cancelled) setWorker(w);
      })
      .catch(() => {
        if (!cancelled) setMissing(true);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (missing) notFound();

  if (!worker) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-slate-500">Loading worker…</p>
      </div>
    );
  }

  return <WorkerChat worker={worker} />;
}
