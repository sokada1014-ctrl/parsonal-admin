import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Calendar,
  Dumbbell,
  FileSignature,
  LayoutDashboard,
  ListChecks,
  MessageSquare,
  Receipt,
  Settings,
  Ticket,
  UserCog,
  Users,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { href: "/", label: "ダッシュボード", icon: LayoutDashboard },
  { href: "/customers", label: "顧客", icon: Users },
  { href: "/schedule", label: "スケジュール", icon: Calendar },
  { href: "/sessions", label: "セッション", icon: Dumbbell },
  { href: "/menus", label: "練習メニュー管理", icon: ListChecks },
  { href: "/contracts", label: "契約・回数券", icon: Ticket },
  { href: "/plans", label: "契約管理", icon: FileSignature },
  { href: "/billing", label: "請求・入金", icon: Receipt },
  { href: "/messages", label: "メッセージ", icon: MessageSquare },
  { href: "/staff", label: "スタッフ", icon: UserCog },
  { href: "/reports", label: "レポート", icon: BarChart3 },
  { href: "/settings", label: "設定", icon: Settings },
];
