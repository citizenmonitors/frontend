"use client";

import React, { useEffect, useState } from "react";
import { Button, Table, Select, Popconfirm } from "antd";
import type { SpeakerBooking } from "@/app/types/speaker-invite";
import MoveBookingModal from "./MoveBookingModal";
import CreateInvitesModal from "./CreateInvitesModal";
import ViewSpeakerModal from "./ViewSpeakerModal";
import {
  listEvents,
  getEventSchedule,
  exportEventCsv,
  deleteBooking,
  type SpeakerSlotEvent,
  type ScheduleResponse,
  type ScheduleDayGroup,
  type ScheduleSlot,
} from "@/app/data/admin-speaker-slots-api";

type ScheduleRow = {
  id: string;
  date: string;
  dayTheme: string;
  timeWAT: string;
  sessionType: string;
  capacity: number;
  bookedCount: number;
  bookings: SpeakerBooking[];
};

/** Flatten GET .../schedule response (event, days, schedule: { day, slots }[]) into table rows */
function scheduleResponseToRows(data: ScheduleResponse): ScheduleRow[] {
  const schedule = data.schedule ?? [];
  const rows: ScheduleRow[] = [];

  if (schedule.length > 0 && "day" in schedule[0] && "slots" in schedule[0]) {
    const dayGroups = schedule as ScheduleDayGroup[];
    for (const { day, slots } of dayGroups) {
      const date = day?.date ?? "";
      const dayTheme = day?.theme ?? "";
      for (const slot of slots ?? []) {
        const start = slot.startTime ?? slot.start ?? "09:00";
        const end = slot.endTime ?? slot.end ?? "10:00";
        const rawBookings = slot.bookings ?? [];
        const bookings: SpeakerBooking[] = rawBookings.map((b: Record<string, unknown>) => ({
          id: (b.bookingId as string) ?? (b.id as string) ?? "",
          slotId: slot.id,
          name: (b.fullName as string) ?? (b.name as string) ?? "",
          email: (b.email as string) ?? "",
          xHandle: (b.xHandle as string) ?? "",
          bioLink: (b.bioLink as string) ?? "",
          topicAngle: (b.topicAngle as string) ?? "",
          phone: b.phone as string | undefined,
          status: "confirmed" as const,
          createdAt: (b.createdAt as string) ?? "",
        }));
        const bookedCount = typeof slot.bookedCount === "number" ? slot.bookedCount : bookings.length;
        rows.push({
          id: slot.id ?? `slot-${slot.dayId}-${start}-${end}`,
          date,
          dayTheme,
          timeWAT: `${start}–${end}`,
          sessionType: slot.sessionType ?? "",
          capacity: slot.capacity ?? 0,
          bookedCount,
          bookings,
        });
      }
    }
  } else {
    const flatSlots = schedule as ScheduleSlot[];
    const days = data.days ?? [];
    for (const slot of flatSlots) {
      const day = days.find((d) => (d.id ?? (d as { _id?: string })._id) === slot.dayId);
      const date = day?.date ?? "";
      const start = slot.startTime ?? slot.start ?? "09:00";
      const end = slot.endTime ?? slot.end ?? "10:00";
      const rawBookings = slot.bookings ?? [];
      const bookings: SpeakerBooking[] = rawBookings.map((b: Record<string, unknown>) => ({
        id: (b.bookingId as string) ?? (b.id as string) ?? "",
        slotId: slot.id,
        name: (b.fullName as string) ?? (b.name as string) ?? "",
        email: (b.email as string) ?? "",
        xHandle: (b.xHandle as string) ?? "",
        bioLink: (b.bioLink as string) ?? "",
        topicAngle: (b.topicAngle as string) ?? "",
        phone: b.phone as string | undefined,
        status: "confirmed" as const,
        createdAt: (b.createdAt as string) ?? "",
      }));
      const bookedCount = typeof slot.bookedCount === "number" ? slot.bookedCount : bookings.length;
      rows.push({
        id: slot.id ?? `slot-${slot.dayId}-${start}-${end}`,
        date,
        dayTheme: (day?.theme ?? slot.theme) ?? "",
        timeWAT: `${start}–${end}`,
        sessionType: slot.sessionType ?? "",
        capacity: slot.capacity ?? 0,
        bookedCount,
        bookings,
      });
    }
  }

  return rows.sort((a, b) => {
    const d = a.date.localeCompare(b.date);
    if (d !== 0) return d;
    return a.timeWAT.localeCompare(b.timeWAT);
  });
}

