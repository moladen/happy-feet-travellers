"use client";

import GuidePdfUploader from "@/components/admin/GuidePdfUploader";
import ImageUploader from "@/components/admin/ImageUploader";
import { CardSection, Field, SelectInput, TextArea, TextInput } from "@/components/admin/AdminFields";
import {
  emptyLandingFaq,
  emptyLandingGallerySlide,
  emptyLandingGroupBatch,
  emptyLandingPackage,
  emptyLandingTestimonial,
  emptyLandingWhyVisit,
  landingFaqCategoryOptions,
  landingGalleryTypeOptions,
} from "@/lib/admin-data";

function SectionRepeater({ label, rows, emptyRow, onChange, addLabel, renderRow }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-[#314559]">{label}</span>
        <button
          type="button"
          onClick={() => onChange([...(rows || []), { ...emptyRow }])}
          className="rounded-full border border-[#d5e1eb] px-3 py-1.5 text-sm font-semibold text-[#1f4e79] transition hover:border-[#4fa3d1]"
        >
          {addLabel}
        </button>
      </div>
      {(rows || []).map((row, index) => (
        <div key={`${label}-${index}`} className="rounded-[24px] border border-[#e7eef4] bg-white p-4">
          {renderRow(row, index)}
          <button
            type="button"
            onClick={() => onChange(rows.filter((_, itemIndex) => itemIndex !== index))}
            className="mt-4 text-sm font-semibold text-[#b14f3d]"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

function updateList(rows, index, patch) {
  return rows.map((row, itemIndex) => (itemIndex === index ? { ...row, ...patch } : row));
}

export function LandingPackagesSection({ packages, setForm }) {
  return (
    <CardSection title="Packages" description="Tour-style cards on the landing page — each links to its own package detail page.">
      <SectionRepeater
        label="Package cards"
        rows={packages}
        emptyRow={emptyLandingPackage}
        addLabel="Add package"
        onChange={(next) => setForm((current) => ({ ...current, _packages: next }))}
        renderRow={(row, index) => (
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Package name">
              <TextInput
                value={row.name}
                onChange={(e) =>
                  setForm((c) => ({
                    ...c,
                    _packages: updateList(c._packages, index, { name: e.target.value }),
                  }))
                }
              />
            </Field>
            <Field label="Slug">
              <TextInput
                value={row.slug}
                onChange={(e) =>
                  setForm((c) => ({
                    ...c,
                    _packages: updateList(c._packages, index, { slug: e.target.value }),
                  }))
                }
              />
            </Field>
            <Field label="Emoji">
              <TextInput
                value={row.emoji}
                onChange={(e) =>
                  setForm((c) => ({
                    ...c,
                    _packages: updateList(c._packages, index, { emoji: e.target.value }),
                  }))
                }
              />
            </Field>
            <Field label="Badge label" hint="e.g. Most Popular">
              <TextInput
                value={row.audienceBadge}
                onChange={(e) =>
                  setForm((c) => ({
                    ...c,
                    _packages: updateList(c._packages, index, { audienceBadge: e.target.value }),
                  }))
                }
              />
            </Field>
            <Field label="Starting price">
              <TextInput
                value={row.startingPrice}
                onChange={(e) =>
                  setForm((c) => ({
                    ...c,
                    _packages: updateList(c._packages, index, { startingPrice: e.target.value }),
                  }))
                }
              />
            </Field>
            <Field label="Duration">
              <TextInput
                value={row.duration}
                onChange={(e) =>
                  setForm((c) => ({
                    ...c,
                    _packages: updateList(c._packages, index, { duration: e.target.value }),
                  }))
                }
              />
            </Field>
            <div className="md:col-span-2">
              <Field label="Short description">
                <TextArea
                  rows={3}
                  value={row.shortDescription}
                  onChange={(e) =>
                    setForm((c) => ({
                      ...c,
                      _packages: updateList(c._packages, index, { shortDescription: e.target.value }),
                    }))
                  }
                />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="Highlights" hint="One per line">
                <TextArea
                  rows={3}
                  value={row.highlightsText}
                  onChange={(e) =>
                    setForm((c) => ({
                      ...c,
                      _packages: updateList(c._packages, index, { highlightsText: e.target.value }),
                    }))
                  }
                />
              </Field>
            </div>
            <div className="md:col-span-2">
              <ImageUploader
                label="Package image"
                images={row.featuredImage}
                onChange={(value) =>
                  setForm((c) => ({
                    ...c,
                    _packages: updateList(c._packages, index, { featuredImage: value }),
                  }))
                }
              />
            </div>
            <Field label="Topic keys" hint="For blog cross-links — e.g. dholavira, white-desert">
              <TextInput
                value={row.topicKeysText}
                onChange={(e) =>
                  setForm((c) => ({
                    ...c,
                    _packages: updateList(c._packages, index, { topicKeysText: e.target.value }),
                  }))
                }
              />
            </Field>
            <Field label="Related blog slugs" hint="Comma-separated blog slugs to show on package page">
              <TextInput
                value={row.relatedBlogSlugsText}
                onChange={(e) =>
                  setForm((c) => ({
                    ...c,
                    _packages: updateList(c._packages, index, { relatedBlogSlugsText: e.target.value }),
                  }))
                }
                placeholder="dholavira-guide, white-desert-tips"
              />
            </Field>
            <label className="flex items-center gap-2 text-sm text-[#314559]">
              <input
                type="checkbox"
                checked={row.active !== false}
                onChange={(e) =>
                  setForm((c) => ({
                    ...c,
                    _packages: updateList(c._packages, index, { active: e.target.checked }),
                  }))
                }
              />
              Show on website
            </label>
          </div>
        )}
      />
    </CardSection>
  );
}

export function LandingGallerySection({ gallerySlides, setForm }) {
  return (
    <CardSection title="Photo gallery" description="Carousel images on the landing page (separate from homepage gallery).">
      <SectionRepeater
        label="Gallery slides"
        rows={gallerySlides}
        emptyRow={emptyLandingGallerySlide}
        addLabel="Add photo"
        onChange={(next) => setForm((current) => ({ ...current, _gallerySlides: next }))}
        renderRow={(row, index) => (
          <div className="space-y-4">
            <ImageUploader
              label="Photo"
              images={row.image}
              onChange={(value) =>
                setForm((c) => ({
                  ...c,
                  _gallerySlides: updateList(c._gallerySlides, index, { image: value }),
                }))
              }
            />
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Caption">
                <TextInput
                  value={row.caption}
                  onChange={(e) =>
                    setForm((c) => ({
                      ...c,
                      _gallerySlides: updateList(c._gallerySlides, index, { caption: e.target.value }),
                    }))
                  }
                />
              </Field>
              <Field label="Type">
                <SelectInput
                  value={row.type || "destination"}
                  onChange={(e) =>
                    setForm((c) => ({
                      ...c,
                      _gallerySlides: updateList(c._gallerySlides, index, { type: e.target.value }),
                    }))
                  }
                >
                  {landingGalleryTypeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </SelectInput>
              </Field>
            </div>
          </div>
        )}
      />
    </CardSection>
  );
}

export function LandingWhyVisitSection({ whyVisit, setForm }) {
  return (
    <CardSection title="Why visit" description="Experience cards with image, title, and description.">
      <SectionRepeater
        label="Why visit cards"
        rows={whyVisit}
        emptyRow={emptyLandingWhyVisit}
        addLabel="Add card"
        onChange={(next) => setForm((current) => ({ ...current, _whyVisit: next }))}
        renderRow={(row, index) => (
          <div className="space-y-4">
            <Field label="Title">
              <TextInput
                value={row.title}
                onChange={(e) =>
                  setForm((c) => ({
                    ...c,
                    _whyVisit: updateList(c._whyVisit, index, { title: e.target.value }),
                  }))
                }
              />
            </Field>
            <Field label="Description">
              <TextArea
                rows={3}
                value={row.description}
                onChange={(e) =>
                  setForm((c) => ({
                    ...c,
                    _whyVisit: updateList(c._whyVisit, index, { description: e.target.value }),
                  }))
                }
              />
            </Field>
            <ImageUploader
              label="Card image"
              images={row.image}
              onChange={(value) =>
                setForm((c) => ({
                  ...c,
                  _whyVisit: updateList(c._whyVisit, index, { image: value }),
                }))
              }
            />
          </div>
        )}
      />
    </CardSection>
  );
}

export function LandingBestTimeSection({ form, updateField }) {
  return (
    <CardSection title="Best time to visit" description="Season window and planning bullets.">
      <div className="space-y-5">
        <Field label="Season dates">
          <TextInput
            value={form.bestTimeSeason}
            onChange={(e) => updateField("bestTimeSeason", e.target.value)}
          />
        </Field>
        <Field label="Planning points" hint="One per line">
          <TextArea
            rows={4}
            value={form.bestTimePointsText}
            onChange={(e) => updateField("bestTimePointsText", e.target.value)}
          />
        </Field>
      </div>
    </CardSection>
  );
}

export function LandingFaqsSection({ faqs, setForm }) {
  return (
    <CardSection title="FAQs" description="Grouped into Travel, Package, and Booking on the live page.">
      <SectionRepeater
        label="Questions"
        rows={faqs}
        emptyRow={emptyLandingFaq}
        addLabel="Add FAQ"
        onChange={(next) => setForm((current) => ({ ...current, _faqs: next }))}
        renderRow={(row, index) => (
          <div className="space-y-4">
            <Field label="Category">
              <SelectInput
                value={row.category || "travel"}
                onChange={(e) =>
                  setForm((c) => ({
                    ...c,
                    _faqs: updateList(c._faqs, index, { category: e.target.value }),
                  }))
                }
              >
                {landingFaqCategoryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Question">
              <TextInput
                value={row.question}
                onChange={(e) =>
                  setForm((c) => ({
                    ...c,
                    _faqs: updateList(c._faqs, index, { question: e.target.value }),
                  }))
                }
              />
            </Field>
            <Field label="Answer">
              <TextArea
                rows={4}
                value={row.answer}
                onChange={(e) =>
                  setForm((c) => ({
                    ...c,
                    _faqs: updateList(c._faqs, index, { answer: e.target.value }),
                  }))
                }
              />
            </Field>
          </div>
        )}
      />
    </CardSection>
  );
}

export function LandingTestimonialsSection({ testimonials, setForm }) {
  return (
    <CardSection
      title="Landing page testimonials"
      description="Reviews shown only on this landing page — separate from homepage Testimonials in admin."
    >
      <SectionRepeater
        label="Landing testimonials"
        rows={testimonials}
        emptyRow={emptyLandingTestimonial}
        addLabel="Add review"
        onChange={(next) => setForm((current) => ({ ...current, _testimonials: next }))}
        renderRow={(row, index) => (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Traveller name">
                <TextInput
                  value={row.name}
                  onChange={(e) =>
                    setForm((c) => ({
                      ...c,
                      _testimonials: updateList(c._testimonials, index, { name: e.target.value }),
                    }))
                  }
                />
              </Field>
              <Field label="City">
                <TextInput
                  value={row.city}
                  onChange={(e) =>
                    setForm((c) => ({
                      ...c,
                      _testimonials: updateList(c._testimonials, index, { city: e.target.value }),
                    }))
                  }
                />
              </Field>
            </div>
            <Field label="Rating">
              <SelectInput
                value={row.rating}
                onChange={(e) =>
                  setForm((c) => ({
                    ...c,
                    _testimonials: updateList(c._testimonials, index, { rating: e.target.value }),
                  }))
                }
              >
                {[5, 4, 3, 2, 1].map((value) => (
                  <option key={value} value={value}>
                    {value} stars
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Review">
              <TextArea
                rows={4}
                value={row.review}
                onChange={(e) =>
                  setForm((c) => ({
                    ...c,
                    _testimonials: updateList(c._testimonials, index, { review: e.target.value }),
                  }))
                }
              />
            </Field>
            <ImageUploader
              label="Photo (optional)"
              images={row.image}
              onChange={(value) =>
                setForm((c) => ({
                  ...c,
                  _testimonials: updateList(c._testimonials, index, { image: value }),
                }))
              }
            />
            <label className="flex items-center gap-2 text-sm text-[#314559]">
              <input
                type="checkbox"
                checked={row.active !== false}
                onChange={(e) =>
                  setForm((c) => ({
                    ...c,
                    _testimonials: updateList(c._testimonials, index, { active: e.target.checked }),
                  }))
                }
              />
              Show on landing page
            </label>
          </div>
        )}
      />
    </CardSection>
  );
}

export function LandingPlanningGuideSection({ form, updateField }) {
  return (
    <CardSection
      title="Planning guide (lead magnet)"
      description="Gated PDF download on the Rann season landing page. Leads are saved in Admin → Enquiries."
    >
      <label className="mb-5 flex items-center gap-3 text-sm text-[#314559]">
        <input
          type="checkbox"
          checked={form.planningGuideEnabled !== false}
          onChange={(e) => updateField("planningGuideEnabled", e.target.checked)}
          className="h-4 w-4 rounded border-[#c9dbe8]"
        />
        Show planning guide section on landing page
      </label>
      <div className="space-y-5">
        <Field label="Eyebrow label">
          <TextInput
            value={form.planningGuideEyebrow}
            onChange={(e) => updateField("planningGuideEyebrow", e.target.value)}
            placeholder="Free download"
          />
        </Field>
        <Field label="Section title">
          <TextInput
            value={form.planningGuideTitle}
            onChange={(e) => updateField("planningGuideTitle", e.target.value)}
            placeholder="Free Rann Utsav Planning Guide 2026–27"
          />
        </Field>
        <Field label="Section description">
          <TextArea
            rows={3}
            value={form.planningGuideLede}
            onChange={(e) => updateField("planningGuideLede", e.target.value)}
          />
        </Field>
        <Field label="Bullet highlights" hint="One per line">
          <TextArea
            rows={4}
            value={form.planningGuideHighlightsText}
            onChange={(e) => updateField("planningGuideHighlightsText", e.target.value)}
          />
        </Field>
        <GuidePdfUploader
          pdfUrl={form.planningGuidePdfUrl}
          fileName={form.planningGuidePdfFileName}
          onUrlChange={(value) => updateField("planningGuidePdfUrl", value)}
          onFileNameChange={(value) => updateField("planningGuidePdfFileName", value)}
        />
        <Field label="Form heading">
          <TextInput
            value={form.planningGuideFormTitle}
            onChange={(e) => updateField("planningGuideFormTitle", e.target.value)}
          />
        </Field>
        <Field label="Form description">
          <TextArea
            rows={2}
            value={form.planningGuideFormLede}
            onChange={(e) => updateField("planningGuideFormLede", e.target.value)}
          />
        </Field>
        <Field label="Submit button label">
          <TextInput
            value={form.planningGuideSubmitLabel}
            onChange={(e) => updateField("planningGuideSubmitLabel", e.target.value)}
            placeholder="Download Free Guide"
          />
        </Field>
        <Field label="Success message (after guest name)">
          <TextArea
            rows={2}
            value={form.planningGuideSuccessLede}
            onChange={(e) => updateField("planningGuideSuccessLede", e.target.value)}
          />
        </Field>
        <Field label="Form disclaimer">
          <TextArea
            rows={2}
            value={form.planningGuideDisclaimer}
            onChange={(e) => updateField("planningGuideDisclaimer", e.target.value)}
          />
        </Field>
      </div>
    </CardSection>
  );
}

export function LandingGroupBatchesSection({ groupBatches, setForm }) {
  return (
    <CardSection
      title="Season calendar batches"
      description="Each row appears on the Batch Calendar. Set Tour slug (or ID) from Admin → Departures so the date opens that tour page. Multiple dates can share the same tour slug."
    >
      <SectionRepeater
        label="Group batches"
        rows={groupBatches}
        emptyRow={emptyLandingGroupBatch}
        addLabel="Add batch"
        onChange={(next) => setForm((current) => ({ ...current, _groupBatches: next }))}
        renderRow={(row, index) => (
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Batch #">
              <TextInput
                value={row.batch}
                onChange={(e) =>
                  setForm((c) => ({
                    ...c,
                    _groupBatches: updateList(c._groupBatches, index, { batch: e.target.value }),
                  }))
                }
              />
            </Field>
            <Field label="Category">
              <SelectInput
                value={row.category || "regular"}
                onChange={(e) =>
                  setForm((c) => ({
                    ...c,
                    _groupBatches: updateList(c._groupBatches, index, { category: e.target.value }),
                  }))
                }
              >
                <option value="special">Special</option>
                <option value="regular">Regular</option>
              </SelectInput>
            </Field>
            <Field label="Batch dates" hint='e.g. 21 – 25 Nov 2026'>
              <TextInput
                value={row.dates}
                onChange={(e) =>
                  setForm((c) => ({
                    ...c,
                    _groupBatches: updateList(c._groupBatches, index, { dates: e.target.value }),
                  }))
                }
              />
            </Field>
            <Field label="Price">
              <TextInput
                value={row.price}
                onChange={(e) =>
                  setForm((c) => ({
                    ...c,
                    _groupBatches: updateList(c._groupBatches, index, { price: e.target.value }),
                  }))
                }
              />
            </Field>
            <Field label="Departure name">
              <TextInput
                value={row.departureName}
                onChange={(e) =>
                  setForm((c) => ({
                    ...c,
                    _groupBatches: updateList(c._groupBatches, index, { departureName: e.target.value }),
                  }))
                }
              />
            </Field>
            <Field label="Badge (optional)">
              <TextInput
                value={row.badge}
                onChange={(e) =>
                  setForm((c) => ({
                    ...c,
                    _groupBatches: updateList(c._groupBatches, index, { badge: e.target.value }),
                  }))
                }
                placeholder="NEW YEAR"
              />
            </Field>
            <Field
              label="Tour slug"
              hint="From Upcoming Departures — opens /tour/{slug}. Same slug on many rows → same tour page."
            >
              <TextInput
                value={row.tourSlug}
                onChange={(e) =>
                  setForm((c) => ({
                    ...c,
                    _groupBatches: updateList(c._groupBatches, index, { tourSlug: e.target.value }),
                  }))
                }
                placeholder="rann-full-moon-nov-2026"
              />
            </Field>
            <Field label="Tour ID (optional)" hint="Use if slug is missing; same ID can be reused on multiple dates.">
              <TextInput
                value={row.tourId}
                onChange={(e) =>
                  setForm((c) => ({
                    ...c,
                    _groupBatches: updateList(c._groupBatches, index, { tourId: e.target.value }),
                  }))
                }
              />
            </Field>
          </div>
        )}
      />
    </CardSection>
  );
}
