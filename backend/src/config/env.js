import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({ path: ['.env.local', '.env'], quiet: true });

const runtimeEnvironment = process.env.NODE_ENV || (process.env.VERCEL ? 'production' : 'development');
const isProduction = runtimeEnvironment === 'production';
const input = {
  ...process.env,
  NODE_ENV: runtimeEnvironment,
  MONGODB_URI: process.env.MONGODB_URI || (isProduction ? undefined : 'mongodb://127.0.0.1:27017/project_management'),
  JWT_SECRET: process.env.JWT_SECRET || (isProduction ? undefined : 'development-secret-change-before-production'),
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || (isProduction ? undefined : 'http://localhost:5173')
};

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  MONGODB_URI: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('1h'),
  JWT_ISSUER: z.string().default('project-management-api'),
  CLIENT_ORIGIN: z.string().url(),
  DNS_SERVERS: z.string().optional(),
  REDIS_URL: z.string().url().optional()
});

const result = schema.safeParse(input);

if (!result.success) {
  throw new Error(`Invalid environment configuration: ${JSON.stringify(result.error.flatten().fieldErrors)}`);
}

export const env = result.data;
