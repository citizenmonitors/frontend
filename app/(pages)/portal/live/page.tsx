"use client";
import { useAppSelector } from "@/app/hooks/redux";
import { SliderVertical1 } from "iconsax-react";
import moment from "moment";
import React from "react";
import EmptyElectionsPage from "../../../components/portal/elections/EmptyElectionsPage";
import LiveCard from "../../../components/portal/live/LiveCard";
import { Spin } from "antd";
import sortByElectionType from "@/app/utils/sortByElectionType";

export default function Live() {
  const electionState = useAppSelector((state) => state.election);
  const elections = electionState.elections;

  const today = moment(new Date()).format("YYYY-MM-DD");
  const liveElections = elections.filter(
    (election) => election.startDate <= today && election.endDate >= today
  );

  return (
    <div>
      <header className="flex gap-3 md:items-center mb-1 md:mb-2">
        <SliderVertical1
          size={30}
          variant="Bold"
          className="text-error-600 lg:w-10 lg:h-10"
        />
        <h2 className="font-league text-display-xs text-gray-700 font-semibold leading-[1.1] lg:text-display-base">
          Live
        </h2>
      </header>
      <p className="text-sm text-gray-500 lg:text-base mb-6 md:mb-7">
        See real-time updates on the ongoing elections. Select an election to view submission
        counts and aggregate analysis.
      </p>

      {electionState.status.fetchElections === "pending" ? (
        <div className="h-[50vh] grid place-content-center">
          <Spin size="large" />
        </div>
      ) : liveElections.length > 0 ? (
        <div
          id="live-elections-grid"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 place-items-center"
        >
          {sortByElectionType(liveElections).map((election) => (
            <LiveCard key={election._id} election={election} />
          ))}
        </div>
      ) : (
        <EmptyElectionsPage />
      )}
    </div>
  );
}
