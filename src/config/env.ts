import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  DB_HOST: z.string().default('127.0.0.1'),
  DB_PORT: z.coerce.number().default(3306),
  DB_USER: z.string().default('root'),
  DB_PASSWORD: z.string().default(''),
  DB_NAME: z.string().default('honocorp'),
  CORS_ORIGIN: z.string().default('*'),
});

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('❌ Invalid environment variables:', result.error.flatten().fieldErrors);
    throw new Error('Invalid environment configuration');
  }
  return result.data;
};

export const env = parseEnv();
export type Env = z.infer<typeof envSchema>;
