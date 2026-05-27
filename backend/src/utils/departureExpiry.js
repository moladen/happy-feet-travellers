const { DEPARTURE_STATUS } = require('@/constants/upcomingDepartures');

/** Start of local calendar day (server timezone). */
function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function hasDateLabel(tour) {
  return Boolean(String(tour?.dateLabel || '').trim());
}

/** Whether batch dates (or date label) are still in the future — ignores status. */
function isDepartureDateStillValid(tour) {
  const cutoff = startOfToday();
  const end = tour?.endDate ? new Date(tour.endDate) : null;
  const start = tour?.startDate ? new Date(tour.startDate) : null;

  if (end && !Number.isNaN(end.getTime())) {
    return end >= cutoff;
  }
  if (start && !Number.isNaN(start.getTime())) {
    return start >= cutoff;
  }
  if (hasDateLabel(tour)) {
    return true;
  }

  return false;
}

/**
 * Whether a departure batch should appear on the public site.
 * Expired when endDate (or startDate if no end) is before today.
 * Active rows with only a dateLabel (no ISO dates) remain visible.
 */
function isDepartureStillActive(tour) {
  const status = String(tour?.status || DEPARTURE_STATUS.ACTIVE).toLowerCase();
  if (status !== DEPARTURE_STATUS.ACTIVE) {
    return false;
  }
  return isDepartureDateStillValid(tour);
}

/** Prisma where clause: active + not expired */
function activeDepartureWhere() {
  const cutoff = startOfToday();
  return {
    category: 'upcoming',
    status: DEPARTURE_STATUS.ACTIVE,
    OR: [
      { endDate: { gte: cutoff } },
      { AND: [{ endDate: null }, { startDate: { gte: cutoff } }] },
      {
        AND: [
          { endDate: null },
          { startDate: null },
          { dateLabel: { not: null } },
          { NOT: { dateLabel: '' } },
        ],
      },
    ],
  };
}

/** Prisma where for tours that should be auto-archived */
function expiredDepartureWhere() {
  const cutoff = startOfToday();
  return {
    category: 'upcoming',
    status: DEPARTURE_STATUS.ACTIVE,
    AND: [
      {
        OR: [
          { endDate: { lt: cutoff } },
          { AND: [{ endDate: null }, { startDate: { lt: cutoff } }] },
        ],
      },
      {
        OR: [{ dateLabel: null }, { dateLabel: '' }],
      },
    ],
  };
}

module.exports = {
  startOfToday,
  isDepartureDateStillValid,
  isDepartureStillActive,
  activeDepartureWhere,
  expiredDepartureWhere,
};
