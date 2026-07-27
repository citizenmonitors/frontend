export function generateAnonymousHandle() {
  const suffix = Math.floor(100 + Math.random() * 900);
  return `@citizen_iron${suffix}`;
}

export function formatPulseTimeAgo(date?: string) {
  if (!date) return "";
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

export function getVisibilityScopeLabel(scope: string) {
  switch (scope) {
    case "ward":
      return "Post Within My Ward";
    case "lga":
      return "Post Within My LGA";
    case "polling-unit":
      return "Post Within Polling Unit";
    default:
      return `Post Within ${scope.replace(/-/g, " ")}`;
  }
}

export const PULSE_BODY_MAX_LENGTH = 5000;
