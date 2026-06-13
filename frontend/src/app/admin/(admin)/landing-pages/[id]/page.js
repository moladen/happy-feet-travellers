"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import LandingPageForm from "@/components/admin/LandingPageForm";
import PageTransition from "@/components/admin/PageTransition";
import { createLandingForm } from "@/lib/admin-data";
import { getLandingPage, updateLandingPage } from "@/services/adminService";

export default function EditLandingPage() {
  const params = useParams();
  const router = useRouter();
  const [form, setForm] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      const result = await getLandingPage(params.id);
      if (!result.success) {
        setMessage(result.message);
        return;
      }
      setForm(createLandingForm(result.data));
    };

    load();
  }, [params.id]);

  if (!form) {
    return (
      <PageTransition>
        <div
          className={`rounded-[28px] border px-6 py-10 text-sm shadow-[0_24px_48px_-34px_rgba(31,78,121,0.45)] ${
            message
              ? "border-[#f2d4bd] bg-[#fff5eb] text-[#a35a23]"
              : "border-white/70 bg-white/88 text-[#607386]"
          }`}
        >
          {message || "Loading landing page…"}
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="space-y-5">
      {message ? (
        <div
          className={`rounded-[26px] border px-5 py-4 text-sm ${
            message.toLowerCase().includes("update") || message.toLowerCase().includes("success")
              ? "border-[#d9e9d5] bg-[#f3fbf1] text-[#28623b]"
              : "border-[#f2d4bd] bg-[#fff5eb] text-[#a35a23]"
          }`}
        >
          {message}
        </div>
      ) : null}
      <LandingPageForm
        form={form}
        setForm={setForm}
        busy={busy}
        mode="edit"
        onSubmit={async (payload) => {
          setBusy(true);
          const result = await updateLandingPage(params.id, payload);
          setBusy(false);
          setMessage(result.message);
          if (result.success) {
            setForm(createLandingForm(result.data));
            router.push("/admin/landing-pages");
          }
        }}
      />
    </PageTransition>
  );
}
