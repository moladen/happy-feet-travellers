'use client';

import { useState } from 'react';
import RannSectionHeading from '@/components/rann/RannSectionHeading';

/**
 * @param {{ videos?: Array<{ id: string; title: string; caption?: string; embedUrl: string }> }} props
 */
export default function RannVideoGallery({ videos = [] }) {
  const [activeId, setActiveId] = useState(videos[0]?.id || '');

  if (!videos.length) return null;

  const active = videos.find((v) => v.id === activeId) || videos[0];

  return (
    <section id="videos" className="container mx-auto max-w-6xl scroll-mt-24 px-4 py-12 sm:px-6 md:py-16">
      <RannSectionHeading
        eyebrow="Watch"
        title="Video Gallery"
        lede="Feel the White Desert, festival energy, and Kutch culture before you travel."
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.6fr)]">
        <div className="overflow-hidden rounded-2xl border border-[#dceaf5] bg-[#0f1c2e] shadow-lg">
          <div className="relative aspect-video w-full">
            <iframe
              key={active.id}
              src={active.embedUrl}
              title={active.title}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
          <div className="border-t border-white/10 px-4 py-3">
            <p className="font-semibold text-white">{active.title}</p>
            {active.caption ? <p className="mt-1 text-xs text-white/75">{active.caption}</p> : null}
          </div>
        </div>
        <ul className="flex flex-col gap-2">
          {videos.map((video) => (
            <li key={video.id}>
              <button
                type="button"
                onClick={() => setActiveId(video.id)}
                className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                  video.id === active.id
                    ? 'border-cta/40 bg-[#fffaf1] shadow-sm'
                    : 'border-[#dceaf5] bg-white hover:border-primary/25'
                }`}
              >
                <span className="block text-sm font-bold text-primary">{video.title}</span>
                {video.caption ? (
                  <span className="mt-0.5 block text-xs text-foreground/65">{video.caption}</span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
