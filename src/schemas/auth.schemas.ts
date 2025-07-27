import { z } from "zod";

export const registerUserSchema = z.object({
	name: z.string(),
	email: z.string().email(),
	password: z.string().min(6),
	role: z.enum(["admin", "intern"]),
});

export const loginUserSchema = z.object({
	email: z.string().email(),
	password: z.string(),
});
