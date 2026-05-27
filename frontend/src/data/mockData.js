const IMG = {
  sikkim:
    "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=900&q=80",
  himalayas:
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80",
  goa:
    "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=80",
  goaSunset:
    "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&w=900&q=80",
  kerala:
    "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=80",
  rajasthan:
    "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=900&q=80",
  desert:
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=80",
  forest:
    "https://images.unsplash.com/photo-1476514525535-07fb1b4f5bb5?auto=format&fit=crop&w=900&q=80",
  snowMtn:
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80",
  blogPacking:
    "https://images.unsplash.com/photo-1553531384-cc64ac80f931?auto=format&fit=crop&w=900&q=80",
  blogNotes:
    "https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?auto=format&fit=crop&w=900&q=80",
};

export const mockTours = [
  {
    id: 1,
    title: "Sikkim & Darjeeling Group Trip",
    departureCity: "Pune",
    category: "upcoming",
    subCategory: "mountains",
    price: 25000,
    startingPrice: 25000,
    image: IMG.sikkim,
    gallery: [IMG.sikkim, IMG.himalayas, IMG.snowMtn],
    duration: "5N6D",
    urgency: "Only 4 seats left",
    bookingDeposit: 2000,
    rating: 4.8,
    reviews: 234,
    description:
      "A relaxed-pace Himalayan circuit covering Gangtok and Darjeeling — verified hotels, smooth transfers and a trip captain travelling with the group.",
    highlights: [
      "Tiger Hill sunrise",
      "Tea estate walk in Darjeeling",
      "Rumtek monastery visit",
      "Cable car & Tsomgo Lake (subject to permits)",
    ],
    date: "15 May - 20 May 2026",
    startDate: "2026-05-15",
    endDate: "2026-05-20",
    itinerary: [
      {
        day: "Day 1",
        title: "Arrive Bagdogra · transfer to Gangtok",
        details:
          "Group pickup at Bagdogra airport, scenic drive to Gangtok, hotel check-in and an evening MG Marg walk.",
      },
      {
        day: "Day 2",
        title: "Gangtok sightseeing",
        details:
          "Cable car ride, Rumtek monastery, Banjhakri waterfalls and Tsomgo Lake (permits permitting).",
      },
      {
        day: "Day 3",
        title: "Transfer to Darjeeling",
        details:
          "Drive across hill terrain with a tea garden stop. Evening at leisure on Mall Road.",
      },
      {
        day: "Day 4",
        title: "Darjeeling highlights",
        details:
          "Tiger Hill sunrise, Batasia Loop, Himalayan Mountaineering Institute and the toy train joy ride.",
      },
      {
        day: "Day 5",
        title: "Cafés, shopping & rest",
        details: "Free time for cafés, last-mile shopping and group photos.",
      },
      {
        day: "Day 6",
        title: "Departure",
        details: "Hotel checkout and group transfer to Bagdogra for onward travel.",
      },
    ],
    inclusions: [
      "5 nights hotel stay (3★ category)",
      "Daily breakfast and dinner",
      "All inter-city transfers in private vehicles",
      "Trip captain travelling with the group",
      "Permits for Tsomgo Lake (subject to weather)",
    ],
    exclusions: [
      "Flights/trains to & from Bagdogra",
      "Lunches and personal expenses",
      "Cable car / monument entry tickets",
      "Travel insurance",
    ],
    faqs: [
      {
        question: "Is this trip beginner-friendly?",
        answer:
          "Yes. The pace is relaxed and there are no treks involved. It suits most age groups in reasonable health.",
      },
      {
        question: "Can solo travellers join?",
        answer:
          "Absolutely — solo travellers join almost every group. Twin-sharing rooms are arranged with someone of the same gender.",
      },
    ],
    thingsToCarry: [
      "Government photo ID (mandatory for permits)",
      "Comfortable walking shoes",
      "Warm layers — evenings get cold",
      "Power bank and basic medication",
    ],
    terms: [
      "Slot is confirmed only on receipt of advance payment.",
      "Schedule may shift due to weather or permit availability — we’ll communicate in advance.",
    ],
    offers: "Book with ₹2,000 advance · limited early-bird seats",
    meals: "Daily breakfast & dinner (veg / non-veg set menus)",
    stayType: "3-star category hotels · twin / triple sharing",
    transport: "Private vehicle for all sightseeing & transfers on route",
    suitableFor: "Beginners to Himalayas · adults & families in good health",
    pickupPoints: [
      { name: "Pune — Shivajinagar", detail: "05:30 AM · main ST stand, Gate A" },
      { name: "Pune — Wakad", detail: "06:00 AM · Mumbai–Pune expressway entry side" },
      { name: "Pune — Viman Nagar", detail: "06:25 AM · near Phoenix Mall signal" },
    ],
    supplements: [
      { name: "Single occupancy", price: "+ ₹6,000 for full trip", note: "Subject to room availability" },
      { name: "Flight / train to Bagdogra", price: "At actual + ₹500 handling", note: "Optional booking assistance" },
    ],
    cancellationPolicy:
      "45+ days before departure: 90% refund (excl. permits already paid).\n30–44 days: 60% refund.\n15–29 days: 40% refund.\nUnder 15 days: non-refundable except force-majeure cases reviewed individually.\nNo-show: full forfeiture.",
    bankDetails:
      "Happy Feet Travellers\nCurrent A/c: 40123456789 · ICICI Bank, Baner, Pune\nIFSC: ICIC0001234\nUPI: happyfeet@icici\n\nPlease mention: Tour name + departure date + lead traveller name in payment remarks.",
  },
  {
    id: 2,
    title: "Goa Beach Group Escape",
    departureCity: "Pune",
    category: "upcoming",
    subCategory: "beaches",
    price: 18999,
    startingPrice: 18999,
    image: IMG.goa,
    gallery: [IMG.goa, IMG.goaSunset, IMG.forest],
    duration: "4N5D",
    urgency: "Booking fast",
    bookingDeposit: 5000,
    rating: 4.7,
    reviews: 180,
    description:
      "A laid-back Goa break with handpicked stays, North & South Goa coverage and a sunset cruise — pickup right from Pune.",
    highlights: ["North Goa beach hopping", "Mandovi sunset cruise", "South Goa quiet beaches"],
    date: "10 Jun - 14 Jun 2026",
    startDate: "2026-06-10",
    endDate: "2026-06-14",
    itinerary: [
      { day: "Day 1", title: "Arrival in Goa", details: "Hotel check-in and an evening beach stroll at Baga." },
      { day: "Day 2", title: "North Goa", details: "Calangute, Baga, Anjuna and the Saturday night market." },
      { day: "Day 3", title: "South Goa", details: "Palolem and Colva beaches, plus a Mandovi river cruise." },
      { day: "Day 4", title: "Adventure & leisure", details: "Optional water sports at Baga and free time." },
      { day: "Day 5", title: "Departure", details: "Checkout and group transfer for onward travel." },
    ],
    inclusions: ["4 nights stay near Calangute", "Daily breakfast", "All local transfers in private vehicle"],
    exclusions: ["Flights/trains", "Lunches & dinners", "Watersports & entry fees"],
    faqs: [
      {
        question: "Are watersports included?",
        answer: "No — watersports are optional and charged at the operator on the day.",
      },
    ],
    thingsToCarry: ["Beachwear", "SPF 50 sunscreen", "Sunglasses & hat"],
    terms: [
      "Itinerary may be adjusted based on weather and sea conditions.",
      "Group movement timings must be followed.",
    ],
    offers: "Monsoon special · couples discount on twin sharing",
    meals: "Daily breakfast only (lunch & dinner on own / add-on)",
    stayType: "Boutique stays near North Goa beaches · AC rooms",
    transport: "AC private coach from Pune · local transfers in Goa",
    suitableFor: "Weekend escape · friends & couples",
    pickupPoints: [
      { name: "Pune — FC Road", detail: "06:00 PM · near Vaishali" },
      { name: "Pune — Katraj", detail: "06:30 PM · old NH4 pickup point" },
    ],
    supplements: [
      { name: "Mandovi sunset cruise", price: "₹550 per person", note: "Pre-book with trip captain" },
      { name: "Extra night in Goa", price: "From ₹2,800 / room", note: "Tell us before departure week" },
    ],
    cancellationPolicy:
      "30+ days: 75% refund.\n15–29 days: 50% refund.\n7–14 days: 25% refund.\nUnder 7 days: no refund.\nTransfers to another batch subject to seat availability + ₹500 fee.",
    bankDetails:
      "Happy Feet Travellers\nA/c: 40123456789 · ICICI Bank\nIFSC: ICIC0001234\nUPI: happyfeet@icici",
  },
  {
    id: 3,
    slug: "kerala-backwater-retreat",
    title: "Kerala Backwater Retreat",
    departureCity: "India",
    category: "customized",
    subCategory: "family",
    state: "Kerala",
    destination: "Munnar, Alleppey & Kochi",
    packageCategory: "Family",
    status: "active",
    featured: true,
    tags: ["Backwaters", "Houseboat", "Tea estates"],
    price: 22000,
    startingPrice: 22000,
    image: IMG.kerala,
    gallery: [IMG.kerala],
    duration: "4N5D",
    urgency: "Popular pick",
    rating: 4.9,
    reviews: 140,
    description:
      "A private Kerala journey for couples and families — Munnar tea estates, an Alleppey houseboat night and a slow finish at Kochi.",
    highlights: ["Houseboat night in Alleppey", "Munnar tea plantations", "Fort Kochi heritage walk"],
    date: "Custom dates",
    startDate: "2026-07-01",
    endDate: "2026-07-05",
    itinerary: [
      { day: "Day 1", title: "Arrival & relax", details: "Kochi airport pickup, transfer to Munnar, hotel check-in." },
      { day: "Day 2", title: "Munnar sightseeing", details: "Tea plantation walk, Eravikulam park and viewpoint stops." },
      { day: "Day 3", title: "Transfer to Alleppey", details: "Scenic drive to backwaters, board the private houseboat." },
      { day: "Day 4", title: "Backwaters & Kochi", details: "Slow morning on the houseboat, drive to Kochi, evening at Fort Kochi." },
      { day: "Day 5", title: "Departure", details: "Free morning, transfer to airport." },
    ],
    inclusions: ["Hotels & 1 night houseboat", "Daily breakfast", "Private vehicle transfers"],
    exclusions: ["Flights to/from Kochi", "Lunches & dinners (most days)"],
    faqs: [
      { question: "Can this be customised?", answer: "Yes — dates, hotels and pace can all be adjusted to your preference." },
    ],
    thingsToCarry: ["Light cottons", "Comfortable footwear", "Mosquito repellent for backwaters"],
    terms: ["Final pricing depends on hotel category and travel season."],
    offers: "Custom dates · price varies by hotels & season",
    meals: "Breakfast included · other meals as per chosen plan",
    stayType: "Heritage / boutique / 4-star — you pick the tier",
    transport: "Private AC car with driver throughout",
    suitableFor: "Couples, families & small private groups",
    pickupPoints: [
      { name: "Kochi airport / Ernakulam station", detail: "As per your arrival time" },
      { name: "Pune departure (if road package)", detail: "On request for select routes" },
    ],
    supplements: [
      { name: "Houseboat upgrade (premium)", price: "From ₹4,500 / night", note: "Subject to availability" },
      { name: "Ayurveda session", price: "From ₹1,800 / person", note: "Partner spa in Kochi" },
    ],
    cancellationPolicy:
      "Customized tours: cancellation terms shared on final quotation. Typically 25% advance is non-refundable once hotels are blocked; balance refund depends on supplier policies.",
    bankDetails:
      "Happy Feet Travellers\nA/c: 40123456789 · ICICI Bank\nIFSC: ICIC0001234\nUPI: happyfeet@icici\n(Use only after you receive a formal quotation from us.)",
  },
];

