import bcrypt from "bcryptjs";
import { drizzle } from "drizzle-orm/d1";
import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { sign } from "hono/jwt";
import { nanoid } from "nanoid";
import * as schema from "../db/schema";
import { loginUserSchema, registerUserSchema } from "../schemas/auth.schemas";

export const registerUser = async (c: Context) => {
	const db = drizzle(c.env.DB, { schema });
	const body = await c.req.json();
	const parsedBody = registerUserSchema.safeParse(body);

	if (!parsedBody.success) {
		throw new HTTPException(400, { message: "Invalid request body" });
	}

	const { name, email, password, role } = parsedBody.data;

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	try {
		const newUser = await db
			.insert(schema.users)
			.values({
				id: nanoid(),
				name,
				email,
				password: hashedPassword,
				role,
			})
			.returning();

		return c.json({
			user: {
				id: newUser[0].id,
				name: newUser[0].name,
				email: newUser[0].email,
				role: newUser[0].role,
			},
		});
	} catch (error) {
		console.log("🚀 ~ registerUser ~ error:", error);
		throw new HTTPException(500, { message: "Failed to register user" });
	}
};

export const loginUser = async (c: Context) => {
	try {
		const db = drizzle(c.env.DB, { schema });
		const body = await c.req.json();
		const parsedBody = loginUserSchema.safeParse(body);

		if (!parsedBody.success) {
			throw new HTTPException(400, { message: "Invalid request body" });
		}

		const { email, password } = parsedBody.data;

		const user = await db.query.users.findFirst({
			where: (users, { eq }) => eq(users.email, email),
		});

		if (!user) {
			throw new HTTPException(401, { message: "Invalid credentials" });
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			throw new HTTPException(401, { message: "Invalid credentials" });
		}

		const payload = {
			sub: user.id,
			role: user.role,
			exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
		};

		const secret = c.env.JWT_SECRET;
		console.log("🚀 ~ loginUser ~ secret:", secret);
		const token = await sign(payload, secret, 'HS256');

		return c.json({ token });

	} catch (error) {
		console.log("🚀 ~ loginUser ~ error:", error);
		throw error
	}
};

export const getMe = (c: Context) => {
	const user = c.get("user");
	return c.json(user);
};
