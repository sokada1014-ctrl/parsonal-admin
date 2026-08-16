import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSessionListItems } from "@/lib/data-access";
import { formatDate } from "@/lib/format";
import { CARD_LIFT } from "@/lib/motion";
import { cn } from "@/lib/utils";

export default async function SessionsPage() {
  const sessions = await getSessionListItems();

  return (
    <div>
      <PageHeader
        title="セッション"
        description={`直近の記録 ${sessions.length}件`}
        actions={
          <Button asChild>
            <Link href="/sessions/new">
              <Plus className="size-4" />
              セッションを記録
            </Link>
          </Button>
        }
      />

      {sessions.length === 0 ? (
        <p className="py-12 text-center text-sm text-text-muted">セッション記録はまだありません</p>
      ) : (
        <div className="flex flex-col gap-3">
          {sessions.map((session) => (
            <Link key={session.id} href={`/customers/${session.customerId}?tab=sessions`}>
              <Card className={cn("shadow-none", CARD_LIFT)}>
                <CardContent className="flex flex-col gap-1.5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="min-w-0 truncate text-base font-semibold text-text-primary">
                      {session.customerName}
                    </span>
                    <span className="shrink-0 text-sm font-medium text-text-secondary">
                      {formatDate(session.date)}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-text-secondary">
                    <span>担当: {session.staffName ?? "-"}</span>
                    <span className="text-text-muted">・</span>
                    <span>種目 {session.exercises.length}件</span>
                    {session.condition && (
                      <Badge variant="secondary" className="bg-muted text-text-secondary">
                        {session.condition}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
