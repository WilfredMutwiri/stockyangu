import { z } from "zod";

const EnvSchema = z.object({
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  FRONTED_BASE_URL: z.string().url(),
});

export type EnvValues = z.infer<typeof EnvSchema>;
export { EnvSchema };
