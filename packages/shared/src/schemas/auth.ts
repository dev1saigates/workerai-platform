import { z } from "zod";

const passwordRule = z
  .string()
  .min(8, "Use at least 8 characters.")
  .regex(/[A-Z]/, "Include at least one uppercase letter.")
  .regex(/[0-9]/, "Include at least one number.");

export const registerBodySchema = z.object({
  fullName: z.string().min(1).max(200).trim(),
  companyName: z.string().min(1).max(200).trim(),
  email: z.string().email().max(320).toLowerCase().trim(),
  password: passwordRule,
});

export const loginBodySchema = z.object({
  email: z.string().email().max(320).toLowerCase().trim(),
  password: z.string().min(1).max(256),
});

export const authUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  fullName: z.string(),
});

export const authWorkspaceSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
});

export const authSessionSchema = z.object({
  token: z.string().min(1),
  user: authUserSchema,
  workspace: authWorkspaceSchema,
});

export type RegisterBody = z.infer<typeof registerBodySchema>;
export type LoginBody = z.infer<typeof loginBodySchema>;
export type AuthSession = z.infer<typeof authSessionSchema>;
