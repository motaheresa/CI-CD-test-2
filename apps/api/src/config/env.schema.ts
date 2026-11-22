import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  DATABASE_URL: z.url(),
  DATABASE_SSL_CA_PATH: z.string().optional(),
  DATABASE_SSL_VERIFY_HOSTNAME: z.enum(["true", "false"]).default("true"),
});

export type Env = z.infer<typeof envSchema>;
