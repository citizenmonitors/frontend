import { CalendarMode } from "./EventCalendar";
import React, { Dispatch } from "react";
import moment from "moment";
import { CalendarEvent } from "@/app/hooks/useCalendarEvents";

type EventCalendarDayTileProps = {
  date: moment.Moment;
  isWithinCurrentMonth: boolean;
  mode: CalendarMode;
  setCurrentView: Dispatch<React.SetStateAction<moment.Moment>>;
  currentMomentDate: moment.Moment;
  events: Record<string, Array<CalendarEvent>>;
};

export default function EventCalendarDayTile({
  date,
  isWithinCurrentMonth,
  mode,
  setCurrentView,
  currentMomentDate,
  events,
}: EventCalendarDayTileProps) {
  const eventsToday = events["elections"]
    .filter(
      (e) =>
        isWithinCurrentMonth &&
        date.isSameOrAfter(e.startDate, "day") &&
        date.isSameOrBefore(e.endDate, "day")
    )
    .slice(0, 3);

  return (
    <div
      id="event-calendar-tile-day"
      onClick={() => {
        setCurrentView(date.startOf(mode));
      }}
      className={`
        hover:cursor-pointer hover:bg-gray-100 transition-all
        grid place-content-center text-xs h-[40px] md:h-[60px] border-b-0 border-r-0 border-gray-300 md:border-b
        ${isWithinCurrentMonth ? "text-gray-500" : "text-gray-300"}
        ${date.get("weekday") !== 6 && "md:border-r"}
      `}
    >
      <div
        className={`
          py-2 px-3 rounded-full grid gap-1 place-items-center
          ${date.isSame(currentMomentDate, "day") && "bg-brand-500 text-white"}
        `}
      >
        <span>{date.format("D")}</span>
        {eventsToday.length ? (
          <div className="flex gap-1">
            {eventsToday.map((event, eventIndex) => (
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
    </div>
  );
}