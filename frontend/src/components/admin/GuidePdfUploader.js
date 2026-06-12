"use client";

import { useRef, useState } from "react";
import { Field, TextInput } from "@/components/admin/AdminFields";
import { resolveHeroImageSrcForAdmin } from "@/lib/heroSlides";
import { uploadGuidePdf } from "@/services/adminService";

const buttonClassName =
  "inline-flex h-[46px] shrink-0 items-center justify-center rounded-2xl border border-[#d5e1eb] bg-white px-5 text-sm font-semibold text-[#1f4e79] transition hover:border-[#4fa3d1] whitespace-nowrap disabled:opacity-60";

export default function GuidePdfUploader({ pdfUrl, fileName, onUrlChange, onFileNameChange }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const previewHref = pdfUrl ? resolveHeroImageSrcForAdmin(pdfUrl) : "";

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setUploadError("Please choose a PDF file.");
      return;
    }

    setUploadError("");
    setUploading(true);
    try {
      const result = await uploadGuidePdf(file);
      if (!result.success || !result.data?.url) {
        throw new Error(result.message || "Upload failed");
      }
      onUrlChange(result.data.url);
      if (!fileName?.trim()) {
        onFileNameChange(file.name.replace(/[^\w.\-]+/g, "-"));
      }
    } catch (error) {
      setUploadError(error?.message || "Could not upload PDF.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4 rounded-[24px] border border-[#e7eef4] bg-[#f8fbff] p-4">
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className={buttonClassName} disabled={uploading} onClick={() => inputRef.current?.click()}>
          {uploading ? "Uploading PDF…" : "Upload PDF"}
        </button>
        <input ref={inputRef} type="file" accept="application/pdf,.pdf" className="hidden" onChange={handleUpload} />
        {previewHref ? (
          <a
            href={previewHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-[#1f4e79] underline-offset-2 hover:underline"
          >
            Preview current PDF ↗
          </a>
        ) : (
          <span className="text-sm text-[#6f8295]">No PDF uploaded yet</span>
        )}
      </div>
      {uploadError ? <p className="text-sm text-[#b14f3d]">{uploadError}</p> : null}
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="PDF file URL" hint="Auto-filled after upload, or paste /guides/... or /uploads/guides/...">
          <TextInput value={pdfUrl} onChange={(e) => onUrlChange(e.target.value)} placeholder="/uploads/guides/your-file.pdf" />
        </Field>
        <Field label="Download filename">
          <TextInput
            value={fileName}
            onChange={(e) => onFileNameChange(e.target.value)}
            placeholder="Happy-Feet-Rann-Utsav-Planning-Guide-2026-27.pdf"
          />
        </Field>
      </div>
    </div>
  );
}
