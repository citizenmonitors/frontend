import { NextResponse } from "next/server";
import { getSlotsWithBookedCounts, getBookings, getDays } from "@/app/data/speaker-invite-mock";

export async function GET() {
  const slots = getSlotsWithBookedCounts();
  const bookings = getBookings();
  const days = getDays();

  const header = "Date,Day Theme,Time (WAT),Session Type,Capacity,Booked,Name,Email,X Handle,Topic/Angle,Bio Link,Phone,Status";
  const rows: string[] = [header];

  slots.forEach((slot) => {
    const day = days.find((d) => d.id === slot.dayId)!;
    const slotBookings = bookings.filter((b) => b.slotId === slot.id);
    const timeWAT = `${slot.start}–${slot.end}`;
    if (slotBookings.length === 0) {
      rows.push([day.date, day.theme, timeWAT, slot.sessionType, slot.capacity, slot.bookedCount, "", "", "", "", "", "", ""].join(","));
    } else {
      slotBookings.forEach((b) => {
        rows.push(
          [
            day.date,
            day.theme,
            timeWAT,
            slot.sessionType,
            slot.capacity,
            slot.bookedCount,
            `"${(b.name || "").replace(/"/g, '""')}"`,
            b.email,
            b.xHandle,
            `"${(b.topicAngle || "").replace(/"/g, '""')}"`,
            b.bioLink,
            b.phone ?? "",
            b.status,
          ].join(",")
        );
      });
    }
  });

  const csv = rows.join("\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=speaker-schedule.csv",
    },
  });
}
