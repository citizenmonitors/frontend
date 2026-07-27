"use client";

import { Eye, EyeSlash, Lock1, Sms } from "iconsax-react";
import React from "react";

type AuthFieldProps = {
  id: string;
  label: string;
  type?: "email" | "password" | "text";
  name?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  required?: boolean;
  showPasswordToggle?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
};

export default function AuthField({
  id,
  label,
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  autoComplete,
  required,
  showPasswordToggle,
  showPassword,
  onTogglePassword,
}: AuthFieldProps) {
  const inputType =
    type === "password" && showPasswordToggle && showPassword ? "text" : type;
  const PrefixIcon = type === "password" ? Lock1 : Sms;

  return (
    <div className="auth-field grid gap-2">
      <label htmlFor={id} className="text-sm font-semibold text-gray-800">
        {label}
      </label>
      <div className="auth-field-input relative flex items-center">
        <PrefixIcon
          size={18}
          className="pointer-events-none absolute left-4 text-gray-400"
          variant="Linear"
        />
        <input
          id={id}
          name={name ?? id}
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          className="auth-input w-full h-[52px] rounded-2xl border border-gray-300 bg-white pl-11 pr-11 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-colors hover:border-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10"
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-4 text-gray-400 transition-colors hover:text-gray-600"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <Eye size={18} variant="Bold" />
            ) : (
              <EyeSlash size={18} variant="Bold" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
