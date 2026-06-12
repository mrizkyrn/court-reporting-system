import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('8000'),

  DATABASE_URL: z.string(),
  DIRECT_URL: z.string(),

  FRONTEND_URL: z.url('Invalid frontend URL'),
});

type EnvironmentVariables = z.infer<typeof envSchema>;

const parseEnvironment = (): EnvironmentVariables => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error('❌ Invalid environment variables:');
    if (error instanceof z.ZodError) {
      error.issues.forEach((issue) => {
        console.error(`  ${issue.path.join('.')}: ${issue.message}`);
      });
    } else {
      console.error('  Unexpected error:', error);
    }
    process.exit(1);
  }
};

const rawEnv = parseEnvironment();

export const env = {
  app: {
    nodeEnv: rawEnv.NODE_ENV,
    port: rawEnv.PORT,
    isDevelopment: rawEnv.NODE_ENV === 'development',
    isProduction: rawEnv.NODE_ENV === 'production',
    isTest: rawEnv.NODE_ENV === 'test',
  },
  database: {
    url: rawEnv.DATABASE_URL,
    directUrl: rawEnv.DIRECT_URL,
  },
  frontend: {
    url: rawEnv.FRONTEND_URL,
  },
} as const;
