import {
  Search,
  AlertTriangle,
  Inbox,
  CalendarClock,
  List,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/ui/card";
import { Input } from "@/ui/input";
import { ScrollArea } from "@/ui/scroll-area";
import { Todo } from "@/lib/db/types/todos";
import { WeekRange } from "@/lib/date";
import TodoSection from "./TodoSection";
import ListAddTodo from "./ListAddTodo";
import ListDoneTodos from "./ListDoneTodos";

export function TodoListPanel({
  week,
  weekTodos,
  overdue,
  unscheduled,
  scheduledFuture,
}: {
  week: WeekRange;
  weekTodos: Todo[];
  overdue: Todo[];
  unscheduled: Todo[];
  scheduledFuture: Todo[];
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // const { overduePastWeeks, unscheduled, scheduledFuture, done } =
  //   useMemo(() => {
  //     const filtered = todos.filter((todo) => {
  //       if (
  //         searchQuery &&
  //         !todo.title.toLowerCase().includes(searchQuery.toLowerCase())
  //       ) {
  //         return false;
  //       }
  //       if (filter === "open" && todo.status !== "open") return false;
  //       if (filter === "done" && todo.status !== "done") return false;
  //       return true;
  //     });

  //     const overduePastWeeks: Todo[] = [];
  //     const unscheduled: Todo[] = [];
  //     const scheduledFuture: Todo[] = [];
  //     const done: Todo[] = [];

  //     for (const todo of filtered) {
  //       if (todo.status === "done") {
  //         done.push(todo);
  //       } else if (!todo.dueDate) {
  //         unscheduled.push(todo);
  //       } else {
  //         const dueDate = new Date(todo.dueDate);
  //         dueDate.setHours(0, 0, 0, 0);

  //         if (dueDate < currentWeekStart) {
  //           overduePastWeeks.push(todo);
  //         } else if (dueDate > weekEnd) {
  //           scheduledFuture.push(todo);
  //         }
  //         // Items within current week are shown in the planner only
  //       }
  //     }

  //     return { overduePastWeeks, unscheduled, scheduledFuture, done };
  //   }, [todos, searchQuery, filter, currentWeekStart, weekEnd]);

  // const handleAddTodo = () => {
  //   if (newTodoTitle.trim()) {
  //     onAddTodo(newTodoTitle.trim());
  //     setNewTodoTitle("");
  //   }
  // };

  // const handleKeyDown = (e: React.KeyboardEvent) => {
  //   if (e.key === "Enter") {
  //     handleAddTodo();
  //   }
  // };

  return (
    <Card className="flex flex-col max-h-[calc(100vh-12rem)]">
      <CardHeader className="pb-3 space-y-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <ListAddTodo />
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden pt-0">
        <ScrollArea className="h-full pr-3">
          <div className="space-y-4 pb-4">
            {/* Overdue from past weeks */}
            {overdue.length > 0 && (
              <TodoSection
                title="Overdue (past weeks)"
                icon={<AlertTriangle className="h-4 w-4 text-amber-500" />}
                todos={overdue}
                week={week}
                variant="overdue"
              />
            )}

            {/* Unscheduled */}
            <TodoSection
              title="Unscheduled"
              icon={<Inbox className="h-4 w-4 text-muted-foreground" />}
              todos={unscheduled}
              week={week}
              emptyMessage="No unscheduled todos"
            />

            {/* Scheduled future */}
            {scheduledFuture.length > 0 && (
              <TodoSection
                title="Scheduled (future)"
                icon={
                  <CalendarClock className="h-4 w-4 text-muted-foreground" />
                }
                todos={scheduledFuture}
                week={week}
              />
            )}

            {/* Done - collapsible */}
            <ListDoneTodos
              todos={weekTodos.filter((todo) => todo.status === "done")}
              week={week}
            />
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
