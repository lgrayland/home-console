"use server";

import { revalidatePath } from "next/cache";
import { db } from "../client";

export async function createTodo(data: {
  title: string;
  notes?: string | null;
  dueDate?: string | null;
  sourceThoughtId?: string | null;
}) {
  await db
    .insertInto("todos")
    .values({
      title: data.title,
      notes: data.notes ?? null,
      due_date: data.dueDate ?? null,
      source_thought_id: data.sourceThoughtId ?? null,
      status: "open",
    })
    .execute();

  revalidatePath("/todos");
}

export async function setTodoDueDate(todoId: string, dueDate: Date | null) {
  await db
    .updateTable("todos")
    .set({ due_date: dueDate })
    .where("id", "=", todoId)
    .execute();

  revalidatePath("/todos");
}

export async function setTodoStatus(todoId: string, status: "open" | "done") {
  await db
    .updateTable("todos")
    .set({
      status,
      completed_at: status === "done" ? new Date() : null,
    })
    .where("id", "=", todoId)
    .execute();

  revalidatePath("/todos");
}

export async function deleteTodo(todoId: string) {
  await db.deleteFrom("todos").where("id", "=", todoId).execute();
  revalidatePath("/todos");
}
