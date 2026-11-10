import Cookies from "js-cookie";

export const cookieData = {
  // in days
  login: {
    name: 'session_token',
    expiration: 7,
  },
}

/**
 * Parent domain for the login cookie, e.g. ".citizenmonitors.com", so the
 * main site and pulse.citizenmonitors.com share one login. Only used when the
 * page is actually on that domain (localhost and preview URLs keep host-only).
 */
function loginCookieDomain(): string | undefined {
  const domain = (process.env.NEXT_PUBLIC_COOKIE_DOMAIN ?? "").trim().toLowerCase();
  if (!domain || typeof window === "undefined") return undefined;
  const bare = domain.replace(/^\./, "");
  const host = window.location.hostname.toLowerCase();
  return host === bare || host.endsWith(`.${bare}`) ? domain : undefined;
}

/** Save the login token. Pass expires = undefined for a browser-session cookie. */
export function setLoginCookie(
  token: string,
  expires: number | undefined = cookieData.login.expiration
) {
  const domain = loginCookieDomain();
  // Drop any old host-only copy so it can't shadow the shared one
  if (domain) Cookies.remove(cookieData.login.name);
  Cookies.set(cookieData.login.name, token, { expires, ...(domain ? { domain } : {}) });
}

export function removeLoginCookie() {
  Cookies.remove(cookieData.login.name);
  const domain = loginCookieDomain();
  if (domain) Cookies.remove(cookieData.login.name, { domain });
}
