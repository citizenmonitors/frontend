import axios from "axios";
import backendAxiosConfig from "./axiosConfig";
import { backendRoutes } from "./backend";

const api = () => axios.create(backendAxiosConfig());

export type SpeakerSlotEvent = { id: string; name?: string; slug?: string; [key: string]: unknown };

export async function listEvents(): Promise<SpeakerSlotEvent[]> {
  const res = await api().get<SpeakerSlotEvent[] | { events?: SpeakerSlotEvent[] }>(backendRoutes.admin.speakerSlots.events);
  const data = res.data;
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && Array.isArray((data as { events?: SpeakerSlotEvent[] }).events)) {
    return (data as { events: SpeakerSlotEvent[] }).events;
  }
  return [];
}

export type CreateEventBody = { name: string };

export async function createEvent(body: CreateEventBody): Promise<SpeakerSlotEvent> {
  const res = await api().post<SpeakerSlotEvent>(backendRoutes.admin.speakerSlots.createEvent, body);
  return res.data;
}

/** POST /api/admin/speaker-slots/seed – create event, days, and slots (admin). Body can be seed payload or empty. */
export async function seedSpeakerSlots(body?: Record<string, unknown>): Promise<unknown> {
  const res = await api().post(backendRoutes.admin.speakerSlots.seed, body ?? {});
  return res.data;
}

export type ScheduleDay = { id: string; name?: string; label?: string; theme?: string; date?: string };
export type ScheduleSlot = {
  id: string;
  dayId: string;
  start?: string;
  end?: string;
  startTime?: string;
  endTime?: string;
  theme?: string;
  capacity?: number;
  bookedCount?: number;
  sessionType?: string;
  bookings?: Array<{ id?: string; bookingId?: string; name?: string; fullName?: string; email?: string; xHandle?: string; topicAngle?: string; bioLink?: string; phone?: string; [key: string]: unknown }>;
};
/** Schedule API: schedule is array of { day, slots } (one entry per day, slots per day) */
export type ScheduleDayGroup = {
  day: { id?: string; name?: string; label?: string; date?: string; theme?: string };
  slots: ScheduleSlot[];
};
export type ScheduleResponse = {
  event?: { _id?: string; id?: string; name?: string; slug?: string; [key: string]: unknown };
  days?: ScheduleDay[];
  /** Nested: schedule[i].day + schedule[i].slots (all days and slots with bookings) */
  schedule?: ScheduleDayGroup[] | ScheduleSlot[];
  slots?: ScheduleSlot[];
};

export async function getEventSchedule(eventId: string): Promise<ScheduleResponse> {
  const res = await api().get<ScheduleResponse>(backendRoutes.admin.speakerSlots.eventSchedule(eventId));
  return res.data;
}

/** GET /api/admin/speaker-slots/events/:eventId/days */
export type EventDay = {
  id: string;
  label?: string;
  name?: string;
  date?: string;
  theme?: string;
  description?: string;
  sortOrder?: number;
};

export async function getEventDays(eventId: string): Promise<EventDay[]> {
  const res = await api().get<EventDay[]>(backendRoutes.admin.speakerSlots.eventDays(eventId));
  return Array.isArray(res.data) ? res.data : [];
}

/** POST /api/admin/speaker-slots/events/:eventId/days – body: array of days */
export type CreateDayBody = {
  id?: string;
  label?: string;
  name?: string;
  date?: string;
  theme?: string;
  description?: string;
  sortOrder?: number;
};

export async function createEventDays(eventId: string, days: CreateDayBody[]): Promise<unknown> {
  const res = await api().post(backendRoutes.admin.speakerSlots.eventDays(eventId), days);
  return res.data;
}

/** PATCH /api/admin/speaker-slots/events/:eventId/days/:dayId */
export async function updateEventDay(
  eventId: string,
  dayId: string,
  body: Partial<CreateDayBody>
): Promise<unknown> {
  const res = await api().patch(backendRoutes.admin.speakerSlots.eventDayUpdate(eventId, dayId), body);
  return res.data;
}

