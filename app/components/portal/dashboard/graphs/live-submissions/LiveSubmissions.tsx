import React, { useMemo, useState } from "react";
import LiveSubmissionsData from "./LiveSubmissionsData";
import AggregateAnalysis from "./AggregateAnalysis";
import { useAppSelector } from "@/app/hooks/redux";
import { Spin } from "antd";
import { BaseLiveElectionResult } from "@/app/redux/types";

export default function LiveSubmissions() {
  const activityState = useAppSelector((state) => state.activity);
  const activityLiveElection = activityState.activityLiveResult;

  const [currentActivityLiveResult, setCurrentActivityLiveResult] = useState("");
  const { data: activityLiveResultData } = useMemo(() => {
    const data: Map<string, BaseLiveElectionResult> = new Map();

    if (activityLiveElection) {
      const resultData = activityLiveElection.result!;
      if (Array.isArray(resultData)) {
        const defaultResult = resultData[0];
        const groupRegion = Object.keys(defaultResult).find(
          (rk) => typeof defaultResult[rk] === "string"
        )!;
        resultData.forEach((result) => {
          data.set(result[groupRegion], result);
        });
        setCurrentActivityLiveResult(defaultResult[groupRegion]);
      } else {
        data.set("default", resultData);
        setCurrentActivityLiveResult("default");
      }
    }

    return { data };
  }, [activityLiveElection]);

  return (
    <div className="grid grid-cols-12 gap-[20px] py-4">
      {activityState.status.fetchSingleLiveResult === "pending" ? (
        <div className="text-gray-400 text-sm text-center col-span-12 grid place-content-center bg-white md:p-4 xl:p-7 md:bg-white rounded">
          <Spin size="large" className="col-span-12" />
        </div>
      ) : !activityLiveElection?.result ? (
        <div className="text-gray-400 text-sm text-center col-span-12 grid place-content-center bg-white md:p-4 xl:p-7 md:bg-white rounded">
          No elections are being held live
        </div>
      ) : (
        <>
          <div className="col-span-12 rounded live-container xl:col-span-7 md:p-4 xl:p-7 md:bg-white">
            <LiveSubmissionsData
              activityLiveResultData={activityLiveResultData}
              currentActivityLiveResult={currentActivityLiveResult!}
              setCurrentActivityLiveResult={setCurrentActivityLiveResult}
            />
          </div>
          <div className="col-span-12 rounded aggregate-analysis-container xl:col-span-5 md:p-4 xl:p-7 md:bg-white">
            <AggregateAnalysis
              singleLiveResultData={activityLiveResultData}
              activeSingleLiveResult={currentActivityLiveResult!}
            />
          </div>
        </>
      )}
    </div>
  );
}
