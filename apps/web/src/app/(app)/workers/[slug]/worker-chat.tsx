"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  IconArrowLeft,
  IconCheck,
  IconGear,
  IconMic,
  IconMicOff,
  IconPaperclip,
  IconSend,
} from "@/components/app-icons";
import { WorkerAvatar } from "@/components/worker-avatar";
import { useSpeechInput } from "@/hooks/use-speech-input";
import {
  brandChip,
  brandFocus,
  brandCtaRound,
  brandGradient,
  chatAgentBubble,
  chatBackgroundWash,
} from "@/lib/brand";
import {
  advanceOnboarding,
  getInitialOnboardingMessages,
  getStepConfig,
  isQuestionStep,
  ONBOARDING_STEP_ORDER,
  type OnboardingStep,
  type StepConfig,
} from "@/lib/worker-chat-onboarding";
import {
  getDemoAgentReply,
  getWelcomeBackMessage,
} from "@/lib/worker-chat-replies";
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
// Types & helpers
// ---------------------------------------------------------------------------

type ChatMessage = {
  id: string;
  from: "agent" | "user" | "system";
  text: string;
  time: string;
};

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

/** Slight random pause so replies feel less robotic (demo only). */
const agentReplyDelay = () => 520 + Math.floor(Math.random() * 480);

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

  const handleSpeechTranscript = useCallback((text: string) => {
    setInput((prev) => {
      const merged = prev.trim() ? `${prev.trimEnd()} ${text}` : text;
      return merged.trim();
    });
  }, []);

  const { status: speechStatus, toggleListening } =
    useSpeechInput(handleSpeechTranscript);

  // Read the real onboarding status (incl. localStorage override) on mount.
  useEffect(() => {
    setOnboardedState(isOnboarded(worker));
  }, [worker]);

  // Seed the conversation when we know which mode we're in.
  useEffect(() => {
    if (messages.length > 0) return;

    if (onboarded) {
      setMessages([makeMsg("agent", getWelcomeBackMessage(worker))]);
    } else {
      const initial = getInitialOnboardingMessages(worker);
      setMessages(initial.messages.map((text) => makeMsg("agent", text)));
      setStep(initial.step);
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

    if (!onboarded && isQuestionStep(step)) {
      const currentStep = step;
      const answer = text;
      setAnswers((a) => ({ ...a, [currentStep]: answer }));

      setAgentTyping(true);
      window.setTimeout(() => {
        const result = advanceOnboarding(currentStep, answer, worker);
        const followUp: ChatMessage[] = [
          makeMsg("agent", result.ack),
          ...result.agentLines.map((line) => makeMsg("agent", line)),
        ];

        if (result.complete) {
          setOnboarded(worker.slug, true);
          setOnboardedState(true);
        }

        setMessages((prev) => [...prev, ...followUp]);
        setStep(result.nextStep);
        setAgentTyping(false);
      }, agentReplyDelay());
      return;
    }

    // Onboarded — free chat. Natural demo replies until vLLM is wired.
    setAgentTyping(true);
    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        makeMsg("agent", getDemoAgentReply(text, worker)),
      ]);
      setAgentTyping(false);
    }, agentReplyDelay());
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

  const activeStep = useMemo((): StepConfig | null => {
    if (onboarded) return null;
    if (!isQuestionStep(step)) return null;
    return getStepConfig(step);
  }, [step, onboarded]);

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------

  return (
    // Pull the chat out of the parent <main> padding so it can fill the area.
    <div className="-m-4 flex h-[calc(100dvh-3.5rem)] flex-col lg:-m-8 lg:h-[calc(100dvh-4rem)]">
      <div className="app-panel-solid mx-auto flex h-full w-full max-w-3xl flex-col overflow-hidden border-x border-slate-200 bg-slate-50 lg:my-6 lg:h-[calc(100%-3rem)] lg:rounded-2xl lg:border lg:shadow-[0_0_40px_rgba(0,180,255,0.12)] dark:lg:border-[#00b4ff]/20">
        {/* ----- Header ----- */}
        <header className="app-panel flex shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 py-3">
          <Link
            href="/workers"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
            aria-label="Back to workers"
          >
            <IconArrowLeft />
          </Link>
          <WorkerAvatar worker={worker} size="md" />
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
                ? "Online · usually replies in a few seconds"
                : "Getting to know you · quick setup"}
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
          className="relative flex-1 overflow-y-auto bg-[#f0f2f5] px-3 py-4 dark:bg-transparent"
          style={{ backgroundImage: chatBackgroundWash }}
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
                <WorkerAvatar worker={worker} />
                <div
                  className={[
                    "rounded-2xl rounded-bl-md bg-white px-3 py-2 text-sm shadow-sm",
                    chatAgentBubble,
                  ].join(" ")}
                >
                  <TypingDots />
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* ----- Quick replies + input ----- */}
        <div className="app-panel shrink-0 border-t border-slate-200 bg-white px-3 py-3">
          {activeStep ? (
            <div className="mb-2 flex flex-wrap gap-1.5">
              {activeStep.chips?.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleChipClick(chip)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition ${brandChip}`}
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
            <button
              type="button"
              onClick={toggleListening}
              disabled={speechStatus === "unsupported"}
              title={
                speechStatus === "unsupported"
                  ? "Voice input is not supported in this browser"
                  : speechStatus === "denied"
                    ? "Microphone permission denied"
                    : speechStatus === "listening"
                      ? "Stop listening"
                      : "Speak your message"
              }
              className={[
                "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition",
                speechStatus === "listening"
                  ? "bg-[#00b4ff]/20 text-[#00b4ff] ring-2 ring-[#00b4ff]/50 animate-pulse"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-white/[0.06] dark:hover:text-[#7dd3fc]",
                speechStatus === "unsupported" ? "cursor-not-allowed opacity-40" : "",
              ].join(" ")}
              aria-label={
                speechStatus === "listening" ? "Stop voice input" : "Start voice input"
              }
              aria-pressed={speechStatus === "listening"}
            >
              {speechStatus === "denied" || speechStatus === "unsupported" ? (
                <IconMicOff />
              ) : (
                <IconMic />
              )}
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
              className={`max-h-40 min-h-[40px] flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-white/[0.08] ${brandFocus}`}
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className={`${brandCtaRound} h-10 w-10 shrink-0 rounded-full`}
              aria-label="Send"
            >
              <IconSend />
            </button>
          </form>

          {speechStatus === "listening" ? (
            <p className="mt-2 px-1 text-[11px] font-medium text-[#00b4ff]">
              Listening… speak clearly, then tap the mic again or press Send.
            </p>
          ) : null}
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
          <WorkerAvatar worker={worker} />
        )
      ) : null}

      <div
        className={[
          "relative max-w-[78%] rounded-2xl px-3 py-2 text-sm leading-relaxed shadow-sm",
          isAgent
            ? `bg-white text-slate-800 dark:text-slate-100 ${chatAgentBubble}`
            : `${brandGradient} text-white`,
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

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-0.5">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#00b4ff]/70 [animation-delay:-0.3s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#00b4ff]/70 [animation-delay:-0.15s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#00b4ff]/70" />
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
  const stepIndex = ONBOARDING_STEP_ORDER.indexOf(step);
  const total = ONBOARDING_STEP_ORDER.length - 2; // exclude "welcome" and "done"
  const current = Math.max(0, Math.min(total, stepIndex)); // 0..total
  const pct = Math.round((current / total) * 100);
  return (
    <div className="mb-2 flex justify-center">
      <div className="flex w-full max-w-md items-center gap-3 rounded-full bg-white/80 px-3 py-1.5 text-[11px] text-slate-600 shadow-sm backdrop-blur dark:bg-white/[0.06] dark:text-slate-300">
        <span className="font-semibold">Onboarding</span>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-white/[0.08]">
          <div
            className={`h-full rounded-full transition-[width] duration-300 ${brandGradient}`}
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
