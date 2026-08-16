import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CustomerStatusBadge } from "@/components/status-badge";
import { CustomerFilters } from "@/components/customers/customer-filters";
import { InlineStaffCell } from "@/components/customers/inline-staff-cell";
import { InlinePlanCell } from "@/components/customers/inline-plan-cell";
import { getCustomerListItems, getPlanTemplates, getStaffList } from "@/lib/data-access";
import { formatDate, formatDateTime } from "@/lib/format";
import type { CustomerListFilter } from "@/lib/data-access";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; staffId?: string }>;
}) {
  const params = await searchParams;
  const filter: CustomerListFilter = {
    query: params.q,
    status: (params.status as CustomerListFilter["status"]) || undefined,
    staffId: params.staffId,
  };

  const [items, staffList, planTemplates] = await Promise.all([
    getCustomerListItems(filter),
    getStaffList(),
    getPlanTemplates(),
  ]);

  return (
    <div>
      <PageHeader
        title="顧客"
        description={`${items.length}名の顧客`}
        actions={
          <Button asChild>
            <Link href="/customers/new">
              <Plus className="size-4" />
              新規顧客登録
            </Link>
          </Button>
        }
      />

      <CustomerFilters staffOptions={staffList.map((s) => ({ id: s.id, name: s.name }))} />

      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>顧客名</TableHead>
                <TableHead>担当者</TableHead>
                <TableHead>契約プラン</TableHead>
                <TableHead>残り回数</TableHead>
                <TableHead>次回予約</TableHead>
                <TableHead>最終来店</TableHead>
                <TableHead>ステータス</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map(({ customer, contract, ticketRemaining, nextAppointment, lastVisit }) => (
                <TableRow key={customer.id} className="cursor-pointer">
                  <TableCell className="p-0">
                    <Link href={`/customers/${customer.id}`} className="flex items-center gap-3 px-4 py-3">
                      <Avatar className="size-8 shrink-0">
                        <AvatarFallback className="bg-primary-light text-primary text-xs font-medium">
                          {customer.name.slice(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-text-primary">{customer.name}</span>
                    </Link>
                  </TableCell>
                  <TableCell className="p-1">
                    <InlineStaffCell
                      customerId={customer.id}
                      currentStaffId={customer.primaryStaffId}
                      staffOptions={staffList.map((s) => ({ id: s.id, name: s.name }))}
                    />
                  </TableCell>
                  <TableCell className="p-1">
                    <InlinePlanCell
                      customerId={customer.id}
                      currentPlanName={contract?.planName}
                      planTemplates={planTemplates}
                    />
                  </TableCell>
                  <TableCell>
                    <Link href={`/customers/${customer.id}`} className="block">
                      {ticketRemaining !== undefined ? (
                        <span className={ticketRemaining <= 2 ? "font-medium text-warning" : "text-text-secondary"}>
                          残り{ticketRemaining}回
                        </span>
                      ) : (
                        <span className="text-text-muted">-</span>
                      )}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/customers/${customer.id}`} className="block text-text-secondary">
                      {nextAppointment ? formatDateTime(nextAppointment.startAt) : "-"}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/customers/${customer.id}`} className="block text-text-secondary">
                      {lastVisit ? formatDate(lastVisit.startAt) : "-"}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/customers/${customer.id}`} className="block">
                      <CustomerStatusBadge status={customer.status} />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {items.length === 0 && (
          <p className="py-12 text-center text-sm text-text-muted">該当する顧客が見つかりません</p>
        )}
      </div>
    </div>
  );
}
