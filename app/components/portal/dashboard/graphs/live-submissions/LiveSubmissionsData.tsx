import { useAppSelector } from "@/app/hooks/redux";
import { Select } from "antd";
import { SliderVertical } from "iconsax-react";
import React from "react";
import ElectionSubmissionsBarChart from "../../../shared/charts/ElectionSubmissionsBarChart";
import formatString from "@/app/utils/formatString";
import { BaseLiveElectionResult } from "@/app/redux/types";

type LiveSubmissionsDataProps = {
  activityLiveResultData: Map<string, BaseLiveElectionResult>;
  currentActivityLiveResult: string;
  setCurrentActivityLiveResult: React.Dispatch<React.SetStateAction<string>>;
};
export default function LiveSubmissionsData({
  activityLiveResultData,
  currentActivityLiveResult,
  setCurrentActivityLiveResult,
}: LiveSubmissionsDataProps) {
  const activityLiveResult = activityLiveResultData.get(currentActivityLiveResult)!;
  const {
    electionDetails: { electionName },
    partyColors,
  } = useAppSelector((state) => state.activity.activityLiveResult!);

  return (
    <React.Fragment>
      <hr className="mb-4 border-gray-100 md:hidden" />
      <header className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-2">
          <SliderVertical variant="Bold" className="text-error-600 md:hidden" size={16} />
          <SliderVertical
            variant="Bold"
            className="hidden text-error-600 md:block"
            size={20}
          />
          <h3 className="text-sm text-gray-700 md:text-lg">
            {electionName} Live Submissions
          </h3>
        </div>
        {activityLiveResultData.size > 1 ? (
          <div className="flex items-center font-light">
            <span className="hidden text-sm md:inline-block">Showing for:</span>
            <Select
              value={currentActivityLiveResult}
              onChange={(value) => setCurrentActivityLiveResult(value)}
              options={Array.from(activityLiveResultData).map(([s]) => ({
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
      <ElectionSubmissionsBarChart liveResult={activityLiveResult} partyColors={partyColors} />
    </React.Fragment>
  );
}
