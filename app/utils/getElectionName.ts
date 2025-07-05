import { Election } from "../redux/types";
import formatString from "./formatString";

// export default function getElectionName(
//   election: Pick<Election, "electionName" | "electionLocation">, type?: "short") {
//   return `${type !== "short" && election.electionLocation ? election.electionLocation : ""} ${election.electionName}`;
// }

// const electionTypeLocationMap: Record<string, string | null> = {
//   "national": null,
//   "senatorial": null,
//   "house-of-representatives": null,
//   "gubernatorial": "state",
//   "house-of-assembly": "state",
//   "lga": "lga",
// }

export default function getElectionName(
  election: Pick<Election, "electionName" | "electionLocation" | "mockElection">,
	type: "short" | "detailed" = "short",
) {
  const { electionName, electionLocation, mockElection } = election;
	const nameParts = [electionName];

  if (type === "detailed") nameParts.unshift(formatString.normalCase(electionLocation || ""));
	nameParts.unshift(mockElection ? "Mock" : "");

	return nameParts.filter(Boolean).join(" ");
}
