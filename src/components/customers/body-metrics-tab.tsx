import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BodyMetricChart } from "./body-metric-chart";
import { formatDate } from "@/lib/format";
import type { CustomerFullProfile } from "@/lib/data-access";

export function BodyMetricsTab({ profile }: { profile: CustomerFullProfile }) {
  const { bodyMetrics } = profile;

  if (bodyMetrics.length === 0) {
    return <p className="py-12 text-center text-sm text-text-muted">身体データはまだ記録されていません</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-base">体重の推移(kg)</CardTitle>
          </CardHeader>
          <CardContent>
            <BodyMetricChart
              data={bodyMetrics.map((m) => ({ measuredAt: m.measuredAt, value: m.weightKg }))}
              unit="kg"
            />
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-base">体脂肪率の推移(%)</CardTitle>
          </CardHeader>
          <CardContent>
            <BodyMetricChart
              data={bodyMetrics.map((m) => ({ measuredAt: m.measuredAt, value: m.bodyFatPct }))}
              unit="%"
            />
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="text-base">測定履歴</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>測定日</TableHead>
                <TableHead>体重</TableHead>
                <TableHead>体脂肪率</TableHead>
                <TableHead>BMI</TableHead>
                <TableHead>ウエスト</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bodyMetrics
                .slice()
                .reverse()
                .map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium text-text-primary">{formatDate(m.measuredAt)}</TableCell>
                    <TableCell>{m.weightKg !== undefined ? `${m.weightKg}kg` : "-"}</TableCell>
                    <TableCell>{m.bodyFatPct !== undefined ? `${m.bodyFatPct}%` : "-"}</TableCell>
                    <TableCell>{m.bmi ?? "-"}</TableCell>
                    <TableCell>{m.waistCm !== undefined ? `${m.waistCm}cm` : "-"}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
