import Image from 'next/image';
import RannSectionHeading from '@/components/rann/RannSectionHeading';
import { sanitiseStockImageUrl } from '@/lib/stockImages';
/**
 * @param {{ trainInfo?: { title?: string; image?: string; points?: Array<{ title: string; description: string }> } }} props
 */
export default function RannTrainSection({ trainInfo }) {
  const points = trainInfo?.points || [];
  if (!points.length) return null;

  return (
    <section id="train-info" className="container mx-auto max-w-6xl scroll-mt-24 px-4 py-12 sm:px-6 md:py-16">
      <RannSectionHeading eyebrow="Logistics" title={trainInfo.title || 'Train Information'} align="left" />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:items-center">
        <ul className="space-y-4">
          {points.map((item) => (
            <li
              key={item.title}
              className="rounded-2xl border border-[#dceaf5] bg-white p-5 shadow-sm"
            >
              <h3 className="font-display text-base font-bold text-primary">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/78">{item.description}</p>
            </li>
          ))}
        </ul>
        {trainInfo.image ? (
          <div className="relative h-56 overflow-hidden rounded-2xl md:h-72">
            <Image src={sanitiseStockImageUrl(trainInfo.image)} alt="Train travel to Kutch" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 40vw" />
          </div>
        ) : null}
      </div>
    </section>
  );
}
