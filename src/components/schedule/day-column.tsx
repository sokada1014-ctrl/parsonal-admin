"use client";

import { useRef, useState } from "react";
import { isToday } from "date-fns";
import { X } from "lucide-react";
import {
  BUSINESS_START_HOUR,
  PIXELS_PER_MINUTE,
  clampToGrid,
  gridTotalHeight,
  gridTotalMinutes,
  layoutOverlapping,
  minutesFromGridStart,
  minutesToLabel,
  snapMinutes,
} from "@/lib/schedule-layout";
import { AppointmentChip } from "./appointment-chip";
import { cn } from "@/lib/utils";
import type { AppointmentWithDetails } from "@/lib/data-access";
import type { GoogleBusyBlock } from "@/lib/types";

interface DragState {
  startMin: number;
  currentMin: number;
}

const MIN_DRAG_SELECTION_MINUTES = 15;

interface CandidateSlotBox {
  id: string;
  startMin: number;
  endMin: number;
  label: string;
}

export function DayColumn({
  date,
  appointments,
  busyBlocks,
  candidateSlots = [],
  onRemoveCandidate,
  variant = "week",
  onSelectSlot,
}: {
  date: Date;
  appointments: AppointmentWithDetails[];
  busyBlocks: GoogleBusyBlock[];
  candidateSlots?: CandidateSlotBox[];
  onRemoveCandidate?: (id: string) => void;
  variant?: "week" | "day";
  onSelectSlot?: (startMin: number, endMin: number) => void;
}) {
  const columnRef = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<DragState | null>(null);
  const [hoverMin, setHoverMin] = useState<number | null>(null);
  const today = isToday(date);

  const apptBoxes = layoutOverlapping(appointments, (a) => ({
    startMin: minutesFromGridStart(new Date(a.startAt)),
    endMin: minutesFromGridStart(new Date(a.endAt)),
  }));

  function minuteFromClientY(clientY: number) {
    const rect = columnRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    const y = clientY - rect.top;
    return clampToGrid(snapMinutes(y / PIXELS_PER_MINUTE));
  }

  function handleMouseDown(e: React.MouseEvent) {
    const select = onSelectSlot;
    if (!select) return;
    if (e.target !== e.currentTarget) return; // 予定チップの上からは開始しない
    const startMin = minuteFromClientY(e.clientY);
    setDrag({ startMin, currentMin: startMin });

    function handleMove(ev: MouseEvent) {
      setDrag((prev) => (prev ? { ...prev, currentMin: minuteFromClientY(ev.clientY) } : prev));
    }
    function handleUp(ev: MouseEvent) {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      const endMin = minuteFromClientY(ev.clientY);
      setDrag(null);
      const lo = Math.min(startMin, endMin);
      const hi = Math.max(startMin, endMin);
      if (hi - lo >= MIN_DRAG_SELECTION_MINUTES) {
        select?.(lo, hi);
      }
    }
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  }

  const now = new Date();
  const nowMin = minutesFromGridStart(now);
  const showNowLine = today && nowMin >= 0 && nowMin <= gridTotalMinutes();

  return (
    <div
      ref={columnRef}
      onMouseDown={handleMouseDown}
      onMouseMove={(e) => {
        if (!onSelectSlot || drag) return;
        if (e.target !== e.currentTarget) {
          setHoverMin(null);
          return;
        }
        setHoverMin(minuteFromClientY(e.clientY));
      }}
      onMouseLeave={() => setHoverMin(null)}
      className={cn(
        "relative border-r border-border last:border-r-0",
        onSelectSlot && "cursor-crosshair select-none hover:bg-primary/[0.03]",
      )}
      style={{ height: gridTotalHeight() }}
    >
      {Array.from({ length: gridTotalMinutes() / 60 + 1 }).map((_, i) => (
        <div
          key={i}
          className="pointer-events-none absolute inset-x-0 border-t border-border"
          style={{ top: i * 60 * PIXELS_PER_MINUTE }}
        />
      ))}

      {hoverMin !== null && !drag && (
        <div
          className="pointer-events-none absolute inset-x-0 z-[5] flex items-center"
          style={{ top: hoverMin * PIXELS_PER_MINUTE }}
        >
          <span className="absolute -left-1 size-1.5 rounded-full bg-primary/50" />
          <div className="w-full border-t border-dashed border-primary/40" />
          <span className="absolute left-1.5 -translate-y-1/2 animate-in fade-in zoom-in-95 rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap text-white shadow-sm duration-100">
            {minutesToLabel(BUSINESS_START_HOUR * 60 + hoverMin)}
          </span>
        </div>
      )}

      {busyBlocks.map((b) => {
        const startMin = minutesFromGridStart(new Date(b.startAt));
        const endMin = minutesFromGridStart(new Date(b.endAt));
        return (
          <div
            key={b.id}
            className="absolute inset-x-0.5 z-0 cursor-help overflow-hidden rounded-md border border-text-muted/30 bg-[repeating-linear-gradient(135deg,var(--muted)_0px,var(--muted)_6px,transparent_6px,transparent_12px)] px-1.5 py-0.5 text-[11px] text-text-muted hover:border-text-muted/50 hover:text-text-secondary"
            style={{ top: startMin * PIXELS_PER_MINUTE, height: Math.max((endMin - startMin) * PIXELS_PER_MINUTE, 16) }}
            title={`外部予定: ${b.title}`}
          >
            🔒 {b.title}
          </div>
        );
      })}

      {apptBoxes.map(({ item: a, col, totalCols, startMin, endMin }) => (
        <div
          key={a.id}
          className="absolute z-10 px-0.5"
          style={{
            top: startMin * PIXELS_PER_MINUTE,
            height: Math.max((endMin - startMin) * PIXELS_PER_MINUTE, 22),
            left: `${(col / totalCols) * 100}%`,
            width: `${100 / totalCols}%`,
          }}
        >
          <AppointmentChip appointment={a} compact={variant === "week"} fill />
        </div>
      ))}

      {candidateSlots.map((c) => (
        <div
          key={c.id}
          onMouseDown={(e) => e.stopPropagation()}
          className="group absolute inset-x-0.5 z-[15] flex animate-in items-center justify-between gap-1 overflow-hidden rounded-md border border-primary bg-primary/25 px-1.5 py-0.5 text-[11px] font-medium text-primary shadow-[0_1px_2px_rgba(0,0,0,0.04)] backdrop-blur-[1px] duration-200 fade-in zoom-in-95 transition-shadow ease-out hover:bg-primary/35 hover:shadow-md"
          style={{
            top: c.startMin * PIXELS_PER_MINUTE,
            height: Math.max((c.endMin - c.startMin) * PIXELS_PER_MINUTE, 18),
          }}
          title={`候補日程: ${c.label}`}
        >
          <span className="truncate">候補: {minutesToLabel(BUSINESS_START_HOUR * 60 + c.startMin)}〜{minutesToLabel(BUSINESS_START_HOUR * 60 + c.endMin)}</span>
          {onRemoveCandidate && (
            <button
              type="button"
              onClick={() => onRemoveCandidate(c.id)}
              className="shrink-0 scale-90 rounded-full p-0.5 text-primary/70 opacity-0 transition-[opacity,transform] duration-150 ease-out group-hover:scale-100 group-hover:opacity-100 hover:bg-primary/25 hover:text-primary"
            >
              <X className="size-3" />
            </button>
          )}
        </div>
      ))}

      {drag && (
        <div
          className="pointer-events-none absolute inset-x-0.5 z-20 rounded-md border border-primary bg-primary/20 px-1.5 py-0.5 text-[11px] font-semibold text-primary shadow-md ring-2 ring-primary/20"
          style={{
            top: Math.min(drag.startMin, drag.currentMin) * PIXELS_PER_MINUTE,
            height: Math.max(Math.abs(drag.currentMin - drag.startMin) * PIXELS_PER_MINUTE, 4),
          }}
        >
          {minutesToLabel(BUSINESS_START_HOUR * 60 + Math.min(drag.startMin, drag.currentMin))} -{" "}
          {minutesToLabel(BUSINESS_START_HOUR * 60 + Math.max(drag.startMin, drag.currentMin))}
        </div>
      )}

      {showNowLine && (
        <div
          className="pointer-events-none absolute inset-x-0 z-20 border-t-2 border-danger"
          style={{ top: nowMin * PIXELS_PER_MINUTE }}
        >
          <span className="absolute -top-1 -left-1 size-2 animate-pulse rounded-full bg-danger" />
        </div>
      )}
    </div>
  );
}
