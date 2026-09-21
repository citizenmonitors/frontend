/**
 * Senatorial Election – Enugu North 2026 sample (Dataphyte-style demo totals).
 */
import {
  AreaResultRow,
  CandidateLeaderboardRow,
  CollationCandidate,
  IrevCollationData,
  MapRegion,
} from "@/app/types/irevCollation";
import { getPartyFullName } from "@/app/data/partyInfo";

export const ENUGU_NORTH_2026_SLUG = "senatorial-election-enugu-north-2026";

const colors = {
  APC: "#1B3A6B",
  PDP: "#2E7D32",
  NDC: "#C62828",
  ADC: "#00695C",
  LP: "#AD1457",
  PRP: "#5D4037",
  BP: "#455A64",
  Others: "#98A2B3",
};

const candidates: CollationCandidate[] = [
  {
    name: "Asogwa Ikeje Israel",
    party: "APC",
    votes: 187310,
    color: colors.APC,
  },
  {
    name: "Ezeme Nestor Chika",
    party: "PDP",
    votes: 6426,
    color: colors.PDP,
  },
  {
    name: "Ossai Elias Okwudili",
    party: "NDC",
    votes: 1544,
    color: colors.NDC,
  },
  {
    name: "Chika Idoko Emmanuel",
    party: "ADC",
    votes: 1472,
    color: colors.ADC,
  },
  {
    name: "Eze Ejike Simon",
    party: "LP",
    votes: 520,
    color: colors.LP,
  },
  {
    name: "Ugwuanyi Charles Ugochukwu",
    party: "PRP",
    votes: 310,
    color: colors.PRP,
  },
  {
    name: "Aneke Kingsley Chukwuebuka",
    party: "BP",
    votes: 236,
    color: colors.BP,
  },
];

const verifiedCandidates = candidates.map((c) => ({
  ...c,
  votes: Math.round(c.votes * 0.985),
}));

export const mockEnuguNorthCollation: IrevCollationData = {
  electionName: "Senatorial Election - Enugu North 2026",
  electionLabel: "Senatorial · Enugu North",
  electionType: "Senatorial",
  location: "Enugu North",
  electionDate: "2026-06-20",
  status: "completed",
  updatedAt: "2026-06-22T16:45:00+01:00",
  totalResultsPublished: 1488,
  fullyCompliantResults: 972,
  raw: {
    resultsIncluded: 972,
    totals: {
      registeredVoters: 500983,
      accreditedVoters: 105807,
      validVotes: 197818,
      rejectedVotes: 1950,
    },
    candidates,
  },
  verified: {
    resultsIncluded: 958,
    totals: {
      registeredVoters: 500983,
      accreditedVoters: 104200,
      validVotes: 194850,
      rejectedVotes: 1880,
    },
    candidates: verifiedCandidates,
  },
};

export const enuguNorthLeaderboard: CandidateLeaderboardRow[] = [
  {
    ...candidates[0],
    partyName: getPartyFullName("APC"),
    puWon: 814,
    marginLabel: "PDP + 180,884",
    topContribution: { area: "NKWO NSUKKA", votes: 102350, share: 54.64 },
  },
  {
    ...candidates[1],
    partyName: getPartyFullName("PDP"),
    puWon: 70,
    marginLabel: "NDC + 4,882",
    topContribution: { area: "Igbo-Eze North", votes: 2104, share: 32.74 },
  },
  {
    ...candidates[2],
    partyName: getPartyFullName("NDC"),
    puWon: 4,
    marginLabel: "ADC + 72",
    topContribution: { area: "Udenu", votes: 412, share: 26.68 },
  },
  {
    ...candidates[3],
    partyName: getPartyFullName("ADC"),
    puWon: 3,
    marginLabel: "LP + 952",
    topContribution: { area: "Igbo-Etiti", votes: 388, share: 26.36 },
  },
  {
    ...candidates[4],
    partyName: getPartyFullName("LP"),
    puWon: 3,
    marginLabel: "PRP + 210",
    topContribution: { area: "Nsukka", votes: 142, share: 27.31 },
  },
  {
    ...candidates[5],
    partyName: getPartyFullName("PRP"),
    puWon: 0,
    marginLabel: "BP + 74",
    topContribution: { area: "Uzo-Uwani", votes: 88, share: 28.39 },
  },
  {
    ...candidates[6],
    partyName: getPartyFullName("BP"),
    puWon: 0,
    marginLabel: "—",
    topContribution: { area: "Igbo-Eze South", votes: 61, share: 25.85 },
  },
];

