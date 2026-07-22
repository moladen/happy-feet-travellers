import { normaliseUploadUrl } from '@/lib/heroSlides';

export const DEFAULT_PAYMENT_PAGE_CONTENT = {
  qrImageUrl: '',
  upiId: 'happyfeettravellers@icici',
  accountName: 'M/S. HAPPY FEET TRAVELLERS',
  bankName: 'ICICI BANK',
  accountNumber: '032105019958',
  ifsc: 'ICIC0000321',
  accountType: 'Current Account',
  branch: 'Chinchwad, Pune',
  upiNote:
    'Scan the QR or use the UPI ID above to pay instantly from any UPI app.',
  processingFeeNote:
    '2.5% processing fee is charged by the payment gateway on credit/debit card.',
  confirmationNote:
    'After you pay, share the receipt/UTR or a screenshot on WhatsApp at +91 9130007027 or email us at happyfeettravellers@gmail.com for faster confirmation.',
};

export const PAYMENT_FORM_FIELDS = [
  'qrImageUrl',
  'upiId',
  'accountName',
  'bankName',
  'accountNumber',
  'ifsc',
  'accountType',
  'branch',
  'upiNote',
  'processingFeeNote',
  'confirmationNote',
];

function sanitiseString(value) {
  if (value == null) return '';
  return String(value).trim();
}

export function normalisePaymentPageContent(raw) {
  const base = { ...DEFAULT_PAYMENT_PAGE_CONTENT };
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return base;

  for (const key of PAYMENT_FORM_FIELDS) {
    if (raw[key] != null) {
      base[key] = sanitiseString(raw[key]);
    }
  }

  if (base.qrImageUrl.startsWith('blob:')) {
    base.qrImageUrl = '';
  } else if (base.qrImageUrl) {
    base.qrImageUrl = normaliseUploadUrl(base.qrImageUrl);
  }

  return base;
}

export function resolvePaymentPageContent(settings) {
  return normalisePaymentPageContent(settings?.paymentPageContent);
}

export function paymentContentToForm(content) {
  return normalisePaymentPageContent(content);
}

export function paymentFormToContent(form) {
  return normalisePaymentPageContent(form);
}

export function buildBankTransferRows(content) {
  const rows = [
    { label: 'Bank', value: content.bankName },
    { label: 'Account name', value: content.accountName },
    { label: 'Account no.', value: content.accountNumber },
    { label: 'IFSC', value: content.ifsc },
    { label: 'Type', value: content.accountType },
    { label: 'Branch', value: content.branch },
  ];
  return rows.filter((row) => row.value);
}
