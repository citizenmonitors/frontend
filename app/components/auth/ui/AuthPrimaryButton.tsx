"use client";

import React from "react";

type AuthPrimaryButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  loading?: boolean;
  disabled?: boolean;
};

export default function AuthPrimaryButton({
  children,
  onClick,
  type = "button",
  loading = false,
  disabled = false,
}: AuthPrimaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className="auth-primary-btn w-full h-[52px] rounded-full bg-brand-500 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          Please wait…
        </>
      ) : (
        children
      )}
    </button>
  );
}
