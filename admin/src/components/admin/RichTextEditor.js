"use client";

import { useEffect, useRef } from "react";

const tools = [
  { label: "B", action: () => document.execCommand("bold") },
  { label: "I", action: () => document.execCommand("italic") },
  { label: "H2", action: () => document.execCommand("formatBlock", false, "h2") },
  { label: "Quote", action: () => document.execCommand("formatBlock", false, "blockquote") },
  { label: "List", action: () => document.execCommand("insertUnorderedList") },
];

export default function RichTextEditor({ label, value, onChange, helperText }) {
  const editorRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current) return;
    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "<p></p>";
    }
  }, [value]);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <div>
          <label className="text-sm font-semibold text-[#314559]">{label}</label>
          {helperText ? <p className="mt-1 text-xs text-[#6f8295]">{helperText}</p> : null}
        </div>
      </div>
      <div className="overflow-hidden rounded-[24px] border border-[#d5e1eb] bg-white shadow-[0_20px_40px_-30px_rgba(31,78,121,0.4)]">
        <div className="flex flex-wrap gap-2 border-b border-[#edf2f6] bg-[#f7fbfe] px-3 py-3">
          {tools.map((tool) => (
            <button
              key={tool.label}
              type="button"
              onClick={() => {
                editorRef.current?.focus();
                tool.action();
                onChange(editorRef.current?.innerHTML || "<p></p>");
              }}
              className="rounded-xl border border-[#d7e4ed] bg-white px-3 py-1.5 text-sm font-semibold text-[#1f4e79] transition hover:border-[#4fa3d1]"
            >
              {tool.label}
            </button>
          ))}
        </div>
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={(event) => onChange(event.currentTarget.innerHTML)}
          className="prose prose-sm max-w-none min-h-[260px] px-4 py-4 text-sm leading-7 text-[#33475b] outline-none"
        />
      </div>
    </div>
  );
}
