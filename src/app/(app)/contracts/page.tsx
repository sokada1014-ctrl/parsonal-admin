import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ContractStatusBadge } from "@/components/status-badge";
import { Progress } from "@/components/ui/progress";
import { getContractListItems } from "@/lib/data-access";
import { formatCurrency, formatDate } from "@/lib/format";

export default async function ContractsPage() {
  const items = await getContractListItems();

  return (
    <div>
      <PageHeader title="契約・回数券" description={`契約中の顧客を含む全${items.length}件`} />

      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>顧客</TableHead>
                <TableHead>プラン</TableHead>
                <TableHead>開始日</TableHead>
                <TableHead>終了/更新日</TableHead>
                <TableHead>月額料金</TableHead>
                <TableHead>回数券</TableHead>
                <TableHead>ステータス</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map(({ contract, customerName, ticket }) => (
                <TableRow key={contract.id}>
                  <TableCell className="p-0">
                    <Link href={`/customers/${contract.customerId}?tab=contracts`} className="block px-4 py-3 font-medium text-text-primary">
                      {customerName}
                    </Link>
                  </TableCell>
                  <TableCell>{contract.planName}</TableCell>
                  <TableCell>{formatDate(contract.startDate)}</TableCell>
                  <TableCell>{formatDate(contract.endDate ?? contract.renewalDate)}</TableCell>
                  <TableCell>{contract.monthlyFee !== undefined ? formatCurrency(contract.monthlyFee) : "-"}</TableCell>
                  <TableCell className="w-40">
                    {ticket ? (
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-text-secondary">
                          残り{ticket.purchasedCount - ticket.usedCount}/{ticket.purchasedCount}回
                        </span>
                        <Progress value={(ticket.usedCount / ticket.purchasedCount) * 100} />
                      </div>
                    ) : (
                      <span className="text-text-muted">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <ContractStatusBadge status={contract.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
