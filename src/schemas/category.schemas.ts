import { z } from "zod";

export const CategorySchema = z.object({
	id: z.string(),
	title: z.string(),
	createdById: z.string().nullable(),
});

export const CategoriesSchema = z.array(CategorySchema);

export const CreateCategorySchema = z.object({
	title: z.string(),
});
