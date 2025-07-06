import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

import { deleteUser, getAllUsers, getUserById, loginUser, signupUser, updateUser } from "./user.controller";

// --- Schemas ---
const UserSchema = z
    .object({
        id: z.number(),
        username: z.string(),
        name: z.string().optional(),
        age: z.number().optional(),
        email: z.string().optional(),
    })
    .openapi("User");

const UserArraySchema = z.array(UserSchema).openapi("UserList");

const ParamIdSchema = z.object({
    id: z.string().regex(/^\d+$/).openapi({ example: "1" }),
});

const SignupSchema = z
    .object({
        username: z.string().min(3),
        password: z.string().min(6),
        name: z.string().optional(),
        age: z.number().optional(),
        email: z.string().email().optional(),
    })
    .openapi("SignupInput");

const LoginSchema = z
    .object({
        username: z.string(),
        password: z.string(),
    })
    .openapi("LoginInput");

const AuthResponseSchema = z
    .object({
        id: z.number(),
        username: z.string(),
        token: z.string(),
    })
    .openapi("AuthResponse");

const ErrorSchema = z
    .object({
        error: z.string(),
    })
    .openapi("ErrorResponse");

const openapiUsers = new OpenAPIHono();

// Routes
openapiUsers.openapi(
    createRoute({
        method: "get",
        path: "/",
        summary: "Get all users",
        operationId: "getUsers",
        responses: {
            200: {
                description: "List of users",
                content: { "application/json": { schema: UserArraySchema } },
            },
        },
    }),
    getAllUsers,
);

openapiUsers.openapi(
    createRoute({
        method: "get",
        path: "/{id}",
        summary: "Get user by ID",
        operationId: "getUserById",
        request: {
            params: ParamIdSchema,
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
    }),
    getUserById,
);

openapiUsers.openapi(
    createRoute({
        method: "post",
        path: "/signup",
        summary: "Register new user",
        operationId: "signupUser",
        request: {
            body: {
                content: { "application/json": { schema: SignupSchema } },
                required: true,
            },
        },
        responses: {
            201: {
                description: "User created",
                content: { "application/json": { schema: AuthResponseSchema } },
            },
            409: {
                description: "Username already exists",
                content: { "application/json": { schema: ErrorSchema } },
            },
        },
    }),
    signupUser,
);

openapiUsers.openapi(
    createRoute({
        method: "post",
        path: "/login",
        summary: "Login user",
        operationId: "loginUser",
        request: {
            body: {
                content: { "application/json": { schema: LoginSchema } },
                required: true,
            },
        },
        responses: {
            200: {
                description: "Logged in",
                content: { "application/json": { schema: AuthResponseSchema } },
            },
            401: {
                description: "Invalid credentials",
                content: { "application/json": { schema: ErrorSchema } },
            },
        },
    }),
    loginUser,
);

openapiUsers.openapi(
    createRoute({
        method: "put",
        path: "/{id}",
        summary: "Update user by ID",
        operationId: "updateUser",
        request: {
            params: ParamIdSchema,
            body: {
                content: {
                    "application/json": { schema: SignupSchema.partial() },
                },
                required: true,
            },
        },
        responses: {
            200: {
                description: "User updated",
                content: { "application/json": { schema: UserSchema } },
            },
            404: {
                description: "User not found",
                content: { "application/json": { schema: ErrorSchema } },
            },
        },
    }),
    updateUser,
);

openapiUsers.openapi(
    createRoute({
        method: "delete",
        path: "/{id}",
        summary: "Delete user by ID",
        operationId: "deleteUser",
        request: {
            params: ParamIdSchema,
        },
        responses: {
            200: {
                description: "User deleted",
                content: { "application/json": { schema: UserSchema } },
            },
            404: {
                description: "User not found",
                content: { "application/json": { schema: ErrorSchema } },
            },
        },
    }),
    deleteUser,
);

export default openapiUsers;
