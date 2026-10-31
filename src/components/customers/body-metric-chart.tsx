"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CHART_COLORS } from "@/lib/chart-colors";
import { formatDateShort } from "@/lib/format";

export function BodyMetricChart({
  data,
  unit,
}: {
  data: { measuredAt: string; value: number | undefined }[];
  unit: string;
}) {
  const points = data.filter((d) => d.value !== undefined) as { measuredAt: string; value: number }[];

  if (points.length < 2) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-text-muted">
        データがまだ十分にありません
      </div>
    );
  }

  const values = points.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const padding = Math.max((max - min) * 0.2, 0.5);
  const domain: [number, number] = [Math.floor(min - padding), Math.ceil(max + padding)];

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} stroke={CHART_COLORS.border} />
          <XAxis
            dataKey="measuredAt"
            tickFormatter={formatDateShort}
            tick={{ fontSize: 11, fill: CHART_COLORS.textMuted }}
            axisLine={{ stroke: CHART_COLORS.border }}
            tickLine={false}
            padding={{ left: 12, right: 12 }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: CHART_COLORS.textMuted }}
            axisLine={false}
            tickLine={false}
            width={44}
            domain={domain}
          />
          <Tooltip
            formatter={(value) => [`${value}${unit}`, undefined]}
            labelFormatter={(label) => formatDateShort(String(label ?? ""))}
            contentStyle={{
              fontSize: 12,
              borderRadius: 8,
              border: `1px solid ${CHART_COLORS.border}`,
              backgroundColor: CHART_COLORS.surface,
              color: CHART_COLORS.textPrimary,
              boxShadow: "0 8px 24px -8px rgba(0,0,0,0.5)",
            }}
            labelStyle={{ color: CHART_COLORS.textPrimary }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={CHART_COLORS.primary}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5, strokeWidth: 0 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
