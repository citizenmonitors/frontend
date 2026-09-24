import {
  AreaResultRow,
  CandidateLeaderboardRow,
  CollationCandidate,
  MapRegion,
} from "@/app/types/irevCollation";
import { mockIrevCollation, mockRecentElections } from "./mockIrevCollation";

export const OSUN_ELECTION_SLUG = "governorship-election-osun-2026";

export const partyFullNames: Record<string, string> = {
  A: "Accord",
  APC: "All Progressives Congress",
  ADC: "African Democratic Congress",
  ADP: "Action Democratic Party",
  ZLP: "Zenith Labour Party",
  AA: "Action Alliance",
  AAC: "African Action Congress",
  APGA: "All Progressives Grand Alliance",
  YPP: "Young Progressives Party",
  APM: "Allied Peoples Movement",
  SDP: "Social Democratic Party",
  NNPP: "New Nigeria Peoples Party",
  BP: "Boot Party",
  APP: "Action Peoples Party",
  PRP: "Peoples Redemption Party",
  PDP: "Peoples Democratic Party",
  LP: "Labour Party",
  NDC: "Nigeria Democratic Congress",
  Others: "Others",
};

const baseCandidates = mockIrevCollation.raw.candidates;

export const mockCandidateLeaderboard: CandidateLeaderboardRow[] = [
  {
    ...baseCandidates[0],
    partyName: partyFullNames.A,
    puWon: 2148,
    marginLabel: "APC + 74,398",
    topContribution: { area: "Ife East", votes: 36602, share: 6.96 },
  },
  {
    ...baseCandidates[1],
    partyName: partyFullNames.APC,
    puWon: 1482,
    marginLabel: "A − 74,398",
    topContribution: { area: "Ilesa East", votes: 28910, share: 6.4 },
  },
  {
    ...baseCandidates[2],
    partyName: partyFullNames.ADC,
    puWon: 41,
    marginLabel: "A − 508,556",
    topContribution: { area: "Osogbo", votes: 2104, share: 11.97 },
  },
  {
    ...baseCandidates[3],
    partyName: partyFullNames.ADP,
    puWon: 4,
    marginLabel: "A − 523,107",
    topContribution: { area: "Ede South", votes: 412, share: 13.61 },
  },
  ...baseCandidates.slice(4).map((c, i) => ({
    ...c,
    partyName: partyFullNames[c.party] || c.party,
    puWon: Math.max(0, 3 - i),
    marginLabel: `A − ${Math.max(c.votes, 1).toLocaleString()}`,
    topContribution: {
      area: ["Osogbo", "Irepodun", "Boripe", "Olorunda"][i % 4],
      votes: Math.round(c.votes * 0.18),
      share: 8 + (i % 5),
    },
  })),
];

function placesFromParties(
  order: Array<[string, number]>
): AreaResultRow["places"] {
  const colorByParty: Record<string, string> = Object.fromEntries(
    baseCandidates.map((c) => [c.party, c.color])
  );
  return order.map(([party, votes]) => ({
    party,
    votes,
    color: colorByParty[party] || "#98A2B3",
  }));
}

