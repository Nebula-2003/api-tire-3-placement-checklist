import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { nanoid } from "nanoid";
import * as schema from "../db/schema";
import { CreateChecklistItemSchema, UpdateChecklistItemSchema } from "../schemas/checklist.schemas";



export const addChecklistItemToCategory = async (c: Context) => {
	const db = drizzle(c.env.DB, { schema });
	const categoryId = c.req.param("categoryId");
	const body = await c.req.json();
	const parsedBody = CreateChecklistItemSchema.safeParse(body);

	if (!parsedBody.success) {
		throw new HTTPException(400, { message: "Invalid request body" });
	}

	const { title, resources, order } = parsedBody.data;

	const newChecklistItem = await db
		.insert(schema.checklistItems)
		.values({
			id: nanoid(),
			title,
			resources: JSON.stringify(resources),
			categoryId,
			order,
		})
		.returning();

	return c.json(newChecklistItem[0], 201);
};

export const getChecklistItemsForCategory = async (c: Context) => {
	const db = drizzle(c.env.DB, { schema });
	const categoryId = c.req.param("categoryId");
	const items = await db.query.checklistItems.findMany({
		where: (checklistItems, { eq }) => eq(checklistItems.categoryId, categoryId),
	});
	return c.json(items);
};

export const getAllChecklistItems = async (c: Context) => {
	const db = drizzle(c.env.DB, { schema });
	const items = await db.query.checklistItems.findMany();
	return c.json(items);
};

export const getChecklistItemById = async (c: Context) => {
	const db = drizzle(c.env.DB, { schema });
	const checklistId = c.req.param("checklistId");
	const item = await db.query.checklistItems.findFirst({
		where: (checklistItems, { eq }) => eq(checklistItems.id, checklistId),
	});

	if (!item) {
		throw new HTTPException(404, { message: "Checklist item not found" });
	}

	return c.json(item);
};

export const updateChecklistItem = async (c: Context) => {
	const db = drizzle(c.env.DB, { schema });
	const checklistId = c.req.param("checklistId");
	const body = await c.req.json();
	const parsedBody = UpdateChecklistItemSchema.safeParse(body);

	if (!parsedBody.success) {
		throw new HTTPException(400, { message: "Invalid request body" });
	}

	const { title, resources, order } = parsedBody.data;

	const updatedItem = await db
		.update(schema.checklistItems)
		.set({
			title,
			resources: resources ? JSON.stringify(resources) : undefined,
			order,
		})
		.where(eq(schema.checklistItems.id, checklistId))
		.returning();

	if (updatedItem.length === 0) {
		throw new HTTPException(404, { message: "Checklist item not found" });
	}

	return c.json(updatedItem[0]);
};

export const deleteChecklistItem = async (c: Context) => {
	const db = drizzle(c.env.DB, { schema });
	const checklistId = c.req.param("checklistId");

	const deletedItem = await db.delete(schema.checklistItems).where(eq(schema.checklistItems.id, checklistId)).returning();

	if (deletedItem.length === 0) {
		throw new HTTPException(404, { message: "Checklist item not found" });
	}

	return c.json({ message: "Checklist item deleted successfully" });
};
