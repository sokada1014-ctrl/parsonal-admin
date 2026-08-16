"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { formatDateTime } from "@/lib/format";
import { CARD_LIFT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Message } from "@/lib/types";

const messageTypeLabel: Record<Message["type"], string> = {
  follow_up: "フォロー",
  reminder: "リマインド",
  campaign: "キャンペーン",
  manual: "手動送信",
};

export function MessagesTab({ customerName, messages }: { customerName: string; messages: Message[] }) {
  const [open, setOpen] = useState(false);
  const draft = `${customerName}さん、いつもありがとうございます!\n現在チケットが残りわずかとなっています。次回以降についてもご希望があればお気軽にご相談ください。`;

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button variant="outline" onClick={() => setOpen(true)}>
          <Sparkles className="size-4" />
          フォロー文章をAIで作成
        </Button>
      </div>

      {messages.length === 0 ? (
        <p className="py-12 text-center text-sm text-text-muted">メッセージ履歴はまだありません</p>
      ) : (
        <div className="flex flex-col gap-3">
          {messages.map((m) => (
            <Card key={m.id} className={cn("shadow-none", CARD_LIFT)}>
              <CardContent className="flex items-start justify-between gap-4 p-4">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <Badge variant="secondary" className="bg-muted text-text-secondary">
                      {messageTypeLabel[m.type]}
                    </Badge>
                    <span className="text-xs text-text-muted">{formatDateTime(m.sentAt)}</span>
                  </div>
                  <p className="text-sm text-text-primary">{m.body}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AIフォロー文章(ドラフト)</DialogTitle>
            <DialogDescription>
              顧客の状況に応じた文章案です。内容を確認・編集してから送信してください。
            </DialogDescription>
          </DialogHeader>
          <Textarea defaultValue={draft} rows={6} />
          <p className="text-xs text-text-muted">
            ※ AI自動生成・LINE連携は今後のアップデートで対応予定です。現在はドラフト表示のみです。
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              閉じる
            </Button>
            <Button disabled>送信する(準備中)</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
