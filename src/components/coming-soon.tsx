import type { LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/page-header";

export function ComingSoon({
  title,
  description,
  icon: Icon,
  phase,
  bullets,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  phase: string;
  bullets: string[];
}) {
  return (
    <div>
      <PageHeader title={title} description={description} />
      <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border bg-surface px-6 py-16 text-center">
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary-light text-primary">
          <Icon className="size-6" />
        </div>
        <div>
          <p className="font-medium text-text-primary">{phase}で実装予定です</p>
          <p className="mt-1 text-sm text-text-secondary">準備が整い次第、この画面から利用できるようになります</p>
        </div>
        <ul className="mt-2 flex flex-col gap-1.5 text-sm text-text-secondary">
          {bullets.map((b) => (
            <li key={b}>・{b}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
