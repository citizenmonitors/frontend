import { Dispatch } from "react";
import { CalendarMode } from "./EventCalendar";
import moment from "moment";
import { CalendarEvent } from "@/app/hooks/useCalendarEvents";

type EventCalendarMonthTileProps = {
  month: string;
  mode: CalendarMode;
  setMode: Dispatch<React.SetStateAction<CalendarMode>>;
  currentView: moment.Moment;
  setCurrentView: Dispatch<React.SetStateAction<moment.Moment>>;
  currentMomentDate: moment.Moment;
  events: Record<string, Array<CalendarEvent>>;
};

const months = moment.months();
export default function EventCalendarMonthTile({
  month,
  setMode,
  currentView,
  setCurrentView,
  currentMomentDate,
  events,
}: EventCalendarMonthTileProps) {
  const monthIndexMap = moment.months();
  const monthMoment = currentView.clone().set("month", monthIndexMap.indexOf(month));
  const isMonthActive = monthMoment.isSameOrAfter(currentMomentDate, "month");

  const eventsThisMonth = events["elections"]
    .filter(
      (e) =>
        isMonthActive &&
        monthMoment.isSameOrAfter(e.startDate, "month") &&
        monthMoment.isSameOrBefore(e.endDate, "month")
    )
    .slice(0, 3);

  return (
    <div
      className={`
        hover:cursor-pointer hover:bg-gray-100 transition-all
        grid gap-1 place-items-center place-content-center text-xs h-[60px] border-gray-300 md:border-b
        ${months.indexOf(month) % 4 !== 3 && "border-r"}
        ${months.indexOf(month) < 8 && "border-b"}
        ${isMonthActive ? "text-gray-500" : "text-gray-300"}
        ${
          currentView.isSame(currentMomentDate, "year") &&
          month === currentMomentDate.format("MMMM")
            ? "bg-brand-500 text-white hover:bg-brand-600"
            : ""
        }
      `}
      onClick={() => {
        if (!isMonthActive) return;
        setCurrentView(currentView.clone().month(month));
        setMode("month");
      }}
    >
      <span className="hidden lg:inline-block">{month}</span>
      <span className="lg:hidden inline-block">{month.slice(0, 3)}</span>
      {eventsThisMonth.length ? (
        <div className="flex gap-1">
          {eventsThisMonth.map((event, eventIndex) => (
            <div
            key={eventIndex}
              className="w-[5px] h-[5px] rounded-full"
              style={{ backgroundColor: event.color }}
              data-event-indicator={eventIndex}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
