import { Trash2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { NewPlanTemplateDialog } from "@/components/plans/new-plan-template-dialog";
import { getPlanTemplateUsage } from "@/lib/data-access";
import { deletePlanTemplateAction } from "@/lib/actions";
import { formatCurrency } from "@/lib/format";

export default async function PlansPage() {
  const items = await getPlanTemplateUsage();

  return (
    <div>
      <PageHeader
        title="契約管理"
        description="契約プランのひな形を管理します。ここで登録したプランは顧客の契約作成時に選択できます(自由記述での入力も可能です)。"
        actions={<NewPlanTemplateDialog />}
      />

      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>プラン名</TableHead>
              <TableHead>タイプ</TableHead>
              <TableHead>料金・回数</TableHead>
              <TableHead>利用中の顧客数</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map(({ template, customerCount }) => (
              <TableRow key={template.id}>
                <TableCell className="font-medium text-text-primary">{template.name}</TableCell>
                <TableCell>{template.planType === "monthly" ? "月謝制" : "回数券"}</TableCell>
                <TableCell>
                  {template.planType === "monthly"
                    ? template.monthlyFee !== undefined
                      ? `${formatCurrency(template.monthlyFee)} / 月`
                      : "-"
                    : `${template.ticketCount ?? "-"}回`}
                </TableCell>
                <TableCell>{customerCount}名</TableCell>
                <TableCell>
                  <form action={deletePlanTemplateAction.bind(null, template.id)}>
                    <Button type="submit" variant="ghost" size="icon" className="text-text-muted hover:text-danger">
                      <Trash2 className="size-4" />
                    </Button>
                  </form>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {items.length === 0 && (
          <p className="py-12 text-center text-sm text-text-muted">契約プランはまだ登録されていません</p>
        )}
      </div>
    </div>
  );
}
