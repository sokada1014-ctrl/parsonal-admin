"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { syncSquareCustomersAction } from "@/lib/actions";

export function SquareSyncButton() {
  const [isPending, startTransition] = useTransition();
  const [lastResult, setLastResult] = useState<{ imported: number; skipped: number } | null>(null);

  function handleSync() {
    startTransition(async () => {
      try {
        const result = await syncSquareCustomersAction();
        if (!result.configured) {
          toast.error("Square連携が設定されていません");
          return;
        }
        setLastResult({ imported: result.imported, skipped: result.skipped });
        toast.success(`同期が完了しました(新規${result.imported}件 / 重複スキップ${result.skipped}件)`);
      } catch {
        toast.error("同期中にエラーが発生しました。認証情報を確認してください");
      }
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={handleSync} disabled={isPending} className="w-fit">
        <RefreshCw className={isPending ? "animate-spin" : ""} />
        {isPending ? "同期中..." : "顧客データを同期"}
      </Button>
      {lastResult && (
        <p className="text-xs text-text-secondary">
          前回の同期: 新規{lastResult.imported}件 / 重複スキップ{lastResult.skipped}件
        </p>
      )}
    </div>
  );
}