/** GET /api/admin/speaker-slots/events/:eventId/bookings – list all bookings for an event */
export type EventBookingsSlot = {
  date?: string;
  startTime?: string;
  endTime?: string;
  startTimeWAT?: string;
  endTimeWAT?: string;
  theme?: string;
  sessionType?: string;
  capacity?: number;
};
export type EventBookingsSpeaker = {
  fullName?: string;
  email?: string;
  xHandle?: string;
  topicAngle?: string;
  bioLink?: string;
  phone?: string;
};
export type EventBookingItem = {
  bookingId: string;
  slotId: string;
  slot?: EventBookingsSlot;
  speaker?: EventBookingsSpeaker;
  createdAt?: string;
};
export type EventBookingsResponse = {
  event?: { id?: string; name?: string };
  bookings?: EventBookingItem[];
};

export async function getEventBookings(eventId: string): Promise<EventBookingsResponse> {
  const res = await api().get<EventBookingsResponse>(backendRoutes.admin.speakerSlots.eventBookings(eventId));
  return res.data;
}

export function getEventExportUrl(eventId: string): string {
  const base = (process.env.NEXT_PUBLIC_BACKEND_API_URL ?? "").trim();
  return `${base}/${backendRoutes.admin.speakerSlots.eventExport(eventId)}?format=csv`;
}

export async function exportEventCsv(eventId: string): Promise<Blob> {
  const res = await api().get<Blob>(backendRoutes.admin.speakerSlots.eventExport(eventId), {
    params: { format: "csv" },
    responseType: "blob",
  });
  return res.data;
}

export async function updateBooking(bookingId: string, body: { slotId?: string; status?: string }): Promise<unknown> {
  const res = await api().patch(backendRoutes.admin.speakerSlots.bookingUpdate(bookingId), body);
  return res.data;
}

export async function deleteBooking(bookingId: string): Promise<unknown> {
  const res = await api().delete(backendRoutes.admin.speakerSlots.bookingDelete(bookingId));
  return res.data;
}

export async function deleteSlot(slotId: string): Promise<unknown> {
  const res = await api().delete(backendRoutes.admin.speakerSlots.slotDelete(slotId));
  return res.data;
}

export type CreateSlotBody = {
  /** Required when not sending dayId. Any date format; backend normalizes to YYYY-MM-DD. */
  date?: string;
  /** Required when not sending dayId. Day label, e.g. "Day 1". */
  label?: string;
  dayId?: string;
  startTime: string;
  endTime: string;
  theme?: string;
  capacity?: number;
  sessionType?: string;
};

export async function createSlots(eventId: string, slots: CreateSlotBody[]): Promise<unknown> {
  const res = await api().post(backendRoutes.admin.speakerSlots.eventSlots(eventId), slots);
  return res.data;
}

export async function listSlots(eventId: string): Promise<ScheduleSlot[]> {
  const res = await api().get<ScheduleSlot[]>(backendRoutes.admin.speakerSlots.eventSlots(eventId));
  return Array.isArray(res.data) ? res.data : [];
}

export type SeedDataDay = { id: string; name?: string; theme?: string; date?: string };
export type SeedDataSlot = {
  dayId: string;
  startTime: string;
  endTime: string;
  theme?: string;
  capacity?: number;
  sessionType?: string;
};
export type SeedDataResponse = {
  event: { name?: string; slug?: string; id?: string };
  days: SeedDataDay[];
  slots: SeedDataSlot[];
};

export async function getSeedData(): Promise<SeedDataResponse> {
  const res = await api().get<SeedDataResponse>(backendRoutes.speakerSlots.seedData);
  return res.data;
}

export type CreateInvitesBody = { count?: number; expiresAt?: string };

export type CreateInvitesResponse = {
  tokens?: string[];
  invites?: { token: string; [key: string]: unknown }[];
  token?: string;
};

export async function createInvites(eventId: string, body: CreateInvitesBody): Promise<CreateInvitesResponse> {
  const res = await api().post<CreateInvitesResponse>(backendRoutes.admin.speakerSlots.eventInvites(eventId), body);
  return res.data;
}

/** Build the public invite link speakers open in the browser (frontend route). */
export function inviteLinkForToken(token: string): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/speaker-invite/${token}`;
  }
  return `/speaker-invite/${token}`;
}
