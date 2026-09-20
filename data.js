// All amounts in rupees (not crore) for clean arithmetic.
// crore -> rupees: multiply by 1,00,00,000 (1e7)
const CR = 1e7;
const LAKH = 1e5;

// Icon strings are inner SVG markup for a 24x24 viewBox, stroke-based,
// deliberately simple geometric shapes — not photos or real likenesses of
// the people involved.
const ICONS = {
  tower:
    '<path d="M12 2v20M8.5 6a5.5 5.5 0 0 0 0 8.5M15.5 6a5.5 5.5 0 0 1 0 8.5M5.5 3a9.5 9.5 0 0 0 0 14M18.5 3a9.5 9.5 0 0 1 0 14"/>',
  coal:
    '<path d="M3 19h18M6 19c0-4.5 2.2-8 6-8s6 3.5 6 8"/><circle cx="9.5" cy="14.5" r="1"/><circle cx="14.5" cy="13" r="1"/><circle cx="12" cy="16.5" r="1"/>',
  hay:
    '<rect x="5" y="7" width="14" height="10" rx="5"/><path d="M8 7v10M16 7v10"/>',
  scales:
    '<path d="M12 3v18M6 21h12M4 8h16"/><path d="M7 8l-3.5 7h7L7 8z"/><path d="M17 8l-3.5 7h7L17 8z"/>',
  building:
    '<path d="M3 10l9-6 9 6"/><path d="M5 10v9M19 10v9M2.5 19h19"/><path d="M9 19v-6h6v6"/>',
  plane: '<path d="M21 3L3 10.5l7 2.5 2.5 7L21 3z"/><path d="M12.5 13.5L21 3"/>',
  road:
    '<path d="M6 21L10 3h4l4 18"/><path d="M12 6.5v2M12 11.5v2M12 16.5v2"/>',
  health: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M12 8v8M8 12h8"/>',
  school:
    '<path d="M12 3l10 5-10 5L2 8l10-5z"/><path d="M6 10.5V16c0 1.5 2.5 3 6 3s6-1.5 6-3v-5.5"/>',
  hospital:
    '<rect x="4" y="8" width="16" height="13" rx="1"/><path d="M4 8l8-5 8 5"/><path d="M12 11.5v5M9.5 14h5"/>',
  train:
    '<rect x="4" y="6" width="16" height="10" rx="3"/><path d="M4 11h16"/><circle cx="8" cy="19" r="1.3"/><circle cx="16" cy="19" r="1.3"/>',
  bridge:
    '<path d="M2 17c3-6 7-9 10-9s7 3 10 9"/><path d="M2 17h20"/><path d="M7 17v-3M12 17v-5M17 17v-3"/>',
  stadium: '<ellipse cx="12" cy="12" rx="10" ry="6"/><ellipse cx="12" cy="12" rx="6" ry="3"/>',
  medal:
    '<circle cx="12" cy="15" r="5"/><path d="M9 11L7 3h3l2 6M15 11l2-8h-3l-2 6"/>',
};

const CASES = [
  {
    id: "2g",
    name: "2G Spectrum Allocation",
    icon: ICONS.tower,
    who: "Ministry of Communications, 2008",
    party: "UPA / Congress-led government",
    amount: 176000 * CR,
    status: "cag-estimate",
    statusLabel: "CAG estimate — later acquitted",
    blurb:
      "CAG's 2010 audit put the loss from underpriced spectrum at ₹1.76 lakh crore; a 2017 court acquitted everyone accused.",
    source: "https://en.wikipedia.org/wiki/2G_spectrum_case",
    sourceLabel: "2G spectrum case",
  },
  {
    id: "coal",
    name: "Coal Block Allocations",
    icon: ICONS.coal,
    who: "Ministry of Coal, 2004–2009",
    party: "UPA / Congress-led government",
    amount: 186000 * CR,
    status: "cag-estimate",
    statusLabel: "CAG-estimated loss",
    blurb:
      "194 coal blocks given out without auction; CAG estimated a ₹1.86 lakh crore loss. Supreme Court later cancelled 214 allocations.",
    source: "https://en.wikipedia.org/wiki/Coal_allocation_scam",
    sourceLabel: "Coal allocation scam",
  },
  {
    id: "fodder",
    name: "Fodder Scam",
    icon: ICONS.hay,
    who: "Bihar Animal Husbandry Dept.",
    party: "Convicted: Lalu Prasad Yadav (RJD)",
    amount: 39.59 * CR,
    status: "convicted",
    statusLabel: "Convicted",
    blurb:
      "Fake bills siphoned livestock-care funds for years. Lalu Prasad Yadav convicted for ₹39.59 crore across two treasuries.",
    source: "https://en.wikipedia.org/wiki/Fodder_scam",
    sourceLabel: "Fodder scam",
  },
  {
    id: "da-case",
    name: "Disproportionate Assets Case",
    icon: ICONS.scales,
    who: "Tamil Nadu, 1991–1996",
    party: "Convicted: J. Jayalalithaa (AIADMK)",
    amount: 100 * CR,
    status: "convicted",
    statusLabel: "Convicted — fine",
    blurb:
      "Chief Minister J. Jayalalithaa convicted in 2014 for wealth vastly beyond her known income; fined ₹100 crore.",
    source: "https://en.wikipedia.org/wiki/Disproportionate_assets_case_against_J._Jayalalithaa",
    sourceLabel: "Disproportionate assets case",
  },
  {
    id: "central-vista",
    name: "Central Vista Redevelopment",
    icon: ICONS.building,
    who: "New Delhi, ongoing since 2020",
    party: "NDA / BJP-led government",
    amount: 13169.61 * CR,
    status: "disclosed",
    statusLabel: "CAG flagged pricing",
    blurb:
      "Rebuild of Delhi's government precinct now sanctioned at ₹13,169.61 crore; 2023 CAG audit found construction pricing 64% above market rate.",
    source: "https://en.wikipedia.org/wiki/Central_Vista_Redevelopment_Project",
    sourceLabel: "Central Vista project",
  },
  {
    id: "pm-trips",
    name: "PM's Foreign Visits",
    icon: ICONS.plane,
    who: "May 2022 – Dec 2024",
    party: "NDA / BJP-led government",
    amount: 258.9 * CR,
    status: "disclosed",
    statusLabel: "Disclosed — no wrongdoing alleged",
    blurb:
      "₹258.9 crore spent on ~38 international trips. Not a corruption case — disclosed spending, value for money is the open question.",
    source: "https://madhyamamonline.com/india/bjp-govt-spends-rs-2589-crore-of-taxpayers-money-on-pm-modis-foreign-visits-1391774",
    sourceLabel: "Reported trip-cost disclosure",
  },
];

