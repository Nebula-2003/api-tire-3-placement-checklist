import { z } from "zod";

export const ChecklistItemSchema = z.object({
	id: z.string(),
	title: z.string(),
	resources: z.array(z.object({ title: z.string(), link: z.string().url() })),
	categoryId: z.string(),
	order: z.number(),
});

export const ChecklistItemsSchema = z.array(ChecklistItemSchema);

export const CreateChecklistItemSchema = z.object({
	title: z.string(),
	resources: z
		.array(z.object({ title: z.string(), link: z.string().url() }))
		.optional(),
	order: z.number(),
});

export const UpdateChecklistItemSchema = z.object({
	title: z.string().optional(),
	resources: z
		.array(z.object({ title: z.string(), link: z.string().url() }))
		.optional(),
	order: z.number().optional(),
});
