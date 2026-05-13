import { pgTable, text, varchar, boolean, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// --- SUBJECTS TABLE ---
export const subjects = pgTable("subjects", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// A subject can have many topics
export const subjectsRelations = relations(subjects, ({ many }) => ({
  topics: many(topics),
}));

// --- TOPICS TABLE ---
export const topics = pgTable("topics", {
  id: uuid("id").defaultRandom().primaryKey(),
  subjectId: uuid("subject_id")
    .notNull()
    .references(() => subjects.id, { onDelete: "cascade" }), // If a subject is deleted, its topics are auto-deleted
  name: varchar("name", { length: 255 }).notNull(),
  isCompleted: boolean("is_completed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// A topic belongs to exactly one subject
export const topicsRelations = relations(topics, ({ one }) => ({
  subject: one(subjects, {
    fields: [topics.subjectId],
    references: [subjects.id],
  }),
}));

// --- MONTHLY GOALS TABLE ---
export const goals = pgTable("goals", {
  id: uuid("id").defaultRandom().primaryKey(),
  monthTarget: varchar("month_target", { length: 7 }).notNull(), // Format: "YYYY-MM" (e.g., "2026-05")
  description: text("description").notNull(),
  isCompleted: boolean("is_completed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});