export default function AdminScheduleView() {
  const [events, setEvents] = useState<SpeakerSlotEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<ScheduleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [moveModal, setMoveModal] = useState<{ booking: SpeakerBooking; slotIds: string[] } | null>(null);
  const [viewSpeaker, setViewSpeaker] = useState<SpeakerBooking | null>(null);
  const [createInvitesOpen, setCreateInvitesOpen] = useState(false);

  useEffect(() => {
    listEvents()
      .then(setEvents)
      .catch(() => setEvents([]))
      .finally(() => setEventsLoading(false));
  }, []);

  const eventId = (e: SpeakerSlotEvent) => e.id ?? (e as { _id?: string })._id ?? "";

  useEffect(() => {
    if (events.length > 0 && !selectedEventId) setSelectedEventId(eventId(events[0]));
  }, [events, selectedEventId]);

  useEffect(() => {
    if (!selectedEventId) {
      setSchedule([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    getEventSchedule(selectedEventId)
      .then((data) => setSchedule(scheduleResponseToRows(data)))
      .catch(() => setSchedule([]))
      .finally(() => setLoading(false));
  }, [selectedEventId]);

  const allSlotIds = schedule.map((s) => s.id);

  const refreshSchedule = () => {
    if (!selectedEventId) return;
    getEventSchedule(selectedEventId)
      .then((data) => setSchedule(scheduleResponseToRows(data)))
      .catch(() => setSchedule([]));
  };

  const handleExportCsv = async () => {
    if (!selectedEventId) return;
    try {
      const blob = await exportEventCsv(selectedEventId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `speaker-schedule-${selectedEventId}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Export failed.");
    }
  };

  const columns = [
    { title: "Date", dataIndex: "date", key: "date", width: 100, ellipsis: true, className: "schedule-table-cell" },
    { title: "Theme", dataIndex: "dayTheme", key: "dayTheme", width: 120, ellipsis: true, className: "schedule-table-cell" },
    { title: "Time (WAT)", dataIndex: "timeWAT", key: "timeWAT", width: 95, ellipsis: true, className: "schedule-table-cell" },
    { title: "Type", dataIndex: "sessionType", key: "sessionType", width: 82, ellipsis: true, className: "schedule-table-cell" },
    {
      title: "Slots",
      key: "slots",
      width: 72,
      className: "schedule-table-cell",
      render: (_: unknown, r: ScheduleRow) => (
        <span>{r.bookedCount} / {r.capacity}</span>
      ),
    },
    {
      title: "Speakers",
      key: "speakers",
      width: 140,
      className: "schedule-table-cell schedule-table-cell-speakers",
      render: (_: unknown, r: ScheduleRow) => (
        <div className="space-y-1 min-w-0">
          {r.bookings.length === 0 ? (
            <span className="text-gray-400">—</span>
          ) : (
            r.bookings.map((b) => (
              <div key={b.id} className="text-sm">
                <span className="font-medium text-gray-800 truncate block" title={b.name}>{b.name}</span>
              </div>
            ))
          )}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 220,
      className: "schedule-table-cell",
      render: (_: unknown, r: ScheduleRow) => (
        <div className="space-y-2 min-w-0">
          {r.bookings.length === 0 ? (
            <span className="text-gray-400">—</span>
          ) : (
            r.bookings.map((b) => (
              <div key={b.id} className="flex flex-wrap items-center gap-2 text-sm">
                <Button type="default" size="small" className="border border-gray-300" onClick={() => setViewSpeaker(b)}>
                  View
                </Button>
                <Button type="default" size="small" className="border border-brand-500 text-brand-500" onClick={() => setMoveModal({ booking: b, slotIds: allSlotIds })}>
                  Move
                </Button>
                <Popconfirm
                  title="Cancel booking?"
                  description="The speaker will be removed from this slot."
                  onConfirm={async () => {
                    try {
                      await deleteBooking(b.id);
                      refreshSchedule();
                    } catch {
                      alert("Failed to cancel booking.");
                    }
                  }}
                  okText="Cancel booking"
                  okButtonProps={{ danger: true }}
                  cancelText="Keep"
                >
                  <Button type="default" size="small" danger className="border border-red-300">
                    Cancel booking
                  </Button>
                </Popconfirm>
              </div>
            ))
          )}
        </div>
      ),
    },
  ];

  const handleMoveSuccess = () => {
    setMoveModal(null);
    refreshSchedule();
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-600">Event:</span>
          <Select
            value={selectedEventId}
            onChange={setSelectedEventId}
            loading={eventsLoading}
            options={events.map((e) => ({
              value: eventId(e),
              label: e.slug ? `${e.name ?? eventId(e)} (${e.slug})` : (e.name as string) ?? eventId(e),
            }))}
            className="min-w-[200px]"
            placeholder="Select event"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={() => setCreateInvitesOpen(true)} disabled={!selectedEventId}>
            Create invites
          </Button>
          <Button type="primary" onClick={handleExportCsv} disabled={!selectedEventId}>
            Export CSV
          </Button>
        </div>
      </div>
      <div className="schedule-table-wrapper overflow-x-auto">
        <Table
          loading={loading}
          dataSource={schedule}
          columns={columns}
          rowKey="id"
          pagination={false}
          size="small"
          scroll={{ x: 820 }}
          className="schedule-table"
        />
      </div>
      {moveModal && (
        <MoveBookingModal
          booking={moveModal.booking}
          scheduleRows={schedule}
          onClose={() => setMoveModal(null)}
          onSuccess={handleMoveSuccess}
        />
      )}
      {viewSpeaker && (
        <ViewSpeakerModal booking={viewSpeaker} onClose={() => setViewSpeaker(null)} />
      )}
      {selectedEventId && (
        <CreateInvitesModal
          open={createInvitesOpen}
          eventId={selectedEventId}
          onClose={() => setCreateInvitesOpen(false)}
          onSuccess={() => setCreateInvitesOpen(false)}
        />
      )}
    </>
  );
}
