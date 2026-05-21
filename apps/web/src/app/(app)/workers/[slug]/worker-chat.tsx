"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  IconArrowLeft,
  IconCheck,
  IconGear,
  IconPaperclip,
  IconSend,
} from "@/components/app-icons";
import {
  isOnboarded,
  setOnboarded,
  type Worker,
} from "@/lib/workers-data";

/**
 * WhatsApp-style chat for a single AI worker.
 *
 * Two modes — toggled by the worker's onboarding status:
 *  1. ONBOARDING  → agent runs a small Q&A so we learn its purpose, tone,
 *                   audience, constraints, and approval level.
 *  2. CHAT        → free conversation. Backend isn't wired yet so the agent
 *                   replies with a polite "demo mode" placeholder.
 *
 * UI-only for now. Real chat will stream from vLLM via SSE in Phase 3.
 *
 * PHP analogy: this whole file is one big "view" that also holds a tiny
 * state machine ($_SESSION-style) in React state.
 */

// ---------------------------------------------------------------------------
// Types & onboarding script
// ---------------------------------------------------------------------------

type ChatMessage = {
  id: string;
  from: "agent" | "user" | "system";
  text: string;
  time: string;
};

type OnboardingStep =
  | "welcome"
  | "purpose"
  | "tone"
  | "audience"
  | "constraints"
  | "approval"
  | "done";

type StepConfig = {
  /** Question shown by the agent. */
  question: (worker: Worker) => string;
  /** Optional quick-reply chips beneath the input. */
  chips?: readonly string[];
  /** Whether the user can skip this question. */
  skippable?: boolean;
  /** What the agent says after the user answers (acknowledgement). */
  ack: (answer: string) => string;
  /** The next step in the flow. */
  next: OnboardingStep;
};

const ONBOARDING: Record<Exclude<OnboardingStep, "welcome" | "done">, StepConfig> = {
  purpose: {
    question: (w) =>
      `First — in one or two sentences, what's the main thing you'd like me to do as your ${w.role.toLowerCase()}?`,
    ack: () => "Got it. That gives me a clear focus.",
    next: "tone",
  },
  tone: {
    question: () =>
      "What tone should I use when I write? Pick one or type your own.",
    chips: ["Formal", "Friendly", "Casual", "Direct"] as const,
    ack: (a) => `Noted — I'll keep things ${a.toLowerCase()}.`,
    next: "audience",
  },
  audience: {
    question: () =>
      "Who is my main audience? Tap a suggestion or type something specific.",
    chips: ["Clients", "Suppliers", "Internal team", "Mixed"] as const,
    ack: (a) => `Understood — writing for ${a.toLowerCase()}.`,
    next: "constraints",
  },
  constraints: {
    question: () =>
      "Anything I should never do, or topics I should stay away from? (You can skip this.)",
    skippable: true,
    ack: (a) =>
      a.toLowerCase() === "skip" || !a.trim()
        ? "No problem, I'll use sensible defaults."
        : "Got it — I'll steer clear of that.",
    next: "approval",
  },
  approval: {
    question: () =>
      "Last one — when should I act without asking you first?",
    chips: [
      "Never (always ask)",
      "Only low-risk tasks",
      "Most tasks",
      "Almost everything",
    ] as const,
    ack: (a) => `Perfect — I'll follow "${a}".`,
    next: "done",
  },
};

