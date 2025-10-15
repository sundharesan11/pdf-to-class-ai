import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/eduagent';

// Create the connection
const client = postgres(connectionString);

// Create the drizzle instance
export const db = drizzle(client, { schema });

export * from './schema.js';
