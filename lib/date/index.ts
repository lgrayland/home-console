import {
  eachDayOfInterval,
  endOfWeek,
  format,
  isPast,
  startOfWeek,
} from "date-fns";

export function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  // If Sunday (0) we want the Monday 6 days earlier; otherwise go back (day - 1) days
  const diff = d.getDate() - (day === 0 ? 6 : day - 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export interface WeekRange {
  start: Date;
  end: Date;
  startISO: string;
  endISO: string;
}

export function getWeekRange(date: Date): WeekRange {
  const start = startOfWeek(date, { weekStartsOn: 1 }); // Monday
  const end = endOfWeek(date, { weekStartsOn: 1 });

  return {
    start,
    end,
    startISO: start.toISOString().slice(0, 10),
    endISO: end.toISOString().slice(0, 10),
  };
}

export interface DayInfo {
  date: Date;
  iso: string;
  label: string;
  dayNumber: string;
  isToday: boolean;
  isPast: boolean;
}
export function getWeekDays(start: Date, end: Date): DayInfo[] {
  return eachDayOfInterval({ start, end }).map((day) => ({
    date: day,
    iso: format(day, "yyyy-MM-dd"),
    label: format(day, "EEE"), // Mon, Tue
    dayNumber: format(day, "d"), // 1–31
    isToday: format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd"),
    isPast:
      isPast(day) &&
      format(day, "yyyy-MM-dd") !== format(new Date(), "yyyy-MM-dd"),
  }));
}

export function formatWeekRange(date: Date): string {
  const currentWeekStart = getStartOfWeek(date);
  const weekEndDate = new Date(currentWeekStart);
  weekEndDate.setDate(weekEndDate.getDate() + 6);
  weekEndDate.setHours(0, 0, 0, 0);

  const startMonth = currentWeekStart.toLocaleDateString("en-GB", {
    month: "short",
  });
  const endMonth = weekEndDate.toLocaleDateString("en-GB", {
    month: "short",
  });
  const startDay = currentWeekStart.getDate();
  const endDay = weekEndDate.getDate();

  if (startMonth === endMonth) {
    return `${startMonth} ${startDay} – ${endDay}`;
  }
  return `${startMonth} ${startDay} – ${endMonth} ${endDay}`;
}

export function formatDueDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.ceil(
    (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays < 7) return `${diffDays} days`;

  return format(date, "d MMM");
}
