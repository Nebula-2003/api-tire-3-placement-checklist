import { drizzle } from 'drizzle-orm/d1';
import { users } from './schema';

export const getDB = (DB: D1Database) => drizzle(DB);
export { users };
