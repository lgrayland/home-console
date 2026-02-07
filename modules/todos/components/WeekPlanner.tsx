import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { getWeekDays, WeekRange } from "@/lib/date";
import { Todo } from "@/lib/db/types/todos";
import WeekNav from "./WeekNav";
import PlannerDay from "./PlannerDay";
import { isSameDay } from "date-fns";

export async function WeekPlanner({
  todos,
  week,
}: {
  todos: Todo[];
  week: WeekRange;
}) {
  const weekDays = getWeekDays(week.start, week.end);

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Weekly Plan</CardTitle>
          <WeekNav week={week} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {weekDays.map((day) => {
            const dayTodos = todos.filter(
              (todo) =>
                todo.due_date && isSameDay(new Date(todo.due_date), day.date),
            );

            return <PlannerDay key={day.iso} day={day} dayTodos={dayTodos} />;
          })}
        </div>
      </CardContent>
    </Card>
  );
}
