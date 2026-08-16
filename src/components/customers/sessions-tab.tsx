import Link from "next/link";
import { Mic, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import { CARD_LIFT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { CustomerFullProfile } from "@/lib/data-access";

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
            <Card key={session.id} className={cn("shadow-none", CARD_LIFT)}>
              <CardContent className="p-5">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-text-primary">{formatDate(session.date)}</span>
                  {session.condition && (
                    <Badge variant="secondary" className="bg-muted text-text-secondary">
                      コンディション: {session.condition}
                    </Badge>
                  )}
                </div>

                {session.exercises.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {session.exercises.map((ex) => (
                      <span
                        key={ex.id}
                        className="rounded-lg bg-primary-light px-2.5 py-1 text-xs font-medium text-primary"
                      >
                        {ex.name} {ex.weightKg ? `${ex.weightKg}kg` : ""} × {ex.reps ?? "-"}回 × {ex.sets ?? "-"}set
                      </span>
                    ))}
                  </div>
                )}

                <dl className="grid grid-cols-1 gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
                  {session.customerFeedback && (
                    <div>
                      <dt className="text-text-secondary">顧客の反応</dt>
                      <dd className="text-text-primary">{session.customerFeedback}</dd>
                    </div>
                  )}
                  {session.nutritionGuidance && (
                    <div>
                      <dt className="text-text-secondary">食事指導</dt>
                      <dd className="text-text-primary">{session.nutritionGuidance}</dd>
                    </div>
                  )}
                  {session.cautions && (
                    <div>
                      <dt className="text-text-secondary">注意事項</dt>
                      <dd className="text-danger">{session.cautions}</dd>
                    </div>
                  )}
                  {session.nextPlan && (
                    <div>
                      <dt className="text-text-secondary">次回メニュー</dt>
                      <dd className="text-text-primary">{session.nextPlan}</dd>
                    </div>
                  )}
                  {session.trainerMemo && (
                    <div className="sm:col-span-2">
                      <dt className="text-text-secondary">トレーナーメモ</dt>
                      <dd className="text-text-primary">{session.trainerMemo}</dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
