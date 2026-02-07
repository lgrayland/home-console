import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Button } from "@/ui/button";
import { Banknote, ArrowRight, TrendingUp, TrendingDown } from "lucide-react";
import type {
  CashFlowDirection,
  CashFlowFrequency,
} from "@/lib/db/types/accounts";

interface RecurringTotal {
  direction: CashFlowDirection;
  frequency: CashFlowFrequency;
  totalPence: number;
}

interface FinancePulseProps {
  recurringTotals: RecurringTotal[];
}

function formatCurrency(pence: number): string {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
  }).format(pence / 100);
}

function frequencyToMonthly(
  totalPence: number,
  frequency: CashFlowFrequency,
): number {
  switch (frequency) {
    case "weekly":
      return totalPence * 4.33;
    case "monthly":
      return totalPence;
    case "quarterly":
      return totalPence / 3;
    case "yearly":
      return totalPence / 12;
    default:
      return totalPence;
  }
}

export function FinancePulse({ recurringTotals }: FinancePulseProps) {
  // Calculate monthly totals
  const monthlyIn = recurringTotals
    .filter((t) => t.direction === "in")
    .reduce((sum, t) => sum + frequencyToMonthly(t.totalPence, t.frequency), 0);

  const monthlyOut = recurringTotals
    .filter((t) => t.direction === "out")
    .reduce((sum, t) => sum + frequencyToMonthly(t.totalPence, t.frequency), 0);

  const monthlyRemaining = monthlyIn - monthlyOut;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-muted p-2">
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </div>
          <CardTitle className="text-lg">Finance</CardTitle>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/finance">
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Money in</span>
            </div>
            <span className="text-sm font-medium text-green-500">
              {formatCurrency(monthlyIn)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-orange-500" />
              <span className="text-sm text-muted-foreground">Outgoings</span>
            </div>
            <span className="text-sm font-medium text-orange-500">
              {formatCurrency(monthlyOut)}
            </span>
          </div>

          <div className="h-px bg-border" />

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Remaining</span>
            <span
              className={`text-lg font-semibold ${monthlyRemaining >= 0 ? "text-blue-500" : "text-red-500"}`}
            >
              {formatCurrency(monthlyRemaining)}
            </span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Monthly estimate based on recurring cash flows
        </p>
      </CardContent>
    </Card>
  );
}
