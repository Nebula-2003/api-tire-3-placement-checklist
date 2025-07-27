import { z } from "zod";
import { ChecklistItemSchema } from "./checklist.schemas";
import { UserSchema } from "./user.schemas";

export const ApproveChecklistItemSchema = z.object({
	approved: z.boolean(),
});

export const UserProgressSchema = z.object({
	user: UserSchema,
	progress: z.array(
		z.object({
			checklistItem: ChecklistItemSchema,
			completed: z.boolean(),
			completedAt: z.string().datetime().nullable(),
			approved: z.boolean(),
		}),
	),
});

export const CategoryProgressSchema = z.array(UserProgressSchema);
