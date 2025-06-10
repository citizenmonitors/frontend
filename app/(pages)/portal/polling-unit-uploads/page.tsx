"use client";
import { useAppSelector } from "@/app/hooks/redux";
import { Spin } from "antd";
import React, { useMemo } from "react";
import PollingUnitUploadsDisplay from "../../../components/portal/polling-unit-uploads/PollingUnitUploadsDisplay";

export default function PollingUnitUploads() {
  const electionState = useAppSelector((state) => state.election);
  const pollingUnitResultsEmpty = useMemo(() => {
    return (
      electionState.pollingUnitResults.results.length === 0 &&
      electionState.pollingUnitResults.reports.length === 0
    );
  }, [electionState.pollingUnitResults]);

  return (
    <React.Fragment>
      {electionState.status.fetchPollingUnitResults === "pending" &&
      pollingUnitResultsEmpty ? (
        <div className="h-[50vh] grid place-content-center">
          <Spin size="large" />
        </div>
      ) : (
        <PollingUnitUploadsDisplay />
      )}
    </React.Fragment>
  );
}
