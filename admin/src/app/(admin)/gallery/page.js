"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import ImageUploader from "@/components/admin/ImageUploader";
import Modal from "@/components/admin/Modal";
import PageTransition from "@/components/admin/PageTransition";
import { CardSection, Field, TextInput } from "@/components/admin/AdminFields";
import {
  buildGalleryPayload,
  emptyGalleryForm,
} from "@/lib/admin-data";
import {
  createGalleryItem,
  deleteGalleryItem,
  listGalleryItems,
  updateGalleryItem,
} from "@/services/adminService";

export default function GalleryPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ ...emptyGalleryForm });
  const [editingItem, setEditingItem] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const load = async () => {
    const result = await listGalleryItems();
    setItems(result.success ? result.data?.items || result.data || [] : []);
    setMessage(result.success ? "" : result.message);
  };

  useEffect(() => {
    let active = true;

    (async () => {
      const result = await listGalleryItems();
      if (!active) return;
      setItems(result.success ? result.data?.items || result.data || [] : []);
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

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <CardSection
          title={editingItem ? "Edit gallery image" : "Upload gallery image"}
          description="Manage the travel photo grid with drag-and-drop uploads and caption metadata."
        >
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              setBusy(true);
              const payload = buildGalleryPayload(form);
              const result = editingItem
                ? await updateGalleryItem(editingItem.id, payload)
                : await createGalleryItem(payload);
              setBusy(false);
              setMessage(result.message);
              if (!result.success) return;
              setEditingItem(null);
              setForm({ ...emptyGalleryForm });
              await load();
            }}
            className="space-y-5"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Title">
                <TextInput
                  value={form.title}
                  onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                  placeholder="Kerala houseboat calm"
                />
              </Field>
              <Field label="Destination / tag">
                <TextInput
                  value={form.category}
                  onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                  placeholder="Kerala / Goa / Sikkim"
                />
              </Field>
            </div>
            <Field label="Alt text">
              <TextInput
                value={form.altText}
                onChange={(event) => setForm((current) => ({ ...current, altText: event.target.value }))}
                placeholder="Houseboat in the Kerala backwaters"
              />
            </Field>
            <ImageUploader
              label="Travel photo"
              helperText="Drop one image at a time for a tidy visual library."
              images={form.image}
              onChange={(value) => setForm((current) => ({ ...current, image: value }))}
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="submit"
                disabled={busy}
                className="rounded-full bg-[#f4a261] px-5 py-3 text-sm font-semibold text-[#17324d] shadow-[0_18px_36px_-24px_rgba(244,162,97,0.9)] transition hover:bg-[#ef9551] disabled:opacity-60"
              >
                {busy ? "Saving..." : editingItem ? "Update image" : "Upload image"}
              </button>
              {editingItem ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(null);
                    setForm({ ...emptyGalleryForm });
                  }}
                  className="rounded-full border border-[#d5e1eb] px-5 py-3 text-sm font-semibold text-[#1f4e79]"
                >
                  Cancel edit
                </button>
              ) : null}
            </div>
          </form>
        </CardSection>

        <CardSection title="Masonry preview grid" description="Check the image mix before it reaches the homepage gallery.">
          <div className="columns-1 gap-4 sm:columns-2 2xl:columns-3 [&>article]:mb-4">
            {items.map((item, index) => (
              <article
                key={item.id}
                className="break-inside-avoid overflow-hidden rounded-[28px] border border-[#e7eef4] bg-white p-3 shadow-[0_20px_40px_-32px_rgba(31,78,121,0.45)]"
              >
                <Image
                  src={item.image || "https://placehold.co/600x700?text=Gallery"}
                  alt={item.altText || ""}
                  width={600}
                  height={700}
                  unoptimized
                  className={`w-full rounded-[22px] object-cover ${
                    index % 3 === 0 ? "h-[290px]" : index % 3 === 1 ? "h-[220px]" : "h-[340px]"
                  }`}
                />
                <div className="px-2 pb-2 pt-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {item.category ? (
                      <span className="rounded-full bg-[#edf6fd] px-3 py-1 text-xs font-semibold text-[#1f4e79]">
                        {item.category}
                      </span>
                    ) : null}
                  </div>
                  <h3 className="mt-3 text-lg font-bold text-[#17324d]">{item.title || item.altText || "Untitled image"}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#637588]">{item.altText || "No alt text provided"}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingItem(item);
                        setForm({
                          title: item.title || "",
                          altText: item.altText || "",
                          category: item.category || "",
                          image: item.image || "",
                        });
                      }}
                      className="rounded-full border border-[#d5e1eb] px-4 py-2 text-sm font-semibold text-[#1f4e79]"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        const result = await deleteGalleryItem(item.id);
                        setMessage(result.message);
                        if (result.success) await load();
                      }}
                      className="rounded-full border border-[#f0d6d2] px-4 py-2 text-sm font-semibold text-[#b14f3d]"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </CardSection>
      </div>

      <Modal
        open={busy}
        title="Processing image"
        description="The gallery is being updated."
        onClose={() => {}}
      >
        <p className="text-sm text-[#637588]">Please wait while the image data is saved.</p>
      </Modal>
    </PageTransition>
  );
}
