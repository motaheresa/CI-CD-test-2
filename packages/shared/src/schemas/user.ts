// turbo cache test
import { z } from "zod";

export const createUserSchema = z.object({
  email: z.email().max(191),
  name: z.string().min(1).max(50).optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const userSchema = z.object({
  id: z.number().int(),
  email: z.email(),
  name: z.string().max(10),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type UserResponse = z.infer<typeof userSchema>;
