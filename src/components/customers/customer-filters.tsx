"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const statusOptions = [
  { value: "all", label: "すべて" },
  { value: "trial", label: "体験中" },
  { value: "active", label: "契約中" },
  { value: "paused", label: "休会" },
  { value: "cancelled", label: "解約" },
  { value: "no_next_appointment", label: "次回予約なし" },
  { value: "ticket_low", label: "回数券残りわずか" },
];

export function CustomerFilters({ staffOptions }: { staffOptions: { id: string; name: string }[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [, startTransition] = useTransition();

  function updateParams(next: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (!value || value === "all") params.delete(key);
      else params.set(key, value);
    }
    startTransition(() => {
      router.push(`/customers?${params.toString()}`);
    });
  }

  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1 sm:max-w-xs">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-text-muted" />
        <Input
          placeholder="顧客名で検索"
          className="pl-9"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") updateParams({ q });
          }}
          onBlur={() => updateParams({ q })}
        />
      </div>

      <Select defaultValue={searchParams.get("status") ?? "all"} onValueChange={(v) => updateParams({ status: v })}>
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder="ステータス" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select defaultValue={searchParams.get("staffId") ?? "all"} onValueChange={(v) => updateParams({ staffId: v })}>
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder="担当トレーナー" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">全担当者</SelectItem>
          {staffOptions.map((s) => (
            <SelectItem key={s.id} value={s.id}>
              {s.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
