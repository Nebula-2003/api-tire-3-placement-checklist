import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import type { Context } from "hono";
import { usersTable } from "../db/schema";
import { makeResponse, signJWT } from "../utils/util";



export const getAllUsers = async (c: Context) => {
    const db = drizzle(c.env.DB);
    const users = await db.select().from(usersTable).all();
    // Example meta, you can add pagination logic
    const meta = { total: users.length };
    return c.json(makeResponse({
        success: true,
        message: "Users fetched successfully",
        data: users,
        error: null,
        meta,
    }));
};

export const getUserById = async (c: Context) => {
    const db = drizzle(c.env.DB);
    const id = parseInt(c.req.param("id"));
    const user = await db.select().from(usersTable).where(eq(usersTable.id, id)).get();
    if (!user) return c.json(makeResponse({
        success: false,
        message: "User not found",
        data: null,
        error: { code: "NOT_FOUND" },
    }), 404);
    return c.json(makeResponse({
        success: true,
        message: "User fetched successfully",
        data: user,
        error: null,
    }));
};

export const signupUser = async (c: Context) => {
    const db = drizzle(c.env.DB);
    const { username, password, ...rest } = await c.req.json();

    const existing = await db.select().from(usersTable).where(eq(usersTable.username, username)).get();
    if (existing) return c.json(makeResponse({
        success: false,
        message: "Username already exists",
        data: null,
        error: { code: "USERNAME_EXISTS" },
    }), 409);

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db
        .insert(usersTable)
        .values({ username, password: hashedPassword, ...rest })
        .returning()
        .get();

    const token = signJWT({ id: user.id, username: user.username }, c.env.jwtSecret);
    return c.json(makeResponse({
        success: true,
        message: "User created successfully",
        data: { id: user.id, username: user.username, token },
        error: null,
    }), 201);
};

export const loginUser = async (c: Context) => {
    const db = drizzle(c.env.DB);
    const { username, password } = await c.req.json();

    const user = await db.select().from(usersTable).where(eq(usersTable.username, username)).get();
    if (!user) return c.json(makeResponse({
        success: false,
        message: "Invalid credentials",
        data: null,
        error: { code: "INVALID_CREDENTIALS" },
    }), 401);

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return c.json(makeResponse({
        success: false,
        message: "Invalid credentials",
        data: null,
        error: { code: "INVALID_CREDENTIALS" },
    }), 401);

    const token = signJWT({ id: user.id, username: user.username }, c.env.jwtSecret);
    return c.json(makeResponse({
        success: true,
        message: "Login successful",
        data: { id: user.id, username: user.username, token },
        error: null,
    }));
};

export const updateUser = async (c: Context) => {
    const db = drizzle(c.env.DB);
    const id = parseInt(c.req.param("id"));
    const data = await c.req.json();

    const updated = await db.update(usersTable).set(data).where(eq(usersTable.id, id)).returning().get();
    if (!updated) return c.json(makeResponse({
        success: false,
        message: "User not found",
        data: null,
        error: { code: "NOT_FOUND" },
    }), 404);
    return c.json(makeResponse({
        success: true,
        message: "User updated successfully",
        data: updated,
        error: null,
    }));
};

export const deleteUser = async (c: Context) => {
    const db = drizzle(c.env.DB);
    const id = parseInt(c.req.param("id"));
    const deleted = await db.delete(usersTable).where(eq(usersTable.id, id)).returning().get();
    if (!deleted) return c.json(makeResponse({
        success: false,
        message: "User not found",
        data: null,
        error: { code: "NOT_FOUND" },
    }), 404);
    return c.json(makeResponse({
        success: true,
        message: "User deleted successfully",
        data: deleted,
        error: null,
    }));
};
