"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { admin, booting, logout } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!booting && !admin) {
      router.replace("/admin/login");
    }
  }, [admin, booting, router]);

  if (booting || !admin) {
    return (
      <main className="grid min-h-screen place-items-center bg-[var(--admin-bg)] px-6 text-[#1f4e79]">
        <div className="rounded-[28px] border border-white/60 bg-white/85 px-8 py-6 text-center shadow-[0_30px_60px_-28px_rgba(31,78,121,0.45)] backdrop-blur-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#5f8fb3]">
            Loading admin workspace
          </p>
          <h1 className="mt-3 text-2xl font-bold text-[#17324d]">Preparing your travel CMS</h1>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--admin-bg)] text-[var(--admin-text)]">
      <div className="flex min-h-screen">
        <div className="hidden w-[320px] shrink-0 lg:block">
          <div className="sticky top-0 h-screen">
            <Sidebar pathname={pathname} />
          </div>
        </div>

        <AnimatePresence>
          {sidebarOpen ? (
            <motion.div
              key="sidebar-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 flex lg:hidden"
            >
              <button
                type="button"
                className="absolute inset-0 bg-[#09131d]/45 backdrop-blur-[2px]"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close navigation"
              />
              <motion.div
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -40, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 26 }}
                className="relative z-10 h-full w-[88vw] max-w-[320px] shadow-2xl"
              >
                <Sidebar pathname={pathname} onClose={() => setSidebarOpen(false)} />
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="min-w-0 flex-1">
          <Topbar
            pathname={pathname}
            admin={admin}
            onOpenSidebar={() => setSidebarOpen(true)}
            onLogout={() => {
              logout();
              router.replace("/admin/login");
            }}
          />
          <main className="px-4 py-6 md:px-6 md:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
