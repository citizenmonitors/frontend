/**
 * Feature switches read at build time. Set to "true" to turn a feature on.
 * Production leaves these unset, so the feature stays off there.
 */
export const collationEnabled = process.env.NEXT_PUBLIC_FEATURE_COLLATION === "true";

/** Public paths that belong to Results/Collation (IReV). */
export const COLLATION_PATHS = ["/collation", "/results", "/elections"];
