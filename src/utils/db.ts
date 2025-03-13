import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

console.log("DB_PASS:", process.env.DB_PASS);  // Check if the password is a string

const client = postgres(process.env.DATABASE_URL || ''); // Use DATABASE_URL

export const db = drizzle(client);
