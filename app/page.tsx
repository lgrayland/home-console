import { getDashboardData } from "@/lib/db/dashboard/queries";
import { FinancePulse } from "@/modules/dashboard/components/FinancePulse";
import { InboxSection } from "@/modules/dashboard/components/InboxSection";
import { TodoFocus } from "@/modules/dashboard/components/TodoFocus";
import { UpcomingSection } from "@/modules/dashboard/components/UpcomingSection";

export default async function HomePage() {
  const data = await getDashboardData();

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-foreground mb-2">
          Home Console
        </h1>
        <p className="text-muted-foreground">Quick overview</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <InboxSection
            thoughtsCount={data.inbox.thoughtsCount}
            latestThoughts={data.inbox.latestThoughts}
            oldestInboxDays={data.inbox.oldestInboxDays}
          />
          <UpcomingSection upcomingMonthly={data.finance.upcomingMonthly} />
        </div>

        <div className="space-y-6">
          <TodoFocus
            attentionItems={data.todos.focus.attentionItems}
            todayItems={data.todos.focus.todayItems}
          />
          <FinancePulse recurringTotals={data.finance.recurringTotals} />
        </div>
      </div>
    </div>
  );
}
