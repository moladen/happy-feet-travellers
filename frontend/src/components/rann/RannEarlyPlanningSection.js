import RannSectionHeading from '@/components/rann/RannSectionHeading';

/**
 * @param {{ title?: string; points?: Array<{ title: string; description: string; icon?: string }> }} props
 */
export default function RannEarlyPlanningSection({ title = 'Why Early Planning Matters', points = [] }) {
  if (!points.length) return null;

  return (
    <section className="container mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
      <RannSectionHeading eyebrow="Plan ahead" title={title} />
      <div className="grid gap-4 sm:grid-cols-2">
        {points.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-[#dceaf5] bg-[#f8fbff] p-5 shadow-sm transition hover:border-primary/20"
          >
            {item.icon ? (
              <span className="text-2xl" aria-hidden>
                {item.icon}
              </span>
            ) : null}
            <h3 className="mt-2 font-display text-lg font-bold text-primary">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-foreground/78">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