const STEP_ORDER: OnboardingStep[] = [
  "welcome",
  "purpose",
  "tone",
  "audience",
  "constraints",
  "approval",
  "done",
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const nowTime = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

const makeMsg = (
  from: ChatMessage["from"],
  text: string,
): ChatMessage => ({ id: newId(), from, text, time: nowTime() });

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function WorkerChat({ worker }: { worker: Worker }) {
  const [onboarded, setOnboardedState] = useState<boolean>(worker.onboarded);
  const [step, setStep] = useState<OnboardingStep>("welcome");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [agentTyping, setAgentTyping] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  // Read the real onboarding status (incl. localStorage override) on mount.
  useEffect(() => {
    setOnboardedState(isOnboarded(worker));
  }, [worker]);

  // Seed the conversation when we know which mode we're in.
  useEffect(() => {
    if (messages.length > 0) return;

    if (onboarded) {
      setMessages([
        makeMsg(
          "agent",
          `Welcome back. I'm ${worker.name}, your ${worker.role.toLowerCase()}. What would you like me to draft today?`,
        ),
      ]);
    } else {
      setMessages([
        makeMsg(
          "agent",
          `Hi! I'm ${worker.name}. Before I get to work, I'd like to learn a few things about how you want me to help. It'll only take a minute.`,
        ),
        makeMsg("agent", ONBOARDING.purpose.question(worker)),
      ]);
      setStep("purpose");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onboarded]);

  // Auto-scroll to the bottom whenever new messages arrive.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, agentTyping]);

  // ------------------------------------------------------------------
  // Handlers
  // ------------------------------------------------------------------

  const sendUserMessage = (raw: string) => {
    const text = raw.trim();
    if (!text) return;

    setMessages((prev) => [...prev, makeMsg("user", text)]);
    setInput("");

    if (!onboarded && step !== "welcome" && step !== "done") {
      const cfg = ONBOARDING[step];
      const answer = text;
      setAnswers((a) => ({ ...a, [step]: answer }));

      // Agent "thinks" then acknowledges + asks the next question.
      setAgentTyping(true);
      window.setTimeout(() => {
        const ack = cfg.ack(answer);
        const nextStep = cfg.next;
        const followUp: ChatMessage[] = [makeMsg("agent", ack)];

        if (nextStep === "done") {
          followUp.push(
            makeMsg(
              "agent",
              `Brilliant — I have everything I need. From now on, just message me normally and I'll draft something for your approval.`,
            ),
          );
          setOnboarded(worker.slug, true);
          setOnboardedState(true);
        } else {
          followUp.push(makeMsg("agent", ONBOARDING[nextStep].question(worker)));
        }

        setMessages((prev) => [...prev, ...followUp]);
        setStep(nextStep);
        setAgentTyping(false);
      }, 650);
      return;
    }

    // Onboarded — free chat. Polite placeholder until vLLM is wired.
    setAgentTyping(true);
    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        makeMsg(
          "agent",
          `I'll draft that for you and pop it in your Approval Queue. (Demo mode — the AI engine is connected once the backend goes live.)`,
        ),
      ]);
      setAgentTyping(false);
    }, 700);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendUserMessage(input);
  };

  const handleChipClick = (chip: string) => {
    sendUserMessage(chip);
  };

  const handleSkip = () => {
    sendUserMessage("Skip");
  };

  const handleResetOnboarding = () => {
    setOnboarded(worker.slug, false);
    setOnboardedState(false);
    setStep("welcome");
    setAnswers({});
    setMessages([]);
  };

  // ------------------------------------------------------------------
  // Current-step quick replies (only during onboarding)
  // ------------------------------------------------------------------

  const activeStep = useMemo(() => {
    if (onboarded) return null;
    if (step === "welcome" || step === "done") return null;
    return ONBOARDING[step];
  }, [step, onboarded]);

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------

  return (
    // Pull the chat out of the parent <main> padding so it can fill the area.
    <div className="-m-4 flex h-[calc(100dvh-3.5rem)] flex-col lg:-m-8 lg:h-[calc(100dvh-4rem)]">
      <div className="mx-auto flex h-full w-full max-w-3xl flex-col overflow-hidden border-x border-slate-200 bg-slate-50 dark:border-white/[0.08] dark:bg-[#070b13] lg:my-6 lg:h-[calc(100%-3rem)] lg:rounded-2xl lg:border lg:shadow-sm">
        {/* ----- Header ----- */}
        <header className="flex shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 dark:border-white/[0.08] dark:bg-[#0a0e16]">
          <Link
            href="/workers"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
            aria-label="Back to workers"
          >
            <IconArrowLeft />
          </Link>
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xl ring-2 ring-white dark:bg-white/[0.06] dark:ring-[#0a0e16]"
            aria-hidden
          >
            {worker.emoji}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
              {worker.name}
            </p>
            <p className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
              <span
                className={[
                  "inline-block h-1.5 w-1.5 rounded-full",
                  onboarded ? "bg-emerald-500" : "bg-amber-500",
                ].join(" ")}
              />
              {onboarded
                ? "Onboarding done · ready to help"
                : "Onboarding needed · let's get started"}
            </p>
          </div>
          {onboarded ? (
            <button
              type="button"
              onClick={handleResetOnboarding}
              className="hidden rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 sm:inline-flex dark:border-white/[0.08] dark:text-slate-300 dark:hover:bg-white/[0.06] dark:hover:text-white"
            >
              Re-run onboarding
            </button>
          ) : null}
          <button
            type="button"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
            aria-label="Worker settings"
          >
            <IconGear />
          </button>
        </header>

        {/* ----- Messages ----- */}
        <div
          ref={scrollerRef}
          className="relative flex-1 overflow-y-auto bg-[#f0f2f5] px-3 py-4 dark:bg-[#0b1018]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 0%, rgba(99,102,241,0.06), transparent 40%), radial-gradient(circle at 80% 100%, rgba(16,185,129,0.05), transparent 40%)",
          }}
        >
          <div className="mx-auto flex max-w-2xl flex-col gap-1.5">
            <DaySeparator label="Today" />
            {!onboarded ? <ProgressPill step={step} /> : null}

            {messages.map((m, i) => {
              const prev = messages[i - 1];
              const isGroupedWithPrev = prev && prev.from === m.from;
              return (
                <Bubble
                  key={m.id}
                  message={m}
                  worker={worker}
                  grouped={isGroupedWithPrev}
                />
              );
            })}

            {agentTyping ? (
              <div className="mt-1 flex items-end gap-2">
                <Avatar worker={worker} />
                <div className="rounded-2xl rounded-bl-md bg-white px-3 py-2 text-sm shadow-sm dark:bg-[#1f2a3a]">
                  <TypingDots />
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* ----- Quick replies + input ----- */}
        <div className="shrink-0 border-t border-slate-200 bg-white px-3 py-3 dark:border-white/[0.08] dark:bg-[#0a0e16]">
          {activeStep ? (
            <div className="mb-2 flex flex-wrap gap-1.5">
              {activeStep.chips?.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleChipClick(chip)}
                  className="rounded-full border border-violet-300 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700 hover:bg-violet-100 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-200 dark:hover:bg-violet-500/20"
                >
                  {chip}
                </button>
              ))}
              {activeStep.skippable ? (
                <button
                  type="button"
                  onClick={handleSkip}
                  className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:border-white/[0.12] dark:bg-transparent dark:text-slate-300 dark:hover:bg-white/[0.06]"
                >
                  Skip
                </button>
              ) : null}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="flex items-end gap-2">
            <button
              type="button"
              className="hidden rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 sm:inline-flex dark:hover:bg-white/[0.06] dark:hover:text-white"
              aria-label="Attach (coming soon)"
              disabled
            >
              <IconPaperclip />
            </button>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendUserMessage(input);
                }
              }}
              rows={1}
              placeholder={
                onboarded
                  ? `Message ${worker.name}…`
                  : "Type your answer…"
              }
              className="max-h-40 min-h-[40px] flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-200 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-white/[0.08] dark:focus:ring-violet-500/30"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#5b6cff] to-[#7c3aed] text-white shadow-lg shadow-[#5b6cff]/30 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
              aria-label="Send"
            >
              <IconSend />
            </button>
          </form>

          {!onboarded ? (
            <p className="mt-2 px-1 text-[11px] text-slate-500 dark:text-slate-500">
              Your answers stay in this workspace and are only used to
              configure {worker.name}.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Small presentational components
// ---------------------------------------------------------------------------

function Bubble({
  message,
  worker,
  grouped,
}: {
  message: ChatMessage;
  worker: Worker;
  grouped: boolean;
}) {
  const isAgent = message.from === "agent";
  const isSystem = message.from === "system";

  if (isSystem) {
    return (
      <div className="my-2 flex justify-center">
        <span className="rounded-full bg-slate-200/70 px-3 py-1 text-[11px] text-slate-600 dark:bg-white/[0.06] dark:text-slate-400">
          {message.text}
        </span>
      </div>
    );
  }

  return (
    <div
      className={[
        "flex items-end gap-2",
        isAgent ? "justify-start" : "justify-end",
        grouped ? "mt-0.5" : "mt-2",
      ].join(" ")}
    >
      {isAgent ? (
        grouped ? (
          <div className="w-8 shrink-0" aria-hidden />
        ) : (
          <Avatar worker={worker} />
        )
      ) : null}

      <div
        className={[
          "relative max-w-[78%] rounded-2xl px-3 py-2 text-sm leading-relaxed shadow-sm",
          isAgent
            ? "bg-white text-slate-800 dark:bg-[#1f2a3a] dark:text-slate-100"
            : "bg-gradient-to-br from-[#5b6cff] to-[#7c3aed] text-white",
          isAgent
            ? grouped
              ? "rounded-bl-2xl"
              : "rounded-bl-md"
            : grouped
              ? "rounded-br-2xl"
              : "rounded-br-md",
        ].join(" ")}
      >
        <p className="whitespace-pre-wrap break-words">{message.text}</p>
        <div
          className={[
            "mt-1 flex items-center justify-end gap-1 text-[10px]",
            isAgent
              ? "text-slate-400 dark:text-slate-500"
              : "text-white/75",
          ].join(" ")}
        >
          <span>{message.time}</span>
          {!isAgent ? (
            <span className="-mr-0.5 inline-flex" aria-label="Delivered">
              <IconCheck />
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Avatar({ worker }: { worker: Worker }) {
  return (
    <div
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-base shadow-sm ring-1 ring-slate-200 dark:bg-white/[0.06] dark:ring-white/[0.08]"
      aria-hidden
    >
      {worker.emoji}
    </div>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-0.5">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
    </span>
  );
}

function DaySeparator({ label }: { label: string }) {
  return (
    <div className="my-2 flex justify-center">
      <span className="rounded-full bg-white px-3 py-1 text-[11px] font-medium text-slate-600 shadow-sm dark:bg-white/[0.06] dark:text-slate-300">
        {label}
      </span>
    </div>
  );
}

function ProgressPill({ step }: { step: OnboardingStep }) {
  const stepIndex = STEP_ORDER.indexOf(step);
  const total = STEP_ORDER.length - 2; // exclude "welcome" and "done"
  const current = Math.max(0, Math.min(total, stepIndex)); // 0..total
  const pct = Math.round((current / total) * 100);
  return (
    <div className="mb-2 flex justify-center">
      <div className="flex w-full max-w-md items-center gap-3 rounded-full bg-white/80 px-3 py-1.5 text-[11px] text-slate-600 shadow-sm backdrop-blur dark:bg-white/[0.06] dark:text-slate-300">
        <span className="font-semibold">Onboarding</span>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-white/[0.08]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#5b6cff] to-[#7c3aed] transition-[width] duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="tabular-nums text-slate-500 dark:text-slate-400">
          {current}/{total}
        </span>
      </div>
    </div>
  );
}
