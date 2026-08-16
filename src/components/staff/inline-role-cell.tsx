"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateStaffRoleAction } from "@/lib/actions";
import type { StaffRole } from "@/lib/types";

const roleLabels: Record<StaffRole, string> = {
  owner: "オーナー",
  manager: "マネージャー",
  trainer: "トレーナー",
};

export function InlineRoleCell({ staffId, currentRole }: { staffId: string; currentRole: StaffRole }) {
  const router = useRouter();
  const [value, setValue] = useState<StaffRole>(currentRole);
  const [, startTransition] = useTransition();

  return (
    <Select
      value={value}
      onValueChange={(next) => {
        setValue(next as StaffRole);
        startTransition(async () => {
          await updateStaffRoleAction(staffId, next as StaffRole);
          router.refresh();
        });
      }}
    >
      <SelectTrigger
        size="sm"
        className="w-full max-w-36 border-transparent bg-transparent px-2 shadow-none hover:border-input hover:bg-muted data-[state=open]:border-input data-[state=open]:bg-muted"
      >
        <SelectValue>{roleLabels[value]}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {(Object.keys(roleLabels) as StaffRole[]).map((role) => (
          <SelectItem key={role} value={role}>
            {roleLabels[role]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
