import ElectionCardBg from "@/app/components/shared/svg/ElectionCardBg";
import ElectionIcon from "@/app/components/shared/ElectionIcon";
import { Election } from "@/app/redux/types";
import getElectionName from "@/app/utils/getElectionName";
import React from "react";

type BaseElectionCardProps = {
  election: Election;
  onClick?: () => void;
  tag?: React.ReactElement | string;
  style?: React.CSSProperties;
};

export default function BaseElectionCard({
  election,
  onClick,
  tag,
  style,
}: BaseElectionCardProps) {
  return (
    <article
      className="group/election-card p-3 md:p-4 h-40 w-40 md:h-[220px] md:w-[220px] xl:h-[240px] xl:w-[240px] rounded-xl border border-gray-300 shadow transition-all duration-500 hover:bg-brand-500 hover:shadow-lg shadow-gray-900/[0.05] bg-white relative overflow-hidden flex items-end cursor-pointer"
      style={style}
      onClick={onClick}
    >
      {tag ? (
        <div className="result-count absolute top-3 left-3 text-sm md:text-sm text-error-600 font-medium">
          {tag}
        </div>
      ) : null}
      <div className="absolute top-2 right-2">
        <ElectionIcon electionType={election.electionType} />
      </div>
      <div className="absolute top-3 left-3 scale-110 origin-top-left">
        <ElectionCardBg />
      </div>
      <h2 className="font-league font-semibold text-lg md:text-display-xs xl:text-display-sm leading-[1.1] text-gray-700 group-hover/election-card:text-white transition-all duration-300">
        {getElectionName(election, "short")}
      </h2>
    </article>
  );
}
