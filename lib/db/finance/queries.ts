import { db } from "../client";
import type { CashFlowFrequency } from "../types/accounts";

type AccountId = string;

const monthlyFactor: Record<CashFlowFrequency, number> = {
  weekly: 52 / 12,
  monthly: 1,
  quarterly: 1 / 3,
  yearly: 1 / 12,
};

/**
 * Convert pence to "monthly pence" using a consistent rounding strategy.
 * - We round to nearest penny at the end.
 */
function toMonthlyPence(
  amountPence: number,
  frequency: CashFlowFrequency,
): number {
  return Math.round(amountPence * monthlyFactor[frequency]);
}

export async function getAccounts() {
  return db
    .selectFrom("account")
    .select(["id", "name", "type", "currency"])
    .where("is_active", "=", true)
    .orderBy("name")
    .execute();
}

export async function getCashFlowsForAccount(accountId: AccountId) {
  return db
    .selectFrom("cash_flow")
    .select([
      "id",
      "account_id",
      "name",
      "direction",
      "amount_pence",
      "frequency",
      "category",
      "payment_method",
      "due_day",
      "notes",
      "is_active",
      "sort_order",
      "created_at",
      "updated_at",
    ])
    .where("account_id", "=", accountId)
    .where("is_active", "=", true)
    .orderBy("sort_order")
    .orderBy("name")
    .execute();
}

/**
 * KPI totals: Money in / Regular outgoings / Expected remaining (all monthly-normalised)
 */
export async function getMonthlySummaryForAccount(accountId: AccountId) {
  const flows = await getCashFlowsForAccount(accountId);

  let moneyIn = 0;
  let outgoings = 0;

  for (const f of flows) {
    const monthly = toMonthlyPence(f.amount_pence, f.frequency);
    if (f.direction === "in") moneyIn += monthly;
    else outgoings += monthly;
  }

  return {
    moneyInMonthlyPence: moneyIn,
    outgoingsMonthlyPence: outgoings,
    remainingMonthlyPence: moneyIn - outgoings,
  };
}

/**
 * Grouped lists for widgets
 */
export async function getGroupedCashFlowsForAccount(accountId: AccountId) {
  const flows = await getCashFlowsForAccount(accountId);

  const incoming = flows.filter((f) => f.direction === "in");
  const outgoing = flows.filter((f) => f.direction === "out");

  const groupByCategory = (items: typeof outgoing) => {
    const grouped: Record<string, typeof items> = {};
    for (const item of items) {
      grouped[item.category] ??= [];
      grouped[item.category].push(item);
    }
    return grouped;
  };

  return {
    incoming: groupByCategory(incoming),
    outgoing: groupByCategory(outgoing),
  };
}
