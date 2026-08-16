import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/page-header";
import { getStaffList } from "@/lib/data-access";
import { createCustomerAction } from "@/lib/actions";
import { LINK_UNDERLINE } from "@/lib/motion";

export default async function NewCustomerPage() {
  const staffList = await getStaffList();

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/customers"
        className="group mb-4 inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary"
      >
        <ChevronLeft className="size-4" />
        <span className={LINK_UNDERLINE}>顧客一覧に戻る</span>
      </Link>
      <PageHeader title="新規顧客登録" description="最低限の情報だけで登録できます。詳細情報は後から追加できます。" />

      <Card className="shadow-none">
        <CardContent className="pt-6">
          <form action={createCustomerAction} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="name">
                  氏名 <span className="text-danger">*</span>
                </Label>
                <Input id="name" name="name" placeholder="山田 太郎" required />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="birthDate">生年月日</Label>
                <Input id="birthDate" name="birthDate" type="date" />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="gender">性別</Label>
                <Select name="gender">
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
                <Input id="phone" name="phone" type="tel" placeholder="090-1234-5678" />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">メールアドレス</Label>
                <Input id="email" name="email" type="email" placeholder="you@example.com" />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="primaryStaffId">
                  担当トレーナー <span className="text-danger">*</span>
                </Label>
                <Select name="primaryStaffId" required defaultValue={staffList[0]?.id}>
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

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="goal">目標</Label>
                <Input id="goal" name="goal" placeholder="例: ダイエット(-5kg)" />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="cautions">注意事項(既往歴・怪我など)</Label>
                <Textarea id="cautions" name="cautions" rows={2} placeholder="例: 膝に既往歴あり" />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="memo">顧客メモ</Label>
                <Textarea id="memo" name="memo" rows={3} />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-border pt-5">
              <Button type="button" variant="outline" asChild>
                <Link href="/customers">キャンセル</Link>
              </Button>
              <Button type="submit">登録する</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
