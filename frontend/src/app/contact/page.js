import ContactReachSection from '@/components/contact/ContactReachSection';
import { getPublicSettings } from '@/services/settingsService';
import {
  formatIndianPhone,
  mergeSiteSettings,
  resolveGatewayPaymentUrl,
  telHref,
  whatsappHref,
} from '@/lib/siteContact';

export const metadata = {
  title: 'Contact Us - Happy Feet Travellers',
  description: 'Get in touch with our team for inquiries, bookings, and support',
};

function ContactDetailIcon({ name, className = 'h-5 w-5' }) {
  switch (name) {
    case 'phone':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      );
    case 'email':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      );
    case 'whatsapp':
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path d="M20.52 3.48A11.85 11.85 0 0012.09 0C5.53 0 .19 5.34.19 11.9c0 2.1.55 4.15 1.59 5.95L.09 24l6.3-1.65a11.93 11.93 0 005.69 1.45h.01c6.56 0 11.9-5.34 11.91-11.9 0-3.18-1.24-6.17-3.48-8.42Zm-8.43 18.31h-.01a9.9 9.9 0 01-5.04-1.38l-.36-.21-3.74.98 1-3.65-.24-.38a9.86 9.86 0 01-1.51-5.25c0-5.45 4.44-9.89 9.9-9.89 2.64 0 5.12 1.03 6.99 2.9a9.84 9.84 0 012.9 6.99c0 5.45-4.44 9.89-9.89 9.89Zm5.42-7.41c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35Z" />
        </svg>
      );
    case 'office':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case 'clock':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    default:
      return null;
  }
}

const cardShell =
  'rounded-2xl border border-[#e8dfd0] bg-white shadow-[0_12px_32px_-16px_rgba(15,28,46,0.12)] ring-1 ring-primary/[0.04] md:rounded-3xl';

export default async function ContactPage() {
  const settings = mergeSiteSettings(await getPublicSettings());
  const phoneDisplay = formatIndianPhone(settings.whatsappNumber);
  const phoneHref = telHref(settings.whatsappNumber);
  const email = settings.email || 'info@happyfeet.com';
  const payHref = resolveGatewayPaymentUrl(settings);
  const office = settings.officeAddress || 'Baner Road, Pune – 411045, Maharashtra, India';

  const detailRows = [
    {
      icon: 'phone',
      label: 'Phone',
      hint: 'Mon–Sun · 9 AM – 10 PM IST',
      value: (
        <a href={phoneHref} className="font-semibold text-secondary underline-offset-2 hover:text-primary hover:underline">
          {phoneDisplay || '+91 98765 43210'}
        </a>
      ),
    },
    {
      icon: 'email',
      label: 'Email',
      hint: 'Replies usually within a few hours',
      value: (
        <a href={`mailto:${email}`} className="font-semibold text-secondary underline-offset-2 hover:text-primary hover:underline">
          {email}
        </a>
      ),
    },
    {
      icon: 'whatsapp',
      label: 'WhatsApp',
      hint: 'Fastest way to reach us',
      value: (
        <a
          href={whatsappHref(settings.whatsappNumber, 'Hi, I would like to enquire about a tour.')}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-secondary underline-offset-2 hover:text-primary hover:underline"
        >
          Open chat
        </a>
      ),
    },
    {
      icon: 'office',
      label: 'Office',
      hint: 'Walk-ins by appointment',
      value: <span className="block max-w-xs whitespace-pre-line text-foreground/90">{office}</span>,
    },
    {
      icon: 'clock',
      label: 'Hours',
      hint: 'All times IST',
      value: (
        <span className="block space-y-1 text-foreground/90">
          <span className="block">Mon – Fri · 9:00 AM – 6:00 PM</span>
          <span className="block">Sat – Sun · 9:00 AM – 10:00 PM</span>
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0f1c2e] via-primary to-[#2d4f6e] text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_70%_at_20%_15%,rgba(255,255,255,0.12),transparent_55%)]" />
        <div className="container relative z-10 mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-12">
          <p className="section-eyebrow mb-3 text-white/80">Contact</p>
          <h1 className="font-display mb-3 max-w-3xl text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
            We&apos;re here to help you travel
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-white/88 md:text-lg">
            Fixed departures, customized holidays, or payment questions — reach out and our travel team will reply with
            care.
          </p>
        </div>
      </div>

      <ContactReachSection />

      <div className="section-tone-cream py-10 md:py-14">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="space-y-8 lg:col-span-7">
              <section id="pay" className={`scroll-mt-28 ${cardShell} p-6 md:p-8`}>
                <h2 className="section-title mb-2 text-xl md:text-2xl">Pay online</h2>
                <p className="mb-6 max-w-2xl text-sm leading-relaxed text-foreground/80 md:text-base">
                  Complete your payment on our secure partner page. For booking references or payment help, call or
                  WhatsApp us.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <a href={payHref} target="_blank" rel="noopener noreferrer" className="btn-travel-primary px-6 py-3">
                    Pay online
                  </a>
                  <a
                    href={whatsappHref(settings.whatsappNumber, 'Hi, I need help with online payment.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex justify-center rounded-full border-2 border-[#2E7D32] bg-white px-6 py-3 text-center text-sm font-semibold text-[#2E7D32] transition hover:bg-[#1B5E20] hover:text-white"
                  >
                    Payment help on WhatsApp
                  </a>
                </div>
              </section>

              <section className={`overflow-hidden ${cardShell}`}>
                <div className="border-b border-[#eaf4fb] px-6 py-5 md:px-8">
                  <h2 className="section-title text-xl md:text-2xl">Find us in Pune</h2>
                  <p className="mt-1 text-sm text-foreground/75">Walk-ins are by appointment — please call first.</p>
                </div>
                <div className="aspect-[21/9] min-h-[220px] w-full md:min-h-[280px] lg:h-80">
                  <iframe
                    title="Happy Feet Travellers — Pune location"
                    src="https://www.google.com/maps?q=Baner,Pune,Maharashtra&output=embed"
                    className="h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
              </section>
            </div>

            <aside className="lg:col-span-5 lg:sticky lg:top-24">
              <div className={cardShell}>
                <div className="border-b border-[#eaf4fb] px-6 py-4 md:px-8 md:py-5">
                  <h2 className="section-title text-lg md:text-xl">Contact details</h2>
                  <p className="mt-1 text-sm text-foreground/70">Tap to call, email, or chat.</p>
                </div>
                <div className="divide-y divide-[#eaf4fb]" role="list">
                  {detailRows.map((row) => (
                    <div key={row.label} role="listitem" className="flex gap-4 px-6 py-4 sm:px-8 sm:py-5">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 sm:h-12 sm:w-12 ${
                          row.icon === 'whatsapp'
                            ? 'bg-[#e8f5e9] text-[#1B5E20] ring-[#c8e6c9]'
                            : 'bg-section-alt text-primary ring-[#e8dfd0]'
                        }`}
                        aria-hidden
                      >
                        <ContactDetailIcon name={row.icon} />
                      </div>
                      <div className="min-w-0 flex-1 pt-0.5">
                        <p className="section-eyebrow text-[10px] text-foreground/50">{row.label}</p>
                        <div className="mt-1 text-sm leading-relaxed md:text-[15px]">{row.value}</div>
                        <p className="mt-1 text-xs text-foreground/60">{row.hint}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
