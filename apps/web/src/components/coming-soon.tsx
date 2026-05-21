import Link from "next/link";

type ComingSoonProps = {
  title: string;
  description?: string;
};

export function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <div className="mx-auto max-w-lg rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-white/15 dark:bg-[#0e131d]">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h2>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        {description ?? "This screen is on the roadmap. Match your UI reference when you build it."}
      </p>
      <Link
        href="/dashboard"
        className="mt-6 inline-block text-sm font-medium text-violet-600 hover:text-violet-500 dark:text-violet-400"
      >
        ← Back to Command Centre
      </Link>
    </div>
  );
}
