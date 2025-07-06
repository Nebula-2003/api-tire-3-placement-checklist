import { z } from "@hono/zod-openapi";

export const UserSchema = z
    .object({
        id: z.number(),
        username: z.string(),
        name: z.string().optional(),
        age: z.number().optional(),
        email: z.string().optional(),
    })
    .openapi("User");

export const UserArraySchema = z.array(UserSchema).openapi("UserList");

export const ParamIdSchema = z.object({
    id: z.string().regex(/^\d+$/).openapi({ example: "1" }),
});

export const SignupSchema = z
    .object({
        username: z.string().min(3),
        password: z.string().min(6),
        name: z.string().optional(),
        age: z.number().optional(),
        email: z.string().email().optional(),
    })
    .openapi("SignupInput");

export const LoginSchema = z
    .object({
        username: z.string(),
        password: z.string(),
    })
    .openapi("LoginInput");

export const AuthResponseSchema = z
    .object({
        id: z.number(),
        username: z.string(),
        token: z.string(),
    })
    .openapi("AuthResponse");

export const ErrorSchema = z
    .object({
        error: z.string(),
    })
    .openapi("ErrorResponse");
