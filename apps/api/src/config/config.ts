import dotenv from 'dotenv';
dotenv.config({
   path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env'
});

function requireEnv(name: string): string {

  const value = process.env[name];
  if (!value || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const port = Number(process.env.PORT ?? 4000);

if(!Number.isInteger(port) || port <= 0 || port > 65535) {
  throw new Error(`Invalid PORT value: ${process.env.PORT}`);
}


export const config = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',

  PORT: port,
  DATABASE_URL: requireEnv('DATABASE_URL'),

  REFRESH_TOKEN_SECRET: requireEnv('JWT_REFRESH_TOKEN_SECRET'),
  REFRESH_TOKEN_EXPIRATION: requireEnv('JWT_REFRESH_TOKEN_EXPIRATION'),

  ACCESS_TOKEN_SECRET: requireEnv('JWT_ACCESS_TOKEN_SECRET'),
  ACCESS_TOKEN_EXPIRATION: requireEnv('JWT_ACCESS_TOKEN_EXPIRATION'),

  REFRESH_TOKEN_ALGORITHM: requireEnv('JWT_REFRESH_TOKEN_ALGORITHM'),
  ACCESS_TOKEN_ALGORITHM: requireEnv('JWT_ACCESS_TOKEN_ALGORITHM'),

} as const;