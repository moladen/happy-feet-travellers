import Image from 'next/image';
import RannSectionHeading from '@/components/rann/RannSectionHeading';

/**
 * @param {{ dholavira?: { title?: string; eyebrow?: string; paragraphs?: string[]; highlights?: string[]; image?: string } }} props
 */
export default function RannDholaviraSection({ dholavira }) {
  const paragraphs = dholavira?.paragraphs || [];
  if (!paragraphs.length) return null;

  return (
    <section id="dholavira" className="section-tone-cream scroll-mt-24 py-12 md:py-16">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <RannSectionHeading
          eyebrow={dholavira.eyebrow || 'Heritage'}
          title={dholavira.title || 'Dholavira'}
          align="left"
        />
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
          <div className="space-y-4">
            {paragraphs.map((p) => (
              <p key={p} className="text-sm leading-relaxed text-foreground/82 md:text-base">
                {p}
              </p>
            ))}
            {dholavira.highlights?.length ? (
              <ul className="mt-4 space-y-2">
                {dholavira.highlights.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-foreground/85">
                    <span className="font-bold text-cta" aria-hidden>
                      ✦
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          {dholavira.image ? (
            <div className="relative h-64 overflow-hidden rounded-2xl shadow-md md:h-80">
              <Image
                src={dholavira.image}
                alt="Dholavira UNESCO World Heritage Site"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
