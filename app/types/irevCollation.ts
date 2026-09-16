export type CollationMode = "raw" | "verified";

export type CollationCandidate = {
  name: string;
  party: string;
  votes: number;
  color: string;
};

/** Shape returned by results chart endpoints (bar + donut share the same series) */
export type ElectionChartSeriesItem = {
  id: string;
  name: string;
  party: string;
  partyName: string;
  votes: number;
  share: number;
  color: string;
};

export type ElectionChartsPayload = {
  updatedAt: string;
  series: ElectionChartSeriesItem[];
};

export type CollationTotals = {
  registeredVoters: number;
  accreditedVoters: number;
  validVotes: number;
  rejectedVotes: number;
};

export type CollationSlice = {
  /** Number of IREV results included in this collation view */
  resultsIncluded: number;
  totals: CollationTotals;
  candidates: CollationCandidate[];
};

export type IrevCollationData = {
  electionName: string;
  electionLabel: string;
  electionType: string;
  location: string;
  electionDate: string;
  status: "live" | "completed";
  updatedAt: string;
  /** Total results published on IREV (denominator for the score) */
  totalResultsPublished: number;
  /** Results that pass Validity + all four Integrity checks */
  fullyCompliantResults: number;
  raw: CollationSlice;
  verified: CollationSlice;
};

export type RecentElectionCard = {
  id: string;
  slug: string;
  electionType: string;
  status: "live" | "completed";
  title: string;
  date: string;
  location: string;
  winnerName: string;
  winnerParty: string;
  winnerColor: string;
  voteShare: number;
  fullyCompliantResults: number;
  totalResultsPublished: number;
};

export type ScoreBand = "high" | "moderate" | "low";

export type ResultViewMode = "candidates" | "lgas" | "ras" | "pus";

export type ElectionDetailTab = "result" | "post-incident";

export type CandidateLeaderboardRow = CollationCandidate & {
  partyName: string;
  puWon: number;
  marginLabel: string;
  topContribution: {
    area: string;
    votes: number;
    share: number;
  };
};

export type AreaResultPath = {
  state: string;
  lga?: string;
  ward?: string;
  pollingUnit?: string;
};

export type AreaResultRow = {
  id: string;
  name: string;
  places: Array<{ party: string; votes: number; color: string }>;
  reported: number;
  totalUnits: number;
  /** Parent LGA id (wards) or parent ward id (PUs) for drill-down */
  parentId?: string;
  path?: AreaResultPath;
};

export type MapRegion = {
  id: string;
  name: string;
  party: string;
  color: string;
  path: string;
};