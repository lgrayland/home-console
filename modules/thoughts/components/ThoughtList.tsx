"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Button } from "@/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import {
  MoreHorizontal,
  CheckSquare,
  Archive,
  Trash2,
  Inbox,
} from "lucide-react";
import { Thought, Timestamp } from "@/lib/db/types";
import { archiveThoughtAction, discardThoughtAction } from "../actions";
import { convertThoughtToTodo } from "@/lib/db/workflows/convertThoughtToTodo";

function formatRelativeTime(timestamp: Timestamp): string {
  const now = new Date();
  const date = new Date(timestamp as unknown as string);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function ThoughtList({ thoughts }: { thoughts: Thought[] }) {
  if (thoughts.length === 0) {
    return (
      <Card>
        <CardContent className="py-16">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-4 rounded-full bg-muted p-3">
              <Inbox className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Your inbox is clear. Capture thoughts as they come.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Inbox</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {thoughts.map((thought) => (
            <div
              key={thought.id}
              className="group flex items-start justify-between gap-4 rounded-lg px-3 py-3 -mx-3 hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{thought.content}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatRelativeTime(thought.created_at)}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => convertThoughtToTodo(thought.id)}
                  >
                    <CheckSquare className="mr-2 h-4 w-4" />
                    Convert to Todo
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => archiveThoughtAction(thought.id)}
                  >
                    <Archive className="mr-2 h-4 w-4" />
                    Archive
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => discardThoughtAction(thought.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Discard
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
