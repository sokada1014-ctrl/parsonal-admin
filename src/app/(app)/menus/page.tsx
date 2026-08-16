import { Trash2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { NewMenuItemDialog } from "@/components/menus/new-menu-item-dialog";
import { getMenuItems } from "@/lib/data-access";
import { deleteMenuItemAction } from "@/lib/actions";

export default async function MenusPage() {
  const items = await getMenuItems();

  return (
    <div>
      <PageHeader
        title="練習メニュー管理"
        description="セッション記録・予約のメニュー欄で選択できる項目を管理します。ここにない内容は自由記述でも入力できます。"
        actions={<NewMenuItemDialog />}
      />

      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>メニュー名</TableHead>
              <TableHead>カテゴリ</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium text-text-primary">{item.name}</TableCell>
                <TableCell>
                  {item.category ? (
                    <Badge variant="secondary" className="bg-muted text-text-secondary">
                      {item.category}
                    </Badge>
                  ) : (
                    <span className="text-text-muted">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <form action={deleteMenuItemAction.bind(null, item.id)}>
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
          <p className="py-12 text-center text-sm text-text-muted">練習メニューはまだ登録されていません</p>
        )}
      </div>
    </div>
  );
}
