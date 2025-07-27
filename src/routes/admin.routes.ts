import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import {
	getCategoryProgress,
	approveChecklistItem,
} from "../controllers/admin.controller";
import {
	CategoryProgressSchema,
	ApproveChecklistItemSchema,
} from "../schemas/admin.schemas";
import { ErrorSchema } from "../schemas/api.response.schema";
import { z } from "zod";
import { admin, protect } from "../middleware/auth.middleware";

const adminRoutes = new OpenAPIHono();

adminRoutes.use("/*", protect, admin);

adminRoutes.openapi(
	createRoute({
		method: "get",
		path: "/progress/{categoryId}",
		summary: "Get progress of all users for a category",
		operationId: "getCategoryProgress",
		request: {
			params: z.object({ categoryId: z.string() }),
		},
		responses: {
			200: {
				description: "Category progress",
				content: { "application/json": { schema: CategoryProgressSchema } },
			},
		},
		security: [{ Bearer: [] }],
	}),
	getCategoryProgress,
);

adminRoutes.openapi(
	createRoute({
		method: "post",
		path: "/approve/{userId}/{categoryId}/{checklistId}",
		summary: "Approve a checklist item for a user",
		operationId: "approveChecklistItem",
		request: {
			params: z.object({
				userId: z.string(),
				categoryId: z.string(),
				checklistId: z.string(),
			}),
			body: {
				content: {
					"application/json": { schema: ApproveChecklistItemSchema },
				},
			},
		},
		responses: {
			200: {
				description: "Checklist item approved",
				content: { "application/json": { schema: z.object({}) } }, // TODO: define proper response schema
			},
			404: {
				description: "Not found",
				content: { "application/json": { schema: ErrorSchema } },
			},
		},
		security: [{ Bearer: [] }],
	}),
	approveChecklistItem,
);

export default adminRoutes;
