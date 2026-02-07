"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatWeekRange, WeekRange } from "@/lib/date";
import { Button } from "@/modules/common/components/ui/button";
import { addWeeks, formatISO, subWeeks } from "date-fns";

export default function WeekNav({ week }: { week: WeekRange }) {
  const router = useRouter();

  const isCurrentWeek = useMemo(() => {
    const currentWeekStart = week.start;
    return currentWeekStart.getTime() === new Date().setHours(0, 0, 0, 0);
  }, [week]);

  const goToWeek = (date: Date) => {
    router.push(`/todos?week=${formatISO(date, { representation: "date" })}`);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => goToWeek(subWeeks(week.start, 1))}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-sm text-muted-foreground min-w-32 text-center">
        {formatWeekRange(week.start)}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => goToWeek(addWeeks(week.start, 1))}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      {!isCurrentWeek && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToWeek(new Date())}
        >
          Today
        </Button>
      )}
    </div>
  );
}
