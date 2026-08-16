import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/page-header";
import { ExerciseFields } from "@/components/sessions/exercise-fields";
import { VoiceRecordDialog } from "@/components/sessions/voice-record-dialog";
import { getCustomerListItems, getMenuItems, getStaffList } from "@/lib/data-access";
import { createSessionAction } from "@/lib/actions";
import { LINK_UNDERLINE } from "@/lib/motion";

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default async function NewSessionPage({
  searchParams,
}: {
  searchParams: Promise<{ customerId?: string; voice?: string }>;
}) {
  const { customerId, voice } = await searchParams;
  const [customers, staffList, menuItems] = await Promise.all([
    getCustomerListItems(),
    getStaffList(),
    getMenuItems(),
  ]);
  const selectedCustomer = customers.find((c) => c.customer.id === customerId);
  const menuOptions = menuItems.map((m) => m.name);

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href={customerId ? `/customers/${customerId}` : "/sessions"}
        className="group mb-4 inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary"
      >
        <ChevronLeft className="size-4" />
        <span className={LINK_UNDERLINE}>戻る</span>
      </Link>

      <PageHeader
        title="セッションを記録"
        description="トレーニング内容を記録します。回数券をお持ちの場合は自動で1回消化されます。"
        actions={<VoiceRecordDialog defaultOpen={voice === "1"} />}
      />

      <Card className="shadow-none">
        <CardContent className="pt-6">
          <form action={createSessionAction} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="customerId">
                  顧客 <span className="text-danger">*</span>
                </Label>
                <Select name="customerId" required defaultValue={selectedCustomer?.customer.id}>
                  <SelectTrigger id="customerId" className="w-full">
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((c) => (
                      <SelectItem key={c.customer.id} value={c.customer.id}>
                        {c.customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="date">
                  日付 <span className="text-danger">*</span>
                </Label>
                <Input id="date" name="date" type="date" defaultValue={todayStr()} required />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="staffId">
                  担当トレーナー <span className="text-danger">*</span>
                </Label>
                <Select name="staffId" required defaultValue={selectedCustomer?.customer.primaryStaffId ?? staffList[0]?.id}>
                  <SelectTrigger id="staffId" className="w-full">
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    {staffList.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="condition">コンディション</Label>
                <Input id="condition" name="condition" placeholder="例: 良好、腰に違和感あり" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label>トレーニング内容</Label>
              <ExerciseFields menuOptions={menuOptions} />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="nutritionGuidance">食事指導</Label>
                <Textarea id="nutritionGuidance" name="nutritionGuidance" rows={2} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="customerFeedback">顧客の反応</Label>
                <Textarea id="customerFeedback" name="customerFeedback" rows={2} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="cautions">注意事項</Label>
                <Textarea id="cautions" name="cautions" rows={2} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="nextPlan">次回メニュー</Label>
                <Textarea id="nextPlan" name="nextPlan" rows={2} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="trainerMemo">トレーナーメモ</Label>
                <Textarea id="trainerMemo" name="trainerMemo" rows={2} />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-border pt-5">
              <Button type="button" variant="outline" asChild>
                <Link href={customerId ? `/customers/${customerId}` : "/sessions"}>キャンセル</Link>
              </Button>
              <Button type="submit">記録する</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
