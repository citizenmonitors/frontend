import { NextRequest, NextResponse } from "next/server";
import type { InviteResponse } from "@/app/types/speaker-invite";
import { getEventName, getDays, getSlotsWithBookedCounts, getBookingByEmail } from "@/app/data/speaker-invite-mock";

export async function GET(
  _req: NextRequest,
  { params }: { params: { token: string } }
) {
  const token = params.token;
  if (!token) {
    return NextResponse.json({ error: "Invalid invite link" }, { status: 400 });
  }

  const slots = getSlotsWithBookedCounts();
  const email = _req.nextUrl.searchParams.get("email");
  const currentBooking = email ? getBookingByEmail(email) : null;
  const currentBookingWithSlot = currentBooking
    ? {
        ...currentBooking,
        slot: slots.find((s) => s.id === currentBooking.slotId)!,
      }
    : null;

  const body: InviteResponse = {
    event: {
      name: getEventName(),
      days: getDays(),
    },
    slots,
    currentBooking: currentBookingWithSlot,
  };

  return NextResponse.json(body);
}
