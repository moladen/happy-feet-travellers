const prisma = require('@/config/database');
const { withDatabaseErrors } = require('@/utils/databaseErrors');

const SETTINGS_ID = 'site-settings';

async function getSettings() {
  return withDatabaseErrors(async () => {
    const settings = await prisma.siteSettings.findUnique({ where: { id: SETTINGS_ID } });
    return (
      settings || {
        id: SETTINGS_ID,
        whatsappNumber: null,
        email: null,
        instagramUrl: null,
        facebookUrl: null,
        youtubeUrl: null,
        officeAddress: null,
        paymentLink: null,
        footerTagline: null,
        footerDetails: null,
      }
    );
  });
}

const trimOrNull = (value) => {
  if (value == null) return null;
  const s = String(value).trim();
  return s || null;
};

async function upsertSettings(payload) {
  const data = {
    whatsappNumber: trimOrNull(payload.whatsappNumber),
    email: trimOrNull(payload.email),
    instagramUrl: trimOrNull(payload.instagramUrl),
    facebookUrl: trimOrNull(payload.facebookUrl),
    youtubeUrl: trimOrNull(payload.youtubeUrl),
    officeAddress: trimOrNull(payload.officeAddress),
    paymentLink: trimOrNull(payload.paymentLink),
    footerTagline: trimOrNull(payload.footerTagline),
    footerDetails: trimOrNull(payload.footerDetails),
  };

  return withDatabaseErrors(() =>
    prisma.siteSettings.upsert({
      where: { id: SETTINGS_ID },
      update: data,
      create: { id: SETTINGS_ID, ...data },
    })
  );
}

module.exports = {
  getSettings,
  upsertSettings,
};
