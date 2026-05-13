"use client";

import Link from "next/link";
import { useMemo } from "react";
import { dashboardQuickActions, navigationItems } from "@/lib/admin-data";
import { Icon } from "@/components/admin/AdminIcons";

function getCurrentLabel(pathname) {
  if (pathname === "/") return "Dashboard";
  const match = navigationItems.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
  return match?.label || "Admin";
}

export default function Topbar({ pathname, onOpenSidebar, admin, onLogout }) {
  const today = useMemo(
    () =>
      new Date().toLocaleDateString("en-GB", {
        weekday: "long",
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    []
  );

  return (
    <header className="sticky top-0 z-30 border-b border-white/45 bg-[linear-gradient(135deg,rgba(255,255,255,0.84),rgba(255,255,255,0.62))] px-4 py-4 backdrop-blur-xl md:px-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="mt-1 rounded-2xl border border-[#d9e4ef] bg-white px-3 py-3 text-[#1f4e79] shadow-sm transition hover:border-[#b6cbde] lg:hidden"
            aria-label="Open navigation"
          >
            <Icon name="menu" className="h-5 w-5" />
          </button>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#4f7b9d]">
              {today}
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#17324d]">
              {getCurrentLabel(pathname)}
            </h2>
            <p className="mt-1 text-sm text-[#5f6f7f]">
              Premium content operations for tours, departures, blogs, and customer leads.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 xl:items-end">
          <div className="flex flex-wrap items-center gap-2">
            {dashboardQuickActions.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex items-center gap-2 rounded-full border border-[#d8e7f2] bg-white/80 px-4 py-2 text-sm font-semibold text-[#1f4e79] shadow-sm transition hover:-translate-y-0.5 hover:border-[#4fa3d1]"
              >
                <Icon name="plus" className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-full border border-[#d8e7f2] bg-white/80 px-4 py-2 text-sm text-[#425264] shadow-sm">
              {admin?.email || "admin@happyfeet.com"}
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-2 rounded-full bg-[#1f4e79] px-4 py-2 text-sm font-semibold text-white shadow-[0_16px_32px_-18px_rgba(31,78,121,0.85)] transition hover:bg-[#173b5d]"
            >
              <Icon name="logout" className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
