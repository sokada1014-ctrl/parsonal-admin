"use client";

import { useId } from "react";
import { Input } from "@/components/ui/input";

// 選択肢(練習メニュー管理のマスタ)から選ぶ、または自由記述で入力できる入力欄。
// ネイティブの <input list> + <datalist> を使うことで、シンプルに「選択+自由記述」を両立する。
export function MenuComboInput({
  id,
  name,
  options,
  value,
  defaultValue,
  onChange,
  placeholder,
  className,
}: {
  id?: string;
  name?: string;
  options: string[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const listId = useId();

  return (
    <>
      <Input
        id={id}
        name={name}
        list={listId}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        placeholder={placeholder ?? "選択または入力"}
        className={className}
        autoComplete="off"
      />
      <datalist id={listId}>
        {options.map((option) => (
          <option key={option} value={option} />
        ))}
      </datalist>
    </>
  );
}