// Build-benchmark unit costs. Road & health are tied to a named government
// scheme's own published unit cost; school has no single clean official
// number across sources, so it's marked as an estimate, not equally solid.
// Fixed-order validated categorical palette (dataviz skill reference set,
// dark-mode steps) — one hue per build item, in this order, never cycled.
const BADGE_COLORS = {
  blue: "#3987e5",
  orange: "#d95926",
  aqua: "#199e70",
  yellow: "#c98500",
  magenta: "#d55181",
  green: "#008300",
  violet: "#9085e9",
  red: "#e66767",
};

const BUILD_ITEMS = [
  {
    id: "road",
    name: "km of rural road",
    icon: ICONS.road,
    color: BADGE_COLORS.blue,
    unit: "km",
    cost: 1.12 * CR,
    costLabel: "₹1.12 crore / km",
    sourced: true,
    note: "PMGSY-IV: ₹70,125cr ÷ 62,500km",
  },
  {
    id: "health",
    name: "Sub Health Centre",
    icon: ICONS.health,
    color: BADGE_COLORS.orange,
    unit: "centre",
    cost: 55.5 * LAKH,
    costLabel: "₹55.5 lakh / centre",
    sourced: true,
    note: "PM-Ayushman Bharat unit cost",
  },
  {
    id: "school",
    name: "primary school",
    icon: ICONS.school,
    color: BADGE_COLORS.aqua,
    unit: "school",
    cost: 30 * LAKH,
    costLabel: "~₹30 lakh / school",
    sourced: false,
    note: "Estimate, not an official figure",
  },
  {
    id: "medical-college",
    name: "medical college + hospital",
    icon: ICONS.hospital,
    color: BADGE_COLORS.yellow,
    unit: "college",
    cost: 571 * CR,
    costLabel: "₹571 crore / college",
    sourced: true,
    note: "Andhra Pradesh's 14 new colleges w/ 500-bed hospitals, ₹8,000cr total",
  },
  {
    id: "metro",
    name: "km of metro rail",
    icon: ICONS.train,
    color: BADGE_COLORS.magenta,
    unit: "km",
    cost: 182 * CR,
    costLabel: "₹182 crore / km",
    sourced: true,
    note: "Indore Metro, elevated-track cost per km",
  },
  {
    id: "flyover",
    name: "urban flyover",
    icon: ICONS.bridge,
    color: BADGE_COLORS.green,
    unit: "flyover",
    cost: 340 * CR,
    costLabel: "₹340 crore / flyover",
    sourced: true,
    note: "Garden Reach Flyover, Kolkata — real built cost",
  },
  {
    id: "stadium",
    name: "multi-sport stadium",
    icon: ICONS.stadium,
    color: BADGE_COLORS.violet,
    unit: "stadium",
    cost: 180 * CR,
    costLabel: "₹180 crore / stadium",
    sourced: true,
    note: "Raipur multi-sport venue — real built cost",
  },
  {
    id: "athlete",
    name: "elite athlete, 1 year funded",
    icon: ICONS.medal,
    color: BADGE_COLORS.red,
    unit: "athlete",
    cost: 6 * LAKH,
    costLabel: "₹6 lakh / athlete-year",
    sourced: true,
    note: "Khelo India / TOPS Out-of-Pocket Allowance, ₹50,000/month",
  },
];
