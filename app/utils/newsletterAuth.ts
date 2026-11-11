/**
 * Newsletter page (/newsletter: newsletter + News & Insight) login. Server only.
 *
 * The Newsletter page has its own username/password, set in the server env, separate from
 * backend admin accounts. A signed, httpOnly cookie keeps the session.
 * Uses Web Crypto so it runs in both Node and Edge.
 */

export const NEWSLETTER_COOKIE = "newsletter_session";
export const NEWSLETTER_SESSION_HOURS = 12;

const encoder = new TextEncoder();

function env(name: string): string {
  return (process.env[name] ?? "").trim();
}

// Names as set in Vercel (older names still work)
const loginPassword = () => env("NEWSLETTER_PASS") || env("NEWSLETTER_PASSWORD");
const sessionSecret = () => env("NEWSLETTER_SESSION") || env("NEWSLETTER_SESSION_SECRET");

export function newsletterConfigured(): boolean {
  return Boolean(env("NEWSLETTER_USERNAME") && loginPassword() && sessionSecret());
}

function toBase64Url(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let bin = "";
  arr.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(text: string): string {
  const b64 = text.replace(/-/g, "+").replace(/_/g, "/");
  return atob(b64 + "=".repeat((4 - (b64.length % 4)) % 4));
}

async function hmac(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(sessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return toBase64Url(await crypto.subtle.sign("HMAC", key, encoder.encode(data)));
}

/** Compare without leaking how many characters matched. */
async function safeEqual(a: string, b: string): Promise<boolean> {
  const [ha, hb] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(a)),
    crypto.subtle.digest("SHA-256", encoder.encode(b)),
  ]);
  const x = new Uint8Array(ha);
  const y = new Uint8Array(hb);
  let diff = 0;
  for (let i = 0; i < x.length; i += 1) diff |= x[i] ^ y[i];
  return diff === 0;
}

export async function checkNewsletterCredentials(username: string, password: string): Promise<boolean> {
  if (!newsletterConfigured()) return false;
  const [userOk, passOk] = await Promise.all([
    safeEqual(username.trim().toLowerCase(), env("NEWSLETTER_USERNAME").toLowerCase()),
    safeEqual(password, loginPassword()),
  ]);
  return userOk && passOk;
}

export async function createNewsletterSession(username: string): Promise<string> {
  const payload = toBase64Url(
    encoder.encode(
      JSON.stringify({ u: username, exp: Date.now() + NEWSLETTER_SESSION_HOURS * 3600_000 })
    )
  );
  return `${payload}.${await hmac(payload)}`;
}

/** Returns the username for a valid session, otherwise null. */
export async function readNewsletterSession(token: string | undefined | null): Promise<string | null> {
  if (!token || !newsletterConfigured()) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  if (!(await safeEqual(signature, await hmac(payload)))) return null;
  try {
    const data = JSON.parse(fromBase64Url(payload));
    if (typeof data?.exp !== "number" || data.exp < Date.now()) return null;
    return typeof data.u === "string" ? data.u : null;
  } catch {
    return null;
  }
}

export function newsletterCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: NEWSLETTER_SESSION_HOURS * 3600,
  };
}
