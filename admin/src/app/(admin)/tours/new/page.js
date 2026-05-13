"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageTransition from "@/components/admin/PageTransition";
import TourForm from "@/components/admin/TourForm";
import { emptyTourForm } from "@/lib/admin-data";
import { createTour } from "@/services/adminService";

export default function NewTourPage() {
  const router = useRouter();
  const [form, setForm] = useState({ ...emptyTourForm });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <PageTransition className="space-y-5">
      {message ? (
        <div className="rounded-[26px] border border-[#d9e9d5] bg-[#f3fbf1] px-5 py-4 text-sm text-[#28623b]">
          {message}
        </div>
      ) : null}
      <TourForm
        form={form}
        setForm={setForm}
        busy={busy}
        onSubmit={async (payload) => {
          setBusy(true);
          const result = await createTour(payload);
          setBusy(false);
          if (!result.success) {
            setMessage(result.message);
            return;
          }
          router.push("..");
        }}
      />
    </PageTransition>
  );
}
