import { z } from "zod";

export const workerSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  name: z.string(),
  role: z.string(),
  tone: z.string(),
  description: z.string(),
  emoji: z.string(),
  systemPrompt: z.string(),
  active: z.boolean(),
  onboarded: z.boolean(),
});

export const createWorkerBodySchema = z.object({
  name: z.string().min(1).max(100).trim(),
  role: z.string().min(1).max(100).trim(),
  tone: z.string().max(100).trim().optional(),
  description: z.string().max(2000).trim().optional(),
  emoji: z.string().max(8).optional(),
  systemPrompt: z.string().max(8000).trim().optional(),
});

export const updateWorkerBodySchema = createWorkerBodySchema
  .partial()
  .extend({
    active: z.boolean().optional(),
    onboarded: z.boolean().optional(),
  });

export type Worker = z.infer<typeof workerSchema>;
export type CreateWorkerBody = z.infer<typeof createWorkerBodySchema>;
export type UpdateWorkerBody = z.infer<typeof updateWorkerBodySchema>;
