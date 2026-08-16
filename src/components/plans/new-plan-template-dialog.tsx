"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createPlanTemplateAction } from "@/lib/actions";
import type { PlanType } from "@/lib/types";

export function NewPlanTemplateDialog() {
  const [open, setOpen] = useState(false);
  const [planType, setPlanType] = useState<PlanType>("monthly");

  async function handleSubmit(formData: FormData) {
    await createPlanTemplateAction(formData);
    setOpen(false);
    setPlanType("monthly");
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="size-4" />
        プランを追加
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>契約プランを追加</DialogTitle>
          </DialogHeader>
          <form action={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="plan-name">
                プラン名 <span className="text-danger">*</span>
              </Label>
              <Input id="plan-name" name="name" placeholder="例: スタンダード月4回プラン" required />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="plan-type">
                プランタイプ <span className="text-danger">*</span>
              </Label>
              <Select name="planType" value={planType} onValueChange={(v) => setPlanType(v as PlanType)}>
                <SelectTrigger id="plan-type" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">月謝制</SelectItem>
                  <SelectItem value="ticket">回数券</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {planType === "monthly" ? (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="plan-fee">月額料金(円)</Label>
                <Input id="plan-fee" name="monthlyFee" type="number" placeholder="32000" />
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="plan-count">購入回数</Label>
                <Input id="plan-count" name="ticketCount" type="number" placeholder="10" />
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                キャンセル
              </Button>
              <Button type="submit">追加する</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
