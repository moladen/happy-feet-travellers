"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import ImageUploader from "@/components/admin/ImageUploader";
import PageTransition from "@/components/admin/PageTransition";
import { CardSection, Field, SelectInput, TextArea, TextInput } from "@/components/admin/AdminFields";
import {
  buildTestimonialPayload,
  emptyTestimonialForm,
} from "@/lib/admin-data";
import {
  createTestimonial,
  deleteTestimonial,
  listTestimonials,
  updateTestimonial,
} from "@/services/adminService";

export default function TestimonialsPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ ...emptyTestimonialForm });
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const load = async () => {
    const result = await listTestimonials();
    setItems(result.success ? result.data?.testimonials || result.data || [] : []);
    setMessage(result.success ? "" : result.message);
  };

  useEffect(() => {
    let active = true;

    (async () => {
      const result = await listTestimonials();
      if (!active) return;
      setItems(result.success ? result.data?.testimonials || result.data || [] : []);
      setMessage(result.success ? "" : result.message);
    })();

    return () => {
      active = false;
    };
  }, []);

  return (
    <PageTransition className="space-y-6">
      {message ? (
        <div className="rounded-[26px] border border-[#f2d4bd] bg-[#fff5eb] px-5 py-4 text-sm text-[#a35a23]">
          {message}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <CardSection
          title={editingId ? "Edit testimonial" : "Add testimonial"}
          description="Curate social proof cards for the travel website with photo, review, and rating."
        >
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              setBusy(true);
              const payload = buildTestimonialPayload(form);
              const result = editingId
                ? await updateTestimonial(editingId, payload)
                : await createTestimonial(payload);
              setBusy(false);
              setMessage(result.message);
              if (!result.success) return;
              setEditingId(null);
              setForm({ ...emptyTestimonialForm });
              await load();
            }}
            className="space-y-5"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Customer name">
                <TextInput
                  required
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                />
              </Field>
              <Field label="City">
                <TextInput
                  value={form.city}
                  onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))}
                />
              </Field>
            </div>
            <Field label="Rating">
              <SelectInput
                value={form.rating}
                onChange={(event) => setForm((current) => ({ ...current, rating: event.target.value }))}
              >
                {[5, 4, 3, 2, 1].map((value) => (
                  <option key={value} value={value}>
                    {value} star{value === 1 ? "" : "s"}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Review">
              <TextArea
                required
                rows={6}
                value={form.review}
                onChange={(event) => setForm((current) => ({ ...current, review: event.target.value }))}
              />
            </Field>
            <ImageUploader
              label="Customer photo"
              images={form.image}
              onChange={(value) => setForm((current) => ({ ...current, image: value }))}
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="submit"
                disabled={busy}
                className="rounded-full bg-[#f4a261] px-5 py-3 text-sm font-semibold text-[#17324d] shadow-[0_18px_36px_-24px_rgba(244,162,97,0.9)] transition hover:bg-[#ef9551] disabled:opacity-60"
              >
                {busy ? "Saving..." : editingId ? "Update testimonial" : "Save testimonial"}
              </button>
              {editingId ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm({ ...emptyTestimonialForm });
                  }}
                  className="rounded-full border border-[#d5e1eb] px-5 py-3 text-sm font-semibold text-[#1f4e79]"
                >
                  Cancel edit
                </button>
              ) : null}
            </div>
          </form>
        </CardSection>

        <CardSection title="Review preview cards" description="Check tone, credibility, and card balance before going live.">
          <div className="grid gap-4 lg:grid-cols-2">
            {items.map((item) => (
              <article
                key={item.id}
                className="rounded-[28px] border border-[#e7eef4] bg-[#fbfdff] p-5 shadow-[0_20px_40px_-32px_rgba(31,78,121,0.45)]"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={item.image || "https://placehold.co/80x80?text=Guest"}
                    alt=""
                    width={80}
                    height={80}
                    unoptimized
                    className="h-16 w-16 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-bold text-[#17324d]">{item.name}</h3>
                    <p className="text-sm text-[#6c8094]">{item.city || "Happy traveller"}</p>
                  </div>
                </div>
                <div className="mt-4 text-[#f4a261]">
                  {"★".repeat(Number(item.rating || 5))}
                </div>
                <p className="mt-3 text-sm leading-7 text-[#425264]">{item.review}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(item.id);
                      setForm({
                        name: item.name || "",
                        city: item.city || "",
                        image: item.image || "",
                        review: item.review || "",
                        rating: String(item.rating || 5),
                      });
                    }}
                    className="rounded-full border border-[#d5e1eb] px-4 py-2 text-sm font-semibold text-[#1f4e79]"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      const result = await deleteTestimonial(item.id);
                      setMessage(result.message);
                      if (result.success) await load();
                    }}
                    className="rounded-full border border-[#f0d6d2] px-4 py-2 text-sm font-semibold text-[#b14f3d]"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </CardSection>
      </div>
    </PageTransition>
  );
}
