import React, { useMemo, useState } from "react";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";
import { useAppSelector } from "@/app/hooks/redux";
import moment from "moment";
import LiveSubmissionsGraph from "../graphs/LiveSubmissionsGraph";
import AggregateAnalysisGraph from "../graphs/AggregateAnalysisGraph";
import Disclaimer from "@/app/components/shared/Disclaimer";
import { BaseLiveElectionResult } from "@/app/redux/types";

export default function VerifiedSubmissions() {
  const liveElectionState = useAppSelector((state) => state.liveElection);
  const liveElection = liveElectionState.data!;
  const liveElectionDetails = liveElection.electionDetails;
  const liveElectionEndDate = moment(liveElectionDetails.endDate).toDate();

  const [currentLiveResult, setCurrentLiveResult] = useState("");
  const { data: liveResultData } = useMemo(() => {
    const data: Map<string, BaseLiveElectionResult> = new Map();

    if (liveElection) {
      const resultData = liveElection.result!;
      if (Array.isArray(resultData)) {
        const defaultResult = resultData[0];
        const groupRegion = Object.keys(defaultResult).find(
          (rk) => typeof defaultResult[rk] === "string"
        )!;
        resultData.forEach((result) => {
          data.set(result[groupRegion], result);
        });
        setCurrentLiveResult(defaultResult[groupRegion]);
      } else {
        data.set("default", resultData);
        setCurrentLiveResult("default");
      }
    }

    return { data };
  }, [liveElection]);

  return (
    <section>
      <header className="grid gap-1 md:gap-2">
        <h3 className="font-semibold font-league text-brand-500 text-center text-base md:text-xl lg:text-display-xs leading-tight">
          Verified Submissions
        </h3>
        <p className="text-gray-500 text-sm text-center font-light max-w-[672px] mx-auto">
          The verified submissions are real time, admin approved and aggregated polling
          unit results as collectively uploaded by observers and peer reviewed by
          volunteers.
        </p>
      </header>

      <div
        id="live-countdown"
        className="h-[75px] md:h-[112px] w-full relative mt-3 mb-6 md:my-8 overflow-hidden"
      >
        <FlipClockCountdown
          to={liveElectionEndDate}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-fit scale-[0.65] origin-center md:scale-100 !font-mono"
          digitBlockStyle={{
            backgroundColor: "#05A39C",
          }}
          labelStyle={{
            color: "#667085",
            textTransform: "uppercase",
          }}
          labels={["Day(s)", "Hours", "Minutes", "Seconds"]}
          hideOnComplete={false}
        />
      </div>

      {liveElection.result ? (
        <React.Fragment>
          <div className="grid grid-cols-12 gap-5 mb-6 lg:mb-8">
            <div className="md:p-6 md:bg-white rounded-md col-span-12 lg:col-span-7 h-full">
              <LiveSubmissionsGraph
                liveResultData={liveResultData}
                currentLiveResult={currentLiveResult}
                setCurrentLiveResult={setCurrentLiveResult}
                liveElection={liveElection}
              />
            </div>

            <div className="md:p-6 md:bg-white rounded-md col-span-12 lg:col-span-5 h-full">
              <AggregateAnalysisGraph
                liveResultData={liveResultData}
                currentLiveResult={currentLiveResult}
                setCurrentLiveResult={setCurrentLiveResult}
                liveElection={liveElection}
              />
            </div>
          </div>
          <Disclaimer variant="dashboard" />
        </React.Fragment>
      ) : (
        <div className="grid gap-1 mt-12">
          <h3 className="text-gray-700 font-medium leading-tight text-center">
            No data available
          </h3>
          <p className="text-sm text-gray-500 text-center">
            There are currently no available submissions, Please check again later.
          </p>
        </div>
      )}
    </section>
  );
}
