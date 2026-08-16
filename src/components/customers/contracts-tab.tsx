import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ContractStatusBadge } from "@/components/status-badge";
import { NewContractDialog } from "@/components/customers/new-contract-dialog";
import { formatCurrency, formatDate } from "@/lib/format";
import { getTicketRemaining } from "@/lib/data-access";
import { CARD_LIFT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { CustomerFullProfile } from "@/lib/data-access";
import type { PlanTemplate } from "@/lib/types";

export function ContractsTab({ profile, planTemplates }: { profile: CustomerFullProfile; planTemplates: PlanTemplate[] }) {
  const { contracts, tickets } = profile;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <NewContractDialog customerId={profile.customer.id} planTemplates={planTemplates} />
      </div>

      {contracts.length === 0 && tickets.length === 0 && (
        <p className="py-12 text-center text-sm text-text-muted">契約情報はまだありません</p>
      )}

      {contracts.map((contract) => (
        <Card key={contract.id} className={cn("shadow-none", CARD_LIFT)}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">{contract.planName}</CardTitle>
            <ContractStatusBadge status={contract.status} />
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-4">
            <div>
              <p className="text-text-secondary">開始日</p>
              <p className="font-medium text-text-primary">{formatDate(contract.startDate)}</p>
            </div>
            <div>
              <p className="text-text-secondary">終了日</p>
              <p className="font-medium text-text-primary">{formatDate(contract.endDate)}</p>
            </div>
            <div>
              <p className="text-text-secondary">更新日</p>
              <p className="font-medium text-text-primary">{formatDate(contract.renewalDate)}</p>
            </div>
            <div>
              <p className="text-text-secondary">月額料金</p>
              <p className="font-medium text-text-primary">
                {contract.monthlyFee !== undefined ? formatCurrency(contract.monthlyFee) : "-"}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}

      {tickets.map((ticket) => {
        const remaining = getTicketRemaining(ticket);
        const pct = Math.round((ticket.usedCount / ticket.purchasedCount) * 100);
        return (
          <Card key={ticket.id} className={cn("shadow-none", CARD_LIFT)}>
            <CardHeader>
              <CardTitle className="text-base">{ticket.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-3 flex items-end justify-between">
                <p className="text-sm text-text-secondary">
                  使用 {ticket.usedCount} / {ticket.purchasedCount} 回
                </p>
                <p className={`text-lg font-semibold ${remaining <= 2 ? "text-warning" : "text-text-primary"}`}>
                  残り{remaining}回
                </p>
              </div>
              <Progress value={pct} />
              <div className="mt-3 flex justify-between text-xs text-text-secondary">
                <span>購入日: {formatDate(ticket.purchasedAt)}</span>
                <span>有効期限: {formatDate(ticket.expiresAt)}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
