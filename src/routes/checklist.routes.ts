import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { z } from "zod";
import {
	deleteChecklistItem,
	updateChecklistItem,
	getChecklistItemById,
	getAllChecklistItems,
} from "../controllers/checklist.controller";
import { admin, protect } from "../middleware/auth.middleware";
import { ErrorSchema } from "../schemas/api.response.schema";
import { ChecklistItemSchema, UpdateChecklistItemSchema, ChecklistItemsSchema } from "../schemas/checklist.schemas";

const checklistRoutes = new OpenAPIHono();

checklistRoutes.use("/*", protect);

checklistRoutes.openapi(
	createRoute({
		method: "get",
		path: "/",
		summary: "Get all checklist items",
		operationId: "getAllChecklistItems",
		responses: {
			200: {
				description: "List of checklist items",
				content: { "application/json": { schema: ChecklistItemsSchema } },
			},
		},
		security: [{ Bearer: [] }],
	}),
	getAllChecklistItems,
);

checklistRoutes.openapi(
	createRoute({
		method: "get",
		path: "/{checklistId}",
		summary: "Get a checklist item by ID",
		operationId: "getChecklistItemById",
		request: {
			params: z.object({ checklistId: z.string() }),
		},
		responses: {
			200: {
				description: "Checklist item found",
				content: { "application/json": { schema: ChecklistItemSchema } },
			},
			404: {
				description: "Checklist item not found",
				content: { "application/json": { schema: ErrorSchema } },
			},
		},
		security: [{ Bearer: [] }],
	}),
	getChecklistItemById,
);

checklistRoutes.openapi(
	createRoute({
		method: "patch",
		path: "/{checklistId}",
		summary: "Update a checklist item",
		operationId: "updateChecklistItem",
		request: {
			params: z.object({ checklistId: z.string() }),
			body: {
				content: {
					"application/json": { schema: UpdateChecklistItemSchema },
				},
			},
		},
		responses: {
			200: {
				description: "Checklist item updated",
				content: { "application/json": { schema: ChecklistItemSchema } },
			},
			404: {
				description: "Checklist item not found",
				content: { "application/json": { schema: ErrorSchema } },
			},
		},
		security: [{ Bearer: [] }],
	}),
	admin,
	updateChecklistItem,
);

checklistRoutes.openapi(
	createRoute({
		method: "delete",
		path: "/{checklistId}",
		summary: "Delete a checklist item",
		operationId: "deleteChecklistItem",
		request: {
			params: z.object({ checklistId: z.string() }),
		},
		responses: {
			200: {
				description: "Checklist item deleted",
				content: {
					"application/json": {
						schema: z.object({ message: z.string() }),
					},
				},
			},
			404: {
				description: "Checklist item not found",
				content: { "application/json": { schema: ErrorSchema } },
			},
		},
		security: [{ Bearer: [] }],
	}),
	admin,
	deleteChecklistItem,
);

export default checklistRoutes;
