import RannSectionHeading from '@/components/rann/RannSectionHeading';

/**
 * @param {{ addons?: Array<{ title: string; description: string; duration?: string; fromPrice?: string; icon?: string }> }} props
 */
export default function RannAddOnsSection({ addons = [] }) {
  if (!addons.length) return null;

  return (
    <section id="add-ons" className="section-tone-sand-soft scroll-mt-24 py-12 md:py-16">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <RannSectionHeading
          eyebrow="Extend your journey"
          title="Add-On Experiences"
          lede="Stack spiritual circuits, heritage deep-dives, or premium tent city nights onto your core Rann itinerary."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {addons.map((item) => (
            <article
              key={item.title}
              className="flex h-full flex-col rounded-2xl border border-[#e5d4bc] bg-white p-5 shadow-sm"
            >
              {item.icon ? (
                <span className="text-2xl" aria-hidden>
                  {item.icon}
                </span>
              ) : null}
              <h3 className="mt-2 font-display text-lg font-bold text-primary">{item.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-foreground/75">{item.description}</p>
              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#efe6d8] pt-3 text-xs font-semibold">
                {item.duration ? <span className="text-foreground/65">{item.duration}</span> : null}
                {item.fromPrice ? <span className="text-cta">{item.fromPrice}</span> : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
