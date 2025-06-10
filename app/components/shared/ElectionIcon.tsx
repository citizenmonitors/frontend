import Image from "next/image";
import React from "react";

type ElectionIconProps = {
  electionType?: string;
  style?: React.CSSProperties;
};

export default function ElectionIcon({ electionType, style }: ElectionIconProps) {
  const defaultElectionIcon = "/assets/elections/presidential.svg";
  const electionIconMap = {
    "house-of-representatives": "/assets/elections/house-of-representatives.svg",
    senatorial: "/assets/elections/senatorial.svg",
    presidential: "/assets/elections/presidential.svg",
  } as const;
  const icon =
    electionIconMap[electionType as keyof typeof electionIconMap] || defaultElectionIcon;

  return (
    <div className="min-w-[36px] md:min-w-[48px] xl:min-w-[60px]" style={style}>
      <Image
        src={icon}
        alt="Election Icon"
        width={60}
        height={60}
        className="w-[36px] md:w-[48px] xl:w-[60px] h-auto"
        style={style}
      />
    </div>
  );
}
