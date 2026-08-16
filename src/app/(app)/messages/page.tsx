import { MessageSquare } from "lucide-react";
import { ComingSoon } from "@/components/coming-soon";

export default function MessagesPage() {
  return (
    <ComingSoon
      title="メッセージ"
      description="顧客への連絡状況をまとめて確認できます"
      icon={MessageSquare}
      phase="Phase 2〜3"
      bullets={["送信履歴・送信状態の一覧管理", "AIによるフォロー文章作成", "LINE公式・Lステップ連携"]}
    />
  );
}
