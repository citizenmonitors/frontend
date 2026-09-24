"use client";

import React from "react";

type PulseActionButtonProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
};

/** Post action with visible hover name that does not block clicks */
export default function PulseActionButton({
  label,
  onClick,
  disabled = false,
  className = "",
  children,
}: PulseActionButtonProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (disabled) return;
        onClick();
      }}
      className={`group relative inline-flex min-h-10 items-center gap-1.5 rounded-full px-2 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-[11px] font-semibold text-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        {label}
      </span>
    </button>
  );
}
