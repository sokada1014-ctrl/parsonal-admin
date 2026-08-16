"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MenuComboInput } from "@/components/menu-combo-input";

interface Row {
  key: number;
  name: string;
  weight: string;
  reps: string;
  sets: string;
}

let keySeq = 1;

export function ExerciseFields({
  initialExercises,
  menuOptions = [],
}: {
  initialExercises?: { name: string; weight?: string; reps?: string; sets?: string }[];
  menuOptions?: string[];
}) {
  const [rows, setRows] = useState<Row[]>(
    () =>
      initialExercises?.map((e) => ({
        key: keySeq++,
        name: e.name,
        weight: e.weight ?? "",
        reps: e.reps ?? "",
        sets: e.sets ?? "",
      })) ?? [{ key: keySeq++, name: "", weight: "", reps: "", sets: "" }],
  );

  function updateRow(key: number, field: keyof Omit<Row, "key">, value: string) {
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, [field]: value } : r)));
  }

  function addRow() {
    setRows((prev) => [...prev, { key: keySeq++, name: "", weight: "", reps: "", sets: "" }]);
  }

  function removeRow(key: number) {
    setRows((prev) => (prev.length > 1 ? prev.filter((r) => r.key !== key) : prev));
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="hidden grid-cols-[1fr_90px_90px_90px_32px] gap-2 px-1 text-xs text-text-secondary sm:grid">
        <span>種目</span>
        <span>重量(kg)</span>
        <span>回数</span>
        <span>セット</span>
        <span />
      </div>
      {rows.map((row) => (
        <div key={row.key} className="grid grid-cols-2 gap-2 sm:grid-cols-[1fr_90px_90px_90px_32px]">
          <MenuComboInput
            name="exerciseName"
            options={menuOptions}
            placeholder="スクワット"
            className="col-span-2 sm:col-span-1"
            value={row.name}
            onChange={(v) => updateRow(row.key, "name", v)}
          />
          <Input
            name="exerciseWeight"
            type="number"
            placeholder="60"
            value={row.weight}
            onChange={(e) => updateRow(row.key, "weight", e.target.value)}
          />
          <Input
            name="exerciseReps"
            type="number"
            placeholder="10"
            value={row.reps}
            onChange={(e) => updateRow(row.key, "reps", e.target.value)}
          />
          <div className="flex gap-2">
            <Input
              name="exerciseSets"
              type="number"
              placeholder="3"
              value={row.sets}
              onChange={(e) => updateRow(row.key, "sets", e.target.value)}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 text-text-muted hover:text-danger"
              onClick={() => removeRow(row.key)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" className="mt-1 w-fit" onClick={addRow}>
        <Plus className="size-4" />
        種目を追加
      </Button>
    </div>
  );
}
