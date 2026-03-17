"use client";

import React, { useEffect, useState } from "react";
import { Button, Table, Select, Popconfirm, Modal, Input, InputNumber, DatePicker } from "antd";
import dayjs from "dayjs";
import type { SpeakerBooking } from "@/app/types/speaker-invite";
import MoveBookingModal from "./MoveBookingModal";
import CreateInvitesModal from "./CreateInvitesModal";
import ViewSpeakerModal from "./ViewSpeakerModal";
import {
  listEvents,
  getEventSchedule,
  exportEventCsv,
  deleteBooking,
  deleteSlot,
  createSlots,
  type SpeakerSlotEvent,
  type ScheduleResponse,
  type ScheduleDayGroup,
  type ScheduleSlot,
} from "@/app/data/admin-speaker-slots-api";

type ScheduleRow = {
  id: string;
  dayId: string;
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
          dayId: slot.dayId ?? "",
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
        dayId: slot.dayId ?? "",
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
  const [createSlotOpen, setCreateSlotOpen] = useState(false);
  const [createSlotLoading, setCreateSlotLoading] = useState(false);
  const [newSlot, setNewSlot] = useState({
    selectedDate: "",
    label: "",
    startTime: "09:00",
    endTime: "11:00",
    theme: "",
    capacity: 1,
    sessionType: "",
  });
  const THEME_OPTIONS = [
    { value: "People Focus", label: "People Focus" },
    { value: "People Power", label: "People Power" },
    { value: "People Protest", label: "People Protest" },
  ];

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
    {
      title: "Type",
      dataIndex: "sessionType",
      key: "sessionType",
      width: 110,
      ellipsis: true,
      className: "schedule-table-cell",
      render: (_: unknown, r: ScheduleRow) => (
        <span>{r.sessionType === "panel" ? "Multiple speakers" : r.sessionType || ""}</span>
      ),
    },
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
      width: 260,
      className: "schedule-table-cell",
      render: (_: unknown, r: ScheduleRow) => (
        <div className="flex flex-wrap items-center gap-2 min-w-0 text-sm">
          {r.bookings.length === 0 ? null : (
            r.bookings.map((b) => (
              <React.Fragment key={b.id}>
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
              </React.Fragment>
            ))
          )}
          <Popconfirm
            title="Delete slot?"
            description="This slot will be removed. Any speakers in it will lose their booking."
            onConfirm={async () => {
              try {
                await deleteSlot(r.id);
                refreshSchedule();
              } catch {
                alert("Failed to delete slot.");
              }
            }}
            okText="Delete slot"
            okButtonProps={{ danger: true }}
            cancelText="Cancel"
          >
            <Button type="default" size="small" danger className="border border-red-300">
              Delete slot
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const handleMoveSuccess = () => {
    setMoveModal(null);
    refreshSchedule();
  };

  const handleCreateSlot = async () => {
    if (!selectedEventId || !newSlot.selectedDate || !newSlot.label.trim()) {
      alert("Please pick a date and enter a day label (e.g. Day 1).");
      return;
    }
    if (!newSlot.theme.trim()) {
      alert("Please choose a theme.");
      return;
    }
    setCreateSlotLoading(true);
    try {
      await createSlots(selectedEventId, [
        {
          date: newSlot.selectedDate,
          label: newSlot.label.trim(),
          startTime: newSlot.startTime,
          endTime: newSlot.endTime,
          theme: newSlot.theme.trim(),
          capacity: newSlot.capacity,
          sessionType: newSlot.sessionType.trim() || "panel",
        },
      ]);
      setCreateSlotOpen(false);
      setNewSlot({
        selectedDate: "",
        label: "",
        startTime: "09:00",
        endTime: "11:00",
        theme: "",
        capacity: 1,
        sessionType: "",
      });
      refreshSchedule();
    } catch (e) {
      const msg = e && typeof e === "object" && "response" in e ? (e as { response?: { data?: { message?: string } } }).response?.data?.message : null;
      alert(msg ?? "Failed to create slot.");
    } finally {
      setCreateSlotLoading(false);
    }
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
          <Button onClick={() => setCreateSlotOpen(true)} disabled={!selectedEventId}>
            Create slot
          </Button>
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
          scroll={{ x: 860 }}
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
      <Modal
        title="Create slot"
        open={createSlotOpen}
        onCancel={() => setCreateSlotOpen(false)}
        onOk={handleCreateSlot}
        confirmLoading={createSlotLoading}
        okText="Create"
        destroyOnClose
      >
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <DatePicker
                className="w-full"
                value={newSlot.selectedDate ? dayjs(newSlot.selectedDate) : null}
                onChange={(_, dateStr) => {
                  const str = (typeof dateStr === "string" ? dateStr : "") || "";
                  setNewSlot((s) => ({ ...s, selectedDate: str }));
                }}
                format="YYYY-MM-DD"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Day label</label>
              <Input
                value={newSlot.label}
                onChange={(e) => setNewSlot((s) => ({ ...s, label: e.target.value }))}
                placeholder="e.g. Day 1"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start time</label>
              <Input
                value={newSlot.startTime}
                onChange={(e) => setNewSlot((s) => ({ ...s, startTime: e.target.value }))}
                placeholder="09:00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End time</label>
              <Input
                value={newSlot.endTime}
                onChange={(e) => setNewSlot((s) => ({ ...s, endTime: e.target.value }))}
                placeholder="11:00"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
            <Select
              placeholder="Select theme"
              allowClear
              options={THEME_OPTIONS}
              value={newSlot.theme || undefined}
              onChange={(v) => setNewSlot((s) => ({ ...s, theme: v ?? "" }))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
            <InputNumber
              min={1}
              value={newSlot.capacity}
              onChange={(v) => setNewSlot((s) => ({ ...s, capacity: v ?? 6 }))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Session type</label>
            <Input
              value={newSlot.sessionType}
              onChange={(e) => setNewSlot((s) => ({ ...s, sessionType: e.target.value }))}
              placeholder="e.g. Multiple speakers"
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
