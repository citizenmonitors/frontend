import { useAppSelector } from "@/app/hooks/redux";
import moment from "moment";
import { Button, Spin } from "antd";
import { CalendarEvent } from "@/app/hooks/useCalendarEvents";
import { Trash } from "iconsax-react";
import React, { useState } from "react";
import DeleteEventModal from "../../admin/calendar/DeleteEventModal";
import { Election } from "@/app/redux/types";
import MockTag from "../../shared/MockTag";

type EventCalendarEventListProps = {
  events: Record<string, Array<CalendarEvent>>;
};
export default function EventCalendarEventList({ events }: EventCalendarEventListProps) {
  const electionState = useAppSelector((state) => state.election);
  const userState = useAppSelector((state) => state.user);
  const userDetails = userState.details!;

  const [deleteElectionModalOpen, setDeleteElectionModalOpen] = useState<Election | null>(null);
  const [deleteEvent, setDeleteEvent] = useState<CalendarEvent | null>(null);

  return (
    <React.Fragment>
      <DeleteEventModal
        open={!!deleteElectionModalOpen}
        setOpen={setDeleteElectionModalOpen}
        election={deleteElectionModalOpen}
        event={deleteEvent}
      />
      <section id="events" className="py-5 md:bg-white md:px-6 lg:px-8">
        <h3 className="text-brand-500 font-medium mb-4">Elections Happening</h3>
        {electionState.status.fetchElections === "fulfilled" ? (
          <ul className="grid gap-3">
            {events["elections"].map((event) => (
              <li
                key={event.name}
                className="flex gap-2 border-b border-gray-300 pb-3 md:last:border-b-0"
              >
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex gap-2 text-xs items-center">
                    <span
                      className="w-[10px] h-[10px] rounded-full"
                      style={{ boxShadow: `0 0 0 3px ${event.color} inset` }}
                    />
                    <div>
                      <time dateTime={moment(event.startDate).format("YYYY-MM-DD")}>
                        {moment(event.startDate).format("MMM D, YYYY")}
                      </time>
                      -{" "}
                      <time dateTime={moment(event.endDate).format("YYYY-MM-DD")}>
                        {moment(event.endDate).format("MMM D, YYYY")}
                      </time>
                    </div>
                  </div>
                  <header className="flex gap-2 items-center">
                    {event.icon}
										{event.data.mockElection && <MockTag />}
                    <h4 className="text-gray-700 text-sm">{event.name}</h4>
                  </header>
                </div>
                <div className="font-league text-xs font-medium whitespace-nowrap text-error-600 flex gap-1 items-center">
                  <div className="w-[6px] h-[6px] bg-error-600 rounded-full" />
                  Happening Live
                  {["super-admin", "admin"].includes(userDetails.role) && (
                    <Button
                      type="text"
                      size="small"
                      className="!text-gray-500 hover:!text-gray-700 !bg-gray-100 h-[32px] w-[32px] ml-4"
                      onClick={() => {
                        setDeleteElectionModalOpen(event.data);
                        setDeleteEvent(event);
                      }}
                    >
                      <Trash size={14} variant="Bold" />
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="grid place-items-center h-[100px]">
            <Spin size="large" />
          </div>
        )}
      </section>
    </React.Fragment>
  );
}
