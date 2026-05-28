import Link from "next/link";

/**
 * Primary admin actions — separate upcoming departures vs personalized tours.
 */
export default function AdminAddTourActions({ className = "" }) {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`.trim()}>
      <Link
        href="/admin/tours/new?type=upcoming"
        className="rounded-full bg-[#1f4e79] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#173b5d]"
      >
        Add upcoming departure
      </Link>
      <Link
        href="/admin/tours/new?type=customized"
        className="rounded-full bg-[#f4a261] px-4 py-2 text-sm font-semibold text-[#17324d] shadow-[0_12px_28px_-16px_rgba(244,162,97,0.75)] transition hover:bg-[#ee9654]"
      >
        Add personalized tour
      </Link>
    </div>
  );
}
