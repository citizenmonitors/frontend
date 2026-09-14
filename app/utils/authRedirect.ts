/**
 * Safe post-auth redirects for public surfaces like Pulse.
 * Only same-origin relative paths are allowed.
 */

export const AUTH_REDIRECT_STORAGE_KEY = "citimoni_auth_redirect";

export function getSafeRedirectPath(
  value: string | null | undefined
): string | null {
  if (!value) return null;

  let decoded = value;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    return null;
  }

  const path = decoded.trim();
  if (!path.startsWith("/") || path.startsWith("//")) return null;
  if (path.startsWith("/auth")) return null;
  return path;
}

export function rememberAuthRedirect(path: string | null | undefined) {
  if (typeof window === "undefined") return;
  const safe = getSafeRedirectPath(path);
  if (safe) {
    sessionStorage.setItem(AUTH_REDIRECT_STORAGE_KEY, safe);
  }
}

export function peekAuthRedirect(): string | null {
  if (typeof window === "undefined") return null;
  return getSafeRedirectPath(sessionStorage.getItem(AUTH_REDIRECT_STORAGE_KEY));
}

export function consumeAuthRedirect(): string | null {
  if (typeof window === "undefined") return null;
  const value = peekAuthRedirect();
  sessionStorage.removeItem(AUTH_REDIRECT_STORAGE_KEY);
  return value;
}

export function buildLoginHref(redirectTo?: string | null) {
  const safe = getSafeRedirectPath(redirectTo);
  if (!safe) return "/auth/login";
  return `/auth/login?redirect=${encodeURIComponent(safe)}`;
}

export function buildSignupHref(redirectTo?: string | null) {
  const safe = getSafeRedirectPath(redirectTo);
  if (!safe) return "/auth/signup";
  return `/auth/signup?redirect=${encodeURIComponent(safe)}`;
}

export function getPostLoginPath(
  role: string | undefined | null,
  preferredRedirect?: string | null
) {
  if (role && ["admin", "super-admin"].includes(role)) {
    return "/admin/dashboard";
  }
  return getSafeRedirectPath(preferredRedirect) || "/portal/dashboard";
}
