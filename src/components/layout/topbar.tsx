"use client";

import Link from "next/link";
import { Bell, Menu } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SidebarNav } from "./sidebar-nav";
import { SeverityBadge } from "@/components/status-badge";

export interface TopbarAlert {
  id: string;
  customerId: string;
  customerName: string;
  message: string;
  severity: "info" | "warning" | "danger";
}

export function Topbar({ alerts, staffName }: { alerts: TopbarAlert[]; staffName: string }) {
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-surface/80 px-4 backdrop-blur-md supports-[backdrop-filter]:bg-surface/70 md:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="h-16 justify-center border-b border-border">
            <SheetTitle className="text-primary">パーソナル管理</SheetTitle>
          </SheetHeader>
          <SidebarNav />
        </SheetContent>
      </Sheet>

      <div className="flex-1" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="size-5" />
            {alerts.length > 0 && (
              <span className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-danger text-[10px] font-semibold text-white">
                {alerts.length > 9 ? "9+" : alerts.length}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel>要対応 ({alerts.length}件)</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {alerts.length === 0 && (
            <div className="px-2 py-4 text-center text-sm text-text-muted">対応が必要な項目はありません</div>
          )}
          {alerts.slice(0, 6).map((a) => (
            <DropdownMenuItem key={a.id} asChild className="flex flex-col items-start gap-1 py-2">
              <Link href={`/customers/${a.customerId}`}>
                <div className="flex w-full items-center justify-between gap-2">
                  <span className="font-medium">{a.customerName}</span>
                  <SeverityBadge severity={a.severity} label={a.severity === "danger" ? "至急" : "要確認"} />
                </div>
                <span className="text-xs text-text-secondary">{a.message}</span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-full py-1 pr-1 pl-1 hover:bg-muted">
            <Avatar className="size-8">
              <AvatarFallback className="bg-primary-light text-primary text-sm font-medium">
                {staffName.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
            <span className="hidden text-sm font-medium sm:inline">{staffName}</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{staffName}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/settings">設定</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/login">ログアウト</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
