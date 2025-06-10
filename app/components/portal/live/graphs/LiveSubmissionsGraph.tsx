import formatNumber from "@/app/utils/formatNumber";
import { SliderVertical } from "iconsax-react";
import React, { useMemo, useState } from "react";
import { BaseLiveElectionResult, LiveElection } from "@/app/redux/types";
import getElectionName from "@/app/utils/getElectionName";
import ElectionSubmissionsBarChart from "../../shared/charts/ElectionSubmissionsBarChart";
import { Select } from "antd";
import formatString from "@/app/utils/formatString";

type LiveSubmissionsGraphProps = {
  liveElection: LiveElection;
  liveResultData: Map<string, BaseLiveElectionResult>;
  currentLiveResult: string;
  setCurrentLiveResult: React.Dispatch<React.SetStateAction<string>>;
};

export default function LiveSubmissionsGraph({
  liveElection,
  liveResultData,
  currentLiveResult,
  setCurrentLiveResult,
}: LiveSubmissionsGraphProps) {
  const {
    electionDetails: { electionName },
    partyColors,
  } = liveElection;

  const liveResult = liveResultData.get(currentLiveResult)!;

  return (
    <React.Fragment>
      <hr className="mb-4 border-gray-100 md:hidden" />
      <header className="flex justify-between items-center mb-10">
        <div className="flex gap-2 items-center">
          <SliderVertical variant="Bold" className="text-error-600 md:hidden" size={16} />
          <SliderVertical
            variant="Bold"
            className="text-error-600 hidden md:block fill-brand-25/25"
            size={20}
          />
          <h3 className="text-sm md:text-lg text-gray-700">
            {electionName} Live Submissions
          </h3>
        </div>
        {liveResultData.size > 1 ? (
          <div className="flex items-center font-light">
            <span className="hidden text-sm md:inline-block">Showing for:</span>
            <Select
              value={currentLiveResult}
              onChange={(value) => setCurrentLiveResult(value)}
              options={Array.from(liveResultData).map(([s]) => ({
                label: formatString.normalCase(s),
                value: s,
              }))}
              size="small"
              variant="borderless"
              labelRender={(option) => (
                <span className="text-brand-500 text-sm">{option.label}</span>
              )}
              dropdownStyle={{ minWidth: "128px" }}
            />
          </div>
        ) : null}
      </header>
      <ElectionSubmissionsBarChart liveResult={liveResult} partyColors={partyColors} />
    </React.Fragment>
  );
}
