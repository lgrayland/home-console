"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { WeekRange } from "@/lib/date";
import { Todo } from "@/lib/db/types/todos";
import TodoItem from "./ListTodoItem";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/modules/common/components/ui/collapsible";
import { cn } from "@/lib/utils";

export default function ListDoneTodos({
  todos,
  week,
}: {
  todos: Todo[];
  week: WeekRange;
}) {
  const [showDone, setShowDone] = useState(false);
  return (
    <>
      {todos.length > 0 && (
        <Collapsible open={showDone} onOpenChange={setShowDone}>
          <CollapsibleTrigger asChild>
            <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-full">
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  showDone && "rotate-180",
                )}
              />
              Done ({todos.length})
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2">
            <div className="space-y-1">
              {todos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} week={week} />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </>
  );
}
