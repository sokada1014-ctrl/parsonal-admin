"use client";

import { useRouter } from "next/navigation";
import { addDays, addMonths, addWeeks, format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ViewMode = "month" | "week" | "day";

const viewLabels: { value: ViewMode; label: string }[] = [
  { value: "month", label: "月" },
  { value: "week", label: "週" },
  { value: "day", label: "日" },
];

export function ScheduleToolbar({ view, date, title }: { view: ViewMode; date: string; title: string }) {
  const router = useRouter();

  function go(nextDate: Date, nextView: ViewMode = view) {
    router.push(`/schedule?view=${nextView}&date=${format(nextDate, "yyyy-MM-dd")}`);
  }

  function shift(direction: 1 | -1) {
    const current = new Date(`${date}T00:00:00`);
    if (view === "month") return go(addMonths(current, direction));
    if (view === "week") return go(addWeeks(current, direction));
    return go(addDays(current, direction));
  }

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => shift(-1)}>
          <ChevronLeft className="size-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => shift(1)}>
          <ChevronRight className="size-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => go(new Date())}>
          今日
        </Button>
        <h2 className="ml-2 text-base font-semibold text-text-primary">{title}</h2>
      </div>

      <div className="flex rounded-lg border border-border p-0.5">
        {viewLabels.map((v) => (
          <button
            key={v.value}
            onClick={() => go(new Date(`${date}T00:00:00`), v.value)}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-shadow duration-150",
              view === v.value
                ? "bg-primary-light text-primary shadow-sm"
                : "text-text-secondary hover:bg-muted hover:text-text-primary",
            )}
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  );
}
