import Link from 'next/link';
import { ABOUT_META } from '@/lib/aboutContent';

export default function AboutPageView({ content }) {
  return (
    <div className="page-shell">
      <div className="page-hero-brand py-10 md:py-14">
        <div className="container mx-auto px-4 md:px-6">
          <p className="section-eyebrow mb-3 text-white/80">About Happy Feet Travellers</p>
          <h1 className="font-display mb-3 max-w-4xl text-4xl font-bold text-white md:text-5xl">
            {content.heroTitle}
          </h1>
          <div className="max-w-3xl space-y-4 text-lg leading-relaxed text-white/88">
            {content.introParagraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>

      <div className="section-tone-cream py-10 md:py-14">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-[#dceaf7] bg-white p-8 shadow-sm">
              <h2 className="mb-3 text-xl font-bold text-primary">Our Mission:</h2>
              <p className="leading-relaxed text-foreground/85">{content.mission}</p>
            </div>
            <div className="rounded-2xl border border-[#dceaf7] bg-white p-8 shadow-sm">
              <h2 className="mb-3 text-xl font-bold text-primary">Our Vision:</h2>
              <p className="leading-relaxed text-foreground/85">{content.vision}</p>
            </div>
          </div>

          <div className="mb-12 rounded-2xl border border-[#eaf4fb] bg-white p-8 shadow-md">
            <h2 className="mb-8 text-2xl font-bold text-primary md:text-3xl">What we do:</h2>
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
              <div className="space-y-8">
                <div>
                  <h3 className="mb-3 text-xl font-bold text-primary">Group departures:</h3>
                  <p className="leading-relaxed text-foreground/85">{content.whatWeDo.groupDepartures}</p>
                </div>
                <div>
                  <h3 className="mb-3 text-xl font-bold text-primary">Customized holidays:</h3>
                  <p className="leading-relaxed text-foreground/85">{content.whatWeDo.customizedHolidays}</p>
                </div>
              </div>
              <div className="relative h-80 overflow-hidden rounded-2xl border border-[#dceaf7] bg-section-alt lg:h-full lg:min-h-[360px]">
                <img
                  src={content.storyImage.src}
                  alt={content.storyImage.alt}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="mb-12 rounded-2xl border border-[#dceaf7] bg-white p-8 shadow-sm md:p-10">
            <h2 className="mb-6 text-center text-3xl font-bold text-primary">Our Services include:</h2>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {content.services.map((service) => (
                <li
                  key={service}
                  className="flex items-start gap-3 rounded-xl border border-[#eaf4fb] bg-section-alt/40 px-4 py-3 text-sm leading-relaxed text-foreground/85"
                >
                  <span className="mt-0.5 shrink-0 font-bold text-secondary" aria-hidden>
                    ✓
                  </span>
                  {service}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-12">
            <h2 className="mb-8 text-center text-3xl font-bold text-primary">How we work:</h2>
            <div className="grid gap-5 md:grid-cols-2">
              {content.howWeWork.map((step) => (
                <article
                  key={step.title}
                  className="rounded-2xl border border-[#eaf4fb] bg-white p-6 shadow-sm"
                >
                  <h3 className="mb-2 text-lg font-bold text-primary">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-foreground/85">{step.text}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="mb-12">
            <h2 className="mb-8 text-center text-3xl font-bold text-primary">What we care about:</h2>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {content.values.map((value) => (
                <article
                  key={value.title}
                  className="rounded-2xl border border-[#eaf4fb] bg-white p-6 shadow-sm"
                >
                  <h3 className="mb-2 text-lg font-bold text-primary">{value.title}</h3>
                  <p className="text-sm leading-relaxed text-foreground/80">{value.text}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="mb-12">
            <h2 className="mb-8 text-center text-3xl font-bold text-primary">By The Numbers</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {content.stats.map((stat) => (
                <div
                  key={`${stat.icon}-${stat.value}`}
                  className="rounded-2xl border border-[#eaf4fb] bg-white p-6 text-center shadow-sm"
                >
                  <div className="mb-2 text-3xl" aria-hidden>
                    {stat.icon}
                  </div>
                  <div className="text-base font-bold text-primary md:text-lg">{stat.value}</div>
                  {stat.label ? (
                    <div className="mt-1 text-sm text-foreground/75">{stat.label}</div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-12 rounded-2xl border border-[#dceaf7] bg-section-alt/60 p-8 md:p-10">
            <h2 className="mb-6 text-center text-2xl font-bold text-primary md:text-3xl">What People Say</h2>
            <ul className="mx-auto grid max-w-4xl gap-4 md:grid-cols-2">
              {content.testimonials.map((quote) => (
                <li
                  key={quote}
                  className="rounded-2xl border border-[#eaf4fb] bg-white px-5 py-4 text-sm italic leading-relaxed text-foreground/85 shadow-sm"
                >
                  &ldquo;{quote}&rdquo;
                </li>
              ))}
            </ul>
            <div className="mt-8 text-center">
              <Link
                href="/#testimonials"
                className="inline-flex rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                See testimonials on home
              </Link>
            </div>
          </div>

          <div className="mb-12 rounded-2xl border border-[#dceaf7] bg-gradient-to-br from-[#f4f9fd] via-white to-[#fff8f1] p-8 md:p-10">
            <h2 className="mb-6 text-center text-3xl font-bold text-primary">Why Choose Happy Feet Travellers?</h2>
            <ul className="mx-auto grid max-w-3xl gap-3 sm:grid-cols-2">
              {content.whyChoose.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-[#eaf4fb] bg-white px-4 py-3 text-sm font-medium text-foreground/85"
                >
                  <span className="shrink-0 font-bold text-secondary" aria-hidden>
                    ✔
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-gradient-to-r from-primary via-[#235a8a] to-secondary p-8 text-center text-white shadow-lg md:p-10">
            <h2 className="mb-3 text-3xl font-bold">{content.cta.title}</h2>
            <p className="mx-auto mb-4 max-w-3xl text-white/88">{content.cta.text}</p>
            <p className="mb-6 text-lg font-semibold text-white/95">{content.cta.tagline}</p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/upcoming-departures"
                className="rounded-full bg-cta px-8 py-3 font-bold text-primary transition hover:bg-[#E76F51] hover:text-white"
              >
                See upcoming departures
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-white/40 bg-white/15 px-8 py-3 font-bold text-white backdrop-blur-md transition hover:bg-white/25"
              >
                Talk to us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { ABOUT_META };
