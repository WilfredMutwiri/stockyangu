import { z } from "zod";

const EnvSchema = z.object({
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
});

export type EnvValues = z.infer<typeof EnvSchema>;
export { EnvSchema };
