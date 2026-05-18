"use client";

import { motion } from "framer-motion";

export default function DashboardCard({ label, value, note, accent = "blue" }) {
  const tones = {
    blue: "from-[#1f4e79] to-[#4fa3d1]",
    amber: "from-[#f4a261] to-[#f7bf78]",
    teal: "from-[#2d7c88] to-[#78c6c9]",
    slate: "from-[#364a63] to-[#7f95b0]",
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.32 }}
      className="relative overflow-hidden rounded-[30px] border border-white/65 bg-white/88 p-6 shadow-[0_28px_56px_-30px_rgba(31,78,121,0.45)] backdrop-blur-xl"
    >
      <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${tones[accent] || tones.blue}`} />
      <p className="text-sm font-medium text-[#607386]">{label}</p>
      <div className="mt-4 flex items-end justify-between gap-4">
        <p className="text-4xl font-bold tracking-tight text-[#17324d]">{value}</p>
        <div className="rounded-full bg-[#f0f7fc] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#4f7b9d]">
          Live
        </div>
      </div>
      <p className="mt-3 text-sm text-[#627488]">{note}</p>
    </motion.article>
  );
}
