/**
 * Presidential Election – Nigeria 2023 sample (INEC-style totals for UI demos).
 */
import {
  AreaResultRow,
  CandidateLeaderboardRow,
  CollationCandidate,
  IrevCollationData,
  MapRegion,
} from "@/app/types/irevCollation";
import { getPartyFullName } from "@/app/data/partyInfo";

export const PRESIDENTIAL_2023_SLUG = "presidential-election-2023";

const colors = {
  APC: "#1B3A6B",
  PDP: "#1B5E20",
  LP: "#C62828",
  NNPP: "#00838F",
  ADC: "#00897B",
  Others: "#98A2B3",
};

const presidentialCandidates: CollationCandidate[] = [
  {
    name: "TINUBU BOLA AHMED",
    party: "APC",
    votes: 8805655,
    color: colors.APC,
  },
  {
    name: "ABUBAKAR ATIKU",
    party: "PDP",
    votes: 6984520,
    color: colors.PDP,
  },
  {
    name: "OBI PETER GREGORY",
    party: "LP",
    votes: 6101533,
    color: colors.LP,
  },
  {
    name: "MUSA MOHAMMED RABIU KWANKWASO",
    party: "NNPP",
    votes: 1496687,
    color: colors.NNPP,
  },
  {
    name: "KACHIKWU DUMEBI",
    party: "ADC",
    votes: 81919,
    color: colors.ADC,
  },
];

const verifiedCandidates = presidentialCandidates.map((c) => ({
  ...c,
  votes: Math.round(c.votes * 0.97),
}));

export const mockPresidentialCollation: IrevCollationData = {
  electionName: "Presidential Election – Nigeria 2023",
  electionLabel: "Presidential · Nigeria",
  electionType: "Presidential",
  location: "Nigeria",
  electionDate: "2023-02-25",
  status: "completed",
  updatedAt: "2023-03-01T18:00:00+01:00",
  totalResultsPublished: 37,
  fullyCompliantResults: 37,
  raw: {
    resultsIncluded: 37,
    totals: {
      registeredVoters: 93469008,
      accreditedVoters: 25286616,
      validVotes: 24036847,
      rejectedVotes: 939125,
    },
    candidates: presidentialCandidates,
  },
  verified: {
    resultsIncluded: 36,
    totals: {
      registeredVoters: 93469008,
      accreditedVoters: 24528000,
      validVotes: 23315741,
      rejectedVotes: 880000,
    },
    candidates: verifiedCandidates,
  },
};

export const presidentialLeaderboard: CandidateLeaderboardRow[] = [
  {
    ...presidentialCandidates[0],
    partyName: getPartyFullName("APC"),
    puWon: 12,
    marginLabel: "PDP + 1,821,135",
    topContribution: { area: "Lagos", votes: 572606, share: 6.5 },
  },
  {
    ...presidentialCandidates[1],
    partyName: getPartyFullName("PDP"),
    puWon: 12,
    marginLabel: "LP + 882,987",
    topContribution: { area: "Kaduna", votes: 554344, share: 7.9 },
  },
  {
    ...presidentialCandidates[2],
    partyName: getPartyFullName("LP"),
    puWon: 12,
    marginLabel: "NNPP + 4,604,846",
    topContribution: { area: "Anambra", votes: 584258, share: 9.6 },
  },
  {
    ...presidentialCandidates[3],
    partyName: getPartyFullName("NNPP"),
    puWon: 1,
    marginLabel: "ADC + 1,414,768",
    topContribution: { area: "Kano", votes: 997279, share: 66.6 },
  },
  {
    ...presidentialCandidates[4],
    partyName: getPartyFullName("ADC"),
    puWon: 0,
    marginLabel: "—",
    topContribution: { area: "Ogun", votes: 9102, share: 11.1 },
  },
];

function stateRow(
  id: string,
  name: string,
  winner: keyof typeof colors,
  votes: [number, number, number, number]
): AreaResultRow {
  const order: Array<[keyof typeof colors, number]> = [
    ["APC", votes[0]],
    ["PDP", votes[1]],
    ["LP", votes[2]],
    ["NNPP", votes[3]],
  ];
  const sorted = [...order].sort((a, b) => b[1] - a[1]);
  return {
    id,
    name,
    reported: 1,
    totalUnits: 1,
    path: { state: name },
    places: sorted.map(([party, v]) => ({
      party,
      votes: v,
      color: colors[party],
    })),
  };
}

