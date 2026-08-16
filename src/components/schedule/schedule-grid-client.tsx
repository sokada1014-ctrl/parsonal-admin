"use client";

import { useState } from "react";
import { format, isToday } from "date-fns";
import { Link2Off } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TimeGutter } from "./time-gutter";
import { DayColumn } from "./day-column";
import { CandidateSlotsPanel, type CandidateSlot } from "./candidate-slots-panel";
import { BUSINESS_START_HOUR, minutesToLabel } from "@/lib/schedule-layout";
import { cn } from "@/lib/utils";
import type { AppointmentWithDetails } from "@/lib/data-access";
import type { GoogleBusyBlock } from "@/lib/types";

const WEEKDAY_LABELS = ["日", "月", "火", "水", "木", "金", "土"];

export function ScheduleGridClient({
  view,
  days,
  appointmentsByDay,
  busyBlocksByDay,
  customers,
}: {
  view: "week" | "day";
  days: Date[];
  appointmentsByDay: Map<string, AppointmentWithDetails[]>;
  busyBlocksByDay: Map<string, GoogleBusyBlock[]>;
  customers: { id: string; name: string }[];
}) {
  const [gcalConnected, setGcalConnected] = useState(false);
  const [candidates, setCandidates] = useState<
    (CandidateSlot & { dateKey: string; startMin: number; endMin: number })[]
  >([]);

  function handleSelectSlot(date: Date, startMin: number, endMin: number) {
    const label = `${format(date, "M/d(EEEEEE)")} ${minutesToLabel(BUSINESS_START_HOUR * 60 + startMin)}〜${minutesToLabel(
      BUSINESS_START_HOUR * 60 + endMin,
    )}`;
    setCandidates((prev) => [
      ...prev,
      {
        id: `${date.toISOString()}-${startMin}-${endMin}`,
        dateKey: format(date, "yyyy-MM-dd"),
        startMin,
        endMin,
        label,
      },
    ]);
  }

  function removeCandidate(id: string) {
    setCandidates((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs text-text-secondary">
          空いている時間をドラッグすると、顧客への提案候補として追加できます。
        </p>
        <Button
          type="button"
          variant={gcalConnected ? "secondary" : "outline"}
          size="sm"
          onClick={() => setGcalConnected((v) => !v)}
          className={cn("gap-1.5", gcalConnected && "text-primary")}
        >
          {gcalConnected ? (
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
          ) : (
            <Link2Off className="size-3.5" />
          )}
          {gcalConnected ? "Googleカレンダー連携中" : "Googleカレンダーと連携(デモ)"}
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-surface">
        <div className={cn("flex", view === "week" && "min-w-[640px]")}>
          <div className="flex flex-col">
            <div className="h-12 shrink-0 border-b border-border" />
            <TimeGutter />
          </div>
          {days.map((day) => {
            const key = format(day, "yyyy-MM-dd");
            return (
              <div key={key} className="flex flex-1 flex-col">
                <div
                  className={cn(
                    "flex h-12 shrink-0 flex-col items-center justify-center border-b border-l border-border",
                    isToday(day) && "bg-primary-light",
                  )}
                >
                  <span className={cn("text-xs font-medium", isToday(day) ? "text-primary" : "text-text-secondary")}>
                    {WEEKDAY_LABELS[day.getDay()]}
                  </span>
                  <span className={cn("text-sm font-semibold", isToday(day) ? "text-primary" : "text-text-primary")}>
                    {format(day, "d")}
                  </span>
                </div>
                <DayColumn
                  date={day}
                  appointments={appointmentsByDay.get(key) ?? []}
                  busyBlocks={gcalConnected ? busyBlocksByDay.get(key) ?? [] : []}
                  candidateSlots={candidates.filter((c) => c.dateKey === key)}
                  onRemoveCandidate={removeCandidate}
                  variant={view}
                  onSelectSlot={(startMin, endMin) => handleSelectSlot(day, startMin, endMin)}
                />
              </div>
            );
          })}
        </div>
      </div>

      <CandidateSlotsPanel
        slots={candidates}
        onRemove={removeCandidate}
        onClear={() => setCandidates([])}
        customers={customers}
      />
    </div>
  );
}
