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
    <div className="space-y-4">
      <div>
        <label className="text-sm font-semibold text-[#314559]">{label}</label>
        {helperText ? <p className="mt-1 text-xs text-[#6f8295]">{helperText}</p> : null}
      </div>

      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={async (event) => {
          event.preventDefault();
          await handleFiles(event.dataTransfer.files);
        }}
        className="rounded-[24px] border border-dashed border-[#c9dbe8] bg-[#f8fbfe] p-5 text-center"
      >
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white text-[#1f4e79] shadow-sm">
          <Icon name="gallery" className="h-7 w-7" />
        </div>
        <p className="mt-4 text-sm font-semibold text-[#17324d]">
          Drag and drop travel images here
        </p>
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

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="Or paste an image URL"
          className="flex-1 rounded-2xl border border-[#d5e1eb] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#4fa3d1]"
        />
        <button
          type="button"
          onClick={() => {
            if (!url.trim()) return;
            pushImages([url.trim()]);
            setUrl("");
          }}
          className="rounded-2xl border border-[#d5e1eb] bg-white px-4 py-3 text-sm font-semibold text-[#1f4e79] transition hover:border-[#4fa3d1]"
        >
          Add URL
        </button>
      </div>

      {list.length ? (
        <div className={`grid gap-3 ${multiple ? "sm:grid-cols-2 xl:grid-cols-3" : ""}`}>
          {list.map((image) => (
            <div
              key={image}
              className="group relative overflow-hidden rounded-[24px] border border-white/70 bg-white p-2 shadow-[0_20px_40px_-28px_rgba(31,78,121,0.55)]"
            >
              <Image
                src={image}
                alt=""
                width={640}
                height={352}
                unoptimized
                className="h-44 w-full rounded-[18px] object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(image)}
                className="absolute right-4 top-4 rounded-full bg-[#06111b]/65 p-2 text-white opacity-0 transition group-hover:opacity-100"
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
