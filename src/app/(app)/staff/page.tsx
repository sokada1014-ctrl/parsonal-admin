import { Trash2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { InlineRoleCell } from "@/components/staff/inline-role-cell";
import { NewStaffDialog } from "@/components/staff/new-staff-dialog";
import { getStaffListItems } from "@/lib/data-access";
import { deleteStaffAction } from "@/lib/actions";

export default async function StaffPage() {
  const staffList = await getStaffListItems();

  return (
    <div>
      <PageHeader
        title="スタッフ"
        description={`${staffList.length}名のスタッフ`}
        actions={<NewStaffDialog />}
      />

      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>名前</TableHead>
              <TableHead>メールアドレス</TableHead>
              <TableHead>権限</TableHead>
              <TableHead>担当顧客数</TableHead>
              <TableHead>今月のセッション数</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {staffList.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="p-0">
                  <div className="flex items-center gap-3 px-4 py-3">
                    <Avatar className="size-8 shrink-0">
                      <AvatarFallback className="bg-primary-light text-primary text-xs font-medium">
                        {s.name.slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-text-primary">{s.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-text-secondary">{s.email}</TableCell>
                <TableCell className="p-1">
                  <InlineRoleCell staffId={s.id} currentRole={s.role} />
                </TableCell>
                <TableCell>{s.customerCount}名</TableCell>
                <TableCell>{s.monthlySessionCount}件</TableCell>
                <TableCell>
                  <form action={deleteStaffAction.bind(null, s.id)}>
                    <Button type="submit" variant="ghost" size="icon" className="text-text-muted hover:text-danger">
                      <Trash2 className="size-4" />
                    </Button>
                  </form>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
