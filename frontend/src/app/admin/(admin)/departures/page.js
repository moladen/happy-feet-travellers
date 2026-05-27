"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import PageTransition from "@/components/admin/PageTransition";
import StatusBadge from "@/components/admin/StatusBadge";
import { CardSection } from "@/components/admin/AdminFields";
import { formatCurrency, formatDate, groupDeparturesByMonth } from "@/lib/admin-data";
import { listUpcomingDepartures } from "@/services/adminService";

export default function DeparturesPage() {
  const [state, setState] = useState({ tours: [], loading: true, message: "" });

  useEffect(() => {
    const load = async () => {
      const result = await listUpcomingDepartures({ limit: 100, sort: "startDate" });
      setState({
        tours: result.success
          ? (result.data?.departures || result.data?.tours || []).filter(
              (t) => String(t.category || "").toLowerCase() === "upcoming"
            )
          : [],
        loading: false,
        message: result.success ? "" : result.message,
      });
    };
    load();
  }, []);

  const grouped = useMemo(() => groupDeparturesByMonth(state.tours), [state.tours]);

  return (
    <PageTransition className="space-y-6">
      <CardSection
        title="Upcoming departures"
        description="A month-wise planner for fixed group trips, date badges, status tags, and quick edits."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[24px] bg-[#f7fbfe] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#5b84a5]">Upcoming batches</p>
            <p className="mt-3 text-4xl font-bold text-[#17324d]">{state.tours.length}</p>
          </div>
          <div className="rounded-[24px] bg-[#f7fbfe] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#5b84a5]">Next departure</p>
            <p className="mt-3 text-lg font-bold text-[#17324d]">
              {state.tours[0]?.dateLabel || formatDate(state.tours[0]?.startDate)}
            </p>
          </div>
          <div className="rounded-[24px] bg-[#f7fbfe] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#5b84a5]">Action</p>
            <Link
              href="/admin/tours/new?type=upcoming"
              className="mt-3 inline-flex rounded-full bg-[#1f4e79] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#173b5d]"
            >
              Add departure
            </Link>
          </div>
        </div>
      </CardSection>

      {state.message ? (
        <div className="rounded-[26px] border border-[#f2d4bd] bg-[#fff5eb] px-5 py-4 text-sm text-[#a35a23]">
          {state.message}
        </div>
      ) : null}

      {state.loading ? (
        <CardSection title="Loading departures" description="Grouping trips by month..." />
      ) : null}

      {Object.entries(grouped).map(([month, tours]) => (
        <CardSection key={month} title={month} description={`${tours.length} fixed-date group trip(s)`}>
          <div className="grid gap-4 xl:grid-cols-2">
            {tours.map((tour) => (
              <article
                key={tour.id}
                className="rounded-[28px] border border-[#e7eef4] bg-[#fbfdff] p-5 shadow-[0_20px_40px_-32px_rgba(31,78,121,0.45)]"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge value="upcoming">Upcoming</StatusBadge>
                      {String(tour.status || "").toLowerCase() !== "active" ? (
                        <span className="inline-flex rounded-full bg-[#fde8e8] px-2.5 py-1 text-xs font-semibold text-[#b42318]">
                          {tour.status || "hidden"}
                        </span>
                      ) : null}
                      {tour.urgency ? (
                        <span className="inline-flex rounded-full bg-[#fff0df] px-2.5 py-1 text-xs font-semibold text-[#b86b18]">
                          {tour.urgency}
                        </span>
                      ) : null}
                    </div>
                    <h3 className="mt-3 text-2xl font-bold text-[#17324d]">{tour.title}</h3>
                    <p className="mt-2 text-sm text-[#637588]">
                      {tour.dateLabel || formatDate(tour.startDate)} · {tour.departureCity}
                    </p>
                  </div>
                  <div className="rounded-[22px] bg-[#edf6fd] px-4 py-3 text-right">
                    <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5b84a5]">
                      Starting at
                    </div>
                    <div className="mt-2 text-xl font-bold text-[#17324d]">
                      {formatCurrency(tour.startingPrice || tour.price)}
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {(tour.highlights || []).slice(0, 3).map((highlight) => (
                    <span
                      key={highlight}
                      className="rounded-full border border-[#d6e5ef] bg-white px-3 py-1.5 text-xs font-semibold text-[#496278]"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Link
                    href={`/admin/tours/${tour.id}`}
                    className="rounded-full bg-[#1f4e79] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#173b5d]"
                  >
                    Quick edit
                  </Link>
                  <Link
                    href="/admin/tours"
                    className="rounded-full border border-[#d5e1eb] px-4 py-2 text-sm font-semibold text-[#1f4e79] transition hover:border-[#4fa3d1]"
                  >
                    View all tours
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </CardSection>
      ))}
    </PageTransition>
  );
}
