import { getAccounts } from "@/lib/db/finance/queries";
import { notFound } from "next/navigation";
import { Badge } from "@/ui/badge";
import { AccountTabs } from "@/modules/finance/components/AccountTabs";
import { AddCashFlowDialog } from "@/modules/finance/components/AddCashFlowDialog";

const ORDER = ["es_current", "es_joint", "es_credit_card"] as const;

export default async function FinanceAccountLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ accountId: string }>;
}) {
  const { accountId } = await params;

  const accounts = await getAccounts();

  const active = accounts.find((a) => a.id === accountId);
  if (!active) notFound();

  const tabs = ORDER.map((id) => {
    const acc = accounts.find((a) => a.id === id);
    return acc
      ? { id: acc.id, label: acc.name, href: `/finance/${acc.id}` }
      : null;
  }).filter(Boolean) as Array<{ id: string; label: string; href: string }>;


  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            Finance
          </h1>
        </div>
        <Badge variant="outline" className="text-sm rounded-md">
          EUR
        </Badge>
      </div>

      <AccountTabs accountId={accountId} tabs={tabs} />

      {children}

      <AddCashFlowDialog />
    </div>
  );
}
