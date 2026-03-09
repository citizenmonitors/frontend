import { NextRequest, NextResponse } from "next/server";
import type { SpeakerInviteDay, SpeakerInviteSlot } from "@/app/types/speaker-invite";
import { getEventName, getDays, getSlots, setEvent } from "@/app/data/speaker-invite-mock";

export async function GET() {
  const eventName = getEventName();
  const days = getDays();
  const slots = getSlots().map((s) => ({
    id: s.id,
    dayId: s.dayId,
    start: s.start,
    end: s.end,
    theme: s.theme,
    capacity: s.capacity,
    sessionType: s.sessionType,
    timezone: s.timezone,
  }));
  return NextResponse.json({ eventName, days, slots });
}

export async function POST(req: NextRequest) {
  let body: {
    eventName?: string;
    days?: Array<{ id: string; name: string; theme: string; date: string }>;
    slots?: Array<{ id: string; dayId: string; start: string; end: string; theme: string; capacity: number; sessionType: "keynote" | "panel"; timezone?: string }>;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const updates: { eventName?: string; days?: SpeakerInviteDay[]; slots?: Omit<SpeakerInviteSlot, "bookedCount">[] } = {};
  if (body.eventName !== undefined) updates.eventName = body.eventName;
  if (body.days !== undefined && Array.isArray(body.days)) updates.days = body.days as SpeakerInviteDay[];
  if (body.slots !== undefined && Array.isArray(body.slots)) {
    updates.slots = body.slots.map((s) => ({
      id: s.id,
      dayId: s.dayId,
      start: s.start,
      end: s.end,
      theme: s.theme,
      capacity: s.capacity,
      sessionType: s.sessionType,
      timezone: s.timezone ?? "Africa/Lagos",
    }));
  }
  if (Object.keys(updates).length > 0) setEvent(updates);

  return NextResponse.json({ ok: true });
}
