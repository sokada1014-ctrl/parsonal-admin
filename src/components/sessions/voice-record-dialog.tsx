"use client";

import { useRef, useState } from "react";
import { Mic, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// アプリ全体で唯一のスポットライト演出(マウス追従のradial-gradient)。
// AI音声カルテ = プロダクトの差別化機能であることを示すための特別枠。
// 通常のボタン/カードには絶対に使わない。
function SpotlightMicButton({ onStart }: { onStart: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [spot, setSpot] = useState({ x: 50, y: 50 });

  function handleMouseMove(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setSpot({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }

  return (
    <button
      ref={ref}
      type="button"
      onMouseMove={handleMouseMove}
      onClick={onStart}
      className="group relative flex size-16 items-center justify-center overflow-hidden rounded-full bg-primary text-white transition-transform duration-200 ease-out hover:scale-105 active:scale-95"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at ${spot.x}% ${spot.y}%, rgba(255,255,255,0.45), transparent 60%)`,
        }}
      />
      <Mic className="relative size-7" />
    </button>
  );
}

const exampleTranscript =
  "今日はスクワット60kgを10回3セット。腰の痛みなし。前回よりフォーム改善。次回はデッドリフトを追加する。";

export function VoiceRecordDialog({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const [step, setStep] = useState<"idle" | "recording" | "result">("idle");

  return (
    <>
      <Button type="button" variant="outline" onClick={() => setOpen(true)}>
        <Mic className="size-4" />
        音声から記録
      </Button>

      <Dialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setStep("idle");
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AI音声カルテ</DialogTitle>
            <DialogDescription>
              トレーニング内容を話すだけで、AIが自動的に記録を構造化します。(準備中の機能のプレビューです)
            </DialogDescription>
          </DialogHeader>

          {step === "idle" && (
            <div className="flex flex-col items-center gap-4 py-6">
              <SpotlightMicButton
                onStart={() => {
                  setStep("recording");
                  setTimeout(() => setStep("result"), 1200);
                }}
              />
              <p className="text-sm text-text-secondary">タップして録音を開始</p>
            </div>
          )}

          {step === "recording" && (
            <div className="flex flex-col items-center gap-4 py-6">
              <div className="flex size-16 items-center justify-center rounded-full bg-danger-light">
                <Mic className="size-7 animate-pulse text-danger" />
              </div>
              <p className="text-sm text-text-secondary">録音中...(解析中)</p>
            </div>
          )}

          {step === "result" && (
            <div className="flex flex-col gap-4">
              <div className="rounded-lg bg-muted p-3 text-sm text-text-secondary">
                <span className="font-medium text-text-primary">認識テキスト: </span>
                {exampleTranscript}
              </div>

              <div className="flex items-center gap-2 text-sm font-medium text-primary">
                <Sparkles className="size-4" />
                構造化結果(プレビュー)
              </div>

              <dl className="grid grid-cols-1 gap-3 rounded-lg border border-border p-4 text-sm">
                <div>
                  <dt className="text-text-secondary">今日の実施内容</dt>
                  <dd className="text-text-primary">スクワット 60kg × 10回 × 3set</dd>
                </div>
                <div>
                  <dt className="text-text-secondary">コンディション</dt>
                  <dd className="text-text-primary">腰痛なし</dd>
                </div>
                <div>
                  <dt className="text-text-secondary">所感</dt>
                  <dd className="text-text-primary">前回よりフォーム改善</dd>
                </div>
                <div>
                  <dt className="text-text-secondary">次回予定</dt>
                  <dd className="text-text-primary">デッドリフト追加</dd>
                </div>
              </dl>
              <p className="text-xs text-text-muted">
                ※ 実際のAI音声解析は今後のアップデートで対応予定です。内容を確認の上、下のフォームに転記してください。
              </p>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              閉じる
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
