import React from "react";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";
import { useAppSelector } from "@/app/hooks/redux";
import moment from "moment";
import Disclaimer from "@/app/components/shared/Disclaimer";
import LiveIncidentReportsGraph from "@/app/components/portal/live/graphs/LiveIncidentReportsGraph";

export default function IncidentReports() {
  const electionData = useAppSelector((state) => state.adminElection.electionData)!;
  const electionEndDate = moment(electionData.electionDetails.endDate).toDate();

  return (
    <section>
      <header className="grid gap-1 md:gap-2">
        <h3 className="font-semibold font-league text-brand-500 text-center text-base md:text-xl lg:text-display-xs leading-tight">
          Incident Reports
        </h3>
        <p className="text-gray-500 text-sm text-center font-light max-w-[672px] mx-auto">
          The verified submissions are real time, admin approved and aggregated polling
          unit incidents as collectively uploaded by observers and peer reviewed by
          volunteers
        </p>
      </header>

      <div
        id="live-countdown"
        className="h-[75px] md:h-[112px] w-full relative mt-3 mb-6 md:my-8 overflow-hidden"
      >
        <FlipClockCountdown
          to={electionEndDate}
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

      {electionData.incidentReport && electionData.incidentReport.chart.length ? (
        <React.Fragment>
          <LiveIncidentReportsGraph liveElection={electionData} />
          <Disclaimer variant="dashboard" />
        </React.Fragment>
      ) : (
        <div className="grid gap-1 mt-12">
          <h3 className="text-gray-700 font-medium leading-tight text-center">
            No data available
          </h3>
          <p className="text-sm text-gray-500 text-center">
            There are currently no available incident reports, Please check again later.
          </p>
        </div>
      )}
    </section>
  );
}
