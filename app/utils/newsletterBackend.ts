/**
 * Server-only: the Newsletter page talks to the backend as one service admin account
 * (NEWSLETTER_BACKEND_EMAIL / NEWSLETTER_BACKEND_PASS), so its users never
 * see or need backend admin credentials.
 */

let cachedToken: { value: string; at: number } | null = null;
const TOKEN_MAX_AGE_MS = 6 * 3600_000;

/** Name as set in Vercel (the older name still works) */
function backendPassword(): string {
  return process.env.NEWSLETTER_BACKEND_PASS || process.env.NEWSLETTER_BACKEND_PASSWORD || "";
}

export function upstreamBase(): string {
  return (process.env.BACKEND_API_URL ?? process.env.NEXT_PUBLIC_BACKEND_API_URL ?? "")
    .trim()
    .replace(/\/$/, "");
}

export function accessHeaders(): Record<string, string> {
  const token = (process.env.INHOUSE_API_ACCESS_TOKEN ?? "").trim();
  const name = (process.env.API_ACCESS_HEADER ?? "X-Inhouse-Access-Token").trim();
  return token && name ? { [name]: token } : {};
}

export function newsletterBackendConfigured(): boolean {
  return Boolean(
    upstreamBase() &&
      (process.env.NEWSLETTER_BACKEND_EMAIL ?? "").trim() &&
      backendPassword().trim()
  );
}

/** Admin token for the service account; signs in again when stale or forced. */
export async function getServiceToken(force = false): Promise<string> {
  if (!force && cachedToken && Date.now() - cachedToken.at < TOKEN_MAX_AGE_MS) {
    return cachedToken.value;
  }
  const res = await fetch(`${upstreamBase()}/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...accessHeaders() },
    body: JSON.stringify({
      email: (process.env.NEWSLETTER_BACKEND_EMAIL ?? "").trim(),
      password: backendPassword(),
      rememberMe: true,
    }),
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  const role = data?.user?.role;
  if (!res.ok || typeof data?.token !== "string") {
    cachedToken = null;
    throw new Error(`Newsletter service sign-in failed (${res.status})`);
  }
  if (!["admin", "super-admin"].includes(role)) {
    cachedToken = null;
    throw new Error("Newsletter service account is not an admin");
  }
  cachedToken = { value: data.token, at: Date.now() };
  return data.token;
}
