import { db } from "../client";
import { Generated, sql } from "kysely";
import { DashboardData, ThoughtStatus, Timestamp } from "../types";

// You can replace `any` with your DB type
export async function getDashboardData(): Promise<DashboardData> {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = today.getDate();

  // 1) Thoughts: inbox count
  const thoughtsCountRow = await db
    .selectFrom("thoughts")
    .select((eb) => eb.fn.countAll<number>().as("count"))
    .where("status", "=", "inbox" as ThoughtStatus)
    .executeTakeFirstOrThrow();

  const thoughtsCount = Number(thoughtsCountRow.count ?? 0);

  // 2) Thoughts: latest 5 inbox
  const latestThoughts = await db
    .selectFrom("thoughts")
    .select(["id", "content", "created_at", "status"])
    .where("status", "=", "inbox" as ThoughtStatus)
    .orderBy("created_at", "desc")
    .limit(5)
    .execute();

  // 3) Thoughts: oldest inbox age in days
  // Uses Postgres AGE() and extracts days. Returns null if no inbox.
  const oldestRow = await db
    .selectFrom("thoughts")
    .select((eb) => eb.fn.min("created_at").as("oldest_created_at"))
    .where("status", "=", "inbox" as ThoughtStatus)
    .executeTakeFirst();

  let oldestInboxDays: number | null = null;
  if (oldestRow?.oldest_created_at) {
    const oldest = new Date(oldestRow.oldest_created_at);
    const diffMs = today.getTime() - oldest.getTime();
    oldestInboxDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  }

  // 4) Finance: recurring totals by direction + frequency (active only)
  const recurringTotals = await db
    .selectFrom("cash_flow")
    .select(["direction", "frequency"])
    .select((eb) => eb.fn.sum<number>("amount_pence").as("total_pence"))
    .where("is_active", "=", true)
    .groupBy(["direction", "frequency"])
    .orderBy("direction", "asc")
    .orderBy("frequency", "asc")
    .execute()
    .then((rows) =>
      rows.map((r) => ({
        direction: r.direction,
        frequency: r.frequency,
        totalPence: Number(r.total_pence ?? 0),
      })),
    );

  // 5) Finance: upcoming monthly cash flows (v1-safe)
  // - Only monthly with due_day
  // - Compute "next due date" based on whether due_day is >= today day
  // - Join account for display
  //
  // NOTE: this is Postgres-specific SQL via Kysely sql`...`
  const upcomingMonthly = await db
    .selectFrom("cash_flow as cf")
    .leftJoin("account as a", "a.id", "cf.account_id")
    .select([
      "cf.id",
      "cf.name",
      "cf.direction",
      "cf.amount_pence",
      "cf.due_day",
      "a.name as account_name",
    ])
    .select(() =>
      sql<string>`
        (
          CASE
            WHEN cf.due_day >= ${dd}
              THEN make_date(${yyyy}, ${Number(mm)}, cf.due_day)
            ELSE
              make_date(
                extract(year from (date_trunc('month', current_date) + interval '1 month'))::int,
                extract(month from (date_trunc('month', current_date) + interval '1 month'))::int,
                cf.due_day
              )
          END
        )::date
      `.as("next_due_date"),
    )
    .where("cf.is_active", "=", true)
    .where("cf.frequency", "=", "monthly")
    .where("cf.due_day", "is not", null)
    .orderBy(sql`next_due_date`, "asc")
    .limit(8)
    .execute();

  // 6) Todos: Focus widget data (server-date-safe via current_date)
  // Overdue (open + due_date < current_date)
  const overdueRows = await db
    .selectFrom("todos")
    .select(["id", "title", "due_date"])
    .select((eb) =>
      sql<number>`(current_date - ${eb.ref("due_date")})`.as("days_overdue"),
    )
    .where("status", "=", "open")
    .where("due_date", "is not", null)
    .where(sql<boolean>`due_date < current_date`)
    .orderBy("due_date", "asc")
    .limit(3)
    .execute();

  // Unscheduled (open + due_date is null)
  const unscheduledRows = await db
    .selectFrom("todos")
    .select(["id", "title"])
    .where("status", "=", "open")
    .where("due_date", "is", null)
    .orderBy("created_at", "desc")
    .limit(3)
    .execute();

  // Today (open + due_date = current_date)
  const todayRows = await db
    .selectFrom("todos")
    .select(["id", "title"])
    .where("status", "=", "open")
    .where(sql<boolean>`due_date = current_date`)
    .orderBy("created_at", "asc")
    .limit(5)
    .execute();

  // Merge + shape for widget
  const attentionItems = [
    ...overdueRows.map((t) => ({
      id: String(t.id),
      title: String(t.title),
      status: "overdue" as const,
      daysOverdue: Number((t as { days_overdue?: number }).days_overdue ?? 0),
    })),
    ...unscheduledRows.map((t) => ({
      id: String(t.id),
      title: String(t.title),
      status: "unscheduled" as const,
    })),
  ];

  const todayItems = todayRows.map((t) => ({
    id: String(t.id),
    title: String(t.title),
    status: "today" as const,
  }));

  return {
    inbox: {
      thoughtsCount,
      latestThoughts: latestThoughts.map((t) => ({
        id: t.id as unknown as Generated<string>,
        content: String(t.content),
        status: t.status,
        created_at: t.created_at as unknown as Generated<Timestamp>,
      })),
      oldestInboxDays,
    },
    finance: {
      recurringTotals,
      upcomingMonthly: upcomingMonthly.map((r) => ({
        id: String(r.id),
        name: String(r.name),
        direction: r.direction,
        amountPence: Number(r.amount_pence),
        dueDay: Number(r.due_day),
        accountName: r.account_name ? String(r.account_name) : null,
        nextDueDate: new Date(r.next_due_date).toISOString().slice(0, 10),
      })),
    },
    todos: {
      focus: {
        attentionItems,
        todayItems,
      },
    },
  };
}
