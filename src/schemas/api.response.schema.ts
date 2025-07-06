import { z } from "@hono/zod-openapi";

export const MetaSchema = z
    .object({
        page: z.number().optional(),
        pageSize: z.number().optional(),
        total: z.number().optional(),
    })
    .openapi("Meta");

export const ErrorDetailSchema = z.object({
    field: z.string(),
    message: z.string(),
});

export const ErrorObjectSchema = z.object({
    code: z.string(),
    details: z.array(ErrorDetailSchema).optional(),
});

export const ApiResponseSchema = z
    .object({
        success: z.boolean(),
        message: z.string(),
        data: z.any().nullable(),
        error: ErrorObjectSchema.nullable(),
        meta: MetaSchema.optional(),
        timestamp: z.string().datetime(),
        requestId: z.string(),
    })
    .openapi("ApiResponse");
