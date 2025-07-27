import { relations } from "drizzle-orm";
import {
	integer,
	primaryKey,
	sqliteTable,
	text,
} from "drizzle-orm/sqlite-core";

// Core Tables
export const users = sqliteTable("users", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	password: text("password").notNull(),
	role: text("role", { enum: ["admin", "intern"] }).notNull(),
});

export const categories = sqliteTable("categories", {
	id: text("id").primaryKey(),
	title: text("title").notNull(),
	createdById: text("created_by_id").references(() => users.id),
});

export const checklistItems = sqliteTable("checklist_items", {
	id: text("id").primaryKey(),
	title: text("title").notNull(),
	resources: text("resources", { mode: "json" }),
	categoryId: text("category_id").references(() => categories.id),
	order: integer("order").notNull(),
});

// Many-to-Many relationship between Users and Categories
export const usersToCategories = sqliteTable(
	"users_to_categories",
	{
		userId: text("user_id").references(() => users.id),
		categoryId: text("category_id").references(() => categories.id),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.userId, t.categoryId] }),
	}),
);

// User Progress on Checklist Items
export const userProgress = sqliteTable(
	"user_progress",
	{
		userId: text("user_id").references(() => users.id),
		checklistId: text("checklist_id").references(() => checklistItems.id),
		completed: integer("completed", { mode: "boolean" }).default(false),
		completedAt: integer("completed_at", { mode: "timestamp" }),
		approved: integer("approved", { mode: "boolean" }).default(false),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.userId, t.checklistId] }),
	}),
);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
	usersToCategories: many(usersToCategories),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
	createdBy: one(users, {
		fields: [categories.createdById],
		references: [users.id],
	}),
	checklistItems: many(checklistItems),
	usersToCategories: many(usersToCategories),
}));

export const checklistItemsRelations = relations(
	checklistItems,
	({ one, many }) => ({
		category: one(categories, {
			fields: [checklistItems.categoryId],
			references: [categories.id],
		}),
		userProgress: many(userProgress),
	}),
);

export const usersToCategoriesRelations = relations(
	usersToCategories,
	({ one }) => ({
		user: one(users, {
			fields: [usersToCategories.userId],
			references: [users.id],
		}),
		category: one(categories, {
			fields: [usersToCategories.categoryId],
			references: [categories.id],
		}),
	}),
);

export const userProgressRelations = relations(userProgress, ({ one }) => ({
	user: one(users, {
		fields: [userProgress.userId],
		references: [users.id],
	}),
	checklistItem: one(checklistItems, {
		fields: [userProgress.checklistId],
		references: [checklistItems.id],
	}),
}));