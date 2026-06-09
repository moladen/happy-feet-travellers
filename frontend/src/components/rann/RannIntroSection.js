import RannSectionHeading from '@/components/rann/RannSectionHeading';

/**
 * @param {{ intro?: { title?: string; paragraphs?: string[]; summary?: string[] } }} props
 */
export default function RannIntroSection({ intro }) {
  if (!intro?.paragraphs?.length) return null;

  return (
    <section className="section-tone-cream py-12 md:py-16">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <RannSectionHeading eyebrow="Rann Utsav" title={intro.title || 'Introduction to Rann Utsav'} />
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          {intro.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className="text-sm leading-relaxed text-foreground/80 md:text-base">
              {paragraph}
            </p>
          ))}
        </div>
        {intro.summary?.length ? (
          <ul className="mx-auto mt-8 grid max-w-4xl gap-3 sm:grid-cols-2">
            {intro.summary.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 rounded-xl border border-[#e5d4bc] bg-white/80 px-4 py-3 text-sm text-foreground/80"
              >
                <span className="mt-0.5 text-secondary" aria-hidden>
                  ✦
                </span>
                {item}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
