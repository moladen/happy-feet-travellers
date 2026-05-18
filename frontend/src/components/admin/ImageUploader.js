"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Icon } from "@/components/admin/AdminIcons";

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const inputClassName =
  "w-full min-w-0 rounded-2xl border border-[#d5e1eb] bg-white px-4 py-3 text-sm text-[#33475b] outline-none transition focus:border-[#4fa3d1]";

const buttonClassName =
  "inline-flex h-[46px] shrink-0 items-center justify-center rounded-2xl border border-[#d5e1eb] bg-white px-5 text-sm font-semibold text-[#1f4e79] transition hover:border-[#4fa3d1] whitespace-nowrap";

export default function ImageUploader({
  label,
  helperText,
  images,
  onChange,
  multiple = false,
}) {
  const inputRef = useRef(null);
  const [url, setUrl] = useState("");
  const list = multiple ? images || [] : images ? [images] : [];

  const pushImages = (nextImages) => {
    if (multiple) {
      onChange([...(images || []), ...nextImages].filter(Boolean));
      return;
    }
    onChange(nextImages[0] || "");
  };

  const handleFiles = async (files) => {
    const fileList = Array.from(files || []).filter((file) => file.type.startsWith("image/"));
    if (!fileList.length) return;
    const encoded = await Promise.all(fileList.map(readFileAsDataUrl));
    pushImages(encoded);
  };

  const removeImage = (image) => {
    if (!multiple) {
      onChange("");
      return;
    }
    onChange((images || []).filter((item) => item !== image));
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
            await handleFiles(event.dataTransfer.files);
          }}
          className="border-b border-dashed border-[#c9dbe8] bg-[#f8fbfe] p-5 text-center"
        >
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white text-[#1f4e79] shadow-sm">
            <Icon name="gallery" className="h-7 w-7" />
          </div>
          <p className="mt-4 text-sm font-semibold text-[#17324d]">Drag and drop travel images here</p>
          <p className="mt-1 text-xs text-[#6d8093]">
            {multiple ? "Multiple images supported" : "Use one hero image"} or upload from your device.
          </p>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-4 rounded-full bg-[#1f4e79] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#173b5d]"
          >
            Choose file
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
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

      {list.length ? (
        <div className={multiple ? "grid w-full grid-cols-1 gap-4 sm:grid-cols-2" : "w-full"}>
          {list.map((image, index) => (
            <div
              key={`${index}-${String(image).slice(0, 32)}`}
              className="group relative w-full overflow-hidden rounded-[24px] border border-[#e7eef4] bg-white p-2 shadow-[0_12px_32px_-24px_rgba(31,78,121,0.45)]"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[18px] bg-[#edf2f7]">
                <Image
                  src={image}
                  alt=""
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 100vw, 400px"
                  className="object-cover"
                />
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