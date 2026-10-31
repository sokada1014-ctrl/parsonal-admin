"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CHART_COLORS } from "@/lib/chart-colors";
import { formatCurrency } from "@/lib/format";
import type { MonthlyRevenuePoint } from "@/lib/data-access";

export function RevenueTrendChart({ data }: { data: MonthlyRevenuePoint[] }) {
  const values = data.map((d) => d.revenue);
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 1);
  const padding = Math.max((max - min) * 0.2, 1000);
  const domain: [number, number] = [Math.max(0, Math.floor(min - padding)), Math.ceil(max + padding)];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} stroke={CHART_COLORS.border} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: CHART_COLORS.textMuted }}
            axisLine={{ stroke: CHART_COLORS.border }}
            tickLine={false}
            padding={{ left: 12, right: 12 }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: CHART_COLORS.textMuted }}
            axisLine={false}
            tickLine={false}
            width={56}
            domain={domain}
            tickFormatter={(v: number) => `¥${Math.round(v / 10000)}万`}
          />
          <Tooltip
            formatter={(value) => [formatCurrency(Number(value)), "売上"]}
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
            dataKey="revenue"
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
