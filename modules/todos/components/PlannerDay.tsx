import { DayInfo } from "@/lib/date";
import { Todo } from "@/lib/db/types/todos";
import { cn } from "@/lib/utils";
import PlannerTodoItem from "./PlannerTodoItem";

export default function PlannerDay({
  day,
  dayTodos,
}: {
  day: DayInfo;
  dayTodos: Todo[];
}) {
  return (
    <div
      className={cn(
        "rounded-lg border p-3 min-h-32",
        day.isToday && "border-primary/50 bg-primary/5",
        day.isPast && !day.isToday && "bg-muted/30",
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground uppercase">
            {day.label}
          </span>
          <span
            className={cn(
              "text-sm font-semibold",
              day.isToday &&
                "bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center",
            )}
          >
            {day.date.getDate()}
          </span>
        </div>
      </div>

      <div className="space-y-1">
        {dayTodos.length === 0 ? (
          <p className="text-xs text-muted-foreground/50 italic">No tasks</p>
        ) : (
          dayTodos.map((todo) => {
            return <PlannerTodoItem key={todo.id} todo={todo} day={day} />;
          })
        )}
      </div>
    </div>
  );
}
