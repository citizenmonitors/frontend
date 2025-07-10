import ElectionCardBg from "@/app/components/shared/svg/ElectionCardBg";
import ElectionIcon from "@/app/components/shared/ElectionIcon";
import { Election } from "@/app/redux/types";
import getElectionName from "@/app/utils/getElectionName";
import React from "react";
import MockTag from "../../shared/MockTag";

type BaseElectionCardProps = {
	election: Election;
	detailed?: boolean;
	onClick?: () => void;
	tag?: React.ReactElement | string;
	style?: React.CSSProperties;
};

export default function BaseElectionCard({
	election,
	onClick,
	style,
	tag,
}: BaseElectionCardProps) {
	return (
		<article
			className={`
				group/election-card p-3 md:p-4 h-40 w-40 md:h-[220px] md:w-[220px] xl:h-[240px] xl:w-[240px] rounded-xl border shadow transition-all duration-500 hover:bg-brand-500 hover:shadow-lg shadow-gray-900/[0.05] relative overflow-hidden flex items-end cursor-pointer
       ${election.mockElection ? "border-warning-400 bg-warning-25 " : "border-gray-300 bg-white "}
			`}
			style={style}
			onClick={onClick}
		>
			{/* Tags */}
			{tag && <div className="absolute top-3 left-3 z-10">{tag}</div>}

			<div className="absolute flex flex-col justify-center items-center gap-2 top-2 right-2">
				<ElectionIcon electionType={election.electionType} />
				{election.mockElection && <MockTag />}
			</div>
			<div className="absolute top-3 left-3 scale-110 origin-top-left">
				<ElectionCardBg />
			</div>
			<h2 className="font-league font-semibold text-lg md:text-display-xs xl:text-display-sm leading-[1.1] text-gray-700 group-hover/election-card:text-white transition-all duration-300">
				{getElectionName(election, "detailed", { showMock: false })}
			</h2>
		</article>
	);
}
