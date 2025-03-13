import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import dotenv from 'dotenv';
import 'dotenv/config';

dotenv.config();
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DB_URL,
});

// Initialize Drizzle with the Pool instance
const db = drizzle(process.env.DATABASE_URL!);;

export { db };