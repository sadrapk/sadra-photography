import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const connectionString = "postgresql://neondb_owner:npg_vyxKJg4haOR0@ep-dry-cherry-as8yrzgv.c-4.eu-central-1.aws.neon.tech/neondb?sslmode=verify-full";

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

export const db = drizzle(pool, { schema });