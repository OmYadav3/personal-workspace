import { config } from '../config/config.js';

import { PrismaClient }  from "../../generated/prisma/client.js";
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg';


const pool = new Pool({
   connectionString: config.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

export { prisma };