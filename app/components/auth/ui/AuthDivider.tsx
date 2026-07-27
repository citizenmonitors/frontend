import React from "react";

type AuthDividerProps = {
  label: string;
};

export default function AuthDivider({ label }: AuthDividerProps) {
  return (
    <div className="auth-divider flex items-center gap-3 my-6">
      <span className="h-px flex-1 bg-gray-300" />
      <span className="text-[11px] font-medium tracking-wide text-gray-400 uppercase shrink-0">
        {label}
      </span>
      <span className="h-px flex-1 bg-gray-300" />
    </div>
  );
}
