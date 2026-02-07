import { db } from "../client";
import { Todo } from "../types/todos";

export async function getTodos(options?: {
  status?: "open" | "done";
}): Promise<Todo[]> {
  let q = db.selectFrom("todos").selectAll();

  if (options?.status) {
    q = q.where("status", "=", options.status);
  }

  return q.orderBy("created_at", "desc").execute();
}

export async function getTodosForDateRange(
  startDate: string,
  endDate: string,
): Promise<Todo[]> {
  return db
    .selectFrom("todos")
    .selectAll()
    .where("due_date", ">=", startDate)
    .where("due_date", "<=", endDate)
    .execute();
}

export async function getOverdueTodos(beforeDate: string): Promise<Todo[]> {
  return db
    .selectFrom("todos")
    .selectAll()
    .where("status", "=", "open")
    .where("due_date", "<", beforeDate)
    .orderBy("due_date", "asc")
    .execute();
}
export async function getUnscheduledTodos(): Promise<Todo[]> {
  return db
    .selectFrom("todos")
    .selectAll()
    .where("status", "=", "open")
    .where("due_date", "is", null)
    .orderBy("created_at", "desc")
    .execute();
}
export async function getFutureScheduledTodos(
  afterDate: string, // end of current week, YYYY-MM-DD
): Promise<Todo[]> {
  return db
    .selectFrom("todos")
    .selectAll()
    .where("status", "=", "open")
    .where("due_date", "is not", null)
    .where("due_date", ">", afterDate)
    .orderBy("due_date", "asc")
    .execute();
}
