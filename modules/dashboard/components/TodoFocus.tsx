import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Button } from "@/ui/button";
import { Target, ArrowRight, AlertTriangle, Clock } from "lucide-react";
import { Badge } from "@/ui/badge";

interface FocusTodo {
  id: string;
  title: string;
  status: "overdue" | "unscheduled" | "today";
  daysOverdue?: number;
}

interface TodoFocusProps {
  attentionItems: FocusTodo[];
  todayItems: FocusTodo[];
}

export function TodoFocus({ attentionItems, todayItems }: TodoFocusProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-muted p-2">
            <Target className="h-4 w-4 text-muted-foreground" />
          </div>
          <CardTitle className="text-lg">Focus</CardTitle>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/todos">
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Attention required */}
        <div className="space-y-2.5">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Attention required
          </p>
          {attentionItems.length === 0 ? (
            <p className="text-sm text-muted-foreground py-1">
              No urgent todos
            </p>
          ) : (
            <div className="space-y-2">
              {attentionItems.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-3 rounded-lg border px-3 py-2.5"
                >
                  <p className="text-sm text-foreground line-clamp-1">
                    {item.title}
                  </p>
                  {item.status === "overdue" ? (
                    <Badge
                      variant="outline"
                      className="shrink-0 border-red-500/30 bg-red-500/10 text-red-500 text-[10px]"
                    >
                      <AlertTriangle className="mr-1 h-3 w-3" />
                      {item.daysOverdue}d overdue
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="shrink-0 border-border text-muted-foreground text-[10px]"
                    >
                      <Clock className="mr-1 h-3 w-3" />
                      Unscheduled
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="h-px bg-border" />

        {/* Today */}
        <div className="space-y-2.5">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Today
          </p>
          {todayItems.length === 0 ? (
            <p className="text-sm text-muted-foreground py-1">
              Nothing scheduled today
            </p>
          ) : (
            <div className="space-y-1.5">
              {todayItems.map((item) => (
                <p key={item.id} className="text-sm text-foreground">
                  {item.title}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center text-muted-foreground"
            asChild
          >
            <Link href="/todos">
              Open planner
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
