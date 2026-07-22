import {
  buildBankTransferRows,
  resolvePaymentPageContent,
} from '@/lib/paymentPageContent';
import { resolveHeroImageSrc } from '@/lib/heroSlides';
import { whatsappHref } from '@/lib/siteContact';

function DetailRow({ label, value, mono = false }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-1 border-b border-[#eaf4fb] py-3 last:border-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
      <dt className="text-xs font-semibold uppercase tracking-wide text-foreground/55">{label}</dt>
      <dd className={`text-sm font-semibold text-foreground ${mono ? 'font-mono tracking-wide' : ''}`}>{value}</dd>
    </div>
  );
}

/**
 * UPI QR + bank transfer details for the contact payment section.
 */
export default function PaymentDetailsView({ settings, className = '' }) {
  const payment = resolvePaymentPageContent(settings);
  const qrSrc = resolveHeroImageSrc(payment.qrImageUrl);
  const bankRows = buildBankTransferRows(payment);
  const waHelp = whatsappHref(
    settings?.whatsappNumber,
    'Hi, I have completed payment and would like to share my receipt/UTR.'
  );

  return (
    <div className={`space-y-8 ${className}`.trim()}>
      <div className="grid gap-8 lg:grid-cols-2">
        <section aria-labelledby="payment-upi-heading">
          <h3 id="payment-upi-heading" className="font-display text-lg font-bold text-primary md:text-xl">
            Pay via UPI
          </h3>
          <p className="mt-2 text-sm text-foreground/75">
            Scan the QR code or pay using our UPI ID from any UPI app (GPay, PhonePe, Paytm, BHIM).
          </p>

          {qrSrc ? (
            <div className="mt-5 flex justify-center rounded-2xl border border-[#e8dfd0] bg-white p-4 shadow-sm">
              <div className="relative h-56 w-56 sm:h-64 sm:w-64">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrSrc}
                  alt={`UPI QR code for ${payment.accountName || 'Happy Feet Travellers'}`}
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-dashed border-[#d0e2f0] bg-[#f8fbfe] px-4 py-10 text-center text-sm text-foreground/65">
              UPI QR image will appear here once uploaded in Admin → Payment.
            </div>
          )}

          <dl className="mt-5 rounded-2xl border border-[#e8dfd0] bg-[#faf6ef]/60 px-4 py-1">
            <DetailRow label="UPI ID" value={payment.upiId} mono />
          </dl>

          {payment.upiNote ? (
            <p className="mt-4 text-sm font-medium text-[#c0392b]">{payment.upiNote}</p>
          ) : null}
        </section>

        <section aria-labelledby="payment-bank-heading">
          <h3 id="payment-bank-heading" className="font-display text-lg font-bold text-primary md:text-xl">
            Bank transfer (NEFT / IMPS)
          </h3>
          <p className="mt-2 text-sm text-foreground/75">
            Use these details for direct bank transfer. Mention your tour name and travel dates in the payment remarks.
          </p>

          <dl className="mt-5 rounded-2xl border border-[#e8dfd0] bg-white px-4 py-1">
            {bankRows.map((row) => (
              <DetailRow
                key={row.label}
                label={row.label}
                value={row.value}
                mono={row.label === 'Account no.' || row.label === 'IFSC'}
              />
            ))}
          </dl>
        </section>
      </div>

      {payment.processingFeeNote ? (
        <p className="text-sm text-foreground/70">{payment.processingFeeNote}</p>
      ) : null}

      {payment.confirmationNote ? (
        <div className="rounded-2xl border border-[#dceaf7] bg-[#f0f7fc] px-5 py-4">
          <p className="text-sm leading-relaxed text-foreground/85">{payment.confirmationNote}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={waHelp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex justify-center rounded-full border-2 border-[#2E7D32] bg-white px-5 py-2.5 text-sm font-semibold text-[#2E7D32] transition hover:bg-[#1B5E20] hover:text-white"
            >
              Share receipt on WhatsApp
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}
