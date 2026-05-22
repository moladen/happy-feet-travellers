import Link from 'next/link';
import CustomizedTripsGrid from '@/components/tour/CustomizedTripsGrid';

export const metadata = {
  title: 'Customized Trips - Happy Feet Travellers',
  description: 'Create your perfect tour package with our customization options',
};

export default function CustomizedTripsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-[#dceaf7] bg-gradient-to-br from-primary via-[#2a6094] to-secondary py-14 text-white md:py-16">
        <div className="container mx-auto px-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">Tailored for you</p>
          <h1 className="text-4xl font-bold text-white md:text-5xl">Customized Trips</h1>
          <p className="mt-3 max-w-2xl text-lg text-white/90">
            Sample packages from our team—flexible dates, pace, and budget. Pick an idea below or tell us what you have in
            mind and we&apos;ll draft a plan from Pune.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="section-eyebrow mb-2">Browse ideas</p>
          <h2 className="section-title text-2xl md:text-3xl">Personalized tour packages</h2>
          <p className="mt-3 text-base leading-relaxed text-foreground/85">
            Each card links to full details. Every itinerary can be adjusted—hotels, transport, and activities included
            in your final quote.
          </p>
        </div>

        <CustomizedTripsGrid />

        <section className="section-ambient section-tone-sand-soft relative mt-14 overflow-hidden rounded-3xl border border-[#dceaf7] px-6 py-10 text-center md:mt-16 md:px-10 md:py-12">
          <div className="relative z-10 mx-auto max-w-2xl">
            <p className="section-eyebrow mb-2">Bespoke itineraries</p>
            <h2 className="section-title mb-3 text-2xl md:text-3xl">Can&apos;t find what you&apos;re looking for?</h2>
            <p className="text-base leading-relaxed text-foreground/85">
              Share your destination, dates, and budget—we&apos;ll build a completely custom plan with clear inclusions
              and WhatsApp support from Pune.
            </p>
            <Link href="/contact" className="btn-travel-primary mt-8 px-8 py-3">
              Start customizing now
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
