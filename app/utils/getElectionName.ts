import { Election, User } from "../redux/types";
import formatString from "./formatString";

// export default function getElectionName(
//   election: Pick<Election, "electionName" | "electionLocation">, type?: "short") {
//   return `${type !== "short" && election.electionLocation ? election.electionLocation : ""} ${election.electionName}`;
// }

const electionTypeLocationMap: Record<string, string | null> = {
  "national": null,
  "senatorial": null,
  "house-of-representatives": null,
  "gubernatorial": "state",
  "house-of-assembly": "state",
  "lga": "lga",
}

export default function getElectionName(
  election: Pick<Election, "electionName" | "electionType">,
  type?: "short" | "detailed",
  user: typeof type extends "detailed" ? User : Partial<User> = {},
) {
  const { electionName, electionType } = election;

  if (type === "short" || type === undefined) {
    return electionName;
  } else {
    const location = user[electionTypeLocationMap[electionType] as 'state'] || "";
    return `${formatString.normalCase(location)} ${electionName}`;
  }
}