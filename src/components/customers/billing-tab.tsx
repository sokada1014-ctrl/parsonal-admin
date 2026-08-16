import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { InvoiceStatusBadge } from "@/components/status-badge";
import { formatCurrency, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { CustomerFullProfile } from "@/lib/data-access";

export function BillingTab({ profile }: { profile: CustomerFullProfile }) {
  const { invoices } = profile;

  if (invoices.length === 0) {
    return <p className="py-12 text-center text-sm text-text-muted">請求データはまだありません</p>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>請求金額</TableHead>
            <TableHead>請求日</TableHead>
            <TableHead>支払期限</TableHead>
            <TableHead>入金日</TableHead>
            <TableHead>ステータス</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((inv) => (
            <TableRow
              key={inv.id}
              className={cn(inv.status === "overdue" && "bg-danger-light/40", inv.status === "unpaid" && "bg-warning-light/40")}
            >
              <TableCell className="font-medium text-text-primary">{formatCurrency(inv.amount)}</TableCell>
              <TableCell>{formatDate(inv.issuedAt)}</TableCell>
              <TableCell>{formatDate(inv.dueAt)}</TableCell>
              <TableCell>{inv.paidAt ? formatDate(inv.paidAt) : "-"}</TableCell>
              <TableCell>
                <InvoiceStatusBadge status={inv.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
