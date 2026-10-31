import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { CARD_LIFT } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Tone = "primary" | "success" | "warning" | "danger";

const toneChipClasses: Record<Tone, string> = {
  primary:
    "bg-gradient-to-br from-primary/25 to-primary/5 text-primary shadow-[0_4px_16px_-4px_rgb(from_var(--primary)_r_g_b_/_0.5)]",
  success:
    "bg-gradient-to-br from-success/25 to-success/5 text-success shadow-[0_4px_16px_-4px_rgb(from_var(--success)_r_g_b_/_0.45)]",
  warning:
    "bg-gradient-to-br from-warning/25 to-warning/5 text-warning shadow-[0_4px_16px_-4px_rgb(from_var(--warning)_r_g_b_/_0.45)]",
  danger:
    "bg-gradient-to-br from-danger/25 to-danger/5 text-danger shadow-[0_4px_16px_-4px_rgb(from_var(--danger)_r_g_b_/_0.45)]",
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
