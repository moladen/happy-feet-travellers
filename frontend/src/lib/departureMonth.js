/**
 * Calendar-month grouping for upcoming departures.
 * Uses Asia/Kolkata dates so a Nov 1 IST tour is never labelled October (UTC).
 * Prefers dates from dateLabel (what guests see on the card) over stale startDate.
 */

const MONTH_INDEX = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
};

const MONTH_LABELS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function pad2(n) {
  return String(n).padStart(2, '0');
}

/** YYYY-MM-DD in Asia/Kolkata. */
export function todayKeyIst(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const y = parts.find((p) => p.type === 'year')?.value;
  const m = parts.find((p) => p.type === 'month')?.value;
  const d = parts.find((p) => p.type === 'day')?.value;
  return `${y}-${m}-${d}`;
}

function currentMonthKeyIst(now = new Date()) {
  return todayKeyIst(now).slice(0, 7);
}

function ymdKey(y, m, d) {
  return `${y}-${pad2(m + 1)}-${pad2(d)}`;
}

/** Parse ISO / Date as a calendar day in India (avoids UTC showing October for 1 Nov IST). */
export function calendarKeyFromValue(value) {
  if (!value) return '';
  const raw = String(value instanceof Date ? value.toISOString() : value).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  const parsed = value instanceof Date ? value : new Date(raw);
  if (Number.isNaN(parsed.getTime())) return '';
  return todayKeyIst(parsed);
}

function parseKeysFromText(text) {
  const raw = String(text || '');
  if (!raw.trim()) return [];
  const keys = [];
  const re =
    /(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]+)\s+(\d{4})/g;
  let match = re.exec(raw);
  while (match) {
    const month = MONTH_INDEX[match[2].slice(0, 3).toLowerCase()] ?? MONTH_INDEX[match[2].toLowerCase()];
    if (month !== undefined) {
      keys.push(ymdKey(Number(match[3]), month, Number(match[1])));
    }
    match = re.exec(raw);
  }
  return keys;
}

/**
 * All calendar dates associated with a tour (label lines, start, end).
 * @returns {string[]} YYYY-MM-DD sorted unique
 */
export function getTourCalendarDateKeys(tour) {
  const keys = new Set();
  const startKey = calendarKeyFromValue(tour?.startDate);
  const endKey = calendarKeyFromValue(tour?.endDate);
  if (startKey) keys.add(startKey);
  if (endKey) keys.add(endKey);

  const blobs = [tour?.dateLabel, tour?.date, tour?.durationLabel];
  for (const blob of blobs) {
    parseKeysFromText(blob).forEach((key) => keys.add(key));
  }

  return [...keys].sort();
}

/** Next date on or after today, else the last date, else ''. */
export function getNextUpcomingDateKey(tour, today = todayKeyIst()) {
  const keys = getTourCalendarDateKeys(tour);
  if (!keys.length) return '';
  const upcoming = keys.find((key) => key >= today);
  return upcoming || keys[keys.length - 1];
}

export function isTourStillUpcoming(tour, today = todayKeyIst()) {
  const keys = getTourCalendarDateKeys(tour);
  if (!keys.length) {
    // No parseable dates — keep listing (admin-only dateLabel text).
    return Boolean(String(tour?.dateLabel || tour?.date || '').trim());
  }
  return keys.some((key) => key >= today);
}

export function monthHeadingFromKey(ymd) {
  if (!ymd || !/^\d{4}-\d{2}/.test(ymd)) return '';
  const year = Number(ymd.slice(0, 4));
  const month = Number(ymd.slice(5, 7)) - 1;
  if (month < 0 || month > 11) return '';
  return `${MONTH_LABELS[month]} ${year}`;
}

export function monthSortKeyFromHeading(heading) {
  const match = String(heading || '').match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (!match) return '9999-99';
  const month = MONTH_INDEX[match[1].toLowerCase()];
  if (month === undefined) return '9999-99';
  return `${match[2]}-${pad2(month + 1)}`;
}

/**
 * Filter past tours and group remaining ones by the month of the next live date.
 * Past months (e.g. October when today is 4 Nov) are omitted.
 * @returns {Array<{ month: string, tours: object[] }>}
 */
export function groupUpcomingToursByMonth(tours, now = new Date()) {
  const today = todayKeyIst(now);
  const currentMonth = currentMonthKeyIst(now);
  const buckets = new Map();

  for (const tour of Array.isArray(tours) ? tours : []) {
    if (!isTourStillUpcoming(tour, today)) continue;
    const nextKey = getNextUpcomingDateKey(tour, today);
    const monthKey = nextKey ? nextKey.slice(0, 7) : currentMonth;
    if (monthKey < currentMonth) continue;
    const heading = monthHeadingFromKey(`${monthKey}-01`) || 'Upcoming';
    if (!buckets.has(heading)) buckets.set(heading, []);
    buckets.get(heading).push(tour);
  }

  return [...buckets.entries()]
    .sort((a, b) => monthSortKeyFromHeading(a[0]).localeCompare(monthSortKeyFromHeading(b[0])))
    .map(([month, monthTours]) => ({
      month,
      tours: [...monthTours].sort((a, b) =>
        getNextUpcomingDateKey(a, today).localeCompare(getNextUpcomingDateKey(b, today))
      ),
    }));
}

export function filterUpcomingVisibleTours(tours, now = new Date()) {
  const today = todayKeyIst(now);
  return (Array.isArray(tours) ? tours : []).filter((tour) => isTourStillUpcoming(tour, today));
}