function lgaRow(
  id: string,
  name: string,
  votes: [number, number, number, number],
  reported: number,
  totalUnits: number
): AreaResultRow {
  const order: Array<[keyof typeof colors, number]> = [
    ["APC", votes[0]],
    ["PDP", votes[1]],
    ["NDC", votes[2]],
    ["ADC", votes[3]],
  ];
  const sorted = [...order].sort((a, b) => b[1] - a[1]);
  return {
    id,
    name,
    reported,
    totalUnits,
    path: { state: "Enugu", lga: name },
    places: sorted.map(([party, v]) => ({
      party,
      votes: v,
      color: colors[party],
    })),
  };
}

/** Six Enugu North LGAs — APC leads in all */
export const enuguNorthLgaRows: AreaResultRow[] = [
  lgaRow("lga-nsukka", "Nsukka", [42310, 1820, 410, 380], 248, 310),
  lgaRow("lga-igbo-eze-n", "Igbo-Eze North", [31240, 2104, 280, 220], 168, 220),
  lgaRow("lga-igbo-eze-s", "Igbo-Eze South", [28410, 890, 190, 160], 142, 198),
  lgaRow("lga-udenu", "Udenu", [26880, 720, 412, 180], 155, 210),
  lgaRow("lga-uzo-uwani", "Uzo-Uwani", [30120, 540, 140, 150], 132, 180),
  lgaRow("lga-igbo-etiti", "Igbo-Etiti", [28350, 352, 112, 382], 127, 170),
];

/** Simplified Enugu North district choropleth */
export const enuguNorthMapRegions: MapRegion[] = [
  {
    id: "en-ign",
    name: "Igbo-Eze North",
    party: "APC",
    color: colors.APC,
    path: "M140 30 L220 25 L235 85 L155 95 Z",
  },
  {
    id: "en-igs",
    name: "Igbo-Eze South",
    party: "APC",
    color: colors.APC,
    path: "M155 95 L235 85 L230 145 L150 150 Z",
  },
  {
    id: "en-udenu",
    name: "Udenu",
    party: "APC",
    color: colors.APC,
    path: "M235 85 L310 70 L320 140 L230 145 Z",
  },
  {
    id: "en-nsukka",
    name: "Nsukka",
    party: "APC",
    color: colors.APC,
    path: "M150 150 L230 145 L225 210 L140 205 Z",
  },
  {
    id: "en-uzo",
    name: "Uzo-Uwani",
    party: "APC",
    color: colors.APC,
    path: "M70 160 L150 150 L140 205 L55 215 Z",
  },
  {
    id: "en-etiti",
    name: "Igbo-Etiti",
    party: "APC",
    color: colors.APC,
    path: "M140 205 L225 210 L220 270 L130 265 Z",
  },
];

export const enuguNorthMapLegend = [
  { party: "APC", label: "6 LGAs won by APC", color: colors.APC },
];

export function getEnuguNorthChartCandidates(): CollationCandidate[] {
  const top = candidates.slice(0, 4);
  const restVotes = candidates.slice(4).reduce((s, c) => s + c.votes, 0);
  return [
    ...top,
    {
      name: "Others",
      party: "Others",
      votes: restVotes,
      color: colors.Others,
    },
  ];
}

export function getEnuguNorthElectionDetail() {
  return {
    slug: ENUGU_NORTH_2026_SLUG,
    election: mockEnuguNorthCollation,
    description:
      "Follow results and updates from the Enugu North Senatorial District 2026 Senatorial Election.",
    year: "2026",
    location: "Enugu North",
    incidentCount: 0,
    leaderboard: enuguNorthLeaderboard,
    lgas: enuguNorthLgaRows,
    ras: [] as AreaResultRow[],
    pus: [] as AreaResultRow[],
    mapRegions: enuguNorthMapRegions,
    mapLegend: enuguNorthMapLegend,
    chartCandidates: getEnuguNorthChartCandidates(),
    geographyLabel: "LGAs" as const,
    coverageLabel: "Result coverage" as const,
    unitLabel: "polling units" as const,
  };
}
