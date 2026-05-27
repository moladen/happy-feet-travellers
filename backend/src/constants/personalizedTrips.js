const { DEPARTURE_STATUS } = require('./upcomingDepartures');

const PERSONALIZED_CATEGORY = 'customized';

const PACKAGE_STATUS = DEPARTURE_STATUS;

const PACKAGE_STATUS_VALUES = Object.values(PACKAGE_STATUS);

/** Experience / mood categories for personalized packages */
const PACKAGE_CATEGORIES = [
  'Honeymoon',
  'Adventure',
  'Spiritual',
  'Family',
  'Wildlife',
  'Road Trips',
  'Mountains',
  'Beaches',
];

const PACKAGE_CATEGORY_SLUGS = PACKAGE_CATEGORIES.map((c) =>
  c.toLowerCase().replace(/\s+/g, '-')
);

module.exports = {
  PERSONALIZED_CATEGORY,
  PACKAGE_STATUS,
  PACKAGE_STATUS_VALUES,
  PACKAGE_CATEGORIES,
  PACKAGE_CATEGORY_SLUGS,
};