export const mockLgaRows: AreaResultRow[] = [
  {
    id: "lga-1",
    name: "Atakunmosa East",
    places: placesFromParties([
      ["APC", 8938],
      ["A", 7120],
      ["ADC", 410],
      ["ZLP", 88],
    ]),
    reported: 77,
    totalUnits: 77,
  },
  {
    id: "lga-2",
    name: "Atakunmosa West",
    places: placesFromParties([
      ["A", 10221],
      ["APC", 8840],
      ["ADC", 520],
      ["ADP", 102],
    ]),
    reported: 68,
    totalUnits: 68,
  },
  {
    id: "lga-3",
    name: "Aiyedaade",
    places: placesFromParties([
      ["A", 15402],
      ["APC", 12110],
      ["ADC", 690],
      ["AA", 140],
    ]),
    reported: 112,
    totalUnits: 114,
  },
  {
    id: "lga-4",
    name: "Aiyedire",
    places: placesFromParties([
      ["APC", 9801],
      ["A", 9012],
      ["ADC", 301],
      ["ADP", 77],
    ]),
    reported: 54,
    totalUnits: 54,
  },
  {
    id: "lga-5",
    name: "Boluwaduro",
    places: placesFromParties([
      ["A", 6120],
      ["APC", 5402],
      ["ADC", 188],
      ["ZLP", 41],
    ]),
    reported: 41,
    totalUnits: 41,
  },
  {
    id: "lga-6",
    name: "Boripe",
    places: placesFromParties([
      ["A", 18220],
      ["APC", 14102],
      ["ADC", 720],
      ["ADP", 155],
    ]),
    reported: 98,
    totalUnits: 99,
  },
  {
    id: "lga-7",
    name: "Ede North",
    places: placesFromParties([
      ["A", 22140],
      ["APC", 16880],
      ["ADC", 810],
      ["ADP", 190],
    ]),
    reported: 105,
    totalUnits: 105,
  },
  {
    id: "lga-8",
    name: "Ede South",
    places: placesFromParties([
      ["A", 19802],
      ["APC", 15210],
      ["ADC", 640],
      ["ZLP", 120],
    ]),
    reported: 88,
    totalUnits: 90,
  },
  {
    id: "lga-9",
    name: "Egbedore",
    places: placesFromParties([
      ["APC", 11440],
      ["A", 10920],
      ["ADC", 402],
      ["AA", 95],
    ]),
    reported: 72,
    totalUnits: 72,
  },
  {
    id: "lga-10",
    name: "Ejigbo",
    places: placesFromParties([
      ["A", 16770],
      ["APC", 14110],
      ["ADC", 555],
      ["ADP", 130],
    ]),
    reported: 96,
    totalUnits: 96,
  },
  {
    id: "lga-11",
    name: "Ife Central",
    places: placesFromParties([
      ["A", 24510],
      ["APC", 19880],
      ["ADC", 920],
      ["AA", 210],
    ]),
    reported: 140,
    totalUnits: 142,
  },
  {
    id: "lga-12",
    name: "Ife East",
    places: placesFromParties([
      ["A", 36602],
      ["APC", 28910],
      ["ADC", 1102],
      ["ADP", 260],
    ]),
    reported: 168,
    totalUnits: 170,
  },
  {
    id: "lga-13",
    name: "Ife North",
    places: placesFromParties([
      ["A", 13220],
      ["APC", 11840],
      ["ADC", 488],
      ["ZLP", 101],
    ]),
    reported: 84,
    totalUnits: 84,
  },
  {
    id: "lga-14",
    name: "Ife South",
    places: placesFromParties([
      ["APC", 12110],
      ["A", 11040],
      ["ADC", 390],
      ["ADP", 88],
    ]),
    reported: 79,
    totalUnits: 80,
  },
  {
    id: "lga-15",
    name: "Ifedayo",
    places: placesFromParties([
      ["A", 4880],
      ["APC", 4210],
      ["ADC", 155],
      ["AA", 40],
    ]),
    reported: 32,
    totalUnits: 32,
  },
  {
    id: "lga-16",
    name: "Ifelodun",
    places: placesFromParties([
      ["A", 20110],
      ["APC", 17220],
      ["ADC", 710],
      ["ADP", 160],
    ]),
    reported: 118,
    totalUnits: 120,
  },
  {
    id: "lga-17",
    name: "Ila",
    places: placesFromParties([
      ["APC", 9102],
      ["A", 8840],
      ["ADC", 302],
      ["ZLP", 70],
    ]),
    reported: 61,
    totalUnits: 61,
  },
  {
    id: "lga-18",
    name: "Ilesa East",
    places: placesFromParties([
      ["APC", 15660],
      ["A", 14210],
      ["ADC", 580],
      ["ADP", 140],
    ]),
    reported: 102,
    totalUnits: 102,
  },
  {
    id: "lga-19",
    name: "Ilesa West",
    places: placesFromParties([
      ["A", 14880],
      ["APC", 13920],
      ["ADC", 510],
      ["AA", 120],
    ]),
    reported: 95,
    totalUnits: 97,
  },
  {
    id: "lga-20",
    name: "Irepodun",
    places: placesFromParties([
      ["APC", 11990],
      ["A", 11120],
      ["ADC", 420],
      ["ADP", 95],
    ]),
    reported: 78,
    totalUnits: 78,
  },
  {
    id: "lga-21",
    name: "Irewole",
    places: placesFromParties([
      ["A", 17640],
      ["APC", 15220],
      ["ADC", 640],
      ["ZLP", 130],
    ]),
    reported: 110,
    totalUnits: 111,
  },
  {
    id: "lga-22",
    name: "Isokan",
    places: placesFromParties([
      ["A", 13440],
      ["APC", 12110],
      ["ADC", 455],
      ["ADP", 102],
    ]),
    reported: 86,
    totalUnits: 86,
  },
  {
    id: "lga-23",
    name: "Iwo",
    places: placesFromParties([
      ["APC", 18990],
      ["A", 17680],
      ["ADC", 720],
      ["AA", 165],
    ]),
    reported: 124,
    totalUnits: 126,
  },
  {
    id: "lga-24",
    name: "Obokun",
    places: placesFromParties([
      ["A", 10220],
      ["APC", 9410],
      ["ADC", 340],
      ["ADP", 80],
    ]),
    reported: 70,
    totalUnits: 70,
  },
  {
    id: "lga-25",
    name: "Odo Otin",
    places: placesFromParties([
      ["A", 12110],
      ["APC", 10880],
      ["ADC", 390],
      ["ZLP", 90],
    ]),
    reported: 82,
    totalUnits: 83,
  },
  {
    id: "lga-26",
    name: "Ola Oluwa",
    places: placesFromParties([
      ["APC", 8440],
      ["A", 8120],
      ["ADC", 280],
      ["ADP", 65],
    ]),
    reported: 58,
    totalUnits: 58,
  },
  {
    id: "lga-27",
    name: "Olorunda",
    places: placesFromParties([
      ["A", 21440],
      ["APC", 18220],
      ["ADC", 780],
      ["AA", 180],
    ]),
    reported: 132,
    totalUnits: 134,
  },
  {
    id: "lga-28",
    name: "Oriade",
    places: placesFromParties([
      ["A", 15660],
      ["APC", 14110],
      ["ADC", 560],
      ["ADP", 125],
    ]),
    reported: 99,
    totalUnits: 100,
  },
  {
    id: "lga-29",
    name: "Orolu",
    places: placesFromParties([
      ["APC", 7220],
      ["A", 6980],
      ["ADC", 240],
      ["ZLP", 55],
    ]),
    reported: 48,
    totalUnits: 48,
  },
  {
    id: "lga-30",
    name: "Osogbo",
    places: placesFromParties([
      ["APC", 28840],
      ["A", 26110],
      ["ADC", 1202],
      ["ADP", 310],
    ]),
    reported: 176,
    totalUnits: 178,
  },
];

