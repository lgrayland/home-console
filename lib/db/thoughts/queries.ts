import { db } from "../client";
import { Thought, ThoughtStatus } from "../types";

export async function listThoughtsByStatus(
  status: ThoughtStatus = "inbox",
  limit = 100,
): Promise<Thought[]> {
  return db
    .selectFrom("thoughts")
    .selectAll()
    .where("status", "=", status)
    .orderBy("created_at", "desc")
    .limit(limit)
    .execute();
}
