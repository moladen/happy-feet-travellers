"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import PageTransition from "@/components/admin/PageTransition";
import { CardSection, Field, TextInput } from "@/components/admin/AdminFields";
import { resolveHeroImageSrc } from "@/lib/heroSlides";
import { deleteLandingPage, listLandingPages } from "@/services/adminService";

export default function LandingPagesPage() {
  const [search, setSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [state, setState] = useState({ rows: [], loading: true, message: "" });
  const [pendingDelete, setPendingDelete] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      setState((current) => ({ ...current, loading: true }));
      const result = await listLandingPages({ search: search || undefined, limit: 100 });
      setState({
        rows: result.success ? result.data?.landingPages || [] : [],
        loading: false,
        message: result.success ? "" : result.message,
      });
    }, 180);

    return () => clearTimeout(timeout);
  }, [search, refreshKey]);

  return (
    <PageTransition className="space-y-6">
      <CardSection
        title="Landing Pages"
        description="Edit seasonal campaign pages — hero images, headlines, intro copy, CTAs, and SEO."
        actions={
          <Link
            href="/admin/landing-pages/new"
            className="rounded-full bg-[#f4a261] px-4 py-2 text-sm font-semibold text-[#17324d] shadow-[0_16px_32px_-20px_rgba(244,162,97,0.85)] transition hover:bg-[#ee9654]"
          >
            Add landing page
          </Link>
        }
      >
        <Field label="Search">
          <TextInput
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by title or slug"
          />
        </Field>
      </CardSection>

      {state.message ? (
        <div className="rounded-[26px] border border-[#f2d4bd] bg-[#fff5eb] px-5 py-4 text-sm text-[#a35a23]">
          {state.message}
        </div>
      ) : null}

      <CardSection
        title={state.loading ? "Loading…" : `${state.rows.length} landing page(s)`}
        description="Rann of Kutch and other campaign URLs. Set status to Published for the page to go live."
      >
        <DataTable
          rows={state.rows}
          emptyTitle="No landing pages yet"
          emptyDescription='Run "node scripts/seed-rann-landing.js" on the backend or create a new page.'
          columns={[
            {
              key: "title",
              title: "Page",
              render: (row) => (
                <div className="flex items-center gap-3">
                  <Image
                    src={
                      resolveHeroImageSrc(row.heroBannerImage) ||
                      "https://placehold.co/96x72?text=Landing"
                    }
                    alt=""
                    width={96}
                    height={72}
                    unoptimized
                    className="h-16 w-20 rounded-2xl object-cover"
                  />
                  <div className="min-w-0">
                    <div className="truncate font-semibold text-[#17324d]">{row.title}</div>
                    <div className="mt-1 text-xs text-[#6e8094]">/{row.slug}</div>
                  </div>
                </div>
              ),
            },
            {
              key: "status",
              title: "Status",
              render: (row) => (
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    row.status === "published"
                      ? "bg-[#e8f6ee] text-[#1d6b42]"
                      : "bg-[#f3f4f6] text-[#5c6b7a]"
                  }`}
                >
                  {row.status === "published" ? "Published" : "Draft"}
                </span>
              ),
            },
            {
              key: "counts",
              title: "Content",
              render: (row) => (
                <span className="text-xs text-[#6e8094]">
                  {row._count?.packages ?? 0} pkg · {row._count?.faqs ?? 0} FAQ
                </span>
              ),
            },
            {
              key: "actions",
              title: "Actions",
              render: (row) => (
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/admin/landing-pages/${row.id}`}
                    className="rounded-full border border-[#d5e1eb] px-3 py-2 text-xs font-semibold text-[#1f4e79] transition hover:border-[#4fa3d1]"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/${row.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-[#d5e1eb] px-3 py-2 text-xs font-semibold text-[#1f4e79]"
                  >
                    View
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
        title="Delete this landing page?"
        description="The page and all its packages, FAQs, and testimonials will be removed."
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
                const result = await deleteLandingPage(pendingDelete.id);
                setBusy(false);
                if (result.success) {
                  setPendingDelete(null);
                  setRefreshKey((value) => value + 1);
                }
              }}
              className="rounded-full bg-[#b14f3d] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {busy ? "Deleting…" : "Delete page"}
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
