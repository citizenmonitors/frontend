"use client";
import { resourceVideos } from "@/app/components/landing/resources/data";
import ElectionCard from "@/app/components/portal/elections/ElectionCard";
import EmptyElectionsPage from "@/app/components/portal/elections/EmptyElectionsPage";
import SuggestionPopup from "@/app/components/shared/SuggestionPopup";
import { useAppSelector } from "@/app/hooks/redux";
import sortByElectionType from "@/app/utils/sortByElectionType";
import moment from "moment";
import React from "react";

export default function Elections() {
  const elections = useAppSelector((state) => state.election.elections);
  // const today = moment(new Date()).format("YYYY-MM-DD");
  // const onGoingElections = elections.filter(
  //   (election) => election.startDate <= today && election.endDate >= today
  // );


  const today = moment.utc(); // use UTC to match backend timestamps

  const onGoingElections = elections.filter((election) => {
    const start = moment.utc(election.startDate);
    const end = moment.utc(election.endDate);

    const isOngoing = today.isBetween(start, end, "day", "[]");

    return isOngoing;
  });

  return onGoingElections.length > 0 ? (
    <div className="election-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 place-items-center">
      {sortByElectionType(onGoingElections).map((election) => (
        <ElectionCard key={election._id} election={election} />
      ))}
      <SuggestionPopup
        id="elections"
        suggestion="Watch Tutorial Video"
        title="Uploading Election Data or Incident Reports"
        video={resourceVideos[3]}
      />
    </div>
  ) : (
    <EmptyElectionsPage />
  );
}
