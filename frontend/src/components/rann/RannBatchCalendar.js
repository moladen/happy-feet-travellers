import RannSectionHeading from '@/components/rann/RannSectionHeading';

/**
 * @param {{ batches?: Array<{ batch: number; dates: string; price: string; highlight: string; tags?: string[] }> }} props
 */
export default function RannBatchCalendar({ batches = [] }) {
  if (!batches.length) return null;

  return (
    <section id="batch-calendar" className="section-tone-cream scroll-mt-24 py-12 md:py-16">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <RannSectionHeading
          eyebrow="Group departures"
          title="2026–27 Batch Calendar"
          lede="Ten planned group batches across the official Rann Utsav season — sleeper train coordination, fixed departures, and transparent starting prices."
        />
        <div className="overflow-x-auto rounded-2xl border border-[#e5d4bc] bg-white shadow-sm">
          <table className="rann-batch-table w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#efe6d8] bg-[#fffdf9] text-xs font-bold uppercase tracking-wider text-primary">
                <th className="px-4 py-3 sm:px-5">Batch</th>
                <th className="px-4 py-3 sm:px-5">Dates</th>
                <th className="px-4 py-3 sm:px-5">Starting price</th>
                <th className="hidden px-4 py-3 md:table-cell sm:px-5">Highlights</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#efe6d8]">
              {batches.map((row) => (
                <tr key={row.batch} className="transition hover:bg-[#fffaf1]">
                  <td className="px-4 py-3.5 font-bold text-primary sm:px-5">#{row.batch}</td>
                  <td className="px-4 py-3.5 font-medium text-foreground/90 sm:px-5">{row.dates}</td>
                  <td className="px-4 py-3.5 font-bold text-cta sm:px-5">{row.price}</td>
                  <td className="hidden px-4 py-3.5 md:table-cell sm:px-5">
                    <p className="text-foreground/80">{row.highlight}</p>
                    {row.tags?.length ? (
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {row.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-[#e5d4bc] bg-[#fffdf9] px-2 py-0.5 text-[10px] font-semibold text-foreground/70"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-center text-xs text-foreground/65">
          Prices indicative for Group Departure from Mumbai/Pune · 3AC upgrades &amp; add-ons quoted at confirmation
        </p>
      </div>
    </section>
  );
}
