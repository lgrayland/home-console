import { Generated } from "kysely";
import { Timestamp } from ".";

export type AccountType = "current" | "savings" | "credit";
export type CashFlowDirection = "in" | "out";
export type CashFlowFrequency = "weekly" | "monthly" | "quarterly" | "yearly";

export interface AccountObject {
  id: string; // e.g. 'es_current', 'es_joint', 'es_credit_card'
  name: string;
  type: AccountType;
  currency: string; // char(3), e.g. 'EUR' or 'GBP'
  is_active: boolean;
  created_at: Generated<Timestamp>;
  updated_at: Generated<Timestamp>;
}
