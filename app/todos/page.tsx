import { WeekPlanner } from "@/modules/todos/components/WeekPlanner";
import { TodoListPanel } from "@/modules/todos/components/TodoListPanel";
import { getWeekRange } from "@/lib/date";
import {
  getFutureScheduledTodos,
  getOverdueTodos,
  getTodosForDateRange,
  getUnscheduledTodos,
} from "@/lib/db/todos/queries";

export default async function TodosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const week = (await searchParams).week;
  const baseDate = week ? new Date(week as string) : new Date();

  const weekRange = getWeekRange(baseDate);

  const [weekTodos, overdue, unscheduled, scheduledFuture] = await Promise.all([
    getTodosForDateRange(weekRange.startISO, weekRange.endISO),
    getOverdueTodos(weekRange.startISO),
    getUnscheduledTodos(),
    getFutureScheduledTodos(weekRange.endISO),
  ]);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-foreground mb-2">Todos</h1>
        <p className="text-muted-foreground">Plan your week</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <WeekPlanner
            week={weekRange}
            todos={weekTodos}
            // currentWeekStart={currentWeekStart}
            // onPrevWeek={handlePrevWeek}
            // onNextWeek={handleNextWeek}
            // onToday={handleToday}
          />
        </div>
        <div className="lg:col-span-1">
          <TodoListPanel
            week={weekRange}
            weekTodos={weekTodos}
            overdue={overdue}
            unscheduled={unscheduled}
            scheduledFuture={scheduledFuture}
            // currentWeekStart={currentWeekStart}
          />
        </div>
      </div>
    </div>
  );
}
