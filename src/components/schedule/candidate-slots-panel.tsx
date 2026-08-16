"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CalendarPlus, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { sendCandidateSlotsMessageAction } from "@/lib/actions";

export interface CandidateSlot {
  id: string;
  label: string;
}

export function CandidateSlotsPanel({
  slots,
  onRemove,
  onClear,
  customers,
}: {
  slots: CandidateSlot[];
  onRemove: (id: string) => void;
  onClear: () => void;
  customers: { id: string; name: string }[];
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [customerId, setCustomerId] = useState<string>("");
  const [sending, setSending] = useState(false);

  if (slots.length === 0) return null;

  const draft = `候補日程をお送りします。ご都合の良い日時があればお知らせください。\n\n${slots
    .map((s) => `・${s.label}`)
    .join("\n")}`;

  async function handleSend() {
    if (!customerId) return;
    setSending(true);
    try {
      await sendCandidateSlotsMessageAction(
        customerId,
        slots.map((s) => s.label),
      );
      toast.success("候補日程をメッセージで送信しました");
      setDialogOpen(false);
      onClear();
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <Card className="fixed right-6 bottom-6 z-30 w-80 animate-in slide-in-from-bottom-4 fade-in gap-3 py-4 shadow-xl duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-0">
          <CardTitle className="flex items-center gap-2 text-sm">
            <CalendarPlus className="size-4 text-primary" />
            候補日程 ({slots.length}件)
          </CardTitle>
          <Button variant="ghost" size="icon" className="size-6 hover:bg-danger-light hover:text-danger" onClick={onClear}>
            <X className="size-3.5" />
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 pt-0">
          <div className="flex max-h-40 flex-col gap-1 overflow-y-auto">
            {slots.map((s) => (
              <div
                key={s.id}
                className="group flex animate-in items-center justify-between gap-2 rounded-md bg-muted px-2 py-1.5 text-xs fade-in hover:bg-primary-light"
              >
                <span className="text-text-primary group-hover:text-primary">{s.label}</span>
                <button
                  onClick={() => onRemove(s.id)}
                  className="shrink-0 rounded-full p-0.5 text-text-muted hover:bg-danger-light hover:text-danger"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
          <Button
            size="sm"
            className="mt-1"
            onClick={() => setDialogOpen(true)}
          >
            <Send className="size-3.5" />
            顧客にメッセージで送る
          </Button>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>候補日程をメッセージで送信</DialogTitle>
            <DialogDescription>
              選択した空き日程を顧客に送信します(シミュレーション: 顧客の「メッセージ」タブに記録されます)。
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-primary">送信先の顧客</label>
            <Select value={customerId} onValueChange={setCustomerId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="顧客を選択してください" />
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
            <label className="text-sm font-medium text-text-primary">メッセージ内容</label>
            <Textarea defaultValue={draft} rows={6} readOnly className="text-sm text-text-secondary" />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={handleSend} disabled={!customerId || sending}>
              {sending ? "送信中..." : "送信する"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
