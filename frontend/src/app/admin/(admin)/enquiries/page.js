"use client";

import { useEffect, useMemo, useState } from "react";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import PageTransition from "@/components/admin/PageTransition";
import StatusBadge from "@/components/admin/StatusBadge";
import { CardSection, Field, SelectInput, TextInput } from "@/components/admin/AdminFields";
import { enquiryStatusOptions, formatDateTime } from "@/lib/admin-data";
import { deleteEnquiry, listEnquiries, updateEnquiryStatus } from "@/services/adminService";

export default function EnquiriesPage() {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({ search: "", status: "" });
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");

  const load = async () => {
    const result = await listEnquiries({ limit: 100 });
    setItems(result.success ? result.data?.enquiries || [] : []);
    setMessage(result.success ? "" : result.message);
  };

  useEffect(() => {
    let active = true;

    (async () => {
      const result = await listEnquiries({ limit: 100 });
      if (!active) return;
      setItems(result.success ? result.data?.enquiries || [] : []);
      setMessage(result.success ? "" : result.message);
    })();

    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesStatus = !filters.status || item.status === filters.status;
      const haystack = `${item.name} ${item.email} ${item.phone} ${item.subject || ""} ${item.message}`.toLowerCase();
      const matchesSearch = !filters.search || haystack.includes(filters.search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [filters, items]);

  return (
    <PageTransition className="space-y-6">
      <CardSection title="Lead management" description="Track enquiry status, search incoming leads, and view the full travel request context.">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.45fr]">
          <Field label="Search enquiries">
            <TextInput
              value={filters.search}
              onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
              placeholder="Search by traveller, email, phone, or message"
            />
          </Field>
          <Field label="Status">
            <SelectInput
              value={filters.status}
              onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}
            >
              <option value="">All leads</option>
              {enquiryStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </SelectInput>
          </Field>
        </div>
      </CardSection>

      {message ? (
        <div className="rounded-[26px] border border-[#f2d4bd] bg-[#fff5eb] px-5 py-4 text-sm text-[#a35a23]">
          {message}
        </div>
      ) : null}

      <CardSection title={`${filtered.length} enquiry lead(s)`} description="Designed for quick triage rather than a cluttered CRM table.">
        <DataTable
          rows={filtered}
          emptyTitle="No enquiries match the current filter"
          emptyDescription="Try another search term or clear the status filter."
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
            { key: "phone", title: "Phone" },
            {
              key: "subject",
              title: "Destination",
              render: (row) => row.destination || row.subject || "General enquiry",
            },
            {
              key: "status",
              title: "Status",
              render: (row) => (
                <select
                  value={row.status}
                  onChange={async (event) => {
                    const result = await updateEnquiryStatus(row.id, event.target.value);
                    setMessage(result.message);
                    if (result.success) await load();
                  }}
                  className="rounded-full border border-[#d5e1eb] bg-white px-3 py-2 text-xs font-semibold text-[#1f4e79] outline-none"
                >
                  {enquiryStatusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ),
            },
            {
              key: "message",
              title: "Message",
              render: (row) => (
                <div className="flex items-center gap-2">
                  <p className="max-w-[18rem] truncate text-sm text-[#425264]">{row.message}</p>
                  <button
                    type="button"
                    onClick={() => setSelected(row)}
                    className="rounded-full border border-[#d5e1eb] px-3 py-2 text-xs font-semibold text-[#1f4e79]"
                  >
                    View
                  </button>
                </div>
              ),
            },
            {
              key: "createdAt",
              title: "Date",
              render: (row) => (
                <div className="space-y-2">
                  <StatusBadge value={row.status} />
                  <div className="text-xs text-[#6e8094]">{formatDateTime(row.createdAt)}</div>
                </div>
              ),
            },
            {
              key: "actions",
              title: "",
              render: (row) => (
                <button
                  type="button"
                  onClick={async () => {
                    if (!window.confirm("Delete this enquiry permanently?")) return;
                    const result = await deleteEnquiry(row.id);
                    setMessage(result.message);
                    if (result.success) await load();
                  }}
                  className="rounded-full border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50"
                >
                  Delete
                </button>
              ),
            },
          ]}
        />
      </CardSection>

      <Modal
        open={Boolean(selected)}
        title={selected?.name || "Lead details"}
        description="Full message view for better response quality."
        onClose={() => setSelected(null)}
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[24px] bg-[#f7fbfe] p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5b84a5]">Phone</div>
              <div className="mt-2 text-sm text-[#17324d]">{selected?.phone || "Not shared"}</div>
            </div>
            <div className="rounded-[24px] bg-[#f7fbfe] p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5b84a5]">Destination</div>
              <div className="mt-2 text-sm text-[#17324d]">
                {selected?.destination || selected?.subject || "General enquiry"}
              </div>
            </div>
          </div>
          <div className="rounded-[24px] bg-[#f7fbfe] p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5b84a5]">Message</div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#425264]">{selected?.message}</p>
          </div>
        </div>
      </Modal>
    </PageTransition>
  );
}
