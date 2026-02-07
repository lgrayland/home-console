"use client";

import { isPast } from "date-fns/isPast";
import { CalendarOff, MoreHorizontal, Trash2 } from "lucide-react";
import { DayInfo } from "@/lib/date";
import { Todo } from "@/lib/db/types/todos";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/ui/checkbox";
import { Badge } from "@/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/modules/common/components/ui/dropdown-menu";
import { Button } from "@/ui/button";
import {
  deleteTodo,
  setTodoDueDate,
  setTodoStatus,
} from "@/lib/db/todos/mutations";

export default function PlannerTodoItem({
  todo,
  day,
}: {
  todo: Todo;
  day: DayInfo;
}) {
  const isOverdue =
    todo.due_date &&
    isPast(new Date(todo.due_date)) &&
    todo.status === "open" &&
    !day.isToday;

  return (
    <div
      key={todo.id}
      className={cn(
        "group flex items-start gap-2 rounded px-2 py-1.5 -mx-1",
        isOverdue && "bg-amber-500/10",
        todo.status === "done" && "opacity-60",
      )}
    >
      <Checkbox
        checked={todo.status === "done"}
        onCheckedChange={() =>
          setTodoStatus(todo.id, todo.status === "done" ? "open" : "done")
        }
        className="mt-0.5 h-3.5 w-3.5"
      />
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-xs leading-tight",
            todo.status === "done" && "line-through text-muted-foreground",
          )}
        >
          {todo.title}
        </p>
        {isOverdue && (
          <Badge
            variant="outline"
            className="mt-1 text-[10px] px-1 py-0 h-4 border-amber-500/50 text-amber-500"
          >
            Overdue
          </Badge>
        )}
        {day.isToday && todo.status === "open" && (
          <Badge
            variant="outline"
            className="mt-1 text-[10px] px-1 py-0 h-4 border-primary/50 text-primary"
          >
            Due today
          </Badge>
        )}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTodoDueDate(todo.id, null)}>
            <CalendarOff className="mr-2 h-4 w-4" />
            Unschedule
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => deleteTodo(todo.id)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
