import backendURL from "./backend";
import { backendRoutes } from "./backend";

const base = () => backendURL;

export function speakerSlotsInviteUrl(token: string): string {
  return `${base()}/${backendRoutes.speakerSlots.invite(token)}`;
}

export function speakerSlotsBookUrl(): string {
  return `${base()}/${backendRoutes.speakerSlots.book}`;
}

export function speakerSlotsConfirmUrl(bookingId: string): string {
  return `${base()}/${backendRoutes.speakerSlots.confirm(bookingId)}`;
}

export function speakerSlotsIcsUrl(bookingId: string): string {
  return `${base()}/${backendRoutes.speakerSlots.ics(bookingId)}`;
}
