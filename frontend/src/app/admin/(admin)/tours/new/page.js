"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PageTransition from "@/components/admin/PageTransition";
import TourForm from "@/components/admin/TourForm";
import { CardSection } from "@/components/admin/AdminFields";
import { emptyTourForm } from "@/lib/admin-data";
import { createTour, createUpcomingDeparture, createPersonalizedTrip } from "@/services/adminService";

const TYPE_LABELS = {
  upcoming: {
    title: "New upcoming departure",
    description: "Fixed-date group trip — appears on Upcoming Departures and the homepage carousel.",
  },
  customized: {
    title: "New personalized tour",
    description: "Customized journey template — appears on Personalized Tours and /customized-trips.",
  },
};

export default function NewTourPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ ...emptyTourForm });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const tourType = (() => {
    const type = String(searchParams.get("type") || searchParams.get("category") || "").toLowerCase();
    if (type === "upcoming" || type === "departure") return "upcoming";
    if (type === "customized" || type === "personalized") return "customized";
    return String(form.category || "upcoming").toLowerCase();
  })();

  const typeCopy = TYPE_LABELS[tourType] || TYPE_LABELS.upcoming;

  useEffect(() => {
    const type = String(searchParams.get("type") || searchParams.get("category") || "").toLowerCase();
    if (type === "upcoming" || type === "departure") {
      setForm((current) => ({ ...current, category: "upcoming" }));
    } else if (type === "customized" || type === "personalized") {
      setForm((current) => ({ ...current, category: "customized" }));
    }
  }, [searchParams]);

  return (
    <PageTransition className="space-y-5">
      <CardSection title={typeCopy.title} description={typeCopy.description} />
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
          const cat = String(payload.category || "").toLowerCase();
          const result =
            cat === "upcoming"
              ? await createUpcomingDeparture(payload)
              : cat === "customized"
                ? await createPersonalizedTrip(payload)
                : await createTour(payload);
          setBusy(false);
          if (!result.success) {
            const details = Array.isArray(result.details)
              ? result.details.join(" ")
              : typeof result.details === "string"
                ? result.details
                : "";
            setMessage([result.message, details].filter(Boolean).join(" — "));
            return;
          }
          router.push(cat === "upcoming" ? "/admin/departures" : "/admin/tours");
        }}
      />
    </PageTransition>
  );
}