/** Registration Areas */
export const mockRaRows: AreaResultRow[] = [
  {
    id: "ra-1",
    name: "OYERE I",
    places: placesFromParties([
      ["A", 1840],
      ["APC", 1512],
      ["ADC", 66],
      ["SDP", 12],
    ]),
    reported: 11,
    totalUnits: 11,
  },
  {
    id: "ra-2",
    name: "OYERE II",
    places: placesFromParties([
      ["A", 1622],
      ["APC", 1488],
      ["ADC", 54],
      ["AA", 18],
    ]),
    reported: 9,
    totalUnits: 9,
  },
  {
    id: "ra-3",
    name: "IPETUMODU",
    places: placesFromParties([
      ["APC", 2011],
      ["A", 1888],
      ["ADC", 88],
      ["ADP", 22],
    ]),
    reported: 14,
    totalUnits: 14,
  },
  {
    id: "ra-4",
    name: "AARE",
    places: placesFromParties([
      ["APC", 1762],
      ["A", 1540],
      ["ADC", 88],
      ["ADP", 21],
    ]),
    reported: 12,
    totalUnits: 12,
  },
  {
    id: "ra-5",
    name: "ABIRI OGUDU",
    places: placesFromParties([
      ["A", 2011],
      ["APC", 1888],
      ["ADC", 102],
      ["AA", 30],
    ]),
    reported: 14,
    totalUnits: 14,
  },
  {
    id: "ra-6",
    name: "ABOGUNDE/SAGBA",
    places: placesFromParties([
      ["A", 1344],
      ["APC", 1201],
      ["ADC", 66],
      ["ZLP", 18],
    ]),
    reported: 9,
    totalUnits: 9,
  },
  {
    id: "ra-7",
    name: "AGOWANDE",
    places: placesFromParties([
      ["APC", 990],
      ["A", 870],
      ["ADC", 44],
      ["ADP", 12],
    ]),
    reported: 8,
    totalUnits: 8,
  },
  {
    id: "ra-8",
    name: "EDE URBAN",
    places: placesFromParties([
      ["A", 3210],
      ["APC", 2780],
      ["ADC", 120],
      ["AA", 40],
    ]),
    reported: 18,
    totalUnits: 18,
  },
];

