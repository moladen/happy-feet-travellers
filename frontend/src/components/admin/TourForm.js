"use client";

import { useMemo, useState } from "react";
import {
  generateSlug,
  tourCategoryOptions,
  packageCategoryOptions,
  validateTourForAdminSite,
  prepareTourPayloadForAdmin,
} from "@/lib/admin-data";
import { Icon } from "@/components/admin/AdminIcons";
import ImageUploader from "@/components/admin/ImageUploader";
import {
  AccordionSection,
  CardSection,
  Field,
  PillButton,
  SelectInput,
  TextArea,
  TextInput,
} from "@/components/admin/AdminFields";

const steps = [
  { key: "basics", label: "Basics" },
  { key: "schedule", label: "Dates & pricing" },
  { key: "media", label: "Media" },
  { key: "trip", label: "Trip content" },
  { key: "policies", label: "Policies" },
];

function StepButton({ active, index, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 rounded-full px-4 py-2.5 text-left transition ${
        active ? "bg-[#1f4e79] text-white shadow-sm" : "bg-white text-[#1f4e79] hover:bg-[#edf6fd]"
      }`}
    >
      <span className={`grid h-8 w-8 place-items-center rounded-full text-sm font-bold ${active ? "bg-white/18" : "bg-[#edf6fd]"}`}>
        {index + 1}
      </span>
      <span className="text-sm font-semibold">{label}</span>
    </button>
  );
}

function Repeater({ label, rows, onChange, fields, addLabel }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold text-[#314559]">{label}</div>
        <button
          type="button"
          onClick={() => onChange([...(rows || []), fields.reduce((acc, field) => ({ ...acc, [field.key]: field.defaultValue || "" }), {})])}
          className="rounded-full border border-[#d5e1eb] px-3 py-1.5 text-sm font-semibold text-[#1f4e79] transition hover:border-[#4fa3d1]"
        >
          {addLabel}
        </button>
      </div>
      {(rows || []).map((row, index) => (
        <div key={`${label}-${index}`} className="rounded-[24px] border border-[#e7eef4] bg-white p-4">
          <div className="grid gap-4 md:grid-cols-2">
            {fields.map((field) => (
              <Field key={field.key} label={field.label}>
                {field.multiline ? (
                  <TextArea
                    rows={4}
                    value={row[field.key] || ""}
                    onChange={(event) =>
                      onChange(
                        rows.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, [field.key]: event.target.value } : item
                        )
                      )
                    }
                  />
                ) : (
                  <TextInput
                    value={row[field.key] || ""}
                    onChange={(event) =>
                      onChange(
                        rows.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, [field.key]: event.target.value } : item
                        )
                      )
                    }
                  />
                )}
              </Field>
            ))}
          </div>
          <button
            type="button"
            onClick={() => onChange(rows.filter((_, itemIndex) => itemIndex !== index))}
            className="mt-4 rounded-full border border-[#f2d7d3] px-3 py-1.5 text-sm font-semibold text-[#b45240]"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

export default function TourForm({ form, setForm, onSubmit, busy, mode = "create" }) {
  const [activeStep, setActiveStep] = useState(0);
  const [formError, setFormError] = useState("");
  const progress = useMemo(() => `${activeStep + 1}/${steps.length}`, [activeStep]);

  const updateField = (key, value) => {
    setForm((current) => {
      const next = { ...current, [key]: value };
      if (key === "startingPrice") {
        next.price = value;
      }
      if (key === "title") {
        const currentSlug = current.slug || "";
        const autoSlug = generateSlug(current.title || "");
        if (!currentSlug || currentSlug === autoSlug) {
          next.slug = generateSlug(value);
        }
      }
      return next;
    });
  };

  const submit = async (event) => {
    event.preventDefault();
    setFormError("");
    const validationMessage = validateTourForAdminSite(form);
    if (validationMessage) {
      setFormError(validationMessage);
      const cat = String(form.category || "").toLowerCase();
      setActiveStep(cat === "customized" ? 0 : 1);
      return;
    }
    await onSubmit(prepareTourPayloadForAdmin(form));
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      {formError ? (
        <div className="rounded-[26px] border border-[#f2d4bd] bg-[#fff5eb] px-5 py-4 text-sm text-[#a35a23]">
          {formError}
        </div>
      ) : null}
      {form.category === "upcoming" ? (
        <div className="rounded-[26px] border border-[#cfe6f5] bg-[#f7fbfe] px-5 py-4 text-sm text-[#314559]">
          <strong className="text-[#1f4e79]">Upcoming departure:</strong> Set{" "}
          <span className="font-semibold">Active</span> + a{" "}
          <span className="font-semibold">future start date</span> (Dates &amp; pricing) to show on the
          homepage carousel and Upcoming Departures page.
        </div>
      ) : null}
      {form.category === "customized" ? (
        <div className="rounded-[26px] border border-[#f0e6d8] bg-[#fffaf4] px-5 py-4 text-sm text-[#314559]">
          <strong className="text-[#a35a23]">Personalized tour:</strong> Set{" "}
          <span className="font-semibold">Active</span>, add description + cover image, and pick an{" "}
          <span className="font-semibold">Experience category</span> (Honeymoon, Adventure, etc.) for
          website tags. Appears under Personalized Tours and /customized-trips.
        </div>
      ) : null}
      <CardSection
        title={mode === "edit" ? "Edit tour" : "Add tour"}
        description="Shape the full booking story: dates, pricing, visuals, itinerary, and policies."
        actions={
          <div className="rounded-full bg-[#edf6fd] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#1f4e79]">
            Step {progress}
          </div>
        }
      >
        <div className="flex flex-wrap gap-2">
          {steps.map((step, index) => (
            <StepButton
              key={step.key}
              index={index}
              label={step.label}
              active={activeStep === index}
              onClick={() => setActiveStep(index)}
            />
          ))}
        </div>
      </CardSection>

      {activeStep === 0 ? (
        <CardSection title="Tour basics" description="Set the public listing essentials for the travel website.">
          <div className="grid gap-5 md:grid-cols-2 md:items-end">
            <Field label="Tour title">
              <TextInput
                required
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
                placeholder="Sikkim & Darjeeling Group Trip"
              />
            </Field>
            <Field label="Slug" hint="Auto-generated, still editable">
              <TextInput
                required
                value={form.slug}
                onChange={(event) => updateField("slug", event.target.value)}
                placeholder="sikkim-darjeeling-group-trip"
              />
            </Field>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-3 md:items-end">
            <Field label="Category">
              <SelectInput value={form.category} onChange={(event) => updateField("category", event.target.value)}>
                {tourCategoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Sub category">
              <TextInput
                value={form.subCategory}
                onChange={(event) => updateField("subCategory", event.target.value)}
                placeholder="group / mountains / family"
              />
            </Field>
            <Field label="Departure city">
              <TextInput
                required
                value={form.departureCity}
                onChange={(event) => updateField("departureCity", event.target.value)}
              />
            </Field>
          </div>

          <div className="mt-5">
            <Field label="Description" hint="Keep it persuasive and easy to scan">
              <TextArea
                required
                rows={6}
                value={form.description}
                onChange={(event) => updateField("description", event.target.value)}
                placeholder="Tell travellers what makes this route special..."
              />
            </Field>
          </div>
        </CardSection>
      ) : null}

      {activeStep === 1 ? (
        <CardSection title="Dates, pricing, and departure details" description="Keep the booking summary transparent.">
          <div className="grid gap-5 md:grid-cols-4 md:items-end">
            <Field label="Duration (days)">
              <TextInput
                type="number"
                min="1"
                value={form.duration}
                onChange={(event) => updateField("duration", event.target.value)}
              />
            </Field>
            <Field label="Duration label">
              <TextInput
                value={form.durationLabel}
                onChange={(event) => updateField("durationLabel", event.target.value)}
                placeholder="5N6D"
              />
            </Field>
            <Field label="Starting price (₹)" hint="Commas allowed, e.g. 25,000">
              <TextInput
                inputMode="numeric"
                value={form.startingPrice}
                onChange={(event) => updateField("startingPrice", event.target.value)}
                placeholder="25000"
              />
            </Field>
            <Field label="Urgency tag">
              <TextInput
                value={form.urgency}
                onChange={(event) => updateField("urgency", event.target.value)}
                placeholder="Only 4 seats left"
              />
            </Field>
          </div>

          {form.category === "upcoming" ? (
            <>
              <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                <Field label="Destination" hint="e.g. Sikkim, Kerala">
                  <TextInput
                    value={form.destination}
                    onChange={(event) => updateField("destination", event.target.value)}
                    placeholder="Sikkim & Darjeeling"
                  />
                </Field>
                <Field label="Group size" hint="Shown on homepage cards">
                  <TextInput
                    value={form.groupSize}
                    onChange={(event) => updateField("groupSize", event.target.value)}
                    placeholder="12–18 travellers only"
                  />
                </Field>
                <Field label="Series slug" hint="Recurring trips: same base slug">
                  <TextInput
                    value={form.seriesSlug}
                    onChange={(event) => updateField("seriesSlug", event.target.value)}
                    placeholder="goa-weekend-escape"
                  />
                </Field>
                <Field label="Status" hint="Only Active trips appear on the website">
                  <SelectInput
                    value={form.status}
                    onChange={(event) => updateField("status", event.target.value)}
                    options={[
                      { value: "active", label: "Active (visible on site)" },
                      { value: "draft", label: "Draft (hidden)" },
                      { value: "archived", label: "Archived (hidden)" },
                    ]}
                  />
                </Field>
              </div>
              {form.status === "archived" ? (
                <p className="mt-3 rounded-2xl border border-[#f2d4bd] bg-[#fff5eb] px-4 py-3 text-sm text-[#a35a23]">
                  Archived trips are hidden. If dates are in the future, saving will automatically set this
                  trip to <strong>Active</strong> so it appears on the website.
                </p>
              ) : null}
              <div className="mt-5">
                <Field
                  label="Personality tags"
                  hint="One per line — e.g. Snow Lovers, Best for Couples, Adventure"
                >
                  <TextArea
                    rows={3}
                    value={form.tagsText}
                    onChange={(event) => updateField("tagsText", event.target.value)}
                    placeholder={'Snow Lovers\nBest for Couples'}
                  />
                </Field>
              </div>
              <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm font-semibold text-[#314559]">
                <input
                  type="checkbox"
                  checked={Boolean(form.featured)}
                  onChange={(event) => updateField("featured", event.target.checked)}
                  className="h-4 w-4 rounded border-[#c5d6e4] text-[#1f4e79]"
                />
                Featured on homepage &amp; listings
              </label>
              <div className="mt-5 max-w-xs">
                <Field
                  label="Reserve deposit (₹)"
                  hint="Reserve Seat button & WhatsApp. Leave blank for site default ₹5,000."
                >
                  <TextInput
                    inputMode="numeric"
                    value={form.bookingDeposit}
                    onChange={(event) => updateField("bookingDeposit", event.target.value)}
                    placeholder="5000"
                  />
                </Field>
              </div>
            </>
          ) : null}

          {form.category === "customized" ? (
            <>
              <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                <Field label="State / region" hint="e.g. Kerala, Rajasthan">
                  <TextInput
                    value={form.state}
                    onChange={(event) => updateField("state", event.target.value)}
                    placeholder="Kerala"
                  />
                </Field>
                <Field label="Destination" hint="Shown on cards & filters">
                  <TextInput
                    value={form.destination}
                    onChange={(event) => updateField("destination", event.target.value)}
                    placeholder="Munnar, Alleppey & Kochi"
                  />
                </Field>
                <Field label="Experience category">
                  <SelectInput
                    value={form.packageCategory}
                    onChange={(event) => updateField("packageCategory", event.target.value)}
                    options={packageCategoryOptions}
                  />
                </Field>
                <Field label="Status">
                  <SelectInput
                    value={form.status}
                    onChange={(event) => updateField("status", event.target.value)}
                    options={[
                      { value: "active", label: "Active (live on site)" },
                      { value: "draft", label: "Draft" },
                      { value: "archived", label: "Archived" },
                    ]}
                  />
                </Field>
              </div>
              <div className="mt-5">
                <Field
                  label="Emotional / mood tags"
                  hint="One per line — e.g. Backwaters, Houseboat, Tea estates"
                >
                  <TextArea
                    rows={3}
                    value={form.tagsText}
                    onChange={(event) => updateField("tagsText", event.target.value)}
                    placeholder={'Backwaters\nHouseboat'}
                  />
                </Field>
              </div>
              <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm font-semibold text-[#314559]">
                <input
                  type="checkbox"
                  checked={Boolean(form.featured)}
                  onChange={(event) => updateField("featured", event.target.checked)}
                  className="h-4 w-4 rounded border-[#c5d6e4] text-[#6b43a6]"
                />
                Featured on homepage &amp; listings
              </label>
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <Field label="SEO title" hint="Optional — overrides default on tour page">
                  <TextInput
                    value={form.seoTitle}
                    onChange={(event) => updateField("seoTitle", event.target.value)}
                    placeholder="Kerala Backwater Retreat — Private Trip"
                  />
                </Field>
                <Field label="SEO description">
                  <TextArea
                    rows={2}
                    value={form.seoDescription}
                    onChange={(event) => updateField("seoDescription", event.target.value)}
                    placeholder="Short meta description for search engines"
                  />
                </Field>
              </div>
              <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                <Field label="Primary CTA label">
                  <TextInput
                    value={form.ctaPrimaryLabel}
                    onChange={(event) => updateField("ctaPrimaryLabel", event.target.value)}
                    placeholder="Explore journey"
                  />
                </Field>
                <Field label="Primary CTA link">
                  <TextInput
                    value={form.ctaPrimaryHref}
                    onChange={(event) => updateField("ctaPrimaryHref", event.target.value)}
                    placeholder="/contact"
                  />
                </Field>
                <Field label="CTA headline" hint="Optional card emphasis">
                  <TextInput
                    value={form.ctaHeadline}
                    onChange={(event) => updateField("ctaHeadline", event.target.value)}
                    placeholder="Your dates, your pace"
                  />
                </Field>
              </div>
            </>
          ) : null}

          <div className="mt-5 grid gap-5 md:grid-cols-3 md:items-end">
            <Field
              label="Start date"
              hint={
                form.category === "upcoming"
                  ? "Required for website listing (or use date label below)"
                  : undefined
              }
            >
              <TextInput
                type="date"
                value={form.startDate}
                onChange={(event) => updateField("startDate", event.target.value)}
              />
            </Field>
            <Field label="End date">
              <TextInput
                type="date"
                value={form.endDate}
                onChange={(event) => updateField("endDate", event.target.value)}
              />
            </Field>
            <Field label="Date label">
              <TextInput
                value={form.dateLabel}
                onChange={(event) => updateField("dateLabel", event.target.value)}
                placeholder="15 May - 20 May 2026"
              />
            </Field>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <Field label="Offers">
              <TextInput
                value={form.offers}
                onChange={(event) => updateField("offers", event.target.value)}
                placeholder="Early-bird seats"
              />
            </Field>
            <Field label="Suitable for">
              <TextInput
                value={form.suitableFor}
                onChange={(event) => updateField("suitableFor", event.target.value)}
                placeholder="Families / solo travellers / couples"
              />
            </Field>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <Field label="Meals">
              <TextInput value={form.meals} onChange={(event) => updateField("meals", event.target.value)} />
            </Field>
            <Field label="Stay type">
              <TextInput value={form.stayType} onChange={(event) => updateField("stayType", event.target.value)} />
            </Field>
            <Field label="Transport">
              <TextInput value={form.transport} onChange={(event) => updateField("transport", event.target.value)} />
            </Field>
          </div>
        </CardSection>
      ) : null}

      {activeStep === 2 ? (
        <CardSection title="Media library" description="Upload the hero image and supporting gallery for the tour page.">
          <div className="grid gap-6 xl:grid-cols-2">
            <ImageUploader
              label="Hero image"
              helperText="The main card image used across the tours listing."
              images={form.coverImage}
              onChange={(value) => updateField("coverImage", value)}
            />
            <ImageUploader
              label="Gallery images"
              helperText="Drop multiple photos to support the itinerary page gallery."
              images={form.images}
              onChange={(value) => updateField("images", value)}
              multiple
            />
          </div>
        </CardSection>
      ) : null}

      {activeStep === 3 ? (
        <CardSection title="Trip content blocks" description="This is where the travel business flow becomes clear and bookable.">
          <div className="space-y-4">
            <AccordionSection
              title="Highlights"
              description="One item per line. These appear as fast-scan benefits."
            >
              <Field label="Highlights list">
                <TextArea
                  rows={5}
                  value={form.highlightsText}
                  onChange={(event) => updateField("highlightsText", event.target.value)}
                  placeholder={"Tiger Hill sunrise\nTea estate walk\nTrip captain support"}
                />
              </Field>
            </AccordionSection>

            <AccordionSection title="Day-wise itinerary" description="Give every day a title and practical detail.">
              <Repeater
                label="Itinerary days"
                rows={form.itinerary}
                onChange={(value) => updateField("itinerary", value)}
                addLabel="Add day"
                fields={[
                  { key: "day", label: "Day label" },
                  { key: "title", label: "Title" },
                  { key: "details", label: "Details", multiline: true },
                ]}
              />
            </AccordionSection>

            <AccordionSection title="Inclusions & exclusions" description="Help the traveller trust the pricing.">
              <div className="grid gap-5 lg:grid-cols-2">
                <Field label="Inclusions">
                  <TextArea
                    rows={8}
                    value={form.inclusionsText}
                    onChange={(event) => updateField("inclusionsText", event.target.value)}
                    placeholder={"Hotel stay\nBreakfast and dinner\nPrivate transfers"}
                  />
                </Field>
                <Field label="Exclusions">
                  <TextArea
                    rows={8}
                    value={form.exclusionsText}
                    onChange={(event) => updateField("exclusionsText", event.target.value)}
                    placeholder={"Flights\nLunches\nPersonal expenses"}
                  />
                </Field>
              </div>
            </AccordionSection>

            <AccordionSection title="FAQs" description="Reduce enquiry friction with direct answers.">
              <Repeater
                label="Frequently asked questions"
                rows={form.faqs}
                onChange={(value) => updateField("faqs", value)}
                addLabel="Add FAQ"
                fields={[
                  { key: "question", label: "Question" },
                  { key: "answer", label: "Answer", multiline: true },
                ]}
              />
            </AccordionSection>

            <AccordionSection title="Pickup points & add-ons" description="Useful for group departures.">
              <div className="grid gap-6 xl:grid-cols-2">
                <Repeater
                  label="Pickup points"
                  rows={form.pickupPoints}
                  onChange={(value) => updateField("pickupPoints", value)}
                  addLabel="Add pickup"
                  fields={[
                    { key: "name", label: "Location name" },
                    { key: "detail", label: "Pickup detail" },
                  ]}
                />
                <Repeater
                  label="Supplements"
                  rows={form.supplements}
                  onChange={(value) => updateField("supplements", value)}
                  addLabel="Add supplement"
                  fields={[
                    { key: "name", label: "Add-on name" },
                    { key: "price", label: "Price / fee" },
                    { key: "note", label: "Note", multiline: true },
                  ]}
                />
              </div>
            </AccordionSection>
          </div>
        </CardSection>
      ) : null}

      {activeStep === 4 ? (
        <CardSection title="Policies and trust-building details" description="This content helps close bookings without back-and-forth.">
          <div className="space-y-4">
            <AccordionSection title="Things to carry" description="Useful prep checklist for confirmed travellers.">
              <Field label="Checklist">
                <TextArea
                  rows={6}
                  value={form.thingsToCarryText}
                  onChange={(event) => updateField("thingsToCarryText", event.target.value)}
                  placeholder={"Government ID\nComfortable shoes\nWarm jacket"}
                />
              </Field>
            </AccordionSection>

            <AccordionSection title="Terms & conditions" description="Add one condition per line to keep it structured.">
              <Field label="Terms">
                <TextArea
                  rows={6}
                  value={form.termsText}
                  onChange={(event) => updateField("termsText", event.target.value)}
                  placeholder={"Slot confirmed after advance payment\nSchedule may shift due to weather"}
                />
              </Field>
            </AccordionSection>

            <AccordionSection title="Cancellation policy" description="Set clear expectations for refunds and transfers.">
              <Field label="Policy">
                <TextArea
                  rows={8}
                  value={form.cancellationPolicy}
                  onChange={(event) => updateField("cancellationPolicy", event.target.value)}
                  placeholder="45+ days: 90% refund..."
                />
              </Field>
            </AccordionSection>

            <AccordionSection title="Payment / bank details" description="Optional but useful when your enquiry converts.">
              <Field label="Payment details">
                <TextArea
                  rows={6}
                  value={form.bankDetails}
                  onChange={(event) => updateField("bankDetails", event.target.value)}
                  placeholder="Account name, bank, UPI, and payment instructions"
                />
              </Field>
            </AccordionSection>
          </div>
        </CardSection>
      ) : null}

      <div className="sticky bottom-4 z-20 flex flex-col gap-3 rounded-[28px] border border-white/70 bg-white/92 p-4 shadow-[0_28px_60px_-30px_rgba(11,24,38,0.45)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#17324d]">Ready to save this tour?</p>
          <p className="mt-1 text-sm text-[#6c8094]">
            Double-check dates, pricing, media, and itinerary before publishing.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <PillButton
            type="button"
            active={false}
            onClick={() => setActiveStep((step) => Math.max(step - 1, 0))}
          >
            Previous step
          </PillButton>
          <PillButton
            type="button"
            active={false}
            onClick={() => setActiveStep((step) => Math.min(step + 1, steps.length - 1))}
          >
            Next step
          </PillButton>
          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-full bg-[#f4a261] px-5 py-3 text-sm font-semibold text-[#17324d] shadow-[0_18px_36px_-24px_rgba(244,162,97,0.9)] transition hover:bg-[#ef9551] disabled:opacity-60"
          >
            <Icon name="plus" className="h-4 w-4" />
            {busy ? "Saving..." : mode === "edit" ? "Update tour" : "Save tour"}
          </button>
        </div>
      </div>
    </form>
  );
}
