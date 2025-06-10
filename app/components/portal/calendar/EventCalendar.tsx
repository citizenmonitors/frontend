"use client";
import useLiveDate from "@/app/hooks/useLiveDate";
import { Button } from "antd";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
import moment from "moment";
import React, { useMemo, useState } from "react";
import EventCalendarEventList from "./EventCalendarEventList";
import EventCalendarMonthTile from "./EventCalendarMonthTile";
import EventCalendarDayTile from "./EventCalendarDayTile";
import formatString from "@/app/utils/formatString";
import { CalendarEvent } from "@/app/hooks/useCalendarEvents";

export type CalendarMode = "month" | "year";
const days = moment.weekdays();
const months = moment.months();

type EventCalendarProps = {
  events: Record<string, Array<CalendarEvent>>;
};
export default function EventCalendar({ events }: EventCalendarProps) {
  const modes: Array<CalendarMode> = ["month", "year"];
  const [mode, setMode] = useState<CalendarMode>(modes[0]);

  const currentDate = useLiveDate(60 * 60 * 1000);
  const currentMomentDate = useMemo(() => moment(currentDate), [currentDate]);

  const [currentView, setCurrentView] = useState(moment(currentDate).startOf(mode));
  function handleChangeView(step: -1 | 1) {
    setCurrentView(currentView.clone().add(step, mode));
  }

  function generateMonthDays() {
    const start = currentView.clone().startOf("month").startOf("week");
    const end = currentView.clone().endOf("month").endOf("week");

    const days = [];
    for (let i = start; i.isBefore(end); i.add(1, "day")) {
      days.push({
        date: i.clone(),
        isWithinCurrentMonth: i.isSame(currentView, "month"),
      });
    }
    return days;
  }
  const monthDays = useMemo(generateMonthDays, [currentView]);

  return (
    <section
      id="event-calendar"
      className="rounded-lg md:overflow-hidden ring-0 md:ring-1 ring-gray-300"
    >
      <header className="bg-white md:py-4 px-0 py-2 md:px-8 flex items-center border-b border-gray-300">
        <div className="flex justify-between items-center gap-2 mx-auto w-full md:max-w-[200px]">
          <Button
            type="text"
            className="rounded-full ring-1 !ring-gray-200 !bg-gray-500 md:!bg-white !text-white md:!text-gray-500 hover:!ring-gray-500 hover:!bg-gray-500 hover:!text-white px-2 scale-75 md:scale-100"
            onClick={() => handleChangeView(-1)}
            disabled={currentView.isSame(currentMomentDate, mode)}
          >
            <ArrowLeft2 size={16} />
          </Button>
          <span className="text-xs text-gray-700 md:text-gray-500">
            {currentView.format(mode === "month" ? "MMMM YYYY" : "YYYY")}
          </span>
          <Button
            type="text"
            className="rounded-full ring-1 !ring-gray-200 !bg-gray-500 md:!bg-white !text-white md:!text-gray-500 hover:!ring-gray-500 hover:!bg-gray-500 hover:!text-white px-2 scale-75 md:scale-100"
            onClick={() => handleChangeView(1)}
          >
            <ArrowRight2 size={16} />
          </Button>
        </div>

        <div className="rounded-full overflow-hidden ring-1 ring-gray-300 w-fit hidden md:flex">
          {modes.map((m, mIndex) => (
            <div key={mIndex} className="border-r border-gray-300 last:border-none">
              <Button
                className={`rounded-none text-xs ${
                  mode === m ? "text-gray-700" : "text-gray-300"
                }`}
                type="text"
                onClick={() => setMode(modes[mIndex])}
              >
                {formatString.normalCase(m)}
              </Button>
            </div>
          ))}
        </div>
      </header>

      {/* Event Calendar Body */}
      {mode === "month" ? (
        <section id="event-month-calendar-body" className="bg-white">
          <header className="grid grid-cols-7 border-b-0 md:border-b border-gray-300">
            {days.map((day, index) => (
              <div
                key={index}
                className="grid place-content-center text-xs text-gray-700 md:text-gray-500 h-[40px] md:h-[60px] border-r-0 md:border-r border-gray-300 last:border-none"
              >
                <span className="hidden lg:inline-block">{day}</span>
                <span className="lg:hidden inline-block">{day.slice(0, 3)}</span>
              </div>
            ))}
          </header>

          <div className="grid grid-cols-7">
            {monthDays.map(({ date, isWithinCurrentMonth }, monthDayIndex) => (
              <EventCalendarDayTile
                date={date}
                isWithinCurrentMonth={isWithinCurrentMonth}
                currentMomentDate={currentMomentDate}
                events={events}
                mode={mode}
                setCurrentView={setCurrentView}
                key={monthDayIndex}
              />
            ))}
          </div>
        </section>
      ) : mode === "year" ? (
        <section id="event-year-calendar-body" className="bg-white">
          <div className="grid grid-cols-4 ring-1 md:ring-0 ring-gray-300 rounded overflow-hidden md:rounded-none">
            {months.map((m) => (
              <EventCalendarMonthTile
                currentMomentDate={currentMomentDate}
                currentView={currentView}
                events={events}
                mode={mode}
                setMode={setMode}
                setCurrentView={setCurrentView}
                month={m}
                key={m}
              />
            ))}
          </div>
        </section>
      ) : null}

      {/* Event Calendar Events */}
      <EventCalendarEventList events={events} />
    </section>
  );
}
