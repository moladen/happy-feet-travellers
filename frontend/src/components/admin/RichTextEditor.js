"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const TEXT_COLORS = [
  { label: "Default", value: "" },
  { label: "Navy", value: "#1f4e79" },
  { label: "Terracotta", value: "#E76F51" },
  { label: "Green", value: "#15803d" },
  { label: "Charcoal", value: "#33475b" },
];

function ToolbarButton({ onClick, active, title, children }) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className={`grid h-8 min-w-8 place-items-center rounded-lg border px-2 text-sm font-semibold transition ${
        active
          ? "border-[#1f4e79] bg-[#1f4e79] text-white"
          : "border-[#d5e1eb] bg-white text-[#1f4e79] hover:border-[#4fa3d1]"
      }`}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({ value, onChange, placeholder, minHeight = 160 }) {
  const editorRef = useRef(null);
  const savedRangeRef = useRef(null);
  const [activeColor, setActiveColor] = useState("");

  const saveSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    if (editorRef.current?.contains(range.commonAncestorContainer)) {
      savedRangeRef.current = range.cloneRange();
    }
  }, []);

  const restoreSelection = useCallback(() => {
    const range = savedRangeRef.current;
    if (!range) return;
    const selection = window.getSelection();
    if (!selection) return;
    selection.removeAllRanges();
    selection.addRange(range);
  }, []);

  const emitChange = useCallback(() => {
    const html = editorRef.current?.innerHTML || "";
    onChange(html);
  }, [onChange]);

  const runCommand = useCallback(
    (command, arg) => {
      editorRef.current?.focus();
      restoreSelection();
      document.execCommand(command, false, arg ?? null);
      saveSelection();
      emitChange();
    },
    [emitChange, restoreSelection, saveSelection]
  );

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    const next = value || "";
    if (el.innerHTML !== next) {
      el.innerHTML = next;
    }
  }, [value]);

  const applyColor = (color) => {
    setActiveColor(color);
    editorRef.current?.focus();
    restoreSelection();
    document.execCommand("foreColor", false, color || "#33475b");
    saveSelection();
    emitChange();
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d5e1eb] bg-white">
      <div className="flex flex-wrap items-center gap-1.5 border-b border-[#e7eef4] bg-[#f8fbfe] px-3 py-2">
        <ToolbarButton title="Bold" onClick={() => runCommand("bold")}>
          <span className="font-bold">B</span>
        </ToolbarButton>
        <ToolbarButton title="Italic" onClick={() => runCommand("italic")}>
          <span className="italic">I</span>
        </ToolbarButton>
        <span className="mx-1 h-6 w-px bg-[#d5e1eb]" aria-hidden />
        <ToolbarButton title="Heading" onClick={() => runCommand("formatBlock", "h2")}>
          H2
        </ToolbarButton>
        <ToolbarButton title="Sub-heading" onClick={() => runCommand("formatBlock", "h3")}>
          H3
        </ToolbarButton>
        <ToolbarButton title="Normal paragraph" onClick={() => runCommand("formatBlock", "p")}>
          P
        </ToolbarButton>
        <span className="mx-1 h-6 w-px bg-[#d5e1eb]" aria-hidden />
        <label className="flex items-center gap-1.5 text-xs font-semibold text-[#6f8295]">
          Color
          <select
            value={activeColor}
            onChange={(event) => applyColor(event.target.value)}
            className="rounded-lg border border-[#d5e1eb] bg-white px-2 py-1 text-xs font-semibold text-[#1f4e79]"
          >
            {TEXT_COLORS.map((item) => (
              <option key={item.label} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-1.5 text-xs font-semibold text-[#6f8295]">
          Custom
          <input
            type="color"
            defaultValue="#1f4e79"
            onChange={(event) => applyColor(event.target.value)}
            className="h-8 w-10 cursor-pointer rounded border border-[#d5e1eb] bg-white p-0.5"
            title="Pick a custom text color"
          />
        </label>
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        data-placeholder={placeholder}
        onInput={() => {
          saveSelection();
          emitChange();
        }}
        onBlur={saveSelection}
        onKeyUp={saveSelection}
        onMouseUp={saveSelection}
        className="rich-text-editor min-h-[var(--rte-min-height)] px-4 py-3 text-sm leading-relaxed text-[#33475b] outline-none"
        style={{ "--rte-min-height": `${minHeight}px` }}
      />
    </div>
  );
}
