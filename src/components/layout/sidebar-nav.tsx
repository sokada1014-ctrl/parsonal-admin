"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navItems } from "./nav-items";

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-1 px-3 py-2">
      {navItems.map((item) => {
        const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-[background-color,color,box-shadow,transform] duration-200 ease-out",
              isActive
                ? "bg-gradient-to-r from-primary to-primary-hover text-white shadow-[0_0_0_1px_rgb(from_var(--primary)_r_g_b_/_0.3),0_8px_22px_-5px_rgb(from_var(--primary)_r_g_b_/_0.6)]"
                : "text-text-secondary hover:bg-muted hover:text-text-primary active:scale-[0.98]",
            )}
          >
            <Icon className="size-[18px] shrink-0" strokeWidth={2} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