/** Polling Units */
export const mockPuRows: AreaResultRow[] = [
  {
    id: "pu-1",
    name: "ST. RAPHAEL'S SCHOOL, TORO",
    places: placesFromParties([
      ["A", 120],
      ["APC", 76],
      ["SDP", 1],
      ["ADC", 0],
      ["AA", 0],
    ]),
    reported: 1,
    totalUnits: 1,
  },
  {
    id: "pu-2",
    name: "COMMUNITY PRIMARY SCHOOL, OYERE",
    places: placesFromParties([
      ["A", 156],
      ["APC", 132],
      ["ADC", 8],
      ["AA", 2],
    ]),
    reported: 1,
    totalUnits: 1,
  },
  {
    id: "pu-3",
    name: "TOWN HALL, TORO",
    places: placesFromParties([
      ["APC", 148],
      ["A", 141],
      ["ADC", 6],
      ["SDP", 2],
    ]),
    reported: 1,
    totalUnits: 1,
  },
  {
    id: "pu-4",
    name: "O/S, INFRONT OF HEALTH CENTRE",
    places: placesFromParties([
      ["APC", 189],
      ["A", 176],
      ["ADC", 10],
      ["ZLP", 4],
      ["AA", 1],
    ]),
    reported: 1,
    totalUnits: 1,
  },
  {
    id: "pu-5",
    name: "ANGLICAN PRIMARY SCHOOL",
    places: placesFromParties([
      ["A", 201],
      ["APC", 188],
      ["ADC", 11],
      ["ZLP", 2],
    ]),
    reported: 1,
    totalUnits: 1,
  },
  {
    id: "pu-6",
    name: "OBAWARA, OFF ILODE",
    places: placesFromParties([
      ["A", 178],
      ["APC", 142],
      ["ADC", 9],
      ["AA", 3],
      ["ADP", 1],
    ]),
    reported: 1,
    totalUnits: 1,
  },
  {
    id: "pu-7",
    name: "1 AKEPE STREET",
    places: placesFromParties([
      ["APC", 201],
      ["A", 188],
      ["ADC", 11],
      ["ZLP", 2],
      ["AA", 1],
    ]),
    reported: 1,
    totalUnits: 1,
  },
  {
    id: "pu-8",
    name: "STADIUM ROAD JUNCTION",
    places: placesFromParties([
      ["A", 256],
      ["APC", 210],
      ["ADC", 14],
      ["ADP", 4],
      ["AA", 2],
    ]),
    reported: 1,
    totalUnits: 1,
  },
  {
    id: "pu-9",
    name: "COMMUNITY HALL, ILOBÚ",
    places: placesFromParties([
      ["A", 167],
      ["APC", 159],
      ["ADC", 8],
      ["AAC", 3],
      ["ADP", 1],
    ]),
    reported: 1,
    totalUnits: 1,
  },
  {
    id: "pu-10",
    name: "27, AKINDEKO STREET",
    places: placesFromParties([
      ["A", 214],
      ["APC", 198],
      ["ADC", 12],
      ["ADP", 3],
      ["AA", 2],
    ]),
    reported: 1,
    totalUnits: 1,
  },
];

