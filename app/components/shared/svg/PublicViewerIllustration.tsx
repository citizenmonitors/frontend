import React from "react";

function PublicViewerIllustration({ active }: { active?: boolean }) {
  const accent = active ? "#05A39C" : "#98A2B3";

  return (
    <svg
      width="151"
      height="178"
      viewBox="0 0 151 178"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="34"
        y="18"
        width="82"
        height="58"
        rx="6"
        stroke={accent}
        strokeWidth="1.5"
      />
      <rect x="42" y="28" width="66" height="8" rx="2" fill={accent} opacity="0.35" />
      <rect x="42" y="42" width="20" height="24" rx="2" fill="#E4E7EC" />
      <rect x="66" y="42" width="20" height="24" rx="2" fill="#E4E7EC" />
      <rect x="90" y="42" width="18" height="24" rx="2" fill="#E4E7EC" />
      <path d="M46 58H58V62H46V58Z" fill={accent} />
      <path d="M70 58H82V62H70V58Z" fill="#D0D5DD" />
      <path d="M94 58H104V62H94V58Z" fill="#D0D5DD" />

      <circle cx="52" cy="112" r="22" stroke={accent} strokeWidth="1.5" />
      <circle cx="99" cy="112" r="22" stroke={accent} strokeWidth="1.5" />
      <path
        d="M40 150C44 132 48 124 52 124C56 124 60 132 64 150"
        stroke="#263238"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M87 150C91 132 95 124 99 124C103 124 107 132 111 150"
        stroke="#263238"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <rect x="47" y="118" width="10" height="16" rx="2" fill="#263238" />
      <rect x="94" y="118" width="10" height="16" rx="2" fill="#263238" />
      <rect x="45" y="136" width="14" height="3" rx="1.5" fill={accent} />
      <rect x="92" y="136" width="14" height="3" rx="1.5" fill={accent} />

      <path
        d="M8 36C12 24 18 18 24 18"
        stroke={accent}
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M143 36C139 24 133 18 127 18"
        stroke={accent}
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}

export default PublicViewerIllustration;
