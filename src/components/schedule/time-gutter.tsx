import { BUSINESS_END_HOUR, BUSINESS_START_HOUR, PIXELS_PER_MINUTE, gridTotalHeight } from "@/lib/schedule-layout";

export function TimeGutter() {
  const hours = Array.from({ length: BUSINESS_END_HOUR - BUSINESS_START_HOUR + 1 }, (_, i) => BUSINESS_START_HOUR + i);

  return (
    <div className="relative w-12 shrink-0 sm:w-14" style={{ height: gridTotalHeight() }}>
      {hours.map((h, i) => (
        <div
          key={h}
          className="absolute right-2 -translate-y-1/2 text-[11px] text-text-muted"
          style={{ top: i * 60 * PIXELS_PER_MINUTE }}
        >
          {String(h).padStart(2, "0")}:00
        </div>
      ))}
    </div>
  );
}
