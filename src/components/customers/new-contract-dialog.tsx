"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createContractAction } from "@/lib/actions";
import type { PlanTemplate, PlanType } from "@/lib/types";

const CUSTOM_VALUE = "__custom__";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export function NewContractDialog({ customerId, planTemplates }: { customerId: string; planTemplates: PlanTemplate[] }) {
  const [open, setOpen] = useState(false);
  const [templateId, setTemplateId] = useState<string>(planTemplates[0]?.id ?? CUSTOM_VALUE);
  const [customPlanType, setCustomPlanType] = useState<PlanType>("monthly");

  const isCustom = templateId === CUSTOM_VALUE;
  const selectedTemplate = planTemplates.find((t) => t.id === templateId);
  const effectiveType = isCustom ? customPlanType : selectedTemplate?.planType;

  async function handleSubmit(formData: FormData) {
    if (!isCustom) formData.set("planTemplateId", templateId);
    await createContractAction(formData);
    setOpen(false);
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="size-4" />
        契約を追加
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>契約・回数券を追加</DialogTitle>
          </DialogHeader>
          <form action={handleSubmit} className="flex flex-col gap-4">
            <input type="hidden" name="customerId" value={customerId} />

            <div className="flex flex-col gap-1.5">
              <Label>プラン</Label>
              <Select value={templateId} onValueChange={setTemplateId}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {planTemplates.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                  <SelectItem value={CUSTOM_VALUE}>自由入力...</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isCustom && (
              <>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="customPlanName">
                    プラン名 <span className="text-danger">*</span>
                  </Label>
                  <Input id="customPlanName" name="customPlanName" placeholder="例: 特別プラン" required />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="planType">プランタイプ</Label>
                  <Select name="planType" value={customPlanType} onValueChange={(v) => setCustomPlanType(v as PlanType)}>
                    <SelectTrigger id="planType" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">月謝制</SelectItem>
                      <SelectItem value="ticket">回数券</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {effectiveType === "monthly" && (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="monthlyFee">月額料金(円)</Label>
                <Input
                  id="monthlyFee"
                  name="monthlyFee"
                  type="number"
                  defaultValue={selectedTemplate?.monthlyFee}
                  placeholder="32000"
                />
              </div>
            )}

            {effectiveType === "ticket" && (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="ticketCount">購入回数</Label>
                <Input
                  id="ticketCount"
                  name="ticketCount"
                  type="number"
                  defaultValue={selectedTemplate?.ticketCount}
                  placeholder="10"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="startDate">開始日</Label>
                <Input id="startDate" name="startDate" type="date" defaultValue={todayStr()} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="renewalDate">更新日(月謝制)</Label>
                <Input id="renewalDate" name="renewalDate" type="date" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="status">ステータス</Label>
              <Select name="status" defaultValue="active">
                <SelectTrigger id="status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">契約中</SelectItem>
                  <SelectItem value="paused">休会</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
