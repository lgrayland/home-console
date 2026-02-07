"use server";

import "server-only";
import { revalidatePath } from "next/cache";
import { db } from "../client";
import { CashFlowFrequency } from "../types/accounts";

export type CreateCashFlowInput = {
  accountId: string;
  name: string;
  direction: "in" | "out";
  amountPence: number; // minor units (EUR cents), integer
  frequency: CashFlowFrequency;
  category: string;
  paymentMethod?: string | null;
  dueDay?: string | null;
  notes?: string | null;
  isActive: boolean;
};

export async function createCashFlow(input: CreateCashFlowInput) {
  // Minimal server-side validation (don’t trust the client)
  const name = input.name?.trim();
  if (!name) throw new Error("Name is required");

  if (!input.accountId) throw new Error("Account is required");
  if (
    input.amountPence == null ||
    !Number.isInteger(input.amountPence) ||
    input.amountPence <= 0
  ) {
    throw new Error("Amount must be an integer greater than 0");
  }

  if (!["in", "out"].includes(input.direction))
    throw new Error("Direction is invalid");
  if (!["weekly", "monthly", "quarterly", "yearly"].includes(input.frequency)) {
    throw new Error("Frequency is invalid");
  }

  const category = input.category?.trim();
  if (!category) throw new Error("Category is required");

  const dueDay =
    input.dueDay == null || Number.isNaN(input.dueDay)
      ? null
      : parseInt(input.dueDay, 10);

  // IMPORTANT: matches DB constraint (1..28)
  if (dueDay != null && (dueDay < 1 || dueDay > 28)) {
    throw new Error("Due day must be between 1 and 28");
  }

  await db
    .insertInto("cash_flow")
    .values({
      account_id: input.accountId,
      name,
      direction: input.direction,
      amount_pence: input.amountPence,
      frequency: input.frequency,
      category,
      payment_method: input.paymentMethod?.trim() || null,
      due_day: dueDay,
      notes: input.notes?.trim() || null,
      is_active: input.isActive,
      sort_order: 0,
    })
    .execute();

  // Refresh the account page so the new row appears
  revalidatePath(`/console/finance/${input.accountId}`);
}
