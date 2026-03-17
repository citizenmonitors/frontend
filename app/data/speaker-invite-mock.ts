import type { SpeakerInviteDay, SpeakerInviteSlot, SpeakerBooking } from "@/app/types/speaker-invite";

const defaultDays: SpeakerInviteDay[] = [
  { id: "day1", name: "Day 1", theme: "People Focus", date: "2026-05-01" },
  { id: "day2", name: "Day 2", theme: "People Power", date: "2026-05-02" },
  { id: "day3", name: "Day 3", theme: "People Protest", date: "2026-05-03" },
];

const defaultSlots: SpeakerInviteSlot[] = [
  // Day 1: 09:00–18:00 in 2-hour panels
  { id: "s1", dayId: "day1", start: "09:00", end: "11:00", theme: "People Focus", capacity: 6, bookedCount: 0, sessionType: "panel", timezone: "Africa/Lagos" },
  { id: "s2", dayId: "day1", start: "11:00", end: "13:00", theme: "People Focus", capacity: 6, bookedCount: 0, sessionType: "panel", timezone: "Africa/Lagos" },
  { id: "s3", dayId: "day1", start: "13:00", end: "15:00", theme: "People Focus", capacity: 6, bookedCount: 0, sessionType: "panel", timezone: "Africa/Lagos" },
  { id: "s4", dayId: "day1", start: "15:00", end: "17:00", theme: "People Focus", capacity: 6, bookedCount: 0, sessionType: "panel", timezone: "Africa/Lagos" },
  // Day 2: 09:00–18:00 in 2-hour panels
  { id: "s5", dayId: "day2", start: "09:00", end: "11:00", theme: "People Power", capacity: 6, bookedCount: 0, sessionType: "panel", timezone: "Africa/Lagos" },
  { id: "s6", dayId: "day2", start: "11:00", end: "13:00", theme: "People Power", capacity: 6, bookedCount: 0, sessionType: "panel", timezone: "Africa/Lagos" },
  { id: "s7", dayId: "day2", start: "13:00", end: "15:00", theme: "People Power", capacity: 6, bookedCount: 0, sessionType: "panel", timezone: "Africa/Lagos" },
  { id: "s8", dayId: "day2", start: "15:00", end: "17:00", theme: "People Power", capacity: 6, bookedCount: 0, sessionType: "panel", timezone: "Africa/Lagos" },
  // Day 3: 09:00–18:00 in 2-hour panels
  { id: "s9", dayId: "day3", start: "09:00", end: "11:00", theme: "People Protest", capacity: 6, bookedCount: 0, sessionType: "panel", timezone: "Africa/Lagos" },
  { id: "s10", dayId: "day3", start: "11:00", end: "13:00", theme: "People Protest", capacity: 6, bookedCount: 0, sessionType: "panel", timezone: "Africa/Lagos" },
  { id: "s11", dayId: "day3", start: "13:00", end: "15:00", theme: "People Protest", capacity: 6, bookedCount: 0, sessionType: "panel", timezone: "Africa/Lagos" },
  { id: "s12", dayId: "day3", start: "15:00", end: "17:00", theme: "People Protest", capacity: 6, bookedCount: 0, sessionType: "panel", timezone: "Africa/Lagos" },
];

// Mutable event config (admin can create/edit)
let eventName = "72-Hour X Space";
let daysStore: SpeakerInviteDay[] = [...defaultDays];
let slotsStore: SpeakerInviteSlot[] = defaultSlots.map((s) => ({ ...s }));

export function getEventName(): string {
  return eventName;
}

export function getDays(): SpeakerInviteDay[] {
  return [...daysStore];
}

export function getSlots(): SpeakerInviteSlot[] {
  return slotsStore.map((s) => ({ ...s }));
}

export function setEvent(config: {
  eventName?: string;
  days?: SpeakerInviteDay[];
  slots?: Omit<SpeakerInviteSlot, "bookedCount">[];
}) {
  if (config.eventName !== undefined) eventName = config.eventName;
  if (config.days !== undefined) daysStore = config.days.map((d) => ({ ...d }));
  if (config.slots !== undefined) {
    slotsStore = config.slots.map((s) => ({
      ...s,
      bookedCount: 0,
    }));
  }
}

// In-memory store for demo. Backend will replace this.
const bookingsStore: SpeakerBooking[] = [];

export function getBookings(): SpeakerBooking[] {
  return [...bookingsStore];
}

export function addBooking(booking: Omit<SpeakerBooking, "id" | "createdAt">): SpeakerBooking {
  const id = `b-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const created: SpeakerBooking = {
    ...booking,
    id,
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };
  bookingsStore.push(created);
  return created;
}

export function getBookingsBySlotId(slotId: string): SpeakerBooking[] {
  return bookingsStore.filter((b) => b.slotId === slotId);
}

export function getBookingByEmail(email: string): SpeakerBooking | undefined {
  return bookingsStore.find((b) => b.email.toLowerCase() === email.toLowerCase());
}

export function getSlotsWithBookedCounts(): SpeakerInviteSlot[] {
  const counts: Record<string, number> = {};
  bookingsStore.forEach((b) => {
    counts[b.slotId] = (counts[b.slotId] ?? 0) + 1;
  });
  return getSlots().map((s) => ({
    ...s,
    bookedCount: counts[s.id] ?? 0,
  }));
}

export function updateBooking(id: string, updates: Partial<Pick<SpeakerBooking, "slotId" | "status">>): SpeakerBooking | null {
  const i = bookingsStore.findIndex((b) => b.id === id);
  if (i === -1) return null;
  bookingsStore[i] = { ...bookingsStore[i], ...updates };
  return bookingsStore[i];
}

export function getBookingById(id: string): SpeakerBooking | null {
  return bookingsStore.find((b) => b.id === id) ?? null;
}
