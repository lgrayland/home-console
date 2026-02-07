import { db } from "../client";
import { ThoughtStatus } from "../types";

export async function createThought(content: string) {
  const trimmed = content.trim();
  if (!trimmed) throw new Error("content is required");

  const row = await db
    .insertInto("thoughts")
    .values({ content: trimmed, status: "inbox" })
    .returningAll()
    .executeTakeFirstOrThrow();

  return row;
}

export async function updateThoughtStatus(id: string, status: ThoughtStatus) {
  return db
    .updateTable("thoughts")
    .set({ status })
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirst();
}

export async function deleteThought(id: string) {
  await db.deleteFrom("thoughts").where("id", "=", id).execute();
}
