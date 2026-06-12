import Link from 'next/link';
import CustomizedTripEnquiryForm from '@/components/forms/CustomizedTripEnquiryForm';

export const metadata = {
  title: 'Customized Trip Category - Happy Feet Travellers',
  description: 'Customize your perfect trip',
};

export default async function CustomizedTripCategoryPage({ params }) {
  const { category } = await params;
  const label = decodeURIComponent(String(category)).replace(/-/g, ' ');

  return (
    <div className="page-shell">
      <div className="page-hero-brand py-10 md:py-14">
        <div className="container mx-auto px-4 md:px-6">
          <Link
            href="/customized-trips"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-white/85 transition hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to all customized trips
          </Link>
          <p className="section-eyebrow mb-3 text-white/80">Custom quote</p>
          <h1 className="font-display text-3xl font-bold capitalize text-white md:text-4xl lg:text-5xl">
            Customize your {label} experience
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-white/90">
            Tell us your preferences and we&apos;ll shape the perfect itinerary around your dates and budget.
          </p>
        </div>
      </div>

      <div className="section-tone-cream py-10 md:py-14">
        <div className="container mx-auto px-4 md:px-6 lg:py-2">
        <div className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-[#dceaf7] bg-white p-6 shadow-[0_16px_40px_-12px_rgba(15,28,46,0.12)] md:p-10">
          <p className="section-eyebrow mb-2">Enquiry form</p>
          <h2 className="section-title mb-3 text-2xl md:text-3xl">Customize your trip</h2>
          <p className="mb-8 text-sm leading-relaxed text-foreground/85 md:text-base">
            Share a few details about your {label} trip—we&apos;ll reply on WhatsApp or email with a tailored quote.
          </p>
          <CustomizedTripEnquiryForm categoryLabel={label} />
        </div>
        </div>
      </div>
    </div>
  );
}