/** Sample state-level rows for Candidates | States toggle */
export const presidentialStateRows: AreaResultRow[] = [
  stateRow("st-lagos", "Lagos", "APC", [572606, 180000, 582000, 12000]),
  stateRow("st-kano", "Kano", "NNPP", [171409, 131000, 28000, 997279]),
  stateRow("st-kaduna", "Kaduna", "PDP", [390000, 554344, 210000, 18000]),
  stateRow("st-anambra", "Anambra", "LP", [5000, 9000, 584258, 2000]),
  stateRow("st-rivers", "Rivers", "LP", [88000, 120000, 320000, 4000]),
  stateRow("st-oyo", "Oyo", "APC", [380000, 290000, 110000, 8000]),
  stateRow("st-delta", "Delta", "LP", [90000, 180000, 310000, 5000]),
  stateRow("st-imo", "Imo", "LP", [66000, 45000, 360000, 3000]),
  stateRow("st-fct", "FCT (Abuja)", "LP", [90000, 74000, 281000, 6000]),
  stateRow("st-borno", "Borno", "APC", [420000, 180000, 12000, 4000]),
  stateRow("st-sokoto", "Sokoto", "PDP", [190000, 360000, 8000, 3000]),
  stateRow("st-plateau", "Plateau", "LP", [120000, 150000, 420000, 9000]),
];

/** Illustrative nationwide choropleth (simplified shapes) */
export const presidentialMapRegions: MapRegion[] = [
  { id: "nw1", name: "Sokoto", party: "PDP", color: colors.PDP, path: "M40 30 L90 25 L100 70 L50 80 Z" },
  { id: "nw2", name: "Katsina", party: "PDP", color: colors.PDP, path: "M100 25 L150 20 L160 65 L100 70 Z" },
  { id: "nw3", name: "Kano", party: "NNPP", color: colors.NNPP, path: "M160 20 L210 30 L200 80 L150 70 Z" },
  { id: "ne1", name: "Borno", party: "APC", color: colors.APC, path: "M250 30 L320 40 L310 100 L240 90 Z" },
  { id: "ne2", name: "Yobe", party: "PDP", color: colors.PDP, path: "M210 30 L250 30 L240 90 L200 80 Z" },
  { id: "nc1", name: "Kaduna", party: "PDP", color: colors.PDP, path: "M140 90 L190 85 L200 140 L145 150 Z" },
  { id: "nc2", name: "Niger", party: "APC", color: colors.APC, path: "M90 90 L140 90 L145 150 L80 145 Z" },
  { id: "nc3", name: "FCT", party: "LP", color: colors.LP, path: "M145 150 L175 148 L180 175 L150 180 Z" },
  { id: "nc4", name: "Plateau", party: "LP", color: colors.LP, path: "M200 140 L245 135 L250 185 L200 190 Z" },
  { id: "sw1", name: "Lagos", party: "LP", color: colors.LP, path: "M60 230 L110 225 L115 260 L55 255 Z" },
  { id: "sw2", name: "Oyo", party: "APC", color: colors.APC, path: "M70 180 L120 175 L125 220 L75 225 Z" },
  { id: "sw3", name: "Ogun", party: "APC", color: colors.APC, path: "M55 215 L110 210 L115 240 L50 245 Z" },
  { id: "ss1", name: "Rivers", party: "LP", color: colors.LP, path: "M180 240 L230 235 L235 275 L175 270 Z" },
  { id: "ss2", name: "Delta", party: "LP", color: colors.LP, path: "M140 220 L180 215 L185 255 L145 260 Z" },
  { id: "se1", name: "Anambra", party: "LP", color: colors.LP, path: "M200 200 L235 195 L240 230 L205 235 Z" },
  { id: "se2", name: "Imo", party: "LP", color: colors.LP, path: "M205 235 L240 230 L245 260 L210 265 Z" },
  { id: "se3", name: "Enugu", party: "LP", color: colors.LP, path: "M235 185 L270 180 L275 220 L240 225 Z" },
  { id: "nc5", name: "Benue", party: "APC", color: colors.APC, path: "M245 160 L290 155 L295 200 L250 205 Z" },
  { id: "ne3", name: "Adamawa", party: "PDP", color: colors.PDP, path: "M290 100 L340 110 L330 160 L285 150 Z" },
  { id: "nw4", name: "Zamfara", party: "PDP", color: colors.PDP, path: "M70 70 L110 65 L120 105 L80 110 Z" },
];

export const presidentialMapLegend = [
  { party: "APC", label: "12 STATES WON BY APC", color: colors.APC },
  { party: "PDP", label: "12 STATES WON BY PDP", color: colors.PDP },
  { party: "LP", label: "12 STATES WON BY LP", color: colors.LP },
  { party: "NNPP", label: "1 STATE WON BY NNPP", color: colors.NNPP },
];

export function getPresidentialElectionDetail() {
  return {
    slug: PRESIDENTIAL_2023_SLUG,
    election: mockPresidentialCollation,
    description:
      "Follow results and updates from the Nigeria 2023 Presidential Election.",
    year: "2023",
    location: "Nigeria",
    incidentCount: 0,
    leaderboard: presidentialLeaderboard,
    lgas: presidentialStateRows,
    ras: [] as AreaResultRow[],
    pus: [] as AreaResultRow[],
    mapRegions: presidentialMapRegions,
    mapLegend: presidentialMapLegend,
    chartCandidates: presidentialCandidates,
    geographyLabel: "States" as const,
    coverageLabel: "Result coverage" as const,
  };
}
