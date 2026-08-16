import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { CARD_LIFT } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
}) {
  return (
    <Card className={cn("shadow-none", CARD_LIFT)}>
      <CardContent className="flex items-center gap-4 px-5 py-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
          <Icon className="size-5" strokeWidth={2} />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-text-secondary">{label}</p>
          <p className="mt-0.5 text-xl font-semibold tracking-tight text-text-primary">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
