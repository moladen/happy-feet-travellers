"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PageTransition from "@/components/admin/PageTransition";
import { CardSection, Field, TextArea, TextInput } from "@/components/admin/AdminFields";
import ImageUploader from "@/components/admin/ImageUploader";
import { buildSettingsPayload, normaliseSettings } from "@/lib/admin-data";
import {
  DEFAULT_PAYMENT_PAGE_CONTENT,
  paymentContentToForm,
  paymentFormToContent,
} from "@/lib/paymentPageContent";
import { getSettings, updateSettings } from "@/services/adminService";

function emptyPaymentForm() {
  return paymentContentToForm(DEFAULT_PAYMENT_PAGE_CONTENT);
}

export default function PaymentPageEditor() {
  const [rawSettings, setRawSettings] = useState(null);
  const [siteSettings, setSiteSettings] = useState(null);
  const [form, setForm] = useState(emptyPaymentForm());
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const result = await getSettings();
      if (!active) return;
      setLoading(false);
      if (!result.success) {
        setMessage(result.message || "Could not load payment settings.");
        setError(true);
        return;
      }
      setRawSettings(result.data);
      setSiteSettings(normaliseSettings(result.data));
      setForm(paymentContentToForm(result.data?.paymentPageContent));
    })();
    return () => {
      active = false;
    };
  }, []);

  const updateField = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const handleSave = async (event) => {
    event.preventDefault();
    setMessage("");
    setError(false);

    if (!form.upiId.trim() || !form.accountNumber.trim() || !form.ifsc.trim()) {
      setMessage("UPI ID, account number, and IFSC are required.");
      setError(true);
      return;
    }

    if (!siteSettings || !rawSettings) return;

    setBusy(true);
    const payload = buildSettingsPayload({
      ...siteSettings,
      paymentPageContent: paymentFormToContent(form),
      ...(rawSettings.aboutPageContent !== undefined
        ? { aboutPageContent: rawSettings.aboutPageContent }
        : {}),
    });
    const result = await updateSettings(payload);
    setBusy(false);

    if (result.success) {
      setRawSettings(result.data);
      setSiteSettings(normaliseSettings(result.data));
      setForm(paymentContentToForm(result.data?.paymentPageContent));
      setMessage(result.message || "Payment details saved.");
    } else {
      setError(true);
      setMessage(result.message || "Could not save payment details.");
    }
  };

  return (
    <PageTransition className="w-full space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#4f7b9d]">
            Payment page
          </p>
          <h1 className="mt-1 text-2xl font-bold text-[#17324d]">UPI &amp; bank details</h1>
          <p className="mt-2 max-w-2xl text-sm text-[#6c8094]">
            Shown on the public site when visitors click Pay Online — Contact page{" "}
            <Link href="/contact#pay" className="font-semibold text-[#1f4e79] underline-offset-2 hover:underline">
              /contact#pay
            </Link>
            .
          </p>
        </div>
      </div>

      {message ? (
        <div
          className={`rounded-[26px] px-5 py-4 text-sm ${
            error
              ? "border border-[#f2d4bd] bg-[#fff5eb] text-[#a35a23]"
              : "border border-[#d9e9d5] bg-[#f3fbf1] text-[#28623b]"
          }`}
          role="alert"
        >
          {message}
        </div>
      ) : null}

      {loading ? (
        <CardSection title="Loading payment settings" description="">
          <p className="text-sm text-[#6c8094]">Loading…</p>
        </CardSection>
      ) : (
        <form onSubmit={handleSave} className="space-y-5">
          <CardSection
            title="UPI payment"
            description="Upload your ICICI UPI QR code and enter the UPI ID shown below the QR."
          >
            <div className="space-y-5">
              <ImageUploader
                label="UPI QR code image"
                helperText="Square PNG/JPG recommended. Shown on the contact payment section."
                images={form.qrImageUrl}
                onChange={(value) => updateField("qrImageUrl", value)}
              />
              <Field label="UPI ID" hint="e.g. happyfeettravellers@icici">
                <TextInput
                  value={form.upiId}
                  onChange={(event) => updateField("upiId", event.target.value)}
                  placeholder="happyfeettravellers@icici"
                />
              </Field>
              <Field label="UPI scan note" hint="Shown in red below the UPI ID">
                <TextArea
                  rows={2}
                  value={form.upiNote}
                  onChange={(event) => updateField("upiNote", event.target.value)}
                />
              </Field>
            </div>
          </CardSection>

          <CardSection title="Bank transfer (NEFT / IMPS)" description="ICICI account details for direct transfers.">
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Bank name">
                <TextInput
                  value={form.bankName}
                  onChange={(event) => updateField("bankName", event.target.value)}
                />
              </Field>
              <Field label="Account name">
                <TextInput
                  value={form.accountName}
                  onChange={(event) => updateField("accountName", event.target.value)}
                />
              </Field>
              <Field label="Account number">
                <TextInput
                  value={form.accountNumber}
                  onChange={(event) => updateField("accountNumber", event.target.value)}
                />
              </Field>
              <Field label="IFSC">
                <TextInput
                  value={form.ifsc}
                  onChange={(event) => updateField("ifsc", event.target.value)}
                />
              </Field>
              <Field label="Account type">
                <TextInput
                  value={form.accountType}
                  onChange={(event) => updateField("accountType", event.target.value)}
                />
              </Field>
              <Field label="Branch">
                <TextInput
                  value={form.branch}
                  onChange={(event) => updateField("branch", event.target.value)}
                />
              </Field>
            </div>
          </CardSection>

          <CardSection title="Notes for travellers" description="Processing fee and payment confirmation instructions.">
            <div className="space-y-5">
              <Field label="Processing fee note">
                <TextArea
                  rows={2}
                  value={form.processingFeeNote}
                  onChange={(event) => updateField("processingFeeNote", event.target.value)}
                />
              </Field>
              <Field label="Confirmation note" hint="WhatsApp / email instructions after payment">
                <TextArea
                  rows={3}
                  value={form.confirmationNote}
                  onChange={(event) => updateField("confirmationNote", event.target.value)}
                />
              </Field>
            </div>
          </CardSection>

          <div className="sticky bottom-4 z-20 rounded-[28px] border border-white/70 bg-white/92 p-4 shadow-[0_28px_60px_-30px_rgba(11,24,38,0.45)] backdrop-blur-xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[#6c8094]">
                Changes appear on the contact page payment section after save.
              </p>
              <button
                type="submit"
                disabled={busy}
                className="rounded-full bg-[#f4a261] px-5 py-3 text-sm font-semibold text-[#17324d] shadow-[0_18px_36px_-24px_rgba(244,162,97,0.9)] transition hover:bg-[#ef9551] disabled:opacity-60"
              >
                {busy ? "Saving…" : "Save payment details"}
              </button>
            </div>
          </div>
        </form>
      )}
    </PageTransition>
  );
}
