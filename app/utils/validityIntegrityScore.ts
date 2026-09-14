import { ScoreBand } from "@/app/types/irevCollation";

export function getScoreBand(score: number): ScoreBand {
  if (score >= 85) return "high";
  if (score >= 60) return "moderate";
  return "low";
}

export const scoreBandStyles: Record<
  ScoreBand,
  {
    label: string;
    text: string;
    band: string;
    soft: string;
    ring: string;
  }
> = {
  high: {
    label: "Strong",
    text: "text-success-700",
    band: "bg-success-500",
    soft: "bg-success-50",
    ring: "ring-success-200",
  },
  moderate: {
    label: "Moderate",
    text: "text-warning-700",
    band: "bg-warning-500",
    soft: "bg-warning-50",
    ring: "ring-warning-200",
  },
  low: {
    label: "Low",
    text: "text-error-700",
    band: "bg-error-500",
    soft: "bg-error-50",
    ring: "ring-error-200",
  },
};

export function formatScorePercent(score: number): string {
  return `${score.toFixed(1)}%`;
}
