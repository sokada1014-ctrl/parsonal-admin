// Google Calendar 風の時間グリッド表示のためのレイアウト計算。

export const BUSINESS_START_HOUR = 7;
export const BUSINESS_END_HOUR = 22;
export const PIXELS_PER_MINUTE = 1.1;
export const SNAP_MINUTES = 15;

export function gridTotalMinutes() {
  return (BUSINESS_END_HOUR - BUSINESS_START_HOUR) * 60;
}

export function gridTotalHeight() {
  return gridTotalMinutes() * PIXELS_PER_MINUTE;
}

export function minutesFromGridStart(date: Date): number {
  return date.getHours() * 60 + date.getMinutes() - BUSINESS_START_HOUR * 60;
}

export function minutesToLabel(minutesFromMidnight: number): string {
  const h = Math.floor(minutesFromMidnight / 60);
  const m = minutesFromMidnight % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export interface LayoutBox<T> {
  item: T;
  col: number;
  totalCols: number;
  startMin: number;
  endMin: number;
}

// 同じ日に重なる予定を、Googleカレンダーのように列分割して配置する。
export function layoutOverlapping<T>(
  items: T[],
  getRange: (item: T) => { startMin: number; endMin: number },
): LayoutBox<T>[] {
  const sorted = items
    .map((item) => ({ item, ...getRange(item) }))
    .sort((a, b) => a.startMin - b.startMin);

  const result: LayoutBox<T>[] = [];
  let clusterEnd = -Infinity;
  let pending: LayoutBox<T>[] = [];

  function flush() {
    if (pending.length === 0) return;
    const columnsEnd: number[] = [];
    for (const box of pending) {
      let col = columnsEnd.findIndex((end) => end <= box.startMin);
      if (col === -1) {
        col = columnsEnd.length;
        columnsEnd.push(box.endMin);
      } else {
        columnsEnd[col] = box.endMin;
      }
      box.col = col;
    }
    const totalCols = columnsEnd.length;
    for (const box of pending) box.totalCols = totalCols;
    result.push(...pending);
    pending = [];
  }

  for (const entry of sorted) {
    const box: LayoutBox<T> = { item: entry.item, col: 0, totalCols: 1, startMin: entry.startMin, endMin: entry.endMin };
    if (box.startMin >= clusterEnd) {
      flush();
      clusterEnd = box.endMin;
    } else {
      clusterEnd = Math.max(clusterEnd, box.endMin);
    }
    pending.push(box);
  }
  flush();

  return result;
}

export function snapMinutes(min: number): number {
  return Math.round(min / SNAP_MINUTES) * SNAP_MINUTES;
}

export function clampToGrid(min: number): number {
  return Math.min(Math.max(min, 0), gridTotalMinutes());
}
