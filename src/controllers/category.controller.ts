import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { nanoid } from "nanoid";
import * as schema from "../db/schema";
import { CreateCategorySchema } from "../schemas/category.schemas";



export const getAllCategories = async (c: Context) => {
	const db = drizzle(c.env.DB, { schema });
	const allCategories = await db.query.categories.findMany();
	return c.json(allCategories);
};

export const createCategory = async (c: Context) => {
	const db = drizzle(c.env.DB, { schema });
	const loggedInUser = c.get("user");
	const body = await c.req.json();
	const parsedBody = CreateCategorySchema.safeParse(body);

	if (!parsedBody.success) {
		throw new HTTPException(400, { message: "Invalid request body" });
	}

	const { title } = parsedBody.data;

	const newCategory = await db
		.insert(schema.categories)
		.values({
			id: nanoid(),
			title,
			
		})
		.returning();

	return c.json(newCategory[0]);
};

export const getCategoryById = async (c: Context) => {
	const db = drizzle(c.env.DB, { schema });
	const id = c.req.param("id");
	const category = await db.query.categories.findFirst({
		where: (categories, { eq }) => eq(categories.id, id),
		with: {
			checklistItems: true,
		},
	});

	if (!category) {
		throw new HTTPException(404, { message: "Category not found" });
	}

	return c.json(category);
};

export const deleteCategory = async (c: Context) => {
	const db = drizzle(c.env.DB, { schema });
	// TODO: Add admin-only check
	const id = c.req.param("id");

	const deletedCategory = await db.delete(schema.categories).where(eq(schema.categories.id, id)).returning();

	if (deletedCategory.length === 0) {
		throw new HTTPException(404, { message: "Category not found" });
	}

	return c.json({ message: "Category deleted successfully" });
};
