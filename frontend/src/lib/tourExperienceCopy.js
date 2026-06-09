import { getPersonalizedExperienceTags } from '@/lib/personalizedTourExperience';

function haystack(tour) {
  return [
    tour?.title,
    tour?.destination,
    tour?.subCategory,
    tour?.packageCategory,
    tour?.description,
    tour?.suitableFor,
    ...(Array.isArray(tour?.highlights) ? tour.highlights : []),
    ...(Array.isArray(tour?.tags) ? tour.tags : []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

const WHY_SPECIAL = [
  {
    keys: ['spiti'],
    headline: 'Raw Himalaya, remote villages, and roads that feel like expeditions.',
    story:
      'This is not a sightseeing loop — it is high-altitude drama, monastery silences, and landscapes that reset how you see travel.',
    vibes: ['Expedition energy', 'Remote landscapes', 'Adventure-first pacing'],
  },
  {
    keys: ['kerala', 'backwater', 'houseboat', 'alleppey', 'munnar'],
    headline: 'Slow Kerala rhythms — backwaters, misty hills, and unhurried couple time.',
    story:
      'Think gentle houseboat mornings, spice-scented air, and experiences designed for connection rather than checklist tourism.',
    vibes: ['Romance & calm', 'Backwater experiences', 'Couple-friendly pacing'],
  },
  {
    keys: ['himachal', 'manali', 'shimla', 'dharamshala', 'kasol'],
    headline: 'Crisp mountain air, scenic drives, and Himachal at its most feel-good.',
    story:
      'Valley views, pine forests, and that unmistakable hill-station lightness — travel that feels refreshing from the first kilometre.',
    vibes: ['Mountain weather', 'Scenic viewpoints', 'Relaxed hill vibes'],
  },
  {
    keys: ['honeymoon', 'romantic', 'couple'],
    headline: 'A journey built for two — intimate stays, beautiful views, and zero rush.',
    story:
      'Private moments, thoughtfully chosen stays, and a pace that lets you actually enjoy each other — not just the destinations.',
    vibes: ['Couple experiences', 'Intimate stays', 'Unhurried days'],
  },
  {
    keys: ['rishikesh', 'yoga', 'wellness', 'healing', 'retreat', 'sound healing'],
    headline: 'Reset on the Ganga — yoga, wellness, and spiritual calm in Rishikesh.',
    story:
      'Morning practice, riverside stillness, and experiences that nourish body and mind — a retreat mood, not a rushed tour.',
    vibes: ['Yoga & wellness', 'Sound healing', 'Spiritual calm'],
  },
  {
    keys: ['rishikesh', 'ganga', 'aarti', 'spiritual'],
    headline: 'Feel the Ganga Aarti — devotion, river breeze, and Rishikesh energy.',
    story:
      'Evening lamps on the ghats, temple bells, and the kind of spiritual atmosphere that stays with you long after you leave.',
    vibes: ['Ganga Aarti', 'Temple towns', 'Spiritual experience'],
  },
  {
    keys: ['kashmir', 'gulmarg', 'dal lake', 'srinagar'],
    headline: 'Paradise on earth — lakes, meadows, and snow-kissed horizons.',
    story:
      'Shikara mornings, mountain backdrops, and Kashmir hospitality woven into a journey that feels cinematic and calm.',
    vibes: ['Snow & lakes', 'Scenic beauty', 'Premium pacing'],
  },
  {
    keys: ['goa', 'beach', 'coastal'],
    headline: 'Sun, sea, and Goan ease — the kind of break that actually feels like a break.',
    story:
      'Golden hours, coastal drives, and a rhythm that balances exploration with time to simply be by the water.',
    vibes: ['Beach life', 'Coastal sunsets', 'Group fun'],
  },
  {
    keys: ['rann', 'kutch', 'desert', 'white desert'],
    headline: 'White Desert nights, folk culture, and festival energy under open skies.',
    story:
      'Salt flats at moonrise, craft villages, and desert experiences that feel surreal — Kutch at its most unforgettable.',
    vibes: ['White Desert', 'Culture & crafts', 'Festival nights'],
  },
  {
    keys: ['ladakh', 'leh', 'nubra', 'pangong'],
    headline: 'High-altitude Ladakh — lakes, passes, and landscapes that stop conversation.',
    story:
      'Monasteries, high passes, and turquoise lakes in a journey built for travellers who want awe, not ordinary sightseeing.',
    vibes: ['High passes', 'Lake vistas', 'Adventure spirit'],
  },
];

const DEFAULT_WHY = {
  headline: 'More than an itinerary — a journey designed to be felt.',
  story:
    'We plan for the moments between landmarks: local flavours, scenic pauses, and the kind of pacing that lets a destination sink in.',
  vibes: ['Curated experiences', 'Comfort-first travel', 'Memorable moments'],
};

export function getWhyTourIsSpecial(tour) {
  const text = haystack(tour);
  for (const rule of WHY_SPECIAL) {
    if (rule.keys.some((key) => text.includes(key))) {
      return {
        headline: rule.headline,
        story: rule.story,
        vibes: rule.vibes,
        tags: getPersonalizedExperienceTags(tour, 2),
      };
    }
  }
  return {
    ...DEFAULT_WHY,
    tags: getPersonalizedExperienceTags(tour, 2),
  };
}

export function getTourOverviewTeaser(tour) {
  const raw = String(tour?.description || '').trim();
  if (!raw) {
    return `Experience ${tour?.destination || tour?.title || 'this journey'} with thoughtful pacing, local flavour, and stays chosen for comfort — not just convenience.`;
  }
  const firstBlock = raw.split(/\n\n+/)[0].replace(/\s+/g, ' ').trim();
  if (firstBlock.length <= 280) return firstBlock;
  return `${firstBlock.slice(0, 277).trim()}…`;
}

export function getStartingLocation(tour) {
  return (
    tour?.departureCity ||
    tour?.startingLocation ||
    tour?.pickupPoints?.[0]?.name?.split('—')[0]?.trim() ||
    tour?.destination ||
    'On request'
  );
}
