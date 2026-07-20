/** Tour.status for upcoming departures */
const DEPARTURE_STATUS = {
  ACTIVE: 'active',
  ARCHIVED: 'archived',
  DRAFT: 'draft',
};

const DEPARTURE_STATUS_VALUES = Object.values(DEPARTURE_STATUS);

/** Personality / experience tags shown on cards (set in Admin → Tour → Personality tags) */
const DEPARTURE_PERSONALITY_TAGS = [
  'History Lovers',
  'Desert Festival',
  'Nature Escape',
  'Honeymoon Escape',
  'Snow Lovers',
  'Adventure Special',
  'Scenic Slow Travel',
  'Coastal Retreat',
  'Spiritual Sojourn',
  'Family Getaway',
  'Friends Getaway',
  'Monsoon Escape',
  'First-Timer Friendly',
];

const UPCOMING_CATEGORY = 'upcoming';

module.exports = {
  DEPARTURE_STATUS,
  DEPARTURE_STATUS_VALUES,
  DEPARTURE_PERSONALITY_TAGS,
  UPCOMING_CATEGORY,
};
