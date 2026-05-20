import Link from 'next/link';
import TeamSection from '@/components/about/TeamSection';
import { travelIconClassForEmoji } from '@/lib/travelIconAnimations';

export const metadata = {
  title: 'About Us - Happy Feet Travellers',
  description:
    'Happy Feet Travellers is a Pune-based small-group travel company running fixed-date departures and customised trips across India.',
};

const VALUES = [
  {
    icon: '🤝',
    title: 'Straightforward pricing',
    desc: 'A clear inclusions list and a single price. No surprise add-ons on Day 1 of the trip.',
  },
  {
    icon: '🌿',
    title: 'Local first',
    desc: 'We work with homestays, drivers and guides from the region — money stays where the trip happens.',
  },
  {
    icon: '🧭',
    title: 'Small groups',
    desc: 'Capped batch sizes so the pace stays relaxed and you actually get to know your trip captain.',
  },
  {
    icon: '📞',
    title: 'Reachable, always',
    desc: 'Real humans on WhatsApp before, during and after the trip — not a ticket-bot.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0f1c2e] via-primary to-[#3d6a8a] py-14 text-white">
        <div className="container mx-auto px-4">
          <p className="section-eyebrow mb-3 text-white/80">About us</p>
          <h1 className="font-display mb-3 text-4xl font-bold text-white md:text-5xl">Our story</h1>
          <p className="max-w-2xl text-lg text-white/85">
            We started with a simple idea: organise the kind of trips we&apos;d want to take with friends—clear costs,
            small groups, and someone reliable to call when things change.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Mission & vision */}
        <div className="mb-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-[#dceaf7] bg-white p-8 shadow-sm">
            <h2 className="mb-3 text-xl font-bold text-primary">Mission</h2>
            <p className="text-foreground/85 leading-relaxed">
              Make group travel from Pune predictable: honest pricing, vetted stays, and support you can reach on WhatsApp
              before and during the trip.
            </p>
          </div>
          <div className="rounded-2xl border border-[#dceaf7] bg-white p-8 shadow-sm">
            <h2 className="mb-3 text-xl font-bold text-primary">Vision</h2>
            <p className="text-foreground/85 leading-relaxed">
              Become the first name families and solo travellers think of when they want affordable, well-run departures
              and personalized holidays—without the stress of planning alone.
            </p>
          </div>
        </div>

        {/* Story */}
        <div className="mb-12 rounded-2xl border border-[#eaf4fb] bg-white p-8 shadow-md">
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
            <div>
              <h2 className="mb-4 text-3xl font-bold text-primary">How we work</h2>
              <p className="mb-4 leading-relaxed text-foreground/85">
                We design fixed-date group departures from Pune to popular Indian destinations—Sikkim, Kashmir, Himachal,
                Goa, Kerala, Rajasthan and the Northeast—and also build customised trips for couples, families and
                corporate offsites.
              </p>
              <p className="leading-relaxed text-foreground/85">
                Every itinerary is run by people who have actually travelled the route. Hotels, drivers and meal stops are
                reviewed by us before they make it into a brochure. If something&apos;s not great, it doesn&apos;t get listed.
              </p>
            </div>
            <div className="relative h-72 overflow-hidden rounded-2xl border border-[#dceaf7] bg-section-alt">
              <img
                src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80"
                alt="Group trip in the Indian Himalayas"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">What we care about</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((value) => (
              <div
                key={value.title}
                className="bg-white rounded-2xl border border-[#eaf4fb] shadow-sm p-6 text-center hover:shadow-md transition"
              >
                <div className={`mb-4 inline-block text-4xl ${travelIconClassForEmoji(value.icon)}`}>{value.icon}</div>
                <h3 className="text-lg font-bold text-primary mb-2">{value.title}</h3>
                <p className="text-foreground/80 text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <TeamSection />

        {/* Numbers (per brand brief) */}
        <div className="mb-12">
          <h2 className="mb-8 text-center text-3xl font-bold text-primary">By the numbers</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-[#eaf4fb] bg-white p-6 text-center shadow-sm">
              <div className="mb-2 text-3xl font-bold text-primary">4+ yrs</div>
              <div className="text-sm text-foreground/75">Industry experience</div>
            </div>
            <div className="rounded-2xl border border-[#eaf4fb] bg-white p-6 text-center shadow-sm">
              <div className="mb-2 text-3xl font-bold text-primary">200+</div>
              <div className="text-sm text-foreground/75">Trips curated</div>
            </div>
            <div className="rounded-2xl border border-[#eaf4fb] bg-white p-6 text-center shadow-sm">
              <div className="mb-2 text-3xl font-bold text-primary">2,000+</div>
              <div className="text-sm text-foreground/75">Travellers travelled</div>
            </div>
            <div className="rounded-2xl border border-[#eaf4fb] bg-white p-6 text-center shadow-sm">
              <div className="mb-2 text-3xl font-bold text-primary">4.8★</div>
              <div className="text-sm text-foreground/75">Average rating</div>
            </div>
          </div>
        </div>

        {/* Reviews teaser */}
        <div className="mb-12 rounded-2xl border border-[#dceaf7] bg-section-alt/60 p-8 text-center">
          <h2 className="mb-3 text-2xl font-bold text-primary">What people say</h2>
          <p className="mx-auto mb-6 max-w-2xl text-foreground/80">
            Google reviews and guest stories power most of our bookings. Read a few on the homepage—or message us and we&apos;ll
            share references for your route.
          </p>
          <Link
            href="/#testimonials"
            className="inline-flex rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            See testimonials on home
          </Link>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-primary via-[#235a8a] to-secondary text-white rounded-2xl p-8 text-center shadow-lg">
          <h2 className="text-3xl font-bold mb-3">Planning your next trip?</h2>
          <p className="text-white/85 mb-6 max-w-2xl mx-auto">
            Tell us where you want to go and when. We&apos;ll suggest a fixed departure or build something custom.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/upcoming-departures"
              className="bg-cta text-primary px-8 py-3 rounded-full hover:bg-[#E76F51] hover:text-white transition font-bold"
            >
              See upcoming departures
            </Link>
            <Link
              href="/contact"
              className="bg-white/15 border border-white/40 backdrop-blur-md text-white px-8 py-3 rounded-full hover:bg-white/25 transition font-bold"
            >
              Talk to us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
