import {
  type Generated,
  type ColumnType,
  Selectable,
  Insertable,
  Updateable,
} from "kysely";
import {
  AccountObject,
  CashFlowDirection,
  CashFlowFrequency,
} from "./accounts";
import { TodoObject } from "./todos";

/**
 * Helpers for Postgres column types
 */
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

/**
 * Table: cash_flow
 */
export interface CashFlowObject {
  id: Generated<string>; // uuid (gen_random_uuid())
  account_id: string; // FK -> account.id

  name: string;
  direction: CashFlowDirection; // 'in' | 'out'
  amount_pence: number; // integer > 0

  frequency: CashFlowFrequency;
  category: string;
  payment_method: string | null;

  due_day: number | null; // 1..28
  notes: string | null;

  is_active: boolean;
  sort_order: number;

  created_at: Generated<Timestamp>;
  updated_at: Generated<Timestamp>;
}

export type ThoughtStatus = "inbox" | "archived" | "discarded" | "converted";

export interface ThoughtObject {
  id: Generated<string>; // uuid
  content: string; // text
  status: ThoughtStatus; // text
  created_at: Generated<Timestamp>; // timestamptz
}

export type Thought = Selectable<ThoughtObject>;
export type NewThought = Insertable<ThoughtObject>;
export type ThoughtUpdate = Updateable<ThoughtObject>;

export interface DashboardData {
  inbox: {
    thoughtsCount: number;
    latestThoughts: ThoughtObject[];
    oldestInboxDays: number | null;
  };
  finance: {
    recurringTotals: Array<{
      direction: CashFlowDirection;
      frequency: CashFlowFrequency;
      totalPence: number;
    }>;
    upcomingMonthly: Array<{
      id: string;
      name: string;
      direction: CashFlowDirection;
      amountPence: number;
      dueDay: number;
      accountName: string | null;
      nextDueDate: string;
    }>;
  };
}

export interface Database {
  account: AccountObject;
  cash_flow: CashFlowObject;
  thoughts: ThoughtObject;
  todos: TodoObject;
}
