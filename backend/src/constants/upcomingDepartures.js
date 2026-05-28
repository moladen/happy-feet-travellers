/** Tour.status for upcoming departures */
const DEPARTURE_STATUS = {
  ACTIVE: 'active',
  ARCHIVED: 'archived',
  DRAFT: 'draft',
};

const DEPARTURE_STATUS_VALUES = Object.values(DEPARTURE_STATUS);

/** Personality / experience tags shown on cards */
const DEPARTURE_PERSONALITY_TAGS = [
  'Best for Couples',
  'Snow Lovers',
  'Adventure',
  'Scenic',
  'Spiritual',
  'Road Trip',
  'Family Friendly',
  'Wildlife',
];

const UPCOMING_CATEGORY = 'upcoming';

module.exports = {
  DEPARTURE_STATUS,
  DEPARTURE_STATUS_VALUES,
  DEPARTURE_PERSONALITY_TAGS,
  UPCOMING_CATEGORY,
};
