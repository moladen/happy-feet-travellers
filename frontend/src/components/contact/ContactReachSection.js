import Image from 'next/image';
import { Pacifico } from 'next/font/google';
import ContactForm from '@/components/forms/ContactForm';

const pacifico = Pacifico({ weight: '400', subsets: ['latin'] });

const CONTACT_HERO_IMAGE =
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80';

export default function ContactReachSection() {
  return (
    <section className="section-tone-offwhite py-10 md:py-14" aria-labelledby="contact-reach-heading">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <div className="overflow-hidden rounded-3xl border border-[#e8dfd0] bg-white shadow-[0_24px_56px_-28px_rgba(15,28,46,0.18)] ring-1 ring-primary/[0.04] md:rounded-[2rem]">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative min-h-[280px] sm:min-h-[340px] lg:min-h-[520px]">
              <Image
                src={CONTACT_HERO_IMAGE}
                alt="Traveller planning a trip in the mountains"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f1c2e]/75 via-[#1a2b3c]/20 to-transparent" />
              <div
                className={`absolute bottom-5 left-5 right-5 rounded-2xl border border-white/15 bg-primary/88 px-5 py-4 shadow-lg backdrop-blur-md sm:bottom-8 sm:left-8 sm:right-8 sm:px-7 sm:py-5 ${pacifico.className}`}
              >
                <p className="text-2xl leading-tight text-cta sm:text-3xl">Hi there!</p>
                <p className="mt-1 text-xl leading-snug text-white sm:text-2xl md:text-[1.65rem]">
                  What can I do for you today?
                </p>
              </div>
            </div>

            <ContactForm variant="reach" headingId="contact-reach-heading" />
          </div>
        </div>
      </div>
    </section>
  );
}
