"use client";

import ImageUploader from "@/components/admin/ImageUploader";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { Field, TextArea } from "@/components/admin/AdminFields";
import { EMPTY_IMAGE_BLOCK, EMPTY_PARAGRAPH_BLOCK } from "@/lib/blogContent";

function updateBlock(blocks, index, patch) {
  return blocks.map((block, itemIndex) => (itemIndex === index ? { ...block, ...patch } : block));
}

function moveBlock(blocks, index, direction) {
  const target = index + direction;
  if (target < 0 || target >= blocks.length) return blocks;
  const next = [...blocks];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

const BLOCK_LABELS = {
  paragraph: "Paragraph",
  image: "Photo",
};

export default function BlogContentEditor({ blocks, onChange, label = "Article body", helperText }) {
  const rows = Array.isArray(blocks) && blocks.length ? blocks : [{ ...EMPTY_PARAGRAPH_BLOCK }];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <label className="text-sm font-semibold text-[#314559]">{label}</label>
          {helperText ? <p className="mt-1 text-xs text-[#6f8295]">{helperText}</p> : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onChange([...rows, { ...EMPTY_PARAGRAPH_BLOCK }])}
            className="rounded-full border border-[#d5e1eb] px-3 py-1.5 text-sm font-semibold text-[#1f4e79] transition hover:border-[#4fa3d1]"
          >
            + Paragraph
          </button>
          <button
            type="button"
            onClick={() => onChange([...rows, { ...EMPTY_IMAGE_BLOCK }])}
            className="rounded-full border border-[#d5e1eb] px-3 py-1.5 text-sm font-semibold text-[#1f4e79] transition hover:border-[#4fa3d1]"
          >
            + Photo
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {rows.map((block, index) => {
          const type = block.type === "image" ? "image" : "paragraph";
          return (
            <div
              key={`blog-block-${index}`}
              className="rounded-[24px] border border-[#e7eef4] bg-white p-4 shadow-[0_12px_30px_-24px_rgba(31,78,121,0.35)]"
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-full bg-[#f0f7fc] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#1f4e79]">
                  {BLOCK_LABELS[type]}
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => onChange(moveBlock(rows, index, -1))}
                    className="rounded-xl border border-[#d5e1eb] px-2.5 py-1 text-xs font-semibold text-[#1f4e79] transition hover:border-[#4fa3d1] disabled:opacity-40"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    disabled={index === rows.length - 1}
                    onClick={() => onChange(moveBlock(rows, index, 1))}
                    className="rounded-xl border border-[#d5e1eb] px-2.5 py-1 text-xs font-semibold text-[#1f4e79] transition hover:border-[#4fa3d1] disabled:opacity-40"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const next = rows.filter((_, itemIndex) => itemIndex !== index);
                      onChange(next.length ? next : [{ ...EMPTY_PARAGRAPH_BLOCK }]);
                    }}
                    className="rounded-xl px-2.5 py-1 text-xs font-semibold text-[#b14f3d]"
                  >
                    Remove
                  </button>
                </div>
              </div>

              {type === "image" ? (
                <div className="space-y-4">
                  <ImageUploader
                    label="Photo"
                    helperText="Appears between paragraphs in the article."
                    images={block.url || ""}
                    onChange={(value) => onChange(updateBlock(rows, index, { url: value }))}
                  />
                  <Field label="Caption (optional)">
                    <TextArea
                      rows={2}
                      value={block.caption || ""}
                      onChange={(event) =>
                        onChange(updateBlock(rows, index, { caption: event.target.value }))
                      }
                      placeholder="Short caption under the photo..."
                    />
                  </Field>
                </div>
              ) : (
                <Field label="Paragraph text">
                  <RichTextEditor
                    value={block.text || ""}
                    onChange={(html) => onChange(updateBlock(rows, index, { text: html }))}
                    placeholder="Write your paragraph. Use the toolbar for bold, italic, headings, and text color."
                    minHeight={180}
                  />
                </Field>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
