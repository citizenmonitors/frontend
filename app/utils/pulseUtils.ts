export function generateAnonymousHandle() {
  const suffix = Math.floor(100 + Math.random() * 900);
  return `@citizen_iron${suffix}`;
}

export function formatPulseTimeAgo(date?: string) {
  if (!date) return "";
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w`;
}

export type PulseLocationFilter =
  | "all"
  | "state"
  | "lga"
  | "ward"
  | "pollingUnit";

type PulseLocationUser = {
  state?: string;
  lga?: string;
  ward?: string;
  pollingUnit?: string;
} | null;

function normalize(value?: string | null) {
  return (value || "").trim().toLowerCase();
}

function includesLoose(haystack: string, needle: string) {
  if (!needle) return false;
  return haystack.includes(needle);
}

/** Filter feed posts by the signed-in user's coverage location */
export function postMatchesLocationFilter(
  post: {
    locationLabel?: string | null;
    location?: {
      state?: string;
      lga?: string;
      ward?: string;
      pollingUnit?: string;
    } | null;
  },
  filter: PulseLocationFilter,
  user: PulseLocationUser
) {
  if (filter === "all") return true;
  if (!user) return false;

  const target =
    filter === "state"
      ? user.state
      : filter === "lga"
        ? user.lga
        : filter === "ward"
          ? user.ward
          : user.pollingUnit;

  const needle = normalize(target);
  if (!needle) return false;

  const loc = post.location;
  const exact =
    filter === "state"
      ? normalize(loc?.state)
      : filter === "lga"
        ? normalize(loc?.lga)
        : filter === "ward"
          ? normalize(loc?.ward)
          : normalize(loc?.pollingUnit);

  if (exact && exact === needle) return true;

  const haystack = [
    post.locationLabel,
    loc?.state,
    loc?.lga,
    loc?.ward,
    loc?.pollingUnit,
  ]
    .map((part) => normalize(part))
    .filter(Boolean)
    .join(" ");

  return includesLoose(haystack, needle);
}

export function getLocationFilterEmptyMessage(
  filter: PulseLocationFilter,
  user: PulseLocationUser
) {
  if (filter === "all") {
    return "No posts yet. Be the first to share an update.";
  }
  if (!user) {
    return "Sign in to filter Pulse by your State, LGA, Ward, or Polling Unit.";
  }
  const labels: Record<Exclude<PulseLocationFilter, "all">, string> = {
    state: user.state || "your state",
    lga: user.lga || "your LGA",
    ward: user.ward || "your ward",
    pollingUnit: user.pollingUnit || "your polling unit",
  };
  return `No posts near ${labels[filter]} yet. Share the first update for your area.`;
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

/** Build the nested quote payload from a feed post */
export function toPulseQuotedPost(post: {
  id: string;
  body: string;
  imageUrl?: string | null;
  author: { id: string; displayName: string; usedAnonymous: boolean };
  locationLabel?: string | null;
  location?: {
    state?: string;
    lga?: string;
    ward?: string;
    pollingUnit?: string;
  } | null;
  createdAt?: string;
}) {
  const place =
    post.locationLabel?.trim() ||
    post.location?.pollingUnit?.trim() ||
    post.location?.ward?.trim() ||
    post.location?.lga?.trim() ||
    post.location?.state?.trim() ||
    null;

  return {
    id: post.id,
    body: post.body,
    imageUrl: post.imageUrl ?? null,
    author: post.author,
    locationLabel: place,
    createdAt: post.createdAt,
  };
}

export function isPureRepost(post: { body?: string; quotedPost?: unknown }) {
  return Boolean(post.quotedPost) && !(post.body || "").trim();
}
