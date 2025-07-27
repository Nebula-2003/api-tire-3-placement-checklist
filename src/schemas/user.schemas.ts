import { z } from "zod";

export const UserSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string().email(),
	role: z.enum(["admin", "intern"]),
});

export const UsersSchema = z.array(UserSchema);

export const UpdateProgressSchema = z.object({
	checklistId: z.string(),
	completed: z.boolean(),
});

export const AssignCategorySchema = z.object({
	categoryId: z.string(),
});