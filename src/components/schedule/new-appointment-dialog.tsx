"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MenuComboInput } from "@/components/menu-combo-input";
import { createAppointmentAction } from "@/lib/actions";

interface Option {
  id: string;
  name: string;
}

export function NewAppointmentDialog({
  customers,
  staffList,
  menuOptions = [],
  defaultDate,
}: {
  customers: Option[];
  staffList: Option[];
  menuOptions?: string[];
  defaultDate: string;
}) {
  const [open, setOpen] = useState(false);

  async function handleSubmit(formData: FormData) {
    await createAppointmentAction(formData);
    setOpen(false);
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="size-4" />
        新規予約
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新規予約</DialogTitle>
          </DialogHeader>
          <form action={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ap-customer">
                顧客 <span className="text-danger">*</span>
              </Label>
              <Select name="customerId" required>
                <SelectTrigger id="ap-customer" className="w-full">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ap-staff">
                担当者 <span className="text-danger">*</span>
              </Label>
              <Select name="staffId" required defaultValue={staffList[0]?.id}>
                <SelectTrigger id="ap-staff" className="w-full">
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

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="ap-date">
                  日付 <span className="text-danger">*</span>
                </Label>
                <Input id="ap-date" name="date" type="date" defaultValue={defaultDate} required />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="ap-time">
                  開始時刻 <span className="text-danger">*</span>
                </Label>
                <Input id="ap-time" name="startTime" type="time" defaultValue="10:00" required />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ap-duration">セッション時間</Label>
              <Select name="durationMin" defaultValue="60">
                <SelectTrigger id="ap-duration" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30分</SelectItem>
                  <SelectItem value="45">45分</SelectItem>
                  <SelectItem value="60">60分</SelectItem>
                  <SelectItem value="90">90分</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ap-menu">メニュー</Label>
              <MenuComboInput id="ap-menu" name="menu" options={menuOptions} placeholder="例: 下半身トレーニング" />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ap-note">メモ</Label>
              <Textarea id="ap-note" name="note" rows={2} />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                キャンセル
              </Button>
              <Button type="submit">予約を登録</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
