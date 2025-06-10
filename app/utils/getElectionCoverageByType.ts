export default function getElectionCoverageByType(type: string | undefined) {
  const levels = {
    federal: "federal",
    state: "state",
    lga: "LGA",
  } as const;

  type = type || "";

  switch (type) {
    case "national":
      return levels.federal;
    case "senatorial":
      return levels.federal; // Backend handles senatorial districts
    case "house-of-representatives":
      return levels.federal; // Backend handles federal constituencies
    case "gubernatorial":
      return levels.state;
    case "house-of-assembly":
      return levels.state;
    case "LGA":
      return levels.lga;
    default:
      return "Please Choose an Election.";
  }
};