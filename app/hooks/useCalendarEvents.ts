// import moment from "moment";
// import getElectionName from "../utils/getElectionName";
// import ElectionIcon from "@/app/components/shared/ElectionIcon";
// import { useAppSelector } from "./redux";
// import { Election } from "../redux/types";

// const eventColors = ["#027A48", "#12B76A", "#F79009", "#6172F3", "#F63D68", "#4E5BA6"];

// export type CalendarEvent = {
//   name: string;
//   color: string;
//   startDate: string;
//   endDate: string;
//   icon: React.ReactNode;
//   data: Election;
// };

// export default function useCalendarEvents() {
//   const user = useAppSelector((state) => state.user.details);
//   const elections = useAppSelector((state) => state.election.elections);

//   const now = moment().format("YYYY-MM-DD");
//   const events = {
//     elections: [] as Array<CalendarEvent>,
//   };

//   elections.toSorted((a, b) => {
//     if (a.startDate < b.startDate) return -1;
//     if (a.startDate > b.startDate) return 1;
//     return 0;
//   }).forEach((election, index) => {
//     if (user && election.startDate <= now && now <= election.endDate) {
//       events.elections.push({
//         name: getElectionName(election, "detailed", { showMock: false }) + " Elections",
//         color: eventColors[index % eventColors.length],
//         startDate: election.startDate,
//         endDate: election.endDate,
//         icon: ElectionIcon({ electionType: election.electionType, style: { width: 24, height: 24, minWidth: 24 } }),
//         data: election,
//       });
//     }
//   });

//   return events;
// }


// /app/hooks/useCalendarEvents.ts
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

  const today = moment.utc(); // use UTC for consistent backend alignment
  const events = { elections: [] as Array<CalendarEvent> };

  const sortedElections = [...elections].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  // elections.forEach((election) => {
  //   const start = moment.utc(election.startDate);
  //   const end = moment.utc(election.endDate);
  //   const today = moment.utc();
  //   console.log({
  //     name: election.electionName,
  //     start: start.format(),
  //     end: end.format(),
  //     today: today.format(),
  //     isBetween: today.isBetween(start, end, "day", "[]"),
  //   });
  // });

  sortedElections.forEach((election, index) => {
    const start = moment.utc(election.startDate);
    const end = moment.utc(election.endDate);

    // Inclusive check for current date range (UTC)
    const isOngoing = today.isBetween(start, end, "day", "[]");

    if (user && isOngoing) {
      events.elections.push({
        name: getElectionName(election, "detailed", { showMock: false }) + " Elections",
        color: eventColors[index % eventColors.length],
        startDate: election.startDate,
        endDate: election.endDate,
        icon: ElectionIcon({
          electionType: election.electionType,
          style: { width: 24, height: 24, minWidth: 24 },
        }),
        data: election,
      });
    }
  });

  return events;
}

