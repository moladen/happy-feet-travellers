import RannSectionHeading from '@/components/rann/RannSectionHeading';

const CATEGORY_LABELS = {
  group: 'Group departure',
  joining: 'Ahmedabad join',
  land: 'Land package',
  premium: 'Premium stay',
  customized: 'Private tour',
};

/**
 * @param {{ bestTime?: { title?: string; season?: string; lede?: string; highlights?: string[]; points?: string[] } }} props
 */
export default function RannBestTimeSection({ bestTime }) {
  if (!bestTime) return null;

  const highlights = bestTime.highlights?.length ? bestTime.highlights : bestTime.points;

  return (
    <section className="section-tone-sand-soft py-12 md:py-16">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <RannSectionHeading
          eyebrow="Planning"
          title={bestTime.title || 'Best Time to Visit'}
          lede={bestTime.lede}
        />
        {bestTime.season ? (
          <p className="mx-auto mb-8 max-w-2xl text-center text-sm font-semibold text-primary md:text-base">
            Official season: {bestTime.season}
          </p>
        ) : null}
        {highlights?.length ? (
          <ul className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
            {highlights.map((item) => (
              <li
                key={item}
                className="rounded-2xl border border-[#e5d4bc] bg-white p-4 text-sm leading-relaxed text-foreground/80 shadow-sm"
              >
                {item}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}

export { CATEGORY_LABELS };
