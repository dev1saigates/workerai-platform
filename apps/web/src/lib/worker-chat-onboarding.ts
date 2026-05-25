import type { Worker } from "@/lib/workers-data";

/**
 * Onboarding state machine for worker chat (UI-only until API exists).
 * Kept in its own file so TypeScript can narrow `next` steps safely at build time.
 */

export type OnboardingStep =
  | "welcome"
  | "purpose"
  | "tone"
  | "audience"
  | "constraints"
  | "approval"
  | "done";

/** Steps that have a row in ONBOARDING (excludes welcome + done). */
export type OnboardingQuestionStep = Exclude<OnboardingStep, "welcome" | "done">;

export type StepConfig = {
  question: (worker: Worker) => string;
  chips?: readonly string[];
  skippable?: boolean;
  ack: (answer: string) => string;
  /** Only question steps or terminal "done" — never "welcome". */
  next: OnboardingQuestionStep | "done";
};

const ONBOARDING: Record<OnboardingQuestionStep, StepConfig> = {
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

export const ONBOARDING_STEP_ORDER: readonly OnboardingStep[] = [
  "welcome",
  "purpose",
  "tone",
  "audience",
  "constraints",
  "approval",
  "done",
] as const;

const ONBOARDING_COMPLETE_MESSAGE =
  "Brilliant — I have everything I need. From now on, just message me normally and I'll draft something for your approval.";

export function isQuestionStep(
  step: OnboardingStep,
): step is OnboardingQuestionStep {
  return step !== "welcome" && step !== "done";
}

export function getStepConfig(
  step: OnboardingQuestionStep,
): StepConfig {
  return ONBOARDING[step];
}

export function getInitialOnboardingMessages(worker: Worker): {
  messages: string[];
  step: OnboardingQuestionStep;
} {
  return {
    messages: [
      `Hi! I'm ${worker.name}. Before I get to work, I'd like to learn a few things about how you want me to help. It'll only take a minute.`,
      ONBOARDING.purpose.question(worker),
    ],
    step: "purpose",
  };
}

export type OnboardingAdvanceResult = {
  ack: string;
  /** Extra agent lines after the ack (next question or completion text). */
  agentLines: string[];
  nextStep: OnboardingStep;
  complete: boolean;
};

/**
 * After the user answers a question step, compute ack + what the agent says next.
 * All ONBOARDING indexing happens here so callers never use a loose `nextStep` key.
 */
export function advanceOnboarding(
  step: OnboardingQuestionStep,
  answer: string,
  worker: Worker,
): OnboardingAdvanceResult {
  const cfg = ONBOARDING[step];
  const ack = cfg.ack(answer);

  if (cfg.next === "done") {
    return {
      ack,
      agentLines: [ONBOARDING_COMPLETE_MESSAGE],
      nextStep: "done",
      complete: true,
    };
  }

  const nextCfg = ONBOARDING[cfg.next];
  return {
    ack,
    agentLines: [nextCfg.question(worker)],
    nextStep: cfg.next,
    complete: false,
  };
}
