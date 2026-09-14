import {
  CollationCandidate,
  ElectionChartSeriesItem,
  ElectionChartsPayload,
} from "@/app/types/irevCollation";
import { partyFullNames } from "@/app/data/mockElectionDetail";

/**
 * Maps candidate totals into the chart payload shape a live API should return.
 * Swap this for `fetchElectionCharts(electionId)` when the endpoint is ready.
 */
export function buildElectionChartsPayload(
  candidates: CollationCandidate[],
  updatedAt = new Date().toISOString()
): ElectionChartsPayload {
  const total = candidates.reduce((sum, c) => sum + c.votes, 0);
  const top = candidates.slice(0, 4);
  const rest = candidates.slice(4);
  const restVotes = rest.reduce((sum, c) => sum + c.votes, 0);

  const rows: CollationCandidate[] =
    rest.length > 0
      ? [
          ...top,
          {
            name:
              rest.length === 1
                ? "Others (1 Political Party)"
                : `Others (${rest.length} Political Parties)`,
            party: "Others",
            votes: restVotes,
            color: "#98A2B3",
          },
        ]
      : top;

  const series: ElectionChartSeriesItem[] = rows.map((c, index) => ({
    id: `${c.party}-${index}`,
    name: c.name,
    party: c.party,
    partyName: partyFullNames[c.party] || c.party,
    votes: c.votes,
    share: total > 0 ? (c.votes / total) * 100 : 0,
    color: c.color,
  }));

  return { updatedAt, series };
}
