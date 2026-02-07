import { Generated, Insertable, Selectable, Updateable } from "kysely";
import { Timestamp } from ".";

export type TodoStatus = "open" | "done";

export interface TodoObject {
  id: Generated<string>; // uuid
  title: string; // text
  notes: string | null; // text

  status: TodoStatus; // text
  due_date: Date | string | null; // date

  source_thought_id: string | null; // uuid

  created_at: Generated<Timestamp>;
  completed_at: Timestamp | null;
}

export type Todo = Selectable<TodoObject>;
export type NewTodo = Insertable<TodoObject>;
export type TodoUpdate = Updateable<TodoObject>;
