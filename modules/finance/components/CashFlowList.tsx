import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Badge } from "@/ui/badge";
import { CashFlowObject } from "@/lib/db/types";
import { formatCurrency } from "../utils/currency";

function calculateMonthlyAmount(amount: number, frequency: string): number {
  switch (frequency) {
    case "weekly":
      return amount * 4.33;
    case "monthly":
      return amount;
    case "quarterly":
      return amount / 3;
    case "yearly":
      return amount / 12;
    default:
      return amount;
  }
}

export function CashflowList({
  cashflows,
  type,
}: {
  cashflows: Record<string, CashFlowObject[]>;
  type: "money_in" | "outgoing";
}) {
  const title = type === "money_in" ? "Money in" : "Regular outgoings";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(cashflows).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                {category}
              </h3>
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={String(item.id)}
                    className="flex items-start justify-between border-b border-border pb-3 last:border-0"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {item.payment_method}
                        </Badge>
                        <span className="text-xs text-muted-foreground capitalize">
                          {item.frequency}
                        </span>
                        {item.due_day && (
                          <span className="text-xs text-muted-foreground">
                            • Day {item.due_day}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">
                        {formatCurrency(item.amount_pence)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(
                          calculateMonthlyAmount(
                            item.amount_pence,
                            item.frequency,
                          ),
                        )}
                        /mo
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {!!cashflows.length && (
            <p className="text-sm text-muted-foreground text-center py-8">
              No {type === "money_in" ? "income" : "outgoings"} for this account
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
