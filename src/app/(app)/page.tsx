import Link from "next/link";
import {
  CalendarClock,
  ChevronRight,
  ClipboardList,
  JapaneseYen,
  Sparkles,
  UserCheck,
  UserMinus,
  UserPlus,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SeverityBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { getAlerts, getDashboardKpis, getTodayAppointments } from "@/lib/data-access";
import { formatCurrency, formatTime } from "@/lib/format";
import { LINK_UNDERLINE } from "@/lib/motion";
import { cn } from "@/lib/utils";

const alertLabels: Record<string, string> = {
  ticket_low: "回数券残りわずか",
  renewal_due: "契約更新間近",
  no_next_appointment: "次回予約なし",
  inactive: "最終来店30日以上",
  unpaid: "未入金",
  overdue: "支払期限超過",
  session_not_recorded: "セッション記録未入力",
};

export default async function DashboardPage() {
  const [kpis, todayAppointments, alerts] = await Promise.all([
    getDashboardKpis(),
    getTodayAppointments(),
    getAlerts(),
  ]);

  const sortedAlerts = alerts
    .slice()
    .sort((a, b) => (a.severity === b.severity ? 0 : a.severity === "danger" ? -1 : 1));

  return (
    <div>
      <PageHeader title="ダッシュボード" description="今日やるべきことをひと目で確認できます" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="総顧客数" value={`${kpis.totalCustomers}名`} icon={Users} tone="primary" />
        <KpiCard label="契約中顧客" value={`${kpis.activeCustomers}名`} icon={UserCheck} tone="primary" />
        <KpiCard label="今月売上" value={formatCurrency(kpis.monthlyRevenue)} icon={JapaneseYen} tone="success" />
        <KpiCard label="今月セッション数" value={`${kpis.monthlySessionCount}件`} icon={ClipboardList} tone="primary" />
        <KpiCard label="体験中" value={`${kpis.trialCount}名`} icon={Sparkles} tone="warning" />
        <KpiCard label="今月の入会者数" value={`${kpis.newMembersThisMonth}名`} icon={UserPlus} tone="success" />
        <KpiCard label="今月の退会者数" value={`${kpis.leftThisMonth}名`} icon={UserMinus} tone="danger" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-5">
        <Card className="shadow-none xl:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarClock className="size-4 text-primary" />
              今日の予定 ({todayAppointments.length}件)
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/schedule">
                カレンダーを見る <ChevronRight className="size-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {todayAppointments.length === 0 ? (
              <p className="py-8 text-center text-sm text-text-muted">本日の予約はありません</p>
            ) : (
              <div className="flex flex-col divide-y divide-border">
                {todayAppointments.map((appt) => (
                  <Link
                    key={appt.id}
                    href={`/customers/${appt.customerId}`}
                    className="group flex items-center gap-4 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="w-14 shrink-0 text-sm font-medium text-text-primary tabular-nums">
                      {formatTime(appt.startAt)}
                    </div>
                    <Avatar className="size-9 shrink-0">
                      <AvatarFallback className="bg-primary-light text-primary text-sm">
                        {appt.customerName.slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className={cn("w-fit truncate text-sm font-medium text-text-primary", LINK_UNDERLINE)}>
                        {appt.customerName}
                      </p>
                      <p className="truncate text-xs text-text-secondary">{appt.menu ?? "メニュー未設定"}</p>
                    </div>
                    <div className="shrink-0 text-xs text-text-muted">{appt.staffName}</div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-none xl:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <span className="flex size-2 rounded-full bg-danger" />
              要対応 ({alerts.length}件)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sortedAlerts.length === 0 ? (
              <p className="py-8 text-center text-sm text-text-muted">対応が必要な項目はありません</p>
            ) : (
              <div className="flex flex-col divide-y divide-border">
                {sortedAlerts.map((alert) => (
                  <Link
                    key={alert.id}
                    href={`/customers/${alert.customerId}`}
                    className="group flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className={cn("w-fit truncate text-sm font-medium text-text-primary", LINK_UNDERLINE)}>
                        {alert.customerName}
                      </p>
                      <p className="mt-0.5 text-xs text-text-secondary">{alert.message}</p>
                    </div>
                    <SeverityBadge severity={alert.severity} label={alertLabels[alert.type] ?? "要確認"} />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
