import { z } from "zod";

const envVariables = z.object({
  DATABASE_URL: z.string().min(1),
  ADMIN_USERNAME: z.string().min(1),
  HASHED_ADMIN_PASSWORD: z.string().min(1),
});

export const parsedEnv = envVariables.parse(process.env);
