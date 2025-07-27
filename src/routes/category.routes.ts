import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { z } from "zod";
import {
	createCategory,
	deleteCategory,
	getAllCategories,
	getCategoryById,
} from "../controllers/category.controller";
import {
	addChecklistItemToCategory,
	getChecklistItemsForCategory,
} from "../controllers/checklist.controller";
import { adminProtect } from "../middleware/admin.middleware";
import { ErrorSchema } from "../schemas/api.response.schema";
import {
	CategoriesSchema,
	CategorySchema,
	CreateCategorySchema,
} from "../schemas/category.schemas";
import {
	ChecklistItemSchema,
	ChecklistItemsSchema,
	CreateChecklistItemSchema,
} from "../schemas/checklist.schemas";

const categoryRoutes = new OpenAPIHono();

// Category routes
categoryRoutes.openapi(
	createRoute({
		method: "get",
		path: "/",
		summary: "Get all categories",
		operationId: "getAllCategories",
		responses: {
			200: {
				description: "List of categories",
				content: { "application/json": { schema: CategoriesSchema } },
			},
		},
	}),
	getAllCategories,
);

categoryRoutes.openapi(
	createRoute({
		method: "post",
		path: "/",
		summary: "Create a new category",
		operationId: "createCategory",
		request: {
			body: {
				content: {
					"application/json": { schema: CreateCategorySchema },
				},
			},
		},
		responses: {
			201: {
				description: "Category created",
				content: { "application/json": { schema: CategorySchema } },
			},
		},
		security: [{ Bearer: [] }],
	}),
	adminProtect,
	createCategory,
);

categoryRoutes.openapi(
	createRoute({
		method: "get",
		path: "/{id}",
		summary: "Get category by ID",
		operationId: "getCategoryById",
		request: {
			params: z.object({ id: z.string() }),
		},
		responses: {
			200: {
				description: "Category found",
				content: { "application/json": { schema: CategorySchema } },
			},
			404: {
				description: "Category not found",
				content: { "application/json": { schema: ErrorSchema } },
			},
		},
	}),
	getCategoryById,
);

categoryRoutes.openapi(
	createRoute({
		method: "delete",
		path: "/{id}",
		summary: "Delete a category",
		operationId: "deleteCategory",
		request: {
			params: z.object({ id: z.string() }),
		},
		responses: {
			200: {
				description: "Category deleted",
				content: {
					"application/json": {
						schema: z.object({ message: z.string() }),
					},
				},
			},
			404: {
				description: "Category not found",
				content: { "application/json": { schema: ErrorSchema } },
			},
		},
		security: [{ Bearer: [] }],
	}),
	adminProtect,
	deleteCategory,
);

// Checklist routes for a category
categoryRoutes.openapi(
	createRoute({
		method: "post",
		path: "/{categoryId}/checklist",
		summary: "Add a checklist item to a category",
		operationId: "addChecklistItemToCategory",
		request: {
			params: z.object({ categoryId: z.string() }),
			body: {
				content: {
					"application/json": { schema: CreateChecklistItemSchema },
				},
			},
		},
		responses: {
			201: {
				description: "Checklist item created",
				content: { "application/json": { schema: ChecklistItemSchema } },
			},
		},
		security: [{ Bearer: [] }],
	}),
	adminProtect,
	addChecklistItemToCategory,
);

categoryRoutes.openapi(
	createRoute({
		method: "get",
		path: "/{categoryId}/checklist",
		summary: "Get checklist items for a category",
		operationId: "getChecklistItemsForCategory",
		request: {
			params: z.object({ categoryId: z.string() }),
		},
		responses: {
			200: {
				description: "List of checklist items",
				content: { "application/json": { schema: ChecklistItemsSchema } },
			},
		},
	}),
	getChecklistItemsForCategory,
);

export default categoryRoutes;
