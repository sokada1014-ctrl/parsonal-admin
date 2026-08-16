import Link from "next/link";
import { AlertTriangle, ArrowRight, HeartPulse, Mic, MessageCircle, NotebookPen, Plus, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import { CARD_LIFT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { CustomerFullProfile } from "@/lib/data-access";
import type { Session } from "@/lib/types";

function SecondaryLine({
  icon: Icon,
  children,
  tone = "muted",
}: {
  icon: typeof MessageCircle;
  children: React.ReactNode;
  tone?: "muted" | "danger";
}) {
  return (
    <div className={cn("flex items-start gap-1.5 text-xs", tone === "danger" ? "text-danger" : "text-text-secondary")}>
      <Icon className="mt-0.5 size-3.5 shrink-0" />
      <span className="min-w-0">{children}</span>
    </div>
  );
}

function SessionCard({ session }: { session: Session }) {
  const hasSecondaryInfo =
    session.customerFeedback || session.nutritionGuidance || session.cautions || session.nextPlan || session.trainerMemo;

  return (
    <Card className={cn("shadow-none", CARD_LIFT)}>
      <CardContent className="p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <span className="text-base font-semibold text-text-primary">{formatDate(session.date)}</span>
          {session.condition && (
            <span className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-text-secondary">
              <HeartPulse className="size-3.5 text-primary" />
              {session.condition}
            </span>
          )}
        </div>

        {/* トレーニングメニュー: このカードの主役なので大きく・表形式で見せる */}
        {session.exercises.length > 0 ? (
          <div className="overflow-hidden rounded-lg border border-border">
            <div className="grid grid-cols-[1fr_72px_64px_64px] gap-2 bg-muted px-3 py-1.5 text-xs font-medium text-text-secondary">
              <span>種目</span>
              <span className="text-right">重量</span>
              <span className="text-right">回数</span>
              <span className="text-right">セット</span>
            </div>
            <div className="divide-y divide-border">
              {session.exercises.map((ex) => (
                <div key={ex.id} className="grid grid-cols-[1fr_72px_64px_64px] items-center gap-2 px-3 py-2">
                  <span className="truncate text-sm font-semibold text-text-primary">{ex.name}</span>
                  <span className="text-right text-sm text-text-primary tabular-nums">
                    {ex.weightKg !== undefined ? `${ex.weightKg}kg` : "-"}
                  </span>
                  <span className="text-right text-sm text-text-primary tabular-nums">
                    {ex.reps !== undefined ? `${ex.reps}回` : "-"}
                  </span>
                  <span className="text-right text-sm text-text-primary tabular-nums">
                    {ex.sets !== undefined ? `${ex.sets}set` : "-"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-border px-3 py-4 text-center text-sm text-text-muted">
            トレーニング内容の記録はありません
          </p>
        )}

        {/* 補足情報: 主役ではないので小さく・簡潔に */}
        {hasSecondaryInfo && (
          <div className="mt-3 flex flex-col gap-1 border-t border-border pt-3">
            {session.cautions && (
              <SecondaryLine icon={AlertTriangle} tone="danger">
                {session.cautions}
              </SecondaryLine>
            )}
            {session.customerFeedback && <SecondaryLine icon={MessageCircle}>{session.customerFeedback}</SecondaryLine>}
            {session.nutritionGuidance && <SecondaryLine icon={Utensils}>{session.nutritionGuidance}</SecondaryLine>}
            {session.nextPlan && (
              <SecondaryLine icon={ArrowRight}>
                次回: {session.nextPlan}
              </SecondaryLine>
            )}
            {session.trainerMemo && <SecondaryLine icon={NotebookPen}>{session.trainerMemo}</SecondaryLine>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function SessionsTab({ profile }: { profile: CustomerFullProfile }) {
  const { customer, sessions } = profile;

  return (
    <div>
      <div className="mb-4 flex justify-end gap-2">
        <Button variant="outline" asChild>
          <Link href={`/sessions/new?customerId=${customer.id}&voice=1`}>
            <Mic className="size-4" />
            音声から記録
          </Link>
        </Button>
        <Button asChild>
          <Link href={`/sessions/new?customerId=${customer.id}`}>
            <Plus className="size-4" />
            セッションを記録
          </Link>
        </Button>
      </div>

      {sessions.length === 0 ? (
        <p className="py-12 text-center text-sm text-text-muted">セッション履歴はまだありません</p>
      ) : (
        <div className="flex flex-col gap-4">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      )}
    </div>
  );
}
