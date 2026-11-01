import dotenv from 'dotenv';
dotenv.config({
   path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env'
});

export const config = {
  PORT: process.env.PORT || 4000,
  MONGODB_URI: process.env.MONGODB_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
  DATABASE_URL: process.env.DATABASE_URL || '',
};