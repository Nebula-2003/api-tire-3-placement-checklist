import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { z } from "zod";
import { assignCategoryToUser, getAllUsers, getUserById, updateUserProgress } from "../controllers/user.controller";
import { admin, protect } from "../middleware/auth.middleware";
import { ErrorSchema } from "../schemas/api.response.schema";
import { AssignCategorySchema, UpdateProgressSchema, UserSchema, UsersSchema } from "../schemas/user.schemas";

const usersRoutes = new OpenAPIHono();

usersRoutes.openapi(
	createRoute({
		method: "get",
		path: "/",
		summary: "Get all users",
		operationId: "getAllUsers",
		responses: {
			200: {
				description: "List of users",
				content: { "application/json": { schema: UsersSchema } },
			},
		},
		security: [{ Bearer: [] }],
	}),
	protect,
	getAllUsers,
);

usersRoutes.openapi(
	createRoute({
		method: "get",
		path: "/{id}",
		summary: "Get user by ID",
		operationId: "getUserById",
		request: {
			params: z.object({ id: z.string() }),
		},
		responses: {
			200: {
				description: "User found",
				content: { "application/json": { schema: UserSchema } },
			},
			404: {
				description: "User not found",
				content: { "application/json": { schema: ErrorSchema } },
			},
		},
		security: [{ Bearer: [] }],
	}),
	protect,
	getUserById,
);

usersRoutes.openapi(
	createRoute({
		method: "patch",
		path: "/{id}/progress",
		summary: "Update user progress",
		operationId: "updateUserProgress",
		request: {
			params: z.object({ id: z.string() }),
			body: {
				content: {
					"application/json": { schema: UpdateProgressSchema },
				},
			},
		},
		responses: {
			200: {
				description: "Progress updated",
				content: { "application/json": { schema: z.object({}) } }, // TODO: define proper response schema
			},
		},
		security: [{ Bearer: [] }],
	}),
	protect,
	updateUserProgress,
);

usersRoutes.openapi(
	createRoute({
		method: "post",
		path: "/{id}/assign",
		summary: "Assign category to user",
		operationId: "assignCategoryToUser",
		request: {
			params: z.object({ id: z.string() }),
			body: {
				content: {
					"application/json": { schema: AssignCategorySchema },
				},
			},
		},
		responses: {
			200: {
				description: "Category assigned",
				content: { "application/json": { schema: z.object({}) } }, // TODO: define proper response schema
			},
		},
		security: [{ Bearer: [] }],
	}),
	protect,
	admin,
	assignCategoryToUser,
);

export default usersRoutes;
