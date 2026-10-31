import { Settings } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SquareSyncButton } from "@/components/settings/square-sync-card";
import { isSquareConfigured } from "@/lib/square/client";

export default function SettingsPage() {
  const squareConfigured = isSquareConfigured();

  return (
    <div>
      <PageHeader title="設定" description="事業者情報や各種連携の設定を行います" />

      <div className="flex flex-col gap-6">
        <Card className="shadow-none">
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-base">Square連携</CardTitle>
              <Badge variant={squareConfigured ? "default" : "secondary"}>
                {squareConfigured ? "設定済み" : "未設定"}
              </Badge>
            </div>
            <CardDescription>Squareの顧客データをこのアプリに取り込みます(Square → このアプリの一方向)</CardDescription>
          </CardHeader>
          <CardContent>
            {squareConfigured ? (
              <SquareSyncButton />
            ) : (
              <div className="rounded-lg border border-dashed border-border bg-muted/50 p-4 text-sm text-text-secondary">
                <p className="font-medium text-text-primary">連携にはSquareのAccess Tokenが必要です</p>
                <ol className="mt-2 flex list-decimal flex-col gap-1 pl-4">
                  <li>
                    <a
                      href="https://developer.squareup.com/apps"
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary underline underline-offset-2"
                    >
                      Square Developer Dashboard
                    </a>
                    でアプリケーションを作成(無料)
                  </li>
                  <li>Sandbox(テスト環境)のAccess Tokenを取得</li>
                  <li>
                    <code className="rounded bg-muted px-1 py-0.5 text-xs">.env.local</code> に{" "}
                    <code className="rounded bg-muted px-1 py-0.5 text-xs">SQUARE_ACCESS_TOKEN</code> を設定してサーバーを再起動
                  </li>
                </ol>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border bg-surface px-6 py-16 text-center">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary-light text-primary">
            <Settings className="size-6" />
          </div>
          <div>
            <p className="font-medium text-text-primary">Phase 2以降で実装予定です</p>
            <p className="mt-1 text-sm text-text-secondary">準備が整い次第、この画面から利用できるようになります</p>
          </div>
          <ul className="mt-2 flex flex-col gap-1.5 text-sm text-text-secondary">
            {["事業者・店舗情報の設定", "料金プラン・メニューのマスタ管理", "LINE公式・Lステップ連携設定"].map((b) => (
              <li key={b}>・{b}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
