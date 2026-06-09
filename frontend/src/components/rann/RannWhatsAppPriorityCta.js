import Link from 'next/link';

/**
 * @param {{ title?: string; subtitle?: string; priorityHref: string; groupHref: string; variant?: 'sand' | 'dark' }} props
 */
export default function RannWhatsAppPriorityCta({
  title = 'Join the WhatsApp Priority Group',
  subtitle = 'Get batch alerts, early-bird fares, and quick answers from our Rann season planners.',
  priorityHref,
  groupHref,
  variant = 'sand',
}) {
  const isDark = variant === 'dark';

  return (
    <section
      className={`rann-wa-cta ${isDark ? 'rann-wa-cta--dark' : 'rann-wa-cta--sand'}`}
      aria-labelledby="rann-wa-cta-title"
    >
      <div className="container mx-auto max-w-4xl px-4 text-center sm:px-6">
        <h2 id="rann-wa-cta-title" className={`font-display text-2xl font-bold md:text-3xl ${isDark ? 'text-white' : 'text-primary'}`}>
          {title}
        </h2>
        <p className={`mx-auto mt-3 max-w-2xl text-sm md:text-base ${isDark ? 'text-white/85' : 'text-foreground/75'}`}>
          {subtitle}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="#priority-interest"
            className="inline-flex rounded-xl bg-cta px-5 py-3 text-sm font-bold text-white transition hover:bg-cta-hover"
          >
            Get Priority Access
          </Link>
          <a
            href={groupHref}
            target="_blank"
            rel="noreferrer"
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition ${
              isDark
                ? 'bg-[#25D366] text-white hover:brightness-110'
                : 'border border-[#25D366]/50 bg-[#25D366]/12 text-[#128C7E] hover:bg-[#25D366]/20'
            }`}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.11.547 4.09 1.507 5.81L0 24l6.438-1.678A11.96 11.96 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.82a9.82 9.82 0 01-5.01-1.37l-.36-.214-3.826 1 1.018-3.73-.235-.374A9.82 9.82 0 012.18 12c0-5.422 4.398-9.82 9.82-9.82 5.422 0 9.82 4.398 9.82 9.82 0 5.422-4.398 9.82-9.82 9.82z" />
            </svg>
            Join WhatsApp Priority Group
          </a>
          <a
            href={priorityHref}
            target="_blank"
            rel="noreferrer"
            className={`text-sm font-semibold underline-offset-2 hover:underline ${isDark ? 'text-white/90' : 'text-primary'}`}
          >
            Chat with travel expert
          </a>
        </div>
      </div>
    </section>
  );
}
