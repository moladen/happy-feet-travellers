"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import PageTransition from "@/components/admin/PageTransition";
import StatusBadge from "@/components/admin/StatusBadge";
import { CardSection, Field, SelectInput, TextInput } from "@/components/admin/AdminFields";
import { formatCurrency, formatDate, tourCategoryOptions } from "@/lib/admin-data";
import { deleteTour, listTours } from "@/services/adminService";

const categories = [{ value: "", label: "All categories" }, ...tourCategoryOptions];

export default function ToursPage() {
  const [filters, setFilters] = useState({ search: "", category: "", page: 1 });
  const [state, setState] = useState({ rows: [], pagination: null, loading: true, message: "" });
  const [pendingDelete, setPendingDelete] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      setState((current) => ({ ...current, loading: true }));
      const result = await listTours({
        limit: 8,
        page: filters.page,
        search: filters.search || undefined,
        category: filters.category || undefined,
      });
      setState({
        rows: result.success ? result.data?.tours || [] : [],
        pagination: result.success ? result.data?.pagination : null,
        loading: false,
        message: result.success ? "" : result.message,
      });
    }, 180);

    return () => clearTimeout(timeout);
  }, [filters]);

  return (
    <PageTransition className="space-y-6">
      <CardSection
        title="All tours"
        description="Search, filter, paginate, and manage every tour across upcoming group departures and customised packages."
        actions={
          <Link
            href="/tours/create"
            className="rounded-full bg-[#f4a261] px-4 py-2 text-sm font-semibold text-[#17324d] shadow-[0_16px_32px_-20px_rgba(244,162,97,0.85)] transition hover:bg-[#ee9654]"
          >
            Add new tour
          </Link>
        }
      >
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.45fr]">
          <Field label="Search tours">
            <TextInput
              value={filters.search}
              onChange={(event) =>
                setFilters((current) => ({ ...current, search: event.target.value, page: 1 }))
              }
              placeholder="Search by title or description"
            />
          </Field>
          <Field label="Filter by category">
            <SelectInput
              value={filters.category}
              onChange={(event) =>
                setFilters((current) => ({ ...current, category: event.target.value, page: 1 }))
              }
            >
              {categories.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </SelectInput>
          </Field>
        </div>
      </CardSection>

      {state.message ? (
        <div className="rounded-[26px] border border-[#f2d4bd] bg-[#fff5eb] px-5 py-4 text-sm text-[#a35a23]">
          {state.message}
        </div>
      ) : null}

      <CardSection
        title={state.loading ? "Loading tours..." : `${state.pagination?.total || state.rows.length} tours found`}
        description="Travel products are structured to match how customers browse the public site."
      >
        <DataTable
          rows={state.rows}
          emptyTitle="No tours match the current filters"
          emptyDescription="Try a broader search or add a new trip."
          columns={[
            {
              key: "tour",
              title: "Tour",
              render: (row) => (
                <div className="flex items-center gap-3">
                  <Image
                    src={row.coverImage || row.image || "https://placehold.co/96x72?text=Tour"}
                    alt=""
                    width={96}
                    height={72}
                    unoptimized
                    className="h-16 w-20 rounded-2xl object-cover"
                  />
                  <div className="min-w-0">
                    <div className="truncate font-semibold text-[#17324d]">{row.title}</div>
                    <div className="mt-1 text-xs text-[#6e8094]">{row.slug}</div>
                  </div>
                </div>
              ),
            },
            {
              key: "category",
              title: "Category",
              render: (row) => (
                <div className="space-y-2">
                  <StatusBadge value={row.category}>
                    {row.category === "upcoming" ? "Upcoming" : "Customized"}
                  </StatusBadge>
                  {row.subCategory ? <div className="text-xs text-[#6e8094]">{row.subCategory}</div> : null}
                </div>
              ),
            },
            {
              key: "schedule",
              title: "Schedule",
              render: (row) => (
                <div>
                  <div className="font-medium text-[#17324d]">{row.dateLabel || formatDate(row.startDate)}</div>
                  <div className="mt-1 text-xs text-[#6e8094]">{row.departureCity}</div>
                </div>
              ),
            },
            {
              key: "price",
              title: "Starting price",
              render: (row) => formatCurrency(row.startingPrice || row.price),
            },
            {
              key: "actions",
              title: "Actions",
              render: (row) => (
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/tours/${row.id}`}
                    className="rounded-full border border-[#d5e1eb] px-3 py-2 text-xs font-semibold text-[#1f4e79] transition hover:border-[#4fa3d1]"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => setPendingDelete(row)}
                    className="rounded-full border border-[#f0d6d2] px-3 py-2 text-xs font-semibold text-[#b14f3d]"
                  >
                    Delete
                  </button>
                </div>
              ),
            },
          ]}
        />

        {state.pagination?.pages > 1 ? (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-[#66788b]">
              Page {state.pagination.page} of {state.pagination.pages}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={filters.page <= 1}
                onClick={() => setFilters((current) => ({ ...current, page: current.page - 1 }))}
                className="rounded-full border border-[#d5e1eb] px-4 py-2 text-sm font-semibold text-[#1f4e79] disabled:opacity-50"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={filters.page >= state.pagination.pages}
                onClick={() => setFilters((current) => ({ ...current, page: current.page + 1 }))}
                className="rounded-full border border-[#d5e1eb] px-4 py-2 text-sm font-semibold text-[#1f4e79] disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        ) : null}
      </CardSection>

      <Modal
        open={Boolean(pendingDelete)}
        title="Delete this tour?"
        description="This removes the trip from the admin CMS and the linked website listing."
        onClose={() => setPendingDelete(null)}
        footer={
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setPendingDelete(null)}
              className="rounded-full border border-[#d5e1eb] px-4 py-2 text-sm font-semibold text-[#1f4e79]"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={async () => {
                if (!pendingDelete) return;
                setBusy(true);
                const result = await deleteTour(pendingDelete.id);
                setBusy(false);
                if (result.success) {
                  setPendingDelete(null);
                  setFilters((current) => ({ ...current }));
                }
              }}
              className="rounded-full bg-[#b14f3d] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {busy ? "Deleting..." : "Delete tour"}
            </button>
          </div>
        }
      >
        <div className="rounded-[24px] bg-[#f8fbfe] p-4">
          <p className="text-sm text-[#526477]">
            You are removing <span className="font-semibold text-[#17324d]">{pendingDelete?.title}</span>.
          </p>
        </div>
      </Modal>
    </PageTransition>
  );
}
