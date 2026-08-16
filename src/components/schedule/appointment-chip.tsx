"use client";

import { useState } from "react";
import Link from "next/link";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AppointmentStatusBadge } from "@/components/status-badge";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { AppointmentWithDetails } from "@/lib/data-access";

export function AppointmentChip({
  appointment,
  compact = true,
  fill = false,
}: {
  appointment: AppointmentWithDetails;
  compact?: boolean;
  fill?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const time = new Date(appointment.startAt);
  const timeLabel = `${String(time.getHours()).padStart(2, "0")}:${String(time.getMinutes()).padStart(2, "0")}`;

  return (
    <>
      <button
        type="button"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={() => setOpen(true)}
        className={cn(
          "block w-full truncate rounded-md bg-primary-light px-1.5 py-1 text-left text-xs font-medium text-primary transition-shadow duration-200 ease-out hover:bg-primary/20",
          !compact && "px-2 py-1.5 text-sm",
          fill && "h-full overflow-hidden py-0.5 leading-tight hover:z-30 hover:shadow-lg hover:ring-1 hover:ring-primary/30",
        )}
      >
        <span className="font-semibold">{timeLabel}</span> {appointment.customerName}
        {!compact && appointment.menu && (
          <span className="block truncate text-[11px] font-normal text-primary/80">{appointment.menu}</span>
        )}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>予約詳細</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">顧客</span>
              <span className="font-medium text-text-primary">{appointment.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">担当者</span>
              <span className="font-medium text-text-primary">{appointment.staffName ?? "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">日時</span>
              <span className="font-medium text-text-primary">{formatDateTime(appointment.startAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">メニュー</span>
              <span className="font-medium text-text-primary">{appointment.menu ?? "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">ステータス</span>
              <AppointmentStatusBadge status={appointment.status} />
            </div>
            {appointment.note && (
              <div>
                <p className="text-text-secondary">メモ</p>
                <p className="mt-1 text-text-primary">{appointment.note}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              閉じる
            </Button>
            <Button asChild>
              <Link href={`/customers/${appointment.customerId}`}>顧客詳細を見る</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
