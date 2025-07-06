import { drizzle } from 'drizzle-orm/d1';
import { usersTable } from '../db/schema';
import bcrypt from 'bcryptjs';
import { signJWT } from '../utils/jwt';
import env from '../../.env.json';
import { Context } from 'hono';
import { eq } from 'drizzle-orm';

export const getAllUsers = async (c: Context) => {
    const db = drizzle(c.env.DB);
    const users = await db.select().from(usersTable).all();
    return c.json(users);
};

export const getUserById = async (c: Context) => {
    const db = drizzle(c.env.DB);
    const id = parseInt(c.req.param('id'));
    const user = await db.select().from(usersTable).where(eq(usersTable.id, id)).get();
    if (!user) return c.json({ error: 'User not found' }, 404);
    return c.json(user);
};

export const signupUser = async (c: Context) => {
    const db = drizzle(c.env.DB);
    const { username, password, ...rest } = await c.req.json();

    const existing = await db.select().from(usersTable).where(eq(usersTable.username, username)).get();
    if (existing) return c.json({ error: 'Username already exists' }, 409);

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db
        .insert(usersTable)
        .values({ username, password: hashedPassword, ...rest })
        .returning()
        .get();

    const token = signJWT({ id: user.id, username: user.username }, c.env.jwtSecret);
    return c.json({ id: user.id, username: user.username, token }, 201);
};

export const loginUser = async (c: Context) => {
    const db = drizzle(c.env.DB);
    const { username, password } = await c.req.json();

    const user = await db.select().from(usersTable).where(eq(usersTable.username, username)).get();
    if (!user) return c.json({ error: 'Invalid credentials' }, 401);

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return c.json({ error: 'Invalid credentials' }, 401);

    const token = signJWT({ id: user.id, username: user.username }, c.env.jwtSecret);
    return c.json({ id: user.id, username: user.username, token });
};

export const updateUser = async (c: Context) => {
    const db = drizzle(c.env.DB);
    const id = parseInt(c.req.param('id'));
    const data = await c.req.json();

    const updated = await db.update(usersTable).set(data).where(eq(usersTable.id, id)).returning().get();
    if (!updated) return c.json({ error: 'User not found' }, 404);
    return c.json(updated);
};

export const deleteUser = async (c: Context) => {
    const db = drizzle(c.env.DB);
    const id = parseInt(c.req.param('id'));
    const deleted = await db.delete(usersTable).where(eq(usersTable.id, id)).returning().get();
    if (!deleted) return c.json({ error: 'User not found' }, 404);
    return c.json(deleted);
};
