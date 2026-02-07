import { WeekRange } from "@/lib/date";
import { Todo } from "@/lib/db/types/todos";
import { cn } from "@/lib/utils";
import { Badge } from "@/modules/common/components/ui/badge";
import TodoItem from "./ListTodoItem";

export default function TodoSection({
  title,
  icon,
  todos,
  week,
  variant = "default",
  emptyMessage,
}: {
  title: string;
  icon: React.ReactNode;
  todos: Todo[];
  week: WeekRange;
  variant?: "overdue" | "default";
  emptyMessage?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium">
        {icon}
        {title}
        {todos.length > 0 && (
          <Badge variant="secondary" className="ml-auto text-xs h-5">
            {todos.length}
          </Badge>
        )}
      </div>
      {todos.length === 0 ? (
        emptyMessage && (
          <p className="text-xs text-muted-foreground pl-6">{emptyMessage}</p>
        )
      ) : (
        <div
          className={cn(
            "space-y-1",
            variant === "overdue" && "bg-amber-500/5 rounded-lg p-2 -mx-2",
          )}
        >
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} week={week} />
          ))}
        </div>
      )}
    </div>
  );
}