/** Simplified choropleth regions (illustrative Osun-style map) */
export const mockMapRegions: MapRegion[] = [
  {
    id: "r1",
    name: "Ife North",
    party: "A",
    color: "#64CC46",
    path: "M80 40 L140 30 L170 70 L130 110 L70 95 Z",
  },
  {
    id: "r2",
    name: "Ife East",
    party: "A",
    color: "#64CC46",
    path: "M170 70 L220 55 L250 100 L210 140 L130 110 Z",
  },
  {
    id: "r3",
    name: "Ife South",
    party: "APC",
    color: "#1B3A6B",
    path: "M130 110 L210 140 L190 190 L120 175 L100 140 Z",
  },
  {
    id: "r4",
    name: "Ejigbo",
    party: "A",
    color: "#64CC46",
    path: "M40 90 L70 95 L100 140 L60 170 L25 130 Z",
  },
  {
    id: "r5",
    name: "Ola Oluwa",
    party: "APC",
    color: "#1B3A6B",
    path: "M25 130 L60 170 L55 220 L15 200 L10 155 Z",
  },
  {
    id: "r6",
    name: "Ede North",
    party: "A",
    color: "#64CC46",
    path: "M100 140 L120 175 L160 200 L110 230 L70 195 Z",
  },
  {
    id: "r7",
    name: "Ede South",
    party: "A",
    color: "#64CC46",
    path: "M160 200 L190 190 L230 220 L180 250 L110 230 Z",
  },
  {
    id: "r8",
    name: "Osogbo",
    party: "APC",
    color: "#1B3A6B",
    path: "M210 140 L250 100 L290 130 L270 180 L230 170 Z",
  },
  {
    id: "r9",
    name: "Olorunda",
    party: "A",
    color: "#64CC46",
    path: "M230 170 L270 180 L280 230 L230 220 L210 190 Z",
  },
  {
    id: "r10",
    name: "Irepodun",
    party: "APC",
    color: "#1B3A6B",
    path: "M55 220 L70 195 L110 230 L90 270 L40 250 Z",
  },
];

export const mockMapLegend = [
  { party: "A", label: "20 LGAs won by A", color: "#64CC46" },
  { party: "APC", label: "10 LGAs won by APC", color: "#1B3A6B" },
];

export const mockIncidentCount = 61;

export function getChartCandidates(): CollationCandidate[] {
  const top = baseCandidates.slice(0, 4);
  const restVotes = baseCandidates.slice(4).reduce((s, c) => s + c.votes, 0);
  return [
    ...top,
    {
      name: "Others",
      party: "Others",
      votes: restVotes,
      color: "#98A2B3",
    },
  ];
}

