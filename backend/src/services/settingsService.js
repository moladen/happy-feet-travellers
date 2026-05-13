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

async function upsertSettings(payload) {
  return withDatabaseErrors(() =>
    prisma.siteSettings.upsert({
      where: { id: SETTINGS_ID },
      update: {
        whatsappNumber: payload.whatsappNumber || null,
        email: payload.email || null,
        instagramUrl: payload.instagramUrl || null,
        facebookUrl: payload.facebookUrl || null,
        youtubeUrl: payload.youtubeUrl || null,
        officeAddress: payload.officeAddress || null,
        paymentLink: payload.paymentLink || null,
        footerTagline: payload.footerTagline || null,
        footerDetails: payload.footerDetails || null,
      },
      create: {
        id: SETTINGS_ID,
        whatsappNumber: payload.whatsappNumber || null,
        email: payload.email || null,
        instagramUrl: payload.instagramUrl || null,
        facebookUrl: payload.facebookUrl || null,
        youtubeUrl: payload.youtubeUrl || null,
        officeAddress: payload.officeAddress || null,
        paymentLink: payload.paymentLink || null,
        footerTagline: payload.footerTagline || null,
        footerDetails: payload.footerDetails || null,
      },
    })
  );
}

module.exports = {
  getSettings,
  upsertSettings,
};
