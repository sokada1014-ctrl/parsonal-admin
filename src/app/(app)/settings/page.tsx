import { Settings } from "lucide-react";
import { ComingSoon } from "@/components/coming-soon";

export default function SettingsPage() {
  return (
    <ComingSoon
      title="設定"
      description="事業者情報や各種連携の設定を行います"
      icon={Settings}
      phase="Phase 2以降"
      bullets={["事業者・店舗情報の設定", "料金プラン・メニューのマスタ管理", "LINE公式・Lステップ連携設定"]}
    />
  );
}
