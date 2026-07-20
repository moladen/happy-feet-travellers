"use client";

import ImageUploader from "@/components/admin/ImageUploader";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { Field, TextArea, TextInput } from "@/components/admin/AdminFields";
import {
  EMPTY_IMAGE_BLOCK,
  EMPTY_LINK_BLOCK,
  EMPTY_PARAGRAPH_BLOCK,
  isInternalAppPath,
  sanitizeBlogUrl,
} from "@/lib/blogContent";

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

function resolveBlockType(block) {
  if (block?.type === "image") return "image";
  if (block?.type === "link") return "link";
  return "paragraph";
}

const BLOCK_LABELS = {
  paragraph: "Paragraph",
  image: "Photo",
  link: "Link",
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
          <button
            type="button"
            onClick={() => onChange([...rows, { ...EMPTY_LINK_BLOCK }])}
            className="rounded-full border border-[#d5e1eb] px-3 py-1.5 text-sm font-semibold text-[#1f4e79] transition hover:border-[#4fa3d1]"
          >
            + Link
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {rows.map((block, index) => {
          const type = resolveBlockType(block);
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
              ) : type === "link" ? (
                <div className="space-y-4">
                  <Field
                    label="Link URL"
                    hint="Tour/package: /tour/your-tour-slug — External: https://example.com"
                  >
                    <TextInput
                      value={block.url || ""}
                      onChange={(event) =>
                        onChange(updateBlock(rows, index, { url: event.target.value }))
                      }
                      onBlur={() => {
                        const next = sanitizeBlogUrl(block.url);
                        if (next && next !== block.url) {
                          onChange(updateBlock(rows, index, { url: next }));
                        }
                      }}
                      placeholder="/tour/spiti-valley or https://…"
                    />
                  </Field>
                  <Field label="Link title">
                    <TextInput
                      value={block.title || ""}
                      onChange={(event) =>
                        onChange(updateBlock(rows, index, { title: event.target.value }))
                      }
                      placeholder="Spiti Valley departure"
                    />
                  </Field>
                  <Field label="Short description (optional)">
                    <TextArea
                      rows={2}
                      value={block.description || ""}
                      onChange={(event) =>
                        onChange(updateBlock(rows, index, { description: event.target.value }))
                      }
                      placeholder="One line about why readers should open this link..."
                    />
                  </Field>
                  <Field label="Button label">
                    <TextInput
                      value={block.label || "Visit link"}
                      onChange={(event) =>
                        onChange(updateBlock(rows, index, { label: event.target.value }))
                      }
                      placeholder="View tour"
                    />
                  </Field>
                  {sanitizeBlogUrl(block.url) ? (
                    <div className="rounded-2xl border border-[#dceaf7] bg-[#f8fbff] p-4">
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#6f8295]">
                        Preview · {isInternalAppPath(sanitizeBlogUrl(block.url)) ? "Internal" : "External"}
                      </p>
                      <p className="mt-2 font-semibold text-[#17324d]">
                        {block.title || (isInternalAppPath(sanitizeBlogUrl(block.url)) ? "Tour link" : "External link")}
                      </p>
                      {block.description ? (
                        <p className="mt-1 text-sm text-[#6f8295]">{block.description}</p>
                      ) : null}
                      <p className="mt-2 truncate text-xs text-[#4fa3d1]">{sanitizeBlogUrl(block.url)}</p>
                    </div>
                  ) : null}
                </div>
              ) : (
                <Field label="Paragraph text">
                  <RichTextEditor
                    value={block.text || ""}
                    onChange={(html) => onChange(updateBlock(rows, index, { text: html }))}
                    placeholder="Write your paragraph. Use Link in the toolbar for tour/package or external URLs."
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
