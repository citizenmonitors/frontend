import moment from "moment";
import getElectionName from "../utils/getElectionName";
import ElectionIcon from "@/app/components/shared/ElectionIcon";
import { useAppSelector } from "./redux";
import { Election } from "../redux/types";

const eventColors = ["#027A48", "#12B76A", "#F79009", "#6172F3", "#F63D68", "#4E5BA6"];

export type CalendarEvent = {
  name: string;
  color: string;
  startDate: string;
  endDate: string;
  icon: React.ReactNode;
  data: Election;
};

export default function useCalendarEvents() {
  const user = useAppSelector((state) => state.user.details);
  const elections = useAppSelector((state) => state.election.elections);

  const now = moment().format("YYYY-MM-DD");
  const events = {
    elections: [] as Array<CalendarEvent>,
  };

  elections.toSorted((a, b) => {
    if (a.startDate < b.startDate) return -1;
    if (a.startDate > b.startDate) return 1;
    return 0;
  }).forEach((election, index) => {
    if (user && election.startDate <= now && now <= election.endDate) {
      events.elections.push({
        name: getElectionName(election, "detailed", { showMock: false }) + " Elections",
        color: eventColors[index % eventColors.length],
        startDate: election.startDate,
        endDate: election.endDate,
        icon: ElectionIcon({ electionType: election.electionType, style: { width: 24, height: 24, minWidth: 24 } }),
        data: election,
      });
    }
  });

  return events;
}
