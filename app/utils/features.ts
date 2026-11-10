/**
 * Feature switches read at build time. Set to "true" to turn a feature on.
 * Production leaves these unset, so the feature stays off there.
 */
export const collationEnabled = process.env.NEXT_PUBLIC_FEATURE_COLLATION === "true";

/** Public paths that belong to Results/Collation (IReV). */
export const COLLATION_PATHS = ["/collation", "/results", "/elections"];

/**
 * Host that serves Pulse at its root, e.g. "pulse.citizenmonitors.com".
 * Unset = Pulse stays at /pulse on the main site.
 */
export const pulseHost = (process.env.NEXT_PUBLIC_PULSE_HOST ?? "").trim().toLowerCase();

/** Link to Pulse, e.g. pulseHref("?post=123"). */
export function pulseHref(query = "") {
  return pulseHost ? `https://${pulseHost}/${query}` : `/pulse${query}`;
}
