import { NextRequest, NextResponse } from "next/server";
import type { BookRequest, BookResponse } from "@/app/types/speaker-invite";
import {
  getSlotsWithBookedCounts,
  addBooking,
  getBookingByEmail,
} from "@/app/data/speaker-invite-mock";
import { getDays } from "@/app/data/speaker-invite-mock";

export async function POST(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  if (!params.token) {
    return NextResponse.json({ error: "Invalid invite link" }, { status: 400 });
  }

  let body: BookRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const fullName = body.fullName ?? (body as { name?: string }).name;
  const { slotId, email, xHandle, bioLink, topicAngle, phone } = body;
  if (!slotId || !fullName || !email || !xHandle) {
    return NextResponse.json(
      { error: "Missing required fields: slotId, fullName, email, xHandle" },
      { status: 400 }
    );
  }

  const existing = getBookingByEmail(email);
  if (existing) {
    return NextResponse.json(
      { error: "You have already confirmed a slot. One slot per speaker." },
      { status: 409 }
    );
  }

  const slots = getSlotsWithBookedCounts();
  const slot = slots.find((s) => s.id === slotId);
  if (!slot) {
    return NextResponse.json({ error: "Slot not found" }, { status: 404 });
  }
  if (slot.bookedCount >= slot.capacity) {
    return NextResponse.json({ error: "This slot is full" }, { status: 409 });
  }

  const booking = addBooking({
    slotId,
    name: fullName,
    email,
    xHandle,
    bioLink: bioLink ?? "",
    topicAngle: topicAngle ?? "",
    phone,
    status: "confirmed",
  });

  const day = getDays().find((d) => d.id === slot.dayId)!;
  const response: BookResponse = {
    bookingId: booking.id,
    slot: {
      date: day.date,
      timeWAT: `${slot.start}–${slot.end} WAT`,
      theme: slot.theme,
      sessionType: slot.sessionType,
    },
  };

  return NextResponse.json(response);
}
