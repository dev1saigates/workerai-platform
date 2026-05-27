import { WorkerPortrait } from "@/components/worker-portrait";
import type { Worker } from "@/lib/workers-data";

type Size = "sm" | "md" | "lg";

const sizeClasses: Record<Size, string> = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-11 w-11",
};

/**
 * Worker face avatar with electric-blue ring (dark theme accent).
 */
export function WorkerAvatar({
  worker,
  size = "sm",
  className = "",
}: {
  worker: Worker;
  size?: Size;
  className?: string;
}) {
  return (
    <div
      className={[
        "relative shrink-0 overflow-hidden rounded-full ring-2 ring-[#00b4ff]/50 ring-offset-1 ring-offset-white dark:ring-[#00b4ff]/60 dark:ring-offset-[#0a1018]",
        "shadow-[0_0_12px_rgba(0,180,255,0.25)]",
        sizeClasses[size],
        className,
      ].join(" ")}
      aria-hidden
    >
      <WorkerPortrait slug={worker.slug} className="h-full w-full object-cover" />
    </div>
  );
}
