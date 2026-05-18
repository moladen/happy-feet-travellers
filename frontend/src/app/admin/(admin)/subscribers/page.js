"use client";

import { useEffect, useMemo, useState } from "react";
import DataTable from "@/components/admin/DataTable";
import PageTransition from "@/components/admin/PageTransition";
import { CardSection, Field, TextInput } from "@/components/admin/AdminFields";
import { formatDateTime } from "@/lib/admin-data";
import { listSubscribers } from "@/services/adminService";

export default function SubscribersPage() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    const result = await listSubscribers({ limit: 200 });
    const rows = result.success
      ? result.data?.subscribers || (Array.isArray(result.data) ? result.data : [])
      : [];
    setItems(rows);
    setMessage(result.success ? "" : result.message);
  };

  useEffect(() => {
    let active = true;
    (async () => {
      const result = await listSubscribers({ limit: 200 });
      if (!active) return;
      const rows = result.success
        ? result.data?.subscribers || (Array.isArray(result.data) ? result.data : [])
        : [];
      setItems(rows);
      setMessage(result.success ? "" : result.message);
    })();
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((row) =>
      `${row.email || ""} ${row.source || ""}`.toLowerCase().includes(q)
    );
  }, [items, search]);

  return (
    <PageTransition className="space-y-6">
      <CardSection
        title="Newsletter subscribers"
        description="Emails collected from the footer and other signup forms."
      >
        <Field label="Search">
          <TextInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by email or source"
          />
        </Field>
      </CardSection>

      {message ? (
        <div className="rounded-[26px] border border-[#f2d4bd] bg-[#fff5eb] px-5 py-4 text-sm text-[#a35a23]">
          {message}
        </div>
      ) : null}

      <CardSection title={`${filtered.length} subscriber(s)`}>
        <DataTable
          rows={filtered}
          emptyTitle="No subscribers yet"
          emptyDescription="Newsletter sign-ups from the public site will appear here."
          columns={[
            {
              key: "email",
              title: "Email",
              render: (row) => (
                <a href={`mailto:${row.email}`} className="font-semibold text-[#17324d] hover:underline">
                  {row.email}
                </a>
              ),
            },
            { key: "source", title: "Source", render: (row) => row.source || "—" },
            {
              key: "createdAt",
              title: "Subscribed",
              render: (row) => formatDateTime(row.createdAt),
            },
          ]}
        />
      </CardSection>
    </PageTransition>
  );
}
