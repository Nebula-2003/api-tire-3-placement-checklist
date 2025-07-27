import { drizzle } from "drizzle-orm/d1";
import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import * as schema from "../db/schema";



export const getAllUsers = async (c: Context) => {
	const db = drizzle(c.env.DB, { schema });
	const allUsers = await db.query.users.findMany();
	return c.json(allUsers);
};

export const getUserById = async (c: Context) => {
	const db = drizzle(c.env.DB, { schema });
	const id = c.req.param("id");
	const user = await db.query.users.findFirst({
		where: (users, { eq }) => eq(users.id, id),
		with: {
			usersToCategories: {
				with: {
					category: true,
				},
			},
		},
	});

	if (!user) {
		throw new HTTPException(404, { message: "User not found" });
	}

	return c.json(user);
};

export const updateUserProgress = async (c: Context) => {
	const db = drizzle(c.env.DB, { schema });
	const userId = c.req.param("id");
	const { checklistId, completed } = await c.req.json();

	const loggedInUser = c.get("user");
	if (userId !== loggedInUser.id) {
		throw new HTTPException(403, { message: "Forbidden" });
	}

	const progress = await db
		.insert(schema.userProgress)
		.values({
			userId,
			checklistId,
			completed,
			completedAt: completed ? new Date() : null,
		})
		.onConflictDoUpdate({
			target: [schema.userProgress.userId, schema.userProgress.checklistId],
			set: {
				completed,
				completedAt: completed ? new Date() : null,
			},
		})
		.returning();

	return c.json(progress[0]);
};

export const assignCategoryToUser = async (c: Context) => {
	const db = drizzle(c.env.DB, { schema });
	const userId = c.req.param("id");
	const { categoryId } = await c.req.json();

	const assignment = await db
		.insert(schema.usersToCategories)
		.values({
			userId,
			categoryId,
		})
		.returning();

	return c.json(assignment[0]);
};
