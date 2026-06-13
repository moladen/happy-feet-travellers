"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LandingPageForm from "@/components/admin/LandingPageForm";
import PageTransition from "@/components/admin/PageTransition";
import { emptyLandingForm } from "@/lib/admin-data";
import { createLandingPage } from "@/services/adminService";

export default function NewLandingPage() {
  const router = useRouter();
  const [form, setForm] = useState({ ...emptyLandingForm });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <PageTransition className="space-y-5">
      {message ? (
        <div className="rounded-[26px] border border-[#f2d4bd] bg-[#fff5eb] px-5 py-4 text-sm text-[#a35a23]">
          {message}
        </div>
      ) : null}
      <LandingPageForm
        form={form}
        setForm={setForm}
        busy={busy}
        mode="create"
        onSubmit={async (payload) => {
          setBusy(true);
          const result = await createLandingPage(payload);
          setBusy(false);
          if (!result.success) {
            setMessage(result.message);
            return;
          }
          router.push(`/admin/landing-pages/${result.data?.id || ""}`);
        }}
      />
    </PageTransition>
  );
}
