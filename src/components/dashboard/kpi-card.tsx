import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { CARD_LIFT } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Tone = "primary" | "success" | "warning" | "danger";

const toneChipClasses: Record<Tone, string> = {
  primary: "bg-gradient-to-br from-primary/20 to-primary/5 text-primary",
  success: "bg-gradient-to-br from-success/20 to-success/5 text-success",
  warning: "bg-gradient-to-br from-warning/20 to-warning/5 text-warning",
  danger: "bg-gradient-to-br from-danger/20 to-danger/5 text-danger",
};

export function KpiCard({
  label,
  value,
  icon: Icon,
  tone = "primary",
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: Tone;
}) {
  return (
    <Card className={cn("shadow-none", CARD_LIFT)}>
      <CardContent className="flex items-center gap-4 px-5 py-4">
        <div className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl", toneChipClasses[tone])}>
          <Icon className="size-5" strokeWidth={2} />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-medium tracking-wide text-text-secondary uppercase">{label}</p>
          <p className="mt-0.5 text-2xl font-semibold tracking-tight text-text-primary tabular-nums">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