export function getElectionDetailBySlug(slug: string) {
  if (slug !== OSUN_ELECTION_SLUG) return null;

  const state = "Osun";
  const lgas = mockLgaRows.map((row) => ({
    ...row,
    path: { state, lga: row.name },
  }));

  const ras = mockRaRows.map((row, index) => {
    const parent = lgas[index % lgas.length];
    return {
      ...row,
      parentId: parent.id,
      path: { state, lga: parent.name, ward: row.name },
    };
  });

  const pus = mockPuRows.map((row, index) => {
    const parent = ras[index % ras.length];
    return {
      ...row,
      parentId: parent.id,
      path: {
        state,
        lga: parent.path?.lga,
        ward: parent.name,
        pollingUnit: row.name,
      },
    };
  });

  return {
    slug: OSUN_ELECTION_SLUG,
    election: mockIrevCollation,
    description:
      "Follow results and updates from the Osun State 2026 Governorship Election.",
    year: "2026",
    location: "Osun",
    incidentCount: mockIncidentCount,
    leaderboard: mockCandidateLeaderboard,
    lgas,
    ras,
    pus,
    mapRegions: mockMapRegions,
    mapLegend: mockMapLegend,
    chartCandidates: getChartCandidates(),
    geographyLabel: "LGAs" as const,
    coverageLabel: "Data Validity" as const,
  };
}

/** Human-readable title for empty / unknown result pages */
export function getElectionListingMetaBySlug(slug: string): {
  title: string;
  electionType?: string;
  location?: string;
} {
  const fromRecent = mockRecentElections.find((e) => e.slug === slug);
  if (fromRecent) {
    return {
      title: fromRecent.title,
      electionType: fromRecent.electionType,
      location: fromRecent.location,
    };
  }

  const title = slug
    .split("-")
    .map((part) =>
      /^\d{4}$/.test(part)
        ? part
        : part.charAt(0).toUpperCase() + part.slice(1)
    )
    .join(" ");

  return { title };
}

/** Latest known slug for a browse-by-type card (detail may be empty) */
export function getLatestResultSlugByType(
  type:
    | "presidential"
    | "governorship"
    | "senatorial"
    | "house-of-representatives"
    | "state-house-of-assembly"
    | "local-government"
): string {
  const byType: Record<typeof type, string> = {
    presidential: "presidential-election-2023",
    governorship: OSUN_ELECTION_SLUG,
    senatorial: "senatorial-election-enugu-north-2026",
    "house-of-representatives": "house-of-representatives-election-2023",
    "state-house-of-assembly": "state-house-of-assembly-election-2023",
    "local-government": "local-government-election-2023",
  };
  return byType[type];
}

function yearFromElection(election: (typeof mockRecentElections)[number]): string {
  const fromDate = election.date.match(/\b(20\d{2})\b/);
  if (fromDate) return fromDate[1];
  const fromTitle = election.title.match(/\b(20\d{2})\b/);
  return fromTitle?.[1] ?? "";
}

/** Unique locations that have result cards, with preferred (latest) slug */
export function getResultStateOptions(): Array<{
  location: string;
  slug: string;
  year: string;
}> {
  const byLocation = new Map<
    string,
    { location: string; slug: string; year: string }
  >();

  for (const election of mockRecentElections) {
    const year = yearFromElection(election);
    const existing = byLocation.get(election.location);
    if (!existing || year > existing.year) {
      byLocation.set(election.location, {
        location: election.location,
        slug: election.slug,
        year,
      });
    }
  }

  return Array.from(byLocation.values()).sort((a, b) =>
    a.location.localeCompare(b.location)
  );
}

/** Unique election years available in mock results */
export function getResultYearOptions(): string[] {
  const years = new Set(
    mockRecentElections.map(yearFromElection).filter(Boolean)
  );
  return Array.from(years).sort((a, b) => Number(b) - Number(a));
}

/** Resolve navigation slug when state or year filter changes */
export function resolveResultSlugForFilters(params: {
  location: string;
  year: string;
}): string | null {
  const { location, year } = params;
  const exact = mockRecentElections.find(
    (e) => e.location === location && yearFromElection(e) === year
  );
  if (exact) return exact.slug;

  const sameYear = mockRecentElections.find(
    (e) => yearFromElection(e) === year
  );
  return sameYear?.slug ?? null;
}

export function getYearForSlug(slug: string): string {
  const election = mockRecentElections.find((e) => e.slug === slug);
  if (election) return yearFromElection(election);
  const match = slug.match(/\b(20\d{2})\b/);
  return match?.[1] ?? "";
}
