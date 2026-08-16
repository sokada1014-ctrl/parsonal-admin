"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createMenuItemAction } from "@/lib/actions";

export function NewMenuItemDialog() {
  const [open, setOpen] = useState(false);

  async function handleSubmit(formData: FormData) {
    await createMenuItemAction(formData);
    setOpen(false);
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="size-4" />
        メニューを追加
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>練習メニューを追加</DialogTitle>
          </DialogHeader>
          <form action={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="menu-name">
                メニュー名 <span className="text-danger">*</span>
              </Label>
              <Input id="menu-name" name="name" placeholder="例: スクワット" required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="menu-category">カテゴリ(任意)</Label>
              <Input id="menu-category" name="category" placeholder="例: 種目 / トレーニング / ピラティス" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                キャンセル
              </Button>
              <Button type="submit">追加する</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
