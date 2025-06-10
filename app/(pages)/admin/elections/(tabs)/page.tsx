"use client";
import ElectionCard from "@/app/components/admin/elections/ElectionCard";
import ElectionsTabs from "@/app/components/admin/elections/ElectionsTabs";
import EmptyElectionsPage from "@/app/components/portal/elections/EmptyElectionsPage";
import { useAppSelector } from "@/app/hooks/redux";
import sortByElectionType from "@/app/utils/sortByElectionType";
import moment from "moment";
import React from "react";

export default function Elections() {
  const { elections } = useAppSelector((state) => state.adminElection);
  const today = moment(new Date()).format("YYYY-MM-DD");
  const onGoingElections = elections.filter(
    (election) => election.startDate <= today && election.endDate >= today
  );

  return (
    <React.Fragment>
      <ElectionsTabs />
      {onGoingElections.length > 0 ? (
        <React.Fragment>
          <div className="election-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 place-items-center">
            {sortByElectionType(onGoingElections).map((election) => (
              <ElectionCard key={election._id} election={election} />
            ))}
          </div>
        </React.Fragment>
      ) : (
        <EmptyElectionsPage />
      )}
    </React.Fragment>
  );
}
