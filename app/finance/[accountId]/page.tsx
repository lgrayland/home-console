import {
  getGroupedCashFlowsForAccount,
  getMonthlySummaryForAccount,
} from "@/lib/db/finance/queries";
import { CashFlowObject } from "@/lib/db/types";
import { CashflowList } from "@/modules/finance/components/CashFlowList";
import { SummaryCards } from "@/modules/finance/components/SummaryCards";

export default async function Account({
  params,
}: {
  params: Promise<{ accountId: string }>;
}) {
  const { accountId } = await params;

  const summaryValues = await getMonthlySummaryForAccount(accountId);
  const cashFlows = await getGroupedCashFlowsForAccount(accountId);

  return (
    <div className="mt-6 space-y-6">
      <SummaryCards values={summaryValues} />

      <div className="grid gap-6 lg:grid-cols-2">
        <CashflowList
          cashflows={
            cashFlows.outgoing as unknown as Record<string, CashFlowObject[]>
          }
          type="outgoing"
        />
        <CashflowList
          cashflows={
            cashFlows.incoming as unknown as Record<string, CashFlowObject[]>
          }
          type="money_in"
        />
      </div>
    </div>
  );
}
