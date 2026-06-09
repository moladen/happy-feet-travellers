import Image from 'next/image';

/**
 * @param {{ items: Array<{ id?: string; name: string; city?: string; image?: string; review: string; rating?: number }> }} props
 */
export default function LandingTestimonials({ items }) {
  if (!items?.length) return null;

  return (
    <section className="container mx-auto max-w-6xl px-4 pb-14 sm:px-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.id || `${item.name}-${item.review.slice(0, 24)}`}
            className="rounded-2xl border border-[#e5d4bc] bg-white p-5 shadow-sm"
          >
            <div className="flex items-center gap-3">
              {item.image ? (
                <div className="relative h-12 w-12 overflow-hidden rounded-full">
                  <Image src={item.image} alt="" fill className="object-cover" />
                </div>
              ) : (
                <div className="grid h-12 w-12 place-items-center rounded-full bg-[#f0f6fc] text-sm font-bold text-primary">
                  {item.name.charAt(0)}
                </div>
              )}
              <div>
                <p className="font-semibold text-primary">{item.name}</p>
                {item.city ? <p className="text-xs text-foreground/60">{item.city}</p> : null}
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-foreground/78">{item.review}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
