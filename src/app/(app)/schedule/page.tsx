import Link from "next/link";
import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { PageHeader } from "@/components/page-header";
import { ScheduleToolbar } from "@/components/schedule/schedule-toolbar";
import { AppointmentChip } from "@/components/schedule/appointment-chip";
import { NewAppointmentDialog } from "@/components/schedule/new-appointment-dialog";
import { ScheduleGridClient } from "@/components/schedule/schedule-grid-client";
import {
  getAppointmentsInRange,
  getCustomerListItems,
  getGoogleBusyBlocksInRange,
  getMenuItems,
  getStaffList,
} from "@/lib/data-access";
import { cn } from "@/lib/utils";
import type { GoogleBusyBlock } from "@/lib/types";

const WEEKDAY_LABELS = ["日", "月", "火", "水", "木", "金", "土"];

type ViewMode = "month" | "week" | "day";

function groupByDay<T extends { startAt: string }>(items: T[]) {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const key = format(new Date(item.startAt), "yyyy-MM-dd");
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(item);
  }
  return map;
}

export default async function SchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; date?: string }>;
}) {
  const { view: rawView, date: rawDate } = await searchParams;
  const view: ViewMode = rawView === "week" || rawView === "day" ? rawView : "month";
  const baseDate = rawDate ? new Date(`${rawDate}T00:00:00`) : new Date();
  baseDate.setHours(0, 0, 0, 0);
  const dateParam = format(baseDate, "yyyy-MM-dd");

  let rangeStart: Date;
  let rangeEnd: Date;
  let title: string;

  if (view === "month") {
    rangeStart = startOfWeek(startOfMonth(baseDate));
    rangeEnd = addDays(endOfWeek(endOfMonth(baseDate)), 1);
    title = format(baseDate, "yyyy年M月");
  } else if (view === "week") {
    rangeStart = startOfWeek(baseDate);
    rangeEnd = addDays(endOfWeek(baseDate), 1);
    title = `${format(rangeStart, "yyyy年M月d日")} 〜 ${format(addDays(rangeEnd, -1), "M月d日")}`;
  } else {
    rangeStart = baseDate;
    rangeEnd = addDays(baseDate, 1);
    title = format(baseDate, "yyyy年M月d日(EEEEEE)");
  }

  const [appointments, customerItems, staffList, busyBlocks, menuItems] = await Promise.all([
    getAppointmentsInRange(rangeStart, rangeEnd),
    getCustomerListItems({ status: "active" }),
    getStaffList(),
    getGoogleBusyBlocksInRange(rangeStart, rangeEnd),
    getMenuItems(),
  ]);
  const byDay = groupByDay(appointments);
  const busyByDay = groupByDay<GoogleBusyBlock>(busyBlocks);
  const customerOptions = customerItems.map((c) => ({
    id: c.customer.id,
    name: c.customer.name,
    pairedCustomerId: c.customer.pairedCustomerId,
  }));

  return (
    <div>
      <PageHeader
        title="スケジュール"
        description="予約の確認・登録ができます"
        actions={
          <NewAppointmentDialog
            customers={customerOptions}
            staffList={staffList.map((s) => ({ id: s.id, name: s.name }))}
            menuOptions={menuItems.map((m) => m.name)}
            defaultDate={dateParam}
          />
        }
      />

      <ScheduleToolbar view={view} date={dateParam} title={title} />

      {view === "month" && (
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <div className="grid grid-cols-7 border-b border-border">
            {WEEKDAY_LABELS.map((d) => (
              <div key={d} className="py-2 text-center text-xs font-medium text-text-secondary">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {eachDayOfInterval({ start: rangeStart, end: addDays(rangeEnd, -1) }).map((day) => {
              const key = format(day, "yyyy-MM-dd");
              const allDayAppointments = byDay.get(key) ?? [];
              const dayAppointments = allDayAppointments.slice(0, 4);
              const overflow = allDayAppointments.length - dayAppointments.length;
              const dotCount = Math.min(allDayAppointments.length, 3);
              return (
                <div
                  key={key}
                  className={cn(
                    "flex min-h-[56px] flex-col gap-1 border-r border-b border-border p-1 sm:min-h-[110px] sm:p-1.5 last:border-r-0",
                    !isSameMonth(day, baseDate) && "bg-muted/40",
                  )}
                >
                  {/* モバイル: 件数のみのコンパクト表示。タップでその日の詳細(日表示)へ */}
                  <Link
                    href={`/schedule?view=day&date=${key}`}
                    className="flex flex-1 flex-col items-center gap-1 pt-0.5 sm:hidden"
                  >
                    <span
                      className={cn(
                        "flex size-6 items-center justify-center rounded-full text-xs font-medium",
                        isToday(day) ? "bg-primary text-white" : "text-text-secondary",
                      )}
                    >
                      {format(day, "d")}
                    </span>
                    {allDayAppointments.length > 0 && (
                      <span className="flex items-center gap-0.5">
                        {Array.from({ length: dotCount }).map((_, i) => (
                          <span key={i} className="size-1.5 rounded-full bg-primary" />
                        ))}
                        {allDayAppointments.length > dotCount && (
                          <span className="text-[10px] leading-none text-text-muted">
                            +{allDayAppointments.length - dotCount}
                          </span>
                        )}
                      </span>
                    )}
                  </Link>

                  {/* デスクトップ: 予約チップをそのまま表示 */}
                  <div className="hidden sm:flex sm:flex-col sm:gap-1">
                    <span
                      className={cn(
                        "mb-0.5 flex size-6 items-center justify-center rounded-full text-xs font-medium",
                        isToday(day) ? "bg-primary text-white" : "text-text-secondary",
                      )}
                    >
                      {format(day, "d")}
                    </span>
                    {dayAppointments.map((a) => (
                      <AppointmentChip key={a.id} appointment={a} />
                    ))}
                    {overflow > 0 && <span className="px-1.5 text-xs text-text-muted">他{overflow}件</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {view === "week" && (
        <div className="flex flex-col gap-3 md:hidden">
          {eachDayOfInterval({ start: rangeStart, end: addDays(rangeEnd, -1) }).map((day) => {
            const key = format(day, "yyyy-MM-dd");
            const dayAppointments = byDay.get(key) ?? [];
            return (
              <div key={key} className="rounded-xl border border-border bg-surface p-3">
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className={cn(
                      "flex size-6 items-center justify-center rounded-full text-xs font-medium",
                      isToday(day) ? "bg-primary text-white" : "text-text-secondary",
                    )}
                  >
                    {format(day, "d")}
                  </span>
                  <span className="text-sm font-medium text-text-primary">
                    {WEEKDAY_LABELS[day.getDay()]}曜日
                  </span>
                </div>
                {dayAppointments.length === 0 ? (
                  <p className="pl-8 text-xs text-text-muted">予定なし</p>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    {dayAppointments.map((a) => (
                      <AppointmentChip key={a.id} appointment={a} compact={false} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {(view === "week" || view === "day") && (
        <div className={view === "week" ? "hidden md:block" : undefined}>
          <ScheduleGridClient
            view={view}
            days={eachDayOfInterval({ start: rangeStart, end: addDays(rangeEnd, -1) })}
            appointmentsByDay={byDay}
            busyBlocksByDay={busyByDay}
            customers={customerOptions}
          />
        </div>
      )}
    </div>
  );
}
