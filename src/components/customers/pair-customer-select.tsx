"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const NONE_VALUE = "__none__";

export function PairCustomerSelect({
  customerId,
  currentPairedId,
  candidates,
  action,
}: {
  customerId: string;
  currentPairedId?: string;
  candidates: { id: string; name: string }[];
  action: (customerId: string, pairedCustomerId: string | null) => Promise<void>;
}) {
  const router = useRouter();
  const [value, setValue] = useState(currentPairedId ?? NONE_VALUE);
  const [isPending, startTransition] = useTransition();

  return (
    <Select
      value={value}
      onValueChange={(next) => {
        setValue(next);
        startTransition(async () => {
          await action(customerId, next === NONE_VALUE ? null : next);
          router.refresh();
        });
      }}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="選択してください" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={NONE_VALUE}>なし</SelectItem>
        {candidates.map((c) => (
          <SelectItem key={c.id} value={c.id}>
            {c.name}
          </SelectItem>
        ))}
      </SelectContent>
      {isPending && <span className="sr-only">更新中...</span>}
    </Select>
  );
}
