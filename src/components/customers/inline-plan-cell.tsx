"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { updateCustomerPlanAction } from "@/lib/actions";
import { cn } from "@/lib/utils";
import type { PlanTemplate } from "@/lib/types";

export function InlinePlanCell({
  customerId,
  currentPlanName,
  planTemplates,
}: {
  customerId: string;
  currentPlanName?: string;
  planTemplates: PlanTemplate[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [customText, setCustomText] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [isPending, startTransition] = useTransition();

  function applyTemplate(templateId: string) {
    startTransition(async () => {
      await updateCustomerPlanAction(customerId, { planTemplateId: templateId });
      router.refresh();
    });
    setOpen(false);
  }

  function applyCustom() {
    if (!customText.trim()) return;
    startTransition(async () => {
      await updateCustomerPlanAction(customerId, { customPlanName: customText.trim() });
      router.refresh();
    });
    setOpen(false);
    setShowCustomInput(false);
    setCustomText("");
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          className="flex w-full max-w-44 items-center justify-between gap-1 truncate rounded-md px-2 py-1 text-left hover:bg-muted"
        >
          <span className={cn("truncate", !currentPlanName && "text-text-muted")}>
            {currentPlanName ?? "未契約"}
          </span>
          <ChevronDown className="size-3.5 shrink-0 text-text-muted" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64" onClick={(e) => e.stopPropagation()}>
        <p className="px-1 pb-1 text-xs font-medium text-text-secondary">契約プランを選択</p>
        <div className="flex flex-col gap-0.5">
          {planTemplates.map((t) => (
            <button
              key={t.id}
              type="button"
              disabled={isPending}
              onClick={() => applyTemplate(t.id)}
              className="flex items-center justify-between rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted"
            >
              {t.name}
              {t.name === currentPlanName && <Check className="size-3.5 text-primary" />}
            </button>
          ))}
        </div>

        {showCustomInput ? (
          <div className="flex gap-1.5 border-t border-border pt-2">
            <Input
              autoFocus
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="プラン名を入力"
              className="h-8 text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter") applyCustom();
              }}
            />
            <Button size="sm" className="h-8" onClick={applyCustom}>
              適用
            </Button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowCustomInput(true)}
            className="rounded-md border-t border-border px-2 pt-2 text-left text-sm text-text-secondary hover:text-text-primary"
          >
            自由入力...
          </button>
        )}
      </PopoverContent>
    </Popover>
  );
}
