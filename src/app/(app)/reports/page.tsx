import {
  ClipboardList,
  JapaneseYen,
  Percent,
  RefreshCcw,
  TrendingUp,
  UserMinus,
  UserPlus,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RevenueTrendChart } from "@/components/reports/revenue-trend-chart";
import { getReportMetrics } from "@/lib/data-access";
import { formatCurrency } from "@/lib/format";

export default async function ReportsPage() {
  const metrics = await getReportMetrics();

  return (
    <div>
      <PageHeader title="レポート" description="経営判断につながる数字をまとめて確認できます" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="今月売上" value={formatCurrency(metrics.monthlyRevenue)} icon={JapaneseYen} />
        <KpiCard label="新規顧客数" value={`${metrics.newCustomerCount}名`} icon={UserPlus} />
        <KpiCard label="契約中顧客" value={`${metrics.activeContractCount}名`} icon={Users} />
        <KpiCard label="解約数(今月)" value={`${metrics.cancelledCount}名`} icon={UserMinus} />
        <KpiCard label="継続率" value={`${metrics.retentionRate.toFixed(1)}%`} icon={RefreshCcw} />
        <KpiCard label="契約更新率" value={`${metrics.renewalRate.toFixed(1)}%`} icon={Percent} />
        <KpiCard label="顧客単価" value={formatCurrency(Math.round(metrics.averageRevenuePerCustomer))} icon={TrendingUp} />
        <KpiCard label="セッション数" value={`${metrics.sessionCount}件`} icon={ClipboardList} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-5">
        <Card className="shadow-none xl:col-span-3">
          <CardHeader>
            <CardTitle className="text-base">月間売上の推移(直近6ヶ月)</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueTrendChart data={metrics.revenueTrend} />
          </CardContent>
        </Card>

        <Card className="shadow-none xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">トレーナー別実績(今月)</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>担当者</TableHead>
                  <TableHead>売上</TableHead>
                  <TableHead>セッション数</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrics.trainerBreakdown.map((t) => (
                  <TableRow key={t.staffId}>
                    <TableCell className="font-medium text-text-primary">{t.staffName}</TableCell>
                    <TableCell>{formatCurrency(t.revenue)}</TableCell>
                    <TableCell>{t.sessionCount}件</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
