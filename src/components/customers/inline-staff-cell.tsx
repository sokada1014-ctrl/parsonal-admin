"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateCustomerStaffAction } from "@/lib/actions";

export function InlineStaffCell({
  customerId,
  currentStaffId,
  staffOptions,
}: {
  customerId: string;
  currentStaffId: string;
  staffOptions: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [value, setValue] = useState(currentStaffId);
  const [isPending, startTransition] = useTransition();

  return (
    <Select
      value={value}
      onValueChange={(next) => {
        setValue(next);
        startTransition(async () => {
          await updateCustomerStaffAction(customerId, next);
          router.refresh();
        });
      }}
    >
      <SelectTrigger
        size="sm"
        className="w-full max-w-40 border-transparent bg-transparent px-2 shadow-none hover:border-input hover:bg-muted data-[state=open]:border-input data-[state=open]:bg-muted"
        onClick={(e) => e.stopPropagation()}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent onClick={(e) => e.stopPropagation()}>
        {staffOptions.map((s) => (
          <SelectItem key={s.id} value={s.id}>
            {s.name}
          </SelectItem>
        ))}
      </SelectContent>
      {isPending && <span className="sr-only">更新中...</span>}
    </Select>
  );
}
