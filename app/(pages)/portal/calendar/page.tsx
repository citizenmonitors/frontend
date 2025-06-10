"use client";
import React from "react";
import EventCalendar from "../../../components/portal/calendar/EventCalendar";
import useCalendarEvents from "@/app/hooks/useCalendarEvents";

export default function Calendar() {
  const calendarEvents = useCalendarEvents();

  return (
    <div>
      <header className="flex gap-3 md:items-center mb-1 md:mb-2">
        <h2 className="font-league text-display-xs text-gray-700 font-semibold leading-[1.1] lg:text-display-base">
          Calendar
        </h2>
      </header>
      <p className="text-sm text-gray-500 lg:text-base mb-6 md:mb-7">
        View the calendar to stay updated on upcoming and current local, state and
        national elections in Nigeria.
      </p>

      <EventCalendar events={calendarEvents} />
    </div>
  );
}
