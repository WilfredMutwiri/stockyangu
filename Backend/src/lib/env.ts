import { EnvSchema } from "../validation/env";

export const env = EnvSchema.parse(process.env);
