// ⚠️ LEGAL: Upload API must use UK/EU storage only (e.g. S3 eu-west-2). Never wire US-only buckets.

export type KnowledgeCategory =
  | "all"
  | "brand"
  | "email"
  | "sops"
  | "faq"
  | "training"
  | "legal";

export const KNOWLEDGE_CATEGORIES: { id: KnowledgeCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "brand", label: "Brand" },
  { id: "email", label: "Email Templates" },
  { id: "sops", label: "SOPs" },
  { id: "faq", label: "FAQ" },
  { id: "training", label: "Training" },
  { id: "legal", label: "Legal" },
];

export const KNOWLEDGE_QUICK_SLOTS = [
  { label: "Brand Guidelines", emoji: "📘" },
  { label: "Email Templates", emoji: "✉️" },
  { label: "SOPs", emoji: "📋" },
  { label: "FAQ", emoji: "❓" },
  { label: "AI Training", emoji: "🤖" },
];
