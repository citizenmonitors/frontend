import React from "react";
import { Profile } from "iconsax-react";

type CandidateAvatarPlaceholderProps = {
  size?: number;
  className?: string;
};

/** Neutral avatar placeholder — used until real candidate photos are available */
export default function CandidateAvatarPlaceholder({
  size = 48,
  className = "",
}: CandidateAvatarPlaceholderProps) {
  const iconSize = Math.round(size * 0.45);
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-400 ring-1 ring-brand-100 ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <Profile size={iconSize} variant="Bold" />
    </span>
  );
}
