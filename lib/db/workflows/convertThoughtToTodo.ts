"use server";

import "server-only";
import { db } from "../client";
import { revalidatePath } from "next/cache";

function deriveTitle(content: string): string {
  const firstLine =
    content
      .split("\n")
      .map((s) => s.trim())
      .find(Boolean) ?? "";
  const trimmed = firstLine || content.trim();
  return trimmed.length > 120 ? trimmed.slice(0, 120) : trimmed || "Untitled";
}

export async function convertThoughtToTodo(thoughtId: string) {
  return db.transaction().execute(async (trx) => {
    // Lock the thought row to avoid races
    const thought = await trx
      .selectFrom("thoughts")
      .selectAll()
      .where("id", "=", thoughtId)
      .forUpdate()
      .executeTakeFirst();

    if (!thought) {
      throw new Error("Thought not found");
    }

    // If already converted, return the existing todo (idempotent)
    const existing = await trx
      .selectFrom("todos")
      .select(["id"])
      .where("source_thought_id", "=", thoughtId)
      .executeTakeFirst();

    if (existing) {
      return { todoId: existing.id, alreadyExisted: true };
    }

    // Optional: only allow converting inbox items
    if (thought.status !== "inbox") {
      throw new Error(`Thought is not convertible (status=${thought.status})`);
    }

    const insertedTodo = await trx
      .insertInto("todos")
      .values({
        title: deriveTitle(thought.content),
        notes: thought.content,
        status: "open",
        source_thought_id: thoughtId,
      })
      .returning(["id"])
      .executeTakeFirstOrThrow();

    await trx
      .updateTable("thoughts")
      .set({ status: "converted" })
      .where("id", "=", thoughtId)
      .execute();

    revalidatePath("/todos");

    return { todoId: insertedTodo.id, alreadyExisted: false };
  });
}
