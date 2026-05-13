import ContactForm from '@/components/forms/ContactForm';

export const metadata = {
  title: 'Contact Us - Happy Feet Travellers',
  description: 'Get in touch with our team for inquiries, bookings, and support',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#143454] via-primary to-[#5b7fa8] text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_70%_at_20%_15%,rgba(255,255,255,0.14),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,18,32,0.12),rgba(5,18,32,0.28))]" />
        <div className="container relative z-10 mx-auto px-4 py-16 md:py-20">
          <p className="mb-3 inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/85 backdrop-blur-sm">
            Get in touch
          </p>
          <h1 className="mb-4 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-white drop-shadow-[0_10px_24px_rgba(0,0,0,0.22)] md:text-5xl lg:text-[3.5rem]">
            Talk to a real human
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-white/90 md:text-lg">
            Have a date in mind or a destination on your wishlist? Drop a message — we usually reply within a few hours, often on WhatsApp.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.9fr)] lg:items-start xl:gap-8">
          {/* Contact Form */}
          <div className="space-y-6 md:space-y-8">
            <ContactForm />

            <div id="pay" className="scroll-mt-28 rounded-2xl border border-[#dceaf7] bg-white p-8 shadow-lg">
              <h2 className="mb-2 text-2xl font-bold text-primary">Pay Online</h2>
              <p className="mb-6 text-foreground">
                Complete your payment on our secure partner page. For booking references or payment help, call or WhatsApp us.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://www.fundayoption.com/pay-online/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-full bg-cta px-6 py-3 font-semibold text-primary transition hover:bg-[#E76F51] hover:text-white"
                >
                  Pay online
                </a>
                <a
                  href="https://wa.me/919876543210?text=Hi%2C%20I%20need%20help%20with%20online%20payment"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-full border-2 border-[#2E7D32] bg-white px-6 py-3 font-semibold text-[#2E7D32] transition hover:bg-[#1B5E20] hover:text-white"
                >
                  Payment help on WhatsApp
                </a>
              </div>
            </div>

            {/* Map Section */}
            <div className="overflow-hidden rounded-2xl border border-[#eaf4fb] bg-white shadow-sm">
              <div className="p-6 pb-4">
                <h2 className="mb-1 text-2xl font-bold text-primary">Find us in Pune</h2>
                <p className="text-sm text-foreground/75">Walk-ins are by appointment — give us a call first.</p>
              </div>
              <div className="h-80 w-full md:h-96">
                <iframe
                  title="Happy Feet Travellers — Pune location"
                  src="https://www.google.com/maps?q=Baner,Pune,Maharashtra&output=embed"
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-6">
            {/* Phone */}
            <div className="bg-white rounded-2xl border border-[#eaf4fb] shadow-sm p-6">
              <div className="text-3xl mb-4">📞</div>
              <h3 className="text-xl font-bold text-primary mb-2">Call us</h3>
              <p className="text-foreground/75 mb-4 text-sm">Mon–Sun, 9 AM – 10 PM IST</p>
              <a href="tel:+919876543210" className="text-secondary font-bold hover:text-primary">
                +91 98765 43210
              </a>
            </div>

            {/* Email */}
            <div className="bg-white rounded-2xl border border-[#eaf4fb] shadow-sm p-6">
              <div className="text-3xl mb-4">📧</div>
              <h3 className="text-xl font-bold text-primary mb-2">Email</h3>
              <p className="text-foreground/75 mb-4 text-sm">Replies usually within a few hours</p>
              <a href="mailto:info@happyfeet.com" className="text-secondary font-bold hover:text-primary">
                info@happyfeet.com
              </a>
            </div>

            {/* WhatsApp */}
            <div className="bg-white rounded-2xl border border-[#eaf4fb] shadow-sm p-6">
              <div className="text-3xl mb-4">💬</div>
              <h3 className="text-xl font-bold text-primary mb-2">WhatsApp</h3>
              <p className="text-foreground/75 mb-4 text-sm">Easiest way to reach us</p>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary font-bold hover:text-primary"
              >
                Chat with us →
              </a>
            </div>

            {/* Address */}
            <div className="bg-white rounded-2xl border border-[#eaf4fb] shadow-sm p-6">
              <div className="text-3xl mb-4">📍</div>
              <h3 className="text-xl font-bold text-primary mb-2">Office</h3>
              <p className="text-foreground/80 text-sm leading-relaxed">
                Happy Feet Travellers
                <br />
                Baner Road, Pune – 411045
                <br />
                Maharashtra, India
              </p>
            </div>

            {/* Office Hours */}
            <div className="bg-white rounded-2xl border border-[#eaf4fb] shadow-sm p-6">
              <div className="text-3xl mb-4">🕐</div>
              <h3 className="text-xl font-bold text-primary mb-2">Hours</h3>
              <div className="text-foreground/80 text-sm space-y-0.5">
                <p>Mon – Fri · 9:00 AM – 6:00 PM</p>
                <p>Sat – Sun · 9:00 AM – 10:00 PM</p>
                <p className="text-foreground/55 text-xs mt-2">All times in IST</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}


