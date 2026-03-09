import { NextRequest, NextResponse } from "next/server";
import { getSlotsWithBookedCounts, updateBooking, getBookingById } from "@/app/data/speaker-invite-mock";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  if (!id) return NextResponse.json({ error: "Booking ID required" }, { status: 400 });

  let body: { slotId?: string; status?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const existing = getBookingById(id);
  if (!existing) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  if (body.slotId) {
    const slots = getSlotsWithBookedCounts();
    const slot = slots.find((s) => s.id === body.slotId);
    if (!slot) return NextResponse.json({ error: "Slot not found" }, { status: 404 });
    if (slot.bookedCount >= slot.capacity) {
      return NextResponse.json({ error: "Target slot is full" }, { status: 409 });
    }
  }

  const updated = updateBooking(id, {
    ...(body.slotId && { slotId: body.slotId }),
    ...(body.status && { status: body.status as "confirmed" | "pending" }),
  });

  return NextResponse.json(updated);
}
