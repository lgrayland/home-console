import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Button } from "@/ui/button";
import { Calendar, ArrowRight, TrendingUp, TrendingDown } from "lucide-react";
import type { CashFlowDirection } from "@/lib/db/types/accounts";
import { formatDueDate } from "@/lib/date";

interface UpcomingItem {
  id: string;
  name: string;
  direction: CashFlowDirection;
  amountPence: number;
  dueDay: number;
  accountName: string | null;
  nextDueDate: string;
}

interface UpcomingSectionProps {
  upcomingMonthly: UpcomingItem[];
}

function formatCurrency(pence: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "EUR",
  }).format(pence / 100);
}

export function UpcomingSection({ upcomingMonthly }: UpcomingSectionProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-muted p-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <CardTitle className="text-lg">Upcoming</CardTitle>
            <p className="text-sm text-muted-foreground">
              Next 8 monthly cash flows
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/finance">
            View all
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {upcomingMonthly.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-sm text-muted-foreground">
              No monthly cash flows with due dates yet
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {upcomingMonthly.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 rounded-lg border px-4 py-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {item.direction === "in" ? (
                    <TrendingUp className="h-4 w-4 shrink-0 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 shrink-0 text-orange-500" />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.accountName ?? "Unknown"} &middot;{" "}
                      {formatDueDate(item.nextDueDate)}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-sm font-medium tabular-nums whitespace-nowrap ${
                    item.direction === "in"
                      ? "text-green-500"
                      : "text-orange-500"
                  }`}
                >
                  {item.direction === "in" ? "+" : "-"}
                  {formatCurrency(item.amountPence)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
