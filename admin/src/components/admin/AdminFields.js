"use client";

import { useState } from "react";
import { Icon } from "@/components/admin/AdminIcons";

export function Field({ label, hint, children }) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-[#314559]">{label}</span>
        {hint ? <span className="text-xs text-[#6f8295]">{hint}</span> : null}
      </div>
      {children}
    </label>
  );
}

export function TextInput(props) {
  return (
    <input
      {...props}
      className={`w-full rounded-2xl border border-[#d5e1eb] bg-white px-4 py-3 text-sm text-[#33475b] outline-none transition focus:border-[#4fa3d1] ${
        props.className || ""
      }`}
    />
  );
}

export function TextArea(props) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-2xl border border-[#d5e1eb] bg-white px-4 py-3 text-sm leading-6 text-[#33475b] outline-none transition focus:border-[#4fa3d1] ${
        props.className || ""
      }`}
    />
  );
}

export function SelectInput(props) {
  return (
    <select
      {...props}
      className={`w-full rounded-2xl border border-[#d5e1eb] bg-white px-4 py-3 text-sm text-[#33475b] outline-none transition focus:border-[#4fa3d1] ${
        props.className || ""
      }`}
    />
  );
}

export function CardSection({ title, description, children, actions }) {
  return (
    <section className="rounded-[30px] border border-white/70 bg-white/90 p-5 shadow-[0_24px_48px_-32px_rgba(31,78,121,0.45)] backdrop-blur-xl md:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-xl font-bold text-[#17324d]">{title}</h3>
          {description ? <p className="mt-1 text-sm text-[#66788b]">{description}</p> : null}
        </div>
        {actions ? <div>{actions}</div> : null}
      </div>
      {children}
    </section>
  );
}

export function AccordionSection({ title, description, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-[24px] border border-[#e7eef4] bg-[#fbfdff]">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <div>
          <div className="text-base font-semibold text-[#17324d]">{title}</div>
          {description ? <div className="mt-1 text-sm text-[#6c8094]">{description}</div> : null}
        </div>
        <span
          className={`rounded-full border border-[#d3e2ee] p-2 text-[#1f4e79] transition ${
            open ? "rotate-180" : ""
          }`}
        >
          <Icon name="chevronDown" className="h-4 w-4" />
        </span>
      </button>
      {open ? <div className="border-t border-[#e7eef4] px-5 py-5">{children}</div> : null}
    </div>
  );
}

export function PillButton({ active, children, ...props }) {
  return (
    <button
      {...props}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
        active ? "bg-[#1f4e79] text-white shadow-sm" : "bg-white text-[#1f4e79] hover:bg-[#edf6fd]"
      } ${props.className || ""}`}
    >
      {children}
    </button>
  );
}
