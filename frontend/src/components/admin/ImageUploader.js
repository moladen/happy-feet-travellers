"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/admin/AdminIcons";
import { compressImageFile } from "@/lib/compressImage";
import { isImageFile, resolveAdminPreviewSrc, validateHeroImageFile } from "@/lib/heroSlides";
import { uploadTourImage } from "@/services/adminService";

const inputClassName =
  "w-full min-w-0 rounded-2xl border border-[#d5e1eb] bg-white px-4 py-3 text-sm text-[#33475b] outline-none transition focus:border-[#4fa3d1]";

const buttonClassName =
  "inline-flex h-[46px] shrink-0 items-center justify-center rounded-2xl border border-[#d5e1eb] bg-white px-5 text-sm font-semibold text-[#1f4e79] transition hover:border-[#4fa3d1] whitespace-nowrap";

function replaceImageValue(images, multiple, fromValue, toValue) {
  if (!multiple) return toValue || "";
  return (images || []).map((item) => (item === fromValue ? toValue : item)).filter(Boolean);
}

function AdminImagePreview({ src, alt = "" }) {
  const [failed, setFailed] = useState(false);
  const resolved = resolveAdminPreviewSrc(src);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!resolved || failed) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[#edf2f7] px-4 text-center text-xs text-[#6f8295]">
        <Icon name="gallery" className="h-6 w-6 text-[#9aabb9]" />
        <span>{failed ? "Preview unavailable — remove and upload again as JPG/PNG." : "No preview"}</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolved}
      alt={alt}
      className="h-full w-full object-cover"
      onError={() => setFailed(true)}
    />
  );
}

export default function ImageUploader({
  label,
  helperText,
  images,
  onChange,
  multiple = false,
  uploadImage = uploadTourImage,
}) {
  const inputRef = useRef(null);
  const previewUrlsRef = useRef(new Set());
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const imageList = multiple
    ? Array.isArray(images)
      ? images
      : []
    : typeof images === "string" && images
      ? [images]
      : [];
  const list = imageList.filter(Boolean);

  const trackPreview = (previewUrl) => {
    previewUrlsRef.current.add(previewUrl);
  };

  const releasePreview = (previewUrl) => {
    if (!previewUrl || !String(previewUrl).startsWith("blob:")) return;
    if (!previewUrlsRef.current.has(previewUrl)) return;
    URL.revokeObjectURL(previewUrl);
    previewUrlsRef.current.delete(previewUrl);
  };

  const pushImages = (nextImages) => {
    if (multiple) {
      onChange([...imageList, ...nextImages].filter(Boolean));
      return;
    }
    onChange(nextImages[0] || "");
  };

  const handleFiles = async (files) => {
    const fileList = Array.from(files || []).filter(isImageFile);
    if (!fileList.length) {
      setUploadError("Could not read the selected file. Use JPG, PNG, or WebP.");
      return;
    }

    setUploadError("");
    setUploading(true);

    let gallery = multiple ? [...imageList] : typeof images === "string" ? images : "";

    for (const file of fileList) {
      const validationError = validateHeroImageFile(file);
      if (validationError) {
        setUploadError(validationError);
        continue;
      }

      const previewUrl = URL.createObjectURL(file);
      trackPreview(previewUrl);
      gallery = multiple ? [...gallery, previewUrl] : previewUrl;
      onChange(gallery);

      try {
        const compressed = await compressImageFile(file);
        const result = await uploadImage(compressed);
        if (!result.success || !result.data?.url) {
          setUploadError(result.message || "Could not upload image.");
          gallery = replaceImageValue(gallery, multiple, previewUrl, "");
          onChange(gallery);
          releasePreview(previewUrl);
          continue;
        }

        gallery = replaceImageValue(gallery, multiple, previewUrl, result.data.url);
        onChange(gallery);
        releasePreview(previewUrl);
      } catch (error) {
        setUploadError(error?.message || "Could not process this photo.");
        gallery = replaceImageValue(gallery, multiple, previewUrl, "");
        onChange(gallery);
        releasePreview(previewUrl);
      }
    }

    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeImage = (image) => {
    releasePreview(image);
    if (!multiple) {
      onChange("");
      return;
    }
    onChange((Array.isArray(images) ? images : []).filter((item) => item !== image));
  };

  return (
    <div className="flex w-full min-w-0 flex-col gap-4">
      <div>
        <span className="text-sm font-semibold text-[#314559]">{label}</span>
        {helperText ? <p className="mt-1 text-xs leading-relaxed text-[#6f8295]">{helperText}</p> : null}
      </div>

      <div className="w-full overflow-hidden rounded-[24px] border border-[#e7eef4] bg-[#fbfdff]">
        <div
          onDragOver={(event) => event.preventDefault()}
          onDrop={async (event) => {
            event.preventDefault();
            if (!uploading) await handleFiles(event.dataTransfer.files);
          }}
          className="border-b border-dashed border-[#c9dbe8] bg-[#f8fbfe] p-5 text-center"
        >
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white text-[#1f4e79] shadow-sm">
            <Icon name="gallery" className="h-7 w-7" />
          </div>
          <p className="mt-4 text-sm font-semibold text-[#17324d]">Drag and drop travel images here</p>
          <p className="mt-1 text-xs text-[#6d8093]">
            {multiple ? "Multiple images supported" : "Use one hero image"} — JPG, PNG, or WebP from your device.
          </p>
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="mt-4 rounded-full bg-[#1f4e79] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#173b5d] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading ? "Uploading…" : "Choose file"}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
            multiple={multiple}
            className="hidden"
            onChange={(event) => handleFiles(event.target.files)}
          />
        </div>

        <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <input
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="Or paste an image URL"
            className={inputClassName}
          />
          <button
            type="button"
            onClick={() => {
              if (!url.trim()) return;
              pushImages([url.trim()]);
              setUrl("");
            }}
            className={buttonClassName}
          >
            Add URL
          </button>
        </div>
      </div>

      {uploadError ? (
        <p className="text-sm text-[#b42318]">{uploadError}</p>
      ) : null}

      {list.length ? (
        <div className={multiple ? "grid w-full grid-cols-1 gap-4 sm:grid-cols-2" : "w-full"}>
          {list.map((image, index) => (
            <div
              key={`${index}-${String(image).slice(0, 48)}`}
              className="group relative w-full overflow-hidden rounded-[24px] border border-[#e7eef4] bg-white p-2 shadow-[0_12px_32px_-24px_rgba(31,78,121,0.45)]"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[18px] bg-[#edf2f7]">
                <AdminImagePreview src={image} />
              </div>
              <button
                type="button"
                onClick={() => removeImage(image)}
                className="absolute right-3 top-3 rounded-full bg-[#06111b]/70 p-2 text-white shadow-sm transition hover:bg-[#06111b]/85"
                aria-label="Remove image"
              >
                <Icon name="close" className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
