export const SIGNUP_DRAFT_KEY = "signup_draft";
export const SIGNUP_NEXT_PATH_KEY = "signup_next_path";

export type SignupDraft = {
  email?: string;
  firstName?: string;
  lastName?: string;
  emailVerified?: boolean;
  passwordSet?: boolean;
};

export function saveSignupDraft(draft: SignupDraft) {
  if (typeof window === "undefined") return;
  const existing = readSignupDraft() ?? {};
  window.sessionStorage.setItem(
    SIGNUP_DRAFT_KEY,
    JSON.stringify({ ...existing, ...draft })
  );
}

export function readSignupDraft(): SignupDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(SIGNUP_DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SignupDraft;
  } catch {
    return null;
  }
}

export function setSignupNextPath(path: string) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(SIGNUP_NEXT_PATH_KEY, path);
}

export function consumeSignupNextPath(): string | null {
  if (typeof window === "undefined") return null;
  const path = window.sessionStorage.getItem(SIGNUP_NEXT_PATH_KEY);
  if (path) {
    window.sessionStorage.removeItem(SIGNUP_NEXT_PATH_KEY);
  }
  return path;
}

export function peekSignupNextPath(): string | null {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(SIGNUP_NEXT_PATH_KEY);
}
