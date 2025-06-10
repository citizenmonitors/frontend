"use client";
import CreateEventModal from "@/app/components/admin/calendar/CreateEventModal";
import EventCalendar from "@/app/components/portal/calendar/EventCalendar";
import useCalendarEvents from "@/app/hooks/useCalendarEvents";
import { Button } from "antd";
import { Add } from "iconsax-react";
import React, { useState } from "react";

export default function Calendar() {
  const calendarEvents = useCalendarEvents();
  const [createEventModalOpen, setCreateEventModalOpen] = useState(false);

  return (
    <div>
      <header className="flex gap-3 justify-between items-center mb-7">
        <h2 className="font-league text-display-xs text-gray-700 font-semibold leading-[1.1] lg:text-display-base">
          Calendar
        </h2>
        <Button
          onClick={() => {
            setCreateEventModalOpen(true);
          }}
          className="flex gap-2 items-center"
          size="large"
          type="primary"
        >
          <Add size={20} />
          <span className="text-sm">Add new event</span>
        </Button>
      </header>

      <CreateEventModal open={createEventModalOpen} setOpen={setCreateEventModalOpen} />
      <EventCalendar events={calendarEvents} />
    </div>
  );
}
