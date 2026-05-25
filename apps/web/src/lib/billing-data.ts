export type BillingPlanId = "starter" | "professional" | "enterprise";

export type BillingPlan = {
  id: BillingPlanId;
  name: string;
  price: string;
  features: string[];
  current?: boolean;
};

export const BILLING_PLANS: BillingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    price: "£199/mo",
    features: [
      "5 users",
      "3 AI workers",
      "1,000 actions/mo",
      "Basic integrations",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    price: "£499/mo",
    current: true,
    features: [
      "15 users",
      "8 AI workers",
      "5,000 actions/mo",
      "All integrations",
      "Custom workflows",
      "Priority support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "£999/mo",
    features: [
      "Unlimited users & workers",
      "25,000 actions/mo",
      "White-label",
      "Custom AI",
      "Dedicated CSM",
    ],
  },
];

export const CURRENT_PLAN_USAGE = {
  name: "Professional Plan",
  limit: "5,000/month",
  used: 1,
  status: "active" as const,
};
