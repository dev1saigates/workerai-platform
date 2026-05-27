import type { Worker } from "@/lib/workers-data";

/**
 * Demo chat replies until vLLM is wired — written to feel human, not robotic.
 */

const pick = <T,>(items: readonly T[]): T =>
  items[Math.floor(Math.random() * items.length)]!;

export function getWelcomeBackMessage(worker: Worker): string {
  const first = worker.name.split(" ")[0] ?? worker.name;
  return pick([
    `Hey ${first} — good to see you again. I'm ${worker.name}. What shall we work on today?`,
    `Hi there. ${worker.name} here — ready when you are. What would you like me to draft?`,
    `Welcome back. It's ${worker.name}. Tell me what you need and I'll get a draft ready for your approval queue.`,
  ]);
}

export function getDemoAgentReply(userMessage: string, worker: Worker): string {
  const text = userMessage.trim().toLowerCase();
  const role = worker.role.toLowerCase();

  if (/^(hi|hello|hey|morning|afternoon|evening)\b/.test(text)) {
    return pick([
      `Hello — ${worker.name} here. What can I help you with today?`,
      `Hi! Lovely to hear from you. What would you like me to take a first pass at?`,
      `Hey — I'm on it. What's on your mind?`,
    ]);
  }

  if (/thank|thanks|cheers/.test(text)) {
    return pick([
      `You're welcome — happy to help anytime.`,
      `Any time. Just ping me when you need another draft.`,
      `Glad that helped. I'm here whenever you need me.`,
    ]);
  }

  if (/email|mail/.test(text)) {
    return pick([
      `Sure — I'll sketch an email in a ${role} tone and put it in your Approval Queue for a quick read.`,
      `On it. I'll draft the email now and flag anything that needs your sign-off before it goes out.`,
      `Got it. Give me a moment — I'll write a clear email draft you can tweak before approving.`,
    ]);
  }

  if (/linkedin|social|post|tweet|instagram/.test(text)) {
    return pick([
      `I'll pull together a social post that fits your brand voice — you'll see it in Approvals shortly.`,
      `Happy to — I'll draft something punchy for social and leave the final word with you.`,
      `Leave it with me. I'll write a post you can approve or edit before anything goes live.`,
    ]);
  }

  if (/blog|article|outline/.test(text)) {
    return pick([
      `I'll map out a blog draft with a clear hook and structure — check Approvals when you're ready.`,
      `On it. I'll start with an outline and a first paragraph you can shape from there.`,
      `Sounds good — I'll write something readable and on-brand, then hand it to you for approval.`,
    ]);
  }

  if (/invoice|payment|finance/.test(text)) {
    return pick([
      `I'll prepare the wording for that — amounts and dates stay for you to confirm in Approvals.`,
      `Understood. I'll draft the finance copy carefully and highlight anything that needs a double-check.`,
      `Got it. I'll keep the tone professional and precise, as you'd expect from finance comms.`,
    ]);
  }

  return pick([
    `That makes sense — I'll draft something as your ${role} and add it to your Approval Queue. You can tweak it before anything goes out.`,
    `Leave it with me. I'll put together a first version shortly; you'll get a notification when it's ready to review.`,
    `I'm on it. I'll write a draft that matches how we've set me up, and you can approve or edit it in Approvals.`,
    `Sounds good. I'll take a pass at that now — nothing sends until you've signed it off.`,
  ]);
}
