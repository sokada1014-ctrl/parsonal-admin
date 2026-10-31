import Link from "next/link";
import { AlertTriangle, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LINK_UNDERLINE } from "@/lib/motion";
import { formatDate, calcAge } from "@/lib/format";
import type { CustomerFullProfile } from "@/lib/data-access";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-2 text-sm">
      <span className="text-text-secondary">{label}</span>
      <span className="text-right font-medium text-text-primary">{value}</span>
    </div>
  );
}

export function OverviewTab({ profile }: { profile: CustomerFullProfile }) {
  const { customer, bodyMetrics, pairedCustomer } = profile;
  const latest = bodyMetrics[bodyMetrics.length - 1];
  const age = calcAge(customer.birthDate);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="text-base">基本情報</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          <InfoRow label="生年月日" value={customer.birthDate ? `${formatDate(customer.birthDate)}${age !== undefined ? `(${age}歳)` : ""}` : "-"} />
          <InfoRow label="性別" value={customer.gender === "male" ? "男性" : customer.gender === "female" ? "女性" : "-"} />
          <InfoRow label="電話番号" value={customer.phone ?? "-"} />
          <InfoRow label="メール" value={customer.email ?? "-"} />
          <InfoRow label="住所" value={customer.address ?? "-"} />
          <InfoRow label="登録日" value={formatDate(customer.createdAt)} />
        </CardContent>
      </Card>

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="text-base">身体情報(直近測定)</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          <InfoRow label="測定日" value={latest ? formatDate(latest.measuredAt) : "-"} />
          <InfoRow label="体重" value={latest?.weightKg !== undefined ? `${latest.weightKg}kg` : "-"} />
          <InfoRow label="体脂肪率" value={latest?.bodyFatPct !== undefined ? `${latest.bodyFatPct}%` : "-"} />
          <InfoRow label="BMI" value={latest?.bmi !== undefined ? `${latest.bmi}` : "-"} />
          <InfoRow label="ウエスト" value={latest?.waistCm !== undefined ? `${latest.waistCm}cm` : "-"} />
        </CardContent>
      </Card>

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="text-base">目標</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-text-primary">{customer.goal || "未設定"}</p>
        </CardContent>
      </Card>

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">注意事項</CardTitle>
        </CardHeader>
        <CardContent>
          {customer.cautions ? (
            <div className="flex items-start gap-2 rounded-lg bg-warning-light px-3 py-2.5 text-sm text-text-primary">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
              {customer.cautions}
            </div>
          ) : (
            <p className="text-sm text-text-muted">特になし</p>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="size-4 text-text-secondary" />
            ペア参加
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pairedCustomer ? (
            <Link
              href={`/customers/${pairedCustomer.id}`}
              className="group inline-flex items-center gap-1 text-sm font-medium text-text-primary"
            >
              <span className={LINK_UNDERLINE}>{pairedCustomer.name}</span>
              <span className="text-text-muted">さんと一緒に参加</span>
            </Link>
          ) : (
            <p className="text-sm text-text-muted">ペア相手は設定されていません</p>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-none lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">顧客メモ</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm whitespace-pre-wrap text-text-primary">{customer.memo || "メモはまだありません"}</p>
        </CardContent>
      </Card>
    </div>
  );
}
