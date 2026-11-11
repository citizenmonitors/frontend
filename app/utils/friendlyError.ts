/** Shown instead of raw storage errors (e.g. the cloud bucket's billing is off). */
export const UPLOAD_UNAVAILABLE_MESSAGE =
  "Image upload isn't working right now. Please try again later, or continue without the image.";

const UPLOAD_FAILURE = /failed to upload|billing account|accountDisabled|storage\.googleapis|bucket/i;
// Raw JSON, stack traces and similar text that isn't meant for people
const RAW_TEXT = /[{[]\s*"|"\s*:\s*[{["\d]|\n\s+at\s|\bstack\b|ECONN|ETIMEDOUT/i;

/** Turns a server message into something safe and readable to show users. */
export function friendlyServerMessage(message: unknown, fallback: string): string {
  if (typeof message !== "string" || !message.trim()) return fallback;
  const text = message.trim();
  if (UPLOAD_FAILURE.test(text)) return UPLOAD_UNAVAILABLE_MESSAGE;
  if (RAW_TEXT.test(text) || text.length > 240) return fallback;
  return text;
}
