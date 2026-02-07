"use client";

import { useState } from "react";
import { formatDueDate, getWeekDays, WeekRange } from "@/lib/date";
import { Todo } from "@/lib/db/types/todos";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/modules/common/components/ui/checkbox";
import { Badge } from "@/modules/common/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/modules/common/components/ui/popover";
import { Button } from "@/modules/common/components/ui/button";
import { CalendarIcon, MoreHorizontal, Trash2 } from "lucide-react";
import { Calendar } from "@/modules/common/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/modules/common/components/ui/dropdown-menu";
import {
  deleteTodo,
  setTodoDueDate,
  setTodoStatus,
} from "@/lib/db/todos/mutations";

export default function TodoItem({
  todo,
  week,
}: {
  todo: Todo;
  week: WeekRange;
}) {
  const [calendarOpen, setCalendarOpen] = useState(false);

  const weekDays = getWeekDays(week.start, week.end);
  return (
    <div
      className={cn(
        "group flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-muted/50 transition-colors",
      )}
    >
      <Checkbox
        checked={todo.status === "done"}
        onCheckedChange={() =>
          setTodoStatus(todo.id, todo.status === "done" ? "open" : "done")
        }
        className="h-4 w-4"
      />
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm truncate",
            todo.status === "done" && "line-through text-muted-foreground",
          )}
        >
          {todo.title}
        </p>
      </div>

      {todo.due_date && (
        <Badge variant="outline" className="text-xs shrink-0">
          {formatDueDate(todo.due_date as string)}
        </Badge>
      )}

      <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
          >
            <CalendarIcon className="h-3.5 w-3.5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <div className="p-2 border-b">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Quick assign (this week)
            </p>
            <div className="grid grid-cols-4 gap-1">
              {weekDays.map((day) => (
                <Button
                  key={day.date.toISOString()}
                  variant="outline"
                  size="sm"
                  className="text-xs h-8 bg-transparent"
                  onClick={() => {
                    setTodoDueDate(todo.id, day.date);
                    setCalendarOpen(false);
                  }}
                >
                  {day.label}
                </Button>
              ))}
            </div>
          </div>
          <Calendar
            mode="single"
            selected={todo.due_date ? new Date(todo.due_date) : undefined}
            onSelect={(date) => {
              setTodoDueDate(todo.id, date || null);
              setCalendarOpen(false);
            }}
            autoFocus
          />
        </PopoverContent>
      </Popover>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
          >
            <MoreHorizontal className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {todo.due_date && (
            <>
              <DropdownMenuItem onClick={() => setTodoDueDate(todo.id, null)}>
                Remove date
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
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
