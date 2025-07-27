import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import * as schema from "../db/schema";



export const getCategoryProgress = async (c: Context) => {
	const db = drizzle(c.env.DB, { schema });
	const categoryId = c.req.param("categoryId");

	const usersInCategory = await db.query.usersToCategories.findMany({
		where: eq(schema.usersToCategories.categoryId, categoryId),
		with: {
			user: true,
		},
	});

	if (usersInCategory.length === 0) {
		return c.json([]);
	}

	const userIds = usersInCategory.map((u) => u.userId);

	const progress = await db.query.userProgress.findMany({
		where: (userProgress, { inArray }) => inArray(userProgress.userId, userIds),
		with: {
			checklistItem: {
				columns: {
					categoryId: true,
				},
			},
		},
	});

	const categoryProgress = usersInCategory.map((u) => {
		const userProgressForCategory = progress.filter((p) => p.checklistItem.categoryId === categoryId && p.userId === u.userId);
		return {
			user: u.user,
			progress: userProgressForCategory,
		};
	});

	return c.json(categoryProgress);
};

export const approveChecklistItem = async (c: Context) => {
	const db = drizzle(c.env.DB, { schema });
	const { userId, categoryId, checklistId } = c.req.param();
	const { approved } = await c.req.json();

	const checklistItem = await db.query.checklistItems.findFirst({
		where: (checklistItems, { eq }) => eq(checklistItems.id, checklistId),
	});

	if (!checklistItem || checklistItem.categoryId !== categoryId) {
		throw new HTTPException(404, {
			message: "Checklist item not found in this category",
		});
	}

	const updatedProgress = await db
		.update(schema.userProgress)
		.set({ approved })
		.where(and(eq(schema.userProgress.userId, userId), eq(schema.userProgress.checklistId, checklistId)))
		.returning();

	if (updatedProgress.length === 0) {
		throw new HTTPException(404, { message: "User progress not found" });
	}

	return c.json(updatedProgress[0]);
};
