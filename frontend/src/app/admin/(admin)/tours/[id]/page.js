"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PageTransition from "@/components/admin/PageTransition";
import TourForm from "@/components/admin/TourForm";
import { createTourForm } from "@/lib/admin-data";
import {
  getTour,
  updateTour,
  updateUpcomingDeparture,
  updatePersonalizedTrip,
} from "@/services/adminService";

export default function EditTourPage() {
  const params = useParams();
  const router = useRouter();
  const [form, setForm] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      const result = await getTour(params.id);
      if (!result.success) {
        setMessage(result.message);
        return;
      }
      setForm(createTourForm(result.data));
    };

    load();
  }, [params.id]);

  if (!form) {
    return (
      <PageTransition>
        <div className="rounded-[28px] border border-white/70 bg-white/88 px-6 py-10 text-sm text-[#607386] shadow-[0_24px_48px_-34px_rgba(31,78,121,0.45)]">
          {message || "Loading tour details..."}
        </div>
      </PageTransition>
    );
  }

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
        mode="edit"
        onSubmit={async (payload) => {
          setBusy(true);
          const cat = String(payload.category || form.category || "").toLowerCase();
          const result =
            cat === "upcoming"
              ? await updateUpcomingDeparture(params.id, payload)
              : cat === "customized"
                ? await updatePersonalizedTrip(params.id, payload)
                : await updateTour(params.id, payload);
          setBusy(false);
          const details = Array.isArray(result.details)
            ? result.details.join(" ")
            : typeof result.details === "string"
              ? result.details
              : "";
          setMessage(
            result.success
              ? "Saved successfully."
              : [result.message, details].filter(Boolean).join(" — ")
          );
          if (result.success) {
            router.push(cat === "upcoming" ? "/admin/departures" : "/admin/tours");
          }
        }}
      />
    </PageTransition>
  );
}
