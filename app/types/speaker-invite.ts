export type SpeakerInviteDay = {
  id: string;
  name: string;
  theme: string;
  date: string; // YYYY-MM-DD
  description?: string;
};

export type SpeakerInviteSlot = {
  id: string;
  dayId: string;
  /** Day date (YYYY-MM-DD). Some backends also include it on slot. */
  date?: string;
  start: string; // ISO or "HH:mm"
  end: string;
  theme: string;
  capacity: number;
  bookedCount: number;
  sessionType: "keynote" | "panel";
  timezone: string;
};

export type SpeakerBooking = {
  id: string;
  slotId: string;
  name: string;
  email: string;
  xHandle: string;
  bioLink: string;
  topicAngle: string;
  phone?: string;
  status: "confirmed" | "pending";
  createdAt: string;
};

export type InviteResponse = {
  event: { name: string; days: SpeakerInviteDay[] };
  slots: SpeakerInviteSlot[];
  currentBooking: (SpeakerBooking & { slot: SpeakerInviteSlot }) | null;
};

/** Request body for POST api/speaker-slots/book */
export type BookRequest = {
  inviteToken: string;
  slotId: string;
  fullName: string;
  email: string;
  xHandle: string;
  bioLink: string;
  topicAngle: string;
  phone?: string;
};

export type BookResponse = {
  bookingId: string;
  slot: {
    date: string;
    timeWAT: string;
    theme: string;
    sessionType: string;
  };
}

export type SlotStatus = "available" | "fewSpotsLeft" | "full" | "yourSlot";
