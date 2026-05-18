"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import PageTransition from "@/components/admin/PageTransition";
import { CardSection, Field, TextInput } from "@/components/admin/AdminFields";
import { formatDate } from "@/lib/admin-data";
import { deleteBlog, listBlogs } from "@/services/adminService";

export default function BlogsPage() {
  const [search, setSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [state, setState] = useState({ rows: [], loading: true, message: "" });
  const [pendingDelete, setPendingDelete] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      setState((current) => ({ ...current, loading: true }));
      const result = await listBlogs({ search: search || undefined, limit: 100 });
      setState({
        rows: result.success ? result.data?.blogs || [] : [],
        loading: false,
        message: result.success ? "" : result.message,
      });
    }, 180);

    return () => clearTimeout(timeout);
  }, [search, refreshKey]);

  return (
    <PageTransition className="space-y-6">
      <CardSection
        title="Blog CMS"
        description="Manage editorial content, featured images, and search metadata for the travel website."
        actions={
          <Link
            href="/admin/blogs/new"
            className="rounded-full bg-[#f4a261] px-4 py-2 text-sm font-semibold text-[#17324d] shadow-[0_16px_32px_-20px_rgba(244,162,97,0.85)] transition hover:bg-[#ee9654]"
          >
            Add new blog
          </Link>
        }
      >
        <Field label="Search blogs">
          <TextInput
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by title or excerpt"
          />
        </Field>
      </CardSection>

      {state.message ? (
        <div className="rounded-[26px] border border-[#f2d4bd] bg-[#fff5eb] px-5 py-4 text-sm text-[#a35a23]">
          {state.message}
        </div>
      ) : null}

      <CardSection
        title={state.loading ? "Loading blogs..." : `${state.rows.length} blog post(s)`}
        description="A clean editorial pipeline with easy access to edit and delete actions."
      >
        <DataTable
          rows={state.rows}
          emptyTitle="No blogs found"
          emptyDescription="Create your first travel story or widen the search."
          columns={[
            {
              key: "title",
              title: "Blog",
              render: (row) => (
                <div className="flex items-center gap-3">
                  <Image
                    src={row.coverImage || row.image || "https://placehold.co/96x72?text=Blog"}
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
            { key: "authorName", title: "Author" },
            { key: "category", title: "Category", render: (row) => row.category || "Uncategorised" },
            { key: "publishedAt", title: "Publish date", render: (row) => formatDate(row.publishedAt) },
            {
              key: "actions",
              title: "Actions",
              render: (row) => (
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/admin/blogs/${row.id}`}
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
      </CardSection>

      <Modal
        open={Boolean(pendingDelete)}
        title="Delete this blog?"
        description="The article will be removed from the admin panel and the public blog listing."
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
                const result = await deleteBlog(pendingDelete.id);
                setBusy(false);
                if (result.success) {
                  setPendingDelete(null);
                  setRefreshKey((value) => value + 1);
                }
              }}
              className="rounded-full bg-[#b14f3d] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {busy ? "Deleting..." : "Delete blog"}
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
