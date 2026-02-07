import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { formatCurrency } from "../utils/currency";

export function SummaryCards({
  values,
}: {
  values: {
    moneyInMonthlyPence: number;
    outgoingsMonthlyPence: number;
    remainingMonthlyPence: number;
  };
}) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Money in (monthly)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold text-green-500">
            {formatCurrency(values.moneyInMonthlyPence)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Regular outgoings (monthly)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold text-orange-500">
            {formatCurrency(values.outgoingsMonthlyPence)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Expected remaining (monthly)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p
            className={`text-2xl font-semibold ${
              values.remainingMonthlyPence >= 0
                ? "text-blue-500"
                : "text-red-500"
            }`}
          >
            {formatCurrency(values.remainingMonthlyPence)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
