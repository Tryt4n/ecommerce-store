import { z } from "zod";

const envVariables = z.object({
  DATABASE_URL: z.string().min(1),
  ADMIN_USERNAME: z.string().min(1),
  HASHED_ADMIN_PASSWORD: z.string().min(1),
  NEXT_PUBLIC_STRIPE_PUBLIC_KEY: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().min(1),
  NEXT_PUBLIC_SERVER_URL: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  RESEND_FROM_EMAIL: z.string().min(1),
});

envVariables.parse(process.env);

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}
