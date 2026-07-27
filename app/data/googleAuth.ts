import axios from "axios";
import backendAxiosConfig from "./axiosConfig";
import { backendRoutes } from "./backend";

const GOOGLE_DEVICE_ID_KEY = "google_auth_device_id";
const FIREBASE_PUSH_TOKEN_KEY = "firebase_push_token";

export type GoogleAuthResponse = {
  token: string;
  requiresPasswordSetup?: boolean;
  nextStep?: string;
  user?: {
    email?: string;
    firstName?: string;
    lastName?: string;
  };
};

export const GOOGLE_SIGNUP_DRAFT_KEY = "signup_draft";

export function decodeGoogleIdTokenEmail(idToken: string): string | undefined {
  try {
    const payload = idToken.split(".")[1];
    if (!payload) return undefined;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(normalized)) as { email?: string };
    return typeof decoded.email === "string" ? decoded.email : undefined;
  } catch {
    return undefined;
  }
}

export {
  saveSignupDraft as saveGoogleSignupDraft,
  readSignupDraft as readGoogleSignupDraft,
} from "./signupDraft";
export type { SignupDraft } from "./signupDraft";

function getDeviceId(): string {
  const storedDeviceId = window.localStorage.getItem(GOOGLE_DEVICE_ID_KEY);
  if (storedDeviceId) return storedDeviceId;

  const deviceId =
    typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `web-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  window.localStorage.setItem(GOOGLE_DEVICE_ID_KEY, deviceId);
  return deviceId;
}

function getPlatform(): "android" | "ios" | "web" {
  const userAgent = window.navigator.userAgent.toLowerCase();
  if (userAgent.includes("android")) return "android";
  if (/iphone|ipad|ipod/.test(userAgent)) return "ios";
  return "web";
}

export async function authenticateWithGoogleIdToken(
  idToken: string,
  _options: { mode?: "login" | "signup" } = {}
): Promise<GoogleAuthResponse> {
  const pushToken = window.localStorage.getItem(FIREBASE_PUSH_TOKEN_KEY);

  // Keep payload aligned with mobile API contract (idToken + device metadata only).
  const { data } = await axios.post<GoogleAuthResponse>(
    backendRoutes.auth.google,
    {
      idToken,
      platform: getPlatform(),
      deviceId: getDeviceId(),
      appVersion: process.env.NEXT_PUBLIC_APP_VERSION ?? "1.0.0",
      ...(pushToken ? { pushToken } : {}),
    },
    backendAxiosConfig()
  );

  return data;
}
