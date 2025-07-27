import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import type { Context, Next } from "hono";
import { getCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import { verify } from "hono/jwt";
import * as schema from "../db/schema";

export const protect = async (c: Context, next: Next) => {
	console.log("🚀 ~ protect ~ c:", c);
	const db = drizzle(c.env.DB, { schema });
	let token;
	if (c.req.header("Authorization")?.startsWith("Bearer")) {
		token = c.req.header("Authorization")?.split(" ")[1];
	} else {
		token = getCookie(c, "token");
	}

	if (!token) {
		throw new HTTPException(401, {
			message: "Not authorized to access this route",
		});
	}

	try {
		const payload = await verify(token, c.env.JWT_SECRET);
		if (!payload) {
			throw new HTTPException(401, {
				message: "Not authorized to access this route",
			});
		}
		const user = await db.query.users.findFirst({
			where: and(eq(schema.users.id, payload.sub as string)),
		});

		if (!user) {
			throw new HTTPException(401, {
				message: "Not authorized to access this route",
			});
		}
		c.set("user", user);
		await next();
	} catch (error) {
		throw new HTTPException(401, {
			message: "Not authorized to access this route",
		});
	}
};

export const admin = async (c: Context, next: Next) => {
	const user = c.get("user");
	if (user && user.role === "admin") {
		await next();
	} else {
		throw new HTTPException(403, {
			message: "Forbidden",
		});
	}
};
