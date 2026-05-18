"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import DashboardCard from "@/components/admin/DashboardCard";
import DataTable from "@/components/admin/DataTable";
import PageTransition from "@/components/admin/PageTransition";
import StatusBadge from "@/components/admin/StatusBadge";
import { CardSection } from "@/components/admin/AdminFields";
import {
  dashboardQuickActions,
  formatCurrency,
  formatDate,
  formatDateTime,
} from "@/lib/admin-data";
import { getDashboardSnapshot } from "@/services/adminService";

const pickList = (result, key) =>
  result?.success ? result.data?.[key] || (Array.isArray(result.data) ? result.data : []) : [];

function MiniAnalytics({ label, value, tone }) {
  const tones = {
    blue: "from-[#1f4e79] to-[#4fa3d1]",
    amber: "from-[#f4a261] to-[#f7bf78]",
    teal: "from-[#2d7c88] to-[#78c6c9]",
  };

  return (
    <div className="rounded-[26px] border border-white/70 bg-white/88 p-5 shadow-[0_24px_48px_-34px_rgba(31,78,121,0.45)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#617386]">{label}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-[#17324d]">{value}</p>
        </div>
        <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${tones[tone] || tones.blue} opacity-90`} />
      </div>
    </div>
  );
}

function ChartPlaceholder({ stats }) {
  const bars = [
    { label: "Tours", value: stats.totalTours, color: "bg-[#1f4e79]" },
    { label: "Upcoming", value: stats.upcomingTours, color: "bg-[#4fa3d1]" },
    { label: "Blogs", value: stats.totalBlogs, color: "bg-[#f4a261]" },
    { label: "Enquiries", value: stats.totalEnquiries, color: "bg-[#2d7c88]" },
  ];
  const max = Math.max(...bars.map((bar) => bar.value || 0), 1);

  return (
    <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_24px_48px_-34px_rgba(31,78,121,0.45)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#5b84a5]">
              Travel operations snapshot
            </p>
            <h3 className="mt-2 text-2xl font-bold text-[#17324d]">Live business mix</h3>
          </div>
          <div className="rounded-full bg-[#edf6fd] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#1f4e79]">
            Placeholder
          </div>
        </div>
        <div className="mt-8 flex h-56 items-end gap-4">
          {bars.map((bar) => (
            <div key={bar.label} className="flex flex-1 flex-col items-center gap-3">
              <div className="w-full rounded-t-[22px] bg-[#edf3f8] px-2 pt-2">
                <div
                  className={`w-full rounded-t-[18px] ${bar.color} transition-all`}
                  style={{ height: `${Math.max((bar.value / max) * 180, 16)}px` }}
                />
              </div>
              <div className="text-center">
                <div className="text-base font-bold text-[#17324d]">{bar.value}</div>
                <div className="text-xs uppercase tracking-[0.2em] text-[#6f8094]">{bar.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <MiniAnalytics label="New leads awaiting follow-up" value={stats.newEnquiries} tone="amber" />
        <MiniAnalytics label="Custom trip templates live" value={stats.customizedTours} tone="teal" />
        <MiniAnalytics label="Testimonials ready on site" value={stats.totalTestimonials} tone="blue" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [snapshot, setSnapshot] = useState({
    tours: [],
    blogs: [],
    enquiries: [],
    testimonials: [],
    gallery: [],
    settings: null,
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const result = await getDashboardSnapshot();
      const firstError = Object.values(result).find((item) => item && item.success === false);
      setError(firstError?.message || "");
      setSnapshot({
        tours: pickList(result.tours, "tours"),
        blogs: pickList(result.blogs, "blogs"),
        enquiries: pickList(result.enquiries, "enquiries"),
        testimonials: pickList(result.testimonials, "testimonials"),
        gallery: pickList(result.gallery, "items"),
        settings: result.settings?.success ? result.settings.data : null,
      });
      setLoading(false);
    };

    load();
  }, []);

  const stats = useMemo(() => {
    const tours = snapshot.tours || [];
    const enquiries = snapshot.enquiries || [];
    return {
      totalTours: tours.length,
      upcomingTours: tours.filter((tour) => tour.category === "upcoming").length,
      customizedTours: tours.filter((tour) => tour.category === "customized").length,
      totalBlogs: snapshot.blogs.length,
      totalEnquiries: enquiries.length,
      newEnquiries: enquiries.filter((item) => item.status === "new").length,
      totalTestimonials: snapshot.testimonials.length,
    };
  }, [snapshot]);

  if (loading) {
    return (
      <PageTransition>
        <CardSection title="Loading dashboard" description="Pulling tours, blogs, enquiries, and site content into one view." />
      </PageTransition>
    );
  }

  return (
    <PageTransition className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <DashboardCard label="Total tours" value={stats.totalTours} note="All published travel products" accent="blue" />
        <DashboardCard label="Upcoming tours" value={stats.upcomingTours} note="Fixed departures ready to sell" accent="teal" />
        <DashboardCard label="Customized tours" value={stats.customizedTours} note="Flexible FIT-style offerings" accent="slate" />
        <DashboardCard label="Total blogs" value={stats.totalBlogs} note="Editorial content in the CMS" accent="amber" />
        <DashboardCard label="Total enquiries" value={stats.totalEnquiries} note="Leads collected from website forms" accent="blue" />
        <DashboardCard label="Testimonials" value={stats.totalTestimonials} note="Trust signals ready for the site" accent="teal" />
      </section>

      {error ? (
        <div className="rounded-[26px] border border-[#f2d4bd] bg-[#fff5eb] px-5 py-4 text-sm text-[#a35a23]">
          {error}
        </div>
      ) : null}

      <ChartPlaceholder stats={stats} />

      <div className="grid gap-6 2xl:grid-cols-[1.2fr_0.8fr]">
        <CardSection title="Recent enquiries" description="Newest inbound leads from the website.">
          <DataTable
            rows={snapshot.enquiries.slice(0, 5)}
            emptyTitle="No enquiries yet"
            emptyDescription="Once leads arrive from the site, they will appear here."
            columns={[
              {
                key: "name",
                title: "Traveller",
                render: (row) => (
                  <div>
                    <div className="font-semibold text-[#17324d]">{row.name}</div>
                    <div className="mt-1 text-xs text-[#6e8094]">{row.email}</div>
                  </div>
                ),
              },
              {
                key: "phone",
                title: "Phone",
              },
              {
                key: "subject",
                title: "Destination",
                render: (row) => row.destination || row.subject || "General enquiry",
              },
              {
                key: "status",
                title: "Status",
                render: (row) => <StatusBadge value={row.status} />,
              },
              {
                key: "createdAt",
                title: "Received",
                render: (row) => formatDateTime(row.createdAt),
              },
            ]}
          />
        </CardSection>

        <CardSection title="Quick actions" description="Shortcuts for the most common admin flows.">
          <div className="grid gap-3">
            {dashboardQuickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="rounded-[24px] border border-[#dbe8f1] bg-white px-5 py-4 text-sm font-semibold text-[#1f4e79] shadow-sm transition hover:-translate-y-0.5 hover:border-[#4fa3d1]"
              >
                {action.label}
              </Link>
            ))}
          </div>
          <div className="mt-5 rounded-[26px] bg-[#f7fbfe] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#5b84a5]">
              Website settings
            </p>
            <p className="mt-3 text-sm text-[#33475b]">
              WhatsApp: {snapshot.settings?.whatsappNumber || "Not configured"}
            </p>
            <p className="mt-1 text-sm text-[#33475b]">
              Payment link: {snapshot.settings?.paymentLink || "Not configured"}
            </p>
            <p className="mt-4 text-xs leading-6 text-[#6f8094]">
              Keep footer, social, and contact details updated from one place so the public website stays consistent.
            </p>
          </div>
        </CardSection>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <CardSection title="Latest added tours" description="Recent travel products added to the inventory.">
          <div className="space-y-3">
            {snapshot.tours.slice(0, 4).map((tour) => (
              <div
                key={tour.id}
                className="flex flex-col gap-3 rounded-[26px] border border-[#e8eef4] bg-[#fbfdff] p-4 md:flex-row md:items-center md:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-lg font-bold text-[#17324d]">{tour.title}</h3>
                    <StatusBadge value={tour.category}>
                      {tour.category === "upcoming" ? "Upcoming" : "Customized"}
                    </StatusBadge>
                  </div>
                  <p className="mt-2 text-sm text-[#617386]">
                    {tour.departureCity} · {tour.dateLabel || formatDate(tour.startDate)} · {formatCurrency(tour.startingPrice || tour.price)}
                  </p>
                </div>
                <Link
                  href={`/admin/tours/${tour.id}`}
                  className="inline-flex rounded-full bg-[#1f4e79] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#173b5d]"
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        </CardSection>

        <CardSection title="Content pulse" description="A quick view of the content inventory beyond tours.">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[26px] border border-[#e8eef4] bg-[#fbfdff] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#5b84a5]">Blogs</p>
              <p className="mt-3 text-3xl font-bold text-[#17324d]">{snapshot.blogs.length}</p>
              <p className="mt-2 text-sm text-[#66788b]">Latest post: {snapshot.blogs[0]?.title || "No posts yet"}</p>
            </div>
            <div className="rounded-[26px] border border-[#e8eef4] bg-[#fbfdff] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#5b84a5]">Gallery images</p>
              <p className="mt-3 text-3xl font-bold text-[#17324d]">{snapshot.gallery.length}</p>
              <p className="mt-2 text-sm text-[#66788b]">Keep photo proof fresh to support enquiries and credibility.</p>
            </div>
          </div>
        </CardSection>
      </div>
    </PageTransition>
  );
}
