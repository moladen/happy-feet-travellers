"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { navigationItems } from "@/lib/admin-data";
import { Icon } from "@/components/admin/AdminIcons";

function isActive(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Sidebar({ pathname, onClose }) {
  return (
    <aside className="flex h-full flex-col bg-[linear-gradient(180deg,#1f4e79_0%,#173b5d_60%,#112b45_100%)] text-white">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#d7ecfb]">
            Happy Feet
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-white">Admin CMS</h1>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-white/15 p-2 text-white/85 transition hover:bg-white/10 lg:hidden"
          aria-label="Close navigation"
        >
          <Icon name="close" className="h-5 w-5" />
        </button>
      </div>

      <div className="px-4 py-5">
        <div className="rounded-[28px] border border-white/10 bg-white/8 p-4 shadow-[0_20px_40px_-24px_rgba(0,0,0,0.65)] backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#93c9ea]">
            Travel operations
          </p>
          <p className="mt-2 text-sm leading-6 text-[#e6f4ff]">
            Manage departures, custom trip content, social proof, and inbound leads from one focused control room.
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-6">
        {navigationItems.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`group flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
                active
                  ? "bg-[#4fa3d1] text-white shadow-[0_16px_32px_-18px_rgba(79,163,209,0.9)]"
                  : "text-[#d7ecfb] hover:bg-white/10 hover:text-white"
              }`}
            >
              <span
                className={`grid h-10 w-10 place-items-center rounded-2xl transition ${
                  active ? "bg-white/20" : "bg-white/8 group-hover:bg-white/14"
                }`}
              >
                <Icon name={item.icon} className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{item.label}</div>
                <div className={`truncate text-xs ${active ? "text-white/80" : "text-[#9ccae7]"}`}>
                  {item.caption}
                </div>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[26px] border border-white/10 bg-white/8 p-4"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#93c9ea]">
            Premium flow
          </p>
          <p className="mt-2 text-sm text-[#e6f4ff]">
            Built for grouped departures first, then customised tours, content, and enquiries.
          </p>
        </motion.div>
      </div>
    </aside>
  );
}
