import { Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "@/lib/actions";

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-white">
            <Dumbbell className="size-6" />
          </div>
          <div className="text-center">
            <h1 className="text-lg font-semibold text-text-primary">パーソナル管理</h1>
            <p className="mt-1 text-sm text-text-secondary">顧客・店舗管理システム</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <form action={loginAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">メールアドレス</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" defaultValue="yamada@example.com" required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">パスワード</Label>
              <Input id="password" name="password" type="password" placeholder="••••••••" defaultValue="password" required />
            </div>
            <Button type="submit" className="mt-2 w-full">
              ログイン
            </Button>
          </form>
        </div>
        <p className="mt-6 text-center text-xs text-text-muted">
          ログインすることで利用規約およびプライバシーポリシーに同意したものとみなされます。
        </p>
      </div>
    </div>
  );
}
