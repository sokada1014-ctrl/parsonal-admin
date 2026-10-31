import Link from "next/link";
import { Dumbbell } from "lucide-react";
import { getAlerts, getStaffList } from "@/lib/data-access";
import { SidebarNav } from "./sidebar-nav";
import { Topbar } from "./topbar";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const [alerts, staffList] = await Promise.all([getAlerts(), getStaffList()]);
  const currentStaff = staffList[0];

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-sidebar md:flex">
        <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-border px-5">
          <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-hover text-white shadow-[0_4px_12px_-2px_rgba(36,149,134,0.45)]">
            <Dumbbell className="size-[18px]" />
          </div>
          <Link href="/" className="text-[15px] font-semibold tracking-tight text-text-primary">
            パーソナル管理
          </Link>
        </div>
        <SidebarNav />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          staffName={currentStaff?.name ?? "スタッフ"}
          alerts={alerts.map((a) => ({
            id: a.id,
            customerId: a.customerId,
            customerName: a.customerName,
            message: a.message,
            severity: a.severity,
          }))}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1400px] px-4 py-6 md:px-8 md:py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
