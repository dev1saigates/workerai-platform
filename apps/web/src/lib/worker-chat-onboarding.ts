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
      `To start — in your own words, what should I mainly help with as your ${w.role.toLowerCase()}? A sentence or two is plenty.`,
    ack: () => "Thanks — that's really helpful. I've got a clear picture now.",
    next: "tone",
  },
  tone: {
    question: () =>
      "How should I sound when I write for you? Pick something close, or type your own.",
    chips: ["Formal", "Friendly", "Casual", "Direct"] as const,
    ack: (a) => `Lovely — I'll keep a ${a.toLowerCase()} tone in mind.`,
    next: "audience",
  },
  audience: {
    question: () =>
      "Who am I usually writing for? Tap an option below or tell me in your own words.",
    chips: ["Clients", "Suppliers", "Internal team", "Mixed"] as const,
    ack: (a) => `Got it — I'll picture ${a.toLowerCase()} when I draft.`,
    next: "constraints",
  },
  constraints: {
    question: () =>
      "Anything you'd rather I never mention, or always avoid? (Totally fine to skip.)",
    skippable: true,
    ack: (a) =>
      a.toLowerCase() === "skip" || !a.trim()
        ? "No worries — I'll stick to sensible, professional defaults."
        : "Understood — I'll keep well clear of that.",
    next: "approval",
  },
  approval: {
    question: () =>
      "Last thing — when is it okay for me to move ahead without checking with you first?",
    chips: [
      "Never (always ask)",
      "Only low-risk tasks",
      "Most tasks",
      "Almost everything",
    ] as const,
    ack: (a) => `Perfect — I'll work to "${a}" unless you tell me otherwise.`,
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
  "That's everything I need for now — thank you. From here on, just message me like you would a colleague. I'll draft things for you, and nothing goes out until you've approved it.";

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
      `Hi — I'm ${worker.name}. Before we get into the day-to-day, I'd love to learn how you like to work. It only takes a minute, and you can skip anything you're not sure about.`,
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
