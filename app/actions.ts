"use server";

import { db } from "@/db";
import { subjects, topics, goals } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// --- SUBJECT ACTIONS ---
export async function createSubject(name: string) {
  await db.insert(subjects).values({ name });
  revalidatePath("/"); // Instantly updates the UI
}

export async function deleteSubject(id: string) {
  await db.delete(subjects).where(eq(subjects.id, id));
  revalidatePath("/");
}

// --- TOPIC ACTIONS ---
export async function createTopic(subjectId: string, name: string) {
  await db.insert(topics).values({ subjectId, name });
  revalidatePath("/");
}

export async function toggleTopic(id: string, isCompleted: boolean) {
  await db.update(topics).set({ isCompleted }).where(eq(topics.id, id));
  revalidatePath("/");
}

export async function deleteTopic(id: string) {
  await db.delete(topics).where(eq(topics.id, id));
  revalidatePath("/");
}

// --- GOAL ACTIONS ---
export async function createGoal(monthTarget: string, description: string) {
  await db.insert(goals).values({ monthTarget, description });
  revalidatePath("/");
}

export async function toggleGoal(id: string, isCompleted: boolean) {
  await db.update(goals).set({ isCompleted }).where(eq(goals.id, id));
  revalidatePath("/");
}

export async function deleteGoal(id: string) {
  await db.delete(goals).where(eq(goals.id, id));
  revalidatePath("/");
}