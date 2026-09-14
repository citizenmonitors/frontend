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
    case "public":
    case "nationwide":
    case "national":
      return "Public";
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

/** Prefer the post's place name: "Post Within Alimosho" */
export function getPulsePostLocationLabel(post: {
  locationLabel?: string | null;
  location?: {
    state?: string;
    lga?: string;
    ward?: string;
    pollingUnit?: string;
  } | null;
  visibilityScope?: string;
}) {
  const fromFields =
    post.locationLabel?.trim() ||
    post.location?.pollingUnit?.trim() ||
    post.location?.ward?.trim() ||
    post.location?.lga?.trim() ||
    post.location?.state?.trim() ||
    "";

  if (fromFields) {
    return `Post Within ${fromFields}`;
  }

  const scope = post.visibilityScope;
  if (scope && !["public", "nationwide", "national"].includes(scope)) {
    return getVisibilityScopeLabel(scope);
  }

  return "Post Within Nigeria";
}

export const PULSE_BODY_MAX_LENGTH = 5000;