export const mockBlogs = [
  {
    id: 1,
    title: "7 Curated Group Trips That Actually Stay on Budget",
    category: "Travel guide",
    image: IMG.himalayas,
    date: "05 May 2026",
    author: "Happy Feet Team",
    authorPhoto:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80",
    authorInstagram: "happyfeettravellers",
    excerpt:
      "From Spiti to Goa — short, honest notes on which curated group trips deliver the best value across India.",
    content: [
      "When you book a group tour, the sticker price is only half the story. What matters is what is included — transfers, meals, hotel category — and whether the operator is transparent when something changes.",
      "In this guide we compare seven popular routes we run as fixed departures: what you typically pay, what is worth upgrading, and where you can save without ruining the experience.",
      "Rule of thumb: if a brochure is vague about hotels, ask for names before you pay. We publish stay names after confirmation for every batch so you know exactly what you are getting.",
    ],
  },
  {
    id: 2,
    title: "Packing Smart for the Indian Mountains",
    category: "Tips",
    image: IMG.blogPacking,
    date: "28 Apr 2026",
    author: "Trip Captain",
    authorPhoto:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
    authorInstagram: null,
    excerpt:
      "What to actually pack for Sikkim, Spiti and Himachal — without overstuffing your duffel or freezing at 3,500m.",
    content: [
      "Layers beat one thick jacket. You will peel off by noon and need warmth again after sunset — especially in Sikkim and Himachal.",
      "Carry a dry bag for electronics during monsoon drives, and keep photocopies of ID separate from originals for permit checkpoints.",
      "Footwear: broken-in shoes with grip for wet stone steps. Pack light — porters are not part of our group departures and you will handle your own bag at some homestays.",
    ],
  },
  {
    id: 3,
    title: "When Should You Visit the Northeast?",
    category: "Destination",
    image: IMG.blogNotes,
    date: "18 Apr 2026",
    author: "Happy Feet Team",
    authorPhoto:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    authorInstagram: "happyfeettravellers",
    excerpt:
      "A month-by-month look at Sikkim, Meghalaya and Arunachal — when the trails are open and when to skip the rains.",
    content: [
      "Spring (March–May) brings rhododendrons and clearer views in Sikkim; expect cold mornings at altitude.",
      "Monsoon (June–September) is lush but landslide-prone on hill roads — we sometimes reroute or postpone batches for safety.",
      "Autumn and early winter are crowd favourites for Meghalaya living root bridges and clear skies — book departures at least six weeks ahead.",
    ],
  },
];

export const mockGalleryImages = [
  {
    id: "g1",
    image: IMG.goa,
    altText: "Sunset at a Goa beach",
    title: "Goa",
  },
  {
    id: "g2",
    image: IMG.sikkim,
    altText: "Mountain valley in Sikkim",
    title: "Sikkim",
  },
  {
    id: "g3",
    image: IMG.kerala,
    altText: "Kerala backwaters",
    title: "Kerala",
  },
  {
    id: "g4",
    image: IMG.rajasthan,
    altText: "Rajasthan fort at golden hour",
    title: "Rajasthan",
  },
  {
    id: "g5",
    image: IMG.himalayas,
    altText: "Himalayan peaks above the clouds",
    title: "Himalayas",
  },
  {
    id: "g6",
    image: IMG.snowMtn,
    altText: "Snow-covered mountain trail",
    title: "Winter trails",
  },
];
