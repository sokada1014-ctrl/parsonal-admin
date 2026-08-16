import Link from "next/link";
import { AlertTriangle, CheckCircle2, JapaneseYen } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { InvoiceStatusBadge } from "@/components/status-badge";
import { getBillingSummary, getInvoiceListItems } from "@/lib/data-access";
import { markInvoicePaidAction } from "@/lib/actions";
import { formatCurrency, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { InvoiceListFilter } from "@/lib/data-access";

const filterTabs: { value: string; label: string }[] = [
  { value: "", label: "すべて" },
  { value: "unpaid", label: "未入金" },
  { value: "overdue", label: "期限超過" },
];

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const filter: InvoiceListFilter = { status: status === "unpaid" || status === "overdue" ? status : undefined };

  const [summary, invoiceItems] = await Promise.all([getBillingSummary(), getInvoiceListItems(filter)]);

  return (
    <div>
      <PageHeader title="請求・入金" description="顧客ごとの請求・入金状況を確認できます" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard label="未入金合計" value={formatCurrency(summary.totalUnpaid)} icon={JapaneseYen} />
        <KpiCard label="支払期限超過" value={formatCurrency(summary.totalOverdue)} icon={AlertTriangle} />
        <KpiCard label="今月の入金額" value={formatCurrency(summary.paidThisMonth)} icon={CheckCircle2} />
      </div>

      <div className="mt-6 mb-4 flex gap-1 rounded-lg border border-border p-0.5 w-fit">
        {filterTabs.map((tab) => (
          <Link
            key={tab.value}
            href={tab.value ? `/billing?status=${tab.value}` : "/billing"}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-shadow duration-150",
              (status ?? "") === tab.value
                ? "bg-primary-light text-primary shadow-sm"
                : "text-text-secondary hover:bg-muted hover:text-text-primary",
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>顧客</TableHead>
              <TableHead>請求金額</TableHead>
              <TableHead>請求日</TableHead>
              <TableHead>支払期限</TableHead>
              <TableHead>入金日</TableHead>
              <TableHead>ステータス</TableHead>
              <TableHead className="w-32" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoiceItems.map((inv) => (
              <TableRow
                key={inv.id}
                className={cn(
                  inv.status === "overdue" && "bg-danger-light/40",
                  inv.status === "unpaid" && "bg-warning-light/40",
                )}
              >
                <TableCell className="p-0">
                  <Link href={`/customers/${inv.customerId}?tab=billing`} className="block px-4 py-3 font-medium text-text-primary">
                    {inv.customerName}
                  </Link>
                </TableCell>
                <TableCell className="font-medium text-text-primary">{formatCurrency(inv.amount)}</TableCell>
                <TableCell>{formatDate(inv.issuedAt)}</TableCell>
                <TableCell>{formatDate(inv.dueAt)}</TableCell>
                <TableCell>{inv.paidAt ? formatDate(inv.paidAt) : "-"}</TableCell>
                <TableCell>
                  <InvoiceStatusBadge status={inv.status} />
                </TableCell>
                <TableCell>
                  {inv.status !== "paid" && (
                    <form action={markInvoicePaidAction.bind(null, inv.id)}>
                      <Button type="submit" size="sm" variant="outline">
                        入金済にする
                      </Button>
                    </form>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {invoiceItems.length === 0 && (
          <p className="py-12 text-center text-sm text-text-muted">該当する請求はありません</p>
        )}
      </div>
    </div>
  );
}
