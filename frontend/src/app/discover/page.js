import Link from 'next/link';

export const metadata = {
  title: 'Discover The World - Happy Feet Travellers',
  description:
    'Explore destinations, travel styles, and carefully curated experiences with Happy Feet Travellers across India.',
};

export default function DiscoverPage() {
  return (
    <section className="bg-background py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <p className="section-eyebrow mb-3">Discover the world</p>
          <h1 className="section-title text-4xl md:text-5xl">Where will your happy feet take you next?</h1>
          <p className="mt-6 text-lg leading-relaxed text-foreground/85">
            From Himalayan escapes to coastal getaways — we design curated group departures and private itineraries with
            the same care: trusted operators, clear inclusions, and support before and during every journey.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/upcoming-departures"
              className="rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Upcoming departures
            </Link>
            <Link
              href="/customized-trips"
              className="rounded-full border-2 border-primary bg-white px-8 py-3 text-sm font-semibold text-primary transition hover:bg-section-alt"
            >
              Personalized tours
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
