"use client";

import React, { useEffect, useRef, useState } from "react";

type GoogleAuthButtonProps = {
  onCredential: (idToken: string) => void;
  onError?: (message: string) => void;
  disabled?: boolean;
};

type GoogleCredentialResponse = {
  credential?: string;
};

type GoogleIdentityServices = {
  accounts: {
    id: {
      initialize: (config: {
        client_id: string;
        callback: (response: GoogleCredentialResponse) => void;
        auto_select?: boolean;
        cancel_on_tap_outside?: boolean;
        use_fedcm_for_prompt?: boolean;
      }) => void;
      renderButton: (
        parent: HTMLElement,
        options: {
          type: "standard";
          theme: "outline";
          size: "large";
          text: "continue_with";
          shape: "rectangular";
          width: number;
        }
      ) => void;
    };
  };
};

declare global {
  interface Window {
    google?: GoogleIdentityServices;
  }
}

const GSI_SCRIPT_SRC = "https://accounts.google.com/gsi/client";

let gsiInitializedClientId: string | null = null;
let activeCredentialHandler: ((idToken: string) => void) | null = null;
let activeErrorHandler: ((message: string) => void) | null = null;

function GoogleMark({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="18" height="18" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function ensureGsiScript() {
  const existingScript = document.querySelector<HTMLScriptElement>(
    `script[src="${GSI_SCRIPT_SRC}"]`
  );
  if (existingScript) return;

  const script = document.createElement("script");
  script.src = GSI_SCRIPT_SRC;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}

function initializeGoogleIdentity(clientId: string) {
  if (!window.google) return false;
  if (gsiInitializedClientId === clientId) return true;

  window.google.accounts.id.initialize({
    client_id: clientId,
    auto_select: false,
    cancel_on_tap_outside: true,
    callback: (response) => {
      if (!response.credential) {
        activeErrorHandler?.("Google did not return an ID token.");
        return;
      }
      activeCredentialHandler?.(response.credential);
    },
  });
  gsiInitializedClientId = clientId;
  return true;
}

export default function GoogleAuthButton({
  onCredential,
  onError,
  disabled = false,
}: GoogleAuthButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onCredentialRef = useRef(onCredential);
  const onErrorRef = useRef(onError);
  const [ready, setReady] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim();

  onCredentialRef.current = onCredential;
  onErrorRef.current = onError;

  useEffect(() => {
    const credentialHandler = (idToken: string) => onCredentialRef.current(idToken);
    const errorHandler = (message: string) => onErrorRef.current?.(message);
    activeCredentialHandler = credentialHandler;
    activeErrorHandler = errorHandler;

    return () => {
      if (activeCredentialHandler === credentialHandler) {
        activeCredentialHandler = null;
      }
      if (activeErrorHandler === errorHandler) {
        activeErrorHandler = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!clientId) return;

    let cancelled = false;
    let pollTimer: number | undefined;

    const renderGoogleButton = () => {
      if (cancelled || !containerRef.current) return false;
      if (!initializeGoogleIdentity(clientId)) return false;

      containerRef.current.replaceChildren();
      window.google!.accounts.id.renderButton(containerRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "rectangular",
        width: Math.min(containerRef.current.clientWidth || 400, 400),
      });
      setReady(true);
      return true;
    };

    const tryRenderWhenReady = () => {
      if (cancelled) return;
      if (renderGoogleButton() && pollTimer) {
        window.clearInterval(pollTimer);
      }
    };

    ensureGsiScript();
    pollTimer = window.setInterval(tryRenderWhenReady, 250);
    tryRenderWhenReady();

    return () => {
      cancelled = true;
      if (pollTimer) window.clearInterval(pollTimer);
    };
  }, [clientId]);

  return (
    <div
      className={`relative flex min-h-[40px] w-full justify-center ${
        disabled ? "pointer-events-none opacity-60" : ""
      }`}
    >
      {!ready && (
        <div className="flex h-10 w-full max-w-[400px] items-center justify-center gap-3 rounded-lg border border-[#dadce0] bg-white px-3 text-sm font-medium text-[#3c4043]">
          <GoogleMark />
          <span>Continue with Google</span>
        </div>
      )}
      <div
        ref={containerRef}
        className={`w-full max-w-[400px] ${ready ? "" : "absolute inset-0 opacity-0"}`}
        aria-hidden={!ready}
      />
    </div>
  );
}
