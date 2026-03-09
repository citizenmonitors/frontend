import { NextResponse } from "next/server";
import { getSlotsWithBookedCounts, getBookings, getDays } from "@/app/data/speaker-invite-mock";

export async function GET() {
  const slots = getSlotsWithBookedCounts();
  const bookings = getBookings();
  const days = getDays();

  const schedule = slots.map((slot) => {
    const day = days.find((d) => d.id === slot.dayId)!;
    const slotBookings = bookings.filter((b) => b.slotId === slot.id);
    return {
      ...slot,
      date: day.date,
      dayTheme: day.theme,
      bookings: slotBookings,
    };
  });

  return NextResponse.json({ schedule, days });
}
