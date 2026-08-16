import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/page-header";
import { getCustomerById, getStaffList } from "@/lib/data-access";
import { updateCustomerAction } from "@/lib/actions";
import { LINK_UNDERLINE } from "@/lib/motion";

export default async function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [customer, staffList] = await Promise.all([getCustomerById(id), getStaffList()]);
  if (!customer) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href={`/customers/${id}`}
        className="group mb-4 inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary"
      >
        <ChevronLeft className="size-4" />
        <span className={LINK_UNDERLINE}>顧客詳細に戻る</span>
      </Link>
      <PageHeader title="顧客情報を編集" description={`${customer.name}さんの情報を編集します`} />

      <Card className="shadow-none">
        <CardContent className="pt-6">
          <form action={updateCustomerAction} className="flex flex-col gap-5">
            <input type="hidden" name="id" value={customer.id} />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="name">
                  氏名 <span className="text-danger">*</span>
                </Label>
                <Input id="name" name="name" defaultValue={customer.name} required />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="birthDate">生年月日</Label>
                <Input id="birthDate" name="birthDate" type="date" defaultValue={customer.birthDate} />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="gender">性別</Label>
                <Select name="gender" defaultValue={customer.gender}>
                  <SelectTrigger id="gender" className="w-full">
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">男性</SelectItem>
                    <SelectItem value="female">女性</SelectItem>
                    <SelectItem value="other">その他</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="phone">電話番号</Label>
                <Input id="phone" name="phone" type="tel" defaultValue={customer.phone} />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">メールアドレス</Label>
                <Input id="email" name="email" type="email" defaultValue={customer.email} />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="primaryStaffId">
                  担当トレーナー <span className="text-danger">*</span>
                </Label>
                <Select name="primaryStaffId" required defaultValue={customer.primaryStaffId}>
                  <SelectTrigger id="primaryStaffId" className="w-full">
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

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="status">契約ステータス</Label>
                <Select name="status" defaultValue={customer.status}>
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">契約中</SelectItem>
                    <SelectItem value="paused">休会</SelectItem>
                    <SelectItem value="cancelled">解約</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="goal">目標</Label>
                <Input id="goal" name="goal" defaultValue={customer.goal} />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="cautions">注意事項(既往歴・怪我など)</Label>
                <Textarea id="cautions" name="cautions" rows={2} defaultValue={customer.cautions} />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="memo">顧客メモ</Label>
                <Textarea id="memo" name="memo" rows={3} defaultValue={customer.memo} />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-border pt-5">
              <Button type="button" variant="outline" asChild>
                <Link href={`/customers/${id}`}>キャンセル</Link>
              </Button>
              <Button type="submit">保存する</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
